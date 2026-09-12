"use client";

import React from "react";
import { Coins, Award } from "lucide-react";
import { motion } from "framer-motion";
import { appleEasing } from "../animations/MotionWrapper";

interface CoinBalanceProps {
  coins: number;
}

export function CoinBalance({ coins }: CoinBalanceProps) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: appleEasing }}
      className="p-5 sm:p-6 rounded-3xl bg-surface border border-divider/70 shadow-subtle flex flex-col justify-between"
    >
      <div className="flex items-center justify-between">
        <div className="w-11 h-11 rounded-2xl bg-warm-light text-warm flex items-center justify-center">
          <Coins className="w-5 h-5 fill-warm/20" />
        </div>
        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full border text-warm bg-warm-light/70 border-warm/30">
          Treasury
        </span>
      </div>

      <div className="mt-4">
        <div className="text-xs uppercase font-bold tracking-wider text-text-secondary">
          Gold Coins
        </div>
        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="text-3xl font-bold text-warm tracking-tight">
            {coins.toLocaleString()}
          </span>
          <span className="text-xs font-medium text-text-secondary">coins</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-text-secondary mt-1.5">
          <Award className="w-3.5 h-3.5" />
          <span>Earned on every completed quest</span>
        </div>
      </div>
    </motion.div>
  );
}
