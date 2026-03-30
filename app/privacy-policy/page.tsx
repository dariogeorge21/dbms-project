"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function PrivacyPolicyPage() {
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
          <h1 className="text-4xl font-extrabold text-gradient-glossy mb-4 drop-shadow-sm">Privacy Policy</h1>
          <p className="text-medical-text-secondary/80 mb-10 font-medium">Effective Date: March 29, 2026</p>
          
          <div className="space-y-8 text-medical-text-secondary/90 leading-relaxed text-sm md:text-base">
            <section>
              <h2 className="text-xl font-bold text-medical-text mb-3">1. Information We Collect</h2>
              <p>
                We collect information necessary to provide you with healthcare scheduling and management services. This includes personal identification information (such as your name, contact details, and date of birth) and secure medical history data explicitly provided by you during account creation or appointment booking.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-medical-text mb-3">2. How We Use Your Information</h2>
              <p>
                The information collected is exclusively used to facilitate healthcare services at AIIMS. This includes managing appointments, notifying you about schedules, keeping your treating physicians informed, and improving our portal&apos;s UI/UX. We do parameterize non-identifiable data for system analytics.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-medical-text mb-3">3. Data Security and Privacy</h2>
              <p>
                We employ robust, state-of-the-art quantum encryption and SSL protocols to ensure your data is secure both in transit and at rest. Access to medical records is strictly limited to authorized medical professionals and you. 
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-medical-text mb-3">4. Information Sharing</h2>
              <p>
                AIIMS Delhi does not sell, trade, or rent Users&apos; personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information with our partners and trusted affiliates.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-medical-text mb-3">5. Your Consent</h2>
              <p>
                By using this site, you signify your acceptance of this policy. If you do not agree to this policy, please do not use our portal. Your continued use of the site following the posting of changes to this policy will be deemed your acceptance of those changes.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </AnimatedBackground>
  );
}