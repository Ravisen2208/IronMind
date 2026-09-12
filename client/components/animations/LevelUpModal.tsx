"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowUp, X, Trophy } from "lucide-react";
import { appleEasing } from "./MotionWrapper";

interface LevelUpModalProps {
  isOpen: boolean;
  newLevel: number;
  onClose: () => void;
}

export function LevelUpModal({ isOpen, newLevel, onClose }: LevelUpModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{
              opacity: 1,
              scale: [0.9, 1.04, 1],
              y: 0,
            }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{
              duration: 0.5,
              ease: appleEasing,
            }}
            className="relative z-10 w-full max-w-md rounded-4xl bg-surface dark:bg-[#161824] p-6 sm:p-8 text-center border border-amber-500/30 dark:border-amber-400/50 shadow-[0_20px_60px_rgba(0,0,0,0.5)] dark:shadow-[0_0_80px_rgba(212,175,55,0.25)]"
          >
            <button
              onClick={onClose}
              aria-label="Close level up notice"
              className="absolute top-4 right-4 p-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing Icon Badge with Pulse Ring */}
            <div className="relative w-20 h-20 mx-auto mb-5">
              <div className="absolute inset-0 rounded-3xl bg-amber-400/30 animate-ping opacity-60" />
              <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 text-white flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.6)]">
                <Trophy className="w-10 h-10 stroke-[2.2]" />
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-700/60 text-[11px] uppercase font-extrabold tracking-widest text-amber-800 dark:text-amber-300 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Milestone Unlocked</span>
            </div>

            <h2 className="text-3xl font-heading font-extrabold text-text-primary dark:text-white tracking-tight">
              Level {newLevel} Reached!
            </h2>

            <p className="text-sm text-text-secondary dark:text-slate-300 mt-2.5 leading-relaxed">
              Your cognitive discipline and relentless questing have unlocked new stat thresholds.
            </p>

            <div className="mt-6 flex items-center justify-center gap-2 py-2.5 px-5 rounded-2xl bg-amber-500/10 dark:bg-amber-400/15 border border-amber-500/20 text-amber-800 dark:text-amber-300 font-bold text-xs mx-auto w-fit">
              <ArrowUp className="w-4 h-4 text-amber-500 stroke-[2.5]" />
              <span>Attributes &amp; Mental Capacity Increased</span>
            </div>

            <button
              onClick={onClose}
              className="mt-7 w-full py-3.5 px-6 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm tracking-wide uppercase shadow-[0_4px_20px_rgba(245,158,11,0.35)] transition-all active:scale-95"
            >
              Continue Questing
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
