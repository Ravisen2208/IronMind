"use client";

import React from "react";
import { UserStats } from "@/context/AuthContext";
import { XPProgress } from "./XPProgress";
import { getXpRequiredForLevel } from "@/lib/progression";
import { Shield, Sparkles, UserCheck } from "lucide-react";
import { motion } from "framer-motion";
import { appleEasing } from "../animations/MotionWrapper";

interface CharacterCardProps {
  stats: UserStats;
  isLeveledUp?: boolean;
}

export function CharacterCard({ stats, isLeveledUp = false }: CharacterCardProps) {
  const xpRequired = getXpRequiredForLevel(stats.level);
  const progressPercent = Math.min(100, Math.round((stats.xp / xpRequired) * 100));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: isLeveledUp ? [1, 1.02, 1] : 1,
      }}
      transition={{ duration: 0.6, ease: appleEasing }}
      className={`relative w-full rounded-3xl bg-surface p-6 sm:p-8 border ${
        isLeveledUp ? "border-accent shadow-float glow-accent" : "border-divider/70 shadow-card"
      } transition-all duration-500`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Avatar & Identity */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-accent to-accent-hover text-cream flex items-center justify-center shadow-md">
              <Shield className="w-8 h-8 sm:w-10 sm:h-10 fill-cream/20" />
            </div>
            <div className="absolute -bottom-2 -right-1 px-2 py-0.5 rounded-full bg-accent-light border border-accent/20 text-accent font-bold text-[11px] shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Lv.{stats.level}</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-text-primary tracking-tight">
                {stats.email ? stats.email.split("@")[0] : "IronMind Warrior"}
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-success-light text-success text-xs font-semibold border border-success/20">
                <UserCheck className="w-3 h-3" />
                Active
              </span>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
              Rank: {getRankTitle(stats.level)} • {stats.attributes.intellect} INT / {stats.attributes.willpower} WIL
            </p>
          </div>
        </div>

        {/* Level & XP Detail Block */}
        <div className="w-full md:max-w-lg lg:max-w-xl xl:max-w-2xl">
          <XPProgress
            currentXp={stats.xp}
            xpRequired={xpRequired}
            progressPercent={progressPercent}
          />
        </div>
      </div>
    </motion.div>
  );
}

function getRankTitle(level: number): string {
  if (level >= 30) return "Master of Will";
  if (level >= 20) return "Disciplined Architect";
  if (level >= 10) return "Vanguard Adept";
  if (level >= 5) return "Focused Practitioner";
  return "Apprentice of Iron";
}
