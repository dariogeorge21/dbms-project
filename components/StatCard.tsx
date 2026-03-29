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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className="glass-card card-3d stat-shimmer p-6 relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
          <span className="text-white text-xl">{icon}</span>
        </div>
        <span className="text-3xl font-bold text-medical-text">{value}</span>
      </div>
      <p className="text-sm font-medium text-medical-text-secondary">{label}</p>
    </motion.div>
  );
}
