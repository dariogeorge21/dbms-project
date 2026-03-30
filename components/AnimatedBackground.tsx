"use client";

import { ReactNode, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getRandomBackgroundVideo } from "@/lib/backgroundVideos";

interface AnimatedBackgroundProps {
  children: ReactNode;
  className?: string;
  videoSrc?: string;
}

export default function AnimatedBackground({ children, className = "", videoSrc }: AnimatedBackgroundProps) {
  const [randomVideoSrc, setRandomVideoSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!videoSrc) {
      setRandomVideoSrc(getRandomBackgroundVideo());
    }
  }, [videoSrc]);

  const resolvedVideoSrc = videoSrc ?? randomVideoSrc;

  return (
    <div className={`min-h-screen relative overflow-hidden bg-[#FAFAFA] z-0 ${className}`}>
      {resolvedVideoSrc && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover -z-20"
        >
          <source src={resolvedVideoSrc} type="video/mp4" />
        </video>
      )}
      
      {/* White Shade Overlay over the Video */}
      <div className="absolute inset-0 bg-white/70 pointer-events-none backdrop-blur-[2px] -z-10" />

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
