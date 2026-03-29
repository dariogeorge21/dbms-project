"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import GlassCard from "@/components/GlassCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { SuccessModal } from "@/components/Modal";

interface PatientProfile {
  _id: string;
  patientId: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  sex: string;
}

interface AppointmentItem {
  _id: string;
  appointmentId: string;
  status: string;
  preferredTimeSlot: string;
  assignedTimeSlot?: string;
  tokenNumber?: string;
  appointmentDate?: string;
  problemDescription: string;
  doctorId?: { name: string; specialization: string };
  createdAt: string;
}

export default function PatientDashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "" });
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const [meRes, aptRes] = await Promise.all([
        fetch("/api/auth/me"),
        fetch("/api/appointments"),
      ]);

      if (!meRes.ok) {
        router.push("/patient/login");
        return;
      }

      const meData = await meRes.json();
      if (meData.user.role !== "patient") {
        router.push("/patient/login");
        return;
      }

      setProfile(meData.profile);
      setEditForm({
        name: meData.profile.name,
        email: meData.profile.email,
        phone: meData.profile.phone,
      });

      if (aptRes.ok) {
        const aptData = await aptRes.json();
        setAppointments(aptData.appointments);
      }
    } catch {
      router.push("/patient/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/patients", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        setSuccessMsg("Profile updated successfully!");
        setShowSuccess(true);
        setEditing(false);
        fetchData();
      }
    } catch {
      // handle error
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      requested: "bg-amber-50 text-amber-700",
      assigned: "bg-blue-50 text-blue-700",
      in_consultation: "bg-purple-50 text-purple-700",
      completed: "bg-emerald-50 text-emerald-700",
      cancelled: "bg-red-50 text-red-700",
    };
    return colors[status] || "bg-gray-50 text-gray-700";
  };

  if (loading) {
    return (
      <AnimatedBackground>
        <LoadingSpinner text="Loading dashboard..." />
      </AnimatedBackground>
    );
  }

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200 text-medical-text placeholder-gray-400 focus:border-medical-primary focus:ring-2 focus:ring-blue-100 transition-all outline-none";

  return (
    <AnimatedBackground>
      <Navbar
        role="patient"
        userName={profile?.name}
        userIdentifier={profile?.patientId}
      />

      <div className="px-4 md:px-8 pb-8 max-w-6xl mx-auto">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-medical-text">
            Welcome back, <span className="text-gradient">{profile?.name}</span>
          </h1>
          <p className="text-medical-text-secondary mt-1">Manage your profile and appointments</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <GlassCard>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-medical-text">Profile</h2>
                <button
                  onClick={() => setEditing(!editing)}
                  className="text-sm text-medical-primary hover:underline"
                >
                  {editing ? "Cancel" : "Edit"}
                </button>
              </div>

              {editing ? (
                <form onSubmit={handleProfileUpdate} className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-medical-text-secondary">Name</label>
                    <input
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-medical-text-secondary">Email</label>
                    <input
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-medical-text-secondary">Phone</label>
                    <input
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 rounded-xl bg-medical-primary text-white font-medium text-sm"
                  >
                    Save Changes
                  </button>
                </form>
              ) : (
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-medical-text-secondary">Patient ID</p>
                    <p className="font-semibold text-medical-text flex items-center gap-2">
                      {profile?.patientId}
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-medical-text-secondary">Fixed</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-medical-text-secondary">Name</p>
                    <p className="font-medium text-medical-text">{profile?.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-medical-text-secondary">Email</p>
                    <p className="font-medium text-medical-text">{profile?.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-medical-text-secondary">Phone</p>
                    <p className="font-medium text-medical-text">{profile?.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-medical-text-secondary">Date of Birth</p>
                    <p className="font-medium text-medical-text">
                      {profile?.dob ? new Date(profile.dob).toLocaleDateString() : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-medical-text-secondary">Sex</p>
                    <p className="font-medium text-medical-text capitalize">{profile?.sex}</p>
                  </div>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push("/patient/book-appointment")}
                className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-medical-primary to-medical-primary-light text-white font-semibold btn-glow"
              >
                Book Appointment
              </motion.button>
            </GlassCard>
          </div>

          {/* Appointments */}
          <div className="lg:col-span-2">
            <GlassCard>
              <h2 className="text-lg font-bold text-medical-text mb-4">My Appointments</h2>
              {appointments.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-medical-text-secondary">No appointments yet</p>
                  <button
                    onClick={() => router.push("/patient/book-appointment")}
                    className="mt-3 text-sm text-medical-primary hover:underline"
                  >
                    Book your first appointment
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {appointments.map((apt, i) => (
                    <motion.div
                      key={apt._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/40 border border-gray-100"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm text-medical-text">{apt.appointmentId}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(apt.status)}`}>
                            {apt.status.replace("_", " ")}
                          </span>
                        </div>
                        <p className="text-sm text-medical-text-secondary line-clamp-1">{apt.problemDescription}</p>
                        <div className="flex gap-4 mt-1 text-xs text-medical-text-secondary">
                          {apt.tokenNumber && <span>Token: {apt.tokenNumber}</span>}
                          {apt.doctorId && <span>Dr. {apt.doctorId.name}</span>}
                          {apt.assignedTimeSlot && <span>{apt.assignedTimeSlot}</span>}
                        </div>
                      </div>
                      <p className="text-xs text-medical-text-secondary whitespace-nowrap ml-4">
                        {new Date(apt.createdAt).toLocaleDateString()}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </div>

      <SuccessModal isOpen={showSuccess} onClose={() => setShowSuccess(false)} message={successMsg} />
    </AnimatedBackground>
  );
}
