"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Loader2, Dumbbell, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { appleEasing } from "../animations/MotionWrapper";
import { TaskItem, TaskPriority } from "@/types";
import { apiRequest } from "@/lib/api";
import { useToast } from "../ui/Toast";

interface GymEditorModalProps {
  isOpen: boolean;
  task: TaskItem | null;
  onClose: () => void;
  onWorkoutUpdated: (updatedTask: TaskItem) => void;
}

export function GymEditorModal({
  isOpen,
  task,
  onClose,
  onWorkoutUpdated,
}: GymEditorModalProps) {
  const [exercise, setExercise] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("");
  const [sets, setSets] = useState(4);
  const [reps, setReps] = useState(10);
  const [duration, setDuration] = useState(30);
  const [priority, setPriority] = useState<TaskPriority>("high");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (task) {
      setExercise(task.gym?.exercise || task.title || "");
      setMuscleGroup(task.gym?.muscleGroup || "Fitness");
      setSets(task.gym?.sets ?? 4);
      setReps(task.gym?.reps ?? 10);
      setDuration(task.gym?.duration ?? 30);
      setPriority(task.priority || "high");
      setNotes(task.description || "");
    }
  }, [task]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;
    const cleanExercise = exercise.trim();
    if (!cleanExercise) {
      showToast("Exercise name cannot be empty.", "error");
      return;
    }

    setLoading(true);
    try {
      const updatedTitle = `${cleanExercise} (${muscleGroup.trim() || "General"})`;
      const res = await apiRequest<{ success: boolean; task: TaskItem }>(
        `/api/tasks/${task.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            title: updatedTitle,
            description: notes.trim() || `${sets} sets × ${reps} reps target session`,
            priority,
            category: "Gym",
            gym: {
              exercise: cleanExercise,
              muscleGroup: muscleGroup.trim() || "General",
              sets: Number(sets),
              reps: Number(reps),
              duration: Number(duration),
            },
          }),
        }
      );

      if (res.success && res.data?.task) {
        onWorkoutUpdated(res.data.task);
        showToast("Workout routine updated successfully.", "success");
        onClose();
      } else {
        showToast(res.error || "Failed to update workout.", "error");
      }
    } catch {
      showToast("Error updating workout.", "error");
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
                <div className="w-8 h-8 rounded-xl bg-warm-light text-warm flex items-center justify-center">
                  <Dumbbell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-text-primary tracking-tight">
                    Edit Workout Directive
                  </h3>
                  <p className="text-[11px] text-text-secondary">
                    Customize exercise mechanics, volume, and willpower rewards.
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
                    Exercise Name
                  </label>
                  <input
                    type="text"
                    required
                    value={exercise}
                    onChange={(e) => setExercise(e.target.value)}
                    placeholder="e.g. Barbell Squats"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-divider bg-slate-50 text-text-primary text-xs font-semibold focus:bg-white outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-text-secondary mb-1 uppercase tracking-wider">
                    Muscle Group
                  </label>
                  <input
                    type="text"
                    value={muscleGroup}
                    onChange={(e) => setMuscleGroup(e.target.value)}
                    placeholder="e.g. Legs, Chest, Core"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-divider bg-slate-50 text-text-primary text-xs font-semibold focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-text-secondary mb-1 uppercase tracking-wider">
                    Sets
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={sets}
                    onChange={(e) => setSets(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-divider bg-slate-50 text-text-primary text-xs text-center font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-text-secondary mb-1 uppercase tracking-wider">
                    Reps
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={reps}
                    onChange={(e) => setReps(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-divider bg-slate-50 text-text-primary text-xs text-center font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-text-secondary mb-1 uppercase tracking-wider">
                    Duration (Min)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={180}
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-divider bg-slate-50 text-text-primary text-xs text-center font-bold outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-text-secondary mb-1 uppercase tracking-wider">
                    Priority & Willpower Intensity
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-divider bg-slate-50 text-text-primary text-xs font-semibold outline-none"
                  >
                    <option value="high">High Intensity (+70 XP, +35 Coins)</option>
                    <option value="medium">Medium Intensity (+50 XP, +23 Coins)</option>
                    <option value="low">Low / Recovery (+35 XP, +15 Coins)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-text-secondary mb-1 uppercase tracking-wider">
                    Attribute Gain
                  </label>
                  <div className="px-3.5 py-2.5 rounded-xl bg-orange-50/70 border border-orange-200/50 flex items-center justify-between text-xs font-semibold text-warm">
                    <span>Willpower Focus</span>
                    <span className="flex items-center gap-1 text-[11px] font-bold">
                      <Sparkles className="w-3 h-3" /> +1 WIL
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-text-secondary mb-1 uppercase tracking-wider">
                  Workout Notes / Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  maxLength={200}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Progressive overload, rest 90s between sets..."
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
                  disabled={loading || !exercise.trim()}
                  className="flex-1 py-2.5 rounded-full bg-warm hover:bg-warm/90 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>Save Workout</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
