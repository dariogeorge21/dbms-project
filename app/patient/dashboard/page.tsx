"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
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

interface MedicineItem {
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes: string;
}

interface VitalSignsItem {
  bloodPressure: string;
  pulse: number;
  temperature: string;
  spo2: string;
  respiratoryRate: number;
  weight: number;
  height: number;
}

interface ConsultationItem {
  _id: string;
  appointmentId: string | { _id: string; appointmentId?: string };
  doctorId?: { name: string; doctorId?: string; specialization?: string };
  diagnosis: string;
  description: string;
  medicines: MedicineItem[];
  vitalSigns: VitalSignsItem;
  nextReviewDate?: string | null;
  createdAt: string;
}

export default function PatientDashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [consultations, setConsultations] = useState<ConsultationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "" });
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const [meRes, aptRes, consRes] = await Promise.all([
        fetch("/api/auth/me"),
        fetch("/api/appointments"),
        fetch("/api/consultations"),
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

      if (consRes.ok) {
        const consData = await consRes.json();
        setConsultations(consData.consultations || []);
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

  const getConsultationAppointmentId = (consultation: ConsultationItem) => {
    if (typeof consultation.appointmentId === "string") {
      return consultation.appointmentId;
    }
    return consultation.appointmentId?._id;
  };

  const consultationByAppointmentId = consultations.reduce<Record<string, ConsultationItem>>((acc, consultation) => {
    const aptId = getConsultationAppointmentId(consultation);
    if (aptId) {
      acc[aptId] = consultation;
    }
    return acc;
  }, {});

  const completedAppointments = appointments.filter((apt) => apt.status === "completed");
  const reportsReady = completedAppointments.filter((apt) => consultationByAppointmentId[apt._id]).length;
  const pendingReports = completedAppointments.length - reportsReady;

  const formatReviewStatus = (nextReviewDate?: string | null) => {
    if (!nextReviewDate) return "No scheduled follow-up";
    const review = new Date(nextReviewDate);
    const now = new Date();
    if (review < now) return `Review due on ${review.toLocaleDateString()}`;
    return `Next review on ${review.toLocaleDateString()}`;
  };

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
            <div className="super-glass p-8 relative overflow-hidden group">
  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/50 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
  <div className="relative z-10">
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
              </div>
</div>
          </div>

          {/* Appointments */}
          <div className="lg:col-span-2">
            <div className="super-glass p-8 relative overflow-hidden group">
  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/50 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
  <div className="relative z-10">
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
              </div>
</div>
          </div>
        </div>

        {/* Doctor Reports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6"
        >
          <div className="super-glass p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/50 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                <div>
                  <h2 className="text-lg font-bold text-medical-text">Completed Appointment Reports</h2>
                  <p className="text-sm text-medical-text-secondary">Doctor notes, prescription, vitals and next review guidance.</p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold">
                    {reportsReady} Reports Ready
                  </span>
                  {pendingReports > 0 && (
                    <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 font-semibold">
                      {pendingReports} Pending Summary
                    </span>
                  )}
                </div>
              </div>

              {completedAppointments.length === 0 ? (
                <div className="p-5 rounded-xl bg-white/40 border border-gray-100 text-sm text-medical-text-secondary">
                  Your completed consultations will appear here with detailed doctor reports.
                </div>
              ) : (
                <div className="space-y-4">
                  {completedAppointments.map((apt, i) => {
                    const report = consultationByAppointmentId[apt._id];
                    return (
                      <motion.div
                        key={apt._id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="p-5 rounded-2xl bg-white/45 border border-gray-100"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-semibold text-medical-text">{apt.appointmentId}</span>
                            <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                              Completed
                            </span>
                            {apt.doctorId?.name && (
                              <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 font-medium">
                                Dr. {apt.doctorId.name}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-medical-text-secondary">
                            {new Date(report?.createdAt || apt.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <p className="text-sm text-medical-text-secondary mb-3">
                          <span className="font-medium text-medical-text">Reason for visit:</span> {apt.problemDescription}
                        </p>

                        {!report ? (
                          <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                            Consultation is marked completed, but detailed doctor report has not been published yet.
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="rounded-xl p-4 bg-white/70 border border-gray-100">
                                <p className="text-xs text-medical-text-secondary uppercase tracking-wider mb-1">Diagnosis</p>
                                <p className="text-sm font-medium text-medical-text">{report.diagnosis || "Not specified"}</p>
                              </div>
                              <div className="rounded-xl p-4 bg-white/70 border border-gray-100">
                                <p className="text-xs text-medical-text-secondary uppercase tracking-wider mb-1">Follow-Up</p>
                                <p className="text-sm font-medium text-medical-text">{formatReviewStatus(report.nextReviewDate)}</p>
                              </div>
                            </div>

                            {report.description && (
                              <div className="rounded-xl p-4 bg-sky-50/70 border border-sky-100">
                                <p className="text-xs text-sky-700 uppercase tracking-wider mb-1 font-semibold">Doctor Notes</p>
                                <p className="text-sm text-medical-text">{report.description}</p>
                              </div>
                            )}

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              <div className="rounded-xl p-4 bg-white/70 border border-gray-100">
                                <p className="text-xs text-medical-text-secondary uppercase tracking-wider mb-2">Prescribed Medicines</p>
                                {report.medicines?.length ? (
                                  <div className="space-y-2">
                                    {report.medicines.map((med, medIndex) => (
                                      <div key={`${report._id}-${medIndex}`} className="rounded-lg border border-gray-100 bg-white/80 px-3 py-2">
                                        <p className="text-sm font-semibold text-medical-text">{med.medicineName}</p>
                                        <p className="text-xs text-medical-text-secondary">
                                          {med.dosage} | {med.frequency} | {med.duration}
                                        </p>
                                        {med.notes && <p className="text-xs text-medical-text-secondary mt-1">Note: {med.notes}</p>}
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-sm text-medical-text-secondary">No medicines prescribed.</p>
                                )}
                              </div>

                              <div className="rounded-xl p-4 bg-white/70 border border-gray-100">
                                <p className="text-xs text-medical-text-secondary uppercase tracking-wider mb-2">Recorded Vitals</p>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div className="rounded-lg bg-gray-50 px-3 py-2">
                                    <p className="text-medical-text-secondary">Blood Pressure</p>
                                    <p className="font-semibold text-medical-text">{report.vitalSigns?.bloodPressure || "-"}</p>
                                  </div>
                                  <div className="rounded-lg bg-gray-50 px-3 py-2">
                                    <p className="text-medical-text-secondary">Pulse</p>
                                    <p className="font-semibold text-medical-text">{report.vitalSigns?.pulse || "-"}</p>
                                  </div>
                                  <div className="rounded-lg bg-gray-50 px-3 py-2">
                                    <p className="text-medical-text-secondary">Temperature</p>
                                    <p className="font-semibold text-medical-text">{report.vitalSigns?.temperature || "-"}</p>
                                  </div>
                                  <div className="rounded-lg bg-gray-50 px-3 py-2">
                                    <p className="text-medical-text-secondary">SpO2</p>
                                    <p className="font-semibold text-medical-text">{report.vitalSigns?.spo2 || "-"}</p>
                                  </div>
                                  <div className="rounded-lg bg-gray-50 px-3 py-2">
                                    <p className="text-medical-text-secondary">Respiratory Rate</p>
                                    <p className="font-semibold text-medical-text">{report.vitalSigns?.respiratoryRate || "-"}</p>
                                  </div>
                                  <div className="rounded-lg bg-gray-50 px-3 py-2">
                                    <p className="text-medical-text-secondary">Weight / Height</p>
                                    <p className="font-semibold text-medical-text">
                                      {report.vitalSigns?.weight || "-"} kg / {report.vitalSigns?.height || "-"} cm
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <SuccessModal isOpen={showSuccess} onClose={() => setShowSuccess(false)} message={successMsg} />
    </AnimatedBackground>
  );
}
