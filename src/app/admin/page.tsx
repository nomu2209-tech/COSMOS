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
      return rawChartData.slice(-1);
    }
    if (timeframe === "7D") {
      return rawChartData.slice(-7);
    }
    if (timeframe === "30D") {
      return rawChartData.slice(-30);
    }
    return rawChartData;
  }, [rawChartData, timeframe]);

  // Compute timeframe-specific real revenue from database
  const headlineRevenue = useMemo(() => {
    if (timeframe === "24H") return metrics.todayRevenue || 0;
    if (timeframe === "7D") return metrics.revenueLast7Days || 0;
    if (timeframe === "30D") return metrics.revenueLast30Days || 0;
    return metrics.totalRevenue || 0;
  }, [timeframe, metrics]);

  // SVG Sparkline path generator (handles 0 values cleanly without fake spikes)
  const generateSparkline = (values: number[], width = 280, height = 70) => {
    if (!values || values.length === 0) {
      return { path: `M 8 ${height / 2} L ${width - 8} ${height / 2}`, area: "", lastPoint: { x: width - 8, y: height / 2 }, isZero: true };
    }
    const min = Math.min(...values);
    const max = Math.max(...values);
    const isAllZero = min === 0 && max === 0;

    if (isAllZero) {
      return {
        path: `M 8 ${height - 12} L ${width - 8} ${height - 12}`,
        area: `M 8 ${height - 12} L ${width - 8} ${height - 12} L ${width - 8} ${height} L 8 ${height} Z`,
        lastPoint: { x: width - 8, y: height - 12 },
        isZero: true,
      };
    }

    const range = max - min || 1;

    const points = values.map((val, idx) => {
      const x = (idx / Math.max(values.length - 1, 1)) * (width - 16) + 8;
      const y = height - 10 - ((val - min) / range) * (height - 24);
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

    return { path, area, lastPoint, isZero: false };
  };

  const revenueSparklineValues = useMemo(() => {
    if (!filteredChartData.length) return [0, 0, 0, 0, 0];
    return filteredChartData.map((d: any) => d.revenue || 0);
  }, [filteredChartData]);

  const occupancySparklineValues = useMemo(() => {
    if (!filteredChartData.length) return [0, 0, 0, 0, 0];
    return filteredChartData.map((d: any) => d.bookingsCount || 0);
  }, [filteredChartData]);

  const revSpark = generateSparkline(revenueSparklineValues);
  const occSpark = generateSparkline(occupancySparklineValues);

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
      <div className="py-32 flex flex-col items-center justify-center gap-4 text-zinc-400">
        <div className="w-10 h-10 border-2 border-orange-500/20 border-t-[#ea580c] rounded-full animate-spin" />
        <p className="text-xs uppercase tracking-widest font-semibold text-zinc-300">
          Loading Cosmos Control Hub...
        </p>
      </div>
    );
  }

  const inUseStations = metrics.inUseStationsCount || 0;
  const totalStations = metrics.totalStations || 18;
  const occupancyPercent = totalStations > 0 ? Math.round((inUseStations / totalStations) * 100) : 0;

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Top Banner / Hero Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="px-3 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
              </span>
              COSMOS ADMIN CONTROL HUB
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold tracking-wider uppercase bg-zinc-800/60 text-zinc-400 border border-zinc-700/50">
              SUPABASE POSTGRESQL
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-3">
            <span>Cosmos Gaming Operations</span>
            <span className="text-sm font-medium text-zinc-400 normal-case hidden sm:inline">
              — Bandra East, Mumbai
            </span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            Live telemetry, authentic station occupancy, real-time booking status, and CMS catalog operations.
          </p>
        </div>

        {/* Global Action Header Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={fetchMetrics}
            className="p-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-all cursor-pointer"
            title="Refresh Live Metrics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <Link
            href="/admin/bookings"
            className="px-4 py-2.5 rounded-lg bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-orange-950/40 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Booking</span>
          </Link>

          <Link
            href="/admin/offers"
            className="px-4 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white font-semibold text-xs flex items-center gap-2 transition-all"
          >
            <Tag className="w-4 h-4 text-orange-400" />
            <span>Manage Offers</span>
          </Link>
        </div>
      </div>

      {/* Hero 4 KPI Cards Grid (Frosted Glass Aesthetics matching Website) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Revenue Card with Real Timeframe Switcher */}
        <div className="group relative rounded-xl p-5 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 hover:border-zinc-700 shadow-xl transition-all flex flex-col justify-between overflow-hidden">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                </span>
                <span>Live Revenue</span>
              </div>

              {/* Timeframe selector */}
              <div className="flex items-center gap-1 p-0.5 rounded-md bg-zinc-950 border border-zinc-800 text-xs">
                {(["24H", "7D", "30D", "ALL"] as Timeframe[]).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                      timeframe === tf
                        ? "bg-[#ea580c] text-white"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* Real Revenue Figure */}
            <div className="mt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white tracking-tight">
                  ₹{headlineRevenue.toLocaleString("en-IN")}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                {timeframe === "24H"
                  ? "Today's Verified Sales"
                  : timeframe === "7D"
                  ? "Past 7 Days Total"
                  : timeframe === "30D"
                  ? "Past 30 Days Total"
                  : "All-Time Total"}
              </p>
            </div>
          </div>

          {/* Clean Real Sparkline */}
          <div className="relative mt-4 h-14 w-full overflow-hidden">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 280 70">
              <defs>
                <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ea580c" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#ea580c" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {revSpark.area && <path d={revSpark.area} fill="url(#revenueGradient)" />}
              <path
                d={revSpark.path}
                fill="none"
                stroke="#ea580c"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx={revSpark.lastPoint.x}
                cy={revSpark.lastPoint.y}
                r="3.5"
                fill="#ea580c"
              />
            </svg>
          </div>
        </div>

        {/* Card 2: Live Station Utilization (Real 18 Stations in Bandra East) */}
        <div className="group relative rounded-xl p-5 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 hover:border-zinc-700 shadow-xl transition-all flex flex-col justify-between overflow-hidden">
          <div>
            <div className="flex items-center justify-between text-zinc-400 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-orange-400" />
                Hardware Stations
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
                18 Rigs Total
              </span>
            </div>

            <div className="mt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white tracking-tight">
                  {inUseStations} / {totalStations}
                </span>
                <span className="text-xs font-semibold text-zinc-400">
                  {occupancyPercent}% In-Use
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                {metrics.availableStationsCount ?? 18} stations ready for walk-in players
              </p>
            </div>
          </div>

          {/* Occupancy Sparkline */}
          <div className="relative mt-4 h-14 w-full overflow-hidden">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 280 70">
              <defs>
                <linearGradient id="occGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {occSpark.area && <path d={occSpark.area} fill="url(#occGradient)" />}
              <path
                d={occSpark.path}
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle
                cx={occSpark.lastPoint.x}
                cy={occSpark.lastPoint.y}
                r="3.5"
                fill="#10b981"
              />
            </svg>
          </div>
        </div>

        {/* Card 3: Registered Customer Accounts */}
        <div className="group relative rounded-xl p-5 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 hover:border-zinc-700 shadow-xl transition-all flex flex-col justify-between overflow-hidden">
          <div>
            <div className="flex items-center justify-between text-zinc-400 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-sky-400" />
                Registered Gamers
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-sky-500/10 text-sky-300 border border-sky-500/20">
                Cosmos Club
              </span>
            </div>

            <div className="mt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white tracking-tight">
                  {metrics.totalCustomers || 1}
                </span>
                <span className="text-xs font-semibold text-emerald-400">
                  Verified
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                Active customer accounts in database
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-between">
            <span>Customer Profiles</span>
            <Link href="/admin/customers" className="text-orange-400 hover:underline">
              View Directory →
            </Link>
          </div>
        </div>

        {/* Card 4: Average Session Value / Ticket */}
        <div className="group relative rounded-xl p-5 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 hover:border-zinc-700 shadow-xl transition-all flex flex-col justify-between overflow-hidden">
          <div>
            <div className="flex items-center justify-between text-zinc-400 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Average Ticket
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Rate Tracker
              </span>
            </div>

            <div className="mt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white tracking-tight">
                  ₹{metrics.averageTicket || 0}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                {metrics.totalBookings > 0
                  ? `Across ${metrics.totalBookings} recorded bookings`
                  : "Awaiting completed booking sessions"}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-between">
            <span>Rates: ₹120 - ₹200/hr</span>
            <Link href="/admin/pricing" className="text-orange-400 hover:underline">
              Edit Pricing →
            </Link>
          </div>
        </div>
      </div>

      {/* Main Analytics Chart Section */}
      <div className="rounded-xl p-6 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black uppercase text-white tracking-wide">
                Sales &amp; Session Analytics
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 font-bold border border-zinc-700">
                Real-Time Data
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Interactive timeline of verified revenue and player sessions across the 4 cafe zones
            </p>
          </div>

          {/* Metric Switcher Controls */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-zinc-950 border border-zinc-800">
            <button
              onClick={() => setChartMetric("revenue")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                chartMetric === "revenue"
                  ? "bg-[#ea580c] text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Revenue (₹)
            </button>
            <button
              onClick={() => setChartMetric("bookings")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                chartMetric === "bookings"
                  ? "bg-[#ea580c] text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Sessions Count
            </button>
            <button
              onClick={() => setChartMetric("hours")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                chartMetric === "hours"
                  ? "bg-[#ea580c] text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Hours Played
            </button>
          </div>
        </div>

        {/* Timeline Visualization */}
        <div className="relative pt-6 pb-2">
          {filteredChartData.every((d: any) => d.revenue === 0 && d.bookingsCount === 0) ? (
            <div className="h-44 flex flex-col items-center justify-center text-center p-6 border border-dashed border-zinc-800 rounded-lg">
              <Calendar className="w-8 h-8 text-zinc-600 mb-2" />
              <p className="text-sm font-semibold text-zinc-300">Live Telemetry Active</p>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm">
                No bookings recorded in this timeframe yet. As soon as a customer books online or checks in at the front desk, daily activity bars will generate here automatically.
              </p>
            </div>
          ) : (
            <div className="h-52 flex items-end justify-between gap-1 sm:gap-2 px-2 border-b border-zinc-800">
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
                const heightPercent = val > 0 ? Math.max(10, Math.round((val / maxVal) * 100)) : 4;

                return (
                  <div
                    key={d.date}
                    className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                    onMouseEnter={() =>
                      setHoveredPoint({
                        label: `${d.day}, ${d.label}`,
                        value: val,
                        left: (idx / Math.max(filteredChartData.length - 1, 1)) * 90 + 5,
                      })
                    }
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    <div
                      className={`w-full max-w-[28px] rounded-t-sm transition-all duration-200 ${
                        val > 0
                          ? "bg-gradient-to-t from-orange-600 to-orange-400 group-hover:to-orange-300"
                          : "bg-zinc-800/60"
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-[9px] text-zinc-500 group-hover:text-zinc-300 mt-2 truncate w-full text-center">
                      {filteredChartData.length <= 10 ? d.day : d.label.split(" ")[1]}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 4 Authentic Gaming Zones from Website */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-zinc-800/80">
          {zoneBreakdown.map((z: any) => (
            <div
              key={z.id}
              className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-200 truncate">{z.name}</span>
                <span className="text-[10px] text-orange-400 font-mono font-bold">₹{z.hourlyRate}/h</span>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-base font-black text-white">₹{z.revenue.toLocaleString("en-IN")}</span>
                <span className="text-[11px] text-zinc-400">
                  {z.occupiedStations}/{z.totalStations} Rigs Active
                </span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-2 overflow-hidden">
                <div
                  className="bg-[#ea580c] h-1.5 rounded-full"
                  style={{
                    width: `${Math.round((z.occupiedStations / (z.totalStations || 1)) * 100)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Gaming Station Floor Matrix (Cosmos 18 Stations in Bandra East) */}
      <div className="rounded-xl p-6 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black uppercase text-white tracking-wide">
                Hardware Stations Floor Matrix
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 font-bold border border-zinc-700">
                18 Stations Configured
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Live hardware status in Bandra East: 360° VR Tactical Pods, PS5 4K Arenas, 240Hz PC Esports Rigs &amp; Simulators
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> Available
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" /> In-Session
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="h-2 w-2 rounded-full bg-rose-400" /> Maintenance
            </span>
          </div>
        </div>

        {/* Stations Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {stations.map((st: any) => {
            const isAvailable = st.liveStatus === "AVAILABLE";
            const isInUse = st.liveStatus === "IN_USE";
            const isMaintenance = st.liveStatus === "MAINTENANCE";

            return (
              <div
                key={st.id}
                className={`p-3.5 rounded-lg border transition-all flex flex-col justify-between ${
                  isAvailable
                    ? "bg-zinc-950 border-emerald-500/30 hover:border-emerald-500/60"
                    : isInUse
                    ? "bg-amber-950/20 border-amber-500/40 hover:border-amber-400 shadow-sm"
                    : "bg-rose-950/20 border-rose-500/30 hover:border-rose-400 opacity-70"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase">
                      {st.id.replace("station-", "").toUpperCase()}
                    </span>
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isAvailable
                          ? "bg-emerald-400"
                          : isInUse
                          ? "bg-amber-400 animate-pulse"
                          : "bg-rose-400"
                      }`}
                    />
                  </div>

                  <h3 className="text-xs font-bold text-white truncate">{st.name}</h3>

                  {st.currentSession ? (
                    <div className="mt-2 p-1.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] space-y-0.5">
                      <p className="text-amber-400 font-semibold truncate">
                        {st.currentSession.customerName}
                      </p>
                      <p className="text-zinc-400 truncate">{st.currentSession.time}</p>
                    </div>
                  ) : (
                    <p className="text-[10px] text-zinc-500 mt-2">
                      {isAvailable ? "Ready for gamer" : "Maintenance"}
                    </p>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-zinc-800 flex items-center justify-between">
                  <button
                    disabled={isUpdatingStation === st.id}
                    onClick={() => handleToggleStationStatus(st.id, st.status)}
                    className="text-[10px] font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {st.status === "MAINTENANCE" ? "Set Online" : "Service"}
                  </button>
                  <Link
                    href={`/admin/bookings?stationId=${st.id}`}
                    className="text-[10px] text-orange-400 hover:text-orange-300 font-semibold"
                  >
                    Book →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Verified Recent Bookings Table */}
      <div className="rounded-xl p-6 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 shadow-xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black uppercase text-white tracking-wide">
              Verified Bookings &amp; Sessions
            </h2>
            <p className="text-xs text-zinc-400">
              Live records from online bookings and front-desk counter check-ins
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search gamer, phone, ref..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 focus:border-orange-500/50 text-xs text-zinc-200 placeholder-zinc-500 outline-none w-48 sm:w-60 transition-all"
              />
            </div>

            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-zinc-950 border border-zinc-800">
              {(["ALL", "IN_PROGRESS", "CONFIRMED", "COMPLETED"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === tab
                      ? "bg-[#ea580c] text-white"
                      : "text-zinc-400 hover:text-white"
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
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="text-[11px] uppercase tracking-wider text-zinc-400 bg-zinc-950 border-b border-zinc-800">
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
            <tbody className="divide-y divide-zinc-800">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500">
                    <p className="font-semibold text-zinc-400">No bookings recorded yet</p>
                    <p className="text-xs text-zinc-500 mt-1">
                      New customer bookings will appear here in real time as players register online or walk in.
                    </p>
                    <Link
                      href="/admin/bookings"
                      className="inline-block mt-3 px-3.5 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium transition-colors"
                    >
                      + Create Manual Booking
                    </Link>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b: any) => (
                  <tr key={b.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-orange-400">
                      {b.bookingRef}
                    </td>
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-semibold text-white">{b.customerName}</p>
                        <p className="text-[10px] text-zinc-400">{b.customerPhone}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-zinc-200">{b.zoneName}</p>
                      <p className="text-[10px] text-zinc-400 font-mono">
                        {b.stationId || `Station #${b.stationNumber || 1}`}
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="text-white">{b.bookingDate}</p>
                      <p className="text-[10px] text-zinc-400">
                        {b.startTime} - {b.endTime} ({b.durationHours}h)
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white text-sm">₹{b.totalAmount}</p>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 uppercase font-mono">
                        {b.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          b.bookingStatus === "IN_PROGRESS"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : b.bookingStatus === "CONFIRMED"
                            ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                            : b.bookingStatus === "COMPLETED"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {b.bookingStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href="/admin/bookings"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-400 hover:text-orange-400 transition-colors"
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

      {/* Feature Highlights matching Website Engineering Stack */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 flex items-center justify-center font-mono font-bold text-xs">
            &lt;/&gt;
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Clean Code</h4>
            <p className="text-[11px] text-zinc-400">TypeScript &amp; Next.js 15</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 text-orange-400 flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Smooth Animation</h4>
            <p className="text-[11px] text-zinc-400">Hardware Accelerated</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Authentic Data</h4>
            <p className="text-[11px] text-zinc-400">Supabase PostgreSQL</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 text-sky-400 flex items-center justify-center">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">18 Hardware Rigs</h4>
            <p className="text-[11px] text-zinc-400">Bandra East Arena</p>
          </div>
        </div>
      </div>
    </div>
  );
}
