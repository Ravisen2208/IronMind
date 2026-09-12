"use client";

import React, { useState, useEffect } from "react";
import {
  Dumbbell,
  Calendar,
  Flame,
  CheckCircle2,
  Edit3,
  Play,
  Plus,
  Trash2,
  Sparkles,
  Zap,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { apiRequest } from "@/lib/api";
import { TaskItem } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

export interface ExercisePlan {
  name: string;
  sets: number;
  reps: number | string;
  target?: string;
}

export interface DayRoutine {
  dayNumber: number; // 1 to 7
  dayName: string;
  title: string;
  muscleGroup: string;
  focus: string;
  duration: number;
  intensity: "High" | "Medium" | "Low";
  exercises: ExercisePlan[];
}

export const DEFAULT_7DAY_GYM: DayRoutine[] = [
  {
    dayNumber: 1,
    dayName: "Monday",
    title: "Chest & Triceps Hypertrophy",
    muscleGroup: "Chest, Triceps",
    focus: "Push Strength & Muscle Thickness",
    duration: 50,
    intensity: "High",
    exercises: [
      { name: "Barbell Bench Press", sets: 4, reps: 8, target: "Mid Chest" },
      { name: "Incline Dumbbell Press", sets: 3, reps: 10, target: "Upper Chest" },
      { name: "Cable Chest Flyes", sets: 3, reps: 12, target: "Chest Squeeze" },
      { name: "Tricep Rope Pushdowns", sets: 3, reps: 12, target: "Lateral Triceps" },
      { name: "Overhead Dumbbell Tricep Ext.", sets: 3, reps: 10, target: "Long Head Triceps" },
    ],
  },
  {
    dayNumber: 2,
    dayName: "Tuesday",
    title: "Back & Biceps Citadel",
    muscleGroup: "Back, Biceps",
    focus: "Pull Power & V-Taper Lat Width",
    duration: 50,
    intensity: "High",
    exercises: [
      { name: "Barbell Deadlifts", sets: 4, reps: 6, target: "Posterior Chain" },
      { name: "Wide Grip Pull-Ups", sets: 4, reps: 10, target: "Lats" },
      { name: "Bent Over Barbell Rows", sets: 3, reps: 10, target: "Mid Back" },
      { name: "Barbell Bicep Curls", sets: 3, reps: 12, target: "Biceps" },
      { name: "Incline Dumbbell Curls", sets: 3, reps: 12, target: "Bicep Peak" },
    ],
  },
  {
    dayNumber: 3,
    dayName: "Wednesday",
    title: "Leg Citadel & Calves",
    muscleGroup: "Quads, Hamstrings, Calves",
    focus: "Lower Body Foundation & Grit",
    duration: 55,
    intensity: "High",
    exercises: [
      { name: "Barbell Back Squats", sets: 4, reps: 8, target: "Quads & Glutes" },
      { name: "Romanian Deadlifts", sets: 4, reps: 8, target: "Hamstrings" },
      { name: "Leg Press Machine", sets: 3, reps: 12, target: "Quad Volume" },
      { name: "Leg Curls", sets: 3, reps: 12, target: "Hamstrings Isolation" },
      { name: "Standing Calf Raises", sets: 4, reps: 15, target: "Calves" },
    ],
  },
  {
    dayNumber: 4,
    dayName: "Thursday",
    title: "Shoulders, Traps & Core",
    muscleGroup: "Shoulders, Traps, Abs",
    focus: "3D Deltoid Armor & Trunk Stability",
    duration: 45,
    intensity: "High",
    exercises: [
      { name: "Overhead Military Press", sets: 4, reps: 8, target: "Front & Mid Delts" },
      { name: "Dumbbell Lateral Raises", sets: 4, reps: 15, target: "Side Delts" },
      { name: "Face Pulls", sets: 3, reps: 15, target: "Rear Delts & Rotators" },
      { name: "Dumbbell Shrugs", sets: 3, reps: 12, target: "Upper Traps" },
      { name: "Hanging Leg Raises", sets: 3, reps: 15, target: "Lower Abs" },
    ],
  },
  {
    dayNumber: 5,
    dayName: "Friday",
    title: "Arms Overload & Upper Density",
    muscleGroup: "Biceps, Triceps, Forearms",
    focus: "Arm Hypertrophy & Grip Fortification",
    duration: 45,
    intensity: "Medium",
    exercises: [
      { name: "Close-Grip Bench Press", sets: 4, reps: 8, target: "Tricep Power" },
      { name: "EZ-Bar Preacher Curls", sets: 3, reps: 10, target: "Short Head Biceps" },
      { name: "Skull Crushers", sets: 3, reps: 12, target: "Triceps Stretch" },
      { name: "Dumbbell Hammer Curls", sets: 3, reps: 12, target: "Brachialis & Forearms" },
      { name: "Wrist Roller / Curls", sets: 3, reps: 20, target: "Grip & Forearms" },
    ],
  },
  {
    dayNumber: 6,
    dayName: "Saturday",
    title: "Athletic Conditioning & HIIT",
    muscleGroup: "Full Body, Cardio",
    focus: "Endurance, VO2 Max & Metabolic Burn",
    duration: 40,
    intensity: "High",
    exercises: [
      { name: "5km Speed Tempo Run", sets: 1, reps: "5 KM", target: "Aerobic Capacity" },
      { name: "Kettlebell Swings", sets: 4, reps: 20, target: "Hip Drive & Cardio" },
      { name: "Burpee Broad Jumps", sets: 3, reps: 12, target: "Explosive Power" },
      { name: "Battle Rope Slams", sets: 4, reps: "30s", target: "Shoulder Cardio" },
      { name: "Weighted Plank Holds", sets: 3, reps: "60s", target: "Core Endurance" },
    ],
  },
  {
    dayNumber: 7,
    dayName: "Sunday",
    title: "Active Recovery & Mobility",
    muscleGroup: "Joints, Tendons, Spine",
    focus: "Restoration, CNS Reset & Flexibility",
    duration: 30,
    intensity: "Low",
    exercises: [
      { name: "Full Body Dynamic Stretching", sets: 1, reps: "15 min", target: "Hip & Shoulder Mobility" },
      { name: "Foam Rolling / SMR", sets: 1, reps: "10 min", target: "Myofascial Release" },
      { name: "30-Min Regeneration Walk", sets: 1, reps: "30 min", target: "Lymphatic Flow & Decompression" },
    ],
  },
];

export function SevenDayGymRoutine({
  onWorkoutLaunched,
}: {
  onWorkoutLaunched?: (task: TaskItem) => void;
}) {
  const { showToast } = useToast();
  const [routines, setRoutines] = useState<DayRoutine[]>(DEFAULT_7DAY_GYM);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editingDay, setEditingDay] = useState<DayRoutine | null>(null);

  // Compute today's day number (Monday=1, Sunday=7)
  useEffect(() => {
    const jsDay = new Date().getDay(); // 0 is Sunday, 1 is Monday...
    const dayNum = jsDay === 0 ? 7 : jsDay;
    setSelectedDay(dayNum);

    // Load from localStorage if present
    try {
      const saved = localStorage.getItem("ironmind_7day_gym");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 7) {
          setRoutines(parsed);
        }
      }
    } catch {}
  }, []);

  const saveRoutines = (newRoutines: DayRoutine[]) => {
    setRoutines(newRoutines);
    try {
      localStorage.setItem("ironmind_7day_gym", JSON.stringify(newRoutines));
    } catch {}
  };

  const activeRoutine = routines.find((r) => r.dayNumber === selectedDay) || routines[0];

  const handleLaunchTodayWorkout = async (routine: DayRoutine) => {
    try {
      const exerciseSummary = routine.exercises.map((e) => `${e.name} (${e.sets}x${e.reps})`).join(", ");
      const title = `${routine.dayName}: ${routine.title}`;
      const res = await apiRequest<{ success: boolean; task: TaskItem }>("/api/tasks", {
        method: "POST",
        body: JSON.stringify({
          title,
          description: `${routine.focus} — ${exerciseSummary}`,
          type: "gym",
          category: "Gym",
          priority: routine.intensity === "High" ? "high" : "medium",
          gym: {
            exercise: routine.exercises[0]?.name || routine.title,
            muscleGroup: routine.muscleGroup,
            sets: routine.exercises.reduce((acc, c) => acc + c.sets, 0),
            reps: 10,
            duration: routine.duration,
          },
        }),
      });

      if (res.success && res.data?.task) {
        showToast(`Embarked on ${routine.dayName}'s workout quest! +1 Willpower`, "success");
        if (onWorkoutLaunched) {
          onWorkoutLaunched(res.data.task);
        }
      } else {
        showToast("Failed to launch workout quest.", "error");
      }
    } catch {
      showToast("Error launching workout quest.", "error");
    }
  };

  const handleOpenEdit = (routine: DayRoutine) => {
    setEditingDay(JSON.parse(JSON.stringify(routine)));
    setIsEditing(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDay) return;

    const updated = routines.map((r) => (r.dayNumber === editingDay.dayNumber ? editingDay : r));
    saveRoutines(updated);
    setIsEditing(false);
    showToast(`Updated ${editingDay.dayName} routine!`, "success");
  };

  const handleExerciseChange = (index: number, field: keyof ExercisePlan, value: any) => {
    if (!editingDay) return;
    const nextExercises = [...editingDay.exercises];
    nextExercises[index] = { ...nextExercises[index], [field]: value };
    setEditingDay({ ...editingDay, exercises: nextExercises });
  };

  const handleAddExercise = () => {
    if (!editingDay) return;
    const newEx: ExercisePlan = {
      name: "New Exercise",
      sets: 3,
      reps: 10,
      target: "Hypertrophy",
    };
    setEditingDay({ ...editingDay, exercises: [...editingDay.exercises, newEx] });
  };

  const handleRemoveExercise = (index: number) => {
    if (!editingDay) return;
    const nextExercises = editingDay.exercises.filter((_, i) => i !== index);
    setEditingDay({ ...editingDay, exercises: nextExercises });
  };

  const jsDay = new Date().getDay();
  const currentDayNum = jsDay === 0 ? 7 : jsDay;

  return (
    <div className="space-y-6">
      {/* 7-Day Day Selector Bar */}
      <div className="p-3 rounded-2xl bg-surface border border-divider shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-orange-50 text-warm flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary tracking-tight">
              7-Day Iron Battle Routine
            </h3>
            <p className="text-[11px] text-text-secondary">
              Periodized push/pull/legs/conditioning split to fortify physical willpower.
            </p>
          </div>
        </div>

        {/* 7 Days Button Row */}
        <div className="grid grid-cols-7 gap-1.5 p-1 bg-slate-100/80 rounded-xl overflow-x-auto">
          {routines.map((r) => {
            const isToday = r.dayNumber === currentDayNum;
            const isSelected = r.dayNumber === selectedDay;
            return (
              <button
                key={r.dayNumber}
                onClick={() => setSelectedDay(r.dayNumber)}
                className={`py-2 px-2.5 rounded-lg text-center transition-all ${
                  isSelected
                    ? "bg-warm text-white font-bold shadow-sm scale-102"
                    : isToday
                    ? "bg-orange-100 text-warm font-bold border border-warm/30"
                    : "text-text-secondary hover:text-text-primary hover:bg-white"
                }`}
              >
                <div className="text-[10px] uppercase font-bold tracking-wider">
                  {r.dayName.substring(0, 3)}
                </div>
                <div className="text-[11px] mt-0.5 font-bold">Day {r.dayNumber}</div>
                {isToday && (
                  <div className="w-1 h-1 rounded-full bg-current mx-auto mt-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Routine Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-surface border border-divider/80 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-divider pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-warm-light text-warm">
                {activeRoutine.dayName} • Day {activeRoutine.dayNumber}
              </span>
              {activeRoutine.dayNumber === currentDayNum && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-success border border-success/20">
                  Today&apos;s Battle
                </span>
              )}
              <span className="text-xs font-semibold text-text-secondary bg-slate-100 px-2 py-0.5 rounded-full">
                {activeRoutine.duration} mins
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight mt-1">
              {activeRoutine.title}
            </h2>
            <p className="text-xs text-text-secondary">
              Target Muscle Focus: <strong className="text-text-primary">{activeRoutine.muscleGroup}</strong> • {activeRoutine.focus}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => handleOpenEdit(activeRoutine)}
              className="px-4 py-2 rounded-full border border-divider hover:bg-slate-50 text-xs font-semibold text-text-primary transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Routine</span>
            </button>

            <button
              onClick={() => handleLaunchTodayWorkout(activeRoutine)}
              className="px-5 py-2.5 rounded-full bg-warm hover:bg-warm/90 text-white text-xs font-bold shadow-sm transition-all active:scale-95 flex items-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Embark on Day {activeRoutine.dayNumber} Quest</span>
            </button>
          </div>
        </div>

        {/* Exercises Table / Cards */}
        <div>
          <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-3">
            Assigned Exercise Protocol ({activeRoutine.exercises.length} Drills)
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeRoutine.exercises.map((ex, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50/70 border border-divider/70 flex items-start justify-between gap-2"
              >
                <div>
                  <div className="text-[10px] font-bold text-text-secondary uppercase">
                    Step {idx + 1}
                  </div>
                  <div className="text-sm font-bold text-text-primary mt-0.5">{ex.name}</div>
                  {ex.target && (
                    <div className="text-[11px] text-text-secondary mt-0.5">{ex.target}</div>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <span className="inline-block px-2.5 py-1 rounded-xl bg-white border border-divider text-xs font-bold text-warm shadow-subtle">
                    {ex.sets} × {ex.reps}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Routine Modal */}
      <AnimatePresence>
        {isEditing && editingDay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.form
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              onSubmit={handleSaveEdit}
              className="relative z-10 w-full max-w-xl max-h-[88vh] overflow-y-auto rounded-3xl bg-surface p-6 sm:p-7 border border-divider shadow-float space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-text-primary">
                  Edit {editingDay.dayName} Protocol
                </h3>
                <span className="text-xs font-semibold text-warm">Day {editingDay.dayNumber}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-text-secondary uppercase mb-1">
                    Title / Theme
                  </label>
                  <input
                    type="text"
                    required
                    value={editingDay.title}
                    onChange={(e) => setEditingDay({ ...editingDay, title: e.target.value })}
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
                    value={editingDay.muscleGroup}
                    onChange={(e) => setEditingDay({ ...editingDay, muscleGroup: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-divider text-xs font-semibold outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-text-secondary uppercase mb-1">
                    Focus Objective
                  </label>
                  <input
                    type="text"
                    value={editingDay.focus}
                    onChange={(e) => setEditingDay({ ...editingDay, focus: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-divider text-xs font-semibold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-text-secondary mb-1 uppercase">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={180}
                    value={editingDay.duration}
                    onChange={(e) => setEditingDay({ ...editingDay, duration: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-divider text-xs font-semibold outline-none"
                  />
                </div>
              </div>

              {/* Exercises List in Modal */}
              <div className="space-y-2 pt-2 border-t border-divider">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-text-primary uppercase tracking-wider">
                    Exercises
                  </label>
                  <button
                    type="button"
                    onClick={handleAddExercise}
                    className="text-xs font-bold text-warm hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Exercise
                  </button>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {editingDay.exercises.map((ex, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-50 border border-divider flex items-center gap-2"
                    >
                      <input
                        type="text"
                        placeholder="Exercise Name"
                        value={ex.name}
                        onChange={(e) => handleExerciseChange(i, "name", e.target.value)}
                        className="flex-1 px-2.5 py-1.5 rounded-lg border border-divider bg-white text-xs font-semibold outline-none"
                      />
                      <input
                        type="number"
                        placeholder="Sets"
                        min={1}
                        max={20}
                        value={ex.sets}
                        onChange={(e) => handleExerciseChange(i, "sets", Number(e.target.value))}
                        className="w-14 px-2 py-1.5 rounded-lg border border-divider bg-white text-xs text-center font-bold outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Reps"
                        value={ex.reps}
                        onChange={(e) => handleExerciseChange(i, "reps", e.target.value)}
                        className="w-16 px-2 py-1.5 rounded-lg border border-divider bg-white text-xs text-center font-bold outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExercise(i)}
                        className="p-1.5 text-text-secondary hover:text-danger rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2.5 rounded-full border border-divider text-xs font-semibold text-text-secondary hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-warm text-white text-xs font-semibold shadow-sm"
                >
                  Save Day Protocol
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
