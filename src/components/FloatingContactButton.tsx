"use client";

import React, { useState } from "react";
import { MessageCircle, Phone, MapPin, X } from "lucide-react";
import InstagramIcon from "./ui/InstagramIcon";
import { useData } from "@/context/DataContext";

export default function FloatingContactButton() {
  const { settings } = useData();
  const [isOpen, setIsOpen] = useState(false);

  const phone = settings?.phone || "+91 97694 64603";
  const whatsapp = settings?.whatsapp || "+91 97694 64603";
  const cleanPhone = whatsapp.replace(/[^0-9]/g, "");
  const mapsUrl = settings?.googleMapsUrl || "https://maps.google.com/?q=Office+No+23+New+Shopping+Centre+Government+Colony+Bandra+East+Mumbai+400051";
  const instagramUrl = settings?.instagram || "https://www.instagram.com/cosmosgamingmumbai/";

  return (
    <div id="floating-contact" className="fixed bottom-6 left-6 z-40">
      {/* Quick Action Menu */}
      {isOpen && (
        <div className="mb-2 space-y-1.5 animate-in fade-in duration-150">
          {/* WhatsApp */}
          <a
            href={`https://wa.me/${cleanPhone}?text=Hi%20Cosmos%20Gaming%2C%20I%20want%20to%20enquire%20about%20booking%20slots`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-700 text-xs font-medium transition-colors shadow-md"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Chat on WhatsApp</span>
          </a>

          {/* Direct Phone Call */}
          <a
            href={`tel:${phone.replace(/\s+/g, "")}`}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-700 text-xs font-medium transition-colors shadow-md"
          >
            <Phone className="w-4 h-4 text-zinc-300" />
            <span>Call Desk ({phone})</span>
          </a>

          {/* Google Maps Directions */}
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-700 text-xs font-medium transition-colors shadow-md"
          >
            <MapPin className="w-4 h-4 text-zinc-300" />
            <span>Directions (Bandra East)</span>
          </a>

          {/* Instagram */}
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-700 text-xs font-medium transition-colors shadow-md"
          >
            <InstagramIcon className="w-4 h-4 text-zinc-300" />
            <span>Instagram @cosmosgamingmumbai</span>
          </a>
        </div>
      )}

      {/* Main Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Contact quick options"
        className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs tracking-wider uppercase border border-zinc-700 shadow-md transition-all active:scale-95"
      >
        {isOpen ? (
          <>
            <X className="w-4 h-4 text-zinc-400" />
            <span>Close</span>
          </>
        ) : (
          <>
            <MessageCircle className="w-4 h-4 text-zinc-300" />
            <span>Quick Contact</span>
          </>
        )}
      </button>
    </div>
  );
}
