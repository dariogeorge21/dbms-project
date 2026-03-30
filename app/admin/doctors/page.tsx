"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import GlassCard from "@/components/GlassCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import Modal, { SuccessModal, DeleteConfirmModal } from "@/components/Modal";

interface DoctorItem {
  _id: string;
  doctorId: string;
  name: string;
  email?: string;
  phone: string;
  age: number;
  sex: string;
  specialization: string;
  department: string;
  availabilityHours: { from: string; to: string };
  isActive: boolean;
}

export default function AdminDoctorsPage() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<DoctorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [formError, setFormError] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "", email: "", phone: "", age: "", sex: "male",
    specialization: "", department: "", availabilityFrom: "09:00",
    availabilityTo: "17:00", password: "", isActive: true,
  });

  const fetchDoctors = useCallback(async () => {
    try {
      const meRes = await fetch("/api/auth/me");
      if (!meRes.ok) { router.push("/admin/login"); return; }
      const meData = await meRes.json();
      if (meData.user.role !== "admin") { router.push("/admin/login"); return; }

      const res = await fetch(`/api/doctors?search=${encodeURIComponent(search)}`);
      if (res.ok) setDoctors((await res.json()).doctors);
    } catch { router.push("/admin/login"); }
    finally { setLoading(false); }
  }, [router, search]);

  useEffect(() => { fetchDoctors(); }, [fetchDoctors]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        email: form.email.trim(),
        age: form.age ? Number(form.age) : undefined,
      };
      const res = await fetch("/api/doctors", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg("Doctor created successfully!");
        setShowSuccess(true);
        setShowCreate(false);
        resetForm();
        fetchDoctors();
      } else {
        setFormError(data.error || "Unable to create doctor.");
      }
    } catch {
      setFormError("Unable to create doctor.");
    }
    finally { setSubmitting(false); }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor) return;
    setFormError("");
    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        name: form.name,
        email: form.email.trim(),
        phone: form.phone,
        age: form.age ? Number(form.age) : undefined,
        sex: form.sex,
        specialization: form.specialization,
        department: form.department,
        availabilityFrom: form.availabilityFrom,
        availabilityTo: form.availabilityTo,
        isActive: form.isActive,
      };

      if (form.password.trim()) {
        payload.password = form.password;
      }

      const res = await fetch(`/api/doctors/${selectedDoctor._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg("Doctor updated!");
        setShowSuccess(true);
        setShowEdit(false);
        fetchDoctors();
      } else {
        setFormError(data.error || "Unable to update doctor.");
      }
    } catch {
      setFormError("Unable to update doctor.");
    }
    finally { setSubmitting(false); }
  };

  const handleDeactivate = async () => {
    if (!selectedDoctor) return;
    try {
      await fetch(`/api/doctors/${selectedDoctor._id}`, { method: "DELETE" });
      setSuccessMsg("Doctor deactivated"); setShowSuccess(true); fetchDoctors();
    } catch { /* handle */ }
  };

  const resetForm = () => setForm({ name: "", email: "", phone: "", age: "", sex: "male", specialization: "", department: "", availabilityFrom: "09:00", availabilityTo: "17:00", password: "", isActive: true });

  const openEdit = async (doc: DoctorItem) => {
    setSelectedDoctor(doc);
    setFormError("");
    try {
      const res = await fetch(`/api/doctors/${doc._id}`);
      const data = await res.json();
      const doctorEmail = res.ok ? (data.doctor?.email || "") : "";
      setForm({
        name: doc.name,
        email: doctorEmail,
        phone: doc.phone,
        age: String(doc.age),
        sex: doc.sex,
        specialization: doc.specialization,
        department: doc.department,
        availabilityFrom: doc.availabilityHours.from,
        availabilityTo: doc.availabilityHours.to,
        password: "",
        isActive: doc.isActive,
      });
    } catch {
      setForm({ name: doc.name, email: "", phone: doc.phone, age: String(doc.age), sex: doc.sex, specialization: doc.specialization, department: doc.department, availabilityFrom: doc.availabilityHours.from, availabilityTo: doc.availabilityHours.to, password: "", isActive: doc.isActive });
      setFormError("Could not load doctor credentials. You can still update profile fields.");
    }
    setShowEdit(true);
  };

  if (loading) return <AnimatedBackground><LoadingSpinner /></AnimatedBackground>;

  const inputClass = "w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200 text-medical-text placeholder-gray-400 focus:border-medical-primary focus:ring-2 focus:ring-blue-100 transition-all outline-none text-sm";

  return (
    <AnimatedBackground>
      <Navbar role="admin" userName="Administrator" />
      <div className="px-4 md:px-8 pb-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-medical-text">Doctor Management</h1>
            <p className="text-medical-text-secondary mt-1">{doctors.length} doctors registered</p>
          </div>
          <button onClick={() => { resetForm(); setShowCreate(true); }} className="px-4 py-2 rounded-xl bg-medical-primary text-white font-medium text-sm btn-glow">+ Add Doctor</button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input value={search} onChange={(e) => setSearch(e.target.value)} className={`${inputClass} max-w-md`} placeholder="Search by name, ID, specialization..." />
        </div>

        {/* Doctor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map((doc, i) => (
            <motion.div key={doc._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <GlassCard className="h-full">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-lg">🩺</div>
                    <div>
                      <h3 className="font-bold text-medical-text text-sm">{doc.name}</h3>
                      <p className="text-xs text-medical-text-secondary">{doc.doctorId}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${doc.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                    {doc.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="space-y-1 text-sm mb-4">
                  <p className="text-medical-text-secondary"><span className="font-medium text-medical-text">Specialization:</span> {doc.specialization}</p>
                  <p className="text-medical-text-secondary"><span className="font-medium text-medical-text">Department:</span> {doc.department}</p>
                  <p className="text-medical-text-secondary"><span className="font-medium text-medical-text">Hours:</span> {doc.availabilityHours.from} - {doc.availabilityHours.to}</p>
                  <p className="text-medical-text-secondary"><span className="font-medium text-medical-text">Phone:</span> {doc.phone}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(doc)} className="flex-1 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">Edit</button>
                  <button onClick={() => { setSelectedDoctor(doc); setShowDelete(true); }} className="flex-1 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100 transition-colors">Deactivate</button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Create Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Add New Doctor">
        <form onSubmit={handleCreate} className="space-y-3">
          <p className="text-xs text-medical-text-secondary">These email and password credentials will be shared with the doctor for portal login.</p>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-medium text-medical-text">Name</label><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} /></div>
            <div><label className="text-xs font-medium text-medical-text">Phone</label><input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} /></div>
            <div><label className="text-xs font-medium text-medical-text">Login Email</label><input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} /></div>
            <div><label className="text-xs font-medium text-medical-text">Password</label><input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={inputClass} /></div>
            <div><label className="text-xs font-medium text-medical-text">Age</label><input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className={inputClass} /></div>
            <div><label className="text-xs font-medium text-medical-text">Sex</label><select value={form.sex} onChange={(e) => setForm({ ...form, sex: e.target.value })} className={inputClass}><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></div>
            <div><label className="text-xs font-medium text-medical-text">Specialization</label><input required value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} className={inputClass} /></div>
            <div><label className="text-xs font-medium text-medical-text">Department</label><input required value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className={inputClass} /></div>
            <div><label className="text-xs font-medium text-medical-text">From</label><input required type="time" value={form.availabilityFrom} onChange={(e) => setForm({ ...form, availabilityFrom: e.target.value })} className={inputClass} /></div>
            <div><label className="text-xs font-medium text-medical-text">To</label><input required type="time" value={form.availabilityTo} onChange={(e) => setForm({ ...form, availabilityTo: e.target.value })} className={inputClass} /></div>
          </div>
          {formError && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{formError}</p>}
          <button type="submit" disabled={submitting} className="w-full py-2 rounded-xl bg-medical-primary text-white font-medium text-sm disabled:opacity-50">{submitting ? "Creating..." : "Create Doctor"}</button>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Edit Doctor">
        <form onSubmit={handleEdit} className="space-y-3">
          <p className="text-xs text-medical-text-secondary">Update doctor login email, and set a new password only when reset is needed.</p>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-medium text-medical-text">Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} /></div>
            <div><label className="text-xs font-medium text-medical-text">Phone</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} /></div>
            <div><label className="text-xs font-medium text-medical-text">Login Email</label><input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} /></div>
            <div><label className="text-xs font-medium text-medical-text">Reset Password (Optional)</label><input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={inputClass} placeholder="Leave blank to keep current password" /></div>
            <div><label className="text-xs font-medium text-medical-text">Age</label><input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className={inputClass} /></div>
            <div><label className="text-xs font-medium text-medical-text">Specialization</label><input value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} className={inputClass} /></div>
            <div><label className="text-xs font-medium text-medical-text">Department</label><input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className={inputClass} /></div>
            <div><label className="text-xs font-medium text-medical-text">From</label><input type="time" value={form.availabilityFrom} onChange={(e) => setForm({ ...form, availabilityFrom: e.target.value })} className={inputClass} /></div>
            <div><label className="text-xs font-medium text-medical-text">To</label><input type="time" value={form.availabilityTo} onChange={(e) => setForm({ ...form, availabilityTo: e.target.value })} className={inputClass} /></div>
            <div><label className="text-xs font-medium text-medical-text">Status</label><select value={form.isActive ? "true" : "false"} onChange={(e) => setForm({ ...form, isActive: e.target.value === "true" })} className={inputClass}><option value="true">Active</option><option value="false">Inactive</option></select></div>
          </div>
          {formError && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{formError}</p>}
          <button type="submit" disabled={submitting} className="w-full py-2 rounded-xl bg-medical-primary text-white font-medium text-sm disabled:opacity-50">{submitting ? "Saving..." : "Save Changes"}</button>
        </form>
      </Modal>

      <DeleteConfirmModal isOpen={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDeactivate} message={`Are you sure you want to deactivate Dr. ${selectedDoctor?.name}?`} />
      <SuccessModal isOpen={showSuccess} onClose={() => setShowSuccess(false)} message={successMsg} />
    </AnimatedBackground>
  );
}
