"use client";

import React from "react";
import HalftoneWordmarkFooter from "./ui/halftone-wordmark-footer";

export default function Footer() {
  const footerColumns = [
    {
      title: "Stations",
      links: [
        { label: "PC Esports 240Hz", href: "/#specs" },
        { label: "PlayStation 5 4K", href: "/#specs" },
        { label: "360° VR Tactical Pods", href: "/#specs" },
        { label: "Racing Sim Cockpit", href: "/#specs" },
      ],
    },
    {
      title: "Cafe & Lounge",
      links: [
        { label: "Artisan Coffee Menu", href: "/#cafe" },
        { label: "Nitro Cold Brew", href: "/#cafe" },
        { label: "Cosmos Smash Burger", href: "/#cafe" },
        { label: "Truffle Herb Fries", href: "/#cafe" },
      ],
    },
    {
      title: "Connect & Venue",
      links: [
        { label: "Book Station Slot", href: "/book" },
        { label: "WhatsApp Desk (+91 97694 64603)", href: "https://wa.me/919769464603" },
        { label: "Instagram @cosmosgamingmumbai", href: "https://www.instagram.com/cosmosgamingmumbai/" },
        { label: "Privacy Policy", href: "/privacy" },
      ],
    },
  ];

  return (
    <div className="w-full border-t border-zinc-800 bg-[#121212]">
      <HalftoneWordmarkFooter
        wordmark="cosmos"
        label="COSMOS GAMING CAFE"
        meta="©2026 · Bandra East, Mumbai"
        columns={footerColumns}
        backToTop={true}
        preset="night"
        palette={{
          background: "#121212",
          ink: "#d4d4d8",
          warm: "#ea580c",
        }}
        fontFamily='"Space Grotesk", sans-serif'
        height="520px"
        dotGap={6}
        radius={85}
        crop={0.2}
        grain={0.35}
      />
    </div>
  );
}
