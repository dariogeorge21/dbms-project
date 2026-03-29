"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import GlassCard from "@/components/GlassCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { SuccessModal } from "@/components/Modal";

interface MessageItem {
  _id: string;
  subject: string;
  message: string;
  messageType: string;
  status: string;
  createdAt: string;
}

export default function DoctorMessagesPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<{ name: string; doctorId: string } | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [form, setForm] = useState({ subject: "", message: "", messageType: "message" });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [meRes, msgRes] = await Promise.all([fetch("/api/auth/me"), fetch("/api/messages")]);
      if (!meRes.ok) { router.push("/doctor/login"); return; }
      const meData = await meRes.json();
      if (meData.user.role !== "doctor") { router.push("/doctor/login"); return; }
      setProfile(meData.profile);
      if (msgRes.ok) setMessages((await msgRes.json()).messages);
    } catch { router.push("/doctor/login"); }
    finally { setLoading(false); }
  }, [router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { setShowSuccess(true); setShowForm(false); setForm({ subject: "", message: "", messageType: "message" }); fetchData(); }
    } catch { /* handle */ }
    finally { setSubmitting(false); }
  };

  if (loading) return <AnimatedBackground><LoadingSpinner /></AnimatedBackground>;

  const inputClass = "w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200 text-medical-text placeholder-gray-400 focus:border-medical-primary focus:ring-2 focus:ring-blue-100 transition-all outline-none";

  return (
    <AnimatedBackground>
      <Navbar role="doctor" userName={profile?.name} userIdentifier={profile?.doctorId} />
      <div className="px-4 md:px-8 pb-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-medical-text">Messages</h1>
            <p className="text-medical-text-secondary mt-1">Send reports to administration</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-medium text-sm btn-glow">
            {showForm ? "Cancel" : "+ New Message"}
          </button>
        </div>

        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <GlassCard>
              <form onSubmit={handleSend} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-medical-text mb-1">Subject</label><input type="text" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className={inputClass} /></div>
                  <div><label className="block text-sm font-medium text-medical-text mb-1">Type</label><select value={form.messageType} onChange={(e) => setForm({ ...form, messageType: e.target.value })} className={inputClass}><option value="message">Message</option><option value="report">Report</option></select></div>
                </div>
                <div><label className="block text-sm font-medium text-medical-text mb-1">Message</label><textarea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={inputClass} /></div>
                <button type="submit" disabled={submitting} className="px-6 py-2 rounded-xl bg-emerald-500 text-white font-medium text-sm disabled:opacity-50">{submitting ? "Sending..." : "Send"}</button>
              </form>
            </GlassCard>
          </motion.div>
        )}

        <GlassCard>
          {messages.length === 0 ? (
            <p className="text-center py-8 text-medical-text-secondary">No messages sent yet</p>
          ) : (
            <div className="space-y-3">
              {messages.map((msg, i) => (
                <motion.div key={msg._id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="p-4 rounded-xl bg-white/40 border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-medical-text">{msg.subject}</h3>
                    <span className="text-xs text-medical-text-secondary">{new Date(msg.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-medical-text-secondary">{msg.message}</p>
                </motion.div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
      <SuccessModal isOpen={showSuccess} onClose={() => setShowSuccess(false)} message="Message sent to administration!" />
    </AnimatedBackground>
  );
}
