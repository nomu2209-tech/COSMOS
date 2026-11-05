"use client";

import React from "react";

const MARQUEE_ITEMS = [
  "RTX 4090 ESPORTS RIGS",
  "240HZ FAST-IPS MONITORS",
  "GIGABIT LOW-PING FIBER",
  "ARTISAN ESPRESSO & COLD BREW",
  "SONY PS5 4K 120HZ ARENA",
  "360° VR TACTICAL GUN PODS",
  "FORCE-FEEDBACK RACING SIMULATOR",
  "GOURMET BRIOCHE SLIDERS",
  "TRUFFLE PARMESAN FRIES",
  "BANDRA EAST • MUMBAI",
];

export default function FeatureMarquee() {
  return (
    <div
      aria-label="Features banner"
      className="w-full overflow-hidden border-y border-zinc-800 bg-[#151518] py-3.5 select-none"
    >
      <div className="animate-marquee flex items-center gap-8 whitespace-nowrap">
        {/* Render twice for continuous seamless loop */}
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
          <div key={idx} className="flex items-center gap-8">
            <span className="font-['Space_Grotesk',sans-serif] text-xs font-bold uppercase tracking-wider text-zinc-300">
              {item}
            </span>
            <span className="w-1.5 h-1.5 rounded-sm bg-[#ea580c]" aria-hidden="true" />
          </div>
        ))}
      </div>
    </div>
  );
}

