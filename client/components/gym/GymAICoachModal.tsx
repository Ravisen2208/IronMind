"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Dumbbell,
  Zap,
  Target,
  Clock,
  Flame,
  CheckCircle2,
  X,
  Loader2,
  Plus,
  Info,
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { TaskItem } from "@/types";

interface ExercisePlan {
  exercise: string;
  muscleGroup: string;
  sets: number;
  reps: number;
  formTip: string;
  restSec?: number;
}

interface GymAICoachModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTasks: (newTasks: TaskItem[]) => void;
}

const GOALS = [
  { id: "Hypertrophy", label: "Muscle Growth (Hypertrophy)", desc: "8-12 reps with mind-muscle tension" },
  { id: "Strength", label: "Pure Strength & Power", desc: "Heavy compound lifts (4-6 reps)" },
  { id: "Endurance", label: "Endurance & Conditioning", desc: "High reps & HIIT fat burn" },
  { id: "Calisthenics", label: "Bodyweight Mastery", desc: "Strict gymnastics & core control" },
];

const MUSCLE_GROUPS = [
  "Chest & Triceps",
  "Back & Biceps",
  "Legs & Calves (Quad/Hamstring)",
  "Shoulders & Upper Traps",
  "Full Body Compound",
  "Core & Functional Strength",
];

const EQUIPMENT_OPTIONS = [
  "Gym (Barbell, Dumbbells & Cables)",
  "Dumbbells Only (Home Workout)",
  "Bodyweight / Calisthenics Only",
];

export function GymAICoachModal({ isOpen, onClose, onAddTasks }: GymAICoachModalProps) {
  const { showToast } = useToast();

  const [goal, setGoal] = useState("Hypertrophy");
  const [muscleGroup, setMuscleGroup] = useState("Chest & Triceps");
  const [equipment, setEquipment] = useState("Gym (Barbell, Dumbbells & Cables)");
  const [duration, setDuration] = useState(45);
  const [level, setLevel] = useState("Intermediate");

  const [loading, setLoading] = useState(false);
  const [addingToTasks, setAddingToTasks] = useState(false);
  const [routineResult, setRoutineResult] = useState<{
    workoutName: string;
    focus: string;
    summary: string;
    exercises: ExercisePlan[];
    source?: string;
  } | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setRoutineResult(null);

    try {
      const res = await apiRequest<{
        success: boolean;
        workoutName: string;
        focus: string;
        summary: string;
        exercises: ExercisePlan[];
        source?: string;
      }>("/api/quest-ai/gym-workout", {
        method: "POST",
        body: JSON.stringify({
          goal,
          muscleGroup,
          equipment,
          level,
          durationMinutes: duration,
        }),
      });

      if (res.success && res.data?.exercises && res.data.exercises.length > 0) {
        setRoutineResult(res.data);
        if (res.data.source === "gemini-ai") {
          showToast("Gemini AI crafted a tailored workout routine!", "success");
        } else {
          showToast("Generated workout template.", "info");
        }
      } else {
        showToast("Could not generate routine. Please check connection.", "error");
      }
    } catch {
      showToast("AI Service error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAllToQuests = async () => {
    if (!routineResult || !routineResult.exercises.length) return;

    setAddingToTasks(true);
    const createdTasks: TaskItem[] = [];

    try {
      for (const ex of routineResult.exercises) {
        const payload = {
          title: `${ex.exercise} (${ex.sets}x${ex.reps})`,
          description: `AI Coach Tip: ${ex.formTip} | Rest: ${ex.restSec || 60}s`,
          type: "gym",
          category: "Gym",
          priority: "high",
          gym: {
            exercise: ex.exercise,
            muscleGroup: ex.muscleGroup || muscleGroup,
            sets: ex.sets,
            reps: ex.reps,
            duration: Math.round(duration / routineResult.exercises.length),
          },
        };

        const res = await apiRequest<{ success: boolean; task: TaskItem }>("/api/tasks", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        if (res.success && res.data?.task) {
          createdTasks.push(res.data.task);
        }
      }

      if (createdTasks.length > 0) {
        onAddTasks(createdTasks);
        showToast(`Added ${createdTasks.length} AI gym quests to your active routine!`, "success");
        onClose();
      } else {
        showToast("Could not add tasks. Please try again.", "error");
      }
    } catch {
      showToast("Error adding exercises to quests.", "error");
    } finally {
      setAddingToTasks(false);
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
          <div className="relative px-6 pt-6 pb-4 border-b border-divider/60 bg-gradient-to-r from-accent/10 via-warm-light/40 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-accent text-cream flex items-center justify-center shadow-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-heading font-extrabold text-text-primary tracking-tight flex items-center gap-2">
                    Gemini AI Workout Architect
                    <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-accent/15 text-accent">
                      Physical Willpower
                    </span>
                  </h3>
                  <p className="text-xs text-text-secondary">
                    Personalized, biomechanically optimized training routines powered by Gemini 1.5 Flash.
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
          </div>

          <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* Parameters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Muscle Group */}
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-accent" /> Target Muscle Group
                </label>
                <select
                  value={muscleGroup}
                  onChange={(e) => setMuscleGroup(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-divider bg-warm-light/50 text-xs font-semibold text-text-primary focus:bg-white transition-all outline-none"
                >
                  {MUSCLE_GROUPS.map((mg) => (
                    <option key={mg} value={mg}>
                      {mg}
                    </option>
                  ))}
                </select>
              </div>

              {/* Goal */}
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-accent" /> Primary Goal
                </label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-divider bg-warm-light/50 text-xs font-semibold text-text-primary focus:bg-white transition-all outline-none"
                >
                  {GOALS.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Equipment */}
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Dumbbell className="w-3.5 h-3.5 text-accent" /> Equipment Available
                </label>
                <select
                  value={equipment}
                  onChange={(e) => setEquipment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-divider bg-warm-light/50 text-xs font-semibold text-text-primary focus:bg-white transition-all outline-none"
                >
                  {EQUIPMENT_OPTIONS.map((eq) => (
                    <option key={eq} value={eq}>
                      {eq}
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration & Level */}
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-accent" /> Duration: {duration} mins
                </label>
                <div className="flex items-center gap-2">
                  {[20, 30, 45, 60].map((mins) => (
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
                    <span>Gemini AI is analyzing exercise mechanics & volume...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Custom Routine with Gemini</span>
                  </>
                )}
              </button>
            </div>

            {/* Result Preview */}
            {routineResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-2xl bg-warm-light/70 border border-divider space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-divider/60 pb-3">
                  <div>
                    <h4 className="text-base font-bold text-text-primary tracking-tight">
                      {routineResult.workoutName}
                    </h4>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {routineResult.summary}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent-light text-accent text-xs font-bold shrink-0">
                    <Zap className="w-3 h-3" /> {routineResult.focus}
                  </span>
                </div>

                {/* Exercise list */}
                <div className="space-y-2.5">
                  {routineResult.exercises.map((ex, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-surface border border-divider/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-accent/15 text-accent text-[11px] font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-text-primary">
                            {ex.exercise}
                          </span>
                          <span className="text-[10px] font-semibold text-text-muted px-2 py-0.5 rounded-md bg-warm-light border border-divider/50">
                            {ex.muscleGroup}
                          </span>
                        </div>
                        <p className="text-[11px] text-text-secondary flex items-center gap-1 pl-7">
                          <Info className="w-3 h-3 text-accent shrink-0" />
                          <span>{ex.formTip}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pl-7 sm:pl-0 shrink-0 text-xs font-bold text-accent">
                        <span className="px-2.5 py-1 rounded-lg bg-accent-light">
                          {ex.sets} sets × {ex.reps} reps
                        </span>
                        {ex.restSec && (
                          <span className="text-[11px] text-text-muted font-normal">
                            ({ex.restSec}s rest)
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 1-Click Embark */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleAddAllToQuests}
                    disabled={addingToTasks}
                    className="w-full py-3 px-4 rounded-xl bg-text-primary text-surface font-bold text-xs hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-60"
                  >
                    {addingToTasks ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Adding exercises to your Active Willpower Quests...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Add All {routineResult.exercises.length} Exercises to My Active Gym Quests (+XP)</span>
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
