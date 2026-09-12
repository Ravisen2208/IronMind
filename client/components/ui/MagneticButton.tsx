"use client";

import React, { useRef } from "react";
import { motion, useSpring } from "framer-motion";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  strength?: number; // How far button moves towards cursor (default 0.35)
  dataCursorText?: string;
}

export function MagneticButton({
  children,
  className = "",
  onClick,
  strength = 0.35,
  dataCursorText,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Smooth springs for magnetic translation
  const x = useSpring(0, { stiffness: 200, damping: 15 });
  const y = useSpring(0, { stiffness: 200, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = (e.clientX - centerX) * strength;
    const distanceY = (e.clientY - centerY) * strength;

    x.set(distanceX);
    y.set(distanceY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      data-cursor-text={dataCursorText}
      className={`inline-block cursor-pointer transition-transform duration-100 ease-out magnetic-item ${className}`}
    >
      {children}
    </motion.div>
  );
}
