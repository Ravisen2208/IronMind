"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Sparkles, Zap, Flame } from "lucide-react";

export function WebsiteIntroLoader() {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [statusText, setStatusText] = useState("Initializing Cognitive Core...");

  useEffect(() => {
    setMounted(true);

    // Fast, ultra-smooth 500ms intro
    const duration = 500;
    const interval = 16;
    const totalSteps = duration / interval;
    const step = 100 / totalSteps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + step, 100);

        if (next < 40) {
          setStatusText("Initializing Cognitive Core...");
        } else if (next < 80) {
          setStatusText("Calibrating RPG Directives...");
        } else {
          setStatusText("IronMind Ready • Welcome");
        }

        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsDone(true);
          }, 120);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const handleSkip = () => {
    setIsDone(true);
  };

  if (!mounted) return null;

  return (
    <AnimatePresence mode="wait">
      {!isDone && (
        <motion.div
          key="ironmind-intro-loader"
          initial={{ opacity: 1, y: "0%" }}
          exit={{
            y: "-100%",
            opacity: 0.95,
            transition: { duration: 0.55, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[10000] bg-[#0A0B0F] text-[#FAF7F2] flex flex-col justify-between p-6 sm:p-12 select-none overflow-hidden"
        >
          {/* Ambient Glow Orbs */}
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-amber-500/15 blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-purple-600/15 blur-[120px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-amber-400/10 blur-[150px] pointer-events-none" />

          {/* Top Brand & Skip Button */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black shadow-[0_0_20px_rgba(251,191,36,0.35)]">
                <Shield className="w-5 h-5 fill-black/20 text-black" />
              </div>
              <div>
                <span className="text-base sm:text-lg font-heading font-extrabold tracking-tight text-white block">
                  IronMind
                </span>
                <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-amber-400/90">
                  Cognitive System
                </span>
              </div>
            </div>

            <button
              onClick={handleSkip}
              className="text-xs font-mono font-bold tracking-wider px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white border border-white/10 transition-all active:scale-95 flex items-center gap-1.5"
            >
              <span>SKIP</span>
              <Zap className="w-3 h-3 text-amber-400" />
            </button>
          </div>

          {/* Center Graphic & Slogan */}
          <div className="relative z-10 my-auto text-center max-w-3xl mx-auto space-y-6 flex flex-col items-center">
            {/* Concentric Rotating Energy Rings */}
            <div className="relative w-28 h-28 flex items-center justify-center mb-2">
              {/* Outer rotating ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-amber-400/40"
              />
              {/* Counter-rotating ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 rounded-full border border-purple-500/40"
              />
              {/* Pulsing Core */}
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 flex items-center justify-center text-black shadow-[0_0_30px_rgba(251,191,36,0.6)]"
              >
                <Sparkles className="w-7 h-7 text-black fill-black/20" />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-xs font-semibold text-amber-300 uppercase tracking-widest"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>RPG Progression System</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-4xl sm:text-6xl md:text-7xl font-heading font-black tracking-tight leading-[1.05] text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-amber-400"
            >
              Train your mind.
              <br />
              Become stronger.
            </motion.h1>

            <motion.p
              key={statusText}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-xs sm:text-sm font-mono text-zinc-400 tracking-wider h-5"
            >
              {statusText}
            </motion.p>
          </div>

          {/* Bottom Progress Counter */}
          <div className="relative z-10 flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4 border-t border-white/10 pt-6">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              {/* Progress bar */}
              <div className="h-1.5 flex-1 sm:w-64 bg-white/10 rounded-full overflow-hidden relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 rounded-full shadow-[0_0_12px_rgba(251,191,36,0.8)]"
                  style={{ width: `${Math.round(progress)}%` }}
                />
              </div>
              <span className="text-3xl font-serif font-bold text-amber-400 min-w-[70px] font-mono text-right">
                {Math.round(progress)}%
              </span>
            </div>

            <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest">
              IronMind Cognitive Engine &copy; {new Date().getFullYear()}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
