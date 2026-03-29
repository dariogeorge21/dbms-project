"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import GlassCard from "@/components/GlassCard";
import StatCard from "@/components/StatCard";
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
  dailyAppointments: { _id: string; count: number }[];
  doctorWorkload: { doctorName: string; doctorId: string; specialization: string; appointmentCount: number; completedCount: number }[];
  patientVisits: { patientName: string; patientId: string; visitCount: number }[];
}

export default function AdminReportsPage() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("weekly");

  const fetchData = useCallback(async () => {
    try {
      const meRes = await fetch("/api/auth/me");
      if (!meRes.ok) { router.push("/admin/login"); return; }
      const meData = await meRes.json();
      if (meData.user.role !== "admin") { router.push("/admin/login"); return; }

      const res = await fetch(`/api/analytics?period=${period}`);
      if (res.ok) setAnalytics(await res.json());
    } catch { router.push("/admin/login"); }
    finally { setLoading(false); }
  }, [router, period]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <AnimatedBackground videoSrc="https://www.pexels.com/download/video/36718656/"><LoadingSpinner /></AnimatedBackground>;

  const ov = analytics?.overview;
  const daily = analytics?.dailyAppointments || [];
  const docLoad = analytics?.doctorWorkload || [];
  const patVisits = analytics?.patientVisits || [];
  const maxDaily = Math.max(...daily.map((d) => d.count), 1);

  return (
    <AnimatedBackground videoSrc="https://www.pexels.com/download/video/36718656/">
      <Navbar role="admin" userName="Administrator" />
      <div className="px-4 md:px-8 pb-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-medical-text">Reports & Analytics</h1>
            <p className="text-medical-text-secondary mt-1">Hospital performance overview</p>
          </div>
          <select value={period} onChange={(e) => setPeriod(e.target.value)} className="px-3 py-2 rounded-lg bg-white/50 border border-gray-200 text-sm text-medical-text outline-none">
            <option value="daily">Last 7 Days</option>
            <option value="weekly">Last 30 Days</option>
          </select>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Patients" value={ov?.totalPatients || 0} icon="👥" color="from-blue-500 to-cyan-400" />
          <StatCard label="Active Doctors" value={ov?.activeDoctors || 0} icon="🩺" color="from-emerald-500 to-green-400" delay={0.1} />
          <StatCard label="Appointments" value={ov?.totalAppointments || 0} icon="📋" color="from-amber-500 to-orange-400" delay={0.2} />
          <StatCard label="Consultations" value={ov?.totalConsultations || 0} icon="💊" color="from-purple-500 to-pink-400" delay={0.3} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Daily Appointments Chart */}
          <div className="super-glass p-8 relative overflow-hidden group">
  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/50 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
  <div className="relative z-10">
            <h2 className="text-lg font-bold text-medical-text mb-4">Appointment Trends</h2>
            {daily.length === 0 ? (
              <p className="text-center py-8 text-medical-text-secondary">No data available</p>
            ) : (
              <div className="space-y-2">
                {daily.map((d, i) => (
                  <motion.div key={d._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3">
                    <span className="text-xs text-medical-text-secondary w-20 shrink-0">{new Date(d._id).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                    <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(d.count / maxDaily) * 100}%` }}
                        transition={{ duration: 0.8, delay: i * 0.05 }}
                        className="h-full bg-gradient-to-r from-medical-primary to-medical-primary-light rounded-full"
                      />
                    </div>
                    <span className="text-sm font-semibold text-medical-text w-8 text-right">{d.count}</span>
                  </motion.div>
                ))}
              </div>
            )}
            </div>
</div>

          {/* Doctor Workload */}
          <div className="super-glass p-8 relative overflow-hidden group">
  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/50 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
  <div className="relative z-10">
            <h2 className="text-lg font-bold text-medical-text mb-4">Doctor Workload</h2>
            {docLoad.length === 0 ? (
              <p className="text-center py-8 text-medical-text-secondary">No data available</p>
            ) : (
              <div className="space-y-3">
                {docLoad.map((doc, i) => (
                  <motion.div key={doc.doctorId} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center justify-between p-3 rounded-xl bg-white/40 border border-gray-100">
                    <div>
                      <p className="font-semibold text-sm text-medical-text">{doc.doctorName}</p>
                      <p className="text-xs text-medical-text-secondary">{doc.specialization} — {doc.doctorId}</p>
                    </div>
                    <div className="flex gap-3 text-center">
                      <div>
                        <p className="text-lg font-bold text-medical-primary">{doc.appointmentCount}</p>
                        <p className="text-xs text-medical-text-secondary">Total</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-medical-success">{doc.completedCount}</p>
                        <p className="text-xs text-medical-text-secondary">Done</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            </div>
</div>
        </div>

        {/* Patient Visits */}
        <div className="super-glass p-8 relative overflow-hidden group">
  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/50 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
  <div className="relative z-10">
          <h2 className="text-lg font-bold text-medical-text mb-4">Top Patients by Visits</h2>
          {patVisits.length === 0 ? (
            <p className="text-center py-8 text-medical-text-secondary">No data available</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-3 text-xs font-semibold text-medical-text-secondary uppercase">#</th>
                    <th className="text-left py-3 px-3 text-xs font-semibold text-medical-text-secondary uppercase">Patient Name</th>
                    <th className="text-left py-3 px-3 text-xs font-semibold text-medical-text-secondary uppercase">Patient ID</th>
                    <th className="text-left py-3 px-3 text-xs font-semibold text-medical-text-secondary uppercase">Visits</th>
                  </tr>
                </thead>
                <tbody>
                  {patVisits.map((p, i) => (
                    <tr key={p.patientId} className="border-b border-gray-50">
                      <td className="py-3 px-3 text-sm text-medical-text-secondary">{i + 1}</td>
                      <td className="py-3 px-3 text-sm font-medium text-medical-text">{p.patientName}</td>
                      <td className="py-3 px-3 text-sm text-medical-primary">{p.patientId}</td>
                      <td className="py-3 px-3 text-sm font-bold text-medical-text">{p.visitCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          </div>
</div>
      </div>
    </AnimatedBackground>
  );
}
