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
  Dumbbell,
  Flame,
  Award,
  Calendar,
  Plus,
  Loader2,
  CheckCircle2,
  Zap,
} from "lucide-react";

const PRESET_EXERCISES = [
  { exercise: "Bench Press", muscleGroup: "Chest", sets: 4, reps: 10 },
  { exercise: "Barbell Squats", muscleGroup: "Legs", sets: 4, reps: 8 },
  { exercise: "Deadlifts", muscleGroup: "Back", sets: 3, reps: 6 },
  { exercise: "Overhead Press", muscleGroup: "Shoulders", sets: 3, reps: 10 },
  { exercise: "Pull Ups", muscleGroup: "Upper Back", sets: 3, reps: 12 },
  { exercise: "5km Endurance Run", muscleGroup: "Cardio", duration: 30 },
  { exercise: "Core & Plank Circuit", muscleGroup: "Core", duration: 15 },
  { exercise: "HIIT Sprint Intervals", muscleGroup: "Full Body", duration: 20 },
];

export function GymTracker() {
  const { userStats, updateLocalStats } = useAuth();
  const { showToast } = useToast();

  const [gymTasks, setGymTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New Workout Form State
  const [exercise, setExercise] = useState(PRESET_EXERCISES[0].exercise);
  const [muscleGroup, setMuscleGroup] = useState(PRESET_EXERCISES[0].muscleGroup);
  const [sets, setSets] = useState(4);
  const [reps, setReps] = useState(10);
  const [duration, setDuration] = useState(30);
  const [priority, setPriority] = useState<"low" | "medium" | "high">("high");

  const [levelUpState, setLevelUpState] = useState<{ isOpen: boolean; newLevel: number }>({
    isOpen: false,
    newLevel: 1,
  });

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

  const handleSelectPreset = (p: typeof PRESET_EXERCISES[0]) => {
    setExercise(p.exercise);
    setMuscleGroup(p.muscleGroup);
    if (p.sets) setSets(p.sets);
    if (p.reps) setReps(p.reps);
    if (p.duration) setDuration(p.duration);
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
          description: `${sets} sets of ${reps} reps target session`,
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
        setGymTasks((prev) => [res.data.task, ...prev]);
        setIsFormOpen(false);
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

  const activeWorkouts = gymTasks.filter((t) => !t.completed);
  const completedWorkouts = gymTasks.filter((t) => t.completed);

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
              Streak
            </span>
          </div>
          <div className="mt-3">
            <div className="text-xs uppercase font-bold text-text-secondary">Workout Streak</div>
            <div className="text-2xl font-bold text-text-primary mt-0.5">
              {userStats?.streak ?? 0} {userStats?.streak === 1 ? "day" : "days"}
            </div>
            <p className="text-[11px] text-text-secondary mt-1">Daily consistency defense</p>
          </div>
        </motion.div>

        <motion.div variants={staggerItem} className="p-5 rounded-3xl bg-surface border border-divider/70 shadow-subtle">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-accent-light text-accent flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-accent bg-accent-light px-2.5 py-0.5 rounded-full">
              Volume
            </span>
          </div>
          <div className="mt-3">
            <div className="text-xs uppercase font-bold text-text-secondary">Completed Sessions</div>
            <div className="text-2xl font-bold text-text-primary mt-0.5">
              {completedWorkouts.length}
            </div>
            <p className="text-[11px] text-text-secondary mt-1">Authoritative session logs</p>
          </div>
        </motion.div>

        <motion.div variants={staggerItem} className="p-5 rounded-3xl bg-surface border border-divider/70 shadow-subtle">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-amber-600 bg-amber-100/60 px-2.5 py-0.5 rounded-full">
              Target
            </span>
          </div>
          <div className="mt-3">
            <div className="text-xs uppercase font-bold text-text-secondary">Weekly Target</div>
            <div className="text-2xl font-bold text-text-primary mt-0.5">
              {Math.min(5, completedWorkouts.length)} / 5
            </div>
            <p className="text-[11px] text-text-secondary mt-1">Sessions this week</p>
          </div>
        </motion.div>
      </StaggerContainer>

      {/* Action / Creator Trigger */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-text-primary tracking-tight">
          Workout Directives
        </h2>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="text-xs font-semibold px-4 py-2 rounded-full bg-accent text-white hover:bg-accent-hover transition-all active:scale-95 flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>{isFormOpen ? "Close Form" : "Log New Workout"}</span>
        </button>
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
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
              Quick Workout Presets
            </h3>
            <div className="flex flex-wrap gap-2">
              {PRESET_EXERCISES.map((p) => (
                <button
                  key={p.exercise}
                  type="button"
                  onClick={() => handleSelectPreset(p)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    exercise === p.exercise
                      ? "bg-warm text-white border-warm font-semibold shadow-sm"
                      : "bg-slate-50 text-text-secondary border-divider hover:bg-slate-100"
                  }`}
                >
                  {p.exercise}
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
                  Priority
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
                className="px-6 py-2.5 rounded-full bg-warm text-white font-semibold text-xs hover:bg-warm/90 transition-all active:scale-95 shadow-sm flex items-center gap-1.5"
              >
                {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                <span>Add Workout Quest</span>
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Active Workouts List */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-text-secondary">
          Active Workout Quests ({activeWorkouts.length})
        </h3>
        {loading ? (
          <div className="h-24 rounded-3xl bg-slate-200 animate-pulse" />
        ) : activeWorkouts.length === 0 ? (
          <div className="p-8 rounded-3xl bg-surface border border-divider/60 text-center text-sm text-text-secondary">
            No active workout quests. Choose a preset or log your training session above!
          </div>
        ) : (
          activeWorkouts.map((t) => (
            <QuestCard
              key={t.id}
              task={t}
              onComplete={handleComplete}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* Completed Workouts History */}
      {completedWorkouts.length > 0 && (
        <div className="space-y-3 pt-6 border-t border-divider">
          <h3 className="text-sm font-semibold text-text-secondary">
            Completed Workout History ({completedWorkouts.length})
          </h3>
          {completedWorkouts.map((t) => (
            <QuestCard
              key={t.id}
              task={t}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Level Up Modal */}
      <LevelUpModal
        isOpen={levelUpState.isOpen}
        newLevel={levelUpState.newLevel}
        onClose={() => setLevelUpState((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
