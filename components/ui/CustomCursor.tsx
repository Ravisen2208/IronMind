"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isPointer, setIsPointer] = useState(true);
  const [hoverText, setHoverText] = useState<string | null>(null);

  // Smooth springs for cursor position
  const cursorX = useSpring(0, { stiffness: 400, damping: 28 });
  const cursorY = useSpring(0, { stiffness: 400, damping: 28 });

  const dotX = useSpring(0, { stiffness: 900, damping: 40 });
  const dotY = useSpring(0, { stiffness: 900, damping: 40 });

  useEffect(() => {
    // Check fine pointer
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
      setIsPointer(false);
      return;
    }

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      dotX.set(e.clientX);
      dotY.set(e.clientY);

      // Check if mouse is over interactive element
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        "button, a, input, select, textarea, [role='button'], .magnetic-item, [data-cursor]"
      );
      if (interactive) {
        setIsHovered(true);
        const text = interactive.getAttribute("data-cursor-text");
        setHoverText(text);
      } else {
        setIsHovered(false);
        setHoverText(null);
      }
    };

    window.addEventListener("mousemove", moveCursor);
    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
  }, [cursorX, cursorY, dotX, dotY]);

  if (!isPointer) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Outer Magnetic Ring */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovered ? 2.4 : 1,
          opacity: 0.75,
        }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className={`w-8 h-8 rounded-full border border-accent/40 bg-accent/10 backdrop-blur-[1px] flex items-center justify-center transition-colors duration-300 ${
          hoverText ? "w-16 h-16 border-accent bg-accent text-white" : ""
        }`}
      >
        {hoverText && (
          <span className="text-[9px] font-bold tracking-wider uppercase text-white px-1">
            {hoverText}
          </span>
        )}
      </motion.div>

      {/* Inner Precision Dot */}
      <motion.div
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovered ? 0 : 1,
        }}
        className="w-1.5 h-1.5 rounded-full bg-accent"
      />
    </div>
  );
}
