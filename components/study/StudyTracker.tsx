"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { TaskItem, CompletionResponse, TaskPriority } from "@/types";
import { apiRequest } from "@/lib/api";
import { QuestCard } from "@/components/quests/QuestCard";
import { LevelUpModal } from "@/components/animations/LevelUpModal";
import { StudyEditorModal } from "@/components/study/StudyEditorModal";
import { SevenDayStudyRoutine } from "@/components/study/SevenDayStudyRoutine";
import { DsaCodeStudio } from "@/components/study/DsaCodeStudio";
import { useToast } from "@/components/ui/Toast";
import { StaggerContainer, staggerItem } from "@/components/animations/MotionWrapper";
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
  Search,
  SlidersHorizontal,
  BookmarkPlus,
  Trash2,
  Edit3,
  Play,
  Code2,
  Calendar,
} from "lucide-react";

export interface StudyPreset {
  id: string;
  subject: string;
  topic: string;
  duration: number;
  isCustom?: boolean;
}

const DEFAULT_STUDY_PRESETS: StudyPreset[] = [
  { id: "s1", subject: "Data Structures & Algorithms", topic: "Binary Search Trees & Graphs", duration: 45 },
  { id: "s2", subject: "System Design", topic: "Distributed Caching & Sharding", duration: 40 },
  { id: "s3", subject: "Operating Systems", topic: "Concurrency & Memory Management", duration: 30 },
  { id: "s4", subject: "Database Management", topic: "Indexing & Query Optimization", duration: 35 },
  { id: "s5", subject: "Modern Frontend", topic: "React Fiber Architecture & Hooks", duration: 30 },
  { id: "s6", subject: "Deep Learning", topic: "Attention Mechanisms & Transformers", duration: 45 },
  { id: "s7", subject: "Interview Preparation", topic: "Behavioral & Mock Scenarios", duration: 30 },
];

export function StudyTracker() {
  const { userStats, updateLocalStats } = useAuth();
  const { showToast } = useToast();

  const [studyTasks, setStudyTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"active" | "7day" | "dsa" | "presets" | "history">("active");
  const [activeDsaProblemId, setActiveDsaProblemId] = useState<string>("two-sum");
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");

  // New Study Form Drawer
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [subject, setSubject] = useState(DEFAULT_STUDY_PRESETS[0].subject);
  const [topic, setTopic] = useState(DEFAULT_STUDY_PRESETS[0].topic);
  const [duration, setDuration] = useState(30);
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [notes, setNotes] = useState("");

  // Presets State (stored in localStorage)
  const [presets, setPresets] = useState<StudyPreset[]>(DEFAULT_STUDY_PRESETS);
  const [isCustomPresetModalOpen, setIsCustomPresetModalOpen] = useState(false);
  const [presetFormSubject, setPresetFormSubject] = useState("");
  const [presetFormTopic, setPresetFormTopic] = useState("");
  const [presetFormDuration, setPresetFormDuration] = useState(30);
  const [editingPresetId, setEditingPresetId] = useState<string | null>(null);

  // Edit Study Task State
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);

  // Level Up Modal
  const [levelUpState, setLevelUpState] = useState<{ isOpen: boolean; newLevel: number }>({
    isOpen: false,
    newLevel: 1,
  });

  // Load custom presets from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ironmind_study_presets");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPresets(parsed);
        }
      }
    } catch {}
  }, []);

  const savePresets = (newPresets: StudyPreset[]) => {
    setPresets(newPresets);
    try {
      localStorage.setItem("ironmind_study_presets", JSON.stringify(newPresets));
    } catch {}
  };

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

  const handleSelectPreset = (p: StudyPreset) => {
    setSubject(p.subject);
    setTopic(p.topic);
    setDuration(p.duration);
  };

  const handleQuickLaunchPreset = async (p: StudyPreset) => {
    try {
      const title = `${p.subject}: ${p.topic}`;
      const res = await apiRequest<{ success: boolean; task: TaskItem }>("/api/tasks", {
        method: "POST",
        body: JSON.stringify({
          title,
          description: `Deep focus session for ${p.duration} minutes on ${p.topic}`,
          type: "study",
          category: "Study",
          priority: "medium",
          study: {
            subject: p.subject,
            topic: p.topic,
            duration: p.duration,
          },
        }),
      });

      if (res.success && res.data?.task) {
        setStudyTasks((prev) => [res.data!.task, ...prev]);
        setActiveTab("active");
        showToast(`Launched "${p.subject}" study directive!`, "success");
      }
    } catch {
      showToast("Failed to launch study preset.", "error");
    }
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
          description: notes.trim() || `Deep focus session for ${duration} minutes on ${topic}`,
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
        setStudyTasks((prev) => [res.data!.task, ...prev]);
        setIsFormOpen(false);
        setNotes("");
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

  const handleStudyUpdated = (updatedTask: TaskItem) => {
    setStudyTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    setEditingTask(null);
  };

  // Preset Management
  const handleOpenPresetModal = (presetToEdit?: StudyPreset) => {
    if (presetToEdit) {
      setEditingPresetId(presetToEdit.id);
      setPresetFormSubject(presetToEdit.subject);
      setPresetFormTopic(presetToEdit.topic);
      setPresetFormDuration(presetToEdit.duration);
    } else {
      setEditingPresetId(null);
      setPresetFormSubject("");
      setPresetFormTopic("");
      setPresetFormDuration(30);
    }
    setIsCustomPresetModalOpen(true);
  };

  const handleSavePreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!presetFormSubject.trim()) return;

    if (editingPresetId) {
      const updated = presets.map((p) =>
        p.id === editingPresetId
          ? {
              ...p,
              subject: presetFormSubject.trim(),
              topic: presetFormTopic.trim() || "Deep Focus",
              duration: Number(presetFormDuration),
            }
          : p
      );
      savePresets(updated);
      showToast("Study preset updated!", "success");
    } else {
      const newP: StudyPreset = {
        id: `preset_study_${Date.now()}`,
        subject: presetFormSubject.trim(),
        topic: presetFormTopic.trim() || "Deep Focus",
        duration: Number(presetFormDuration),
        isCustom: true,
      };
      savePresets([...presets, newP]);
      showToast("Custom study directive added!", "success");
    }
    setIsCustomPresetModalOpen(false);
  };

  const handleDeletePreset = (id: string) => {
    const updated = presets.filter((p) => p.id !== id);
    savePresets(updated);
    showToast("Preset removed.", "info");
  };

  // Filtered lists
  const activeQuests = studyTasks.filter((t) => !t.completed);
  const completedQuests = studyTasks.filter((t) => t.completed);

  const totalMinutes = completedQuests.reduce(
    (acc, cur) => acc + (cur.study?.duration || 30),
    0
  );
  const totalHours = (totalMinutes / 60).toFixed(1);

  const displayedQuests = (activeTab === "history" ? completedQuests : activeQuests).filter((t) => {
    if (subjectFilter !== "all") {
      if (t.study?.subject?.toLowerCase() !== subjectFilter.toLowerCase()) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchSub = t.study?.subject?.toLowerCase().includes(q);
      const matchTopic = t.study?.topic?.toLowerCase().includes(q);
      if (!matchTitle && !matchSub && !matchTopic) return false;
    }
    return true;
  });

  const subjects = Array.from(
    new Set(presets.map((p) => p.subject).filter(Boolean))
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
            <div className="w-10 h-10 rounded-2xl bg-accent-light text-accent flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-accent bg-accent/10 px-2.5 py-0.5 rounded-full">
              Intellect
            </span>
          </div>
          <div className="mt-3">
            <div className="text-xs uppercase font-bold text-text-secondary">Cognitive Stat</div>
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
            <p className="text-[11px] text-text-secondary mt-1">Sustained daily focus</p>
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
            <div className="text-xs uppercase font-bold text-text-secondary">Total Study Hours</div>
            <div className="text-2xl font-bold text-text-primary mt-0.5">
              {totalHours} hrs
            </div>
            <p className="text-[11px] text-text-secondary mt-1">Cumulative deep work</p>
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
            <div className="text-xs uppercase font-bold text-text-secondary">Sessions Finished</div>
            <div className="text-2xl font-bold text-text-primary mt-0.5">
              {completedQuests.length} sessions
            </div>
            <p className="text-[11px] text-text-secondary mt-1">Verified focus completions</p>
          </div>
        </motion.div>
      </StaggerContainer>

      {/* Navigation Tabs & Actions */}
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
            Active Sessions ({activeQuests.length})
          </button>
          <button
            onClick={() => setActiveTab("7day")}
            className={`text-xs font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === "7day"
                ? "bg-white text-accent font-bold shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>7-Day Split Routine</span>
          </button>
          <button
            onClick={() => setActiveTab("dsa")}
            className={`text-xs font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === "dsa"
                ? "bg-indigo-600 text-white font-bold shadow-sm"
                : "text-indigo-600 hover:bg-indigo-50 font-bold"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>DSA Code Studio</span>
          </button>
          <button
            onClick={() => setActiveTab("presets")}
            className={`text-xs font-bold px-4 py-2 rounded-lg transition-all ${
              activeTab === "presets"
                ? "bg-white text-text-primary shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Topics Library ({presets.length})
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`text-xs font-bold px-4 py-2 rounded-lg transition-all ${
              activeTab === "history"
                ? "bg-white text-text-primary shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            History ({completedQuests.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "presets" && (
            <button
              onClick={() => handleOpenPresetModal()}
              className="text-xs font-semibold px-4 py-2 rounded-full border border-divider hover:bg-slate-50 text-text-primary transition-all active:scale-95 flex items-center gap-1.5"
            >
              <BookmarkPlus className="w-3.5 h-3.5 text-accent" />
              <span>Add Custom Topic</span>
            </button>
          )}

          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="text-xs font-semibold px-4 py-2 rounded-full bg-accent text-cream hover:bg-accent-hover transition-all active:scale-95 flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{isFormOpen ? "Close Form" : "Log Study Session"}</span>
          </button>
        </div>
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
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                Select Study Preset or Custom Discipline
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
                    subject === p.subject
                      ? "bg-accent text-cream border-accent font-semibold shadow-sm"
                      : "bg-slate-50 text-text-secondary border-divider hover:bg-slate-100"
                  }`}
                >
                  {p.subject} {p.isCustom && "★"}
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
                  Topic / Sub-skill
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-divider bg-slate-50 text-text-primary text-xs font-semibold focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-text-secondary uppercase mb-1">
                  Focus Duration (Minutes)
                </label>
                <input
                  type="number"
                  min={5}
                  max={360}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-divider bg-slate-50 text-text-primary text-xs font-semibold outline-none"
                />
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
                  <option value="high">High (+60 XP, +30 Coins)</option>
                  <option value="medium">Medium (+40 XP, +18 Coins)</option>
                  <option value="low">Low (+25 XP, +10 Coins)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-text-secondary uppercase mb-1">
                Session Objective Notes (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Master tree balancing rotation, review flashcards..."
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
                className="px-6 py-2 rounded-full bg-accent text-cream font-semibold text-xs hover:bg-accent-hover transition-all active:scale-95 shadow-sm flex items-center gap-1.5"
              >
                {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                <span>Add Study Quest</span>
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* VIEW 1 & VIEW 3: Active Sessions & History */}
      {(activeTab === "active" || activeTab === "history") && (
        <div className="space-y-4">
          {/* Quick DSA Callout Banner */}
          {activeTab === "active" && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50/80 via-blue-50/60 to-surface border border-indigo-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-subtle">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-text-primary">
                    Practicing Algorithms &amp; Data Structures?
                  </h4>
                  <p className="text-[11px] text-text-secondary">
                    Write, test, and execute live code against automated test cases in the built-in DSA Code Studio.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab("dsa")}
                className="px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
              >
                <span>Launch Code Editor</span>
                <Code2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search study sessions by subject or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-divider bg-surface text-xs focus:bg-white transition-all outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-text-secondary" />
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="px-3 py-2 rounded-2xl border border-divider bg-surface text-xs text-text-secondary outline-none font-semibold"
              >
                <option value="all">All Subjects</option>
                {subjects.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="h-28 rounded-3xl bg-slate-200 animate-pulse" />
            ) : displayedQuests.length === 0 ? (
              <div className="p-10 rounded-3xl bg-surface border border-divider/60 text-center space-y-2">
                <BookOpen className="w-8 h-8 text-text-secondary/40 mx-auto" />
                <div className="text-sm font-bold text-text-primary">
                  {activeTab === "active" ? "No active study directives" : "No completed study logs yet"}
                </div>
                <p className="text-xs text-text-secondary max-w-sm mx-auto">
                  {activeTab === "active"
                    ? "Pick a study topic above or launch a custom subject directive."
                    : "Deep work sessions you complete will log here with Intellect points and timestamps."}
                </p>
              </div>
            ) : (
              displayedQuests.map((t) => (
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

      {/* VIEW: 7-Day Cognitive Mastery Routine */}
      {activeTab === "7day" && (
        <SevenDayStudyRoutine
          onStudyLaunched={(newTask) => {
            setStudyTasks((prev) => [newTask, ...prev]);
            setActiveTab("active");
          }}
          onOpenDsaStudio={(problemId) => {
            if (problemId) setActiveDsaProblemId(problemId);
            setActiveTab("dsa");
          }}
        />
      )}

      {/* VIEW: DSA Code Studio */}
      {activeTab === "dsa" && (
        <div className="space-y-4">
          <DsaCodeStudio defaultProblemId={activeDsaProblemId} />
        </div>
      )}

      {/* VIEW 2: Subjects & Presets Library */}
      {activeTab === "presets" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-text-primary tracking-tight">
                Subject Directives & Topics Library
              </h3>
              <p className="text-xs text-text-secondary">
                Pre-configured cognitive modules with 1-click deep work launches.
              </p>
            </div>
            <button
              onClick={() => handleOpenPresetModal()}
              className="text-xs font-semibold px-4 py-2 rounded-full bg-accent text-cream hover:bg-accent-hover transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Subject Directive</span>
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
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-accent flex items-center justify-center">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenPresetModal(p)}
                        title="Edit Directive"
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-text-secondary transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      {p.isCustom && (
                        <button
                          onClick={() => handleDeletePreset(p.id)}
                          title="Delete Directive"
                          className="p-1.5 rounded-lg hover:bg-red-50 text-text-secondary hover:text-danger transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-text-primary mt-3 tracking-tight">
                    {p.subject}
                  </h4>
                  <p className="text-xs text-text-secondary mt-1 line-clamp-2">
                    {p.topic}
                  </p>

                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-[11px] font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {p.duration} mins
                    </span>
                    {p.isCustom && (
                      <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                        Custom
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleQuickLaunchPreset(p)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-accent hover:text-white border border-divider text-xs font-semibold text-text-primary transition-all flex items-center justify-center gap-1.5 active:scale-98"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Start Focus Session</span>
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
                {editingPresetId ? "Edit Subject Directive" : "Add Custom Subject Directive"}
              </h3>

              <div>
                <label className="block text-[11px] font-semibold text-text-secondary uppercase mb-1">
                  Subject Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Systems"
                  value={presetFormSubject}
                  onChange={(e) => setPresetFormSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-divider text-xs font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-text-secondary uppercase mb-1">
                  Topic / Sub-goal
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Raft Consensus Algorithm"
                  value={presetFormTopic}
                  onChange={(e) => setPresetFormTopic(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-divider text-xs font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-text-secondary mb-1 uppercase">
                  Default Duration (Minutes)
                </label>
                <input
                  type="number"
                  min={5}
                  max={360}
                  value={presetFormDuration}
                  onChange={(e) => setPresetFormDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-divider text-xs font-semibold outline-none"
                />
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
                  className="flex-1 py-2 rounded-full bg-accent text-cream text-xs font-semibold"
                >
                  Save Directive
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Study Task Modal */}
      <StudyEditorModal
        isOpen={!!editingTask}
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onStudyUpdated={handleStudyUpdated}
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
