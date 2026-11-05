"use client";

import React, { useEffect, useState } from "react";
import { Cookie, Check } from "lucide-react";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cosmos-cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem("cosmos-cookie-consent", "all");
    setShowBanner(false);
  };

  const acceptEssential = () => {
    localStorage.setItem("cosmos-cookie-consent", "essential");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div
      id="cookie-banner"
      role="region"
      aria-label="Cookie consent banner"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-in fade-in duration-200"
    >
      <div className="glass-panel p-5 rounded-lg border border-zinc-800 shadow-xl space-y-4 bg-zinc-900/95 backdrop-blur-md">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
            <Cookie className="w-4 h-4 text-zinc-300" />
          </div>
          <div className="space-y-1 flex-1">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              Privacy &amp; Cookies
              <span className="text-[10px] text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">
                Essential
              </span>
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We use essential cookies strictly for slot booking sessions, login authentication, and cafe reservation management.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={acceptAll}
            className="flex-1 py-2 px-3 text-xs font-semibold rounded-lg bg-white hover:bg-zinc-200 text-zinc-950 transition-colors flex items-center justify-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            Accept All
          </button>
          <button
            onClick={acceptEssential}
            className="py-2 px-3 text-xs font-medium rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition-colors"
          >
            Essential Only
          </button>
        </div>
      </div>
    </div>
  );
}
