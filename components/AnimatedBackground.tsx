"use client";

import { ReactNode } from "react";

interface AnimatedBackgroundProps {
  children: ReactNode;
  className?: string;
}

export default function AnimatedBackground({ children, className = "" }: AnimatedBackgroundProps) {
  return (
    <div className={`min-h-screen mesh-gradient ${className}`}>
      {children}
    </div>
  );
}
