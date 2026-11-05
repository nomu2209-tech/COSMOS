import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { DataProvider } from "@/context/DataContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import CookieBanner from "@/components/CookieBanner";
import BackToTop from "@/components/BackToTop";
import FloatingContactButton from "@/components/FloatingContactButton";
import UtmTracker from "@/components/UtmTracker";

export const metadata: Metadata = {
  title: "Cosmos Gaming Centre Mumbai | High-End PS5, PC Esports, VR & Simulators | Bandra East",
  description:
    "Official website and slot booking for Cosmos Gaming Centre in Bandra East, Mumbai. Play on high-end 240Hz PCs, PlayStation 5, VR Gun Setup, and Racing Simulators. Book your slot online.",
  keywords: [
    "Cosmos Gaming Mumbai",
    "Gaming Cafe Bandra East",
    "PS5 Gaming Mumbai",
    "PC Gaming Cafe Mumbai",
    "VR Gaming Lounge Mumbai",
    "Esports Tournaments Mumbai",
    "Cosmos Gaming Centre",
  ],
  openGraph: {
    title: "Cosmos Gaming Centre Mumbai | Premium Gaming Lounge & Esports Centre",
    description:
      "Book high-end PC, PS5, VR, and Racing Simulator slots online at Cosmos Gaming Centre, Bandra East, Mumbai.",
    url: "https://cosmosgamingmumbai.com",
    siteName: "Cosmos Gaming Centre Mumbai",
    locale: "en_IN",
    type: "website",
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EntertainmentBusiness",
    name: "Cosmos Gaming Centre",
    alternateName: "Cosmos Gaming Mumbai",
    description: "Premium gaming lounge and esports centre in Bandra East, Mumbai featuring 360° VR Tactical Gun Pods, PS5, High-End PC, and Racing Simulators.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Office No. 23, New Shopping Centre, Government Colony, Bandra East",
      addressLocality: "Mumbai",
      addressRegion: "Maharashtra",
      postalCode: "400051",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 19.0596,
      longitude: 72.8465,
    },
    url: "https://cosmosgamingmumbai.com",
    telephone: "+919769464603",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "11:00",
        closes: "23:00",
      },
    ],
    sameAs: ["https://www.instagram.com/cosmosgamingmumbai/"],
    priceRange: "₹₹",
  };

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#121212] text-[#f4f4f5] antialiased selection:bg-[#ea580c] selection:text-white min-h-screen flex flex-col font-['Inter',sans-serif]">
        {/* Accessibility Skip to Content Link */}
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>

        {/* Global Scroll Progress Bar */}
        <ScrollProgressBar />

        {/* UTM Parameter Capture */}
        <UtmTracker />

        <AuthProvider>
          <DataProvider>
            <Navbar />
            <main id="main-content" tabIndex={-1} className="flex-1 relative z-10 focus:outline-none">
              {children}
            </main>
            <Footer />

            {/* Global Interactive Widgets */}
            <CookieBanner />
            <BackToTop />
            <FloatingContactButton />
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
