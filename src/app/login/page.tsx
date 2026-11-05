"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import {
  Gamepad2,
  Mail,
  Phone,
  Lock,
  User,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Monitor,
  Coffee,
  Wifi,
  Cpu,
  Radio,
  Loader2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  const [mode, setMode] = useState<"LOGIN" | "SIGNUP">("LOGIN");
  const [loginMethod, setLoginMethod] = useState<"EMAIL" | "PHONE">("EMAIL");

  // Form Fields
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState(""); // Email or Phone
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Phone OTP Flow
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [devOtpPreview, setDevOtpPreview] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      if (user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }
  }, [user, router]);

  // Handle Email + Password Login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Login failed");
      } else {
        await refreshUser();
        if (data.user?.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      }
    } catch {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: identifier || phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Failed to send OTP");
      } else {
        setOtpSent(true);
        setDevOtpPreview(data.devOtp);
        setSuccessMessage(data.message);
      }
    } catch {
      setErrorMessage("Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: identifier || phone,
          otp: otpCode,
          name: name || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Invalid OTP code");
      } else {
        await refreshUser();
        router.push("/dashboard");
      }
    } catch {
      setErrorMessage("Failed to verify OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Signup failed");
      } else {
        await refreshUser();
        router.push("/dashboard");
      }
    } catch {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Demo Auto-Fill Helpers
  const fillAdmin = () => {
    setMode("LOGIN");
    setLoginMethod("EMAIL");
    setIdentifier("admin@cosmosgaming.com");
    setPassword("AdminCosmos2026!");
    setErrorMessage(null);
  };

  const fillGamer = () => {
    setMode("LOGIN");
    setLoginMethod("EMAIL");
    setIdentifier("aryan@gamer.com");
    setPassword("GamerPass123!");
    setErrorMessage(null);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 relative">
      {/* Background ambient texture */}
      <div className="absolute inset-0 bg-[#121212] -z-20" />
      <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-40 -z-10 pointer-events-none" />

      {/* Main Split Card: Visual Animation Hub on Left, Modern Form on Right */}
      <div className="w-full max-w-5xl rounded-2xl border border-zinc-800 bg-zinc-900/90 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 backdrop-blur-xl transition-all">
        
        {/* ================================================================= */}
        {/* LEFT COLUMN: COSMOS ESPORTS & CAFE TACTICAL RADAR VISUAL HUB     */}
        {/* ================================================================= */}
        <div className="lg:col-span-5 relative bg-zinc-950 border-b lg:border-b-0 lg:border-r border-zinc-800 p-8 flex flex-col justify-between overflow-hidden min-h-[380px] lg:min-h-[620px]">
          
          {/* Authentic venue photography backdrop with deep charcoal scrim */}
          <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-luminosity">
            <Image
              src="/images/ambient-seating.jpg"
              alt="Cosmos Gaming Lounge Ambience"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/95 via-[#121212]/80 to-[#121212]/98 pointer-events-none" />

          {/* Top Brand & Sector Header */}
          <div className="relative z-10 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-[#ea580c] flex items-center justify-center text-white shadow-md shadow-orange-950/40 group-hover:scale-105 transition-transform">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-sm font-black tracking-widest uppercase text-white font-['Space_Grotesk',sans-serif]">
                  COSMOS
                </span>
                <span className="block text-[10px] tracking-wider text-zinc-400 font-mono">
                  ESPORTS & CAFE
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900/90 border border-zinc-800 text-[11px] font-mono text-zinc-300">
              <Radio className="w-3 h-3 text-[#ea580c] animate-pulse" />
              <span>LIVE HUB</span>
            </div>
          </div>

          {/* Center Tactical Radar & Station Orbit Display */}
          <div className="relative z-10 my-auto py-8 flex items-center justify-center">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
              
              {/* Outer Radar Ring */}
              <div className="absolute inset-0 rounded-full border border-dashed border-[#ea580c]/30 animate-radar-pulse" />
              
              {/* Middle Range Ring */}
              <div className="absolute inset-6 rounded-full border border-zinc-800" />
              
              {/* Inner Focus Ring */}
              <div className="absolute inset-14 rounded-full border border-zinc-800/80" />

              {/* Crosshair Axes */}
              <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
              <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-zinc-800 to-transparent" />

              {/* Rotating Radar Sweep Line with Burnt Orange Beam */}
              <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none animate-radar-sweep">
                <div
                  className="w-full h-full"
                  style={{
                    background:
                      "conic-gradient(from 0deg, transparent 0deg, transparent 280deg, rgba(234, 88, 12, 0.22) 360deg)",
                  }}
                />
              </div>

              {/* Pulsing center signal ping */}
              <div className="absolute w-12 h-12 rounded-full bg-[#ea580c]/20 animate-signal-ping pointer-events-none" />

              {/* Center Core Emblem */}
              <div className="relative z-20 w-14 h-14 rounded-full bg-zinc-900 border border-[#ea580c] shadow-[0_0_20px_rgba(234,88,12,0.35)] flex flex-col items-center justify-center text-white">
                <Gamepad2 className="w-5 h-5 text-[#ea580c]" />
                <span className="text-[8px] font-mono font-bold text-zinc-300 tracking-wider">
                  HUB
                </span>
              </div>

              {/* Orbiting Station Pods Container */}
              <div className="absolute inset-0 animate-orbit-cw pointer-events-none">
                
                {/* Station 01: RTX 4090 Arena (Top 0°) */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 pointer-events-auto">
                  <div className="animate-orbit-ccw">
                    <div className="px-2.5 py-1.5 rounded-lg bg-zinc-900/95 border border-zinc-700/80 shadow-lg backdrop-blur-md flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-[#ea580c]" />
                      <div className="text-left">
                        <p className="text-[10px] font-bold text-zinc-100 uppercase tracking-wide leading-none">
                          RTX 4090
                        </p>
                        <p className="text-[8px] font-mono text-zinc-400 leading-none mt-0.5">
                          240Hz OLED
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Station 02: Artisan Roastery (Right 90°) */}
                <div className="absolute top-1/2 -right-4 -translate-y-1/2 pointer-events-auto">
                  <div className="animate-orbit-ccw">
                    <div className="px-2.5 py-1.5 rounded-lg bg-zinc-900/95 border border-zinc-700/80 shadow-lg backdrop-blur-md flex items-center gap-1.5">
                      <Coffee className="w-3.5 h-3.5 text-[#ea580c]" />
                      <div className="text-left">
                        <p className="text-[10px] font-bold text-zinc-100 uppercase tracking-wide leading-none">
                          Espresso
                        </p>
                        <p className="text-[8px] font-mono text-zinc-400 leading-none mt-0.5">
                          Single Origin
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Station 03: PS5 Pro Lounge (Bottom 180°) */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 pointer-events-auto">
                  <div className="animate-orbit-ccw">
                    <div className="px-2.5 py-1.5 rounded-lg bg-zinc-900/95 border border-zinc-700/80 shadow-lg backdrop-blur-md flex items-center gap-1.5">
                      <Monitor className="w-3.5 h-3.5 text-[#ea580c]" />
                      <div className="text-left">
                        <p className="text-[10px] font-bold text-zinc-100 uppercase tracking-wide leading-none">
                          PS5 Pro
                        </p>
                        <p className="text-[8px] font-mono text-zinc-400 leading-none mt-0.5">
                          4K 120 FPS
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Station 04: Gigabit Fiber Link (Left 270°) */}
                <div className="absolute top-1/2 -left-4 -translate-y-1/2 pointer-events-auto">
                  <div className="animate-orbit-ccw">
                    <div className="px-2.5 py-1.5 rounded-lg bg-zinc-900/95 border border-zinc-700/80 shadow-lg backdrop-blur-md flex items-center gap-1.5">
                      <Wifi className="w-3.5 h-3.5 text-[#ea580c]" />
                      <div className="text-left">
                        <p className="text-[10px] font-bold text-zinc-100 uppercase tracking-wide leading-none">
                          Fiber
                        </p>
                        <p className="text-[8px] font-mono text-zinc-400 leading-none mt-0.5">
                          &lt; 2ms Ping
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Bottom Live Venue Telemetry HUD */}
          <div className="relative z-10 pt-4 border-t border-zinc-850/80 grid grid-cols-2 gap-3 text-[11px] font-mono text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>STATIONS: 32 ACTIVE</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ea580c]" />
              <span>BANDRA EAST, MUMBAI</span>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* RIGHT COLUMN: MODERN AUTH FORM (SIGN IN / CREATE ACCOUNT)        */}
        {/* ================================================================= */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
          <div className="space-y-6">
            
            {/* Form Title & Subtitle */}
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-zinc-800 text-zinc-300 text-[11px] font-medium border border-zinc-700">
                <span>MEMBER PORTAL</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wide text-white font-['Space_Grotesk',sans-serif]">
                {mode === "LOGIN" ? "Welcome Back" : "Create Account"}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400">
                {mode === "LOGIN"
                  ? "Sign in to reserve gaming stations, order food, and view passes."
                  : "Register your customer profile to book slots instantly."}
              </p>
            </div>

            {/* Segmented Mode Switcher: Sign In vs Create Account */}
            <div className="grid grid-cols-2 gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
              <button
                type="button"
                onClick={() => {
                  setMode("LOGIN");
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`py-2 rounded-md text-xs font-bold tracking-wider uppercase transition-all ${
                  mode === "LOGIN"
                    ? "bg-zinc-800 text-white shadow border border-zinc-700"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("SIGNUP");
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`py-2 rounded-md text-xs font-bold tracking-wider uppercase transition-all ${
                  mode === "SIGNUP"
                    ? "bg-zinc-800 text-white shadow border border-zinc-700"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Feedback Notifications */}
            {errorMessage && (
              <div className="p-3.5 rounded-lg bg-rose-950/70 border border-rose-500/60 text-xs text-rose-200 flex items-start gap-2.5 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-rose-100">Authentication Error</p>
                  <p className="text-[11px] text-rose-300/90 mt-0.5">{errorMessage}</p>
                </div>
              </div>
            )}

            {successMessage && (
              <div className="p-3.5 rounded-lg bg-emerald-950/70 border border-emerald-500/60 text-xs text-emerald-200 flex items-start gap-2.5 animate-in fade-in duration-150">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-emerald-100">Success</p>
                  <p className="text-[11px] text-emerald-300/90 mt-0.5">{successMessage}</p>
                </div>
              </div>
            )}

            {/* Dev OTP Helper Banner */}
            {devOtpPreview && (
              <div className="p-3 rounded-lg bg-zinc-800/90 border border-zinc-700 text-xs text-zinc-300 flex items-center justify-between">
                <span className="font-medium">Demo OTP Code:</span>
                <span className="font-mono font-bold text-sm bg-zinc-950 px-2.5 py-0.5 rounded text-white tracking-widest border border-zinc-700">
                  {devOtpPreview}
                </span>
              </div>
            )}

            {/* ==================== LOGIN FORM ==================== */}
            {mode === "LOGIN" && (
              <div className="space-y-4">
                {/* Method Switcher Tabs: Email vs Phone OTP */}
                <div className="flex items-center gap-4 border-b border-zinc-800 pb-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMethod("EMAIL");
                      setOtpSent(false);
                      setErrorMessage(null);
                    }}
                    className={`pb-1 font-semibold transition-all relative ${
                      loginMethod === "EMAIL"
                        ? "text-white font-bold"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    Email & Password
                    {loginMethod === "EMAIL" && (
                      <span className="absolute bottom-[-9px] left-0 right-0 h-[2px] bg-[#ea580c]" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMethod("PHONE");
                      setOtpSent(false);
                      setErrorMessage(null);
                    }}
                    className={`pb-1 font-semibold transition-all relative ${
                      loginMethod === "PHONE"
                        ? "text-white font-bold"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    Phone OTP
                    {loginMethod === "PHONE" && (
                      <span className="absolute bottom-[-9px] left-0 right-0 h-[2px] bg-[#ea580c]" />
                    )}
                  </button>
                </div>

                {loginMethod === "EMAIL" ? (
                  <form onSubmit={handleEmailLogin} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                        Email Address or Phone
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          placeholder="admin@cosmosgaming.com or mobile"
                          className="w-full bg-zinc-950/90 border border-zinc-800 rounded-lg px-3 py-2.5 pl-9 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] transition-colors"
                        />
                        <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold text-zinc-300">
                          Password
                        </label>
                      </div>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-zinc-950/90 border border-zinc-800 rounded-lg px-3 py-2.5 pl-9 pr-10 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] transition-colors"
                        />
                        <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          className="absolute right-3 top-3 text-zinc-400 hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 px-4 rounded-lg bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-orange-950/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Signing in...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In to Cosmos</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                ) : !otpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                        10-Digit Mobile Number
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          required
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full bg-zinc-950/90 border border-zinc-800 rounded-lg px-3 py-2.5 pl-9 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] transition-colors"
                        />
                        <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 px-4 rounded-lg bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-orange-950/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sending OTP...</span>
                        </>
                      ) : (
                        <>
                          <span>Get 6-Digit OTP</span>
                          <KeyRound className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                        Enter 6-Digit OTP Code
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="123456"
                        className="w-full bg-zinc-950/90 border border-zinc-800 rounded-lg px-3 py-2.5 text-center font-mono text-lg tracking-widest text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] transition-colors"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 px-4 rounded-lg bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-orange-950/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Verifying OTP...</span>
                        </>
                      ) : (
                        <>
                          <span>Verify & Enter Cosmos</span>
                          <ShieldCheck className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        className="text-xs text-zinc-400 hover:text-white underline"
                      >
                        Change Phone Number
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* ==================== SIGNUP FORM ==================== */}
            {mode === "SIGNUP" && (
              <form onSubmit={handleSignup} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-zinc-950/90 border border-zinc-800 rounded-lg px-3 py-2.5 pl-9 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] transition-colors"
                    />
                    <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Mobile Number *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-zinc-950/90 border border-zinc-800 rounded-lg px-3 py-2.5 pl-9 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] transition-colors"
                    />
                    <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rahul@gmail.com"
                      className="w-full bg-zinc-950/90 border border-zinc-800 rounded-lg px-3 py-2.5 pl-9 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] transition-colors"
                    />
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showSignupPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-zinc-950/90 border border-zinc-800 rounded-lg px-3 py-2.5 pl-9 pr-10 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] transition-colors"
                    />
                    <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      aria-label={showSignupPassword ? "Hide password" : "Show password"}
                      className="absolute right-3 top-3 text-zinc-400 hover:text-white transition-colors"
                    >
                      {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-lg bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-orange-950/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating Profile...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

          </div>

          {/* Bottom Security Assurance & Access Notice */}
          <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
            <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[10px]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#ea580c]" />
              <span>SECURE 256-BIT ENCRYPTED SESSION</span>
            </div>
            <Link
              href="/privacy"
              className="text-zinc-500 hover:text-zinc-300 text-[10px] underline transition-colors"
            >
              Privacy & Security
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
