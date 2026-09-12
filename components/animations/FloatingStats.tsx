"use client";

import React from "react";
import { motion } from "framer-motion";
import { Flame, Brain, Dumbbell, Sparkles, Coins } from "lucide-react";
import { appleEasing } from "./MotionWrapper";

export function FloatingStats() {
  return (
    <div className="relative w-full max-w-lg mx-auto h-72 sm:h-80 flex items-center justify-center select-none pointer-events-none">
      {/* Central Emblem Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: appleEasing }}
        className="z-10 p-6 rounded-3xl bg-cream/95 backdrop-blur-xl border border-divider shadow-float text-center max-w-xs pointer-events-auto"
      >
        <div className="w-12 h-12 rounded-2xl bg-accent text-cream flex items-center justify-center mx-auto mb-3 shadow-glow">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="text-xs uppercase tracking-widest text-accent font-bold mb-0.5">
          IronMind Core
        </div>
        <h3 className="text-xl font-bold text-text-primary tracking-tight">
          Level 7 Adept
        </h3>
        <p className="text-xs text-text-secondary mt-1">
          740 / 850 XP to Next Milestone
        </p>
        <div className="w-full bg-warm-light h-2 rounded-full mt-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "87%" }}
            transition={{ duration: 1.2, delay: 0.4, ease: appleEasing }}
            className="h-full bg-accent rounded-full"
          />
        </div>
      </motion.div>

      {/* Floating Card 1: Streak (Top Left) */}
      <motion.div
        initial={{ opacity: 0, x: -30, y: -20 }}
        animate={{
          opacity: 1,
          x: 0,
          y: [0, -8, 0],
        }}
        transition={{
          opacity: { duration: 0.6, delay: 0.2 },
          x: { duration: 0.6, delay: 0.2 },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute top-2 left-2 sm:-left-4 p-3.5 rounded-2xl bg-cream/90 backdrop-blur-md border border-divider shadow-card flex items-center gap-3 pointer-events-auto"
      >
        <div className="w-9 h-9 rounded-xl bg-success-light text-success flex items-center justify-center">
          <Flame className="w-5 h-5 fill-success/20" />
        </div>
        <div>
          <div className="text-[10px] uppercase font-bold text-text-secondary">
            Daily Streak
          </div>
          <div className="text-sm font-bold text-text-primary">14 Days Clean</div>
        </div>
      </motion.div>

      {/* Floating Card 2: Willpower (Top Right) */}
      <motion.div
        initial={{ opacity: 0, x: 30, y: -15 }}
        animate={{
          opacity: 1,
          x: 0,
          y: [0, 8, 0],
        }}
        transition={{
          opacity: { duration: 0.6, delay: 0.3 },
          x: { duration: 0.6, delay: 0.3 },
          y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 },
        }}
        className="absolute top-6 right-2 sm:-right-4 p-3.5 rounded-2xl bg-cream/90 backdrop-blur-md border border-divider shadow-card flex items-center gap-3 pointer-events-auto"
      >
        <div className="w-9 h-9 rounded-xl bg-warm-light text-warm-dark flex items-center justify-center">
          <Dumbbell className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[10px] uppercase font-bold text-text-secondary">
            Willpower
          </div>
          <div className="text-sm font-bold text-text-primary">+1 Attribute</div>
        </div>
      </motion.div>

      {/* Floating Card 3: Intellect (Bottom Left) */}
      <motion.div
        initial={{ opacity: 0, x: -25, y: 25 }}
        animate={{
          opacity: 1,
          x: 0,
          y: [0, 7, 0],
        }}
        transition={{
          opacity: { duration: 0.6, delay: 0.4 },
          x: { duration: 0.6, delay: 0.4 },
          y: { duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
        }}
        className="absolute bottom-4 left-4 sm:left-0 p-3.5 rounded-2xl bg-cream/90 backdrop-blur-md border border-divider shadow-card flex items-center gap-3 pointer-events-auto"
      >
        <div className="w-9 h-9 rounded-xl bg-accent-light text-accent flex items-center justify-center">
          <Brain className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[10px] uppercase font-bold text-text-secondary">
            Intellect
          </div>
          <div className="text-sm font-bold text-text-primary">Deep Focus: 45m</div>
        </div>
      </motion.div>

      {/* Floating Card 4: Gold Coins (Bottom Right) */}
      <motion.div
        initial={{ opacity: 0, x: 25, y: 25 }}
        animate={{
          opacity: 1,
          x: 0,
          y: [0, -7, 0],
        }}
        transition={{
          opacity: { duration: 0.6, delay: 0.5 },
          x: { duration: 0.6, delay: 0.5 },
          y: { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 },
        }}
        className="absolute bottom-6 right-4 sm:right-0 p-3.5 rounded-2xl bg-cream/90 backdrop-blur-md border border-divider shadow-card flex items-center gap-3 pointer-events-auto"
      >
        <div className="w-9 h-9 rounded-xl bg-warm-light text-warm flex items-center justify-center">
          <Coins className="w-5 h-5 fill-warm/20" />
        </div>
        <div>
          <div className="text-[10px] uppercase font-bold text-text-secondary">
            Quest Coins
          </div>
          <div className="text-sm font-bold text-warm">+20 Earned</div>
        </div>
      </motion.div>
    </div>
  );
}
