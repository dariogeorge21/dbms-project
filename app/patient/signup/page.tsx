"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";
import GlassCard from "@/components/GlassCard";
import { SuccessModal } from "@/components/Modal";

export default function PatientSignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    sex: "male",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [patientId, setPatientId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          dob: form.dob,
          sex: form.sex,
          password: form.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      setPatientId(data.patientId);
      setShowSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200 text-medical-text placeholder-gray-400 focus:border-medical-primary focus:ring-2 focus:ring-blue-100 transition-all outline-none";

  return (
    <AnimatedBackground>
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-medical-primary to-medical-primary-light flex items-center justify-center shadow-lg mb-4">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <h1 className="text-2xl font-bold text-medical-text">New Patient Registration</h1>
            <p className="text-medical-text-secondary mt-1">Create your AIIMS Delhi patient account</p>
          </motion.div>

          <div className="super-glass p-8 relative overflow-hidden group">
  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/50 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
  <div className="relative z-10">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-medical-text mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-medical-text mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputClass}
                  placeholder="you@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-medical-text mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={inputClass}
                  placeholder="10-digit phone number"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-medical-text mb-1">Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={form.dob}
                    onChange={(e) => setForm({ ...form, dob: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-medical-text mb-1">Sex</label>
                  <select
                    value={form.sex}
                    onChange={(e) => setForm({ ...form, sex: e.target.value })}
                    className={inputClass}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-medical-text mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={inputClass}
                  placeholder="Create a password"
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-medical-text mb-1">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  className={inputClass}
                  placeholder="Confirm your password"
                />
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-medical-danger bg-red-50 px-4 py-2 rounded-lg"
                >
                  {error}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-medical-primary to-medical-primary-light text-white font-semibold btn-glow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>

              <p className="text-center text-sm text-medical-text-secondary">
                Already have a Patient ID?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/patient/login")}
                  className="text-medical-primary font-medium hover:underline"
                >
                  Login here
                </button>
              </p>
            </form>
            </div>
</div>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          router.push("/patient/dashboard");
        }}
        message={`Registration successful! Your Patient ID is ${patientId}. Please save this for future reference.`}
      />
    </AnimatedBackground>
  );
}
