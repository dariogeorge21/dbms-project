"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface NavbarProps {
  role: "patient" | "doctor" | "admin";
  userName?: string;
  userIdentifier?: string;
}

export default function Navbar({ role, userName, userIdentifier }: NavbarProps) {
  const router = useRouter();

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
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass-card sticky top-0 z-50 mx-4 mt-4 mb-6 px-6 py-3 flex items-center justify-between"
    >
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-medical-primary to-medical-primary-light flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="font-bold text-medical-text text-lg hidden sm:inline">AIIMS Delhi</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks[role]?.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-medical-text-secondary hover:text-medical-primary hover:bg-blue-50 transition-all duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {userName && (
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-semibold text-medical-text">{userName}</span>
            {userIdentifier && (
              <span className="text-xs text-medical-text-secondary">{userIdentifier}</span>
            )}
          </div>
        )}
        <button
          onClick={handleLogout}
          className="px-4 py-1.5 rounded-lg text-sm font-medium text-medical-danger bg-red-50 hover:bg-red-100 transition-all duration-200"
        >
          Logout
        </button>
      </div>
    </motion.nav>
  );
}
