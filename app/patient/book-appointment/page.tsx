"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import GlassCard from "@/components/GlassCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { SuccessModal } from "@/components/Modal";

interface DoctorOption {
  _id: string;
  name: string;
  doctorId: string;
  specialization: string;
  department: string;
}

export default function BookAppointmentPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<{ name: string; patientId: string } | null>(null);
  const [doctors, setDoctors] = useState<DoctorOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    age: "",
    weight: "",
    height: "",
    location: "",
    sex: "male",
    bystanderName: "",
    bystanderPhone: "",
    problemDescription: "",
    previousMedicalHistory: "",
    preferredDoctorId: "",
    preferredTimeSlot: "morning",
  });

  useEffect(() => {
    async function init() {
      try {
        const [meRes, docRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/doctors?active=true"),
        ]);

        if (!meRes.ok) {
          router.push("/patient/login");
          return;
        }

        const meData = await meRes.json();
        setProfile(meData.profile);

        if (docRes.ok) {
          const docData = await docRes.json();
          setDoctors(docData.doctors);
        }
      } catch {
        router.push("/patient/login");
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to book appointment");
        return;
      }

      setShowSuccess(true);
    } catch {
      setError("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AnimatedBackground>
        <LoadingSpinner text="Loading appointment form..." />
      </AnimatedBackground>
    );
  }

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200 text-medical-text placeholder-gray-400 focus:border-medical-primary focus:ring-2 focus:ring-blue-100 transition-all outline-none";

  return (
    <AnimatedBackground>
      <Navbar role="patient" userName={profile?.name} userIdentifier={profile?.patientId} />

      <div className="px-4 md:px-8 pb-8 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-medical-text">Book Appointment</h1>
          <p className="text-medical-text-secondary mt-1">Fill in the details below to request an appointment</p>
        </motion.div>

        <div className="super-glass p-8 relative overflow-hidden group">
  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/50 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
  <div className="relative z-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Patient Name (fixed) */}
            <div>
              <label className="block text-sm font-medium text-medical-text mb-1">Patient Name</label>
              <div className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-medical-text font-medium">
                {profile?.name}
                <span className="ml-2 text-xs text-medical-text-secondary">({profile?.patientId})</span>
              </div>
            </div>

            {/* Vitals */}
            <div>
              <h3 className="text-sm font-semibold text-medical-text-secondary uppercase tracking-wider mb-3">Physical Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-medical-text mb-1">Age</label>
                  <input type="number" required value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className={inputClass} placeholder="Years" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-medical-text mb-1">Weight (kg)</label>
                  <input type="number" required value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} className={inputClass} placeholder="kg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-medical-text mb-1">Height (cm)</label>
                  <input type="number" required value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} className={inputClass} placeholder="cm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-medical-text mb-1">Sex</label>
                  <select value={form.sex} onChange={(e) => setForm({ ...form, sex: e.target.value })} className={inputClass}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-medical-text mb-1">Location</label>
              <input type="text" required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputClass} placeholder="City / Area" />
            </div>

            {/* Bystander */}
            <div>
              <h3 className="text-sm font-semibold text-medical-text-secondary uppercase tracking-wider mb-3">Bystander Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-medical-text mb-1">Bystander Name</label>
                  <input type="text" required value={form.bystanderName} onChange={(e) => setForm({ ...form, bystanderName: e.target.value })} className={inputClass} placeholder="Name of bystander" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-medical-text mb-1">Bystander Phone</label>
                  <input type="tel" required value={form.bystanderPhone} onChange={(e) => setForm({ ...form, bystanderPhone: e.target.value })} className={inputClass} placeholder="Phone number" />
                </div>
              </div>
            </div>

            {/* Medical Info */}
            <div>
              <h3 className="text-sm font-semibold text-medical-text-secondary uppercase tracking-wider mb-3">Medical Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-medical-text mb-1">Problem Description</label>
                  <textarea required rows={3} value={form.problemDescription} onChange={(e) => setForm({ ...form, problemDescription: e.target.value })} className={inputClass} placeholder="Describe your symptoms or medical issue..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-medical-text mb-1">Previous Medical History</label>
                  <textarea required rows={2} value={form.previousMedicalHistory} onChange={(e) => setForm({ ...form, previousMedicalHistory: e.target.value })} className={inputClass} placeholder="Any previous conditions, surgeries, allergies..." />
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div>
              <h3 className="text-sm font-semibold text-medical-text-secondary uppercase tracking-wider mb-3">Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-medical-text mb-1">Preferred Doctor (Optional)</label>
                  <select value={form.preferredDoctorId} onChange={(e) => setForm({ ...form, preferredDoctorId: e.target.value })} className={inputClass}>
                    <option value="">No preference</option>
                    {doctors.map((doc) => (
                      <option key={doc._id} value={doc._id}>
                        {doc.name} — {doc.specialization}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-medical-text mb-1">Preferred Time Slot</label>
                  <select value={form.preferredTimeSlot} onChange={(e) => setForm({ ...form, preferredTimeSlot: e.target.value })} className={inputClass}>
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                  </select>
                </div>
              </div>
            </div>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-medical-danger bg-red-50 px-4 py-2 rounded-lg">
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-medical-primary to-medical-primary-light text-white font-semibold btn-glow disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Appointment Request"}
            </button>
          </form>
          </div>
</div>
      </div>

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          router.push("/patient/dashboard");
        }}
        message="Your appointment has been requested successfully! You will receive your token and time slot once an administrator assigns your appointment."
      />
    </AnimatedBackground>
  );
}
