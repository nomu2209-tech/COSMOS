import React from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Shield, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Cosmos Gaming Centre Mumbai",
  description: "Privacy Policy for Cosmos Gaming Centre, Bandra East, Mumbai. Understand how we collect, handle, and protect your booking and customer information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      {/* Back Link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      {/* Header */}
      <div className="space-y-3 border-b border-zinc-800 pb-8">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-zinc-800 border border-zinc-700 text-xs font-medium text-zinc-300">
          <Shield className="w-3.5 h-3.5" />
          <span>LEGAL & DATA PROTECTION</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black uppercase text-white font-['Rajdhani',sans-serif] tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm text-zinc-400">
          Last Updated: November 2026 | Cosmos Gaming Centre, Bandra East, Mumbai - 400051
        </p>
      </div>

      {/* Body Content */}
      <GlassCard className="space-y-8 p-6 sm:p-8 text-sm text-zinc-300 leading-relaxed border-zinc-800">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white font-['Rajdhani',sans-serif] uppercase tracking-wide">
            1. Overview
          </h2>
          <p>
            Cosmos Gaming Centre (&quot;Cosmos Gaming&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the gaming lounge located at Office No. 23, New Shopping Centre, Government Colony, Bandra East, Mumbai, Maharashtra 400051 and the online reservation platform at cosmosgamingmumbai.com.
          </p>
          <p>
            We are dedicated to safeguarding your personal data and ensuring transparent data practices in compliance with applicable Indian information technology and digital personal data protection laws.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white font-['Rajdhani',sans-serif] uppercase tracking-wide">
            2. Information We Collect
          </h2>
          <p>We only collect information necessary to manage station bookings, verify identities, and facilitate smooth cafe operations:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
            <li><strong className="text-zinc-200">Contact Details:</strong> Full name, mobile phone number, and email address provided during slot booking or account registration.</li>
            <li><strong className="text-zinc-200">Booking Details:</strong> Selected gaming zone (VR Arena, PS5, PC Esports, Racing Simulator), chosen date, timeslot, station preference, and party size.</li>
            <li><strong className="text-zinc-200">Transaction Records:</strong> Booking reference IDs, payment method selected (UPI, Cash at Desk, Card), and payment confirmation status. We do not store credit card or bank credentials on our servers.</li>
            <li><strong className="text-zinc-200">Device & Usage Information:</strong> Standard server logs, IP address, browser type, and anonymous analytics to maintain server stability and prevent malicious traffic.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white font-['Rajdhani',sans-serif] uppercase tracking-wide">
            3. How We Use Your Information
          </h2>
          <p>Your information is used strictly for legitimate business and operational purposes:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
            <li>Reserving your hardware station and verifying your booking at our Bandra East front reception desk.</li>
            <li>Sending booking confirmations, reference numbers, or schedule change notifications via SMS or WhatsApp.</li>
            <li>Operating customer account logins and authentication via one-time verification passwords (OTP).</li>
            <li>Managing tournament registrations, bracket seeds, and legitimate prize disbursements.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white font-['Rajdhani',sans-serif] uppercase tracking-wide">
            4. Information Sharing and Disclosure
          </h2>
          <p>
            Cosmos Gaming does not sell, rent, monetize, or trade your personal data to any third-party advertisers or data brokers.
          </p>
          <p>
            Data is only shared when necessary with verified infrastructure providers (such as transactional SMS/email services and secure hosting providers) solely for delivering our services, or when required by legal law enforcement authorities under applicable Indian law.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white font-['Rajdhani',sans-serif] uppercase tracking-wide">
            5. Cookies and Local Storage
          </h2>
          <p>
            We use minimal browser local storage and essential cookies strictly to maintain your session login state and store your cookie preference consent. You can disable cookies at any time via your browser settings, though doing so may prevent you from logging in to your dashboard.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white font-['Rajdhani',sans-serif] uppercase tracking-wide">
            6. Data Security
          </h2>
          <p>
            We enforce industry-standard security protocols, encrypted HTTPS transport, salted cryptographic password hashing, and role-based administrative access controls to protect your stored records from unauthorized access, alteration, or disclosure.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white font-['Rajdhani',sans-serif] uppercase tracking-wide">
            7. Contact and Grievances
          </h2>
          <p>
            If you have questions regarding this Privacy Policy or wish to request the deletion or correction of your booking profile, please contact our management:
          </p>
          <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 text-xs space-y-1 text-zinc-300">
            <p className="font-bold text-white">Cosmos Gaming Centre</p>
            <p>Office No. 23, New Shopping Centre, Government Colony, Bandra East, Mumbai - 400051</p>
            <p>Phone / WhatsApp: +91 97694 64603</p>
            <p>Email: contact@cosmosgamingmumbai.com</p>
          </div>
        </section>
      </GlassCard>
    </div>
  );
}

