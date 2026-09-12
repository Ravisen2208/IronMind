"use client";

import React from "react";
import { motion, MotionProps } from "framer-motion";

export const appleEasing = [0.28, 0.11, 0.32, 1] as const;

interface MotionWrapperProps extends MotionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

interface FadeInProps extends MotionWrapperProps {
  yOffset?: number;
}

interface SlideInProps extends MotionWrapperProps {
  xOffset?: number;
  once?: boolean;
}

export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.6,
  yOffset = 18,
  ...props
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -yOffset }}
      transition={{
        duration,
        delay,
        ease: appleEasing,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * SlideInLeft - When scrolling down, smoothly slides into view from the LEFT side
 */
export function SlideInLeft({
  children,
  className,
  delay = 0,
  duration = 0.65,
  xOffset = -60,
  once = true,
  ...props
}: SlideInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: xOffset }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once, margin: "-40px" }}
      transition={{
        duration,
        delay,
        ease: appleEasing,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * SlideInRight - Smoothly slides in from the RIGHT side on scroll
 */
export function SlideInRight({
  children,
  className,
  delay = 0,
  duration = 0.65,
  xOffset = 60,
  once = true,
  ...props
}: SlideInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: xOffset }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once, margin: "-40px" }}
      transition={{
        duration,
        delay,
        ease: appleEasing,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * ScrollStaggerContainer - Triggers staggered animation when scrolled into view
 */
export function ScrollStaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const staggerItem = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: appleEasing,
    },
  },
};

/**
 * staggerItemLeft - Child item that slides in from the left
 */
export const staggerItemLeft = {
  hidden: { opacity: 0, x: -45 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.55,
      ease: appleEasing,
    },
  },
};

