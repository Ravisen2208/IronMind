"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Brain, Dumbbell, Sparkles, Coins, MousePointerClick } from "lucide-react";

export function FloatingStats() {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Satellite configurations bursting widely outward from (0,0) center
  const satellites = [
    {
      id: "streak",
      title: "Daily Streak",
      value: "14 Days Clean",
      icon: Flame,
      iconColor: "text-emerald-500 fill-emerald-500/20",
      iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
      borderColor: "border-emerald-500/40",
      glowColor: "shadow-[0_0_30px_rgba(16,185,129,0.3)]",
      // Target wide offsets
      expanded: {
        x: isMobile ? -145 : -280,
        y: isMobile ? -130 : -135,
        rotate: -5,
      },
      delay: 0.03,
    },
    {
      id: "willpower",
      title: "Willpower",
      value: "+1 Attribute",
      icon: Dumbbell,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-500/10 dark:bg-amber-500/20",
      borderColor: "border-amber-500/40",
      glowColor: "shadow-[0_0_30px_rgba(245,158,11,0.3)]",
      expanded: {
        x: isMobile ? 145 : 280,
        y: isMobile ? -130 : -130,
        rotate: 5,
      },
      delay: 0.06,
    },
    {
      id: "intellect",
      title: "Intellect",
      value: "Deep Focus: 45m",
      icon: Brain,
      iconColor: "text-indigo-400",
      iconBg: "bg-indigo-500/10 dark:bg-indigo-500/20",
      borderColor: "border-indigo-500/40",
      glowColor: "shadow-[0_0_30px_rgba(99,102,241,0.3)]",
      expanded: {
        x: isMobile ? -145 : -270,
        y: isMobile ? 135 : 140,
        rotate: -4,
      },
      delay: 0.09,
    },
    {
      id: "coins",
      title: "Quest Coins",
      value: "+20 Earned",
      icon: Coins,
      iconColor: "text-yellow-500 fill-yellow-500/20",
      iconBg: "bg-yellow-500/10 dark:bg-yellow-500/20",
      borderColor: "border-yellow-500/40",
      glowColor: "shadow-[0_0_30px_rgba(234,179,8,0.3)]",
      expanded: {
        x: isMobile ? 145 : 280,
        y: isMobile ? 135 : 140,
        rotate: 4,
      },
      delay: 0.12,
    },
  ];

  return (
    <div
      className="relative w-full max-w-4xl mx-auto h-[440px] sm:h-[480px] flex items-center justify-center select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsHovered((prev) => !prev)}
      role="region"
      aria-label="Interactive RPG Stats"
    >
      {/* Background Energy Shockwave Rings on Hover */}
      <AnimatePresence>
        {isHovered && (
          <>
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: [0.7, 1.5, 1.8], opacity: [0.7, 0.3, 0] }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
              className="absolute w-80 h-80 rounded-full border border-amber-400/40 pointer-events-none"
            />
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: [0.5, 1.3, 1.6], opacity: [0.8, 0.4, 0] }}
              exit={{ opacity: 0, scale: 0.4 }}
              transition={{ duration: 1.6, delay: 0.4, repeat: Infinity, ease: "easeOut" }}
              className="absolute w-72 h-72 rounded-full border-2 border-dashed border-amber-500/30 pointer-events-none"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 0.5, scale: 1.3 }}
              exit={{ opacity: 0, scale: 0.7 }}
              className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-amber-500/15 via-purple-600/15 to-amber-500/15 blur-3xl pointer-events-none"
            />
          </>
        )}
      </AnimatePresence>

      {/* 4 Satellite Cards - Bursting Far Outward From Center */}
      {satellites.map((sat) => {
        const Icon = sat.icon;
        return (
          <motion.div
            key={sat.id}
            initial={{
              x: 0,
              y: 0,
              scale: 0.1,
              opacity: 0,
              rotate: 0,
            }}
            animate={
              isHovered
                ? {
                    x: sat.expanded.x,
                    y: sat.expanded.y,
                    scale: 1,
                    opacity: 1,
                    rotate: sat.expanded.rotate,
                  }
                : {
                    x: 0,
                    y: 0,
                    scale: 0.1,
                    opacity: 0,
                    rotate: 0,
                  }
            }
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 17,
              delay: isHovered ? sat.delay : 0,
            }}
            className={`absolute z-10 p-3.5 sm:p-4 rounded-2xl bg-surface/95 backdrop-blur-xl border ${sat.borderColor} ${sat.glowColor} shadow-card flex items-center gap-3 cursor-pointer pointer-events-auto transition-transform duration-300 hover:scale-105 active:scale-95`}
          >
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${sat.iconBg} flex items-center justify-center shrink-0`}>
              <Icon className={`w-5 h-5 ${sat.iconColor}`} />
            </div>
            <div>
              <div className="text-[10px] sm:text-[11px] uppercase font-bold text-text-secondary tracking-wider">
                {sat.title}
              </div>
              <div className="text-xs sm:text-sm font-bold text-text-primary whitespace-nowrap">
                {sat.value}
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Central Emblem Card */}
      <motion.div
        animate={{
          scale: isHovered ? 1.06 : 1,
          y: isHovered ? [0, -6, 0] : [0, -4, 0],
        }}
        transition={{
          scale: { type: "spring", stiffness: 300, damping: 20 },
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        }}
        className="relative z-20 p-6 sm:p-8 rounded-3xl bg-surface/95 backdrop-blur-2xl border border-divider shadow-float text-center max-w-[280px] sm:max-w-xs w-full cursor-pointer pointer-events-auto transition-all duration-300 group"
      >
        {/* Core Pulsing Icon Badge */}
        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-black flex items-center justify-center mx-auto mb-3.5 shadow-[0_0_25px_rgba(251,191,36,0.45)] group-hover:scale-110 transition-transform duration-300">
          <Sparkles className="w-7 h-7 fill-black/20 text-black" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-1 rounded-2xl border border-amber-400/40 pointer-events-none"
          />
        </div>

        {/* Title & Level */}
        <div className="text-[11px] uppercase tracking-[0.2em] text-amber-500 dark:text-amber-400 font-extrabold mb-0.5">
          IronMind Core
        </div>
        <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-text-primary tracking-tight">
          Level 7 Adept
        </h3>
        <p className="text-xs text-text-secondary mt-1">
          740 / 850 XP to Next Milestone
        </p>

        {/* XP Bar */}
        <div className="w-full bg-slate-200/80 dark:bg-white/10 h-2 rounded-full mt-3.5 overflow-hidden p-0.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "87%" }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.6)]"
          />
        </div>

        {/* Dynamic Hover / Tap Hint */}
        <motion.div
          animate={{ opacity: isHovered ? 0.9 : 0.6 }}
          className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-divider/60 text-[10px] font-semibold text-text-secondary tracking-wide uppercase"
        >
          <MousePointerClick className="w-3 h-3 text-amber-500" />
          <span>{isHovered ? "4 Attributes Active" : "Hover / Tap to Expand"}</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
