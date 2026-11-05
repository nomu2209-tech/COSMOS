"use client";

import React from "react";
import { useData } from "@/context/DataContext";
import { LiquidGlassButton } from "./ui/LiquidGlassButton";
import { Badge } from "./ui/Badge";
import { MapPin, Phone, Clock, Navigation } from "lucide-react";
import InstagramIcon from "./ui/InstagramIcon";
import ScrollReveal from "./ScrollReveal";

export default function LocationSection() {
  const { settings } = useData();

  const businessName = settings?.businessName || "COSMOS GAMING & LOUNGE";
  const address = settings?.address || "Office No. 23, New Shopping Centre, Government Colony, Bandra East, Mumbai - 400051";
  const phone = settings?.phone || "+91 97694 64603";
  const whatsapp = settings?.whatsapp || "+91 97694 64603";
  const openingHours = `${settings?.openingTime || "11:00 AM"} - ${settings?.closingTime || "11:00 PM"}`;
  const days = settings?.operatingDays || "Monday - Sunday (Open All 7 Days)";
  const mapsUrl = settings?.googleMapsUrl || "https://maps.google.com/?q=Office+No+23+New+Shopping+Centre+Government+Colony+Bandra+East+Mumbai+400051";
  const instagramUrl = settings?.instagram || "https://www.instagram.com/cosmosgamingmumbai/";

  return (
    <section id="location" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-zinc-800 bg-[#121212]">
      {/* Section Header */}
      <ScrollReveal>
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <Badge variant="accent" size="sm" className="font-['Space_Grotesk',sans-serif] font-bold tracking-wider uppercase">
            <MapPin className="w-3.5 h-3.5 mr-1" />
            Bandra East Destination
          </Badge>

          <h2 className="font-['Space_Grotesk',sans-serif] text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white leading-tight">
            LOCATION &amp; <br />
            <span className="text-zinc-400">VENUE CONTACT</span>
          </h2>

          <p className="text-sm sm:text-base text-zinc-300 font-normal leading-relaxed">
            Conveniently situated in Bandra East near the BKC business hub. Air-conditioned lounge,
            artisan coffee bar, zero-lag gigabit fiber, and private gaming pods.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Left Card: Contact & Schedule */}
        <ScrollReveal delayMs={50}>
          <div className="p-6 sm:p-8 rounded-xl border border-zinc-800 bg-[#18181b]/95 space-y-6 flex flex-col justify-between h-full">
            <div className="space-y-6">
              <div>
                <span className="text-xs text-[#ea580c] font-['Space_Grotesk',sans-serif] font-bold tracking-widest uppercase">
                  Flagship Venue
                </span>
                <h3 className="font-['Space_Grotesk',sans-serif] text-2xl font-bold uppercase tracking-tight text-white mt-1">
                  {businessName}
                </h3>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4 p-4 rounded-lg bg-[#121212] border border-zinc-800">
                <div className="w-10 h-10 rounded-lg bg-[#18181b] text-orange-400 flex items-center justify-center shrink-0 border border-zinc-700/80">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="space-y-1 text-xs">
                  <p className="font-bold text-white uppercase tracking-wider text-[11px]">
                    Venue Address:
                  </p>
                  <p className="text-zinc-300 leading-relaxed">{address}</p>
                  <p className="text-[11px] text-zinc-400 font-medium">Bandra East, Mumbai, Maharashtra (Near BKC)</p>
                </div>
              </div>

              {/* Timings */}
              <div className="flex items-start gap-4 p-4 rounded-lg bg-[#121212] border border-zinc-800">
                <div className="w-10 h-10 rounded-lg bg-[#18181b] text-orange-400 flex items-center justify-center shrink-0 border border-zinc-700/80">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="space-y-1 text-xs">
                  <p className="font-bold text-white uppercase tracking-wider text-[11px]">
                    Operating Schedule:
                  </p>
                  <p className="text-zinc-200 font-medium">{openingHours}</p>
                  <p className="text-[11px] text-zinc-400">{days}</p>
                </div>
              </div>

              {/* Direct Lines */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="p-3.5 rounded-lg bg-[#121212] border border-zinc-800 hover:border-zinc-700 flex items-center gap-3 transition-colors text-xs text-zinc-300"
                >
                  <Phone className="w-4 h-4 text-orange-400" />
                  <div>
                    <p className="text-[10px] text-zinc-400 uppercase font-bold">Reception Desk</p>
                    <p className="font-semibold text-white">{phone}</p>
                  </div>
                </a>

                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-lg bg-[#121212] border border-zinc-800 hover:border-zinc-700 flex items-center gap-3 transition-colors text-xs text-zinc-300"
                >
                  <InstagramIcon className="w-4 h-4 text-orange-400" />
                  <div>
                    <p className="text-[10px] text-zinc-400 uppercase font-bold">Instagram</p>
                    <p className="font-semibold text-white">@cosmosgamingmumbai</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Action CTAs in Burnt Orange Accent */}
            <div className="pt-5 border-t border-zinc-800/80 flex flex-col sm:flex-row gap-3">
              <a
                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}?text=Hi%20Cosmos%20Gaming%2C%20I%20want%20to%20enquire%20about%20booking%20a%20slot`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <LiquidGlassButton
                  variant="accent"
                  fullWidth
                  size="sm"
                  icon={<Phone className="w-4 h-4" />}
                >
                  WhatsApp Booking Desk
                </LiquidGlassButton>
              </a>

              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <LiquidGlassButton
                  variant="secondary"
                  fullWidth
                  size="sm"
                  icon={<Navigation className="w-4 h-4 text-zinc-400" />}
                >
                  Get Google Directions
                </LiquidGlassButton>
              </a>
            </div>
          </div>
        </ScrollReveal>

        {/* Right Card: Interactive Map Display */}
        <ScrollReveal delayMs={100}>
          <div className="rounded-xl overflow-hidden border border-zinc-800 relative min-h-[380px] h-full flex flex-col justify-end bg-[#18181b]">
            <div className="absolute inset-0 bg-[#121212]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.9258768!2d72.8483!3d19.0548!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c9d8e2d5f5e1%3A0xa2d4f8c3b1e69045!2sNew%20Shopping%20Centre%2C%20Government%20Colony%2C%20Bandra%20East%2C%20Mumbai%2C%20Maharashtra%20400051!5e0!3m2!1sen!2sin!4v1726306000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)" }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Cosmos Gaming - Office No. 23, New Shopping Centre, Government Colony, Bandra East, Mumbai 400051"
              />
            </div>

            <div className="relative z-10 p-6 bg-gradient-to-t from-[#121212] via-[#121212]/90 to-transparent">
              <div className="p-4 rounded-lg bg-[#18181b]/95 backdrop-blur-md border border-zinc-800 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <p className="font-['Space_Grotesk',sans-serif] text-xs font-bold uppercase tracking-wide text-white">
                    COSMOS GAMING CENTRE
                  </p>
                  <p className="text-[11px] text-zinc-400">Office 23, New Shopping Centre, Govt Colony, Bandra East - 400051</p>
                </div>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0"
                >
                  <LiquidGlassButton variant="accent" size="sm">
                    Open Maps
                  </LiquidGlassButton>
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
