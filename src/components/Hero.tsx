"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LiquidGlassButton } from "./ui/LiquidGlassButton";
import { Badge } from "./ui/Badge";
import { useData } from "@/context/DataContext";
import {
  Calendar,
  Monitor,
  Gamepad2,
  Headphones,
  Coffee,
  MapPin,
  Clock,
  ArrowDownRight,
  Flame,
} from "lucide-react";

export default function Hero() {
  const { settings } = useData();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const businessName = settings?.businessName || "COSMOS GAMING & LOUNGE";
  const address = settings?.address || "Office No. 23, New Shopping Centre, Government Colony, Bandra East, Mumbai - 400051";

  // Parallax translation: slower movement than foreground text
  const parallaxOffset = scrollY * 0.32;

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-end overflow-hidden border-b border-zinc-800 bg-[#121212] pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Parallax Background Lounge Photo */}
      <div
        className="absolute inset-0 pointer-events-none will-change-transform z-0"
        style={{
          transform: `translate3d(0, ${parallaxOffset}px, 0)`,
        }}
      >
        <Image
          src="/images/hero-lounge.jpg"
          alt="Cosmos Gaming physical esports lounge with ergonomic seating and ambient lighting"
          fill
          priority
          className="object-cover object-center brightness-[0.38] contrast-[1.08] scale-105"
        />
        {/* Cinematic Charcoal Gradient Masks */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/80 to-[#121212]/35" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#121212]/40 to-[#121212]/90" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full space-y-10">
        {/* Top Meta Tags */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Badge variant="accent" size="sm" className="font-['Space_Grotesk',sans-serif] font-bold tracking-wider uppercase">
            <Flame className="w-3.5 h-3.5 mr-1" />
            Bandra East • BKC Corridor
          </Badge>

          <Badge variant="neutral" size="sm" className="flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            <span>Open Daily: 11:00 AM – 11:00 PM</span>
          </Badge>

          <Badge variant="neutral" size="sm" className="hidden sm:inline-flex items-center gap-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-zinc-400" />
            <span>Government Colony, Mumbai</span>
          </Badge>
        </div>

        {/* 100 Thieves Style Massive Typography */}
        <div className="space-y-6 max-w-4xl">
          <h1 className="font-['Space_Grotesk',sans-serif] text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight text-white leading-[1.03]">
            COSMOS GAMING CAFE <br />
            <span className="text-zinc-400">&amp; ESPORTS LOUNGE</span>
          </h1>

          <p className="max-w-2xl text-base sm:text-xl text-zinc-300 font-normal leading-relaxed">
            Mumbai&apos;s premier social gaming sanctuary in Bandra East. Purpose-built tournament 240Hz PC battle stations,
            4K PlayStation 5 arena pods, 360° tactical VR gun zones, and an artisan coffee bar with fresh kitchen bites.
          </p>

          <div className="flex items-center gap-4 text-xs font-medium text-zinc-400">
            <span className="text-white font-semibold">Hourly sessions from ₹120/hr</span>
            <span className="text-zinc-700">|</span>
            <span>Zero latency gigabit LAN</span>
            <span className="text-zinc-700">|</span>
            <span>Espresso bar on-site</span>
          </div>
        </div>

        {/* Action Row - Burnt Orange Accent Button & Neutral Companion */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
          <Link href="/book" className="w-full sm:w-auto">
            <LiquidGlassButton
              variant="accent"
              size="lg"
              fullWidth
              icon={<Calendar className="w-4 h-4" />}
            >
              Book Station Slot
            </LiquidGlassButton>
          </Link>

          <Link href="/#cafe" className="w-full sm:w-auto">
            <LiquidGlassButton
              variant="secondary"
              size="lg"
              fullWidth
              icon={<Coffee className="w-4 h-4 text-orange-400" />}
            >
              Explore Cafe &amp; Food Menu
            </LiquidGlassButton>
          </Link>

          <Link href="/#specs" className="w-full sm:w-auto">
            <LiquidGlassButton
              variant="secondary"
              size="lg"
              fullWidth
              icon={<ArrowDownRight className="w-4 h-4" />}
            >
              Hardware Specs
            </LiquidGlassButton>
          </Link>
        </div>

        {/* Architectural 4-Pillar Grid (OS NYC & 100 Thieves Hybrid) */}
        <div className="pt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 border-t border-zinc-800/80">
          {/* PC Battle Station */}
          <div className="bg-[#18181b]/90 border border-zinc-800 p-4 rounded-lg space-y-1.5 transition-all hover:border-[#ea580c]/50">
            <div className="flex items-center justify-between text-zinc-200">
              <span className="font-['Space_Grotesk',sans-serif] text-xs font-bold uppercase tracking-wider text-white">
                PC Esports Rig
              </span>
              <Monitor className="w-4 h-4 text-zinc-400" />
            </div>
            <p className="text-xs text-zinc-400 leading-snug">
              240Hz Fast-IPS panels, mechanical RGB decks, low-ping gigabit fiber LAN.
            </p>
          </div>

          {/* PS5 Lounge */}
          <div className="bg-[#18181b]/90 border border-zinc-800 p-4 rounded-lg space-y-1.5 transition-all hover:border-[#ea580c]/50">
            <div className="flex items-center justify-between text-zinc-200">
              <span className="font-['Space_Grotesk',sans-serif] text-xs font-bold uppercase tracking-wider text-white">
                PlayStation 5 Pods
              </span>
              <Gamepad2 className="w-4 h-4 text-zinc-400" />
            </div>
            <p className="text-xs text-zinc-400 leading-snug">
              Sony PS5 on 4K 120Hz displays with DualSense haptic multiplayer co-op.
            </p>
          </div>

          {/* 360 VR Tactical */}
          <div className="bg-[#18181b]/90 border border-zinc-800 p-4 rounded-lg space-y-1.5 transition-all hover:border-[#ea580c]/50">
            <div className="flex items-center justify-between text-zinc-200">
              <span className="font-['Space_Grotesk',sans-serif] text-xs font-bold uppercase tracking-wider text-white">
                360° VR Tactical
              </span>
              <Headphones className="w-4 h-4 text-zinc-400" />
            </div>
            <p className="text-xs text-zinc-400 leading-snug">
              Room-scale sensors with haptic recoil VR rifle peripherals and zombie missions.
            </p>
          </div>

          {/* Artisan Cafe & Kitchen */}
          <div className="bg-[#18181b]/90 border border-zinc-800 p-4 rounded-lg space-y-1.5 transition-all hover:border-[#ea580c]/50">
            <div className="flex items-center justify-between text-zinc-200">
              <span className="font-['Space_Grotesk',sans-serif] text-xs font-bold uppercase tracking-wider text-orange-400">
                Cafe &amp; Kitchen
              </span>
              <Coffee className="w-4 h-4 text-orange-400" />
            </div>
            <p className="text-xs text-zinc-400 leading-snug">
              Artisan espresso, vanilla cold brew, smashed brioche burgers, truffle fries.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
