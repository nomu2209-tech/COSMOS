"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  GamingZone,
  PricingTier,
  Offer,
  EventTournament,
  Game,
  Review,
  GalleryImage,
  BusinessSettings,
} from "@/types";

interface DataContextType {
  zones: GamingZone[];
  pricing: PricingTier[];
  offers: Offer[];
  events: EventTournament[];
  games: Game[];
  reviews: Review[];
  gallery: GalleryImage[];
  settings: BusinessSettings | null;
  isLoading: boolean;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType>({
  zones: [],
  pricing: [],
  offers: [],
  events: [],
  games: [],
  reviews: [],
  gallery: [],
  settings: null,
  isLoading: true,
  refreshData: async () => {},
});

const DEFAULT_DATA = {
  zones: [
    {
      id: "zone-vr",
      name: "VR Immersive Arena & Gun Setup",
      slug: "vr-immersive",
      description: "Cosmos signature 360-degree virtual reality arena with specialized haptic tactical VR gun controllers for ultra-realistic shooter, horror, and action survival gameplay.",
      specs: "Next-Gen 360° VR Headsets • Specialized Haptic VR Gun Peripherals • Room-Scale Tracking Sensors • Dedicated VR Master Assistance",
      hourlyRate: 200,
      imageUrl: "https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?auto=format&fit=crop&w=1200&q=80",
      totalStations: 2,
      popularGames: "Zombie Survival VR, Tactical VR Shooters, Horror World, Beat Saber, Superhot VR, Virtual Cricket Simulator",
      isActive: true,
      displayOrder: 1,
    },
    {
      id: "zone-ps5",
      name: "PlayStation 5 (PS5) 4K Arena",
      slug: "ps5-arena",
      description: "Experience 4K ultra-smooth console gaming on Sony PlayStation 5 with DualSense haptic feedback, 120Hz high-refresh displays, and competitive multiplayer co-op.",
      specs: "Sony PlayStation 5 Consoles • 4K HDR 120Hz Displays • DualSense Wireless Controllers • Pulse 3D Audio",
      hourlyRate: 150,
      imageUrl: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1200&q=80",
      totalStations: 6,
      popularGames: "EA Sports FC 24/25, Tekken 8, WWE 2K24, Mortal Kombat 1, Marvel's Spider-Man 2, GTA 5",
      isActive: true,
      displayOrder: 2,
    },
    {
      id: "zone-pc",
      name: "High-End PC Esports Battleground",
      slug: "pc-esports",
      description: "Tournament-grade esports gaming rigs engineered for maximum FPS, zero input latency, and low ping on 240Hz monitors with mechanical RGB peripherals.",
      specs: "Dedicated Esports Gaming Rigs • 240Hz High-Refresh Gaming Monitors • Mechanical RGB Keyboards • Ultra-light Gaming Mice • Low-Ping Fiber LAN",
      hourlyRate: 120,
      imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
      totalStations: 8,
      popularGames: "Valorant, Counter-Strike 2, GTA 5 RP (FiveM), Apex Legends, Fortnite, Call of Duty",
      isActive: true,
      displayOrder: 3,
    },
    {
      id: "zone-racing",
      name: "Steering Wheel Racing Simulator",
      slug: "racing-simulator",
      description: "Professional force-feedback steering wheel and pedal rig for realistic motorsport, rally, and drift simulation in an ergonomic racing bucket seat.",
      specs: "Force-Feedback Racing Wheel • Responsive Pedal System • Ergonomic Bucket Racing Cockpit • Ultra-Wide Immersive Display",
      hourlyRate: 180,
      imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80",
      totalStations: 2,
      popularGames: "F1 24, Forza Horizon 5, Assetto Corsa, Gran Turismo 7",
      isActive: true,
      displayOrder: 4,
    },
  ],
  pricing: [
    {
      id: "price-vr-30m",
      title: "VR Tactical Experience (30 Mins)",
      zoneType: "VR Immersion Arena",
      durationHours: 1,
      price: 200,
      originalPrice: 250,
      tag: "Signature VR",
      features: '["360° VR Room-Scale Arena","Haptic Tactical VR Gun Rig","Zombie Survival & Horror Missions","Dedicated VR Coach Assistance"]',
      isFeatured: true,
      isActive: true,
    },
    {
      id: "price-ps5-1hr",
      title: "PS5 Console Session (1 Hour)",
      zoneType: "PlayStation 5 (PS5)",
      durationHours: 1,
      price: 150,
      originalPrice: 180,
      tag: "Console Match",
      features: '["Sony PS5 Console","4K 120Hz Ultra-HD Display","DualSense Haptic Controllers","All Top Sports & Fighting Games"]',
      isFeatured: false,
      isActive: true,
    },
    {
      id: "price-pc-1hr",
      title: "PC Esports Session (1 Hour)",
      zoneType: "High-End PC Esports",
      durationHours: 1,
      price: 120,
      originalPrice: 150,
      tag: "Esports",
      features: '["240Hz High-Refresh Display","Mechanical RGB Keyboard & Mouse","Discord & Steam Pre-Installed","Ultra-Low Ping Fiber LAN"]',
      isFeatured: false,
      isActive: true,
    },
    {
      id: "price-racing-1hr",
      title: "Pro Racing Simulator (1 Hour)",
      zoneType: "Racing Simulator",
      durationHours: 1,
      price: 180,
      originalPrice: 220,
      tag: "Full Immersion",
      features: '["Force-Feedback Steering Wheel","Responsive Pedal Set","Bucket Racing Seat Cockpit","F1 24 & Forza Horizon 5"]',
      isFeatured: false,
      isActive: true,
    },
  ],
  offers: [
    {
      id: "offer-bogo",
      title: "Buy 1 Hour, Get 1 Hour FREE",
      code: "COSMOSBOGO",
      description: "Official Cosmos Gaming social media promo! Buy 1 hour of gaming on any station and get your 2nd hour 100% free.",
      discountType: "PERCENTAGE" as const,
      discountValue: 50,
      applicableZone: null,
      minDurationHours: 2,
      startDate: "2026-01-01",
      endDate: "2027-12-31",
      terms: "Valid across gaming stations. Must mention promo code COSMOSBOGO at reception prior to session start.",
      status: "PUBLISHED" as const,
      bannerUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80",
    },
  ],
  events: [],
  games: [],
  reviews: [],
  gallery: [],
  settings: {
    id: "settings-1",
    businessName: "Cosmos Gaming Centre",
    tagline: "Mumbai's Premier VR, PS5 & PC Gaming Zone",
    address: "Office No. 23, New Shopping Centre, Government Colony, Bandra East",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400051",
    phone: "+91 97694 64603",
    whatsapp: "+91 97694 64603",
    email: "contact@cosmosgamingmumbai.com",
    instagram: "https://www.instagram.com/cosmosgamingmumbai/",
    googleMapsUrl: "https://maps.google.com/?q=Office+No+23+New+Shopping+Centre+Government+Colony+Bandra+East+Mumbai+400051",
    openingTime: "11:00 AM",
    closingTime: "11:00 PM",
    operatingDays: "Monday - Sunday (All 7 Days)",
    isSlotBookingActive: true,
    announcementText: "Welcome to Cosmos Gaming Centre: Experience 360° VR Tactical Gun Arena & PS5 DualSense 4K Gaming in Bandra East",
    announcementActive: true,
  },
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState(DEFAULT_DATA);
  const [isLoading, setIsLoading] = useState(false);

  const refreshData = async () => {
    try {
      const res = await fetch("/api/public/data");
      const json = await res.json();
      setData({
        zones: json.zones || [],
        pricing: json.pricing || [],
        offers: json.offers || [],
        events: json.events || [],
        games: json.games || [],
        reviews: json.reviews || [],
        gallery: json.gallery || [],
        settings: json.settings || null,
      });
    } catch (error) {
      console.error("Failed to load public data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <DataContext.Provider
      value={{
        ...data,
        isLoading,
        refreshData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
