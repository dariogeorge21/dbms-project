"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function LandingPage() {
  return (
    <AnimatedBackground>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card mx-4 mt-4 px-6 py-3 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-medical-primary to-medical-primary-light flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div>
              <h1 className="font-bold text-medical-text text-lg leading-tight">AIIMS Delhi</h1>
              <p className="text-xs text-medical-text-secondary">All India Institute of Medical Sciences</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href="/doctor/login"
              className="px-4 py-2 rounded-xl text-sm font-medium text-medical-text-secondary hover:bg-blue-50 transition-all"
            >
              Doctor Portal
            </Link>
            <Link
              href="/admin/login"
              className="px-4 py-2 rounded-xl text-sm font-medium text-medical-text-secondary hover:bg-blue-50 transition-all"
            >
              Admin
            </Link>
          </div>
        </motion.header>

        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-3xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* AIIMS Logo */}
              <div className="mb-8">
                <motion.div
                  animate={{ boxShadow: ["0 0 40px rgba(0,123,255,0.1)", "0 0 80px rgba(0,123,255,0.2)", "0 0 40px rgba(0,123,255,0.1)"] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="w-28 h-28 mx-auto rounded-3xl bg-gradient-to-br from-medical-primary to-medical-primary-light flex items-center justify-center shadow-2xl"
                >
                  <span className="text-white font-bold text-5xl">A</span>
                </motion.div>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-medical-text mb-4 leading-tight">
                All India Institute of
                <br />
                <span className="text-gradient">Medical Sciences</span>
              </h1>
              <p className="text-xl text-medical-text-secondary mb-4">New Delhi</p>
              <p className="text-lg text-medical-text-secondary mb-12 max-w-xl mx-auto">
                Book your appointment seamlessly through our digital portal.
                Quality healthcare at your fingertips.
              </p>

              {/* CTA Button */}
              <Link href="/patient">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-10 py-4 rounded-2xl bg-gradient-to-r from-medical-primary to-medical-primary-light text-white text-lg font-semibold btn-glow shadow-xl"
                >
                  Book Appointment
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-20 grid grid-cols-3 gap-6 max-w-lg mx-auto"
            >
              {[
                { label: "Departments", value: "42+" },
                { label: "Doctors", value: "500+" },
                { label: "Daily Patients", value: "10K+" },
              ].map((stat) => (
                <div key={stat.label} className="glass-card p-4">
                  <p className="text-2xl font-bold text-gradient">{stat.value}</p>
                  <p className="text-xs text-medical-text-secondary mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-6 text-sm text-medical-text-secondary">
          © 2026 AIIMS Delhi — Appointment Booking Portal
        </footer>
      </div>
    </AnimatedBackground>
  );
}
