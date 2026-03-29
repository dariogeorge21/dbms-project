"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";

const loadingMsgs = [
  "Harmonizing Medical Records...",
  "Calibrating Quantum Scanners...",
  "Initializing Appointment Matrices...",
  "Synthesizing Healthcare Data...",
  "Preparing Your Wellness Journey...",
];

export default function LandingPage() {
  const [loading, setLoading] = useState(true);
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % loadingMsgs.length);
    }, 1200);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 3600);

    return () => {
      clearInterval(msgInterval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed mt-4 inset-0 z-50 flex flex-col items-center justify-center bg-[#FAFAFA]"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 rounded-full border-[3px] border-t-medical-primary border-r-medical-primary-light border-b-medical-success border-l-transparent shadow-[0_0_40px_rgba(0,123,255,0.4)]"
            />
            {/* <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="mt-8 text-xl font-medium text-gradient-glossy"
            >
              {loadingMsgs[msgIndex]}
            </motion.div> */}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatedBackground videoSrc="https://www.pexels.com/download/video/5203512/">
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <motion.header
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 3.8, duration: 0.8 }}
            className="super-glass mx-4 mt-6 px-6 py-4 flex items-center justify-between shadow-[0_8px_32px_rgba(0,123,255,0.1)]"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center transform transition-transform hover:scale-105 relative">
                <div className="absolute inset-0 bg-white/30 rounded-xl blur-lg" />
                <img 
                  src="https://upload.wikimedia.org/wikipedia/en/8/85/All_India_Institute_of_Medical_Sciences%2C_Delhi.svg" 
                  alt="AIIMS Logo" 
                  className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]"
                />
              </div>
              <div>
                <h1 className="font-extrabold text-medical-text text-xl leading-tight tracking-tight">AIIMS Delhi</h1>
                <p className="text-sm font-medium text-medical-text-secondary/80">All India Institute of Medical Sciences</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                href="/doctor/login"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-medical-primary hover:bg-white/60 transition-all super-glass border-transparent hover:border-white/80"
              >
                Doctor Portal
              </Link>
              <Link
                href="/admin/login"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-medical-text hover:bg-white/60 transition-all super-glass border-transparent hover:border-white/80"
              >
                Admin
              </Link>
            </div>
          </motion.header>

          {/* Hero Section */}
          <div className="flex-1 flex items-center justify-center px-4 relative z-10 pt-20">
            <div className="text-center max-w-4xl w-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 4, duration: 1, type: "spring", bounce: 0.4 }}
              >
                {/* AIIMS Logo 3D */}
                {/* <div className="mb-10 relative inline-block">
                  <motion.div
                    animate={{ 
                      y: [-10, 10, -10],
                      rotateX: [0, 5, -5, 0],
                      rotateY: [0, -5, 5, 0]
                    }}
                    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                    style={{ transformPerspective: 1000 }}
                    className="relative w-36 h-36 mx-auto rounded-[2rem] bg-gradient-to-br from-[#00E5FF] via-[#007BFF] to-[#0056b3] flex items-center justify-center shadow-[0_20px_50px_rgba(0,123,255,0.4),_inset_0_2px_10px_rgba(255,255,255,0.6),_inset_0_-5px_20px_rgba(0,0,0,0.2)]"
                  >
                    <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-tr from-transparent via-white/30 to-transparent pointer-events-none" />
                    <span className="text-white font-extrabold text-7xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">A</span>
                  </motion.div>
                  {/* Floor Shadow */}
                  {/* <motion.div 
                    animate={{ scale: [1, 0.8, 1], opacity: [0.3, 0.1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-24 h-4 bg-black/20 rounded-[100%] blur-md"
                  />
                </div> */} 

                <h1 className="text-4xl md:text-6xl font-extrabold text-medical-text mb-4 leading-[1.1] tracking-tight">
                  All India Institute of
                  <br />
                  <span className="text-gradient-glossy drop-shadow-sm">Medical Sciences</span>
                </h1>
                <p className="text-xl font-medium text-medical-text-secondary/90 mb-4 tracking-wide">New Delhi</p>
                <p className="text-lg text-medical-text-secondary/80 mb-10 max-w-2xl mx-auto leading-relaxed">
                  Experience healthcare reimagined. Book your appointments seamlessly through our next-generation digital portal.
                </p>

                {/* CTA Button */}
                <Link href="/patient">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-12 py-5 rounded-[2rem] btn-super-glass text-xl font-bold tracking-wide relative group overflow-hidden"
                  >
                    <span className="relative z-10 text-medical-primary group-hover:text-[#0056b3] transition-colors">Book Appointment</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                  </motion.button>
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 4.5, duration: 0.8 }}
                className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
              >
                {[
                  { label: "Specialized Departments", value: "42+" },
                  { label: "Expert Doctors", value: "500+" },
                  { label: "Daily Patients Treated", value: "10K+" },
                ].map((stat, i) => (
                  <motion.div 
                    key={stat.label}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="super-glass p-8 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <p className="text-4xl font-extrabold text-gradient-glossy mb-2 drop-shadow-sm">{stat.value}</p>
                    <p className="text-sm font-semibold text-medical-text-secondary/70 uppercase tracking-widest">{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Footer */}
          <motion.footer 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 5, duration: 0.8 }}
            className="w-full relative z-10 mt-auto pt-24 pb-8 px-4"
          >
            <div className="max-w-6xl mx-auto super-glass p-8 md:p-12 mb-8 grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-white/30 rounded-xl blur-md" />
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/en/8/85/All_India_Institute_of_Medical_Sciences%2C_Delhi.svg" 
                      alt="AIIMS Logo" 
                      className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                    />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-medical-text text-lg leading-tight tracking-tight">AIIMS Delhi</h2>
                    <p className="text-xs font-medium text-medical-text-secondary/80">All India Institute of Medical Sciences</p>
                  </div>
                </div>
                <p className="text-sm text-medical-text-secondary/80 leading-relaxed max-w-sm">
                  Revolutionizing healthcare accessibility with our next-generation digital appointment and management portal. Experience world-class medical services seamlessly.
                </p>
              </div>
              
              <div>
                <h3 className="font-bold text-medical-text mb-4 text-gradient-glossy">Quick Links</h3>
                <ul className="space-y-3">
                  <li><Link href="/patient" className="text-sm text-medical-text-secondary/80 hover:text-medical-primary hover:translate-x-1 inline-block transition-all">Patient Portal</Link></li>
                  <li><Link href="/doctor/login" className="text-sm text-medical-text-secondary/80 hover:text-medical-primary hover:translate-x-1 inline-block transition-all">Doctor Portal</Link></li>
                  <li><Link href="/admin/login" className="text-sm text-medical-text-secondary/80 hover:text-medical-primary hover:translate-x-1 inline-block transition-all">Admin Dashboard</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-medical-text mb-4 text-gradient-glossy">Legal & Support</h3>
                <ul className="space-y-3">
                  <li><Link href="/faq" className="text-sm text-medical-text-secondary/80 hover:text-medical-primary hover:translate-x-1 inline-block transition-all">FAQ & Support</Link></li>
                  <li><Link href="/privacy-policy" className="text-sm text-medical-text-secondary/80 hover:text-medical-primary hover:translate-x-1 inline-block transition-all">Privacy Policy</Link></li>
                  <li><Link href="/terms-of-service" className="text-sm text-medical-text-secondary/80 hover:text-medical-primary hover:translate-x-1 inline-block transition-all">Terms of Service</Link></li>
                </ul>
              </div>
            </div>

            <div className="text-center text-sm font-medium text-medical-text-secondary/60">
              © {new Date().getFullYear()} AIIMS Delhi — Next-Gen Appointment Portal. All rights reserved.
            </div>
          </motion.footer>
        </div>
      </AnimatedBackground>
    </>
  );
}
