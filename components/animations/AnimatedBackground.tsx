"use client";

import React from "react";
import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden -z-10 select-none"
    >
      {/* Subtle background dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(#1D1D1F 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* Primary blurred soft blue orb */}
      <motion.div
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -50, 30, 0],
          scale: [1, 1.12, 0.95, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-[15%] -left-[10%] w-[520px] h-[520px] rounded-full bg-gradient-to-br from-accent/15 to-accent-light/30 blur-[110px]"
      />

      {/* Secondary warm ambient light */}
      <motion.div
        animate={{
          x: [0, -35, 25, 0],
          y: [0, 40, -30, 0],
          scale: [1, 0.92, 1.08, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute top-[35%] -right-[12%] w-[480px] h-[480px] rounded-full bg-gradient-to-tr from-warm/10 to-amber-200/20 blur-[120px]"
      />

      {/* Tertiary subtle emerald accent */}
      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -30, 40, 0],
          scale: [0.95, 1.05, 0.98, 0.95],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
        className="absolute -bottom-[15%] left-[25%] w-[560px] h-[560px] rounded-full bg-gradient-to-t from-success/10 to-emerald-100/15 blur-[130px]"
      />
    </div>
  );
}
