"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import GlassCard from "@/components/GlassCard";
import LoadingSpinner from "@/components/LoadingSpinner";

interface MessageItem {
  _id: string;
  senderRole: string;
  subject: string;
  message: string;
  messageType: string;
  status: string;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const meRes = await fetch("/api/auth/me");
      if (!meRes.ok) { router.push("/admin/login"); return; }
      const meData = await meRes.json();
      if (meData.user.role !== "admin") { router.push("/admin/login"); return; }

      const params = new URLSearchParams();
      if (roleFilter) params.set("senderRole", roleFilter);
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/messages?${params}`);
      if (res.ok) setMessages((await res.json()).messages);
    } catch { router.push("/admin/login"); }
    finally { setLoading(false); }
  }, [router, roleFilter, statusFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/messages/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    fetchData();
  };

  if (loading) return <AnimatedBackground><LoadingSpinner /></AnimatedBackground>;

  const statusColor: Record<string, string> = {
    new: "bg-blue-50 text-blue-700",
    read: "bg-amber-50 text-amber-700",
    closed: "bg-gray-100 text-gray-600",
  };

  const inputClass = "px-3 py-2 rounded-lg bg-white/50 border border-gray-200 text-sm text-medical-text outline-none";

  return (
    <AnimatedBackground>
      <Navbar role="admin" userName="Administrator" />
      <div className="px-4 md:px-8 pb-8 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-medical-text">Messages Inbox</h1>
            <p className="text-medical-text-secondary mt-1">{messages.length} messages</p>
          </div>
          <div className="flex gap-2">
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className={inputClass}>
              <option value="">All Senders</option>
              <option value="patient">Patients</option>
              <option value="doctor">Doctors</option>
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={inputClass}>
              <option value="">All Statuses</option>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {messages.length === 0 ? (
            <div className="super-glass p-8 relative overflow-hidden group">
  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/50 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
  <div className="relative z-10"><p className="text-center py-8 text-medical-text-secondary">No messages found</p>  </div>
</div>
          ) : (
            messages.map((msg, i) => (
              <motion.div key={msg._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <div className="super-glass p-8 relative overflow-hidden group">
  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/50 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
  <div className="relative z-10">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${msg.senderRole === "patient" ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"}`}>
                        {msg.senderRole}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${msg.messageType === "report" ? "bg-purple-50 text-purple-700" : "bg-gray-100 text-gray-600"}`}>
                        {msg.messageType}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[msg.status]}`}>
                        {msg.status}
                      </span>
                    </div>
                    <span className="text-xs text-medical-text-secondary">{new Date(msg.createdAt).toLocaleString()}</span>
                  </div>
                  <h3 className="font-semibold text-medical-text mb-1">{msg.subject}</h3>
                  <p className="text-sm text-medical-text-secondary mb-3">{msg.message}</p>
                  <div className="flex gap-2">
                    {msg.status === "new" && (
                      <button onClick={() => updateStatus(msg._id, "read")} className="text-xs px-3 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">Mark Read</button>
                    )}
                    {msg.status !== "closed" && (
                      <button onClick={() => updateStatus(msg._id, "closed")} className="text-xs px-3 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">Close</button>
                    )}
                  </div>
                  </div>
</div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </AnimatedBackground>
  );
}
