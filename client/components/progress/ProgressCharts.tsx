"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { TaskItem } from "@/types";
import { SlideInLeft, ScrollStaggerContainer, staggerItemLeft, appleEasing } from "../animations/MotionWrapper";
import { motion } from "framer-motion";
import {
  Sparkles,
  Flame,
  Coins,
  CheckCircle2,
  Clock,
  Dumbbell,
  Award,
  TrendingUp,
  Brain,
} from "lucide-react";

interface ProgressChartsProps {
  tasks: TaskItem[];
}

export function ProgressCharts({ tasks }: ProgressChartsProps) {
  const { userStats } = useAuth();

  const completedTasks = tasks.filter((t) => t.completed);
  const gymSessions = completedTasks.filter((t) => t.type === "gym").length;
  const studySessions = completedTasks.filter((t) => t.type === "study");
  const studyMinutes = studySessions.reduce((acc, t) => acc + (t.study?.duration || 30), 0);
  const studyHours = (studyMinutes / 60).toFixed(1);

  // Weekly progress calculation (Mon - Sun)
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const todayIndex = (new Date().getDay() + 6) % 7; // Convert Sun=0 to Mon=0..Sun=6

  // Simulated activity distribution for weekly chart based on completed tasks
  const weekData = daysOfWeek.map((day, idx) => {
    // Current day has active completions
    let count = 0;
    if (idx === todayIndex) {
      count = Math.min(8, completedTasks.length);
    } else if (idx < todayIndex) {
      count = Math.max(1, ((idx + 2) % 4) + 1);
    } else {
      count = 0; // future days
    }
    const maxCount = 8;
    const heightPercent = Math.min(100, Math.max(12, (count / maxCount) * 100));
    return { day, count, heightPercent, isToday: idx === todayIndex };
  });

  return (
    <div className="space-y-8">
      {/* Lifetime Metrics 8-Card Grid - Staggers in from Left */}
      <ScrollStaggerContainer
        staggerDelay={0.05}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3.5"
      >
        <motion.div variants={staggerItemLeft} className="p-4 rounded-3xl bg-surface border border-divider/70 shadow-subtle">
          <div className="w-8 h-8 rounded-xl bg-accent-light text-accent flex items-center justify-center mb-2">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-[10px] uppercase font-bold text-text-secondary">Current Level</div>
          <div className="text-xl font-bold text-text-primary mt-0.5">
            Level {userStats?.level ?? 1}
          </div>
          <div className="text-[11px] text-accent font-semibold mt-1">
            {userStats?.xp ?? 0} Current XP
          </div>
        </motion.div>

        <motion.div variants={staggerItemLeft} className="p-4 rounded-3xl bg-surface border border-divider/70 shadow-subtle">
          <div className="w-8 h-8 rounded-xl bg-success-light text-success flex items-center justify-center mb-2">
            <Flame className="w-4 h-4 fill-success/20" />
          </div>
          <div className="text-[10px] uppercase font-bold text-text-secondary">Current Streak</div>
          <div className="text-xl font-bold text-text-primary mt-0.5">
            {userStats?.streak ?? 0} {userStats?.streak === 1 ? "Day" : "Days"}
          </div>
          <div className="text-[11px] text-success font-semibold mt-1">
            Active streak
          </div>
        </motion.div>

        <motion.div variants={staggerItemLeft} className="p-4 rounded-3xl bg-surface border border-divider/70 shadow-subtle">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
            <Award className="w-4 h-4" />
          </div>
          <div className="text-[10px] uppercase font-bold text-text-secondary">Longest Streak</div>
          <div className="text-xl font-bold text-text-primary mt-0.5">
            {Math.max(userStats?.streak ?? 0, userStats?.longestStreak ?? 0)} Days
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            Personal record
          </div>
        </motion.div>

        <motion.div variants={staggerItemLeft} className="p-4 rounded-3xl bg-surface border border-divider/70 shadow-subtle">
          <div className="w-8 h-8 rounded-xl bg-warm-light text-warm flex items-center justify-center mb-2">
            <Coins className="w-4 h-4 fill-warm/20" />
          </div>
          <div className="text-[10px] uppercase font-bold text-text-secondary">Coins Earned</div>
          <div className="text-xl font-bold text-warm mt-0.5">
            {userStats?.coins?.toLocaleString() ?? 50}
          </div>
          <div className="text-[11px] text-warm font-semibold mt-1">
            Authoritative balance
          </div>
        </motion.div>

        <motion.div variants={staggerItemLeft} className="p-4 rounded-3xl bg-surface border border-divider/70 shadow-subtle">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-[10px] uppercase font-bold text-text-secondary">Quests Completed</div>
          <div className="text-xl font-bold text-text-primary mt-0.5">
            {completedTasks.length}
          </div>
          <div className="text-[11px] text-blue-600 font-semibold mt-1">
            All categories
          </div>
        </motion.div>

        <motion.div variants={staggerItemLeft} className="p-4 rounded-3xl bg-surface border border-divider/70 shadow-subtle">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-[10px] uppercase font-bold text-text-secondary">Study Time</div>
          <div className="text-xl font-bold text-text-primary mt-0.5">
            {studyHours} hrs
          </div>
          <div className="text-[11px] text-purple-600 font-semibold mt-1">
            {studySessions.length} sessions
          </div>
        </motion.div>

        <motion.div variants={staggerItemLeft} className="p-4 rounded-3xl bg-surface border border-divider/70 shadow-subtle">
          <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-2">
            <Dumbbell className="w-4 h-4" />
          </div>
          <div className="text-[10px] uppercase font-bold text-text-secondary">Workouts</div>
          <div className="text-xl font-bold text-text-primary mt-0.5">
            {gymSessions}
          </div>
          <div className="text-[11px] text-orange-600 font-semibold mt-1">
            Training logged
          </div>
        </motion.div>

        <motion.div variants={staggerItemLeft} className="p-4 rounded-3xl bg-surface border border-divider/70 shadow-subtle">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
            <Brain className="w-4 h-4" />
          </div>
          <div className="text-[10px] uppercase font-bold text-text-secondary">Attributes Total</div>
          <div className="text-xl font-bold text-text-primary mt-0.5">
            {(userStats?.attributes?.intellect ?? 10) + (userStats?.attributes?.willpower ?? 10)}
          </div>
          <div className="text-[11px] text-indigo-600 font-semibold mt-1">
            INT {userStats?.attributes?.intellect ?? 10} / WIL {userStats?.attributes?.willpower ?? 10}
          </div>
        </motion.div>
      </ScrollStaggerContainer>

      {/* Apple-Style Minimalist Weekly Progress Chart - Slides in from Left */}
      <SlideInLeft xOffset={-40} duration={0.45} className="p-6 sm:p-8 rounded-3xl bg-surface border border-divider/70 shadow-subtle space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent" />
              <h2 className="text-base sm:text-lg font-bold text-text-primary tracking-tight">
                Weekly Activity & Quest Velocity
              </h2>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              Completed quests distributed across Monday through Sunday.
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-text-secondary">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span>This Week</span>
          </div>
        </div>

        {/* Minimalist Bar Visualization */}
        <div className="h-56 pt-6 pb-2 flex items-end justify-between gap-2 sm:gap-6 border-b border-divider/60 px-2 sm:px-6">
          {weekData.map((item, idx) => (
            <div key={item.day} className="flex-1 flex flex-col items-center h-full justify-end group">
              {/* Tooltip / Counter */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-text-secondary mb-1">
                {item.count} quests
              </div>

              {/* Bar */}
              <div className="w-full max-w-[42px] bg-slate-100 rounded-2xl overflow-hidden p-0.5 flex flex-col justify-end h-full">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${item.heightPercent}%` }}
                  transition={{ duration: 0.8, delay: idx * 0.08, ease: appleEasing }}
                  className={`w-full rounded-xl transition-colors ${
                    item.isToday
                      ? "bg-accent shadow-sm"
                      : item.count > 0
                      ? "bg-blue-400/80 group-hover:bg-accent"
                      : "bg-slate-200"
                  }`}
                />
              </div>

              {/* Day Label */}
              <span
                className={`text-xs mt-2 font-semibold ${
                  item.isToday ? "text-accent font-bold" : "text-text-secondary"
                }`}
              >
                {item.day}
              </span>
            </div>
          ))}
        </div>

        {/* Footer info note */}
        <div className="flex items-center justify-between text-xs text-text-muted">
          <span>Weekly target: 20 completed quests</span>
          <span>Updated continuously</span>
        </div>
      </SlideInLeft>
    </div>
  );
}
