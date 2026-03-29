import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "AIIMS Delhi — Appointment Booking Portal",
  description:
    "Official appointment booking and management portal for All India Institute of Medical Sciences, New Delhi.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased relative min-h-screen`}>
        {/* Global Floating Medallion Logo */}
        <div className="fixed bottom-6 right-6 z-[100] pointer-events-none opacity-80 mix-blend-multiply">
          <div className="w-16 h-16 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-white/60 rounded-full blur-xl animate-pulse" />
            <img 
              src="https://upload.wikimedia.org/wikipedia/en/8/85/All_India_Institute_of_Medical_Sciences%2C_Delhi.svg" 
              alt="AIIMS Watermark" 
              className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,1)]"
            />
          </div>
        </div>

        {children}
      </body>
    </html>
  );
}
