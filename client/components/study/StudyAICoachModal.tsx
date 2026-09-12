"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  BookOpen,
  Brain,
  CheckCircle2,
  Clock,
  Zap,
  Target,
  X,
  Loader2,
  Plus,
  ArrowRight,
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { TaskItem } from "@/types";

interface StudyAICoachModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (newTask: TaskItem) => void;
}

const POPULAR_SUBJECTS = [
  "Data Structures & Algorithms",
  "System Design & Scalability",
  "Operating Systems & Concurrency",
  "Database Internals & Indexing",
  "Computer Networks & Protocols",
  "Machine Learning & Deep Learning",
];

const PRESET_TOPICS: Record<string, string[]> = {
  "Data Structures & Algorithms": [
    "Dynamic Programming (1D/2D Memoization)",
    "Graph Traversal & Shortest Path (Dijkstra/BFS)",
    "Binary Search Trees & Balancing Invariants",
    "Trie & Suffix Automaton for Strings",
    "Monotonic Queue & Sliding Window Maximum",
  ],
  "System Design & Scalability": [
    "Distributed Caching (Redis/Memcached Strategies)",
    "Database Sharding & Consistent Hashing",
    "Message Queues (Kafka Partitioning & Raft)",
    "Load Balancing & Reverse Proxy Architectures",
  ],
  "Operating Systems & Concurrency": [
    "Virtual Memory & Paging Algorithms",
    "Mutex, Semaphores & Deadlock Prevention",
    "Process vs Thread Scheduling & Context Switching",
  ],
  "Database Internals & Indexing": [
    "B+ Trees vs LSM Trees Storage Engines",
    "ACID Transactions & MVCC Concurrency",
    "Query Execution Plans & Index Optimization",
  ],
};

export function StudyAICoachModal({
  isOpen,
  onClose,
  onAddTask,
}: StudyAICoachModalProps) {
  const { showToast } = useToast();

  const [subject, setSubject] = useState(POPULAR_SUBJECTS[0]);
  const [topic, setTopic] = useState(PRESET_TOPICS[POPULAR_SUBJECTS[0]][0]);
  const [customTopic, setCustomTopic] = useState("");
  const [duration, setDuration] = useState(45);
  const [goal, setGoal] = useState("Master Core Invariants & Real-World Intuition");

  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [studyPlan, setStudyPlan] = useState<{
    studyTitle: string;
    subject: string;
    duration: number;
    keyConcepts: string[];
    milestones: { step: string; task: string }[];
    recommendedTaskTitle: string;
    source?: string;
  } | null>(null);

  const activeTopic = customTopic.trim() || topic;

  const handleSubjectChange = (newSubject: string) => {
    setSubject(newSubject);
    if (PRESET_TOPICS[newSubject] && PRESET_TOPICS[newSubject].length > 0) {
      setTopic(PRESET_TOPICS[newSubject][0]);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setStudyPlan(null);

    try {
      const res = await apiRequest<{
        success: boolean;
        studyTitle: string;
        subject: string;
        duration: number;
        keyConcepts: string[];
        milestones: { step: string; task: string }[];
        recommendedTaskTitle: string;
        source?: string;
      }>("/api/quest-ai/study-plan", {
        method: "POST",
        body: JSON.stringify({
          subject,
          topic: activeTopic,
          durationMinutes: duration,
          goal,
        }),
      });

      if (res.success && res.data) {
        setStudyPlan(res.data);
        if (res.data.source === "gemini-ai") {
          showToast("Gemini AI structured a comprehensive study blueprint!", "success");
        } else {
          showToast("Study blueprint template loaded.", "info");
        }
      } else {
        showToast("Unable to generate study directive.", "error");
      }
    } catch {
      showToast("Error communicating with AI service.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEmbarkQuest = async () => {
    if (!studyPlan) return;

    setAdding(true);
    try {
      const milestonesText = studyPlan.milestones
        ?.map((m) => `• [${m.step}] ${m.task}`)
        .join("\n");

      const payload = {
        title: studyPlan.recommendedTaskTitle || studyPlan.studyTitle,
        description: `Concepts: ${studyPlan.keyConcepts.join(", ")}\n\nBlueprint:\n${milestonesText}`,
        type: "study",
        category: "Study",
        priority: "high",
        study: {
          subject: studyPlan.subject || subject,
          topic: activeTopic,
          duration: studyPlan.duration || duration,
        },
      };

      const res = await apiRequest<{ success: boolean; task: TaskItem }>("/api/tasks", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (res.success && res.data?.task) {
        onAddTask(res.data.task);
        showToast("AI Study Quest embarked! Build your Intellect attribute.", "success");
        onClose();
      } else {
        showToast("Failed to create study quest.", "error");
      }
    } catch {
      showToast("Error creating task. Please try again.", "error");
    } finally {
      setAdding(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-2xl bg-surface border border-divider rounded-3xl shadow-2xl overflow-hidden my-8"
        >
          {/* Header */}
          <div className="p-6 border-b border-divider bg-gradient-to-r from-accent/10 via-warm-light/40 to-transparent flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-accent text-cream flex items-center justify-center shadow-xs">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-heading font-extrabold text-text-primary tracking-tight flex items-center gap-2">
                  Gemini AI Study Architect
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-accent/15 text-accent">
                    Intellect Mastery
                  </span>
                </h3>
                <p className="text-xs text-text-secondary">
                  High-leverage CS & DSA deep focus directives generated by Gemini 1.5 Flash.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-black/5 text-text-muted hover:text-text-primary transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* Subject Selector */}
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-accent" /> Subject Domain
              </label>
              <select
                value={subject}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-divider bg-warm-light/50 text-xs font-semibold text-text-primary focus:bg-white transition-all outline-none"
              >
                {POPULAR_SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Topic Selector / Custom Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-accent" /> Focus Topic
              </label>
              {PRESET_TOPICS[subject] && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {PRESET_TOPICS[subject].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setTopic(t);
                        setCustomTopic("");
                      }}
                      className={`text-[11px] font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                        topic === t && !customTopic
                          ? "bg-accent text-cream border-accent shadow-xs"
                          : "bg-warm-light/40 border-divider/70 text-text-secondary hover:bg-warm-light"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}

              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="Or type a custom topic (e.g. Red-Black Trees, Trie, Redis Raft...)"
                className="w-full px-3.5 py-2 rounded-xl border border-divider bg-warm-light/40 text-xs text-text-primary placeholder:text-text-muted outline-none focus:bg-white transition-all"
              />
            </div>

            {/* Duration Selector */}
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-accent" /> Session Duration: {duration} mins
              </label>
              <div className="flex items-center gap-2">
                {[25, 45, 60, 90].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDuration(mins)}
                    className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all ${
                      duration === mins
                        ? "bg-accent text-white border-accent shadow-xs"
                        : "border-divider bg-warm-light/40 text-text-secondary hover:bg-warm-light"
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className="w-full py-3 px-4 rounded-2xl bg-accent text-cream font-bold text-sm hover:bg-accent-hover active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Gemini AI is designing cognitive study milestones...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Synthesize AI Study Directive</span>
                  </>
                )}
              </button>
            </div>

            {/* Generated Plan Preview */}
            {studyPlan && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-2xl bg-warm-light/70 border border-divider space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-divider/60 pb-3">
                  <div>
                    <h4 className="text-base font-bold text-text-primary tracking-tight">
                      {studyPlan.studyTitle}
                    </h4>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {studyPlan.subject} • {studyPlan.duration} mins deep focus
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent-light text-accent text-xs font-bold shrink-0">
                    <Zap className="w-3 h-3" /> Intellect +2
                  </span>
                </div>

                {/* Key Concepts */}
                <div>
                  <div className="text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
                    Core Invariants & Concepts to Master
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {studyPlan.keyConcepts.map((kc, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-surface border border-divider/80 text-text-primary"
                      >
                        ✓ {kc}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Milestones */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1">
                    Structured Execution Phases
                  </div>
                  {studyPlan.milestones.map((ms, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-surface border border-divider/80 flex items-start gap-2.5 shadow-2xs"
                    >
                      <span className="w-5 h-5 rounded-full bg-accent/15 text-accent text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-text-primary">
                          {ms.step}
                        </div>
                        <div className="text-xs text-text-secondary mt-0.5">
                          {ms.task}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Embark Action */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleEmbarkQuest}
                    disabled={adding}
                    className="w-full py-3 px-4 rounded-xl bg-text-primary text-surface font-bold text-xs hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-60"
                  >
                    {adding ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Embarking on AI Study Quest...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Embark on Quest: {studyPlan.recommendedTaskTitle} (+XP)</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
