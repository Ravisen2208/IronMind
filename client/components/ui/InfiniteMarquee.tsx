"use client";

import React from "react";
import { motion } from "framer-motion";

interface InfiniteMarqueeProps {
  items?: string[];
  speed?: number;
  direction?: "left" | "right";
  className?: string;
}

const DEFAULT_ITEMS = [
  "TRAIN YOUR MIND",
  "COMPLETE YOUR QUESTS",
  "BECOME STRONGER",
  "GAIN INTELLECT",
  "BUILD STREAKS",
  "EARN GOLD COINS",
  "LEVEL UP YOUR LIFE",
];

export function InfiniteMarquee({
  items = DEFAULT_ITEMS,
  speed = 25,
  direction = "left",
  className = "",
}: InfiniteMarqueeProps) {
  const repeatedItems = [...items, ...items, ...items, ...items];

  return (
    <div className={`w-full overflow-hidden whitespace-nowrap select-none py-3 bg-surface border-y border-divider/60 ${className}`}>
      <motion.div
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: speed,
        }}
        className="inline-flex items-center gap-8 text-xs sm:text-sm font-bold tracking-widest uppercase text-text-secondary/70"
      >
        {repeatedItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-8">
            <span className="hover:text-accent transition-colors duration-300">
              {item}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent/40 inline-block" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
