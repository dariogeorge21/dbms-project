"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";
import GlassCard from "@/components/GlassCard";

export default function AdminLoginPage() {
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
      const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ identifier, password }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Login failed"); return; }
      if (data.user.role === "admin") { router.push("/admin/dashboard"); }
      else { setError("This login is for administrators only."); }
    } catch { setError("Something went wrong."); }
    finally { setLoading(false); }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200 text-medical-text placeholder-gray-400 focus:border-medical-primary focus:ring-2 focus:ring-blue-100 transition-all outline-none";

  return (
    <AnimatedBackground>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center shadow-lg mb-4">
              <span className="text-white text-2xl">⚙️</span>
            </div>
            <h1 className="text-2xl font-bold text-medical-text">Admin Portal</h1>
            <p className="text-medical-text-secondary mt-1">AIIMS Delhi — Administrator Login</p>
          </motion.div>
          <GlassCard>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div><label className="block text-sm font-medium text-medical-text mb-1">Email or Phone</label><input type="text" required value={identifier} onChange={(e) => setIdentifier(e.target.value)} className={inputClass} placeholder="Enter credentials" /></div>
              <div><label className="block text-sm font-medium text-medical-text mb-1">Password</label><input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="Enter password" /></div>
              {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-medical-danger bg-red-50 px-4 py-2 rounded-lg">{error}</motion.p>}
              <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-400 text-white font-semibold btn-glow disabled:opacity-50">{loading ? "Logging in..." : "Login"}</button>
            </form>
          </GlassCard>
          <div className="text-center mt-6"><button onClick={() => router.push("/")} className="text-sm text-medical-text-secondary hover:text-medical-primary transition-colors">← Back to Home</button></div>
        </div>
      </div>
    </AnimatedBackground>
  );
}
