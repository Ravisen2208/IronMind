"use client";

import React from "react";
import { Flame, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { appleEasing } from "../animations/MotionWrapper";
import { formatDate } from "@/lib/utils";

interface StreakCardProps {
  streak: number;
  lastCompletedDate: string | null;
}

export function StreakCard({ streak, lastCompletedDate }: StreakCardProps) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: appleEasing }}
      className="p-5 sm:p-6 rounded-3xl bg-surface border border-divider/70 shadow-subtle flex flex-col justify-between"
    >
      <div className="flex items-center justify-between">
        <div className="w-11 h-11 rounded-2xl bg-success-light text-success flex items-center justify-center">
          <Flame className="w-5 h-5 fill-success/20" />
        </div>
        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full border text-success bg-success-light/70 border-success/30">
          Consistency
        </span>
      </div>

      <div className="mt-4">
        <div className="text-xs uppercase font-bold tracking-wider text-text-secondary">
          Daily Streak
        </div>
        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="text-3xl font-bold text-text-primary tracking-tight">
            {streak}
          </span>
          <span className="text-xs font-medium text-text-secondary">
            {streak === 1 ? "day" : "days"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-text-secondary mt-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>Last active: {formatDate(lastCompletedDate)}</span>
        </div>
      </div>
    </motion.div>
  );
}
