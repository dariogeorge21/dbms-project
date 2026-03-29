"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import GlassCard from "@/components/GlassCard";
import LoadingSpinner from "@/components/LoadingSpinner";

interface AppointmentItem {
  _id: string;
  appointmentId: string;
  patientName: string;
  status: string;
  tokenNumber?: string;
  assignedTimeSlot?: string;
  appointmentDate?: string;
  preferredTimeSlot: string;
  problemDescription: string;
  createdAt: string;
  doctorId?: { name: string; doctorId: string; specialization: string };
  patientId?: { patientId: string };
}

export default function AdminAppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const meRes = await fetch("/api/auth/me");
      if (!meRes.ok) { router.push("/admin/login"); return; }
      const meData = await meRes.json();
      if (meData.user.role !== "admin") { router.push("/admin/login"); return; }

      const url = `/api/appointments${statusFilter ? `?status=${statusFilter}` : ""}`;
      const res = await fetch(url);
      if (res.ok) setAppointments((await res.json()).appointments);
    } catch { router.push("/admin/login"); }
    finally { setLoading(false); }
  }, [router, statusFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

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

  if (loading) return <AnimatedBackground videoSrc="https://www.pexels.com/download/video/36718656/"><LoadingSpinner /></AnimatedBackground>;

  const inputClass = "px-3 py-2 rounded-lg bg-white/50 border border-gray-200 text-medical-text text-sm focus:border-medical-primary outline-none";

  return (
    <AnimatedBackground videoSrc="https://www.pexels.com/download/video/36718656/">
      <Navbar role="admin" userName="Administrator" />
      <div className="px-4 md:px-8 pb-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-medical-text">All Appointments</h1>
            <p className="text-medical-text-secondary mt-1">{appointments.length} total appointments</p>
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={inputClass}>
            <option value="">All Statuses</option>
            <option value="requested">Requested</option>
            <option value="assigned">Assigned</option>
            <option value="in_consultation">In Consultation</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="super-glass p-8 relative overflow-hidden group">
  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/50 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
  <div className="relative z-10">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Apt ID", "Patient", "Patient ID", "Doctor", "Token", "Status", "Time Slot", "Date", "Created"].map((h) => (
                    <th key={h} className="text-left py-3 px-2 text-xs font-semibold text-medical-text-secondary uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt, i) => (
                  <motion.tr key={apt._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="border-b border-gray-50 hover:bg-white/30 transition-colors">
                    <td className="py-3 px-2 text-sm font-medium text-medical-primary">{apt.appointmentId}</td>
                    <td className="py-3 px-2 text-sm font-medium text-medical-text">{apt.patientName}</td>
                    <td className="py-3 px-2 text-xs text-medical-text-secondary">{apt.patientId?.patientId || "-"}</td>
                    <td className="py-3 px-2 text-sm text-medical-text-secondary">{apt.doctorId ? `${apt.doctorId.name}` : "-"}</td>
                    <td className="py-3 px-2 text-sm font-medium text-medical-text">{apt.tokenNumber || "-"}</td>
                    <td className="py-3 px-2"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(apt.status)}`}>{apt.status.replace("_", " ")}</span></td>
                    <td className="py-3 px-2 text-xs text-medical-text-secondary">{apt.assignedTimeSlot || apt.preferredTimeSlot}</td>
                    <td className="py-3 px-2 text-xs text-medical-text-secondary">{apt.appointmentDate ? new Date(apt.appointmentDate).toLocaleDateString() : "-"}</td>
                    <td className="py-3 px-2 text-xs text-medical-text-secondary">{new Date(apt.createdAt).toLocaleDateString()}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {appointments.length === 0 && <p className="text-center py-8 text-medical-text-secondary">No appointments found</p>}
          </div>
          </div>
</div>
      </div>
    </AnimatedBackground>
  );
}
