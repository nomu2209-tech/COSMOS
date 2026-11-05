"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useData } from "@/context/DataContext";
import { LiquidGlassButton } from "./ui/LiquidGlassButton";
import { Badge } from "./ui/Badge";
import { Tag, Copy, Check, Clock, Sparkles } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

export default function OffersSection() {
  const { offers, isLoading } = useData();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (!isLoading && offers.length === 0) {
    return null;
  }

  return (
    <section id="offers" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-zinc-800 bg-[#121212]">
      {/* Section Header */}
      <ScrollReveal>
        <div className="max-w-3xl mb-16 space-y-3">
          <Badge variant="accent" size="sm" className="font-['Space_Grotesk',sans-serif] font-bold tracking-wider uppercase">
            <Tag className="w-3.5 h-3.5 mr-1" />
            Seasonal Deals
          </Badge>

          <h2 className="font-['Space_Grotesk',sans-serif] text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white leading-tight">
            ACTIVE PROMOTIONS <br />
            <span className="text-zinc-400">&amp; SPECIAL OFFERS</span>
          </h2>

          <p className="text-sm sm:text-base text-zinc-300 font-normal leading-relaxed">
            Verified promotional campaigns from our Instagram and front desk. Claim online during booking or show code on arrival.
          </p>
        </div>
      </ScrollReveal>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((n) => (
            <div key={n} className="h-64 rounded-xl animate-pulse bg-zinc-900/50 border border-zinc-800" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offers.map((offer, index) => (
            <ScrollReveal key={offer.id} delayMs={index * 50}>
              <div className="p-6 rounded-xl border border-zinc-800 bg-[#18181b]/95 hover:border-zinc-700 flex flex-col justify-between h-full transition-all">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="accent" size="sm" className="font-['Space_Grotesk',sans-serif] font-bold uppercase text-[10px]">
                      {offer.discountType === "PERCENTAGE"
                        ? `${offer.discountValue}% OFF PROMO`
                        : `FLAT ₹${offer.discountValue} OFF`}
                    </Badge>

                    <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Valid until {offer.endDate}</span>
                    </div>
                  </div>

                  <h3 className="font-['Space_Grotesk',sans-serif] text-xl font-bold text-white tracking-wide">
                    {offer.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    {offer.description}
                  </p>

                  {offer.terms && (
                    <p className="text-[11px] text-zinc-400 p-3 rounded-lg bg-[#121212] border border-zinc-800">
                      Terms: {offer.terms}
                    </p>
                  )}
                </div>

                <div className="pt-6 mt-4 border-t border-zinc-800/80 space-y-3">
                  {/* Promo Code Copy Bar */}
                  <div className="flex items-center justify-between bg-[#121212] border border-zinc-800 rounded-lg px-3.5 py-2">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-orange-400" />
                      <span className="font-mono text-xs font-bold text-white tracking-wider">
                        {offer.code}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopyCode(offer.code)}
                      className="text-xs text-zinc-300 hover:text-white flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#18181b] hover:bg-zinc-750 border border-zinc-700/80 transition-colors"
                    >
                      {copiedCode === offer.code ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-medium">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>

                  <Link href={`/book?offer=${offer.code}`}>
                    <LiquidGlassButton variant="accent" fullWidth size="sm">
                      Apply Promo in Booking
                    </LiquidGlassButton>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      )}
    </section>
  );
}
