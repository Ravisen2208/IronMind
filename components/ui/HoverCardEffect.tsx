"use client";

import React, { useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";

interface HoverCardEffectProps {
  children: React.ReactNode;
  className?: string;
  tiltAmount?: number;
}

export function HoverCardEffect({
  children,
  className = "",
  tiltAmount = 8,
}: HoverCardEffectProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  // Smooth springs for tilt
  const rotateX = useSpring(0, { stiffness: 300, damping: 25 });
  const rotateY = useSpring(0, { stiffness: 300, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;

    setMousePos({ x: percentX, y: percentY });

    const calcRotateY = ((x - rect.width / 2) / (rect.width / 2)) * tiltAmount;
    const calcRotateX = -((y - rect.height / 2) / (rect.height / 2)) * tiltAmount;

    rotateX.set(calcRotateX);
    rotateY.set(calcRotateY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        scale: isHovered ? 1.02 : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`relative overflow-hidden transition-shadow duration-500 ${className}`}
    >
      {/* Dynamic Light Spot Overlay */}
      {isHovered && (
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300 opacity-60 z-10"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}% ${mousePos.y}%, rgba(142, 102, 70, 0.12), transparent 70%)`,
          }}
        />
      )}

      {children}
    </motion.div>
  );
}
