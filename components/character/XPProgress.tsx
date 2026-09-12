"use client";

import React from "react";
import { motion } from "framer-motion";
import { appleEasing } from "../animations/MotionWrapper";

interface XPProgressProps {
  currentXp: number;
  xpRequired: number;
  progressPercent: number;
  className?: string;
}

export function XPProgress({
  currentXp,
  xpRequired,
  progressPercent,
  className = "",
}: XPProgressProps) {
  const safePercent = Math.max(0, Math.min(100, Math.round(progressPercent)));

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      <div className="flex justify-between items-center text-xs font-semibold">
        <span className="text-text-secondary">Progress to Next Level</span>
        <span className="text-accent font-bold">
          {currentXp.toLocaleString()} / {xpRequired.toLocaleString()} XP ({safePercent}%)
        </span>
      </div>

      <div
        role="progressbar"
        aria-valuenow={safePercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`XP Progress: ${safePercent}% towards next level`}
        className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-divider/60 relative"
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${safePercent}%` }}
          transition={{ duration: 0.85, ease: appleEasing }}
          className="h-full bg-gradient-to-r from-accent to-accent-hover rounded-full shadow-sm relative"
        >
          {/* Subtle light shine on progress bar */}
          <div className="absolute top-0 right-0 bottom-0 w-3 bg-white/30 rounded-full" />
        </motion.div>
      </div>
    </div>
  );
}
