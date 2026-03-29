"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  color?: string;
  delay?: number;
}

export default function StatCard({ label, value, icon, color = "from-blue-500 to-cyan-400", delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, type: "spring", bounce: 0.4 }}
      whileHover={{ scale: 1.05, rotateY: 5, rotateX: 5 }}
      className="super-glass p-6 relative overflow-hidden group transition-all duration-300"
    >
      {/* Glossy overlay sheen */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/50 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.6),_0_8px_16px_rgba(0,123,255,0.3)]`}>
          <span className="text-white text-2xl drop-shadow-md">{icon}</span>
        </div>
        <span className="text-4xl font-extrabold text-medical-text drop-shadow-sm tracking-tight">
          {value}
        </span>
      </div>
      <p className="text-base font-bold text-medical-text-secondary/90 relative z-10">{label}</p>
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br ${color} opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
    </motion.div>
  );
}
