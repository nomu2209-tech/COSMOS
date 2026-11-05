import { NextResponse } from "next/server";
import db from "@/lib/db";
import { createSessionToken, COOKIE_NAME } from "@/lib/auth";
import { enforceRateLimit } from "@/lib/rate-limit";
import { sanitizePhone, sanitizeString } from "@/lib/sanitize";
import { User } from "@/types";

export async function POST(request: Request) {
  // 1. Rate limit verification attempts: 5 attempts per 5 minutes to prevent OTP brute-forcing
  const rateLimitResponse = enforceRateLimit(request, {
    limit: 5,
    windowSeconds: 300,
    prefix: "auth_otp_verify",
  });
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { phone, otp, name } = await request.json();

    const validatedPhone = sanitizePhone(phone);
    if (!validatedPhone) {
      return NextResponse.json(
        { error: "Valid mobile number is required" },
        { status: 400 }
      );
    }

    if (!otp || typeof otp !== "string" || otp.trim().length !== 6) {
      return NextResponse.json(
        { error: "Please enter a valid 6-digit OTP code" },
        { status: 400 }
      );
    }

    const cleanOtp = otp.trim();

    // Find valid OTP record
    const otpRecord = await db.findOne(
      "verification_otps",
      (o) =>
        o.identifier === validatedPhone &&
        o.otpCode === cleanOtp &&
        new Date(o.expiresAt) > new Date()
    );

    if (!otpRecord) {
      return NextResponse.json(
        { error: "Invalid or expired OTP code. Please request a new code." },
        { status: 400 }
      );
    }

    // Immediately delete used OTP to prevent replay attacks
    await db.delete("verification_otps", otpRecord.id);

    // Check if user already exists
    let user = await db.findOne("users", (u) => u.phone === validatedPhone);

    if (!user) {
      // Auto register user if new
      const sanitizedName = sanitizeString(name, 80) || `Gamer ${validatedPhone.slice(-4)}`;
      user = {
        id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: sanitizedName,
        email: null,
        phone: validatedPhone,
        passwordHash: null,
        role: "CUSTOMER",
        isEmailVerified: false,
        isPhoneVerified: true,
        cosmosXp: 100, // Welcome XP
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await db.insert("users", user);
    } else {
      if (!user.isPhoneVerified) {
        await db.update("users", user.id, { isPhoneVerified: true });
        user.isPhoneVerified = true;
      }
    }

    const token = await createSessionToken({
      userId: user.id,
      role: user.role,
      name: user.name,
      phone: user.phone,
      email: user.email,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        cosmosXp: user.cosmosXp,
      },
    });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Verify OTP Error:", error?.message || "Unknown");
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 });
  }
}
