"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import GlassCard from "@/components/GlassCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { SuccessModal } from "@/components/Modal";

interface Medicine {
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes: string;
}

export default function ConsultationPage() {
  const router = useRouter();
  const params = useParams();
  const appointmentId = params.id as string;

  const [profile, setProfile] = useState<{ name: string; doctorId: string } | null>(null);
  const [appointment, setAppointment] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    bloodPressure: "",
    pulse: "",
    temperature: "",
    spo2: "",
    respiratoryRate: "",
    weight: "",
    height: "",
    diagnosis: "",
    description: "",
    nextReviewDate: "",
  });

  const [medicines, setMedicines] = useState<Medicine[]>([
    { medicineName: "", dosage: "", frequency: "", duration: "", notes: "" },
  ]);

  useEffect(() => {
    async function init() {
      try {
        const [meRes, aptRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch(`/api/appointments/${appointmentId}`),
        ]);

        if (!meRes.ok) { router.push("/doctor/login"); return; }
        const meData = await meRes.json();
        setProfile(meData.profile);

        if (aptRes.ok) {
          const aptData = await aptRes.json();
          setAppointment(aptData.appointment);
        }
      } catch {
        router.push("/doctor/login");
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [router, appointmentId]);

  const addMedicine = () => {
    setMedicines([...medicines, { medicineName: "", dosage: "", frequency: "", duration: "", notes: "" }]);
  };

  const removeMedicine = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const updateMedicine = (index: number, field: keyof Medicine, value: string) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const validMedicines = medicines.filter((m) => m.medicineName.trim());

      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId,
          vitalSigns: {
            bloodPressure: form.bloodPressure,
            pulse: Number(form.pulse) || 0,
            temperature: form.temperature,
            spo2: form.spo2,
            respiratoryRate: Number(form.respiratoryRate) || 0,
            weight: Number(form.weight) || 0,
            height: Number(form.height) || 0,
          },
          diagnosis: form.diagnosis,
          description: form.description,
          medicines: validMedicines,
          nextReviewDate: form.nextReviewDate || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to save"); return; }
      setShowSuccess(true);
    } catch {
      setError("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <AnimatedBackground videoSrc="https://www.pexels.com/download/video/36718656/"><LoadingSpinner text="Loading consultation..." /></AnimatedBackground>;

  const apt = appointment as Record<string, unknown>;
  const inputClass = "w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200 text-medical-text placeholder-gray-400 focus:border-medical-primary focus:ring-2 focus:ring-blue-100 transition-all outline-none";

  return (
    <AnimatedBackground videoSrc="https://www.pexels.com/download/video/36718656/">
      <Navbar role="doctor" userName={profile?.name} userIdentifier={profile?.doctorId} />

      <div className="px-4 md:px-8 pb-8 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <button onClick={() => router.push("/doctor/dashboard")} className="text-sm text-medical-text-secondary hover:text-medical-primary mb-2">← Back to Dashboard</button>
          <h1 className="text-3xl font-bold text-medical-text">Consultation</h1>
        </motion.div>

        {/* Patient Summary */}
        {apt && (
          <div className="super-glass p-8 relative overflow-hidden group mb-6">
  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/50 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
  <div className="relative z-10">
            <h2 className="text-lg font-bold text-medical-text mb-3">Patient Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div><span className="text-medical-text-secondary">Name:</span> <span className="font-medium ml-1">{apt.patientName as string}</span></div>
              <div><span className="text-medical-text-secondary">Age:</span> <span className="font-medium ml-1">{apt.age as number}</span></div>
              <div><span className="text-medical-text-secondary">Sex:</span> <span className="font-medium ml-1 capitalize">{apt.sex as string}</span></div>
              <div><span className="text-medical-text-secondary">Token:</span> <span className="font-medium ml-1">{(apt.tokenNumber as string) || "N/A"}</span></div>
              <div className="col-span-2"><span className="text-medical-text-secondary">Problem:</span> <span className="font-medium ml-1">{apt.problemDescription as string}</span></div>
              <div className="col-span-2"><span className="text-medical-text-secondary">History:</span> <span className="font-medium ml-1">{apt.previousMedicalHistory as string}</span></div>
            </div>
            </div>
</div>
        )}

        {/* Consultation Form */}
        <div className="super-glass p-8 relative overflow-hidden group">
  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/50 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
  <div className="relative z-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Vital Signs */}
            <div>
              <h3 className="text-sm font-semibold text-medical-text-secondary uppercase tracking-wider mb-3">Vital Signs</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-medical-text mb-1">Blood Pressure</label>
                  <input value={form.bloodPressure} onChange={(e) => setForm({ ...form, bloodPressure: e.target.value })} className={inputClass} placeholder="120/80" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-medical-text mb-1">Pulse (bpm)</label>
                  <input type="number" value={form.pulse} onChange={(e) => setForm({ ...form, pulse: e.target.value })} className={inputClass} placeholder="72" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-medical-text mb-1">Temperature</label>
                  <input value={form.temperature} onChange={(e) => setForm({ ...form, temperature: e.target.value })} className={inputClass} placeholder="98.6 F" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-medical-text mb-1">SpO2</label>
                  <input value={form.spo2} onChange={(e) => setForm({ ...form, spo2: e.target.value })} className={inputClass} placeholder="98%" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-medical-text mb-1">Respiratory Rate</label>
                  <input type="number" value={form.respiratoryRate} onChange={(e) => setForm({ ...form, respiratoryRate: e.target.value })} className={inputClass} placeholder="18" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-medical-text mb-1">Weight (kg)</label>
                  <input type="number" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} className={inputClass} placeholder="kg" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-medical-text mb-1">Height (cm)</label>
                  <input type="number" value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} className={inputClass} placeholder="cm" />
                </div>
              </div>
            </div>

            {/* Diagnosis */}
            <div>
              <h3 className="text-sm font-semibold text-medical-text-secondary uppercase tracking-wider mb-3">Diagnosis</h3>
              <input required value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: e.target.value })} className={inputClass} placeholder="Primary diagnosis" />
              <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputClass} mt-3`} placeholder="Additional notes..." />
            </div>

            {/* Medicines */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-medical-text-secondary uppercase tracking-wider">Medicines</h3>
                <button type="button" onClick={addMedicine} className="text-sm text-medical-primary hover:underline">+ Add Medicine</button>
              </div>
              {medicines.map((med, i) => (
                <div key={i} className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-3 p-3 rounded-xl bg-white/30 border border-gray-100">
                  <input value={med.medicineName} onChange={(e) => updateMedicine(i, "medicineName", e.target.value)} className={inputClass} placeholder="Medicine" />
                  <input value={med.dosage} onChange={(e) => updateMedicine(i, "dosage", e.target.value)} className={inputClass} placeholder="Dosage" />
                  <input value={med.frequency} onChange={(e) => updateMedicine(i, "frequency", e.target.value)} className={inputClass} placeholder="Frequency" />
                  <input value={med.duration} onChange={(e) => updateMedicine(i, "duration", e.target.value)} className={inputClass} placeholder="Duration" />
                  <input value={med.notes} onChange={(e) => updateMedicine(i, "notes", e.target.value)} className={inputClass} placeholder="Notes" />
                  <button type="button" onClick={() => removeMedicine(i)} className="px-3 py-2 rounded-xl bg-red-50 text-red-500 text-sm hover:bg-red-100" disabled={medicines.length === 1}>✕</button>
                </div>
              ))}
            </div>

            {/* Next Review */}
            <div>
              <label className="block text-sm font-medium text-medical-text mb-1">Next Review Date (Optional)</label>
              <input type="date" value={form.nextReviewDate} onChange={(e) => setForm({ ...form, nextReviewDate: e.target.value })} className={`${inputClass} max-w-xs`} />
            </div>

            {error && <p className="text-sm text-medical-danger bg-red-50 px-4 py-2 rounded-lg">{error}</p>}

            <button type="submit" disabled={submitting} className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-white font-semibold btn-glow disabled:opacity-50">
              {submitting ? "Saving..." : "Complete Consultation"}
            </button>
          </form>
          </div>
</div>
      </div>

      <SuccessModal isOpen={showSuccess} onClose={() => { setShowSuccess(false); router.push("/doctor/dashboard"); }} message="Consultation recorded and appointment marked as completed!" />
    </AnimatedBackground>
  );
}
