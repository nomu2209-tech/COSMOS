"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { GlassCard } from "./ui/GlassCard";
import { LiquidGlassButton } from "./ui/LiquidGlassButton";
import { Badge } from "./ui/Badge";
import {
  Calendar as CalendarIcon,
  Clock,
  Gamepad2,
  Users,
  CreditCard,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Navigation,
  Phone,
  Tag,
  ShieldCheck,
  Download,
} from "lucide-react";
import { Booking } from "@/types";
import ConfirmationModal from "./ConfirmationModal";
import CopyButton from "./ui/CopyButton";
import { getStoredUtmParams } from "@/lib/utm";

export default function BookingWizard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { zones, offers } = useData();

  const [step, setStep] = useState<number>(1);
  const [selectedZoneId, setSelectedZoneId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedDuration, setSelectedDuration] = useState<number>(2);
  const [playersCount, setPlayersCount] = useState<number>(1);
  const [selectedStartTime, setSelectedStartTime] = useState<string>("");
  const [offerCode, setOfferCode] = useState<string>("");
  const [specialRequests, setSpecialRequests] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "CARD" | "NETBANKING" | "PAY_AT_VENUE">("UPI");

  // Guest details if not logged in
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  // Live Slot Availability State
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize from searchParams
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);

    const zoneParam = searchParams.get("zone");
    if (zoneParam) {
      setSelectedZoneId(zoneParam);
    } else if (zones.length > 0) {
      setSelectedZoneId(zones[0].id);
    }

    const offerParam = searchParams.get("offer");
    if (offerParam) {
      setOfferCode(offerParam);
    }
  }, [searchParams, zones]);

  // Sync user state if logged in
  useEffect(() => {
    if (user) {
      setCustomerName(user.name);
      if (user.phone) setCustomerPhone(user.phone);
      if (user.email) setCustomerEmail(user.email);
    }
  }, [user]);

  // Fetch live availability from database when date, zone, or duration changes
  useEffect(() => {
    if (!selectedDate || !selectedZoneId) return;

    const fetchAvailability = async () => {
      setIsLoadingSlots(true);
      try {
        const res = await fetch(
          `/api/bookings/availability?date=${selectedDate}&zoneId=${selectedZoneId}&duration=${selectedDuration}&players=${playersCount}`
        );
        const data = await res.json();
        if (res.ok) {
          setAvailableSlots(data.slots || []);
          if (data.slots && data.slots.length > 0) {
            const firstAvailable = data.slots.find((s: any) => s.isAvailable);
            if (firstAvailable && !selectedStartTime) {
              setSelectedStartTime(firstAvailable.startTime);
            }
          }
        }
      } catch (error) {
        console.error("Availability error:", error);
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchAvailability();
  }, [selectedDate, selectedZoneId, selectedDuration, playersCount]);

  const selectedZone = zones.find((z) => z.id === selectedZoneId) || zones[0];

  // Price Calculation
  const subtotal = selectedZone ? selectedZone.hourlyRate * selectedDuration * playersCount : 0;
  let discount = 0;
  if (offerCode) {
    const applied = offers.find(
      (o) => o.code.toUpperCase() === offerCode.toUpperCase()
    );
    if (applied) {
      if (applied.discountType === "PERCENTAGE") {
        discount = Math.round((subtotal * applied.discountValue) / 100);
      } else {
        discount = Math.min(applied.discountValue, subtotal);
      }
    }
  }
  const totalAmount = Math.max(0, subtotal - discount);

  // Finalize Booking
  const handleFinalizeBooking = async () => {
    if (!customerName || !customerPhone) {
      setErrorMessage("Please provide your Name and Mobile Number for booking confirmation.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerEmail,
          zoneId: selectedZoneId,
          bookingDate: selectedDate,
          startTime: selectedStartTime,
          durationHours: selectedDuration,
          playersCount,
          paymentMethod,
          offerCode: offerCode || null,
          specialRequests: specialRequests || null,
          utmParams: getStoredUtmParams(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Failed to confirm booking.");
      } else {
        setConfirmedBooking(data.booking);
        setStep(5); // Go to Confirmation screen
      }
    } catch (error) {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate .ics calendar download
  const handleDownloadCalendar = () => {
    if (!confirmedBooking) return;
    const startIso = `${confirmedBooking.bookingDate.replace(/-/g, "")}T${confirmedBooking.startTime.replace(":", "")}00`;
    const endIso = `${confirmedBooking.bookingDate.replace(/-/g, "")}T${confirmedBooking.endTime.replace(":", "")}00`;

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Cosmos Gaming Mumbai//Slot Booking//EN
BEGIN:VEVENT
UID:${confirmedBooking.bookingRef}@cosmosgamingmumbai.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z
DTSTART:${startIso}
DTEND:${endIso}
SUMMARY:Gaming Session at Cosmos Gaming (${confirmedBooking.zoneName})
DESCRIPTION:Booking Ref: ${confirmedBooking.bookingRef}\\nPlayers: ${confirmedBooking.playersCount}\\nStation: ${confirmedBooking.stationNumber}
LOCATION:Cosmos Gaming Centre, Bandra East, Mumbai, Maharashtra
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `CosmosGaming_${confirmedBooking.bookingRef}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Wizard Progress Bar */}
      <div className="mb-10 space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-zinc-400">
          <span className={step >= 1 ? "text-white font-bold" : ""}>1. Zone & Date</span>
          <span className={step >= 2 ? "text-white font-bold" : ""}>2. Time & Station</span>
          <span className={step >= 3 ? "text-white font-bold" : ""}>3. Customer Details</span>
          <span className={step >= 4 ? "text-white font-bold" : ""}>4. Payment</span>
          <span className={step >= 5 ? "text-emerald-400 font-bold" : ""}>5. Confirmed</span>
        </div>
        <div className="h-2 w-full bg-zinc-800 rounded-md overflow-hidden p-0.5 border border-zinc-700">
          <div
            className="h-full bg-white rounded-md transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: CHOOSE ZONE, DATE, DURATION, SQUAD */}
      {step === 1 && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <Badge variant="neutral" size="sm">STEP 1 OF 4</Badge>
            <h2 className="text-3xl font-black uppercase text-white font-['Rajdhani',sans-serif]">
              Select Gaming Zone & Date
            </h2>
            <p className="text-xs text-zinc-400">Choose your gaming station and session duration</p>
          </div>

          {/* Gaming Zones Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {zones.map((z) => {
              const isSelected = selectedZoneId === z.id;
              return (
                <div
                  key={z.id}
                  onClick={() => setSelectedZoneId(z.id)}
                  className={`glass-card !p-4 cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? "border-white bg-zinc-850 shadow-sm"
                      : "border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="relative h-28 w-full rounded-lg overflow-hidden">
                      <Image src={z.imageUrl} alt={z.name} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                        <span className="text-xs font-bold text-white font-['Rajdhani',sans-serif]">
                          ₹{z.hourlyRate}/hr
                        </span>
                        <Badge variant="neutral" size="sm">
                          {z.totalStations} Rigs
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white font-['Rajdhani',sans-serif]">
                        {z.name}
                      </h4>
                      <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1">
                        {z.specs}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
                    <span className={isSelected ? "text-white font-bold" : "text-zinc-400"}>
                      {isSelected ? "Selected" : "Select Zone"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Session Parameters: Date, Duration, Players */}
          <GlassCard className="space-y-6 border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Date Selection */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CalendarIcon className="w-4 h-4 text-zinc-400" />
                  <span>Session Date</span>
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="glass-input cursor-pointer"
                />
              </div>

              {/* Duration Selection */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-zinc-400" />
                  <span>Duration</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((hours) => (
                    <button
                      key={hours}
                      type="button"
                      onClick={() => setSelectedDuration(hours)}
                      className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
                        selectedDuration === hours
                          ? "bg-white border-white text-zinc-950 font-bold"
                          : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800"
                      }`}
                    >
                      {hours} {hours === 1 ? "Hr" : "Hrs"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Squad / Players count */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-zinc-400" />
                  <span>Players Count</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setPlayersCount(count)}
                      className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
                        playersCount === count
                          ? "bg-white border-white text-zinc-950 font-bold"
                          : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800"
                      }`}
                    >
                      {count} {count === 1 ? "Solo" : `x${count}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Continue Button */}
          <div className="flex justify-end">
            <LiquidGlassButton
              variant="primary"
              size="md"
              onClick={() => setStep(2)}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Available Slots
            </LiquidGlassButton>
          </div>
        </div>
      )}

      {/* STEP 2: REAL-TIME AVAILABLE TIME SLOTS */}
      {step === 2 && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <Badge variant="neutral" size="sm">STEP 2 OF 4</Badge>
            <h2 className="text-3xl font-black uppercase text-white font-['Rajdhani',sans-serif]">
              Select Available Time Slot
            </h2>
            <p className="text-xs text-zinc-400">
              Live station availability for {selectedZone?.name} on {selectedDate} ({selectedDuration} hrs)
            </p>
          </div>

          <GlassCard className="space-y-6 border-zinc-800">
            {isLoadingSlots ? (
              <div className="py-16 text-center space-y-3">
                <Clock className="w-8 h-8 text-zinc-500 animate-pulse mx-auto" />
                <p className="text-xs text-zinc-400">Querying live station database...</p>
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <p className="text-sm text-zinc-400">No slots available for this configuration.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {availableSlots.map((slot) => {
                  const isSelected = selectedStartTime === slot.startTime;
                  const isAvailable = slot.isAvailable;

                  return (
                    <button
                      key={slot.startTime}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => isAvailable && setSelectedStartTime(slot.startTime)}
                      className={`p-3.5 rounded-lg border text-left transition-colors relative flex flex-col justify-between ${
                        !isAvailable
                          ? "bg-zinc-900/50 border-zinc-800/40 text-zinc-600 cursor-not-allowed opacity-50"
                          : isSelected
                          ? "bg-white border-white text-zinc-950 font-bold"
                          : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-850 hover:border-zinc-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm font-bold">
                          {slot.startTime}
                        </span>
                        {isAvailable ? (
                          <span className={`w-2 h-2 rounded-full ${isSelected ? "bg-zinc-950" : "bg-emerald-400"}`} />
                        ) : (
                          <span className="text-[10px] text-zinc-500 uppercase font-bold">Booked</span>
                        )}
                      </div>

                      <div className={`mt-2 text-[10px] flex items-center justify-between ${isSelected ? "text-zinc-700" : "text-zinc-400"}`}>
                        <span>to {slot.endTime}</span>
                        {isAvailable && (
                          <span className={isSelected ? "font-bold text-zinc-950" : "text-zinc-300 font-semibold"}>
                            {slot.availableStationsCount} free
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </GlassCard>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <LiquidGlassButton
              variant="secondary"
              size="md"
              onClick={() => setStep(1)}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </LiquidGlassButton>

            <LiquidGlassButton
              variant="primary"
              size="md"
              disabled={!selectedStartTime}
              onClick={() => setStep(3)}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Gamer Details
            </LiquidGlassButton>
          </div>
        </div>
      )}

      {/* STEP 3: CUSTOMER CONTACT & COUPON CODE */}
      {step === 3 && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <Badge variant="neutral" size="sm">STEP 3 OF 4</Badge>
            <h2 className="text-3xl font-black uppercase text-white font-['Rajdhani',sans-serif]">
              Gamer Information & Offers
            </h2>
            <p className="text-xs text-zinc-400">
              Enter your contact details for instant station confirmation
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Form */}
            <div className="lg:col-span-2 space-y-6">
              <GlassCard className="space-y-4 border-zinc-800">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Aryan Sharma"
                    className="glass-input"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Mobile Number (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="glass-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="aryan@gmail.com"
                      className="glass-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Promo / Offer Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={offerCode}
                      onChange={(e) => setOfferCode(e.target.value.toUpperCase())}
                      placeholder="e.g. COSMOSBOGO"
                      className="glass-input uppercase font-mono"
                    />
                  </div>
                  {discount > 0 && (
                    <p className="text-xs text-emerald-400 mt-1 font-medium">
                      Coupon applied: You save ₹{discount}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Special Setup Requests (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="e.g. 2 controllers for FIFA, mechanical keyboard preferences, etc."
                    className="glass-input resize-none"
                  />
                </div>
              </GlassCard>
            </div>

            {/* Right Col: Summary Card */}
            <div>
              <GlassCard className="space-y-5 border-zinc-800 bg-zinc-900">
                <h4 className="text-sm font-bold text-white font-['Rajdhani',sans-serif] uppercase tracking-wider pb-2 border-b border-zinc-800">
                  Booking Summary
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-zinc-400">
                    <span>Zone:</span>
                    <span className="font-bold text-white">{selectedZone?.name}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Date:</span>
                    <span className="font-semibold text-white">{selectedDate}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Time Slot:</span>
                    <span className="font-semibold text-white">
                      {selectedStartTime} ({selectedDuration} hrs)
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Players:</span>
                    <span className="font-semibold text-white">{playersCount} Gamer(s)</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Rate:</span>
                    <span>₹{selectedZone?.hourlyRate}/hr</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800 space-y-1.5 text-xs">
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal:</span>
                    <span>₹{subtotal}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-semibold">
                      <span>Discount:</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-black text-white pt-2 border-t border-zinc-800 font-['Rajdhani',sans-serif]">
                    <span>Total Due:</span>
                    <span className="text-xl text-white">₹{totalAmount}</span>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <LiquidGlassButton
              variant="secondary"
              size="md"
              onClick={() => setStep(2)}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </LiquidGlassButton>

            <LiquidGlassButton
              variant="primary"
              size="md"
              disabled={!customerName || !customerPhone}
              onClick={() => setStep(4)}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Payment
            </LiquidGlassButton>
          </div>
        </div>
      )}

      {/* STEP 4: PAYMENT SELECTION & CONFIRMATION */}
      {step === 4 && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <Badge variant="neutral" size="sm">STEP 4 OF 4</Badge>
            <h2 className="text-3xl font-black uppercase text-white font-['Rajdhani',sans-serif]">
              Payment & Final Confirmation
            </h2>
            <p className="text-xs text-zinc-400">Select payment method to lock in your gaming station</p>
          </div>

          <div className="max-w-2xl mx-auto space-y-6">
            <GlassCard className="space-y-6 border-zinc-800">
              <h4 className="text-sm font-bold text-white font-['Rajdhani',sans-serif] uppercase tracking-wider">
                Select Payment Mode
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: "UPI", title: "Instant UPI / QR", desc: "GPay, PhonePe, Paytm, BHIM" },
                  { id: "CARD", title: "Debit / Credit Card", desc: "Visa, Mastercard, RuPay" },
                  { id: "NETBANKING", title: "NetBanking", desc: "All Indian Major Banks" },
                  { id: "PAY_AT_VENUE", title: "Pay at Arena", desc: "Pay cash/UPI at front desk" },
                ].map((pm) => (
                  <div
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id as any)}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      paymentMethod === pm.id
                        ? "bg-zinc-800 border-white text-white"
                        : "bg-zinc-900 border-zinc-800 hover:bg-zinc-850"
                    }`}
                  >
                    <p className="text-xs font-bold text-white">{pm.title}</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{pm.desc}</p>
                  </div>
                ))}
              </div>

              {/* Total Summary */}
              <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                <div>
                  <p className="text-xs text-zinc-400">Final Booking Amount:</p>
                  <p className="text-2xl font-black text-white font-['Rajdhani',sans-serif]">
                    ₹{totalAmount}
                  </p>
                </div>
                <div className="text-right text-xs text-zinc-400">
                  <p className="font-semibold text-zinc-200">Instant Station Lock</p>
                  <p className="text-[10px] text-zinc-500">Pay at venue or via online UPI</p>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/40 text-xs text-red-300">
                  {errorMessage}
                </div>
              )}
            </GlassCard>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
              <LiquidGlassButton
                variant="secondary"
                size="md"
                onClick={() => setStep(3)}
                icon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </LiquidGlassButton>

              <LiquidGlassButton
                variant="accent"
                size="lg"
                disabled={isSubmitting}
                onClick={() => setShowConfirmModal(true)}
                icon={<CreditCard className="w-4 h-4" />}
              >
                {isSubmitting ? "Finalizing Booking..." : "CONFIRM BOOKING & LOCK SLOT"}
              </LiquidGlassButton>
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal
              isOpen={showConfirmModal}
              title="Lock Gaming Station?"
              message={`You are about to book a ${selectedDuration}-hour gaming session on ${selectedDate} at ${selectedStartTime} for ${playersCount} player(s). Would you like to proceed?`}
              confirmText="Yes, Lock My Slot"
              cancelText="Review Details"
              onConfirm={() => {
                setShowConfirmModal(false);
                handleFinalizeBooking();
              }}
              onCancel={() => setShowConfirmModal(false)}
            />
          </div>
        </div>
      )}

      {/* STEP 5: SUCCESS CONFIRMATION SCREEN */}
      {step === 5 && confirmedBooking && (
        <div className="max-w-2xl mx-auto space-y-8 animate-in zoom-in-95 duration-300">
          <GlassCard className="text-center space-y-6 border-zinc-800 bg-zinc-900">
            <div className="w-14 h-14 rounded-lg bg-emerald-950/40 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-800/60">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <Badge variant="green" size="md">BOOKING CONFIRMED</Badge>
              <h2 className="text-3xl font-black uppercase text-white font-['Rajdhani',sans-serif]">
                Your Station is Ready
              </h2>
              <p className="text-xs text-zinc-400">
                We have reserved your setup at Cosmos Gaming Mumbai, Bandra East.
              </p>
            </div>

            {/* Booking Details Card */}
            <div className="p-5 rounded-lg bg-zinc-950 border border-zinc-800 space-y-3 text-xs text-left max-w-md mx-auto">
              <div className="flex items-center justify-between border-b border-zinc-850 pb-2">
                <span className="text-zinc-400">Booking Reference:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-white">{confirmedBooking.bookingRef}</span>
                  <CopyButton text={confirmedBooking.bookingRef} label="Copy Ref" />
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Gamer Name:</span>
                <span className="font-semibold text-white">{confirmedBooking.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Zone & Station:</span>
                <span className="font-semibold text-white">
                  {confirmedBooking.zoneName} (Station #{confirmedBooking.stationNumber})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Date & Time:</span>
                <span className="font-semibold text-white">
                  {confirmedBooking.bookingDate} | {confirmedBooking.startTime} - {confirmedBooking.endTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Total Paid/Due:</span>
                <span className="font-bold text-white">₹{confirmedBooking.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Payment Status:</span>
                <span className="font-bold text-emerald-400 uppercase">{confirmedBooking.paymentStatus}</span>
              </div>
            </div>

            {/* Actions: Add to Calendar, WhatsApp, Directions, Dashboard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleDownloadCalendar}
                className="btn-liquid-secondary !text-xs !py-2.5 flex items-center justify-center gap-2"
              >
                <Download className="w-3.5 h-3.5 text-zinc-400" />
                <span>Add to Calendar (.ics)</span>
              </button>

              <a
                href={`https://wa.me/919769464603?text=Hi%20Cosmos%20Gaming%2C%20my%20booking%20reference%20is%20${confirmedBooking.bookingRef}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-liquid-secondary !text-xs !py-2.5 flex items-center justify-center gap-2"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp Notification</span>
              </a>

              <a
                href="https://maps.google.com/?q=Office+No+23+New+Shopping+Centre+Government+Colony+Bandra+East+Mumbai+400051"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-liquid-secondary !text-xs !py-2.5 flex items-center justify-center gap-2"
              >
                <Navigation className="w-3.5 h-3.5 text-zinc-400" />
                <span>Get Directions</span>
              </a>

              <button
                onClick={() => router.push("/dashboard")}
                className="btn-liquid-primary !text-xs !py-2.5 flex items-center justify-center gap-2"
              >
                <span>View in Dashboard</span>
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
