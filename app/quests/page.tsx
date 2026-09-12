"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { TaskItem, CategoryItem, CompletionResponse, DEFAULT_CATEGORIES } from "@/types";
import { apiRequest } from "@/lib/api";
import { QuestCard } from "@/components/quests/QuestCard";
import { QuestForm } from "@/components/quests/QuestForm";
import { QuestEditorModal } from "@/components/quests/QuestEditorModal";
import { CategoryModal } from "@/components/quests/CategoryModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { LevelUpModal } from "@/components/animations/LevelUpModal";
import { useToast } from "@/components/ui/Toast";
import { FadeIn, StaggerContainer, staggerItem } from "@/components/animations/MotionWrapper";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  ListTodo,
  Calendar,
  Sparkles,
} from "lucide-react";

export default function MyQuestsPage() {
  const { user, userStats, isDemoMode, loading, updateLocalStats } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>(DEFAULT_CATEGORIES);
  const [tasksLoading, setTasksLoading] = useState(true);

  // Filters
  const [activeTab, setActiveTab] = useState<"all" | "active" | "completed">("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");

  // Modals
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [levelUpState, setLevelUpState] = useState<{ isOpen: boolean; newLevel: number }>({
    isOpen: false,
    newLevel: 1,
  });

  useEffect(() => {
    if (!loading && !user && !isDemoMode) {
      router.push("/login");
    }
  }, [user, isDemoMode, loading, router]);

  const loadData = useCallback(async () => {
    setTasksLoading(true);
    try {
      const [tasksRes, catsRes] = await Promise.all([
        apiRequest<{ success: boolean; tasks: TaskItem[] }>("/api/tasks"),
        apiRequest<{ success: boolean; categories: CategoryItem[] }>("/api/categories"),
      ]);

      if (tasksRes.success && tasksRes.data?.tasks) {
        setTasks(tasksRes.data.tasks);
      }
      if (catsRes.success && catsRes.data?.categories) {
        setCategories(catsRes.data.categories);
      }
    } finally {
      setTasksLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user || isDemoMode) {
      loadData();
    }
  }, [user, isDemoMode, loadData]);

  const handleQuestCreated = (task: TaskItem) => {
    setTasks((prev) => [task, ...prev]);
    setIsCreateOpen(false);
  };

  const handleQuestUpdated = (updated: TaskItem) => {
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setEditingTask(null);
  };

  const handleCompleteQuest = (taskId: string, result: CompletionResponse) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? result.task : t)));
    updateLocalStats(result.updatedProfile);
    showToast(`Quest Completed! +${result.progression.xpGained} XP`, "success");

    if (result.progression.leveledUp) {
      setLevelUpState({
        isOpen: true,
        newLevel: result.progression.newLevel,
      });
    }
  };

  const handleDeleteQuest = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    showToast("Quest deleted.", "info");
  };

  // Filter pipeline
  const filteredTasks = tasks.filter((t) => {
    if (activeTab === "active" && t.completed) return false;
    if (activeTab === "completed" && !t.completed) return false;
    if (selectedCategory !== "all" && t.category !== selectedCategory) return false;
    if (selectedPriority !== "all" && t.priority !== selectedPriority) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description?.toLowerCase().includes(q);
      const matchCat = t.category.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCat) return false;
    }
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <FadeIn yOffset={10} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
            My Quests
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Manage your daily quests, track due dates, and organize by categories.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="text-xs font-semibold px-4 py-2.5 rounded-full border border-divider bg-surface hover:bg-slate-50 text-text-primary transition-all active:scale-95 shadow-subtle"
          >
            + New Category
          </button>
          <button
            onClick={() => setIsCreateOpen(!isCreateOpen)}
            className="text-xs font-semibold px-4 py-2.5 rounded-full bg-accent text-white hover:bg-accent-hover transition-all active:scale-95 shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{isCreateOpen ? "Close Form" : "Create Quest"}</span>
          </button>
        </div>
      </FadeIn>

      {/* Quest Form Drawer */}
      <AnimatePresence>
        {isCreateOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <QuestForm onQuestCreated={handleQuestCreated} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-3xl bg-surface border border-divider/70 shadow-subtle space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search quests by title, tag, or notes..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-divider bg-slate-50 text-text-primary text-xs focus:bg-white transition-all outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl border border-divider bg-slate-50 text-text-primary text-xs font-semibold focus:bg-white transition-all outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-3 py-2 rounded-xl border border-divider bg-slate-50 text-text-primary text-xs font-semibold focus:bg-white transition-all outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* Segmented Tab Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-divider/50">
          <div className="flex items-center gap-1 p-1 rounded-full bg-slate-100/90 border border-divider/60">
            <button
              onClick={() => setActiveTab("active")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === "active"
                  ? "bg-white text-text-primary shadow-subtle"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Active ({tasks.filter((t) => !t.completed).length})
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === "completed"
                  ? "bg-white text-text-primary shadow-subtle"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Completed ({tasks.filter((t) => t.completed).length})
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === "all"
                  ? "bg-white text-text-primary shadow-subtle"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              All ({tasks.length})
            </button>
          </div>

          <span className="hidden sm:inline text-xs text-text-muted font-medium">
            Showing {filteredTasks.length} quests
          </span>
        </div>
      </div>

      {/* Quests List */}
      {tasksLoading ? (
        <div className="space-y-3">
          <div className="h-20 rounded-3xl bg-slate-200 animate-pulse" />
          <div className="h-20 rounded-3xl bg-slate-200 animate-pulse" />
          <div className="h-20 rounded-3xl bg-slate-200 animate-pulse" />
        </div>
      ) : filteredTasks.length === 0 ? (
        <EmptyState
          type={activeTab === "completed" ? "completed" : "active"}
          actionText="Create a Quest"
          onAction={() => setIsCreateOpen(true)}
        />
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredTasks.map((task) => (
              <QuestCard
                key={task.id}
                task={task}
                onComplete={handleCompleteQuest}
                onEdit={(t) => setEditingTask(t)}
                onDelete={handleDeleteQuest}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Edit Quest Modal */}
      <QuestEditorModal
        isOpen={Boolean(editingTask)}
        task={editingTask}
        categories={categories}
        onClose={() => setEditingTask(null)}
        onQuestUpdated={handleQuestUpdated}
      />

      {/* Custom Category Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onCategoryCreated={(newCat) => setCategories((prev) => [...prev, newCat])}
      />

      {/* Level Up Celebration Modal */}
      <LevelUpModal
        isOpen={levelUpState.isOpen}
        newLevel={levelUpState.newLevel}
        onClose={() => setLevelUpState((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
