"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { CharacterCard } from "@/components/character/CharacterCard";
import { StatCard } from "@/components/character/StatCard";
import { StreakCard } from "@/components/dashboard/StreakCard";
import { CoinBalance } from "@/components/dashboard/CoinBalance";
import { QuestForm } from "@/components/quests/QuestForm";
import { QuestCard } from "@/components/quests/QuestCard";
import { LevelUpModal } from "@/components/animations/LevelUpModal";
import { DashboardSkeleton } from "@/components/ui/LoadingSkeleton";
import { useToast } from "@/components/ui/Toast";
import { apiRequest } from "@/lib/api";
import { TaskItem, CompletionResponse } from "@/types";
import { FadeIn, StaggerContainer, staggerItem } from "@/components/animations/MotionWrapper";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  Dumbbell,
  GraduationCap,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Plus,
} from "lucide-react";

export default function DashboardPage() {
  const { user, userStats, loading, isDemoMode, updateLocalStats } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [levelUpState, setLevelUpState] = useState<{ isOpen: boolean; newLevel: number }>({
    isOpen: false,
    newLevel: 1,
  });
  const [isHighlightLevel, setIsHighlightLevel] = useState(false);

  useEffect(() => {
    if (!loading && !user && !isDemoMode) {
      router.push("/login");
    }
  }, [user, isDemoMode, loading, router]);

  const fetchTasks = useCallback(async () => {
    setTasksLoading(true);
    const res = await apiRequest<{ success: boolean; tasks: TaskItem[] }>("/api/tasks");
    if (res.success && res.data?.tasks) {
      setTasks(res.data.tasks);
    }
    setTasksLoading(false);
  }, []);

  useEffect(() => {
    if (user || isDemoMode) {
      fetchTasks();
    }
  }, [user, isDemoMode, fetchTasks]);

  const handleQuestCreated = (newTask: TaskItem) => {
    setTasks((prev) => [newTask, ...prev]);
    setIsQuickCreateOpen(false);
  };

  const handleCompleteQuest = (taskId: string, result: CompletionResponse) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? result.task : t)));
    updateLocalStats(result.updatedProfile);
    showToast(
      `Quest Completed! +${result.progression.xpGained} XP, +${result.coinsEarned} Coins.`,
      "success"
    );

    if (result.progression.leveledUp) {
      setLevelUpState({
        isOpen: true,
        newLevel: result.progression.newLevel,
      });
      setIsHighlightLevel(true);
      setTimeout(() => setIsHighlightLevel(false), 3000);
    }
  };

  const handleDeleteQuest = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    showToast("Quest removed from log.", "info");
  };

  if (loading || !userStats) {
    return <DashboardSkeleton />;
  }

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);
  const totalToday = tasks.length;
  const completedToday = completedTasks.length;
  const todayProgressPercent = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-6 sm:py-10 space-y-8">
      {/* Top Header */}
      <FadeIn yOffset={10} duration={0.5} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif tracking-tight text-text-primary">
            Overview & Progression
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Train your mind. Complete your quests. Become stronger.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isDemoMode && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-light text-accent text-xs font-semibold border border-accent/20">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span>Demo Sandbox</span>
            </div>
          )}

          <button
            onClick={() => setIsQuickCreateOpen(!isQuickCreateOpen)}
            className="text-xs font-semibold px-4 py-2 rounded-full bg-accent text-cream hover:bg-accent-hover transition-all active:scale-95 shadow-sm flex items-center gap-1.5 uppercase tracking-wide"
          >
            <Plus className="w-4 h-4" />
            <span>{isQuickCreateOpen ? "Close" : "Quick Quest"}</span>
          </button>
        </div>
      </FadeIn>

      {/* Main Character Hero Card */}
      <CharacterCard stats={userStats} isLeveledUp={isHighlightLevel} />

      {/* Quick Quest Form Drawer */}
      <AnimatePresence>
        {isQuickCreateOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            <QuestForm onQuestCreated={handleQuestCreated} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Attributes & Stats 4-Column Grid */}
      <StaggerContainer
        staggerDelay={0.08}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={staggerItem}>
          <StatCard
            type="intellect"
            value={userStats.attributes.intellect}
            description="Expands cognitive horsepower, deep work, and learning retention."
          />
        </motion.div>

        <motion.div variants={staggerItem}>
          <StatCard
            type="willpower"
            value={userStats.attributes.willpower}
            description="Fortifies resistance to impulse, workout consistency, and grit."
          />
        </motion.div>

        <motion.div variants={staggerItem}>
          <StreakCard
            streak={userStats.streak}
            lastCompletedDate={userStats.lastCompletedDate}
          />
        </motion.div>

        <motion.div variants={staggerItem}>
          <CoinBalance coins={userStats.coins} />
        </motion.div>
      </StaggerContainer>

      {/* Today's Progress Banner */}
      <div className="p-6 rounded-3xl bg-surface border border-divider/70 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-success-light text-success flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs uppercase font-bold text-text-secondary tracking-wider">
              Today&apos;s Quest Completion
            </div>
            <div className="text-xl font-bold text-text-primary mt-0.5">
              {completedToday} of {totalToday} Quests Finished ({todayProgressPercent}%)
            </div>
          </div>
        </div>

        {/* Quick Module Shortcut Pills */}
        <div className="flex items-center gap-2">
          <Link
            href="/gym"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-divider text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-slate-50 transition-all active:scale-95"
          >
            <Dumbbell className="w-3.5 h-3.5 text-warm" />
            <span>Gym</span>
          </Link>
          <Link
            href="/study"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-divider text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-slate-50 transition-all active:scale-95"
          >
            <GraduationCap className="w-3.5 h-3.5 text-accent" />
            <span>Study</span>
          </Link>
          <Link
            href="/quests"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-100 text-xs font-semibold text-text-primary hover:bg-slate-200 transition-all active:scale-95"
          >
            <span>All Quests</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Priority Active Quests Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-accent" />
            <h2 className="text-lg font-bold text-text-primary tracking-tight">
              Active Quests ({activeTasks.length})
            </h2>
          </div>

          <Link
            href="/quests"
            className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
          >
            <span>Open Quest Manager</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {tasksLoading ? (
          <div className="space-y-3">
            <div className="h-20 rounded-3xl bg-slate-200 animate-pulse" />
            <div className="h-20 rounded-3xl bg-slate-200 animate-pulse" />
          </div>
        ) : activeTasks.length === 0 ? (
          <div className="p-8 rounded-3xl bg-surface border border-divider/60 text-center text-sm text-text-secondary">
            No active quests remaining. Great job clearing your queue today!
          </div>
        ) : (
          <div className="space-y-3">
            {activeTasks.slice(0, 5).map((t) => (
              <QuestCard
                key={t.id}
                task={t}
                onComplete={handleCompleteQuest}
                onDelete={handleDeleteQuest}
              />
            ))}
          </div>
        )}
      </div>

      {/* Level Up Celebration Modal */}
      <LevelUpModal
        isOpen={levelUpState.isOpen}
        newLevel={levelUpState.newLevel}
        onClose={() => setLevelUpState((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
