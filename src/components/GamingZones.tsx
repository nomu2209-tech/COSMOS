"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { LiquidGlassButton } from "./ui/LiquidGlassButton";
import { Badge } from "./ui/Badge";
import { Calendar, Cpu, Monitor, Gamepad2, Shield, Wifi, Armchair } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

interface DetailedStation {
  id: string;
  category: string;
  name: string;
  tagline: string;
  image: string;
  rate: number;
  stationsCount: number;
  specs: {
    display: string;
    processing: string;
    peripherals: string;
    connectivity: string;
    seating: string;
  };
  games: string[];
}

const STATIONS_DATA: DetailedStation[] = [
  {
    id: "zone-pc",
    category: "TOURNAMENT BATTLE RIGS",
    name: "High-FPS PC Esports Arena",
    tagline: "Calibrated for esports athletes, high-tier competitive ranked play, and zero input latency.",
    image: "/images/ambient-seating.jpg",
    rate: 120,
    stationsCount: 8,
    specs: {
      display: "24.5\" Fast-IPS 240Hz 0.5ms Esports Panels",
      processing: "Intel Core i9 / RTX 4080-4090 GPUs / 32GB DDR5 6000MHz",
      peripherals: "Custom Hot-Swap Mechanical Keyboards, Ultra-Light 8000Hz Mice",
      connectivity: "Direct Low-Latency Gigabit Fiber LAN (1ms server routing)",
      seating: "Ergonomic Lumbar-Support High-Density Mesh Gaming Chairs",
    },
    games: ["Valorant", "Counter-Strike 2", "GTA 5 RP (FiveM)", "Apex Legends", "Call of Duty"],
  },
  {
    id: "zone-ps5",
    category: "NEXT-GEN CONSOLE LOUNGE",
    name: "PlayStation 5 (PS5) 4K Arena",
    tagline: "Dedicated console stations with 4K 120Hz HDR visual fidelity and haptic feedback co-op.",
    image: "/images/ps5-station.jpg",
    rate: 150,
    stationsCount: 6,
    specs: {
      display: "Sony Bravia & 4K HDR 120Hz Low-Latency Gaming Screens",
      processing: "Sony PlayStation 5 Ultra-High Speed Custom SSD Architecture",
      peripherals: "DualSense Wireless Controllers with Dynamic Haptic Triggers",
      connectivity: "PlayStation Network Dedicated Low-Ping Gigabit Connection",
      seating: "Plush High-Back Leather Lounge Seating with Personal Footrests",
    },
    games: ["EA Sports FC 25", "Tekken 8", "WWE 2K24", "Marvel's Spider-Man 2", "Mortal Kombat 1"],
  },
  {
    id: "zone-vr",
    category: "360° IMMERSION POD",
    name: "VR Tactical Gun Arena",
    tagline: "Cosmos signature room-scale virtual reality arena with specialized physical haptic recoil rifle rigs.",
    image: "/images/vr-arena.jpg",
    rate: 200,
    stationsCount: 2,
    specs: {
      display: "High-Resolution Dual Fast-Switch LCD 360° VR Headset",
      processing: "Dedicated High-Frame VR Workstation Engine",
      peripherals: "Specialized Haptic VR Rifle Peripherals with Trigger Feedback",
      connectivity: "Ceiling-Mounted Room-Scale Cable Management & Tracking Sensors",
      seating: "Open-Movement Padded 360° Safety Ring with Dedicated VR Coach",
    },
    games: ["Zombie Outbreak Survival", "Tactical Military Breach", "Horror VR World", "Beat Saber", "Virtual Cricket"],
  },
  {
    id: "zone-racing",
    category: "MOTORSPORT COCKPIT",
    name: "Force-Feedback Racing Simulator",
    tagline: "True motorsport ergonomics with heavy load-cell brake feel, responsive force feedback, and paddle shifts.",
    image: "/images/racing-rig.jpg",
    rate: 180,
    stationsCount: 2,
    specs: {
      display: "Ultra-Wide Panoramic Curved Racing Display with 165Hz Refresh",
      processing: "Direct-Drive Force-Feedback Steering Wheel Base",
      peripherals: "Dual-Pedal Hydraulic Simulation with Steel Brake Cylinder",
      connectivity: "Telemetry-synced USB Interface for Real-Time Physics Transfer",
      seating: "Adjustable FIA-Style Steel Tubular Bucket Racing Cockpit",
    },
    games: ["F1 24", "Assetto Corsa Competizione", "Forza Horizon 5", "Gran Turismo 7"],
  },
];

export default function GamingZones() {
  return (
    <section id="specs" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-zinc-800 bg-[#121212]">
      {/* 100 Thieves Style Header */}
      <ScrollReveal>
        <div className="max-w-3xl mb-16 space-y-3">
          <Badge variant="accent" size="sm" className="font-['Space_Grotesk',sans-serif] font-bold tracking-wider uppercase">
            <Cpu className="w-3.5 h-3.5 mr-1" />
            Tournament Grade Hardware
          </Badge>

          <h2 className="font-['Space_Grotesk',sans-serif] text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white leading-tight">
            HARDWARE SPECS <br />
            <span className="text-zinc-400">&amp; GAMING STATIONS</span>
          </h2>

          <p className="text-sm sm:text-base text-zinc-300 font-normal leading-relaxed">
            Every station at Cosmos Gaming is engineered with high-tier components:
            zero bloatware, 240Hz esports displays, physical VR gun accessories, and ultra-ergonomic seating.
          </p>
        </div>
      </ScrollReveal>

      {/* Massive Photography & Hardware Cards (100 Thieves Style) */}
      <div className="space-y-12">
        {STATIONS_DATA.map((station, index) => (
          <ScrollReveal key={station.id} delayMs={index * 60}>
            <div className="bg-[#18181b]/95 border border-zinc-800 rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 transition-all hover:border-zinc-700">
              {/* Massive Photography Side */}
              <div className="relative h-72 sm:h-96 lg:h-auto lg:col-span-5 overflow-hidden bg-zinc-900">
                <Image
                  src={station.image}
                  alt={station.name}
                  fill
                  className="object-cover object-center transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#18181b] via-[#18181b]/20 to-transparent lg:hidden" />
                
                {/* Station Count Pill */}
                <div className="absolute top-4 left-4">
                  <Badge variant="neutral" size="sm" className="font-['Space_Grotesk',sans-serif] font-semibold">
                    {station.stationsCount} Stations
                  </Badge>
                </div>

                {/* Rate Pill in Burnt Orange Accent */}
                <div className="absolute top-4 right-4 bg-[#121212]/95 border border-zinc-700/80 px-3 py-1 rounded-md">
                  <span className="text-xs text-zinc-400">From </span>
                  <span className="font-['Space_Grotesk',sans-serif] text-base font-bold text-white">
                    ₹{station.rate}
                  </span>
                  <span className="text-xs text-zinc-400">/hr</span>
                </div>
              </div>

              {/* Technical Specifications Side */}
              <div className="p-6 sm:p-8 lg:col-span-7 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div>
                    <span className="font-['Space_Grotesk',sans-serif] text-xs font-bold uppercase tracking-widest text-[#ea580c] block">
                      {station.category}
                    </span>
                    <h3 className="font-['Space_Grotesk',sans-serif] text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white mt-1">
                      {station.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 mt-1 leading-relaxed">
                      {station.tagline}
                    </p>
                  </div>

                  {/* Clean Technical Specs Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="bg-[#121212]/90 border border-zinc-800/80 p-3 rounded-lg space-y-1">
                      <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] font-semibold uppercase tracking-wider">
                        <Monitor className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Display Setup</span>
                      </div>
                      <p className="text-xs text-white font-medium">{station.specs.display}</p>
                    </div>

                    <div className="bg-[#121212]/90 border border-zinc-800/80 p-3 rounded-lg space-y-1">
                      <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] font-semibold uppercase tracking-wider">
                        <Cpu className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Core Performance</span>
                      </div>
                      <p className="text-xs text-white font-medium">{station.specs.processing}</p>
                    </div>

                    <div className="bg-[#121212]/90 border border-zinc-800/80 p-3 rounded-lg space-y-1">
                      <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] font-semibold uppercase tracking-wider">
                        <Gamepad2 className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Input &amp; Audio</span>
                      </div>
                      <p className="text-xs text-white font-medium">{station.specs.peripherals}</p>
                    </div>

                    <div className="bg-[#121212]/90 border border-zinc-800/80 p-3 rounded-lg space-y-1">
                      <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] font-semibold uppercase tracking-wider">
                        <Armchair className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Ergonomic Seating</span>
                      </div>
                      <p className="text-xs text-white font-medium">{station.specs.seating}</p>
                    </div>
                  </div>

                  {/* Installed Games Pill List */}
                  <div className="pt-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 block mb-1.5">
                      Installed Titles
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {station.games.map((game, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-md bg-[#121212] border border-zinc-800 text-[11px] font-medium text-zinc-300"
                        >
                          {game}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Booking Action */}
                <div className="pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <span className="text-xs text-zinc-400">
                    Individual single-seat or squad reservation available.
                  </span>

                  <Link href={`/book?zone=${station.id}`}>
                    <LiquidGlassButton
                      variant="accent"
                      size="sm"
                      icon={<Calendar className="w-3.5 h-3.5" />}
                    >
                      Reserve {station.name.split(" ")[0]} Slot
                    </LiquidGlassButton>
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
