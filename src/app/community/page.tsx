"use client";

import React from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { LiquidGlassButton } from "@/components/ui/LiquidGlassButton";
import { Badge } from "@/components/ui/Badge";
import EventsSection from "@/components/EventsSection";
import OffersSection from "@/components/OffersSection";
import {
  Shield,
  Calendar,
  Users,
  Gamepad2,
  Phone,
} from "lucide-react";

export default function CommunityPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 relative">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="neutral" size="md">
          BANDRA EAST GAMING HUB
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white font-['Rajdhani',sans-serif]">
          Community & Group Sessions
        </h1>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Cosmos Gaming Centre brings together casual console players, esports squads, and VR enthusiasts in Bandra East, Mumbai.
        </p>
      </div>

      {/* Group Gaming & Private Lounge Bookings */}
      <GlassCard className="border-zinc-800 bg-zinc-900 p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 space-y-4">
            <Badge variant="neutral" size="sm">
              SQUADS &amp; EVENTS
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white font-['Rajdhani',sans-serif]">
              LAN Parties, Birthday Tournaments & Squad Hangouts
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Planning a group gaming session, birthday bash, or private competitive LAN for your squad? Cosmos Gaming offers zone reservations and dedicated station assistance for multiplayer events.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
                <p className="text-base font-bold text-white font-['Rajdhani',sans-serif]">
                  PS5 Co-Op Lounges
                </p>
                <p className="text-[11px] text-zinc-400">4K 120Hz EA FC & Tekken battles</p>
              </div>

              <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
                <p className="text-base font-bold text-white font-['Rajdhani',sans-serif]">
                  Esports PC LAN
                </p>
                <p className="text-[11px] text-zinc-400">Low-ping fiber fiber 5v5 scrims</p>
              </div>

              <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
                <p className="text-base font-bold text-white font-['Rajdhani',sans-serif]">
                  VR Party Arena
                </p>
                <p className="text-[11px] text-zinc-400">360° Tactical VR shooter pods</p>
              </div>
            </div>
          </div>

          <div className="text-center lg:text-right space-y-3">
            <div className="p-6 rounded-lg bg-zinc-950 border border-zinc-800 inline-block text-center space-y-2">
              <Users className="w-8 h-8 text-zinc-400 mx-auto" />
              <p className="text-xs font-bold text-white uppercase tracking-wider">
                Group Packages
              </p>
              <p className="text-[11px] text-zinc-400">Available 7 days a week</p>
            </div>
            <div>
              <a
                href="https://wa.me/919769464603?text=Hi%20Cosmos%20Gaming%2C%20I%20want%20to%20enquire%20about%20group%20booking"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LiquidGlassButton variant="primary" size="md" icon={<Phone className="w-4 h-4" />}>
                  Enquire via WhatsApp
                </LiquidGlassButton>
              </a>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Active Tournaments Section */}
      <EventsSection />

      {/* Offers & Challenges Section */}
      <OffersSection />

      {/* Fair Play & Community Guidelines */}
      <GlassCard className="border-zinc-800 space-y-6">
        <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
          <Shield className="w-5 h-5 text-zinc-400" />
          <div>
            <h3 className="text-xl font-bold uppercase text-white font-['Rajdhani',sans-serif]">
              Cosmos Arena Rules &amp; Conduct
            </h3>
            <p className="text-xs text-zinc-400">Guidelines for a fair and welcoming gaming atmosphere</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-zinc-300">
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
              1. Respect &amp; Sportsmanship
            </h4>
            <p className="leading-relaxed text-zinc-400">
              Zero tolerance for harassment, verbal abuse, or physical aggression. Compete hard, but treat fellow players and cafe staff with respect.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
              2. Hardware Care
            </h4>
            <p className="leading-relaxed text-zinc-400">
              Our 240Hz monitors, mechanical keyboards, DualSense controllers, and VR gun setups are calibrated for peak precision. Please handle all hardware with care.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
              3. Fair Play
            </h4>
            <p className="leading-relaxed text-zinc-400">
              Unauthorized third-party cheats, macros, or malicious scripts in esports matches will result in an immediate ban from competitive events.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
