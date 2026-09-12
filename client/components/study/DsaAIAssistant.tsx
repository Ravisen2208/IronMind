"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Lightbulb,
  Bug,
  Zap,
  PlusCircle,
  Loader2,
  X,
  CheckCircle2,
  AlertTriangle,
  Code2,
  BookOpen,
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { DsaProblem } from "./DsaCodeStudio";

interface DsaAIAssistantProps {
  currentProblem: DsaProblem;
  userCode: string;
  language: string;
  onAddNewProblem: (problem: DsaProblem) => void;
}

const DSA_TOPICS = [
  "Dynamic Programming (1D / 2D)",
  "Graph Algorithms (BFS/DFS/Dijkstra)",
  "Binary Trees & BST",
  "Sliding Window & Two Pointers",
  "Heaps & Priority Queues",
  "Trie & String Algorithms",
  "Monotonic Stack & Queue",
  "Greedy Algorithms",
  "Backtracking & Recursion",
];

export function DsaAIAssistant({
  currentProblem,
  userCode,
  language,
  onAddNewProblem,
}: DsaAIAssistantProps) {
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"hint" | "bug_check" | "complexity" | "generate">("hint");

  // AI response state
  const [loading, setLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);

  // Generate problem state
  const [genTopic, setGenTopic] = useState(DSA_TOPICS[0]);
  const [genDifficulty, setGenDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [genLoading, setGenLoading] = useState(false);

  const handleRequestAnalysis = async (type: "hint" | "bug_check" | "complexity" | "explain") => {
    setActiveTab(type as any);
    setLoading(true);
    setAiFeedback(null);

    try {
      const res = await apiRequest<{
        success: boolean;
        feedback: string;
        source?: string;
      }>("/api/quest-ai/dsa-hint", {
        method: "POST",
        body: JSON.stringify({
          problemTitle: currentProblem.title,
          description: currentProblem.description,
          userCode,
          language,
          requestType: type,
        }),
      });

      if (res.success && res.data?.feedback) {
        setAiFeedback(res.data.feedback);
        if (res.data.source === "gemini-ai") {
          showToast("Gemini AI analyzed your code!", "success");
        }
      } else {
        showToast("Unable to get AI feedback.", "error");
      }
    } catch {
      showToast("Error communicating with AI service.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCustomProblem = async () => {
    setGenLoading(true);
    try {
      const res = await apiRequest<{
        success: boolean;
        problem: DsaProblem;
        source?: string;
      }>("/api/quest-ai/dsa-problem", {
        method: "POST",
        body: JSON.stringify({
          topic: genTopic,
          difficulty: genDifficulty,
        }),
      });

      if (res.success && res.data?.problem) {
        onAddNewProblem(res.data.problem);
        showToast(`Gemini generated new problem: "${res.data.problem.title}"!`, "success");
        setIsOpen(false);
      } else {
        showToast(res.error || "Failed to generate problem with Gemini.", "error");
      }
    } catch {
      showToast("Error generating problem. Check API key.", "error");
    } finally {
      setGenLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
          if (!aiFeedback && activeTab !== "generate") {
            handleRequestAnalysis("hint");
          }
        }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-accent/20 to-warm-light border border-accent/40 text-accent hover:bg-accent/25 transition-all active:scale-95 shadow-2xs"
        aria-label="Open Gemini AI DSA Mentor"
      >
        <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
        <span>Gemini AI Tutor</span>
      </button>

      {/* Slide-over / Modal Assistant */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-2xl bg-surface border border-divider rounded-3xl shadow-2xl overflow-hidden my-6"
            >
              {/* Header */}
              <div className="p-5 border-b border-divider bg-gradient-to-r from-accent/10 via-warm-light/40 to-transparent flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-accent text-cream flex items-center justify-center shadow-xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-text-primary tracking-tight flex items-center gap-2">
                      Gemini DSA Mentor & Code Inspector
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/15 text-accent uppercase">
                        AI Directive
                      </span>
                    </h3>
                    <p className="text-xs text-text-secondary truncate max-w-md">
                      Analyzing: <span className="font-semibold text-text-primary">{currentProblem.title}</span> ({language.toUpperCase()})
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full hover:bg-black/5 text-text-muted hover:text-text-primary transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-1 p-2 bg-warm-light/50 border-b border-divider overflow-x-auto text-xs font-bold">
                <button
                  onClick={() => handleRequestAnalysis("hint")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                    activeTab === "hint"
                      ? "bg-surface text-accent shadow-xs border border-divider"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Smart Hint</span>
                </button>

                <button
                  onClick={() => handleRequestAnalysis("bug_check")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                    activeTab === "bug_check"
                      ? "bg-surface text-accent shadow-xs border border-divider"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  <Bug className="w-3.5 h-3.5" />
                  <span>Check Bugs & Edge Cases</span>
                </button>

                <button
                  onClick={() => handleRequestAnalysis("complexity")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                    activeTab === "complexity"
                      ? "bg-surface text-accent shadow-xs border border-divider"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Analyze Complexity</span>
                </button>

                <button
                  onClick={() => setActiveTab("generate")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                    activeTab === "generate"
                      ? "bg-surface text-warm shadow-xs border border-divider"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  <PlusCircle className="w-3.5 h-3.5 text-warm" />
                  <span>Generate New Problem</span>
                </button>
              </div>

              {/* Body */}
              <div className="p-5 max-h-[60vh] overflow-y-auto space-y-4">
                {activeTab !== "generate" ? (
                  <div>
                    {loading ? (
                      <div className="py-12 flex flex-col items-center justify-center gap-3 text-text-secondary">
                        <Loader2 className="w-7 h-7 text-accent animate-spin" />
                        <p className="text-xs font-semibold">Gemini 1.5 Flash is inspecting your code & algorithms...</p>
                      </div>
                    ) : aiFeedback ? (
                      <div className="p-4 rounded-2xl bg-warm-light/60 border border-divider text-xs text-text-primary leading-relaxed whitespace-pre-line font-mono">
                        {aiFeedback}
                      </div>
                    ) : (
                      <div className="py-8 text-center text-text-muted text-xs">
                        Select an action above to inspect your algorithm.
                      </div>
                    )}
                  </div>
                ) : (
                  /* Generate New Problem with Gemini Tab */
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-2xl bg-accent-light/50 border border-accent/20 text-xs text-text-primary">
                      <p className="font-bold text-accent mb-1 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> Gemini Dynamic Problem Forge
                      </p>
                      <p className="text-text-secondary text-[11px]">
                        Select a topic and difficulty. Gemini will author a comprehensive LeetCode-style problem complete with starter code in C++, Python, JS, and Java, test cases, and solution explanation!
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">
                          DSA Topic
                        </label>
                        <select
                          value={genTopic}
                          onChange={(e) => setGenTopic(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-divider bg-warm-light/40 text-xs font-semibold text-text-primary outline-none focus:bg-white"
                        >
                          {DSA_TOPICS.map((topic) => (
                            <option key={topic} value={topic}>
                              {topic}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">
                          Difficulty Tier
                        </label>
                        <div className="flex items-center gap-1.5">
                          {(["Easy", "Medium", "Hard"] as const).map((diff) => (
                            <button
                              key={diff}
                              type="button"
                              onClick={() => setGenDifficulty(diff)}
                              className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                                genDifficulty === diff
                                  ? diff === "Easy"
                                    ? "bg-emerald-500 text-white border-emerald-500"
                                    : diff === "Medium"
                                    ? "bg-amber-500 text-white border-amber-500"
                                    : "bg-rose-500 text-white border-rose-500"
                                  : "bg-warm-light/40 border-divider text-text-secondary hover:bg-warm-light"
                              }`}
                            >
                              {diff}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleGenerateCustomProblem}
                      disabled={genLoading}
                      className="w-full py-3 px-4 rounded-2xl bg-accent text-cream font-bold text-xs hover:bg-accent-hover transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
                    >
                      {genLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Forging DSA Problem with Gemini 1.5 Flash...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Forge & Load Problem into Code Studio</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
