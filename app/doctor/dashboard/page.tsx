"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import GlassCard from "@/components/GlassCard";
import StatCard from "@/components/StatCard";
import LoadingSpinner from "@/components/LoadingSpinner";

interface DoctorProfile {
  _id: string;
  doctorId: string;
  name: string;
  specialization: string;
  department: string;
}

interface AppointmentItem {
  _id: string;
  appointmentId: string;
  patientName: string;
  age: number;
  sex: string;
  problemDescription: string;
  status: string;
  preferredTimeSlot: string;
  assignedTimeSlot?: string;
  tokenNumber?: string;
  appointmentDate?: string;
  createdAt: string;
  patientId?: { name: string; patientId: string; phone: string };
}

export default function DoctorDashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [meRes, aptRes] = await Promise.all([
        fetch("/api/auth/me"),
        fetch("/api/appointments"),
      ]);

      if (!meRes.ok) { router.push("/doctor/login"); return; }
      const meData = await meRes.json();
      if (meData.user.role !== "doctor") { router.push("/doctor/login"); return; }
      setProfile(meData.profile);

      if (aptRes.ok) {
        const aptData = await aptRes.json();
        setAppointments(aptData.appointments);
      }
    } catch {
      router.push("/doctor/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      assigned: "bg-blue-50 text-blue-700",
      in_consultation: "bg-purple-50 text-purple-700",
      completed: "bg-emerald-50 text-emerald-700",
      cancelled: "bg-red-50 text-red-700",
    };
    return colors[status] || "bg-gray-50 text-gray-700";
  };

  if (loading) return <AnimatedBackground><LoadingSpinner text="Loading dashboard..." /></AnimatedBackground>;

  const assigned = appointments.filter((a) => a.status === "assigned").length;
  const completed = appointments.filter((a) => a.status === "completed").length;

  return (
    <AnimatedBackground>
      <Navbar role="doctor" userName={profile?.name} userIdentifier={profile?.doctorId} />

      <div className="px-4 md:px-8 pb-8 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-medical-text">
            Good day, <span className="text-gradient">Dr. {profile?.name?.split(" ").pop()}</span>
          </h1>
          <p className="text-medical-text-secondary mt-1">{profile?.specialization} — {profile?.department}</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Patients" value={appointments.length} icon="👥" color="from-blue-500 to-cyan-400" />
          <StatCard label="Assigned" value={assigned} icon="📋" color="from-amber-500 to-orange-400" delay={0.1} />
          <StatCard label="Completed" value={completed} icon="✅" color="from-emerald-500 to-green-400" delay={0.2} />
          <StatCard label="Today" value={appointments.filter((a) => a.appointmentDate && new Date(a.appointmentDate).toDateString() === new Date().toDateString()).length} icon="📅" color="from-purple-500 to-pink-400" delay={0.3} />
        </div>

        {/* Appointment List */}
        <GlassCard>
          <h2 className="text-lg font-bold text-medical-text mb-4">Assigned Appointments</h2>
          {appointments.length === 0 ? (
            <p className="text-center py-8 text-medical-text-secondary">No appointments assigned yet</p>
          ) : (
            <div className="space-y-3">
              {appointments.map((apt, i) => (
                <motion.div
                  key={apt._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/40 border border-gray-100 hover:bg-white/60 transition-colors cursor-pointer"
                  onClick={() => {
                    if (apt.status === "assigned" || apt.status === "in_consultation") {
                      router.push(`/doctor/consultation/${apt._id}`);
                    }
                  }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-medical-text">{apt.patientName}</span>
                      <span className="text-xs text-medical-text-secondary">({apt.appointmentId})</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(apt.status)}`}>
                        {apt.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-sm text-medical-text-secondary line-clamp-1">{apt.problemDescription}</p>
                    <div className="flex gap-3 mt-1 text-xs text-medical-text-secondary">
                      <span>Age: {apt.age}</span>
                      <span>Sex: {apt.sex}</span>
                      {apt.tokenNumber && <span>Token: {apt.tokenNumber}</span>}
                      {apt.assignedTimeSlot && <span>Slot: {apt.assignedTimeSlot}</span>}
                    </div>
                  </div>
                  {(apt.status === "assigned" || apt.status === "in_consultation") && (
                    <button className="ml-4 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-medium hover:bg-emerald-100 transition-colors">
                      Start Consultation
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </AnimatedBackground>
  );
}
