"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { TaskItem, CompletionResponse, TaskPriority } from "@/types";
import { apiRequest } from "@/lib/api";
import { QuestCard } from "@/components/quests/QuestCard";
import { LevelUpModal } from "@/components/animations/LevelUpModal";
import { GymEditorModal } from "@/components/gym/GymEditorModal";
import { useToast } from "@/components/ui/Toast";
import { StaggerContainer, staggerItem } from "@/components/animations/MotionWrapper";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dumbbell,
  Flame,
  Award,
  Calendar,
  Plus,
  Loader2,
  CheckCircle2,
  Zap,
  Search,
  SlidersHorizontal,
  BookmarkPlus,
  Trash2,
  Edit3,
  Play,
} from "lucide-react";

export interface WorkoutPreset {
  id: string;
  exercise: string;
  muscleGroup: string;
  sets: number;
  reps: number;
  duration?: number;
  isCustom?: boolean;
}

const DEFAULT_PRESETS: WorkoutPreset[] = [
  { id: "p1", exercise: "Bench Press", muscleGroup: "Chest", sets: 4, reps: 10 },
  { id: "p2", exercise: "Barbell Squats", muscleGroup: "Legs", sets: 4, reps: 8 },
  { id: "p3", exercise: "Deadlifts", muscleGroup: "Back", sets: 3, reps: 6 },
  { id: "p4", exercise: "Overhead Press", muscleGroup: "Shoulders", sets: 3, reps: 10 },
  { id: "p5", exercise: "Pull Ups", muscleGroup: "Upper Back", sets: 3, reps: 12 },
  { id: "p6", exercise: "5km Endurance Run", muscleGroup: "Cardio", sets: 1, reps: 1, duration: 30 },
  { id: "p7", exercise: "Core & Plank Circuit", muscleGroup: "Core", sets: 3, reps: 15, duration: 15 },
  { id: "p8", exercise: "HIIT Sprint Intervals", muscleGroup: "Full Body", sets: 5, reps: 1, duration: 20 },
];

export function GymTracker() {
  const { userStats, updateLocalStats } = useAuth();
  const { showToast } = useToast();

  const [gymTasks, setGymTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"active" | "presets" | "history">("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [muscleFilter, setMuscleFilter] = useState("all");

  // Create Workout Drawer
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New Workout Form State
  const [exercise, setExercise] = useState(DEFAULT_PRESETS[0].exercise);
  const [muscleGroup, setMuscleGroup] = useState(DEFAULT_PRESETS[0].muscleGroup);
  const [sets, setSets] = useState(4);
  const [reps, setReps] = useState(10);
  const [duration, setDuration] = useState(30);
  const [priority, setPriority] = useState<TaskPriority>("high");
  const [notes, setNotes] = useState("");

  // Workout Presets State (stored in localStorage)
  const [presets, setPresets] = useState<WorkoutPreset[]>(DEFAULT_PRESETS);
  const [isCustomPresetModalOpen, setIsCustomPresetModalOpen] = useState(false);
  const [presetFormExercise, setPresetFormExercise] = useState("");
  const [presetFormMuscle, setPresetFormMuscle] = useState("Chest");
  const [presetFormSets, setPresetFormSets] = useState(4);
  const [presetFormReps, setPresetFormReps] = useState(10);
  const [presetFormDuration, setPresetFormDuration] = useState(30);
  const [editingPresetId, setEditingPresetId] = useState<string | null>(null);

  // Edit Workout Task State
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);

  // Level Up Modal
  const [levelUpState, setLevelUpState] = useState<{ isOpen: boolean; newLevel: number }>({
    isOpen: false,
    newLevel: 1,
  });

  // Load custom presets from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ironmind_gym_presets");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPresets(parsed);
        }
      }
    } catch {}
  }, []);

  const savePresets = (newPresets: WorkoutPreset[]) => {
    setPresets(newPresets);
    try {
      localStorage.setItem("ironmind_gym_presets", JSON.stringify(newPresets));
    } catch {}
  };

  const loadGymTasks = useCallback(async () => {
    setLoading(true);
    const res = await apiRequest<{ success: boolean; tasks: TaskItem[] }>("/api/tasks?type=gym");
    if (res.success && res.data?.tasks) {
      setGymTasks(res.data.tasks);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadGymTasks();
  }, [loadGymTasks]);

  const handleSelectPreset = (p: WorkoutPreset) => {
    setExercise(p.exercise);
    setMuscleGroup(p.muscleGroup);
    if (p.sets) setSets(p.sets);
    if (p.reps) setReps(p.reps);
    if (p.duration) setDuration(p.duration);
  };

  const handleQuickLaunchPreset = async (p: WorkoutPreset) => {
    try {
      const title = `${p.exercise} (${p.muscleGroup})`;
      const res = await apiRequest<{ success: boolean; task: TaskItem }>("/api/tasks", {
        method: "POST",
        body: JSON.stringify({
          title,
          description: `${p.sets} sets of ${p.reps} reps workout directive`,
          type: "gym",
          category: "Gym",
          priority: "high",
          gym: {
            exercise: p.exercise,
            muscleGroup: p.muscleGroup,
            sets: p.sets,
            reps: p.reps,
            duration: p.duration || 30,
          },
        }),
      });

      if (res.success && res.data?.task) {
        setGymTasks((prev) => [res.data!.task, ...prev]);
        setActiveTab("active");
        showToast(`Launched "${p.exercise}" workout quest!`, "success");
      }
    } catch {
      showToast("Failed to launch workout preset.", "error");
    }
  };

  const handleCreateGymQuest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const title = `${exercise} (${muscleGroup})`;
      const res = await apiRequest<{ success: boolean; task: TaskItem }>("/api/tasks", {
        method: "POST",
        body: JSON.stringify({
          title,
          description: notes.trim() || `${sets} sets of ${reps} reps target session`,
          type: "gym",
          category: "Gym",
          priority,
          gym: {
            exercise,
            muscleGroup,
            sets,
            reps,
            duration,
          },
        }),
      });

      if (res.success && res.data?.task) {
        setGymTasks((prev) => [res.data!.task, ...prev]);
        setIsFormOpen(false);
        setNotes("");
        showToast("Workout quest embarked!", "success");
      } else {
        showToast(res.error || "Failed to create workout.", "error");
      }
    } catch {
      showToast("Error creating workout.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleComplete = (taskId: string, result: CompletionResponse) => {
    setGymTasks((prev) => prev.map((t) => (t.id === taskId ? result.task : t)));
    updateLocalStats(result.updatedProfile);
    showToast(`Workout Completed! +${result.progression.xpGained} XP, +1 Willpower`, "success");

    if (result.progression.leveledUp) {
      setLevelUpState({
        isOpen: true,
        newLevel: result.progression.newLevel,
      });
    }
  };

  const handleDelete = (taskId: string) => {
    setGymTasks((prev) => prev.filter((t) => t.id !== taskId));
    showToast("Workout removed.", "info");
  };

  const handleWorkoutUpdated = (updatedTask: TaskItem) => {
    setGymTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    setEditingTask(null);
  };

  // Preset Management
  const handleOpenPresetModal = (presetToEdit?: WorkoutPreset) => {
    if (presetToEdit) {
      setEditingPresetId(presetToEdit.id);
      setPresetFormExercise(presetToEdit.exercise);
      setPresetFormMuscle(presetToEdit.muscleGroup);
      setPresetFormSets(presetToEdit.sets);
      setPresetFormReps(presetToEdit.reps);
      setPresetFormDuration(presetToEdit.duration || 30);
    } else {
      setEditingPresetId(null);
      setPresetFormExercise("");
      setPresetFormMuscle("Chest");
      setPresetFormSets(4);
      setPresetFormReps(10);
      setPresetFormDuration(30);
    }
    setIsCustomPresetModalOpen(true);
  };

  const handleSavePreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!presetFormExercise.trim()) return;

    if (editingPresetId) {
      // update
      const updated = presets.map((p) =>
        p.id === editingPresetId
          ? {
              ...p,
              exercise: presetFormExercise.trim(),
              muscleGroup: presetFormMuscle.trim() || "General",
              sets: Number(presetFormSets),
              reps: Number(presetFormReps),
              duration: Number(presetFormDuration),
            }
          : p
      );
      savePresets(updated);
      showToast("Preset routine updated!", "success");
    } else {
      // create new
      const newP: WorkoutPreset = {
        id: `preset_${Date.now()}`,
        exercise: presetFormExercise.trim(),
        muscleGroup: presetFormMuscle.trim() || "General",
        sets: Number(presetFormSets),
        reps: Number(presetFormReps),
        duration: Number(presetFormDuration),
        isCustom: true,
      };
      savePresets([...presets, newP]);
      showToast("Custom routine added!", "success");
    }
    setIsCustomPresetModalOpen(false);
  };

  const handleDeletePreset = (id: string) => {
    const updated = presets.filter((p) => p.id !== id);
    savePresets(updated);
    showToast("Preset deleted.", "info");
  };

  // Filtered lists
  const activeWorkouts = gymTasks.filter((t) => !t.completed);
  const completedWorkouts = gymTasks.filter((t) => t.completed);

  const displayedWorkouts = (activeTab === "history" ? completedWorkouts : activeWorkouts).filter((t) => {
    if (muscleFilter !== "all") {
      if (t.gym?.muscleGroup?.toLowerCase() !== muscleFilter.toLowerCase()) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchEx = t.gym?.exercise?.toLowerCase().includes(q);
      const matchMuscle = t.gym?.muscleGroup?.toLowerCase().includes(q);
      if (!matchTitle && !matchEx && !matchMuscle) return false;
    }
    return true;
  });

  const muscleGroups = Array.from(
    new Set(presets.map((p) => p.muscleGroup).filter(Boolean))
  );

  return (
    <div className="space-y-6">
      {/* 4-Stat Metric Strip */}
      <StaggerContainer
        staggerDelay={0.08}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={staggerItem} className="p-5 rounded-3xl bg-surface border border-divider/70 shadow-subtle">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-warm flex items-center justify-center">
              <Dumbbell className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-warm bg-warm-light px-2.5 py-0.5 rounded-full">
              Physical
            </span>
          </div>
          <div className="mt-3">
            <div className="text-xs uppercase font-bold text-text-secondary">Willpower</div>
            <div className="text-2xl font-bold text-text-primary mt-0.5">
              {userStats?.attributes.willpower ?? 10} pts
            </div>
            <p className="text-[11px] text-text-secondary mt-1">+1 per completed workout</p>
          </div>
        </motion.div>

        <motion.div variants={staggerItem} className="p-5 rounded-3xl bg-surface border border-divider/70 shadow-subtle">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-success-light text-success flex items-center justify-center">
              <Flame className="w-5 h-5 fill-success/20" />
            </div>
            <span className="text-xs font-bold text-success bg-success-light px-2.5 py-0.5 rounded-full">
              Consistency
            </span>
          </div>
          <div className="mt-3">
            <div className="text-xs uppercase font-bold text-text-secondary">Workout Streak</div>
            <div className="text-2xl font-bold text-text-primary mt-0.5">
              {userStats?.streak ?? 0} {userStats?.streak === 1 ? "day" : "days"}
            </div>
            <p className="text-[11px] text-text-secondary mt-1">Daily physical discipline</p>
          </div>
        </motion.div>

        <motion.div variants={staggerItem} className="p-5 rounded-3xl bg-surface border border-divider/70 shadow-subtle">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-accent-light text-accent flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-accent bg-accent-light px-2.5 py-0.5 rounded-full">
              Completed
            </span>
          </div>
          <div className="mt-3">
            <div className="text-xs uppercase font-bold text-text-secondary">Total Finished</div>
            <div className="text-2xl font-bold text-text-primary mt-0.5">
              {completedWorkouts.length} sessions
            </div>
            <p className="text-[11px] text-text-secondary mt-1">Logged in battle records</p>
          </div>
        </motion.div>

        <motion.div variants={staggerItem} className="p-5 rounded-3xl bg-surface border border-divider/70 shadow-subtle">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-amber-600 bg-amber-100/60 px-2.5 py-0.5 rounded-full">
              Active
            </span>
          </div>
          <div className="mt-3">
            <div className="text-xs uppercase font-bold text-text-secondary">Current Queue</div>
            <div className="text-2xl font-bold text-text-primary mt-0.5">
              {activeWorkouts.length} quests
            </div>
            <p className="text-[11px] text-text-secondary mt-1">Ready for execution</p>
          </div>
        </motion.div>
      </StaggerContainer>

      {/* Main Controls: Navigation Tabs & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 rounded-2xl bg-surface border border-divider/70 shadow-subtle">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl">
          <button
            onClick={() => setActiveTab("active")}
            className={`text-xs font-bold px-4 py-2 rounded-lg transition-all ${
              activeTab === "active"
                ? "bg-white text-text-primary shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Active Workouts ({activeWorkouts.length})
          </button>
          <button
            onClick={() => setActiveTab("presets")}
            className={`text-xs font-bold px-4 py-2 rounded-lg transition-all ${
              activeTab === "presets"
                ? "bg-white text-text-primary shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Routines & Presets ({presets.length})
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`text-xs font-bold px-4 py-2 rounded-lg transition-all ${
              activeTab === "history"
                ? "bg-white text-text-primary shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            History ({completedWorkouts.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "presets" && (
            <button
              onClick={() => handleOpenPresetModal()}
              className="text-xs font-semibold px-4 py-2 rounded-full border border-divider hover:bg-slate-50 text-text-primary transition-all active:scale-95 flex items-center gap-1.5"
            >
              <BookmarkPlus className="w-3.5 h-3.5 text-warm" />
              <span>Add Custom Routine</span>
            </button>
          )}

          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="text-xs font-semibold px-4 py-2 rounded-full bg-warm text-white hover:bg-warm/90 transition-all active:scale-95 flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{isFormOpen ? "Close Form" : "Log New Workout"}</span>
          </button>
        </div>
      </div>

      {/* Workout Form Drawer */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCreateGymQuest}
            className="p-6 rounded-3xl bg-surface border border-divider/70 shadow-subtle space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                Select Quick Preset or Custom Exercise
              </h3>
              <span className="text-[11px] text-text-secondary">Click preset to populate fields</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {presets.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPreset(p)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    exercise === p.exercise
                      ? "bg-warm text-white border-warm font-semibold shadow-sm"
                      : "bg-slate-50 text-text-secondary border-divider hover:bg-slate-100"
                  }`}
                >
                  {p.exercise} {p.isCustom && "★"}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-semibold text-text-secondary uppercase mb-1">
                  Exercise
                </label>
                <input
                  type="text"
                  required
                  value={exercise}
                  onChange={(e) => setExercise(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-divider bg-slate-50 text-text-primary text-xs font-semibold focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-text-secondary uppercase mb-1">
                  Muscle Group
                </label>
                <input
                  type="text"
                  value={muscleGroup}
                  onChange={(e) => setMuscleGroup(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-divider bg-slate-50 text-text-primary text-xs font-semibold focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-text-secondary uppercase mb-1">
                  Sets & Reps
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={sets}
                    onChange={(e) => setSets(Number(e.target.value))}
                    className="w-1/2 px-2 py-2 rounded-xl border border-divider bg-slate-50 text-text-primary text-xs text-center font-semibold outline-none"
                  />
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={reps}
                    onChange={(e) => setReps(Number(e.target.value))}
                    className="w-1/2 px-2 py-2 rounded-xl border border-divider bg-slate-50 text-text-primary text-xs text-center font-semibold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-text-secondary uppercase mb-1">
                  Priority & Rewards
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-divider bg-slate-50 text-text-primary text-xs font-semibold outline-none"
                >
                  <option value="high">High Intensity (+70 XP, +35 Coins)</option>
                  <option value="medium">Medium (+50 XP, +23 Coins)</option>
                  <option value="low">Low (+35 XP, +15 Coins)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-text-secondary uppercase mb-1">
                Workout Target Notes (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Focus on clean eccentric tempo, warmup sets first..."
                className="w-full px-3 py-2 rounded-xl border border-divider bg-slate-50 text-text-primary text-xs focus:bg-white outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 rounded-full border border-divider text-xs font-semibold text-text-secondary hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 rounded-full bg-warm text-white font-semibold text-xs hover:bg-warm/90 transition-all active:scale-95 shadow-sm flex items-center gap-1.5"
              >
                {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                <span>Add Workout Quest</span>
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* VIEW 1 & VIEW 3: Active Workouts & History */}
      {(activeTab === "active" || activeTab === "history") && (
        <div className="space-y-4">
          {/* Search and filter bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search workouts by exercise or muscle group..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-divider bg-surface text-xs focus:bg-white transition-all outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-text-secondary" />
              <select
                value={muscleFilter}
                onChange={(e) => setMuscleFilter(e.target.value)}
                className="px-3 py-2 rounded-2xl border border-divider bg-surface text-xs text-text-secondary outline-none font-semibold"
              >
                <option value="all">All Muscle Groups</option>
                {muscleGroups.map((mg) => (
                  <option key={mg} value={mg}>
                    {mg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* List */}
          <div className="space-y-3">
            {loading ? (
              <div className="h-28 rounded-3xl bg-slate-200 animate-pulse" />
            ) : displayedWorkouts.length === 0 ? (
              <div className="p-10 rounded-3xl bg-surface border border-divider/60 text-center space-y-2">
                <Dumbbell className="w-8 h-8 text-text-secondary/40 mx-auto" />
                <div className="text-sm font-bold text-text-primary">
                  {activeTab === "active" ? "No active workout quests" : "No completed workout logs yet"}
                </div>
                <p className="text-xs text-text-secondary max-w-sm mx-auto">
                  {activeTab === "active"
                    ? "Pick an exercise preset above or switch to Routines to embark on your workout session."
                    : "Workouts you complete will authoritatively record here along with Willpower points and timestamps."}
                </p>
              </div>
            ) : (
              displayedWorkouts.map((t) => (
                <QuestCard
                  key={t.id}
                  task={t}
                  onComplete={handleComplete}
                  onEdit={(taskToEdit) => setEditingTask(taskToEdit)}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: Routines & Presets Manager */}
      {activeTab === "presets" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-text-primary tracking-tight">
                Workout Routines & Exercise Library
              </h3>
              <p className="text-xs text-text-secondary">
                1-click launch or edit custom training regimens.
              </p>
            </div>
            <button
              onClick={() => handleOpenPresetModal()}
              className="text-xs font-semibold px-4 py-2 rounded-full bg-warm text-white hover:bg-warm/90 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Exercise Routine</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {presets.map((p) => (
              <div
                key={p.id}
                className="p-5 rounded-3xl bg-surface border border-divider/70 shadow-subtle hover:shadow-card transition-all flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-orange-50 text-warm flex items-center justify-center">
                      <Dumbbell className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenPresetModal(p)}
                        title="Edit Routine"
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-text-secondary transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      {p.isCustom && (
                        <button
                          onClick={() => handleDeletePreset(p.id)}
                          title="Delete Routine"
                          className="p-1.5 rounded-lg hover:bg-red-50 text-text-secondary hover:text-danger transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-text-primary mt-3 tracking-tight">
                    {p.exercise}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-semibold text-warm bg-warm-light px-2 py-0.5 rounded-full">
                      {p.muscleGroup}
                    </span>
                    {p.isCustom && (
                      <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                        Custom
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-text-secondary mt-2">
                    {p.sets} Sets × {p.reps} Reps {p.duration ? `• ${p.duration} mins` : ""}
                  </p>
                </div>

                <button
                  onClick={() => handleQuickLaunchPreset(p)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-warm hover:text-white border border-divider text-xs font-semibold text-text-primary transition-all flex items-center justify-center gap-1.5 active:scale-98"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Start Workout Quest</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preset Create/Edit Modal */}
      <AnimatePresence>
        {isCustomPresetModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCustomPresetModalOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.form
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              onSubmit={handleSavePreset}
              className="relative z-10 w-full max-w-md rounded-3xl bg-surface p-6 border border-divider shadow-float space-y-4"
            >
              <h3 className="text-base font-bold text-text-primary">
                {editingPresetId ? "Edit Routine Preset" : "Add Custom Exercise Routine"}
              </h3>

              <div>
                <label className="block text-[11px] font-semibold text-text-secondary uppercase mb-1">
                  Exercise Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Incline Dumbbell Press"
                  value={presetFormExercise}
                  onChange={(e) => setPresetFormExercise(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-divider text-xs font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-text-secondary uppercase mb-1">
                  Muscle Group
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Upper Chest, Shoulders, Calves"
                  value={presetFormMuscle}
                  onChange={(e) => setPresetFormMuscle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-divider text-xs font-semibold outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-text-secondary mb-1">Sets</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={presetFormSets}
                    onChange={(e) => setPresetFormSets(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-xl border border-divider text-xs text-center font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-text-secondary mb-1">Reps</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={presetFormReps}
                    onChange={(e) => setPresetFormReps(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-xl border border-divider text-xs text-center font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-text-secondary mb-1">Duration</label>
                  <input
                    type="number"
                    min={5}
                    max={180}
                    value={presetFormDuration}
                    onChange={(e) => setPresetFormDuration(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-xl border border-divider text-xs text-center font-bold outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsCustomPresetModalOpen(false)}
                  className="flex-1 py-2 rounded-full border border-divider text-xs font-semibold text-text-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-full bg-warm text-white text-xs font-semibold"
                >
                  Save Routine
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Workout Task Modal */}
      <GymEditorModal
        isOpen={!!editingTask}
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onWorkoutUpdated={handleWorkoutUpdated}
      />

      {/* Level Up Modal */}
      <LevelUpModal
        isOpen={levelUpState.isOpen}
        newLevel={levelUpState.newLevel}
        onClose={() => setLevelUpState((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
