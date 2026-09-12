"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FloatingStats } from "../animations/FloatingStats";
import { LoginForm } from "../auth/LoginForm";
import { FadeIn, SlideInLeft, ScrollStaggerContainer, staggerItemLeft } from "../animations/MotionWrapper";
import { Shield, Sparkles, CheckCircle2, Zap, ArrowRight } from "lucide-react";
import { MagneticButton } from "../ui/MagneticButton";
import { HoverCardEffect } from "../ui/HoverCardEffect";
import { InfiniteMarquee } from "../ui/InfiniteMarquee";

export function HeroSection() {
  return (
    <div className="relative pt-6 pb-20 sm:pt-12 sm:pb-28 overflow-hidden">
      {/* Infinite Horizontal Marquee Banner */}
      <div className="mb-10">
        <InfiniteMarquee />
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        {/* Top Tagline Badge */}
        <FadeIn delay={0.1} yOffset={10} className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface/90 border border-divider/80 shadow-subtle backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-bronze animate-pulse" />
            <span className="text-xs font-semibold text-text-secondary tracking-wide uppercase">
              The Next-Gen RPG Productivity Platform
            </span>
          </div>
        </FadeIn>

        {/* Hero Title & Pitch */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <FadeIn delay={0.2} yOffset={20}>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-extrabold tracking-tight text-text-primary leading-[1.05]">
              Train your mind.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze via-amber-500 to-accent">
                Complete your quests.
              </span>
              <br />
              Become stronger.
            </h1>
          </FadeIn>

          <FadeIn delay={0.35} yOffset={15}>
            <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto font-normal leading-relaxed">
              IronMind turns daily habits and cognitive discipline into an authoritative RPG progression system.
              Earn XP, build streaks, accumulate coins, and level up your character attributes.
            </p>
          </FadeIn>

          {/* Magnetic Call to Actions */}
          <FadeIn delay={0.5} yOffset={15} className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <MagneticButton dataCursorText="Start">
              <Link
                href="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-accent hover:bg-accent-hover text-cream text-sm font-semibold uppercase tracking-wide shadow-md transition-all duration-200 active:scale-95 font-heading"
              >
                <span>Begin Your Progression</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </MagneticButton>

            <MagneticButton dataCursorText="Login">
              <button
                onClick={() => {
                  const el = document.getElementById("auth-experience");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-surface hover:bg-warm-light text-text-primary border border-divider/80 text-sm font-semibold shadow-subtle transition-all duration-200 active:scale-95 font-heading"
              >
                <span>Sign In to Character</span>
              </button>
            </MagneticButton>
          </FadeIn>
        </div>

        {/* Hero Image with 3D Tilt Spotlight */}
        <SlideInLeft delay={0.2} xOffset={-60} className="mt-12 sm:mt-16">
          <HoverCardEffect className="max-w-4xl mx-auto rounded-4xl shadow-warm border border-divider/50">
            <div className="relative overflow-hidden rounded-4xl group">
              <Image
                src="/images/hero-ironmind.jpg"
                alt="IronMind — Premium productivity meets RPG progression"
                width={1400}
                height={788}
                priority
                className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
            </div>
          </HoverCardEffect>
        </SlideInLeft>

        {/* Coordinated Floating Graphic Area */}
        <SlideInLeft delay={0.15} xOffset={-50} className="mt-12 sm:mt-16">
          <FloatingStats />
        </SlideInLeft>

        {/* Feature Cards with 3D Tilt Spotlight */}
        <SlideInLeft delay={0.2} xOffset={-60} className="mt-8">
          <HoverCardEffect className="max-w-3xl mx-auto rounded-4xl shadow-warm border border-divider/50">
            <div className="relative overflow-hidden rounded-4xl group">
              <Image
                src="/images/feature-cards.jpg"
                alt="XP, Streaks, and Coins — IronMind progression system"
                width={1400}
                height={788}
                className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
          </HoverCardEffect>
        </SlideInLeft>

        {/* Feature Stagger Highlights with Hover Cards - Cascades smoothly from Left on Scroll */}
        <ScrollStaggerContainer
          staggerDelay={0.12}
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          <motion.div variants={staggerItemLeft}>
            <HoverCardEffect className="p-6 rounded-3xl bg-surface/80 backdrop-blur-md border border-divider/70 shadow-subtle h-full">
              <div className="w-10 h-10 rounded-2xl bg-accent-light text-accent flex items-center justify-center mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-heading font-bold text-text-primary tracking-tight">
                Anti-Cheat Progression
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary mt-1 leading-relaxed font-sans">
                Every point of XP, streak, and coin reward is calculated and verified server-side via atomic transactions.
              </p>
            </HoverCardEffect>
          </motion.div>

          <motion.div variants={staggerItemLeft}>
            <HoverCardEffect className="p-6 rounded-3xl bg-surface/80 backdrop-blur-md border border-divider/70 shadow-subtle h-full">
              <div className="w-10 h-10 rounded-2xl bg-success-light text-success flex items-center justify-center mb-3">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-heading font-bold text-text-primary tracking-tight">
                Premium Aesthetics
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary mt-1 leading-relaxed font-sans">
                Designed with warm minimalism: fluid cubic-bezier motion, subtle champagne accents, and magnetic physics.
              </p>
            </HoverCardEffect>
          </motion.div>

          <motion.div variants={staggerItemLeft}>
            <HoverCardEffect className="p-6 rounded-3xl bg-surface/80 backdrop-blur-md border border-divider/70 shadow-subtle h-full">
              <div className="w-10 h-10 rounded-2xl bg-warning-light text-warning flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-heading font-bold text-text-primary tracking-tight">
                Gemini AI Directives
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary mt-1 leading-relaxed font-sans">
                Generate actionable, concrete micro-quests with free-tier Gemini AI and resilient offline fallback.
              </p>
            </HoverCardEffect>
          </motion.div>
        </ScrollStaggerContainer>

        {/* In-Page Auth Portal - Slides in from Left */}
        <SlideInLeft delay={0.1} xOffset={-50} className="mt-20 pt-10 border-t border-divider/60">
          <div id="auth-experience" className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary tracking-tight">
              Ready to embark?
            </h2>
            <p className="text-sm text-text-secondary mt-1 font-sans">
              Sign in to your IronMind character or launch an instant guest sandbox.
            </p>
          </div>
          <LoginForm />
        </SlideInLeft>
      </div>
    </div>
  );
}
