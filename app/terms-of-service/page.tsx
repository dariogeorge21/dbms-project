"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function TermsOfServicePage() {
  return (
    <AnimatedBackground>
      <div className="min-h-screen pt-20 pb-12 px-4 max-w-4xl mx-auto relative z-10 flex flex-col">
        {/* Header simple navigation */}
        <div className="mb-10 block">
          <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 btn-super-glass rounded-xl text-sm font-semibold transition-all">
            &larr; Back to Home
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="super-glass p-8 md:p-14"
        >
          <h1 className="text-4xl font-extrabold text-gradient-glossy mb-4 drop-shadow-sm">Terms of Service</h1>
          <p className="text-medical-text-secondary/80 mb-10 font-medium">Effective Date: March 29, 2026</p>
          
          <div className="space-y-8 text-medical-text-secondary/90 leading-relaxed text-sm md:text-base">
            <section>
              <h2 className="text-xl font-bold text-medical-text mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using the AIIMS Delhi Appointment Portal, you accept and agree to be bound by the terms and provisions of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-medical-text mb-3">2. Description of Service</h2>
              <p>
                The Portal provides users with access to an online system for booking and managing medical appointments with AIIMS Delhi professionals. The service is provided &quot;AS IS&quot; and AIIMS Delhi assumes no responsibility for external network failures or user device incompatibilities.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-medical-text mb-3">3. User Conduct and Account Security</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to immediately notify AIIMS Delhi of any unauthorized use of your account or any other breach of security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-medical-text mb-3">4. Appointment Booking Rules</h2>
              <p>
                Users must provide accurate information when booking. Multiple missed appointments without prior cancellation may result in a temporary suspension of booking privileges. Cancellations must be made at least 24 hours prior to the scheduled time.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-medical-text mb-3">5. Modifications to Service</h2>
              <p>
                AIIMS Delhi reserves the right at any time to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </AnimatedBackground>
  );
}