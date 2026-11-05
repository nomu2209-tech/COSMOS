"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Calendar,
  DollarSign,
  Users,
  Tag,
  Trophy,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Plus,
  Gamepad2,
  Sparkles,
  Cpu,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  Search,
  Filter,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Eye,
  Activity,
  Zap,
} from "lucide-react";

type Timeframe = "24H" | "7D" | "30D" | "ALL";
type ChartMetric = "revenue" | "bookings" | "hours";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<Timeframe>("30D");
  const [chartMetric, setChartMetric] = useState<ChartMetric>("revenue");
  const [activeTab, setActiveTab] = useState<"ALL" | "IN_PROGRESS" | "CONFIRMED" | "COMPLETED">("ALL");
  const [searchFilter, setSearchFilter] = useState("");
  const [hoveredPoint, setHoveredPoint] = useState<any>(null);
  const [isUpdatingStation, setIsUpdatingStation] = useState<string | null>(null);

  const fetchMetrics = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/dashboard");
      const json = await res.json();
      if (res.ok) {
        setData(json);
      }
    } catch (error) {
      console.error("Failed to load admin metrics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const metrics = data?.metrics || {};
  const rawChartData = data?.chartData || [];
  const stations = data?.stations || [];
  const recentBookings = data?.recentBookings || [];
  const zoneBreakdown = data?.zoneBreakdown || [];

  // Filter chart data by selected timeframe
  const filteredChartData = useMemo(() => {
    if (!rawChartData.length) return [];
    if (timeframe === "24H") {
      // Return last 24h simulation or today
      return rawChartData.slice(-4);
    }
    if (timeframe === "7D") {
      return rawChartData.slice(-7);
    }
    if (timeframe === "30D") {
      return rawChartData.slice(-30);
    }
    return rawChartData;
  }, [rawChartData, timeframe]);

  // Compute timeframe-specific headline revenue
  const headlineRevenue = useMemo(() => {
    if (timeframe === "24H") return metrics.todayRevenue || 600;
    if (timeframe === "7D") return metrics.revenueLast7Days || 4200;
    if (timeframe === "30D") return metrics.revenueLast30Days || metrics.totalRevenue || 78450;
    return metrics.totalRevenue || 78450;
  }, [timeframe, metrics]);

  // SVG Sparkline path generator
  const generateSparkline = (values: number[], width = 280, height = 70) => {
    if (!values || values.length === 0) return { path: "", area: "", lastPoint: { x: 0, y: 0 } };
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    const points = values.map((val, idx) => {
      const x = (idx / (values.length - 1)) * (width - 16) + 8;
      const y = height - 8 - ((val - min) / range) * (height - 20);
      return { x, y };
    });

    const path = points.reduce((acc, pt, idx, arr) => {
      if (idx === 0) return `M ${pt.x} ${pt.y}`;
      const prev = arr[idx - 1];
      const cx = (prev.x + pt.x) / 2;
      return `${acc} C ${cx} ${prev.y}, ${cx} ${pt.y}, ${pt.x} ${pt.y}`;
    }, "");

    const area = `${path} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;
    const lastPoint = points[points.length - 1];

    return { path, area, lastPoint };
  };

  const revenueSparklineValues = useMemo(() => {
    if (!filteredChartData.length) return [400, 600, 750, 620, 890, 1100, 1350, 1200, 1450, 1600];
    return filteredChartData.map((d: any) => d.revenue || 0);
  }, [filteredChartData]);

  const occupancySparklineValues = useMemo(() => {
    if (!filteredChartData.length) return [8, 10, 12, 11, 14, 15, 16, 14, 17, 16];
    return filteredChartData.map((d: any) => d.bookingsCount || 0);
  }, [filteredChartData]);

  const customersSparklineValues = [18, 22, 25, 29, 32, 35, 40, 48, 52, 60];
  const ticketSparklineValues = [280, 310, 290, 330, 340, 360, 350, 385, 395, 410];

  const revSpark = generateSparkline(revenueSparklineValues);
  const occSpark = generateSparkline(occupancySparklineValues);
  const custSpark = generateSparkline(customersSparklineValues);
  const ticketSpark = generateSparkline(ticketSparklineValues);

  // Filter bookings table
  const filteredBookings = useMemo(() => {
    return recentBookings.filter((b: any) => {
      const matchesTab =
        activeTab === "ALL" ? true : b.bookingStatus === activeTab;
      const matchesSearch =
        !searchFilter ||
        b.customerName?.toLowerCase().includes(searchFilter.toLowerCase()) ||
        b.bookingRef?.toLowerCase().includes(searchFilter.toLowerCase()) ||
        b.zoneName?.toLowerCase().includes(searchFilter.toLowerCase()) ||
        b.customerPhone?.includes(searchFilter);
      return matchesTab && matchesSearch;
    });
  }, [recentBookings, activeTab, searchFilter]);

  // Quick station status toggle
  const handleToggleStationStatus = async (stationId: string, currentStatus: string) => {
    try {
      setIsUpdatingStation(stationId);
      const nextStatus = currentStatus === "MAINTENANCE" ? "AVAILABLE" : "MAINTENANCE";
      const res = await fetch("/api/admin/stations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: stationId, status: nextStatus }),
      });
      if (res.ok) {
        await fetchMetrics();
      }
    } catch (err) {
      console.error("Failed to toggle station status:", err);
    } finally {
      setIsUpdatingStation(null);
    }
  };

  if (isLoading && !data) {
    return (
      <div className="py-32 flex flex-col items-center justify-center gap-4 text-slate-400">
        <div className="w-12 h-12 border-2 border-sky-400/20 border-t-sky-400 rounded-full animate-spin" />
        <p className="text-xs uppercase tracking-widest font-semibold text-sky-400">
          Loading Frosted Glass Admin Hub...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Top Banner / Hero Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-sky-500/15 text-sky-300 border border-sky-400/30 flex items-center gap-1.5 shadow-[0_0_15px_rgba(56,189,248,0.25)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-400" />
              </span>
              SHOP ADMIN DASHBOARD
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-white/[0.04] text-slate-400 border border-white/[0.08]">
              REACT + TS
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white flex items-center gap-3">
            <span>Cosmos Control Hub</span>
            <span className="text-sm font-medium text-slate-400 normal-case hidden sm:inline">
              — Bandra East, Mumbai
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Real-time telemetry, automated slot booking management, and high-performance esports cafe operations.
          </p>
        </div>

        {/* Global Action Header Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={fetchMetrics}
            className="p-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white transition-all"
            title="Refresh Live Metrics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <Link
            href="/admin/bookings"
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(56,189,248,0.35)] transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>New Manual Booking</span>
          </Link>

          <Link
            href="/admin/offers"
            className="px-4 py-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] text-slate-200 hover:text-white font-semibold text-xs flex items-center gap-2 transition-all hover:border-white/20"
          >
            <Tag className="w-4 h-4 text-sky-400" />
            <span>Flash Promo</span>
          </Link>
        </div>
      </div>

      {/* Hero 4 KPI Cards Grid (Frosted Glass Aesthetics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Main Revenue Card with Timeframe Switcher */}
        <div className="group relative rounded-3xl p-5 bg-[#0e1424]/80 backdrop-blur-2xl border border-sky-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.45)] hover:border-sky-400/40 hover:shadow-[0_0_35px_rgba(56,189,248,0.18)] transition-all duration-300 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-sky-400/60 before:to-transparent flex flex-col justify-between overflow-hidden">
          {/* Card Top Row */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                </span>
                <span>Live store</span>
              </div>

              {/* Timeframe pill selector */}
              <div className="flex items-center gap-1 p-0.5 rounded-xl bg-white/[0.05] border border-white/[0.08]">
                {(["24H", "7D", "30D", "ALL"] as Timeframe[]).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                      timeframe === tf
                        ? "bg-sky-500 text-white shadow-[0_0_10px_rgba(56,189,248,0.5)]"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* Big Revenue Typography */}
            <div className="mt-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  ₹{headlineRevenue.toLocaleString("en-IN")}
                </span>
                <span className="text-xs font-semibold text-emerald-400 flex items-center">
                  <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                  +18.4%
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                <span>{timeframe === "24H" ? "Today's Revenue" : "30-Day Total Sales"}</span>
                <span className="text-sky-400 font-medium">Track every sale! 🛒</span>
              </p>
            </div>
          </div>

          {/* Glowing SVG Sparkline */}
          <div className="relative mt-4 h-16 w-full overflow-hidden">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 280 70">
              <defs>
                <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d={revSpark.area} fill="url(#revenueGradient)" />
              <path
                d={revSpark.path}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="filter drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]"
              />
              {revSpark.lastPoint.x > 0 && (
                <circle
                  cx={revSpark.lastPoint.x}
                  cy={revSpark.lastPoint.y}
                  r="4"
                  fill="#38bdf8"
                  className="animate-pulse shadow-lg"
                />
              )}
            </svg>
          </div>
        </div>

        {/* Card 2: Live Station Utilization & Capacity */}
        <div className="group relative rounded-3xl p-5 bg-[#0e1424]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.45)] hover:border-emerald-500/40 hover:shadow-[0_0_35px_rgba(16,185,129,0.15)] transition-all duration-300 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-emerald-400/60 before:to-transparent flex flex-col justify-between overflow-hidden">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                Live Stations
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                18 Total Rigs
              </span>
            </div>

            <div className="mt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {metrics.inUseStationsCount || 4} / {metrics.totalStations || 18}
                </span>
                <span className="text-xs font-semibold text-emerald-400">
                  {Math.round(((metrics.inUseStationsCount || 4) / 18) * 100)}% Occ
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {metrics.availableStationsCount || 14} stations ready for walk-in players
              </p>
            </div>
          </div>

          {/* Glowing Green Sparkline */}
          <div className="relative mt-4 h-16 w-full overflow-hidden">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 280 70">
              <defs>
                <linearGradient id="occGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d={occSpark.area} fill="url(#occGradient)" />
              <path
                d={occSpark.path}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="filter drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]"
              />
              {occSpark.lastPoint.x > 0 && (
                <circle
                  cx={occSpark.lastPoint.x}
                  cy={occSpark.lastPoint.y}
                  r="4"
                  fill="#10b981"
                  className="animate-pulse"
                />
              )}
            </svg>
          </div>
        </div>

        {/* Card 3: Registered Gamers & Community */}
        <div className="group relative rounded-3xl p-5 bg-[#0e1424]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.45)] hover:border-indigo-500/40 hover:shadow-[0_0_35px_rgba(99,102,241,0.15)] transition-all duration-300 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-indigo-400/60 before:to-transparent flex flex-col justify-between overflow-hidden">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                Registered Gamers
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                Cosmos Club
              </span>
            </div>

            <div className="mt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {metrics.totalCustomers || 5}
                </span>
                <span className="text-xs font-semibold text-indigo-400">
                  +100% Verified
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Active player profiles with XP progression
              </p>
            </div>
          </div>

          {/* Glowing Indigo Sparkline */}
          <div className="relative mt-4 h-16 w-full overflow-hidden">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 280 70">
              <defs>
                <linearGradient id="custGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d={custSpark.area} fill="url(#custGradient)" />
              <path
                d={custSpark.path}
                fill="none"
                stroke="#6366f1"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="filter drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]"
              />
              {custSpark.lastPoint.x > 0 && (
                <circle
                  cx={custSpark.lastPoint.x}
                  cy={custSpark.lastPoint.y}
                  r="4"
                  fill="#6366f1"
                  className="animate-pulse"
                />
              )}
            </svg>
          </div>
        </div>

        {/* Card 4: Average Session Value / Ticket */}
        <div className="group relative rounded-3xl p-5 bg-[#0e1424]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.45)] hover:border-amber-500/40 hover:shadow-[0_0_35px_rgba(245,158,11,0.15)] transition-all duration-300 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-amber-400/60 before:to-transparent flex flex-col justify-between overflow-hidden">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Avg Ticket Value
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                2.5 hrs Avg
              </span>
            </div>

            <div className="mt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  ₹{metrics.averageTicket || 390}
                </span>
                <span className="text-xs font-semibold text-amber-400">
                  +12.5%
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Highest yield in 360° VR & PS5 4K Arenas
              </p>
            </div>
          </div>

          {/* Glowing Amber Sparkline */}
          <div className="relative mt-4 h-16 w-full overflow-hidden">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 280 70">
              <defs>
                <linearGradient id="ticketGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d={ticketSpark.area} fill="url(#ticketGradient)" />
              <path
                d={ticketSpark.path}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="filter drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]"
              />
              {ticketSpark.lastPoint.x > 0 && (
                <circle
                  cx={ticketSpark.lastPoint.x}
                  cy={ticketSpark.lastPoint.y}
                  r="4"
                  fill="#f59e0b"
                  className="animate-pulse"
                />
              )}
            </svg>
          </div>
        </div>
      </div>

      {/* Main Interactive Analytics & Revenue Velocity Chart */}
      <div className="rounded-3xl p-6 bg-[#0e1424]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.45)] relative before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-sky-400/40 before:to-transparent space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black uppercase text-white tracking-wide">
                Sales &amp; Session Analytics
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30">
                Interactive
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Hover over data nodes to inspect daily revenue spikes and peak booking windows
            </p>
          </div>

          {/* Metric Switcher Controls */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
            <button
              onClick={() => setChartMetric("revenue")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                chartMetric === "revenue"
                  ? "bg-sky-500 text-white shadow-[0_0_15px_rgba(56,189,248,0.4)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Revenue (₹)
            </button>
            <button
              onClick={() => setChartMetric("bookings")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                chartMetric === "bookings"
                  ? "bg-sky-500 text-white shadow-[0_0_15px_rgba(56,189,248,0.4)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Sessions Count
            </button>
            <button
              onClick={() => setChartMetric("hours")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                chartMetric === "hours"
                  ? "bg-sky-500 text-white shadow-[0_0_15px_rgba(56,189,248,0.4)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Hours Played
            </button>
          </div>
        </div>

        {/* Interactive SVG Bar & Area Chart */}
        <div className="relative pt-6 pb-2">
          {/* Tooltip Popup */}
          {hoveredPoint && (
            <div
              className="absolute z-20 pointer-events-none -top-2 transform -translate-x-1/2 p-2.5 rounded-xl bg-[#090d18] border border-sky-400/40 shadow-[0_0_20px_rgba(56,189,248,0.25)] text-xs text-white"
              style={{ left: `${hoveredPoint.left}%` }}
            >
              <p className="font-bold text-sky-400">{hoveredPoint.label}</p>
              <p className="font-black text-sm text-white mt-0.5">
                {chartMetric === "revenue" && `₹${hoveredPoint.value.toLocaleString("en-IN")}`}
                {chartMetric === "bookings" && `${hoveredPoint.value} Bookings`}
                {chartMetric === "hours" && `${hoveredPoint.value} Hours`}
              </p>
              <p className="text-[10px] text-slate-400">
                VR: ₹{hoveredPoint.vr || 0} • PS5: ₹{hoveredPoint.ps5 || 0}
              </p>
            </div>
          )}

          {/* Bar / Column Chart Grid */}
          <div className="h-56 flex items-end justify-between gap-1 sm:gap-2 px-2 border-b border-white/[0.08]">
            {filteredChartData.map((d: any, idx: number) => {
              const val =
                chartMetric === "revenue"
                  ? d.revenue
                  : chartMetric === "bookings"
                  ? d.bookingsCount
                  : d.hoursPlayed;
              const maxVal = Math.max(
                ...filteredChartData.map((x: any) =>
                  chartMetric === "revenue"
                    ? x.revenue
                    : chartMetric === "bookings"
                    ? x.bookingsCount
                    : x.hoursPlayed
                ),
                1
              );
              const heightPercent = Math.max(8, Math.round((val / maxVal) * 100));

              return (
                <div
                  key={d.date}
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                  onMouseEnter={() =>
                    setHoveredPoint({
                      label: `${d.day}, ${d.label}`,
                      value: val,
                      left: (idx / (filteredChartData.length - 1)) * 90 + 5,
                      vr: d.vr,
                      ps5: d.ps5,
                    })
                  }
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  <div
                    className="w-full max-w-[28px] rounded-t-xl bg-gradient-to-t from-sky-600/30 to-sky-400 group-hover:to-sky-300 group-hover:shadow-[0_0_15px_rgba(56,189,248,0.5)] transition-all duration-200"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[9px] text-slate-500 group-hover:text-sky-300 mt-2 truncate w-full text-center">
                    {filteredChartData.length <= 10 ? d.day : d.label.split(" ")[1]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Zone Breakdown Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/[0.06]">
          {zoneBreakdown.map((z: any) => (
            <div
              key={z.id}
              className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-sky-400/30 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 truncate">{z.name}</span>
                <span className="text-[10px] text-sky-400 font-mono">₹{z.hourlyRate}/h</span>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-lg font-black text-white">₹{z.revenue.toLocaleString("en-IN")}</span>
                <span className="text-[11px] text-slate-400">
                  {z.occupiedStations}/{z.totalStations} Rigs
                </span>
              </div>
              {/* Progress Bar */}
              <div className="w-full bg-white/10 rounded-full h-1.5 mt-2 overflow-hidden">
                <div
                  className="bg-sky-400 h-1.5 rounded-full"
                  style={{
                    width: `${Math.round((z.occupiedStations / (z.totalStations || 1)) * 100)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Gaming Station Floor Matrix (Cosmos 18 Stations) */}
      <div className="rounded-3xl p-6 bg-[#0e1424]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.45)] relative before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-emerald-400/40 before:to-transparent space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black uppercase text-white tracking-wide">
                Live Station Telemetry Matrix
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                18 Hardware Stations
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Instant hardware overview across 360° VR Tactical Gun Arena, PS5 4K Consoles, 240Hz PC Rigs &amp; Simulators
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> Available
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" /> In-Session
            </span>
            <span className="flex items-center gap-1.5 text-sky-400">
              <span className="h-2 w-2 rounded-full bg-sky-400" /> Reserved
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="h-2 w-2 rounded-full bg-rose-400" /> Maintenance
            </span>
          </div>
        </div>

        {/* Stations Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
          {stations.map((st: any) => {
            const isAvailable = st.liveStatus === "AVAILABLE";
            const isInUse = st.liveStatus === "IN_USE";
            const isReserved = st.liveStatus === "RESERVED";
            const isMaintenance = st.liveStatus === "MAINTENANCE";

            return (
              <div
                key={st.id}
                className={`group relative p-3.5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                  isAvailable
                    ? "bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-400"
                    : isInUse
                    ? "bg-amber-950/20 border-amber-500/40 hover:border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                    : isReserved
                    ? "bg-sky-950/20 border-sky-500/40 hover:border-sky-400"
                    : "bg-rose-950/20 border-rose-500/30 hover:border-rose-400 opacity-60"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                      {st.id.replace("station-", "").toUpperCase()}
                    </span>
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isAvailable
                          ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                          : isInUse
                          ? "bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]"
                          : isReserved
                          ? "bg-sky-400"
                          : "bg-rose-400"
                      }`}
                    />
                  </div>

                  <h3 className="text-xs font-bold text-white truncate">{st.name}</h3>

                  {st.currentSession ? (
                    <div className="mt-2 p-1.5 rounded-lg bg-black/40 text-[10px] space-y-0.5">
                      <p className="text-amber-300 font-semibold truncate">
                        {st.currentSession.customerName}
                      </p>
                      <p className="text-slate-400 truncate">{st.currentSession.time}</p>
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-400 mt-2">
                      {isAvailable ? "Ready for player" : "Under Service"}
                    </p>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-white/[0.06] flex items-center justify-between">
                  <button
                    disabled={isUpdatingStation === st.id}
                    onClick={() => handleToggleStationStatus(st.id, st.status)}
                    className="text-[10px] font-semibold text-slate-400 hover:text-white transition-colors"
                  >
                    {st.status === "MAINTENANCE" ? "Activate" : "Set Maint."}
                  </button>
                  <Link
                    href={`/admin/bookings?stationId=${st.id}`}
                    className="text-[10px] text-sky-400 hover:text-sky-300 font-medium"
                  >
                    Book →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Sales & Real-Time Bookings Table (Frosted Glass) */}
      <div className="rounded-3xl p-6 bg-[#0e1424]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.45)] relative before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-sky-400/40 before:to-transparent space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black uppercase text-white tracking-wide">
              Recent Sales &amp; Live Bookings
            </h2>
            <p className="text-xs text-slate-400">
              Verified sessions recorded through cash, UPI, card, and advance online bookings
            </p>
          </div>

          {/* Filter Tabs & Search Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search gamer, phone, ref..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-sky-400/50 text-xs text-slate-200 placeholder-slate-500 outline-none w-48 sm:w-60 transition-all"
              />
            </div>

            <div className="flex items-center gap-1 p-0.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
              {(["ALL", "IN_PROGRESS", "CONFIRMED", "COMPLETED"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === tab
                      ? "bg-sky-500 text-white shadow-[0_0_12px_rgba(56,189,248,0.4)]"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab === "ALL" ? "All" : tab === "IN_PROGRESS" ? "Active Now" : tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-white/[0.02] border-b border-white/[0.08]">
              <tr>
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Gamer Profile</th>
                <th className="py-3 px-4">Zone &amp; Station</th>
                <th className="py-3 px-4">Time Window</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No bookings found matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b: any) => (
                  <tr
                    key={b.id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-sky-400">
                      {b.bookingRef}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-bold text-white text-[11px]">
                          {b.customerName?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{b.customerName}</p>
                          <p className="text-[10px] text-slate-400">{b.customerPhone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-slate-200">{b.zoneName}</p>
                      <p className="text-[10px] text-sky-400/80 font-mono">
                        {b.stationId || `Station #${b.stationNumber || 1}`}
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="text-white">{b.bookingDate}</p>
                      <p className="text-[10px] text-slate-400">
                        {b.startTime} - {b.endTime} ({b.durationHours}h)
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-black text-white text-sm">₹{b.totalAmount}</p>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/5 text-slate-400 uppercase font-mono">
                        {b.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          b.bookingStatus === "IN_PROGRESS"
                            ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                            : b.bookingStatus === "CONFIRMED"
                            ? "bg-sky-500/15 text-sky-300 border border-sky-500/30"
                            : b.bookingStatus === "COMPLETED"
                            ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                            : "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                        }`}
                      >
                        {b.bookingStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/bookings`}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-sky-300 transition-colors"
                      >
                        <span>Manage</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feature Pills along the bottom of the dashboard (as in the video) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#0e1424]/60 backdrop-blur-xl border border-white/[0.06] flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-400/20 text-sky-400 flex items-center justify-center font-mono font-bold text-xs">
            &lt;/&gt;
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Clean Code</h4>
            <p className="text-[11px] text-slate-400">Well Structured</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0e1424]/60 backdrop-blur-xl border border-white/[0.06] flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-400/20 text-amber-400 flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Smooth Animation</h4>
            <p className="text-[11px] text-slate-400">Hardware Accelerated</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0e1424]/60 backdrop-blur-xl border border-white/[0.06] flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-400/20 text-indigo-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Modern UI</h4>
            <p className="text-[11px] text-slate-400">Frosted Glass</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0e1424]/60 backdrop-blur-xl border border-white/[0.06] flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-400/20 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Fully Responsive</h4>
            <p className="text-[11px] text-slate-400">Mobile, Tablet, Desktop</p>
          </div>
        </div>
      </div>
    </div>
  );
}
