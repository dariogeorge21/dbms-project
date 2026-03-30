"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";
import { UserCheck, UserPlus, ArrowLeft } from "lucide-react";

export default function PatientChoicePage() {
  const router = useRouter();

  return (
    <AnimatedBackground videoSrc="https://www.pexels.com/download/video/36718656/">
      <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
        <div className="w-full max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
            className="text-center mb-12"
          >
            <div className="h-24 w-24 mx-auto mb-4 relative">
              <img 
                  src="https://upload.wikimedia.org/wikipedia/en/8/85/All_India_Institute_of_Medical_Sciences%2C_Delhi.svg" 
                  alt="AIIMS Logo" 
                  className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]"
                />
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-medical-text mb-4 drop-shadow-sm tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-medical-text to-medical-primary">Welcome to AIIMS Delhi</h1>
            <p className="text-medical-text-secondary/90 text-lg md:text-xl font-medium">Please select an option to continue</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/patient/login")}
              className="super-glass p-8 relative overflow-hidden group cursor-pointer transition-all duration-500 rounded-3xl border border-white/5 hover:border-blue-500/30 shadow-lg hover:shadow-blue-500/20"
            >
              {/* Animated Glow Overlay on Hover/Click */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 via-transparent to-blue-600/0 group-hover:from-blue-400/10 group-hover:to-blue-600/5 group-active:from-blue-400/30 group-active:via-blue-500/10 group-active:to-transparent opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-all duration-500 pointer-events-none" />
              
              {/* Corner Glow Effects on Click */}
              <div className="absolute -top-12 -left-12 w-32 h-32 bg-blue-400 opacity-0 group-active:opacity-40 rounded-full blur-3xl transition-opacity duration-300 pointer-events-none" />
              <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-blue-600 opacity-0 group-hover:opacity-20 group-active:opacity-40 rounded-full blur-3xl transition-opacity duration-300 pointer-events-none" />
              
              <div className="text-center py-6 relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300 shadow-inner">
                  <UserCheck className="w-8 h-8 text-blue-500" />
                </div>
                <h2 className="text-2xl font-extrabold text-medical-text mb-3 tracking-tight">Existing Patient</h2>
                <p className="text-medical-text-secondary/90 font-medium text-base">
                  I already have a Patient ID.
                  <br />
                  Log in to your account.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/patient/signup")}
              className="super-glass p-8 relative overflow-hidden group cursor-pointer transition-all duration-500 rounded-3xl border border-white/5 hover:border-emerald-500/30 shadow-lg hover:shadow-emerald-500/20"
            >
              {/* Animated Glow Overlay on Hover/Click */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/0 via-transparent to-emerald-600/0 group-hover:from-emerald-400/10 group-hover:to-emerald-600/5 group-active:from-emerald-400/30 group-active:via-emerald-500/10 group-active:to-transparent opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-all duration-500 pointer-events-none" />
              
              {/* Corner Glow Effects on Click */}
              <div className="absolute -top-12 -left-12 w-32 h-32 bg-emerald-400 opacity-0 group-active:opacity-40 rounded-full blur-3xl transition-opacity duration-300 pointer-events-none" />
              <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-emerald-600 opacity-0 group-hover:opacity-20 group-active:opacity-40 rounded-full blur-3xl transition-opacity duration-300 pointer-events-none" />
              
              <div className="text-center py-6 relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300 shadow-inner">
                  <UserPlus className="w-8 h-8 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-extrabold text-medical-text mb-3 tracking-tight">New Patient</h2>
                <p className="text-medical-text-secondary/90 font-medium text-base">
                  I&apos;m visiting for the first time.
                  <br />
                  Create a new account.
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-12 relative z-10"
          >
            <button
              onClick={() => router.push("/")}
              className="group flex items-center justify-center mx-auto space-x-2 text-sm font-bold text-medical-text-secondary/80 hover:text-medical-primary transition-colors duration-200 py-2 px-6 rounded-full hover:bg-white/5 active:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
              <span>Back to Home</span>
            </button>
          </motion.div>
        </div>
      </div>
    </AnimatedBackground>
  );
}