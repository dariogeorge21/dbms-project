"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function FAQPage() {
  const faqs = [
    {
      q: "How do I book an appointment?",
      a: "You can easily book an appointment by navigating to the Patient Portal. Log in or sign up, select the desired department and doctor, and pick a convenient time slot."
    },
    {
      q: "Do I need to create an account?",
      a: "Yes, you need to register an account using your phone number or email to book and manage your appointments securely."
    },
    {
      q: "Can I reschedule my appointment?",
      a: "Yes, upcoming appointments can be rescheduled up to 24 hours prior to the scheduled time via your Patient Dashboard."
    },
    {
      q: "Is telemedicine available?",
      a: "We offer teleconsultation for specific departments. Please check the availability indicator during the booking process."
    },
    {
      q: "What should I bring to my first offline visit?",
      a: "Please bring a valid photo ID, your digital booking confirmation, and any previous medical records relevant to your consultation."
    }
  ];

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
          className="super-glass p-8 md:p-12"
        >
          <h1 className="text-4xl font-extrabold text-gradient-glossy mb-2 drop-shadow-sm">Frequently Asked Questions</h1>
          <p className="text-medical-text-secondary/80 mb-10 text-lg">Find answers to common questions about using the AIIMS appointment portal.</p>
          
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 + 0.3 }}
                key={i} 
                className="p-6 rounded-2xl bg-white/40 border border-white/60 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),_0_4px_12px_rgba(0,123,255,0.05)] transition-all hover:bg-white/60"
              >
                <h3 className="font-bold text-lg text-medical-text mb-2 tracking-tight">{faq.q}</h3>
                <p className="text-medical-text-secondary/90 leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-medical-primary/10 to-medical-primary-light/10 border border-medical-primary/20 text-center">
            <h4 className="font-bold text-medical-text mb-2">Still need help?</h4>
            <p className="text-sm text-medical-text-secondary mb-4">Our support team is available 24/7 to assist you with any issues.</p>
            <button className="px-6 py-2.5 rounded-xl btn-super-glass text-sm font-bold">Contact Support</button>
          </div>
        </motion.div>
      </div>
    </AnimatedBackground>
  );
}