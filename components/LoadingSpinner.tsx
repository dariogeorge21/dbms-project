"use client";

import { motion } from "framer-motion";

export default function LoadingSpinner({ text }: { text?: string }) {
  void text;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 backdrop-blur-2xl">
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="w-[6.4rem] h-[6.4rem] flex items-center justify-center mb-7"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/en/8/85/All_India_Institute_of_Medical_Sciences%2C_Delhi.svg"
          alt="AIIMS Logo"
          className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]"
        />
      </motion.div>

      <div className="relative w-52 h-28 flex items-center justify-center loading">
        <svg width="112px" height="84px" viewBox="0 0 64 48" aria-hidden="true" className="drop-shadow-[0_0_16px_rgba(255,77,79,0.3)]">
          <polyline points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" id="back" />
          <polyline points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" id="front" />
        </svg>
      </div>

      <style jsx>{`
        .loading svg polyline {
          fill: none;
          stroke-width: 3;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .loading svg polyline#back {
          stroke: #ff4d5033;
        }

        .loading svg polyline#front {
          stroke: #ff4d4f;
          stroke-dasharray: 48, 144;
          stroke-dashoffset: 192;
          animation: dash_682 2.8s linear infinite;
        }

        @keyframes dash_682 {
          72.5% {
            opacity: 0;
          }

          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}
