"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";
import GlassCard from "@/components/GlassCard";

export default function PatientChoicePage() {
  const router = useRouter();

  return (
    <AnimatedBackground>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-medical-primary to-medical-primary-light flex items-center justify-center shadow-lg mb-4">
              <span className="text-white font-bold text-2xl">A</span>
            </div>
            <h1 className="text-3xl font-bold text-medical-text mb-2">Welcome to AIIMS Delhi</h1>
            <p className="text-medical-text-secondary text-lg">Do you already have a Patient ID?</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard hover onClick={() => router.push("/patient/login")}>
              <div className="text-center py-8">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                  <span className="text-4xl">🔑</span>
                </div>
                <h2 className="text-xl font-bold text-medical-text mb-2">Existing Patient</h2>
                <p className="text-medical-text-secondary text-sm">
                  I already have a Patient ID.
                  <br />
                  Log in to your account.
                </p>
              </div>
            </GlassCard>

            <GlassCard hover onClick={() => router.push("/patient/signup")}>
              <div className="text-center py-8">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
                  <span className="text-4xl">✨</span>
                </div>
                <h2 className="text-xl font-bold text-medical-text mb-2">New Patient</h2>
                <p className="text-medical-text-secondary text-sm">
                  I&apos;m visiting for the first time.
                  <br />
                  Create a new account.
                </p>
              </div>
            </GlassCard>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-8"
          >
            <button
              onClick={() => router.push("/")}
              className="text-sm text-medical-text-secondary hover:text-medical-primary transition-colors"
            >
              ← Back to Home
            </button>
          </motion.div>
        </div>
      </div>
    </AnimatedBackground>
  );
}
