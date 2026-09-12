"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FloatingStats } from "../animations/FloatingStats";
import { LoginForm } from "../auth/LoginForm";
import { appleEasing, FadeIn, StaggerContainer, staggerItem } from "../animations/MotionWrapper";
import { Shield, Sparkles, CheckCircle2, Zap, ArrowRight } from "lucide-react";

export function HeroSection() {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <div className="relative pt-6 pb-20 sm:pt-12 sm:pb-28 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top Tagline Badge */}
        <FadeIn delay={0.1} yOffset={10} className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface/90 border border-divider/80 shadow-subtle backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-semibold text-text-secondary tracking-wide">
              The Next-Gen RPG Productivity Platform
            </span>
          </div>
        </FadeIn>

        {/* Hero Title & Pitch */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <FadeIn delay={0.2} yOffset={20}>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-text-primary leading-[1.08]">
              Train your mind.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-blue-600 to-indigo-600">
                Complete your quests.
              </span>
              <br />
              Become stronger.
            </h1>
          </FadeIn>

          <FadeIn delay={0.35} yOffset={15}>
            <p className="text-base sm:text-xl text-text-secondary max-w-2xl mx-auto font-normal leading-relaxed">
              IronMind turns daily habits and cognitive discipline into an authoritative RPG progression system.
              Earn XP, build streaks, accumulate coins, and level up your character attributes.
            </p>
          </FadeIn>

          {/* Call to Actions */}
          <FadeIn delay={0.5} yOffset={15} className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-accent hover:bg-accent-hover text-white text-sm font-semibold shadow-md shadow-accent/20 transition-all duration-200 active:scale-95"
            >
              <span>Begin Your Progression</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => {
                const el = document.getElementById("auth-experience");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-surface hover:bg-slate-50 text-text-primary border border-divider/80 text-sm font-semibold shadow-subtle transition-all duration-200 active:scale-95"
            >
              <span>Sign In to Character</span>
            </button>
          </FadeIn>
        </div>

        {/* Coordinated Floating Graphic Area */}
        <div className="mt-12 sm:mt-16">
          <FloatingStats />
        </div>

        {/* Feature Stagger Highlights */}
        <StaggerContainer
          staggerDelay={0.12}
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          <motion.div
            variants={staggerItem}
            className="p-6 rounded-3xl bg-surface/80 backdrop-blur-md border border-divider/70 shadow-subtle"
          >
            <div className="w-10 h-10 rounded-2xl bg-accent-light text-accent flex items-center justify-center mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-text-primary tracking-tight">
              Anti-Cheat Progression
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary mt-1 leading-relaxed">
              Every point of XP, streak, and coin reward is calculated and verified server-side via atomic transactions.
            </p>
          </motion.div>

          <motion.div
            variants={staggerItem}
            className="p-6 rounded-3xl bg-surface/80 backdrop-blur-md border border-divider/70 shadow-subtle"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-success flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-text-primary tracking-tight">
              Apple-Grade Aesthetics
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary mt-1 leading-relaxed">
              Designed with Apple Health minimalism: fluid cubic-bezier motion, subtle glowing accents, and zero distracting clutter.
            </p>
          </motion.div>

          <motion.div
            variants={staggerItem}
            className="p-6 rounded-3xl bg-surface/80 backdrop-blur-md border border-divider/70 shadow-subtle"
          >
            <div className="w-10 h-10 rounded-2xl bg-warm-light text-warm flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-text-primary tracking-tight">
              Gemini AI Directives
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary mt-1 leading-relaxed">
              Generate actionable, concrete micro-quests with free-tier Gemini AI and resilient offline fallback.
            </p>
          </motion.div>
        </StaggerContainer>

        {/* In-Page Auth Portal */}
        <div id="auth-experience" className="mt-20 pt-10 border-t border-divider/60">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
              Ready to embark?
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Sign in to your IronMind character or launch an instant guest sandbox.
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
