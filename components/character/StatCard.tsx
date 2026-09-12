"use client";

import React from "react";
import { Brain, Dumbbell, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { appleEasing } from "../animations/MotionWrapper";

interface StatCardProps {
  type: "intellect" | "willpower";
  value: number;
  description: string;
}

export function StatCard({ type, value, description }: StatCardProps) {
  const isIntellect = type === "intellect";
  const Icon: LucideIcon = isIntellect ? Brain : Dumbbell;
  const label = isIntellect ? "Intellect" : "Willpower";

  const colorStyles = isIntellect
    ? {
        iconBg: "bg-accent-light text-accent",
        badge: "text-accent bg-accent/10 border-accent/20",
      }
    : {
        iconBg: "bg-orange-50 text-orange-600",
        badge: "text-orange-600 bg-orange-500/10 border-orange-500/20",
      };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: appleEasing }}
      className="p-5 sm:p-6 rounded-3xl bg-surface border border-divider/70 shadow-subtle flex flex-col justify-between"
    >
      <div className="flex items-center justify-between">
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${colorStyles.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${colorStyles.badge}`}>
          Attribute
        </span>
      </div>

      <div className="mt-4">
        <div className="text-xs uppercase font-bold tracking-wider text-text-secondary">
          {label}
        </div>
        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="text-3xl font-bold text-text-primary tracking-tight">
            {value}
          </span>
          <span className="text-xs font-medium text-text-secondary">pts</span>
        </div>
        <p className="text-xs text-text-secondary mt-1.5 leading-snug">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
