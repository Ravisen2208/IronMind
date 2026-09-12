"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Loader2, Edit3, Dumbbell, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { appleEasing } from "../animations/MotionWrapper";
import { TaskItem, CategoryItem, TaskPriority } from "@/types";
import { apiRequest } from "@/lib/api";
import { useToast } from "../ui/Toast";

interface QuestEditorModalProps {
  isOpen: boolean;
  task: TaskItem | null;
  categories: CategoryItem[];
  onClose: () => void;
  onQuestUpdated: (updatedTask: TaskItem) => void;
}

export function QuestEditorModal({
  isOpen,
  task,
  categories,
  onClose,
  onQuestUpdated,
}: QuestEditorModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Personal");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState("");

  // Gym specific
  const [gymExercise, setGymExercise] = useState("");
  const [gymMuscle, setGymMuscle] = useState("");
  const [gymSets, setGymSets] = useState(4);
  const [gymReps, setGymReps] = useState(10);
  const [gymDuration, setGymDuration] = useState(30);

  // Study specific
  const [studySubject, setStudySubject] = useState("");
  const [studyTopic, setStudyTopic] = useState("");
  const [studyDuration, setStudyDuration] = useState(30);

  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setCategory(task.category || "Personal");
      setPriority(task.priority || "medium");
      setDueDate(task.dueDate || "");

      if (task.gym) {
        setGymExercise(task.gym.exercise || "");
        setGymMuscle(task.gym.muscleGroup || "");
        setGymSets(task.gym.sets ?? 4);
        setGymReps(task.gym.reps ?? 10);
        setGymDuration(task.gym.duration ?? 30);
      } else {
        setGymExercise(task.title || "");
        setGymMuscle("General");
        setGymSets(4);
        setGymReps(10);
        setGymDuration(30);
      }

      if (task.study) {
        setStudySubject(task.study.subject || "");
        setStudyTopic(task.study.topic || "");
        setStudyDuration(task.study.duration ?? 30);
      } else {
        setStudySubject(task.title || "");
        setStudyTopic("Deep Focus");
        setStudyDuration(30);
      }
    }
  }, [task]);

  const isGymQuest = task?.type === "gym" || category.toLowerCase() === "gym" || !!task?.gym;
  const isStudyQuest = task?.type === "study" || category.toLowerCase() === "study" || !!task?.study;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      showToast("Quest title cannot be empty.", "error");
      return;
    }

    setLoading(true);
    try {
      const payload: any = {
        title: cleanTitle,
        description: description.trim(),
        category,
        priority,
        dueDate: dueDate || null,
      };

      if (isGymQuest) {
        payload.gym = {
          exercise: gymExercise.trim() || cleanTitle,
          muscleGroup: gymMuscle.trim() || "Fitness",
          sets: Number(gymSets),
          reps: Number(gymReps),
          duration: Number(gymDuration),
        };
      }

      if (isStudyQuest) {
        payload.study = {
          subject: studySubject.trim() || cleanTitle,
          topic: studyTopic.trim() || "Deep Focus",
          duration: Number(studyDuration),
        };
      }

      const res = await apiRequest<{ success: boolean; task: TaskItem }>(
        `/api/tasks/${task.id}`,
        {
          method: "PATCH",
          body: JSON.stringify(payload),
        }
      );

      if (res.success && res.data?.task) {
        onQuestUpdated(res.data.task);
        showToast("Quest updated successfully.", "success");
        onClose();
      } else {
        showToast(res.error || "Failed to update quest.", "error");
      }
    } catch {
      showToast("Error updating quest.", "error");
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
            className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-surface p-6 sm:p-7 border border-divider shadow-float space-y-5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-accent-light text-accent flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-text-primary tracking-tight">
                    Edit Quest Directive
                  </h3>
                  <p className="text-[11px] text-text-secondary">
                    Modify goals, rewards, or workout/study mechanics.
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-text-secondary hover:text-text-primary hover:bg-slate-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                  Quest Title
                </label>
                <input
                  type="text"
                  required
                  maxLength={120}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-divider bg-slate-50 text-text-primary text-sm focus:bg-white transition-all outline-none"
                />
              </div>

              {/* Gym Custom Section */}
              {isGymQuest && (
                <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-200/60 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-warm uppercase">
                    <Dumbbell className="w-4 h-4" />
                    <span>Gym & Exercise Configuration</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-text-secondary mb-1">
                        Exercise
                      </label>
                      <input
                        type="text"
                        value={gymExercise}
                        onChange={(e) => setGymExercise(e.target.value)}
                        placeholder="e.g. Bench Press"
                        className="w-full px-3 py-2 rounded-xl border border-divider bg-white text-xs font-semibold outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-text-secondary mb-1">
                        Muscle Group
                      </label>
                      <input
                        type="text"
                        value={gymMuscle}
                        onChange={(e) => setGymMuscle(e.target.value)}
                        placeholder="e.g. Chest, Legs"
                        className="w-full px-3 py-2 rounded-xl border border-divider bg-white text-xs font-semibold outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-text-secondary mb-1">Sets</label>
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={gymSets}
                        onChange={(e) => setGymSets(Number(e.target.value))}
                        className="w-full px-2 py-1.5 rounded-xl border border-divider bg-white text-xs text-center font-bold outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-text-secondary mb-1">Reps</label>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={gymReps}
                        onChange={(e) => setGymReps(Number(e.target.value))}
                        className="w-full px-2 py-1.5 rounded-xl border border-divider bg-white text-xs text-center font-bold outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-text-secondary mb-1">Duration (min)</label>
                      <input
                        type="number"
                        min={5}
                        max={180}
                        value={gymDuration}
                        onChange={(e) => setGymDuration(Number(e.target.value))}
                        className="w-full px-2 py-1.5 rounded-xl border border-divider bg-white text-xs text-center font-bold outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Study Custom Section */}
              {isStudyQuest && (
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200/60 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-accent uppercase">
                    <BookOpen className="w-4 h-4" />
                    <span>Study & Focus Configuration</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-text-secondary mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={studySubject}
                        onChange={(e) => setStudySubject(e.target.value)}
                        placeholder="e.g. Data Structures"
                        className="w-full px-3 py-2 rounded-xl border border-divider bg-white text-xs font-semibold outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-text-secondary mb-1">
                        Topic / Chapter
                      </label>
                      <input
                        type="text"
                        value={studyTopic}
                        onChange={(e) => setStudyTopic(e.target.value)}
                        placeholder="e.g. Binary Search"
                        className="w-full px-3 py-2 rounded-xl border border-divider bg-white text-xs font-semibold outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-text-secondary mb-1">
                      Focus Duration (Minutes)
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={360}
                      value={studyDuration}
                      onChange={(e) => setStudyDuration(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-xl border border-divider bg-white text-xs font-bold outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                  Description / Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  maxLength={300}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Notes, targets, or instructions..."
                  className="w-full px-4 py-2 rounded-xl border border-divider bg-slate-50 text-text-primary text-sm focus:bg-white transition-all outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-divider bg-slate-50 text-text-primary text-sm focus:bg-white transition-all outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-divider bg-slate-50 text-text-primary text-sm focus:bg-white transition-all outline-none"
                  >
                    <option value="low">Low (25 XP, 10 Coins)</option>
                    <option value="medium">Medium (40 XP, 18 Coins)</option>
                    <option value="high">High (60 XP, 30 Coins)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                  Due Date (Optional)
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-divider bg-slate-50 text-text-primary text-sm focus:bg-white transition-all outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-full border border-divider text-xs font-semibold text-text-secondary hover:bg-slate-50 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !title.trim()}
                  className="flex-1 py-2.5 rounded-full bg-accent hover:bg-accent-hover text-cream text-xs font-semibold shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
