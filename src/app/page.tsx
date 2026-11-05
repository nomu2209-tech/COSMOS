import React from "react";
import Hero from "@/components/Hero";
import FeatureMarquee from "@/components/FeatureMarquee";
import GamingZones from "@/components/GamingZones";
import CafeSection from "@/components/CafeSection";
import PricingSection from "@/components/PricingSection";
import OffersSection from "@/components/OffersSection";
import FaqSection from "@/components/FaqSection";
import LocationSection from "@/components/LocationSection";

export default function HomePage() {
  return (
    <div className="space-y-0 bg-[#121212]">
      <Hero />
      <FeatureMarquee />
      <GamingZones />
      <CafeSection />
      <PricingSection />
      <OffersSection />
      <FaqSection />
      <LocationSection />
    </div>
  );
}
