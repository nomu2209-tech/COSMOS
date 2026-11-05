"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { LiquidGlassButton } from "@/components/ui/LiquidGlassButton";
import { Badge } from "@/components/ui/Badge";
import {
  Calendar,
  Clock,
  Gamepad2,
  Phone,
  Mail,
  LogOut,
  Navigation,
  Plus,
} from "lucide-react";
import { Booking } from "@/types";

export default function CustomerDashboardPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading, logout } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [upcoming, setUpcoming] = useState<Booking[]>([]);
  const [past, setPast] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<"UPCOMING" | "PAST">("UPCOMING");
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/login");
    }
  }, [user, isAuthLoading, router]);

  const fetchBookings = async () => {
    setIsLoadingBookings(true);
    try {
      const res = await fetch("/api/bookings/my");
      const data = await res.json();
      if (res.ok) {
        setBookings(data.bookings || []);
        setUpcoming(data.upcoming || []);
        setPast(data.past || []);
      }
    } catch (error) {
      console.error("Failed to load user bookings:", error);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const res = await fetch("/api/bookings/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });
      const data = await res.json();
      if (res.ok) {
        setActionMessage("Booking cancelled successfully.");
        fetchBookings();
      } else {
        alert(data.error || "Failed to cancel booking");
      }
    } catch (error) {
      alert("Network error");
    }
  };

  if (isAuthLoading || !user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center text-xs text-zinc-400">
        Loading Gamer Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 relative">
      {/* Profile Header Banner */}
      <GlassCard className="border-zinc-800 bg-zinc-900 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xl font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black uppercase text-white font-['Rajdhani',sans-serif]">
                  Welcome, {user.name}
                </h1>
                <Badge variant="neutral" size="sm">CUSTOMER PORTAL</Badge>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400">
                {user.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{user.phone}</span>
                    <Badge variant="green" size="sm" className="!text-[10px] !py-0 !px-1.5">Verified</Badge>
                  </span>
                )}
                {user.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{user.email}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/book">
              <LiquidGlassButton variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>
                Book New Slot
              </LiquidGlassButton>
            </Link>

            <button
              onClick={logout}
              className="p-2.5 rounded-lg bg-zinc-800 hover:bg-red-950/40 border border-zinc-700 hover:border-red-800 text-zinc-300 hover:text-red-400 transition-colors"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 text-xs">
        <button
          onClick={() => setActiveTab("UPCOMING")}
          className={`px-4 py-2 rounded-lg transition-colors font-medium ${
            activeTab === "UPCOMING"
              ? "bg-zinc-800 text-white border border-zinc-700 font-bold"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Upcoming Bookings ({upcoming.length})
        </button>

        <button
          onClick={() => setActiveTab("PAST")}
          className={`px-4 py-2 rounded-lg transition-colors font-medium ${
            activeTab === "PAST"
              ? "bg-zinc-800 text-white border border-zinc-700 font-bold"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Booking History ({past.length})
        </button>
      </div>

      {actionMessage && (
        <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-xs text-emerald-300 flex items-center justify-between">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="text-zinc-400 hover:text-white">
            &times;
          </button>
        </div>
      )}

      {/* TAB 1: UPCOMING BOOKINGS */}
      {activeTab === "UPCOMING" && (
        <div className="space-y-6">
          {isLoadingBookings ? (
            <div className="space-y-4">
              {[1, 2].map((n) => (
                <div key={n} className="glass-card h-40 animate-pulse bg-white/5" />
              ))}
            </div>
          ) : upcoming.length === 0 ? (
            <GlassCard className="text-center py-16 space-y-4 border-zinc-800">
              <Gamepad2 className="w-12 h-12 text-zinc-600 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">No Upcoming Gaming Sessions</h3>
                <p className="text-xs text-zinc-400">
                  Ready to play? Reserve your PS5, PC, VR or Simulator station now.
                </p>
              </div>
              <Link href="/book">
                <LiquidGlassButton variant="primary" size="sm">
                  Book a Station
                </LiquidGlassButton>
              </Link>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcoming.map((b) => (
                <GlassCard
                  key={b.id}
                  className="space-y-4 border-zinc-800 bg-zinc-900 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="neutral" size="sm">
                        {b.zoneName}
                      </Badge>
                      <span className="font-mono text-xs text-white font-bold">
                        {b.bookingRef}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-zinc-300">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-zinc-400" />
                        <span className="font-semibold text-white">{b.bookingDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-zinc-400" />
                        <span>
                          {b.startTime} - {b.endTime} ({b.durationHours} hrs)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Gamepad2 className="w-4 h-4 text-zinc-400" />
                        <span>
                          Station #{b.stationNumber} | {b.playersCount} Gamer(s)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                    <span className="text-sm font-bold text-white font-['Rajdhani',sans-serif]">
                      ₹{b.totalAmount} ({b.paymentStatus})
                    </span>

                    <div className="flex items-center gap-2">
                      <a
                        href="https://maps.google.com/?q=Office+No+23+New+Shopping+Centre+Government+Colony+Bandra+East+Mumbai+400051"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white"
                        title="Get Directions to Cosmos"
                      >
                        <Navigation className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleCancelBooking(b.id)}
                        className="text-xs text-red-400 hover:text-red-300 underline"
                      >
                        Cancel Slot
                      </button>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PAST BOOKINGS */}
      {activeTab === "PAST" && (
        <div className="space-y-6">
          {past.length === 0 ? (
            <GlassCard className="text-center py-12 border-zinc-800">
              <p className="text-xs text-zinc-400">No past sessions recorded yet.</p>
            </GlassCard>
          ) : (
            <div className="space-y-3">
              {past.map((b) => (
                <GlassCard
                  key={b.id}
                  className="!p-4 border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{b.zoneName}</span>
                      <Badge variant={b.bookingStatus === "CANCELLED" ? "neutral" : "green"} size="sm">
                        {b.bookingStatus}
                      </Badge>
                    </div>
                    <p className="text-zinc-400">
                      {b.bookingDate} | {b.startTime} - {b.endTime} | Ref: {b.bookingRef}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-bold text-white font-['Rajdhani',sans-serif]">
                      ₹{b.totalAmount}
                    </span>
                    <Link href={`/book?zone=${b.zoneId}`}>
                      <LiquidGlassButton variant="secondary" size="sm">
                        Book Again
                      </LiquidGlassButton>
                    </Link>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
