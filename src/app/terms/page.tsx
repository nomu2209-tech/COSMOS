import React from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { FileText, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms and Conditions | Cosmos Gaming Centre Mumbai",
  description: "Terms and conditions of service, booking policies, and lounge conduct guidelines for Cosmos Gaming Centre, Bandra East, Mumbai.",
};

export default function TermsPage() {
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
          <FileText className="w-3.5 h-3.5" />
          <span>TERMS OF SERVICE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black uppercase text-white font-['Rajdhani',sans-serif] tracking-tight">
          Terms &amp; Conditions
        </h1>
        <p className="text-sm text-zinc-400">
          Effective Date: November 2026 | Cosmos Gaming Centre, Bandra East, Mumbai - 400051
        </p>
      </div>

      {/* Content */}
      <GlassCard className="space-y-8 p-6 sm:p-8 text-sm text-zinc-300 leading-relaxed border-zinc-800">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white font-['Rajdhani',sans-serif] uppercase tracking-wide">
            1. Agreement to Terms
          </h2>
          <p>
            By booking a station, registering an account, or accessing facilities at Cosmos Gaming Centre (&quot;Cosmos Gaming&quot;, &quot;we&quot;, &quot;our&quot;), located at Office No. 23, New Shopping Centre, Government Colony, Bandra East, Mumbai - 400051, you acknowledge and agree to abide by these Terms and Conditions.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white font-['Rajdhani',sans-serif] uppercase tracking-wide">
            2. Slot Bookings and Station Allocation
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
            <li><strong className="text-zinc-200">Reservation Hold:</strong> Online bookings reserve a specific hardware station (VR Arena, PS5, PC Esports, or Racing Simulator) for the selected start time and duration.</li>
            <li><strong className="text-zinc-200">Grace Period:</strong> Reserved stations will be held for up to 15 minutes past your scheduled start time. If you do not arrive within 15 minutes without advance notification, the slot may be released to waiting walk-in customers.</li>
            <li><strong className="text-zinc-200">Time Extensions:</strong> Session extensions are subject to station availability and must be requested prior to your session end time.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white font-['Rajdhani',sans-serif] uppercase tracking-wide">
            3. Pricing, Offers, and Payments
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
            <li>Hourly rates are displayed clearly on our pricing board and online system (VR Arena at ₹200/hr, Racing Simulator at ₹180/hr, PS5 4K Arena at ₹150/hr, PC Esports Battleground at ₹120/hr).</li>
            <li>Promotional codes (such as COSMOSBOGO: Buy 1 Hour, Get 1 Hour Free) must be applied at the time of booking or declared before session commencement. Discounts cannot be retroactively applied after gameplay completion.</li>
            <li>Accepted payment methods include UPI (Google Pay, PhonePe, Paytm), cash at reception desk, and approved cards.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white font-['Rajdhani',sans-serif] uppercase tracking-wide">
            4. Hardware Care and Damage Liability
          </h2>
          <p>
            Cosmos Gaming Centre provides premium equipment, including PlayStation 5 consoles, DualSense controllers, 240Hz esports displays, mechanical keyboards, gaming mice, steering wheels, and high-end VR headsets with haptic gun controllers.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
            <li>Players must treat all cafe hardware, peripherals, cables, and furniture with care.</li>
            <li>Any intentional damage, physical abuse (such as throwing controllers, slamming keyboards, or hitting displays), or reckless handling will result in immediate termination of the session without refund.</li>
            <li>The customer agrees to bear full financial liability for the repair or replacement cost of any hardware damaged due to negligence or deliberate misconduct.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white font-['Rajdhani',sans-serif] uppercase tracking-wide">
            5. Lounge Conduct and Safety Guidelines
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
            <li><strong className="text-zinc-200">Respectful Environment:</strong> Cosmos Gaming maintains a friendly, community-oriented esports environment. Abusive language, harassment, physical aggression, or disorderly conduct will not be tolerated.</li>
            <li><strong className="text-zinc-200">Food and Beverage:</strong> Outside food is strictly prohibited around gaming hardware stations. Closed drink bottles must be kept away from keyboards and consoles.</li>
            <li><strong className="text-zinc-200">Substances:</strong> Smoking, tobacco chewing, vaping, and consumption of alcohol or illicit substances are strictly prohibited inside the premises.</li>
            <li><strong className="text-zinc-200">VR Safety:</strong> VR players must follow the floor boundary lines and instructions provided by the VR station master to prevent collisions and disorientation.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white font-['Rajdhani',sans-serif] uppercase tracking-wide">
            6. Cancellations and Rescheduling
          </h2>
          <p>
            If you need to reschedule or cancel a booking, please inform us at least 2 hours before your scheduled time slot by calling +91 97694 64603 or modifying your slot via your user dashboard. We will gladly accommodate a reschedule without penalty.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white font-['Rajdhani',sans-serif] uppercase tracking-wide">
            7. Contact Information
          </h2>
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

