"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield } from "lucide-react";

export function WebsiteIntroLoader() {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    // Check if intro has already been shown in this session
    const hasSeenIntro = sessionStorage.getItem("ironmind_intro_seen");
    if (hasSeenIntro) {
      setShowLoader(false);
      return;
    }

    // Increment progress counter from 0 to 100
    const duration = 1600; // ms
    const interval = 20;
    const step = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev + step >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsDone(true);
            sessionStorage.setItem("ironmind_intro_seen", "true");
          }, 300);
          return 100;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  if (!showLoader) return null;

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ y: "0%" }}
          exit={{
            y: "-100%",
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[10000] bg-[#14161b] text-[#FAF7F2] flex flex-col justify-between p-8 sm:p-14 select-none overflow-hidden"
        >
          {/* Top Brand & Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-accent flex items-center justify-center text-cream shadow-glow">
                <Shield className="w-5 h-5 fill-cream/20" />
              </div>
              <div>
                <span className="text-base font-serif tracking-tight text-white block">
                  IronMind
                </span>
                <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-bronze">
                  Cognitive System
                </span>
              </div>
            </div>

            <div className="text-xs font-mono font-bold tracking-widest text-bronze uppercase">
              Initializing...
            </div>
          </div>

          {/* Center Title & Slogan */}
          <div className="my-auto text-center max-w-4xl mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-bronze uppercase tracking-widest"
            >
              <span>RPG Progression System</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-7xl font-serif tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-cream via-amber-100 to-accent"
            >
              Train your mind.
              <br />
              Become stronger.
            </motion.h1>

            <p className="text-xs sm:text-sm font-mono text-zinc-400 tracking-wider uppercase">
              Task Gamification • AI Quests • Habit Streaks • Level Progression
            </p>
          </div>

          {/* Bottom Progress Counter */}
          <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4 border-t border-white/10 pt-6">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              {/* Progress bar */}
              <div className="h-1 flex-1 sm:w-48 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-accent rounded-full"
                  style={{ width: `${Math.round(progress)}%` }}
                />
              </div>
              <span className="text-2xl font-serif font-bold text-accent min-w-[60px] font-mono text-right">
                {Math.round(progress)}%
              </span>
            </div>

            <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest">
              Silvia Sguotti Motion Suite &copy; {new Date().getFullYear()}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
