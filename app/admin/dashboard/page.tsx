"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import StatCard from "@/components/StatCard";
import GlassCard from "@/components/GlassCard";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Analytics {
  overview: {
    totalPatients: number;
    activePatients: number;
    totalDoctors: number;
    activeDoctors: number;
    totalAppointments: number;
    totalConsultations: number;
    totalMessages: number;
    newMessages: number;
  };
  appointmentsByStatus: { _id: string; count: number }[];
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const meRes = await fetch("/api/auth/me");
      if (!meRes.ok) { router.push("/admin/login"); return; }
      const meData = await meRes.json();
      if (meData.user.role !== "admin") { router.push("/admin/login"); return; }

      const analyticsRes = await fetch("/api/analytics");
      if (analyticsRes.ok) setAnalytics(await analyticsRes.json());
    } catch { router.push("/admin/login"); }
    finally { setLoading(false); }
  }, [router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <AnimatedBackground><LoadingSpinner text="Loading dashboard..." /></AnimatedBackground>;

  const ov = analytics?.overview;
  const statusData = analytics?.appointmentsByStatus || [];

  return (
    <AnimatedBackground>
      <Navbar role="admin" userName="Administrator" />
      <div className="px-4 md:px-8 pb-8 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-medical-text">Admin Dashboard</h1>
          <p className="text-medical-text-secondary mt-1">AIIMS Delhi — Control Panel</p>
        </motion.div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Patients" value={ov?.totalPatients || 0} icon="👥" color="from-blue-500 to-cyan-400" />
          <StatCard label="Active Doctors" value={ov?.activeDoctors || 0} icon="🩺" color="from-emerald-500 to-green-400" delay={0.1} />
          <StatCard label="Appointments" value={ov?.totalAppointments || 0} icon="📋" color="from-amber-500 to-orange-400" delay={0.2} />
          <StatCard label="New Messages" value={ov?.newMessages || 0} icon="✉️" color="from-purple-500 to-pink-400" delay={0.3} />
        </div>

        {/* Quick Access & Appointment Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Access */}
          <GlassCard>
            <h2 className="text-lg font-bold text-medical-text mb-4">Quick Access</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Manage Doctors", href: "/admin/doctors", icon: "🩺", color: "bg-emerald-50 hover:bg-emerald-100" },
                { label: "Manage Patients", href: "/admin/patients", icon: "👥", color: "bg-blue-50 hover:bg-blue-100" },
                { label: "Assign Appointments", href: "/admin/assignments", icon: "📌", color: "bg-amber-50 hover:bg-amber-100" },
                { label: "View Appointments", href: "/admin/appointments", icon: "📋", color: "bg-purple-50 hover:bg-purple-100" },
                { label: "Reports & Analytics", href: "/admin/reports", icon: "📊", color: "bg-pink-50 hover:bg-pink-100" },
                { label: "Messages", href: "/admin/messages", icon: "✉️", color: "bg-indigo-50 hover:bg-indigo-100" },
              ].map((item) => (
                <motion.button
                  key={item.href}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push(item.href)}
                  className={`p-4 rounded-xl ${item.color} transition-colors text-left`}
                >
                  <span className="text-2xl mb-2 block">{item.icon}</span>
                  <span className="text-sm font-medium text-medical-text">{item.label}</span>
                </motion.button>
              ))}
            </div>
          </GlassCard>

          {/* Appointment Status */}
          <GlassCard>
            <h2 className="text-lg font-bold text-medical-text mb-4">Appointment Overview</h2>
            <div className="space-y-3">
              {["requested", "assigned", "in_consultation", "completed", "cancelled"].map((status) => {
                const item = statusData.find((s) => s._id === status);
                const count = item?.count || 0;
                const total = ov?.totalAppointments || 1;
                const pct = Math.round((count / total) * 100);
                const colors: Record<string, string> = {
                  requested: "bg-amber-400",
                  assigned: "bg-blue-400",
                  in_consultation: "bg-purple-400",
                  completed: "bg-emerald-400",
                  cancelled: "bg-red-400",
                };
                return (
                  <div key={status}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize text-medical-text font-medium">{status.replace("_", " ")}</span>
                      <span className="text-medical-text-secondary">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full rounded-full ${colors[status]}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-blue-50 text-center">
                <p className="text-2xl font-bold text-medical-primary">{ov?.totalConsultations || 0}</p>
                <p className="text-xs text-medical-text-secondary mt-1">Consultations</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 text-center">
                <p className="text-2xl font-bold text-medical-success">{ov?.totalDoctors || 0}</p>
                <p className="text-xs text-medical-text-secondary mt-1">Total Doctors</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </AnimatedBackground>
  );
}
