"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

export function AnimatedBackground() {
  // Generate subtle random particles for background floating effect
  const particles = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 15 + 15,
      delay: Math.random() * 5,
    }));
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden -z-10 select-none"
    >
      {/* Dynamic Animated Grid Pattern */}
      <motion.div
        animate={{
          opacity: [0.03, 0.06, 0.03],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(142, 102, 70, 0.15) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(142, 102, 70, 0.15) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Floating Particle Stars/Nodes */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            x: `${p.x}vw`,
            y: `${p.y}vh`,
            opacity: 0.2,
          }}
          animate={{
            y: [`${p.y}vh`, `${(p.y - 30 + 100) % 100}vh`],
            opacity: [0.2, 0.7, 0.2],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
          style={{ width: p.size, height: p.size }}
          className="absolute rounded-full bg-accent/60 blur-[1px]"
        />
      ))}

      {/* Primary Warm Cream Glowing Orb — Top Left */}
      <motion.div
        animate={{
          x: [0, 50, -40, 0],
          y: [0, -60, 40, 0],
          scale: [1, 1.15, 0.92, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-[15%] -left-[10%] w-[580px] h-[580px] rounded-full bg-gradient-to-br from-champagne/30 via-accent/15 to-warm-light/40 blur-[120px]"
      />

      {/* Secondary Warm Bronze Ambient Orb — Right */}
      <motion.div
        animate={{
          x: [0, -45, 30, 0],
          y: [0, 50, -35, 0],
          scale: [1, 0.9, 1.12, 1],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute top-[30%] -right-[12%] w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-bronze/15 via-accent/20 to-champagne/25 blur-[130px]"
      />

      {/* Tertiary Subtle Center Pulse Orb */}
      <motion.div
        animate={{
          opacity: [0.15, 0.35, 0.15],
          scale: [0.9, 1.1, 0.9],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full bg-gradient-to-r from-accent-light/30 via-warm/20 to-transparent blur-[140px]"
      />

      {/* Quaternary Warm Accent Orb — Bottom */}
      <motion.div
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -40, 50, 0],
          scale: [0.95, 1.08, 0.96, 0.95],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
        className="absolute -bottom-[15%] left-[20%] w-[600px] h-[600px] rounded-full bg-gradient-to-t from-bronze/15 to-warm/15 blur-[140px]"
      />
    </div>
  );
}
