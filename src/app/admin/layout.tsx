"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Gamepad2,
  LayoutDashboard,
  Calendar,
  Users,
  Tag,
  DollarSign,
  Cpu,
  Trophy,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  LogOut,
  Shield,
  Menu,
  X,
  ExternalLink,
  Search,
  Bell,
  Sparkles,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "ADMIN") {
        router.push("/dashboard");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-[#070913] flex flex-col items-center justify-center text-slate-400 gap-3">
        <div className="w-10 h-10 border-2 border-sky-400/20 border-t-sky-400 rounded-full animate-spin" />
        <span className="text-xs uppercase tracking-widest font-semibold text-sky-400/80">
          Verifying Cosmos Admin Access...
        </span>
      </div>
    );
  }

  const navItems = [
    { name: "Live Dashboard", href: "/admin", icon: LayoutDashboard, badge: "Live" },
    { name: "Bookings Manager", href: "/admin/bookings", icon: Calendar },
    { name: "Station Matrix", href: "/admin/stations", icon: Cpu },
    { name: "Customer Directory", href: "/admin/customers", icon: Users },
    { name: "Offers & Promos", href: "/admin/offers", icon: Tag },
    { name: "Pricing & Passes", href: "/admin/pricing", icon: DollarSign },
    { name: "Gaming Zones", href: "/admin/zones", icon: Cpu },
    { name: "Games Library", href: "/admin/games", icon: Gamepad2 },
    { name: "Tournaments", href: "/admin/events", icon: Trophy },
    { name: "Photo Gallery", href: "/admin/gallery", icon: ImageIcon },
    { name: "Reviews", href: "/admin/reviews", icon: MessageSquare },
    { name: "Business Settings", href: "/admin/settings", icon: Settings },
  ];

  const filteredNav = searchQuery.trim()
    ? navItems.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : navItems;

  return (
    <div className="min-h-screen bg-[#060810] text-slate-100 flex flex-col md:flex-row antialiased selection:bg-sky-500 selection:text-white">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-sky-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[-5%] w-[450px] h-[450px] bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[30%] w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-[160px]" />
      </div>

      {/* Mobile Top Navigation */}
      <header className="md:hidden sticky top-0 z-50 bg-[#090d18]/90 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(56,189,248,0.4)]">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-wide text-white block">COSMOS ADMIN</span>
            <span className="text-[10px] text-sky-400 font-semibold uppercase tracking-widest block -mt-0.5">
              Shop Management
            </span>
          </div>
        </Link>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Toggle menu"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Admin Sidebar Navigation */}
      <aside
        className={`w-64 lg:w-72 bg-[#090d18]/90 backdrop-blur-2xl border-r border-white/[0.08] flex flex-col justify-between shrink-0 p-4 z-40 transition-all duration-300 ${
          isSidebarOpen
            ? "fixed inset-0 top-[57px] md:top-0 block"
            : "hidden md:flex sticky top-0 h-screen"
        }`}
      >
        <div className="space-y-5 flex-1 flex flex-col min-h-0">
          {/* Logo Brand Header */}
          <div className="hidden md:flex items-center justify-between px-2 pt-2">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(56,189,248,0.45)] group-hover:scale-105 transition-transform duration-200">
                <Shield className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black tracking-wider text-white uppercase">
                    COSMOS
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30">
                    CMS
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                  Esports Cafe Hub
                </span>
              </div>
            </Link>
          </div>

          {/* Quick Search in Sidebar */}
          <div className="relative px-1">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Quick search tabs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white/[0.03] hover:bg-white/[0.06] focus:bg-white/[0.08] border border-white/[0.08] focus:border-sky-400/50 rounded-xl text-xs text-slate-200 placeholder-slate-500 outline-none transition-all"
            />
          </div>

          {/* Navigation Links Scroll Container */}
          <nav className="space-y-1 overflow-y-auto flex-1 pr-1 custom-scrollbar">
            {filteredNav.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-sky-500/20 to-blue-600/10 text-white font-semibold border border-sky-400/30 shadow-[0_0_20px_rgba(56,189,248,0.15)]"
                      : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        isActive ? "text-sky-400" : "text-slate-400 group-hover:text-slate-200"
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>

                  {item.badge && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile & Footer Controls */}
        <div className="pt-4 mt-2 border-t border-white/[0.08] space-y-3">
          <div className="flex items-center justify-between px-2 py-1">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{user.name}</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-sky-400 font-semibold tracking-wide">
                    CHIEF ADMIN
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Link
              href="/"
              target="_blank"
              className="flex-1 py-1.5 px-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-[11px] text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Public Website</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Administrative Viewport */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        {/* Top Floating App Bar */}
        <header className="sticky top-0 z-30 bg-[#060810]/80 backdrop-blur-xl border-b border-white/[0.08] px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Live System: Supabase PostgreSQL</span>
            </div>
            <span className="text-xs text-slate-500 hidden lg:inline">
              Bandra East, Mumbai Gaming Center
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-slate-400">
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-slate-300 font-mono">
                Bandra East
              </kbd>
              <span>11:00 AM – 11:00 PM</span>
            </div>

            <Link
              href="/admin/bookings"
              className="px-3 py-1.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/30 text-sky-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(56,189,248,0.15)]"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Bookings</span>
            </Link>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
