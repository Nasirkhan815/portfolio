"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue } from "framer-motion";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export default function SpotlightCard({
  children,
  className = "",
  glowColor = "rgba(139, 92, 246, 0.12)",
  ...props
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top } = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-2xl border border-white/[0.06] bg-obsidian-900/40 backdrop-blur-xl transition-colors duration-500 hover:border-white/[0.12] flex flex-col justify-between group ${className}`}
      {...props}
    >
      {/* Spotlight background mask */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 pointer-events-none -z-10"
        style={{
          background: `radial-gradient(400px circle at ${mouseX}px ${mouseY}px, ${glowColor}, transparent 80%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />
      
      {/* Light border spotlight */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 pointer-events-none -z-10"
        style={{
          background: `radial-gradient(180px circle at ${mouseX}px ${mouseY}px, rgba(255, 255, 255, 0.08), transparent 80%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />

      <div className="relative z-10 w-full h-full flex flex-col justify-between">{children}</div>
    </div>
  );
}
