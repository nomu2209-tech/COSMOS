import { NextResponse } from "next/server";
import db from "@/lib/db";
import { hashPassword, createSessionToken, COOKIE_NAME } from "@/lib/auth";
import { enforceRateLimit } from "@/lib/rate-limit";
import { sanitizeString, sanitizeEmail, sanitizePhone } from "@/lib/sanitize";
import { User } from "@/types";

export async function POST(request: Request) {
  // 1. Rate limit registration attempts: 5 per 10 minutes to prevent bot account creation
  const rateLimitResponse = enforceRateLimit(request, {
    limit: 5,
    windowSeconds: 600,
    prefix: "auth_register",
  });
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await request.json();
    const { name, email, phone, password } = body;

    const sanitizedName = sanitizeString(name, 80);
    const validatedEmail = email ? sanitizeEmail(email) : null;
    const validatedPhone = phone ? sanitizePhone(phone) : null;

    if (!sanitizedName || (!validatedEmail && !validatedPhone)) {
      return NextResponse.json(
        { error: "Valid name and at least Email or Mobile Number are required" },
        { status: 400 }
      );
    }

    if (password && (typeof password !== "string" || password.length < 8)) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    if (validatedEmail) {
      const existingEmail = await db.findOne("users", (u) => u.email === validatedEmail);
      if (existingEmail) {
        return NextResponse.json(
          { error: "An account with this email address already exists" },
          { status: 400 }
        );
      }
    }

    if (validatedPhone) {
      const existingPhone = await db.findOne("users", (u) => u.phone === validatedPhone);
      if (existingPhone) {
        return NextResponse.json(
          { error: "An account with this mobile number already exists" },
          { status: 400 }
        );
      }
    }

    const passwordHash = password ? await hashPassword(password) : null;
    const newUser: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: sanitizedName,
      email: validatedEmail,
      phone: validatedPhone,
      passwordHash,
      role: "CUSTOMER",
      isEmailVerified: Boolean(validatedEmail),
      isPhoneVerified: Boolean(validatedPhone),
      cosmosXp: 100, // Welcome bonus XP
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.insert("users", newUser);

    const token = await createSessionToken({
      userId: newUser.id,
      role: newUser.role,
      name: newUser.name,
      phone: newUser.phone,
      email: newUser.email,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        cosmosXp: newUser.cosmosXp,
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
    console.error("Register Error:", error?.message || "Unknown");
    return NextResponse.json({ error: "Failed to register account" }, { status: 500 });
  }
}
