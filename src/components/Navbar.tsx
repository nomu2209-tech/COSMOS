"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { LiquidGlassButton } from "./ui/LiquidGlassButton";
import ThemeToggle from "./ThemeToggle";
import SiteSearchModal from "./SiteSearchModal";
import {
  Gamepad2,
  Menu,
  X,
  User as UserIcon,
  Shield,
  Calendar,
  LogOut,
  ChevronDown,
  Search,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { settings, events } = useData();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 25) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Stations", href: "/#specs" },
    { name: "Cafe & Lounge", href: "/#cafe" },
    { name: "Rates", href: "/#pricing" },
    { name: "Offers", href: "/#offers" },
    { name: "Location", href: "/#location" },
    { name: "FAQs", href: "/#faq" },
  ];

  return (
    <>
      {/* Site Search Modal */}
      <SiteSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Top Announcement Bar if active */}
      {settings?.announcementActive && settings?.announcementText && (
        <div className="bg-zinc-900 border-b border-zinc-800 text-xs py-2 px-4 text-center font-medium text-zinc-300 tracking-wide flex items-center justify-center gap-2">
          <span>{settings.announcementText}</span>
          <Link
            href="/#pricing"
            className="underline text-white font-semibold hover:text-zinc-200 ml-1"
          >
            Check Rates &rarr;
          </Link>
        </div>
      )}

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-200 ${
          isScrolled
            ? "bg-[#121212]/95 backdrop-blur-md border-b border-zinc-800 shadow-md py-2.5"
            : "bg-[#121212]/85 backdrop-blur-sm border-b border-zinc-800/80 py-3"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo (Space Grotesk Modern Typography) */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white transition-colors group-hover:border-orange-500">
              <Gamepad2 className="w-5 h-5 text-orange-400" />
            </div>
            <div className="flex flex-col">
              <span className="font-['Space_Grotesk',sans-serif] text-base sm:text-lg font-bold tracking-tight uppercase text-white leading-tight">
                COSMOS GAMING
              </span>
              <span className="text-[10px] tracking-widest text-zinc-400 font-medium uppercase">
                LOUNGE &amp; CAFE • BANDRA EAST
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Clean Rectangular, No Pills) */}
          <nav className="hidden lg:flex items-center gap-1 bg-zinc-900/90 border border-zinc-800 px-2 py-1.5 rounded-lg">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-1 rounded-md text-xs font-medium tracking-wide transition-colors ${
                    isActive
                      ? "text-white bg-zinc-800 border border-zinc-700 font-semibold"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-850"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Items */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Search Trigger Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search website"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 hover:text-white transition-colors"
              title="Search (Ctrl + K)"
            >
              <Search className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden md:inline">Search...</span>
              <kbd className="hidden md:inline text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400 font-mono border border-zinc-700">
                ⌘K
              </kbd>
            </button>

            {/* Dark / Light Mode Toggle */}
            <ThemeToggle />

            {/* User Profile / Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors text-xs text-white"
                >
                  <div className="w-6 h-6 rounded-md bg-zinc-850 border border-zinc-700 flex items-center justify-center text-[11px] font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium max-w-[100px] truncate">{user.name}</span>
                  {user.role === "ADMIN" && (
                    <span className="bg-amber-950/60 text-amber-300 text-[10px] px-1.5 py-0.5 rounded border border-amber-800/60 font-bold">
                      ADMIN
                    </span>
                  )}
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 glass-panel rounded-lg p-2 shadow-xl border border-zinc-800 z-50">
                    <div className="px-3 py-2 border-b border-zinc-800 mb-1">
                      <p className="text-xs font-bold text-white">{user.name}</p>
                      <p className="text-[11px] text-zinc-400 truncate">
                        {user.phone || user.email}
                      </p>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-md text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                    >
                      <Calendar className="w-4 h-4 text-zinc-400" />
                      <span>My Bookings & Dashboard</span>
                    </Link>

                    {user.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-md text-xs text-amber-300 hover:text-amber-200 hover:bg-amber-950/30 transition-colors"
                      >
                        <Shield className="w-4 h-4 text-amber-400" />
                        <span>Admin CMS Panel</span>
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors mt-1 border-t border-zinc-800"
                    >
                      <LogOut className="w-4 h-4 text-red-400" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">
                <LiquidGlassButton variant="secondary" size="sm" icon={<UserIcon className="w-3.5 h-3.5 text-zinc-400" />}>
                  Login / Signup
                </LiquidGlassButton>
              </Link>
            )}

            {/* Main Primary CTA - Burnt Orange Accent */}
            <Link href="/book">
              <LiquidGlassButton variant="accent" size="sm" icon={<Calendar className="w-3.5 h-3.5" />}>
                Book Station
              </LiquidGlassButton>
            </Link>
          </div>

          {/* Mobile Actions Header */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
            >
              <Search className="w-4 h-4 text-zinc-400" />
            </button>
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
              aria-label="Toggle Mobile Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-out Drawer */}
        {isMobileMenuOpen && (
          <div className="sm:hidden glass-panel border-b border-zinc-800 px-5 pt-4 pb-6 mt-3 space-y-4">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3.5 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-zinc-800 flex flex-col gap-2.5">
              <Link href="/book" onClick={() => setIsMobileMenuOpen(false)}>
                <LiquidGlassButton variant="accent" fullWidth icon={<Calendar className="w-4 h-4" />}>
                  Book Station Slot
                </LiquidGlassButton>
              </Link>

              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm text-zinc-200 bg-zinc-900 border border-zinc-800"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>My Bookings ({user.name})</span>
                  </Link>
                  {user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm text-amber-300 bg-amber-950/40 border border-amber-800/40"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Admin CMS Panel</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      logout();
                    }}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm text-red-400 hover:bg-red-950/30 text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </>
              ) : (
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <LiquidGlassButton variant="secondary" fullWidth icon={<UserIcon className="w-4 h-4 text-zinc-400" />}>
                    Login / Create Account
                  </LiquidGlassButton>
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
