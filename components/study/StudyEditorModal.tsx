"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Loader2, BookOpen, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { appleEasing } from "../animations/MotionWrapper";
import { TaskItem, TaskPriority } from "@/types";
import { apiRequest } from "@/lib/api";
import { useToast } from "../ui/Toast";

interface StudyEditorModalProps {
  isOpen: boolean;
  task: TaskItem | null;
  onClose: () => void;
  onStudyUpdated: (updatedTask: TaskItem) => void;
}

export function StudyEditorModal({
  isOpen,
  task,
  onClose,
  onStudyUpdated,
}: StudyEditorModalProps) {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState(30);
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (task) {
      setSubject(task.study?.subject || task.title || "");
      setTopic(task.study?.topic || "Deep Focus");
      setDuration(task.study?.duration ?? 30);
      setPriority(task.priority || "medium");
      setNotes(task.description || "");
    }
  }, [task]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;
    const cleanSubject = subject.trim();
    if (!cleanSubject) {
      showToast("Subject name cannot be empty.", "error");
      return;
    }

    setLoading(true);
    try {
      const updatedTitle = `${cleanSubject}: ${topic.trim() || "Deep Focus"}`;
      const res = await apiRequest<{ success: boolean; task: TaskItem }>(
        `/api/tasks/${task.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            title: updatedTitle,
            description: notes.trim() || `Deep focus session for ${duration} minutes on ${topic}`,
            priority,
            category: "Study",
            study: {
              subject: cleanSubject,
              topic: topic.trim() || "Deep Focus",
              duration: Number(duration),
            },
          }),
        }
      );

      if (res.success && res.data?.task) {
        onStudyUpdated(res.data.task);
        showToast("Study session updated successfully.", "success");
        onClose();
      } else {
        showToast(res.error || "Failed to update study session.", "error");
      }
    } catch {
      showToast("Error updating study session.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && task && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.25, ease: appleEasing }}
            className="relative z-10 w-full max-w-lg rounded-3xl bg-surface p-6 sm:p-7 border border-divider shadow-float space-y-5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-accent-light text-accent flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-text-primary tracking-tight">
                    Edit Study Directive
                  </h3>
                  <p className="text-[11px] text-text-secondary">
                    Adjust subject mastery, focus duration, and intellect rewards.
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-text-secondary hover:text-text-primary hover:bg-slate-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-text-secondary mb-1 uppercase tracking-wider">
                    Subject / Discipline
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Data Structures & Algorithms"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-divider bg-slate-50 text-text-primary text-xs font-semibold focus:bg-white outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-text-secondary mb-1 uppercase tracking-wider">
                    Topic / Sub-skill
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Graph Traversal, Indexing"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-divider bg-slate-50 text-text-primary text-xs font-semibold focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-text-secondary mb-1 uppercase tracking-wider">
                    Target Focus Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={360}
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-divider bg-slate-50 text-text-primary text-xs font-semibold focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-text-secondary mb-1 uppercase tracking-wider">
                    Priority Level
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-divider bg-slate-50 text-text-primary text-xs font-semibold outline-none"
                  >
                    <option value="high">High (+60 XP, +30 Coins)</option>
                    <option value="medium">Medium (+40 XP, +18 Coins)</option>
                    <option value="low">Low (+25 XP, +10 Coins)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-text-secondary mb-1 uppercase tracking-wider">
                  Intellect Reward
                </label>
                <div className="px-3.5 py-2.5 rounded-xl bg-blue-50/70 border border-blue-200/50 flex items-center justify-between text-xs font-semibold text-accent">
                  <span>Intellect Attribute Enhancement</span>
                  <span className="flex items-center gap-1 text-[11px] font-bold">
                    <Sparkles className="w-3 h-3" /> +1 INT
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-text-secondary mb-1 uppercase tracking-wider">
                  Notes & Study Goal (Optional)
                </label>
                <textarea
                  rows={2}
                  maxLength={250}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Solve 3 Leetcode Medium problems without referencing solutions..."
                  className="w-full px-3.5 py-2 rounded-xl border border-divider bg-slate-50 text-text-primary text-xs focus:bg-white outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-full border border-divider text-xs font-semibold text-text-secondary hover:bg-slate-50 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !subject.trim()}
                  className="flex-1 py-2.5 rounded-full bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>Save Study Directive</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
