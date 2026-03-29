"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  role: "patient" | "doctor" | "admin";
  userName?: string;
  userIdentifier?: string;
}

export default function Navbar({ role, userName, userIdentifier }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  const navLinks: Record<string, { label: string; href: string }[]> = {
    patient: [
      { label: "Dashboard", href: "/patient/dashboard" },
      { label: "Book Appointment", href: "/patient/book-appointment" },
      { label: "Messages", href: "/patient/messages" },
    ],
    doctor: [
      { label: "Dashboard", href: "/doctor/dashboard" },
      { label: "Messages", href: "/doctor/messages" },
    ],
    admin: [
      { label: "Dashboard", href: "/admin/dashboard" },
      { label: "Doctors", href: "/admin/doctors" },
      { label: "Patients", href: "/admin/patients" },
      { label: "Assignments", href: "/admin/assignments" },
      { label: "Appointments", href: "/admin/appointments" },
      { label: "Reports", href: "/admin/reports" },
      { label: "Messages", href: "/admin/messages" },
    ],
  };

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="super-glass sticky top-4 z-50 mx-4 mt-6 mb-8 px-6 py-3 flex items-center justify-between shadow-[0_15px_35px_rgba(0,123,255,0.08)]"
    >
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#00E5FF] via-[#007BFF] to-[#0056b3] flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.6),_0_8px_16px_rgba(0,123,255,0.3)] transform transition-transform group-hover:scale-105 group-hover:rotate-3">
            <span className="text-white font-extrabold text-lg drop-shadow-md">A</span>
          </div>
          <span className="font-extrabold text-medical-text text-xl hidden sm:inline tracking-tight">AIIMS<span className="text-gradient-glossy ml-1">Delhi</span></span>
        </Link>

        <div className="hidden lg:flex items-center gap-2">
          {navLinks[role]?.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isActive 
                    ? "text-medical-primary" 
                    : "text-medical-text-secondary/80 hover:text-medical-primary"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 bg-gradient-to-br from-medical-primary/10 to-medical-primary-light/5 border border-medical-primary/20 rounded-xl -z-10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]"
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  />
                )}
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-5">
        {userName && (
          <div className="hidden sm:flex items-center gap-3 bg-white/40 px-3 py-1.5 rounded-2xl border border-white/60 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 border border-white flex items-center justify-center shadow-sm">
              <span className="text-medical-primary font-bold text-xs">{userName.charAt(0)}</span>
            </div>
            <div className="flex flex-col items-start pr-2">
              <span className="text-sm font-bold text-medical-text leading-none">{userName}</span>
              {userIdentifier && (
                <span className="text-[10px] font-semibold text-medical-text-secondary/70 mt-0.5">{userIdentifier}</span>
              )}
            </div>
          </div>
        )}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="px-5 py-2.5 rounded-xl text-sm font-bold text-red-600 bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200/50 hover:border-red-300 shadow-[0_4px_10px_rgba(239,68,68,0.1),_inset_0_2px_4px_rgba(255,255,255,0.9)] hover:shadow-[0_6px_15px_rgba(239,68,68,0.2)] transition-all duration-300"
        >
          Sign Out
        </motion.button>
      </div>
    </motion.nav>
  );
}
