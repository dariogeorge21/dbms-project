"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import GlassCard from "@/components/GlassCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import Modal, { SuccessModal } from "@/components/Modal";

interface PatientItem {
  _id: string;
  patientId: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  sex: string;
  isActive: boolean;
}

export default function AdminPatientsPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<PatientItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [selected, setSelected] = useState<PatientItem | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "", resetPassword: "", isActive: true });
  const [submitting, setSubmitting] = useState(false);

  const fetchPatients = useCallback(async () => {
    try {
      const meRes = await fetch("/api/auth/me");
      if (!meRes.ok) { router.push("/admin/login"); return; }
      const meData = await meRes.json();
      if (meData.user.role !== "admin") { router.push("/admin/login"); return; }

      const res = await fetch(`/api/patients?search=${encodeURIComponent(search)}`);
      if (res.ok) setPatients((await res.json()).patients);
    } catch { router.push("/admin/login"); }
    finally { setLoading(false); }
  }, [router, search]);

  useEffect(() => { fetchPatients(); }, [fetchPatients]);

  const openEdit = (p: PatientItem) => {
    setSelected(p);
    setEditForm({ name: p.name, email: p.email, phone: p.phone, resetPassword: "", isActive: p.isActive });
    setShowEdit(true);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/patients/${selected._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (res.ok) { setSuccessMsg("Patient updated!"); setShowSuccess(true); setShowEdit(false); fetchPatients(); }
    } catch { /* handle */ }
    finally { setSubmitting(false); }
  };

  if (loading) return <AnimatedBackground videoSrc="https://www.pexels.com/download/video/36718656/"><LoadingSpinner /></AnimatedBackground>;

  const inputClass = "w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200 text-medical-text placeholder-gray-400 focus:border-medical-primary focus:ring-2 focus:ring-blue-100 transition-all outline-none text-sm";

  return (
    <AnimatedBackground videoSrc="https://www.pexels.com/download/video/36718656/">
      <Navbar role="admin" userName="Administrator" />
      <div className="px-4 md:px-8 pb-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-medical-text">Patient Management</h1>
            <p className="text-medical-text-secondary mt-1">{patients.length} patients registered</p>
          </div>
        </div>

        <div className="mb-6">
          <input value={search} onChange={(e) => setSearch(e.target.value)} className={`${inputClass} max-w-md`} placeholder="Search by name, ID, email, phone..." />
        </div>

        <div className="super-glass p-8 relative overflow-hidden group">
  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/50 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
  <div className="relative z-10">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Patient ID", "Name", "Email", "Phone", "DOB", "Sex", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left py-3 px-3 text-xs font-semibold text-medical-text-secondary uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {patients.map((p, i) => (
                  <motion.tr key={p._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-gray-50 hover:bg-white/30 transition-colors">
                    <td className="py-3 px-3 text-sm font-medium text-medical-primary">{p.patientId}</td>
                    <td className="py-3 px-3 text-sm font-medium text-medical-text">{p.name}</td>
                    <td className="py-3 px-3 text-sm text-medical-text-secondary">{p.email}</td>
                    <td className="py-3 px-3 text-sm text-medical-text-secondary">{p.phone}</td>
                    <td className="py-3 px-3 text-sm text-medical-text-secondary">{new Date(p.dob).toLocaleDateString()}</td>
                    <td className="py-3 px-3 text-sm text-medical-text-secondary capitalize">{p.sex}</td>
                    <td className="py-3 px-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{p.isActive ? "Active" : "Inactive"}</span></td>
                    <td className="py-3 px-3"><button onClick={() => openEdit(p)} className="text-xs text-medical-primary hover:underline">Edit</button></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {patients.length === 0 && <p className="text-center py-8 text-medical-text-secondary">No patients found</p>}
          </div>
          </div>
</div>
      </div>

      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title={`Edit Patient — ${selected?.patientId}`}>
        <form onSubmit={handleEdit} className="space-y-3">
          <div className="p-2 rounded-lg bg-gray-50 text-xs text-medical-text-secondary mb-2">Patient ID: <strong>{selected?.patientId}</strong> (cannot be changed)</div>
          <div><label className="text-xs font-medium text-medical-text">Name</label><input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className={inputClass} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-medium text-medical-text">Email</label><input value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className={inputClass} /></div>
            <div><label className="text-xs font-medium text-medical-text">Phone</label><input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className={inputClass} /></div>
          </div>
          <div><label className="text-xs font-medium text-medical-text">Reset Password (leave blank to keep)</label><input type="password" value={editForm.resetPassword} onChange={(e) => setEditForm({ ...editForm, resetPassword: e.target.value })} className={inputClass} placeholder="New password" /></div>
          <div><label className="text-xs font-medium text-medical-text">Status</label><select value={String(editForm.isActive)} onChange={(e) => setEditForm({ ...editForm, isActive: e.target.value === "true" })} className={inputClass}><option value="true">Active</option><option value="false">Inactive</option></select></div>
          <button type="submit" disabled={submitting} className="w-full py-2 rounded-xl bg-medical-primary text-white font-medium text-sm disabled:opacity-50">{submitting ? "Saving..." : "Save Changes"}</button>
        </form>
      </Modal>

      <SuccessModal isOpen={showSuccess} onClose={() => setShowSuccess(false)} message={successMsg} />
    </AnimatedBackground>
  );
}
