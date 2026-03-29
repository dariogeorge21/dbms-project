"use client";

import { motion } from "framer-motion";

export default function LoadingSpinner({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-medical-primary"
      />
      <p className="mt-4 text-medical-text-secondary font-medium">{text}</p>
    </div>
  );
}
