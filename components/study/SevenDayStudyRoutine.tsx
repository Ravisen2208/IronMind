"use client";

import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  Calendar,
  BookOpen,
  Brain,
  Code2,
  Edit3,
  Play,
  Plus,
  Trash2,
  Sparkles,
  Clock,
  ArrowRight,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { apiRequest } from "@/lib/api";
import { TaskItem } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

export interface DayStudyPlan {
  dayNumber: number; // 1 to 7
  dayName: string;
  subject: string;
  topic: string;
  focus: string;
  duration: number; // in mins
  isDsaDay?: boolean;
  dsaProblemId?: string;
  keyConcepts: string[];
}

export const DEFAULT_7DAY_STUDY: DayStudyPlan[] = [
  {
    dayNumber: 1,
    dayName: "Monday",
    subject: "Data Structures & Algorithms",
    topic: "Two Pointers & Sliding Window",
    focus: "O(n) Optimal Array Partitioning & Subarray Math",
    duration: 45,
    isDsaDay: true,
    dsaProblemId: "two-sum",
    keyConcepts: ["Two Sum In-Place Optimization", "Longest Substring Window", "Kadane's Subarray Algorithm"],
  },
  {
    dayNumber: 2,
    dayName: "Tuesday",
    subject: "System Design & Architecture",
    topic: "Distributed Caching & Scalability",
    focus: "Redis Eviction Policies, CDN Tiering & Consistent Hashing",
    duration: 40,
    keyConcepts: ["Write-Through vs Cache-Aside", "Bloom Filters for Quick Lookups", "Mitigating Cache Stampedes"],
  },
  {
    dayNumber: 3,
    dayName: "Wednesday",
    subject: "Database Management & Storage",
    topic: "B-Tree Indexing & Query Plans",
    focus: "Index Scans, Composite Indexes & ACID Isolation Levels",
    duration: 35,
    keyConcepts: ["Clustered vs Secondary Indexes", "Read Committed vs Serializable", "EXPLAIN ANALYZE Execution Tuning"],
  },
  {
    dayNumber: 4,
    dayName: "Thursday",
    subject: "Data Structures & Algorithms",
    topic: "Binary Search Trees & Stack Logic",
    focus: "Logarithmic Search Bounds & LIFO Evaluation",
    duration: 45,
    isDsaDay: true,
    dsaProblemId: "binary-search",
    keyConcepts: ["Binary Search Boundary Conditions", "Valid Parentheses Stack Evaluation", "BST In-Order Traversal"],
  },
  {
    dayNumber: 5,
    dayName: "Friday",
    subject: "Operating Systems & Concurrency",
    topic: "Processes, Threads & Memory",
    focus: "Mutex, Deadlock Prevention & Virtual Memory Paging",
    duration: 35,
    keyConcepts: ["Context Switching Overhead", "Race Condition Defense & Atomic Ops", "Page Faults & TLB Caches"],
  },
  {
    dayNumber: 6,
    dayName: "Saturday",
    subject: "Modern Full-Stack Engineering",
    topic: "Next.js App Router & Microservices",
    focus: "RSC Server Components, Hydration & WebSocket Streaming",
    duration: 45,
    keyConcepts: ["Server Components Streaming", "JWT & Session Security", "Optimistic State Mutation Patterns"],
  },
  {
    dayNumber: 7,
    dayName: "Sunday",
    subject: "Technical Interview & Revision",
    topic: "Behavioral & Algorithmic Mock",
    focus: "Synthesis, Complexity Proofs & Code Review",
    duration: 30,
    isDsaDay: true,
    dsaProblemId: "max-subarray",
    keyConcepts: ["STAR Interview Methodology", "Space/Time Complexity Tradeoffs", "Weekly Cognitive Knowledge Audit"],
  },
];

export function SevenDayStudyRoutine({
  onStudyLaunched,
  onOpenDsaStudio,
}: {
  onStudyLaunched?: (task: TaskItem) => void;
  onOpenDsaStudio?: (problemId?: string) => void;
}) {
  const { showToast } = useToast();
  const [routines, setRoutines] = useState<DayStudyPlan[]>(DEFAULT_7DAY_STUDY);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editingDay, setEditingDay] = useState<DayStudyPlan | null>(null);

  // Compute today's day number (Monday=1, Sunday=7)
  useEffect(() => {
    const jsDay = new Date().getDay();
    const dayNum = jsDay === 0 ? 7 : jsDay;
    setSelectedDay(dayNum);

    // Load from localStorage if present
    try {
      const saved = localStorage.getItem("ironmind_7day_study");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 7) {
          setRoutines(parsed);
        }
      }
    } catch {}
  }, []);

  const saveRoutines = (newRoutines: DayStudyPlan[]) => {
    setRoutines(newRoutines);
    try {
      localStorage.setItem("ironmind_7day_study", JSON.stringify(newRoutines));
    } catch {}
  };

  const activeRoutine = routines.find((r) => r.dayNumber === selectedDay) || routines[0];

  const handleLaunchTodayStudy = async (routine: DayStudyPlan) => {
    try {
      const title = `${routine.dayName}: ${routine.subject}`;
      const res = await apiRequest<{ success: boolean; task: TaskItem }>("/api/tasks", {
        method: "POST",
        body: JSON.stringify({
          title,
          description: `${routine.topic} — ${routine.focus} (${routine.keyConcepts.join(", ")})`,
          type: "study",
          category: "Study",
          priority: routine.isDsaDay ? "high" : "medium",
          study: {
            subject: routine.subject,
            topic: routine.topic,
            duration: routine.duration,
          },
        }),
      });

      if (res.success && res.data?.task) {
        showToast(`Embarked on ${routine.dayName}'s study directive! +1 Intellect`, "success");
        if (onStudyLaunched) {
          onStudyLaunched(res.data.task);
        }
      } else {
        showToast("Failed to launch study directive.", "error");
      }
    } catch {
      showToast("Error launching study directive.", "error");
    }
  };

  const handleOpenEdit = (routine: DayStudyPlan) => {
    setEditingDay(JSON.parse(JSON.stringify(routine)));
    setIsEditing(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDay) return;

    const updated = routines.map((r) => (r.dayNumber === editingDay.dayNumber ? editingDay : r));
    saveRoutines(updated);
    setIsEditing(false);
    showToast(`Updated ${editingDay.dayName} study directive!`, "success");
  };

  const handleConceptChange = (index: number, value: string) => {
    if (!editingDay) return;
    const next = [...editingDay.keyConcepts];
    next[index] = value;
    setEditingDay({ ...editingDay, keyConcepts: next });
  };

  const handleAddConcept = () => {
    if (!editingDay) return;
    setEditingDay({
      ...editingDay,
      keyConcepts: [...editingDay.keyConcepts, "New Concept Target"],
    });
  };

  const handleRemoveConcept = (index: number) => {
    if (!editingDay) return;
    const next = editingDay.keyConcepts.filter((_, i) => i !== index);
    setEditingDay({ ...editingDay, keyConcepts: next });
  };

  const jsDay = new Date().getDay();
  const currentDayNum = jsDay === 0 ? 7 : jsDay;

  return (
    <div className="space-y-6">
      {/* 7-Day Day Selector Bar */}
      <div className="p-3 rounded-2xl bg-surface border border-divider shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-accent flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary tracking-tight">
              7-Day Cognitive Mastery Routine
            </h3>
            <p className="text-[11px] text-text-secondary">
              High-intensity computer science, system design & algorithmic problem-solving split.
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
                    ? "bg-accent text-cream font-bold shadow-sm scale-102"
                    : isToday
                    ? "bg-blue-100 text-accent font-bold border border-accent/30"
                    : "text-text-secondary hover:text-text-primary hover:bg-white"
                }`}
              >
                <div className="text-[10px] uppercase font-bold tracking-wider">
                  {r.dayName.substring(0, 3)}
                </div>
                <div className="text-[11px] mt-0.5 font-bold flex items-center justify-center gap-0.5">
                  <span>Day {r.dayNumber}</span>
                  {r.isDsaDay && <span className="text-[9px]">💻</span>}
                </div>
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
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-accent-light text-accent">
                {activeRoutine.dayName} • Day {activeRoutine.dayNumber}
              </span>
              {activeRoutine.dayNumber === currentDayNum && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-success border border-success/20">
                  Today&apos;s Focus
                </span>
              )}
              {activeRoutine.isDsaDay && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200/50 flex items-center gap-1">
                  <Code2 className="w-3 h-3" /> DSA Day
                </span>
              )}
              <span className="text-xs font-semibold text-text-secondary bg-slate-100 px-2 py-0.5 rounded-full">
                {activeRoutine.duration} mins
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight mt-1">
              {activeRoutine.subject}
            </h2>
            <p className="text-xs text-text-secondary">
              Core Discipline: <strong className="text-text-primary">{activeRoutine.topic}</strong> • {activeRoutine.focus}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {activeRoutine.isDsaDay && onOpenDsaStudio && (
              <button
                onClick={() => onOpenDsaStudio(activeRoutine.dsaProblemId)}
                className="px-4 py-2 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200/60 transition-all active:scale-95 flex items-center gap-1.5 shadow-sm"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Launch Code Editor</span>
              </button>
            )}

            <button
              onClick={() => handleOpenEdit(activeRoutine)}
              className="px-4 py-2 rounded-full border border-divider hover:bg-slate-50 text-xs font-semibold text-text-primary transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Directive</span>
            </button>

            <button
              onClick={() => handleLaunchTodayStudy(activeRoutine)}
              className="px-5 py-2.5 rounded-full bg-accent hover:bg-accent-hover text-cream text-xs font-bold shadow-sm transition-all active:scale-95 flex items-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Embark on Day {activeRoutine.dayNumber} Directive</span>
            </button>
          </div>
        </div>

        {/* Key Concepts / Syllabus for the Day */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Key Focus Targets & Syllabus ({activeRoutine.keyConcepts.length} Topics)
            </h4>
            {activeRoutine.isDsaDay && onOpenDsaStudio && (
              <button
                onClick={() => onOpenDsaStudio(activeRoutine.dsaProblemId)}
                className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
              >
                <span>Practice this in DSA Studio</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {activeRoutine.keyConcepts.map((concept, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50/70 border border-divider/70 flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="text-[10px] font-bold text-text-secondary uppercase">
                    Directive {idx + 1}
                  </div>
                  <div className="text-sm font-bold text-text-primary mt-1">{concept}</div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-divider/40 text-[11px] text-text-secondary">
                  <span className="flex items-center gap-1 text-accent font-semibold">
                    <Sparkles className="w-3 h-3" /> +1 Intellect
                  </span>
                  <span>Deep Work</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Directive Modal */}
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
                  Edit {editingDay.dayName} Study Directive
                </h3>
                <span className="text-xs font-semibold text-accent">Day {editingDay.dayNumber}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-text-secondary uppercase mb-1">
                    Subject Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editingDay.subject}
                    onChange={(e) => setEditingDay({ ...editingDay, subject: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-divider text-xs font-semibold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-text-secondary uppercase mb-1">
                    Topic / Discipline
                  </label>
                  <input
                    type="text"
                    required
                    value={editingDay.topic}
                    onChange={(e) => setEditingDay({ ...editingDay, topic: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-divider text-xs font-semibold outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-text-secondary uppercase mb-1">
                    Core Focus
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
                    max={360}
                    value={editingDay.duration}
                    onChange={(e) => setEditingDay({ ...editingDay, duration: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-divider text-xs font-semibold outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isDsaDayCheckbox"
                  checked={!!editingDay.isDsaDay}
                  onChange={(e) => setEditingDay({ ...editingDay, isDsaDay: e.target.checked })}
                  className="rounded border-divider text-accent focus:ring-accent"
                />
                <label htmlFor="isDsaDayCheckbox" className="text-xs font-semibold text-text-primary">
                  Enable DSA Code Studio for this day
                </label>
              </div>

              {/* Concepts List in Modal */}
              <div className="space-y-2 pt-2 border-t border-divider">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-text-primary uppercase tracking-wider">
                    Key Topics / Concepts
                  </label>
                  <button
                    type="button"
                    onClick={handleAddConcept}
                    className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Concept
                  </button>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {editingDay.keyConcepts.map((concept, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-slate-50 border border-divider flex items-center gap-2"
                    >
                      <input
                        type="text"
                        value={concept}
                        onChange={(e) => handleConceptChange(i, e.target.value)}
                        className="flex-1 px-2.5 py-1.5 rounded-lg border border-divider bg-white text-xs font-semibold outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveConcept(i)}
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
                  className="flex-1 py-2.5 rounded-full bg-accent text-cream text-xs font-semibold shadow-sm"
                >
                  Save Directive
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
