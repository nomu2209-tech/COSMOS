import { NextResponse } from "next/server";
import db from "@/lib/db";
import { verifyPassword, createSessionToken, COOKIE_NAME } from "@/lib/auth";
import { enforceRateLimit } from "@/lib/rate-limit";
import { sanitizeString } from "@/lib/sanitize";

export async function POST(request: Request) {
  // 1. Enforce strict rate limit: 5 login attempts per minute per IP
  const rateLimitResponse = enforceRateLimit(request, {
    limit: 5,
    windowSeconds: 60,
    prefix: "auth_login",
  });
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await request.json();
    const rawIdentifier = body.identifier;
    const rawPassword = body.password;

    if (!rawIdentifier || !rawPassword || typeof rawPassword !== "string") {
      return NextResponse.json(
        { error: "Email or phone and password are required" },
        { status: 400 }
      );
    }

    const cleanIdentifier = sanitizeString(rawIdentifier, 150).toLowerCase();
    const cleanDigits = cleanIdentifier.replace(/\D/g, "");

    const user = await db.findOne(
      "users",
      (u) =>
        Boolean(u.email && u.email.toLowerCase() === cleanIdentifier) ||
        Boolean(cleanDigits.length >= 10 && u.phone && u.phone.replace(/\D/g, "").endsWith(cleanDigits.slice(-10)))
    );

    if (!user) {
      // Run dummy hash to prevent timing attack enumeration
      await verifyPassword(rawPassword, null);
      return NextResponse.json(
        { error: "Invalid email/phone or password." },
        { status: 401 }
      );
    }

    if (!user.passwordHash) {
      return NextResponse.json(
        { error: "This account was registered using Phone OTP. Please log in with OTP." },
        { status: 400 }
      );
    }

    const isValid = await verifyPassword(rawPassword, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email/phone or password." },
        { status: 401 }
      );
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
    console.error("Login Error:", error?.message || "Unknown");
    return NextResponse.json(
      { error: "Authentication failed. Please try again." },
      { status: 500 }
    );
  }
}
