"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";
import GlassCard from "@/components/GlassCard";

export default function DoctorLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.error || "Login failed"); return; }

      if (data.user.role === "doctor") {
        router.push("/doctor/dashboard");
      } else {
        setError("This login is for doctors only.");
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3.5 rounded-xl bg-white/60 border border-white/80 text-medical-text placeholder-gray-500 focus:bg-white/90 focus:border-medical-primary focus:ring-4 focus:ring-medical-primary/20 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] outline-none font-medium";

  return (
    <AnimatedBackground videoSrc="https://www.pexels.com/download/video/36718656/">
      <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
            className="text-center mb-8"
          >
            
            <h1 className="text-3xl font-extrabold text-medical-text drop-shadow-sm">Doctor Portal</h1>
            <p className="text-medical-text-secondary/90 mt-2 font-medium">AIIMS Delhi — Doctor Login</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="super-glass p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-medical-text mb-2">Email or Phone</label>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className={inputClass}
                  placeholder="Enter email or phone"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-medical-text mb-2">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  placeholder="Enter password"
                />
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm font-semibold text-red-600 bg-red-100/80 border border-red-200 px-4 py-3 rounded-xl shadow-sm"
                >
                  {error}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl btn-super-glass text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-400"
              >
                <span className="relative z-10 text-white font-bold group-hover:text-white transition-colors">
                  {loading ? "Authenticating..." : "Sign In"}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-8"
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