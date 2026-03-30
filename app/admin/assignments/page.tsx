"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import LoadingSpinner from "@/components/LoadingSpinner";
import { SuccessModal } from "@/components/Modal";

interface AppointmentItem {
  _id: string;
  appointmentId: string;
  patientName: string;
  age: number;
  sex: string;
  problemDescription: string;
  preferredTimeSlot: string;
  status: string;
  patientId?: { name: string; patientId: string };
  preferredDoctorId?: string;
}

interface DoctorItem {
  _id: string;
  name: string;
  doctorId: string;
  specialization: string;
  department: string;
  availabilityHours: { from: string; to: string };
}

export default function AdminAssignmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [doctors, setDoctors] = useState<DoctorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [assigning, setAssigning] = useState<string | null>(null);
  const [assignForm, setAssignForm] = useState({ doctorId: "", assignedTimeSlot: "", appointmentDate: "" });

  const formatTo12Hour = (time24: string) => {
    const [hoursStr, minutesStr] = time24.split(":");
    const hours = Number(hoursStr);
    const minutes = Number(minutesStr);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return time24;
    const period = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12;
    return `${String(hour12).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${period}`;
  };

  const toMinutes = (time24: string) => {
    const [hoursStr, minutesStr] = time24.split(":");
    const hours = Number(hoursStr);
    const minutes = Number(minutesStr);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return -1;
    return hours * 60 + minutes;
  };

  const generateSlots = (
    from: string,
    to: string,
    preferredTimeSlot: string,
    interval = 30
  ) => {
    const start = toMinutes(from);
    const end = toMinutes(to);
    if (start < 0 || end < 0 || end <= start) return [] as string[];

    const slots: string[] = [];
    for (let current = start; current + interval <= end; current += interval) {
      const next = current + interval;
      const isMorningSlot = current < 12 * 60;
      if (preferredTimeSlot === "morning" && !isMorningSlot) continue;
      if (preferredTimeSlot === "afternoon" && isMorningSlot) continue;

      const startH = String(Math.floor(current / 60)).padStart(2, "0");
      const startM = String(current % 60).padStart(2, "0");
      const endH = String(Math.floor(next / 60)).padStart(2, "0");
      const endM = String(next % 60).padStart(2, "0");
      slots.push(`${formatTo12Hour(`${startH}:${startM}`)} - ${formatTo12Hour(`${endH}:${endM}`)}`);
    }
    return slots;
  };

  const getPreferredSlotOptions = (doctor: DoctorItem | undefined, preferredTimeSlot: string) => {
    if (!doctor) return [] as string[];
    return generateSlots(
      doctor.availabilityHours.from,
      doctor.availabilityHours.to,
      preferredTimeSlot
    );
  };

  const fetchData = useCallback(async () => {
    try {
      const meRes = await fetch("/api/auth/me");
      if (!meRes.ok) { router.push("/admin/login"); return; }
      const meData = await meRes.json();
      if (meData.user.role !== "admin") { router.push("/admin/login"); return; }

      const [aptRes, docRes] = await Promise.all([
        fetch("/api/appointments?status=requested"),
        fetch("/api/doctors?active=true"),
      ]);
      if (aptRes.ok) setAppointments((await aptRes.json()).appointments);
      if (docRes.ok) setDoctors((await docRes.json()).doctors);
    } catch { router.push("/admin/login"); }
    finally { setLoading(false); }
  }, [router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAssign = async (aptId: string) => {
    if (!assignForm.doctorId || !assignForm.assignedTimeSlot || !assignForm.appointmentDate) return;
    try {
      const res = await fetch("/api/appointments/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId: aptId, ...assignForm }),
      });
      if (res.ok) {
        const data = await res.json();
        setSuccessMsg(`Assigned! Token: ${data.tokenNumber}`);
        setShowSuccess(true);
        setAssigning(null);
        setAssignForm({ doctorId: "", assignedTimeSlot: "", appointmentDate: "" });
        fetchData();
      }
    } catch { /* handle */ }
  };

  if (loading) return <AnimatedBackground><LoadingSpinner /></AnimatedBackground>;

  const inputClass = "w-full px-3 py-2 rounded-lg bg-white/50 border border-gray-200 text-medical-text text-sm focus:border-medical-primary focus:ring-2 focus:ring-blue-100 transition-all outline-none";
  const today = new Date().toISOString().split("T")[0];

  return (
    <AnimatedBackground>
      <Navbar role="admin" userName="Administrator" />
      <div className="px-4 md:px-8 pb-8 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-3xl font-bold text-medical-text">Patient Assignment</h1>
          <p className="text-medical-text-secondary mt-1">{appointments.length} pending appointments awaiting assignment</p>
        </motion.div>

        {appointments.length === 0 ? (
          <div className="super-glass p-8 relative overflow-hidden group">
  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/50 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
  <div className="relative z-10"><p className="text-center py-12 text-medical-text-secondary">No pending appointments to assign</p>  </div>
</div>
        ) : (
          <div className="space-y-4">
            {appointments.map((apt, i) => {
              const selectedDoctor = doctors.find((d) => d._id === assignForm.doctorId);
              const slotOptions = getPreferredSlotOptions(selectedDoctor, apt.preferredTimeSlot);

              return <motion.div key={apt._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <div className="super-glass p-8 relative overflow-hidden group">
  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/50 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
  <div className="relative z-10">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Patient Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-medical-text">{apt.patientName}</span>
                        <span className="text-xs text-medical-text-secondary">({apt.appointmentId})</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium">Requested</span>
                      </div>
                      <p className="text-sm text-medical-text-secondary mb-1">{apt.problemDescription}</p>
                      <div className="flex gap-4 text-xs text-medical-text-secondary">
                        <span>Age: {apt.age}</span>
                        <span>Sex: {apt.sex}</span>
                        <span>Preferred: {apt.preferredTimeSlot}</span>
                      </div>
                    </div>

                    {/* Assign Controls */}
                    {assigning === apt._id ? (
                      <div className="flex-1 max-w-lg space-y-2 p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                        <select
                          value={assignForm.doctorId}
                          onChange={(e) => setAssignForm({ ...assignForm, doctorId: e.target.value, assignedTimeSlot: "" })}
                          className={inputClass}
                        >
                          <option value="">Select Doctor</option>
                          {doctors.map((d) => (
                            <option key={d._id} value={d._id}>{d.name} — {d.specialization} ({d.availabilityHours.from}-{d.availabilityHours.to})</option>
                          ))}
                        </select>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="date"
                            min={today}
                            value={assignForm.appointmentDate}
                            onChange={(e) => setAssignForm({ ...assignForm, appointmentDate: e.target.value })}
                            className={inputClass}
                          />
                          <select
                            value={assignForm.assignedTimeSlot}
                            onChange={(e) => setAssignForm({ ...assignForm, assignedTimeSlot: e.target.value })}
                            className={inputClass}
                            disabled={!assignForm.doctorId}
                          >
                            <option value="">Select Time Slot</option>
                            {slotOptions.map((slot) => (
                              <option key={slot} value={slot}>{slot}</option>
                            ))}
                          </select>
                        </div>
                        {assignForm.doctorId && slotOptions.length === 0 && (
                          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                            No generated slots available for this doctor in the patient&apos;s preferred {apt.preferredTimeSlot} window.
                          </p>
                        )}
                        <div className="flex gap-2">
                          <button onClick={() => handleAssign(apt._id)} className="px-4 py-1.5 rounded-lg bg-medical-primary text-white text-sm font-medium">Assign</button>
                          <button onClick={() => setAssigning(null)} className="px-4 py-1.5 rounded-lg bg-gray-100 text-medical-text text-sm">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setAssigning(apt._id);
                          setAssignForm({ doctorId: "", assignedTimeSlot: "", appointmentDate: today });
                        }}
                        className="px-4 py-2 rounded-xl bg-medical-primary text-white text-sm font-medium btn-glow whitespace-nowrap"
                      >
                        Assign Doctor
                      </button>
                    )}
                  </div>
                  </div>
</div>
              </motion.div>;
            })}
          </div>
        )}
      </div>
      <SuccessModal isOpen={showSuccess} onClose={() => setShowSuccess(false)} message={successMsg} />
    </AnimatedBackground>
  );
}
