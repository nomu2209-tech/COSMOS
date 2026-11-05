"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useData } from "@/context/DataContext";
import { Search, X, Gamepad2, Tag, DollarSign, ArrowRight } from "lucide-react";
import { GamingZone, PricingTier, Game, Offer } from "@/types";

interface SiteSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SiteSearchModal({ isOpen, onClose }: SiteSearchModalProps) {
  const { zones, games, pricing, offers } = useData();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          const searchBtn = document.querySelector('[aria-label="Search website"]') as HTMLButtonElement;
          if (searchBtn) searchBtn.click();
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredZones: GamingZone[] = q
    ? zones.filter(
        (z) =>
          z.name.toLowerCase().includes(q) ||
          z.specs.toLowerCase().includes(q) ||
          z.description.toLowerCase().includes(q)
      )
    : [];

  const filteredGames: Game[] = q
    ? games.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.genre.toLowerCase().includes(q) ||
          g.zoneType.toLowerCase().includes(q)
      )
    : [];

  const filteredPricing: PricingTier[] = q
    ? pricing.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.zoneType.toLowerCase().includes(q) ||
          p.features.toLowerCase().includes(q)
      )
    : [];

  const filteredOffers: Offer[] = q
    ? offers.filter(
        (o) =>
          o.title.toLowerCase().includes(q) ||
          o.code.toLowerCase().includes(q) ||
          o.description.toLowerCase().includes(q)
      )
    : [];

  const hasResults =
    filteredZones.length > 0 ||
    filteredGames.length > 0 ||
    filteredPricing.length > 0 ||
    filteredOffers.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Site search"
        className="glass-panel max-w-2xl w-full rounded-lg border border-zinc-800 shadow-2xl overflow-hidden bg-zinc-900"
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-zinc-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-zinc-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search zones, games (FC 25, Valorant), pricing, offers..."
            className="w-full bg-transparent text-white placeholder-zinc-500 text-sm focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-zinc-400 hover:text-white p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs text-zinc-400 hover:text-white px-2 py-1 rounded-md bg-zinc-800 border border-zinc-700"
          >
            Esc
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!q && (
            <div className="text-center py-8 text-zinc-400 space-y-2">
              <Search className="w-8 h-8 mx-auto text-zinc-600" />
              <p className="text-xs">Type a keyword to find gaming zones, games, rates, or promo codes.</p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {["VR Gun", "PS5 Arena", "Valorant", "FC 25", "COSMOSBOGO", "PC Esports"].map((hint) => (
                  <button
                    key={hint}
                    onClick={() => setQuery(hint)}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 text-zinc-300 hover:text-white transition-colors"
                  >
                    {hint}
                  </button>
                ))}
              </div>
            </div>
          )}

          {q && !hasResults && (
            <div className="text-center py-8 text-zinc-400 text-xs">
              No results found for <span className="text-white font-semibold">&quot;{query}&quot;</span>. Try searching for &quot;PS5&quot;, &quot;VR&quot;, or &quot;Pricing&quot;.
            </div>
          )}

          {/* Zones */}
          {filteredZones.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
                Gaming Zones
              </span>
              <div className="grid grid-cols-1 gap-2">
                {filteredZones.map((z: GamingZone) => (
                  <Link
                    key={z.id}
                    href="/#zones"
                    onClick={onClose}
                    className="p-3 rounded-lg bg-zinc-850 hover:bg-zinc-800 border border-zinc-750 hover:border-zinc-600 flex items-center justify-between transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Gamepad2 className="w-4 h-4 text-zinc-400" />
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-zinc-100">
                          {z.name}
                        </h4>
                        <p className="text-[11px] text-zinc-400 line-clamp-1">{z.specs}</p>
                      </div>
                    </div>
                    <span className="text-xs text-white font-semibold shrink-0">
                      ₹{z.hourlyRate}/hr
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Games */}
          {filteredGames.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
                Games Library
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredGames.map((g: Game) => (
                  <Link
                    key={g.id}
                    href="/#zones"
                    onClick={onClose}
                    className="p-2.5 rounded-lg bg-zinc-850 hover:bg-zinc-800 border border-zinc-750 hover:border-zinc-600 flex items-center justify-between transition-colors"
                  >
                    <div>
                      <h5 className="text-xs font-bold text-white">{g.title}</h5>
                      <span className="text-[10px] text-zinc-400">{g.genre} | {g.zoneType}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Pricing */}
          {filteredPricing.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
                Rates &amp; Passes
              </span>
              <div className="grid grid-cols-1 gap-2">
                {filteredPricing.map((p: PricingTier) => (
                  <Link
                    key={p.id}
                    href="/#pricing"
                    onClick={onClose}
                    className="p-2.5 rounded-lg bg-zinc-850 hover:bg-zinc-800 border border-zinc-750 hover:border-zinc-600 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-zinc-400" />
                      <div>
                        <h5 className="text-xs font-bold text-white">{p.title}</h5>
                        <span className="text-[10px] text-zinc-400">{p.zoneType}</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-white">₹{p.price}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Offers */}
          {filteredOffers.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
                Promos &amp; Offers
              </span>
              <div className="grid grid-cols-1 gap-2">
                {filteredOffers.map((o: Offer) => (
                  <Link
                    key={o.id}
                    href="/#offers"
                    onClick={onClose}
                    className="p-2.5 rounded-lg bg-zinc-850 hover:bg-zinc-800 border border-zinc-750 hover:border-zinc-600 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-zinc-400" />
                      <div>
                        <h5 className="text-xs font-bold text-white">{o.title}</h5>
                        <span className="text-[10px] text-zinc-300 font-mono font-bold">
                          Code: {o.code}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] text-zinc-400">Apply in booking</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
