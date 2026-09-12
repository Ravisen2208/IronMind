"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowUp, X } from "lucide-react";
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Subtle backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{
              opacity: 1,
              scale: [0.96, 1.03, 1],
            }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{
              duration: 0.65,
              ease: appleEasing,
            }}
            className="relative z-10 w-full max-w-sm rounded-3xl bg-surface p-6 sm:p-8 text-center border border-accent/30 shadow-float glow-accent"
          >
            <button
              onClick={onClose}
              aria-label="Close level up notice"
              className="absolute top-4 right-4 p-1 rounded-full text-text-secondary hover:text-text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing Icon Badge */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-accent to-accent-hover text-white flex items-center justify-center mx-auto mb-4 shadow-glow">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="text-xs uppercase font-bold tracking-widest text-accent mb-1">
              Milestone Achieved
            </div>
            <h2 className="text-2xl font-bold text-text-primary tracking-tight">
              Level {newLevel} Unlocked
            </h2>

            <p className="text-sm text-text-secondary mt-2 leading-relaxed">
              Your dedication continues to reshape your capacity. Your stats have been permanently enhanced.
            </p>

            <div className="mt-6 flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-accent-light/50 text-accent font-semibold text-xs mx-auto w-fit">
              <ArrowUp className="w-4 h-4" />
              <span>Attributes & Capacity Increased</span>
            </div>

            <button
              onClick={onClose}
              className="mt-6 w-full py-3 px-6 rounded-full bg-accent hover:bg-accent-hover text-white text-sm font-semibold shadow-sm transition-all active:scale-95"
            >
              Continue Questing
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
