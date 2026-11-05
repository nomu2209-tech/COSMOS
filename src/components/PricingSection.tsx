"use client";

import React from "react";
import Link from "next/link";
import { useData } from "@/context/DataContext";
import { LiquidGlassButton } from "./ui/LiquidGlassButton";
import { Badge } from "./ui/Badge";
import { Check, Calendar, CreditCard, Tag } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

export default function PricingSection() {
  const { pricing, isLoading } = useData();

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-zinc-800 bg-[#121212]">
      {/* 100 Thieves Style Section Header */}
      <ScrollReveal>
        <div className="max-w-3xl mb-16 space-y-3">
          <Badge variant="accent" size="sm" className="font-['Space_Grotesk',sans-serif] font-bold tracking-wider uppercase">
            <CreditCard className="w-3.5 h-3.5 mr-1" />
            Transparent Rates
          </Badge>

          <h2 className="font-['Space_Grotesk',sans-serif] text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white leading-tight">
            SESSION RATES <br />
            <span className="text-zinc-400">&amp; GAMING PASSES</span>
          </h2>

          <p className="text-sm sm:text-base text-zinc-300 font-normal leading-relaxed">
            Straightforward pricing with no hidden registration fees. Flexible single-hour sessions
            or multi-hour marathon passes across all PC, PS5, VR, and simulator stations.
          </p>
        </div>
      </ScrollReveal>

      {/* Pricing Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-80 rounded-xl animate-pulse bg-zinc-900/50 border border-zinc-800" />
          ))}
        </div>
      ) : pricing.length === 0 ? (
        <div className="bg-[#18181b] border border-zinc-800 text-center p-8 max-w-md mx-auto space-y-3 rounded-xl">
          <p className="text-sm text-zinc-300">
            Current pricing is available directly at our Bandra East desk or via WhatsApp.
          </p>
          <a
            href="https://wa.me/919769464603?text=Hi%20Cosmos%20Gaming%2C%20what%20are%20your%20current%20rates%3F"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LiquidGlassButton variant="accent" size="sm">
              Enquire on WhatsApp
            </LiquidGlassButton>
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
          {pricing.map((tier, index) => {
            let features: string[] = [];
            try {
              features = typeof tier.features === "string" ? JSON.parse(tier.features) : tier.features;
            } catch {
              features = ["High-Speed LAN", "Zero Input Lag", "Staff Assistance"];
            }

            return (
              <ScrollReveal key={tier.id} delayMs={index * 50}>
                <div
                  className={`p-6 rounded-xl flex flex-col justify-between border transition-all h-full ${
                    tier.isFeatured
                      ? "border-[#ea580c] bg-[#1a1716] shadow-[0_8px_30px_rgba(234,88,12,0.12)]"
                      : "border-zinc-800 bg-[#18181b]/95 hover:border-zinc-700"
                  }`}
                >
                  <div className="space-y-5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-['Space_Grotesk',sans-serif] text-lg font-bold text-white tracking-wide">
                          {tier.title}
                        </h3>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          {tier.zoneType}
                        </p>
                      </div>

                      {tier.tag && (
                        <Badge
                          variant={tier.isFeatured ? "accent" : "neutral"}
                          size="sm"
                          className="font-['Space_Grotesk',sans-serif] font-bold text-[10px] uppercase"
                        >
                          {tier.tag}
                        </Badge>
                      )}
                    </div>

                    {/* Price Display */}
                    <div className="flex items-baseline gap-2 pt-2 border-t border-zinc-800/80">
                      <span className="font-['Space_Grotesk',sans-serif] text-4xl font-extrabold text-white">
                        ₹{tier.price}
                      </span>
                      {tier.originalPrice && (
                        <span className="text-xs text-zinc-500 line-through">
                          ₹{tier.originalPrice}
                        </span>
                      )}
                      <span className="text-xs text-zinc-400 font-medium">
                        / {tier.durationHours} {tier.durationHours === 1 ? "Hour" : "Hours"}
                      </span>
                    </div>

                    {/* Features List */}
                    <ul className="space-y-2.5 text-xs text-zinc-300 border-t border-zinc-800/80 pt-4">
                      {features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Booking Action in Burnt Orange Accent */}
                  <div className="pt-6 mt-6 border-t border-zinc-800/80">
                    <Link href={`/book?pricing=${tier.id}`}>
                      <LiquidGlassButton
                        variant={tier.isFeatured ? "accent" : "secondary"}
                        size="sm"
                        fullWidth
                        icon={<Calendar className="w-3.5 h-3.5" />}
                      >
                        Book This Slot
                      </LiquidGlassButton>
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      )}

      {/* Group Booking & Social Pass Note */}
      <div className="mt-12 p-5 rounded-xl bg-[#18181b]/70 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-orange-400 shrink-0" />
          <span>Squad LAN passes, corporate tournaments, and birthday venue takeovers available upon enquiry.</span>
        </div>
        <a
          href="https://wa.me/919769464603?text=Hi%20Cosmos%20Gaming%2C%20I%20would%20like%20to%20enquire%20about%20group%20booking%20packages"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-orange-400 font-semibold underline shrink-0 transition-colors"
        >
          Enquire on WhatsApp →
        </a>
      </div>
    </section>
  );
}
