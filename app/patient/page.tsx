"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";

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
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-medical-primary to-teal-400 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.6),_0_8px_16px_rgba(0,123,255,0.3)] mb-6">
              <span className="text-white font-extrabold text-4xl drop-shadow-md">A</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-medical-text mb-4 drop-shadow-sm tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-medical-text to-medical-primary">Welcome to AIIMS Delhi</h1>
            <p className="text-medical-text-secondary/90 text-lg md:text-xl font-medium">Please select an option to continue</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              whileHover={{ scale: 1.05, rotateY: 5, rotateX: 5 }}
              onClick={() => router.push("/patient/login")}
              className="super-glass p-8 relative overflow-hidden group cursor-pointer transition-all duration-300 rounded-3xl"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/50 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <div className="text-center py-6 relative z-10">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center mb-6 shadow-inner group-hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.6),_0_8px_16px_rgba(0,123,255,0.2)] transition-shadow duration-300">
                  <span className="text-5xl drop-shadow-sm group-hover:scale-110 transition-transform duration-300">�</span>
                </div>
                <h2 className="text-2xl font-extrabold text-medical-text mb-3">Existing Patient</h2>
                <p className="text-medical-text-secondary/90 font-medium text-base">
                  I already have a Patient ID.
                  <br />
                  Log in to your account.
                </p>
              </div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-400 opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              whileHover={{ scale: 1.05, rotateY: -5, rotateX: 5 }}
              onClick={() => router.push("/patient/signup")}
              className="super-glass p-8 relative overflow-hidden group cursor-pointer transition-all duration-300 rounded-3xl"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/50 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <div className="text-center py-6 relative z-10">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center mb-6 shadow-inner group-hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.6),_0_8px_16px_rgba(16,185,129,0.2)] transition-shadow duration-300">
                  <span className="text-5xl drop-shadow-sm group-hover:scale-110 transition-transform duration-300">✨</span>
                </div>
                <h2 className="text-2xl font-extrabold text-medical-text mb-3">New Patient</h2>
                <p className="text-medical-text-secondary/90 font-medium text-base">
                  I&apos;m visiting for the first time.
                  <br />
                  Create a new account.
                </p>
              </div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-400 opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
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
              className="text-sm font-bold text-medical-text-secondary/80 hover:text-medical-primary transition-colors hover:-translate-x-1 inline-block transform duration-200"
            >
              &larr; Back to Home
            </button>
          </motion.div>
        </div>
      </div>
    </AnimatedBackground>
  );
}