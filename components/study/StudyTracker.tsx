"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { TaskItem, CompletionResponse } from "@/types";
import { apiRequest } from "@/lib/api";
import { QuestCard } from "@/components/quests/QuestCard";
import { LevelUpModal } from "@/components/animations/LevelUpModal";
import { useToast } from "@/components/ui/Toast";
import { FadeIn, StaggerContainer, staggerItem } from "@/components/animations/MotionWrapper";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  BookOpen,
  Brain,
  Clock,
  Flame,
  Plus,
  Loader2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const STUDY_PRESETS = [
  { subject: "Data Structures & Algorithms", topic: "Binary Search Trees & Graphs", duration: 45 },
  { subject: "System Design", topic: "Distributed Caching & Sharding", duration: 40 },
  { subject: "Operating Systems", topic: "Concurrency & Memory Management", duration: 30 },
  { subject: "Database Management", topic: "Indexing & Query Optimization", duration: 35 },
  { subject: "Modern Frontend", topic: "React Fiber Architecture & Hooks", duration: 30 },
  { subject: "Deep Learning", topic: "Attention Mechanisms & Transformers", duration: 45 },
  { subject: "Interview Preparation", topic: "Behavioral & Mock Scenarios", duration: 30 },
];

export function StudyTracker() {
  const { userStats, updateLocalStats } = useAuth();
  const { showToast } = useToast();

  const [studyTasks, setStudyTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New Study Form
  const [subject, setSubject] = useState(STUDY_PRESETS[0].subject);
  const [topic, setTopic] = useState(STUDY_PRESETS[0].topic);
  const [duration, setDuration] = useState(30);
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

  const [levelUpState, setLevelUpState] = useState<{ isOpen: boolean; newLevel: number }>({
    isOpen: false,
    newLevel: 1,
  });

  const loadStudyTasks = useCallback(async () => {
    setLoading(true);
    const res = await apiRequest<{ success: boolean; tasks: TaskItem[] }>("/api/tasks?type=study");
    if (res.success && res.data?.tasks) {
      setStudyTasks(res.data.tasks);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadStudyTasks();
  }, [loadStudyTasks]);

  const handleSelectPreset = (p: typeof STUDY_PRESETS[0]) => {
    setSubject(p.subject);
    setTopic(p.topic);
    setDuration(p.duration);
  };

  const handleCreateStudyQuest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const title = `${subject}: ${topic}`;
      const res = await apiRequest<{ success: boolean; task: TaskItem }>("/api/tasks", {
        method: "POST",
        body: JSON.stringify({
          title,
          description: `Deep focus session for ${duration} minutes on ${topic}`,
          type: "study",
          category: "Study",
          priority,
          study: {
            subject,
            topic,
            duration,
          },
        }),
      });

      if (res.success && res.data?.task) {
        setStudyTasks((prev) => [res.data.task, ...prev]);
        setIsFormOpen(false);
        showToast("Study quest embarked!", "success");
      } else {
        showToast(res.error || "Failed to create study quest.", "error");
      }
    } catch {
      showToast("Error creating study quest.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleComplete = (taskId: string, result: CompletionResponse) => {
    setStudyTasks((prev) => prev.map((t) => (t.id === taskId ? result.task : t)));
    updateLocalStats(result.updatedProfile);
    showToast(`Study Session Completed! +${result.progression.xpGained} XP, +1 Intellect`, "success");

    if (result.progression.leveledUp) {
      setLevelUpState({
        isOpen: true,
        newLevel: result.progression.newLevel,
      });
    }
  };

  const handleDelete = (taskId: string) => {
    setStudyTasks((prev) => prev.filter((t) => t.id !== taskId));
    showToast("Study quest deleted.", "info");
  };

  const activeQuests = studyTasks.filter((t) => !t.completed);
  const completedQuests = studyTasks.filter((t) => t.completed);

  // Total study hours
  const totalMinutes = completedQuests.reduce(
    (acc, cur) => acc + (cur.study?.duration || 30),
    0
  );
  const totalHours = (totalMinutes / 60).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Metrics Strip */}
      <StaggerContainer
        staggerDelay={0.08}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={staggerItem} className="p-5 rounded-3xl bg-surface border border-divider/70 shadow-subtle">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-accent-light text-accent flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-accent bg-accent/10 px-2.5 py-0.5 rounded-full">
              Cognitive
            </span>
          </div>
          <div className="mt-3">
            <div className="text-xs uppercase font-bold text-text-secondary">Intellect</div>
            <div className="text-2xl font-bold text-text-primary mt-0.5">
              {userStats?.attributes.intellect ?? 10} pts
            </div>
            <p className="text-[11px] text-text-secondary mt-1">+1 per completed study quest</p>
          </div>
        </motion.div>

        <motion.div variants={staggerItem} className="p-5 rounded-3xl bg-surface border border-divider/70 shadow-subtle">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-success-light text-success flex items-center justify-center">
              <Flame className="w-5 h-5 fill-success/20" />
            </div>
            <span className="text-xs font-bold text-success bg-success-light px-2.5 py-0.5 rounded-full">
              Habit
            </span>
          </div>
          <div className="mt-3">
            <div className="text-xs uppercase font-bold text-text-secondary">Study Streak</div>
            <div className="text-2xl font-bold text-text-primary mt-0.5">
              {userStats?.streak ?? 0} {userStats?.streak === 1 ? "day" : "days"}
            </div>
            <p className="text-[11px] text-text-secondary mt-1">Sustained focus defense</p>
          </div>
        </motion.div>

        <motion.div variants={staggerItem} className="p-5 rounded-3xl bg-surface border border-divider/70 shadow-subtle">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-100/60 px-2.5 py-0.5 rounded-full">
              Time
            </span>
          </div>
          <div className="mt-3">
            <div className="text-xs uppercase font-bold text-text-secondary">Study Hours</div>
            <div className="text-2xl font-bold text-text-primary mt-0.5">
              {totalHours} hrs
            </div>
            <p className="text-[11px] text-text-secondary mt-1">Cumulative verified time</p>
          </div>
        </motion.div>

        <motion.div variants={staggerItem} className="p-5 rounded-3xl bg-surface border border-divider/70 shadow-subtle">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-purple-600 bg-purple-100/60 px-2.5 py-0.5 rounded-full">
              Sessions
            </span>
          </div>
          <div className="mt-3">
            <div className="text-xs uppercase font-bold text-text-secondary">Sessions Done</div>
            <div className="text-2xl font-bold text-text-primary mt-0.5">
              {completedQuests.length}
            </div>
            <p className="text-[11px] text-text-secondary mt-1">Deep work completed</p>
          </div>
        </motion.div>
      </StaggerContainer>

      {/* Action Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-text-primary tracking-tight">
          Deep Focus Directives
        </h2>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="text-xs font-semibold px-4 py-2 rounded-full bg-accent text-white hover:bg-accent-hover transition-all active:scale-95 flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>{isFormOpen ? "Close Form" : "Embark on Study Session"}</span>
        </button>
      </div>

      {/* Study Form Drawer */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCreateStudyQuest}
            className="p-6 rounded-3xl bg-surface border border-divider/70 shadow-subtle space-y-4"
          >
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
              Study Topics & Subject Presets
            </h3>
            <div className="flex flex-wrap gap-2">
              {STUDY_PRESETS.map((p) => (
                <button
                  key={p.subject}
                  type="button"
                  onClick={() => handleSelectPreset(p)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    subject === p.subject
                      ? "bg-accent text-white border-accent font-semibold shadow-sm"
                      : "bg-slate-50 text-text-secondary border-divider hover:bg-slate-100"
                  }`}
                >
                  {p.subject}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-semibold text-text-secondary uppercase mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-divider bg-slate-50 text-text-primary text-xs font-semibold focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-text-secondary uppercase mb-1">
                  Specific Topic
                </label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-divider bg-slate-50 text-text-primary text-xs font-semibold focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-text-secondary uppercase mb-1">
                  Duration (Minutes)
                </label>
                <input
                  type="number"
                  min={10}
                  max={240}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-divider bg-slate-50 text-text-primary text-xs font-semibold outline-none text-center"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-text-secondary uppercase mb-1">
                  Priority Tier
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-divider bg-slate-50 text-text-primary text-xs font-semibold outline-none"
                >
                  <option value="medium">Medium (+50 XP, +23 Coins)</option>
                  <option value="high">High (+70 XP, +35 Coins)</option>
                  <option value="low">Low (+35 XP, +15 Coins)</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-full bg-accent text-white font-semibold text-xs hover:bg-accent-hover transition-all active:scale-95 shadow-sm flex items-center gap-1.5"
              >
                {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                <span>Add Study Quest</span>
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Active Quests */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-text-secondary">
          Active Study Directives ({activeQuests.length})
        </h3>
        {loading ? (
          <div className="h-24 rounded-3xl bg-slate-200 animate-pulse" />
        ) : activeQuests.length === 0 ? (
          <div className="p-8 rounded-3xl bg-surface border border-divider/60 text-center text-sm text-text-secondary">
            No active study quests. Pick a subject from the presets above and start a focus session!
          </div>
        ) : (
          activeQuests.map((t) => (
            <QuestCard
              key={t.id}
              task={t}
              onComplete={handleComplete}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* Completed Study Sessions */}
      {completedQuests.length > 0 && (
        <div className="space-y-3 pt-6 border-t border-divider">
          <h3 className="text-sm font-semibold text-text-secondary">
            Completed Study Sessions ({completedQuests.length})
          </h3>
          {completedQuests.map((t) => (
            <QuestCard
              key={t.id}
              task={t}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Level Up Celebration Modal */}
      <LevelUpModal
        isOpen={levelUpState.isOpen}
        newLevel={levelUpState.newLevel}
        onClose={() => setLevelUpState((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
