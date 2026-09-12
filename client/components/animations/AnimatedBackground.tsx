"use client";

import React, { useMemo, useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

export function AnimatedBackground() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Mouse tracking springs for interactive ambient cursor glow
  const mouseX = useSpring(0, { stiffness: 60, damping: 25 });
  const mouseY = useSpring(0, { stiffness: 60, damping: 25 });

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Starfield particles with varied glowing speeds, colors, and trajectories
  const starfield = useMemo(() => {
    return Array.from({ length: 28 }, (_, i) => ({
      id: i,
      x: (i * 37) % 100,
      y: (i * 43) % 100,
      size: (i % 3) + 2,
      duration: 12 + (i % 8) * 2,
      delay: (i % 5) * 1.2,
      colorType: i % 4, // 0: gold/amber, 1: purple/violet, 2: cyan/blue, 3: diamond white
    }));
  }, []);

  // Shooting stars / meteors that streak across in dark mode
  const meteors = useMemo(() => {
    return [
      { id: 1, top: 15, delay: 0, duration: 6 },
      { id: 2, top: 38, delay: 3.5, duration: 7 },
      { id: 3, top: 62, delay: 7, duration: 8 },
      { id: 4, top: 82, delay: 10.5, duration: 7.5 },
    ];
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden -z-10 select-none contain-strict"
    >
      {/* 1. Cyber Matrix Geometric Grid */}
      <div
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06] transition-opacity duration-700"
        style={{
          backgroundImage: isDark
            ? `linear-gradient(to right, rgba(212, 175, 55, 0.25) 1px, transparent 1px),
               linear-gradient(to bottom, rgba(212, 175, 55, 0.25) 1px, transparent 1px)`
            : `linear-gradient(to right, rgba(142, 102, 70, 0.2) 1px, transparent 1px),
               linear-gradient(to bottom, rgba(142, 102, 70, 0.2) 1px, transparent 1px)`,
          backgroundSize: "52px 52px",
        }}
      />

      {/* 2. Interactive Spotlight that subtly follows cursor */}
      {mounted && (
        <motion.div
          style={{
            x: mouseX,
            y: mouseY,
            translateX: "-50%",
            translateY: "-50%",
          }}
          className="absolute w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none transition-opacity duration-500 bg-gradient-to-r from-amber-500/10 via-purple-600/10 to-transparent dark:from-amber-400/15 dark:via-indigo-500/15 dark:to-transparent opacity-75"
        />
      )}

      {/* 3. Sweeping Cyber Light Scan Beam (Continuous wave) */}
      <motion.div
        animate={{
          y: ["-100%", "200%"],
          opacity: [0, 0.12, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-x-0 h-48 bg-gradient-to-b from-transparent via-amber-400/10 dark:via-amber-400/15 to-transparent blur-xl"
      />

      {/* 4. Shooting Stars / Cosmic Meteors (Continuous drift) */}
      {meteors.map((m) => (
        <motion.div
          key={m.id}
          initial={{
            x: "-20vw",
            y: `${m.top}vh`,
            opacity: 0,
            scale: 0.6,
          }}
          animate={{
            x: ["-10vw", "110vw"],
            y: [`${m.top}vh`, `${m.top + 25}vh`],
            opacity: [0, 0.85, 0.85, 0],
            scale: [0.6, 1.1, 0.8, 0.3],
          }}
          transition={{
            duration: m.duration,
            repeat: Infinity,
            delay: m.delay,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="absolute flex items-center rotate-[22deg]"
        >
          {/* Meteor Glowing Head */}
          <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_12px_#fbbf24] dark:shadow-[0_0_16px_#fde68a]" />
          {/* Meteor Tail */}
          <div className="h-[2px] w-44 bg-gradient-to-l from-transparent via-amber-300/60 to-white/90 dark:via-amber-400/80 rounded-full -ml-1 blur-[0.5px]" />
        </motion.div>
      ))}

      {/* 5. Deep Multi-Layered Aurora Nebula Vortices (Organic continuous flow) */}
      {/* Nebula 1: Golden Amber Horizon (Top Left) */}
      <motion.div
        animate={{
          x: [0, 60, -40, 0],
          y: [0, -50, 40, 0],
          scale: [1, 1.2, 0.95, 1],
          rotate: [0, 90, 180, 360],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-[20%] -left-[15%] w-[680px] h-[680px] rounded-full bg-gradient-to-br from-amber-500/20 via-orange-600/15 to-transparent dark:from-amber-500/20 dark:via-purple-900/25 dark:to-transparent blur-[140px]"
      />

      {/* Nebula 2: Cosmic Purple / Violet Abyss (Top Right) */}
      <motion.div
        animate={{
          x: [0, -50, 35, 0],
          y: [0, 60, -40, 0],
          scale: [1, 0.9, 1.15, 1],
          rotate: [360, 270, 90, 0],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
        className="absolute top-[10%] -right-[15%] w-[620px] h-[620px] rounded-full bg-gradient-to-bl from-purple-600/20 via-indigo-700/15 to-transparent dark:from-purple-700/25 dark:via-indigo-950/30 dark:to-transparent blur-[150px]"
      />

      {/* Nebula 3: Cyber Emerald / Cyan Pulse (Center Bottom) */}
      <motion.div
        animate={{
          x: [0, 40, -50, 0],
          y: [0, -40, 60, 0],
          scale: [0.95, 1.18, 0.9, 0.95],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
        className="absolute -bottom-[20%] left-[25%] w-[720px] h-[720px] rounded-full bg-gradient-to-t from-emerald-600/15 via-teal-700/10 to-transparent dark:from-teal-600/20 dark:via-indigo-900/25 dark:to-transparent blur-[160px]"
      />

      {/* Nebula 4: Center Breathing Core Glow */}
      <motion.div
        animate={{
          opacity: [0.15, 0.35, 0.15],
          scale: [0.88, 1.12, 0.88],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[45%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-r from-amber-400/10 via-purple-500/15 to-cyan-500/10 dark:from-amber-400/15 dark:via-indigo-600/20 dark:to-teal-500/10 blur-[160px]"
      />

      {/* 6. Floating Twinkling Starfield Nodes */}
      {starfield.map((star) => {
        let colorClass = "bg-amber-400 dark:bg-amber-300 shadow-[0_0_8px_#fbbf24]";
        if (star.colorType === 1) {
          colorClass = "bg-purple-400 dark:bg-purple-300 shadow-[0_0_8px_#c084fc]";
        } else if (star.colorType === 2) {
          colorClass = "bg-cyan-400 dark:bg-cyan-300 shadow-[0_0_8px_#67e8f9]";
        } else if (star.colorType === 3) {
          colorClass = "bg-white shadow-[0_0_8px_#ffffff]";
        }

        return (
          <motion.div
            key={star.id}
            initial={{
              x: `${star.x}vw`,
              y: `${star.y}vh`,
              opacity: 0.2,
            }}
            animate={{
              y: [`${star.y}vh`, `${(star.y - 25 + 100) % 100}vh`],
              x: [`${star.x}vw`, `${(star.x + (star.id % 2 === 0 ? 3 : -3) + 100) % 100}vw`],
              opacity: [0.15, 0.85, 0.3, 0.95, 0.15],
              scale: [1, 1.5, 0.9, 1.4, 1],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
              ease: "easeInOut",
            }}
            style={{
              width: star.size,
              height: star.size,
            }}
            className={`absolute rounded-full ${colorClass} transition-colors duration-500`}
          />
        );
      })}
    </div>
  );
}
