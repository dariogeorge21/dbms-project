"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface AnimatedBackgroundProps {
  children: ReactNode;
  className?: string;
}

export default function AnimatedBackground({ children, className = "" }: AnimatedBackgroundProps) {
  return (
    <div className={`min-h-screen relative overflow-hidden bg-[#FAFAFA] z-0 ${className}`}>
      {/* Abstract Glossy Orbs */}
      <motion.div
        animate={{
          x: [0, 40, -40, 0],
          y: [0, 60, -60, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-medical-primary-light/40 to-medical-primary/20 blur-[100px] -z-10"
      />
      <motion.div
        animate={{
          x: [0, -60, 60, 0],
          y: [0, -40, 40, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] right-[5%] w-[400px] h-[400px] rounded-full bg-gradient-to-l from-purple-200/50 to-blue-200/50 blur-[100px] -z-10"
      />
      <motion.div
        animate={{
          x: [0, 80, -20, 0],
          y: [0, -80, 20, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-[10%] left-[20%] w-[600px] h-[600px] rounded-full bg-gradient-to-t from-medical-success/20 to-teal-100/40 blur-[120px] -z-10"
      />

      {/* Glossy Mesh Gradient layer */}
      <div className="absolute inset-0 mesh-gradient pointer-events-none mix-blend-overlay opacity-50 -z-10" />

      {children}
    </div>
  );
}
