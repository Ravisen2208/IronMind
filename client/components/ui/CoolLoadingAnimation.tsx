"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Sparkles, Flame, Zap } from "lucide-react";

interface CoolLoaderProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  showProgress?: boolean;
  className?: string;
}

const DEFAULT_PHRASES = [
  "Synchronizing Neural Directives...",
  "Calibrating Cognitive XP...",
  "Optimizing RPG Streaks...",
  "Loading Focus Modules...",
  "Powering IronMind Core...",
];

export function CoolLoadingSpinner({
  size = "md",
  text,
  showProgress = true,
  className = "",
}: CoolLoaderProps) {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    if (text) return;
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % DEFAULT_PHRASES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [text]);

  const sizeStyles = {
    sm: {
      container: "w-16 h-16",
      core: "w-8 h-8 rounded-xl",
      icon: "w-4 h-4",
      ring1: "inset-0 border",
      ring2: "inset-1 border",
      text: "text-xs",
    },
    md: {
      container: "w-24 h-24",
      core: "w-12 h-12 rounded-2xl",
      icon: "w-6 h-6",
      ring1: "inset-0 border-2",
      ring2: "inset-2 border",
      text: "text-xs sm:text-sm",
    },
    lg: {
      container: "w-32 h-32",
      core: "w-16 h-16 rounded-3xl",
      icon: "w-8 h-8",
      ring1: "inset-0 border-2",
      ring2: "inset-3 border",
      text: "text-sm sm:text-base",
    },
  };

  const currentSize = sizeStyles[size];
  const displayText = text || DEFAULT_PHRASES[phraseIndex];

  return (
    <div className={`flex flex-col items-center justify-center p-6 select-none ${className}`}>
      {/* Central Rotating Quantum Reactor Orb */}
      <div className={`relative ${currentSize.container} flex items-center justify-center`}>
        {/* Background Ambient Glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500/20 via-purple-600/20 to-amber-500/20 blur-xl animate-pulse" />

        {/* Outer Rotating Energy Ring 1 */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className={`absolute ${currentSize.ring1} rounded-full border-dashed border-amber-400/50 dark:border-amber-400/60 pointer-events-none`}
        />

        {/* Inner Counter-Rotating Ring 2 */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
          className={`absolute ${currentSize.ring2} rounded-full border-purple-500/40 dark:border-indigo-400/50 pointer-events-none`}
        />

        {/* Pulsing Core Badge */}
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            boxShadow: [
              "0 0 15px rgba(251,191,36,0.4)",
              "0 0 30px rgba(251,191,36,0.7)",
              "0 0 15px rgba(251,191,36,0.4)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className={`${currentSize.core} bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-black flex items-center justify-center shadow-lg relative z-10`}
        >
          <Sparkles className={`${currentSize.icon} text-black fill-black/20`} />
        </motion.div>

        {/* Orbiting Satellite Particle 1 */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 flex items-start justify-center"
        >
          <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24] -mt-1" />
        </motion.div>

        {/* Orbiting Satellite Particle 2 */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 flex items-end justify-center"
        >
          <div className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8] -mb-1" />
        </motion.div>
      </div>

      {/* Dynamic Status Text */}
      <div className="mt-4 text-center space-y-1">
        <motion.p
          key={displayText}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.3 }}
          className={`font-heading font-bold text-text-primary tracking-tight ${currentSize.text}`}
        >
          {displayText}
        </motion.p>

        {showProgress && (
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-text-secondary">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>Processing Real-time Pipeline</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function FullPageRpgLoader({ text }: { text?: string }) {
  return (
    <div className="min-h-[60vh] w-full flex items-center justify-center px-4">
      <div className="relative p-8 sm:p-12 rounded-4xl bg-surface/90 backdrop-blur-2xl border border-divider/80 shadow-warm max-w-md w-full text-center">
        <CoolLoadingSpinner size="lg" text={text} />
      </div>
    </div>
  );
}

export function ShimmerCardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-surface/80 dark:bg-surface-card/60 border border-divider/70 backdrop-blur-md shadow-subtle ${className}`}
    >
      {/* Sweeping Radiant Shimmer Light Beam */}
      <div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-[shimmer_2s_infinite]"
        style={{
          transform: "skewX(-20deg)",
        }}
      />
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-2xl bg-slate-200/80 dark:bg-white/10 animate-pulse" />
          <div className="w-20 h-6 rounded-full bg-slate-200/80 dark:bg-white/10 animate-pulse" />
        </div>
        <div className="h-5 w-3/4 rounded-xl bg-slate-200/80 dark:bg-white/10 animate-pulse" />
        <div className="h-4 w-1/2 rounded-xl bg-slate-200/60 dark:bg-white/5 animate-pulse" />
        <div className="h-10 w-full rounded-2xl bg-slate-200/80 dark:bg-white/10 animate-pulse pt-2" />
      </div>
    </div>
  );
}
