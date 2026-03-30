"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const loadingTexts = [
  "Decrypting medical records...",
  "Polishing the stethoscopes...",
  "Preparing your dashboard...",
  "Synchronizing securely...",
  "Connecting to AIIMS Delhi..."
];

export default function LoadingSpinner({ text }: { text?: string }) {
  const [randomText, setRandomText] = useState("Loading...");

  useEffect(() => {
    if (text === undefined) {
      setRandomText(loadingTexts[Math.floor(Math.random() * loadingTexts.length)]);
      const interval = setInterval(() => {
        setRandomText(loadingTexts[Math.floor(Math.random() * loadingTexts.length)]);
      }, 1500);
      return () => clearInterval(interval);
    } else {
      setRandomText(text);
    }
  }, [text]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 backdrop-blur-2xl">
      <div className="relative w-32 h-32 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          className="absolute inset-0 rounded-full border-[6px] border-transparent border-t-medical-primary border-b-medical-primary/30 shadow-[0_0_20px_rgba(0,123,255,0.4)]"
        />
        <motion.div
          animate={{ rotate: -360, scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute inset-4 rounded-full border-[4px] border-transparent border-t-teal-400 border-b-emerald-400/40 opacity-70"
        />
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-12 h-12 flex items-center justify-center"
        >
          <img 
            src="https://upload.wikimedia.org/wikipedia/en/8/85/All_India_Institute_of_Medical_Sciences%2C_Delhi.svg" 
            alt="AIIMS Logo" 
            className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]"
          />
        </motion.div>
      </div>
      <motion.p
        key={randomText}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="mt-8 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-medical-primary to-teal-500 drop-shadow-sm tracking-wide"
      >
        {randomText}
      </motion.p>
    </div>
  );
}
