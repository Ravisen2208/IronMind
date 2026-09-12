"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth, UserStats } from "@/context/AuthContext";
import { CharacterCard } from "@/components/character/CharacterCard";
import { StatCard } from "@/components/character/StatCard";
import { StreakCard } from "@/components/dashboard/StreakCard";
import { CoinBalance } from "@/components/dashboard/CoinBalance";
import { QuestForm } from "@/components/quests/QuestForm";
import { QuestList } from "@/components/quests/QuestList";
import { CompletedQuestList } from "@/components/quests/CompletedQuestList";
import { LevelUpModal } from "@/components/animations/LevelUpModal";
import { DashboardSkeleton } from "@/components/ui/LoadingSkeleton";
import { useToast } from "@/components/ui/Toast";
import { apiRequest } from "@/lib/api";
import { TaskItem, CompletionResponse } from "@/lib/db";
import { FadeIn, StaggerContainer, staggerItem } from "@/components/animations/MotionWrapper";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { user, userStats, loading, isDemoMode, updateLocalStats } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [levelUpState, setLevelUpState] = useState<{ isOpen: boolean; newLevel: number }>({
    isOpen: false,
    newLevel: 1,
  });
  const [isHighlightLevel, setIsHighlightLevel] = useState(false);

  // Authentication guard
  useEffect(() => {
    if (!loading && !user && !isDemoMode) {
      router.push("/");
    }
  }, [user, isDemoMode, loading, router]);

  // Fetch tasks
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
  };

  const handleCompleteQuest = (taskId: string, result: CompletionResponse) => {
    // Update tasks state
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? result.task : t))
    );

    // Update user stats
    updateLocalStats(result.updatedProfile);

    // Toast notification
    showToast(
      `Quest Completed! +${result.progression.xpGained} XP, +${result.coinsEarned} Coins.`,
      "success"
    );

    // Check for level-up
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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Top Header / Welcome */}
      <FadeIn yOffset={10} duration={0.5} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
            Character Progression
          </h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Train your mind. Complete your quests. Become stronger.
          </p>
        </div>

        {isDemoMode && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-light text-accent text-xs font-semibold self-start sm:self-auto border border-accent/20">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span>Active Demo Sandbox</span>
          </div>
        )}
      </FadeIn>

      {/* Main Character Hero Card */}
      <CharacterCard stats={userStats} isLeveledUp={isHighlightLevel} />

      {/* Attributes & Stats 4-Column Grid */}
      <StaggerContainer
        staggerDelay={0.08}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={staggerItem}>
          <StatCard
            type="intellect"
            value={userStats.attributes.intellect}
            description="Amplifies mental capacity, learning retention, and problem analysis."
          />
        </motion.div>

        <motion.div variants={staggerItem}>
          <StatCard
            type="willpower"
            value={userStats.attributes.willpower}
            description="Increases resistance to friction, sustained focus, and discipline."
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

      {/* Quest Creation Form */}
      <FadeIn yOffset={15} delay={0.2}>
        <QuestForm onQuestCreated={handleQuestCreated} />
      </FadeIn>

      {/* Quests Section */}
      <FadeIn yOffset={15} delay={0.3} className="space-y-8">
        {tasksLoading ? (
          <div className="space-y-3">
            <div className="h-6 w-36 rounded-lg bg-slate-200 animate-pulse" />
            <div className="h-20 rounded-2xl bg-slate-200 animate-pulse" />
            <div className="h-20 rounded-2xl bg-slate-200 animate-pulse" />
          </div>
        ) : (
          <>
            <QuestList
              tasks={activeTasks}
              onCompleteQuest={handleCompleteQuest}
              onDeleteQuest={handleDeleteQuest}
              onOpenCreate={() => {
                window.scrollTo({ top: 400, behavior: "smooth" });
              }}
            />

            <CompletedQuestList
              tasks={completedTasks}
              onDeleteQuest={handleDeleteQuest}
            />
          </>
        )}
      </FadeIn>

      {/* Level Up Celebration Modal */}
      <LevelUpModal
        isOpen={levelUpState.isOpen}
        newLevel={levelUpState.newLevel}
        onClose={() => setLevelUpState((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
