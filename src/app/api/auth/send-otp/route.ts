import { NextResponse } from "next/server";
import db from "@/lib/db";
import { generateOtp } from "@/lib/auth";
import { enforceRateLimit } from "@/lib/rate-limit";
import { sanitizePhone } from "@/lib/sanitize";
import { VerificationOtp } from "@/types";

export async function POST(request: Request) {
  // 1. Strict rate limit: 3 OTP requests per 10 minutes (600s) to prevent SMS bombing / brute force
  const rateLimitResponse = enforceRateLimit(request, {
    limit: 3,
    windowSeconds: 600,
    prefix: "auth_otp_send",
  });
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await request.json();
    const rawPhone = body.phone;

    const validatedPhone = sanitizePhone(rawPhone);
    if (!validatedPhone) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit mobile number." },
        { status: 400 }
      );
    }

    const otpCode = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

    const newOtp: VerificationOtp = {
      id: `otp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      identifier: validatedPhone,
      otpCode,
      type: "PHONE_LOGIN",
      expiresAt,
      createdAt: new Date().toISOString(),
    };

    await db.insert("verification_otps", newOtp);

    // SECURITY: Only return devOtp preview in local development when explicitly allowed.
    // In production, devOtp is NEVER returned.
    const isDevPreviewAllowed =
      process.env.NODE_ENV !== "production" &&
      process.env.ALLOW_DEV_OTP === "true";

    const responsePayload: Record<string, any> = {
      success: true,
      message: `OTP sent successfully to ${validatedPhone}`,
    };

    if (isDevPreviewAllowed) {
      responsePayload.devOtp = otpCode;
    }

    return NextResponse.json(responsePayload);
  } catch (error: any) {
    console.error("Send OTP Error:", error?.message || "Unknown");
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
