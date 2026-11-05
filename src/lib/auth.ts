import crypto from "crypto";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import db from "./db";
import { User } from "@/types";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "cosmos-gaming-mumbai-secret-key-2026-ultra-secure"
);
const COOKIE_NAME = "cosmos_session";

// BCRYPT SALT ROUNDS: 12 rounds for strong brute-force resistance
const BCRYPT_ROUNDS = 12;

// Dummy hash for timing attack mitigation on non-existent users
const DUMMY_HASH =
  "$2a$12$e8Yk1hE6s3G7q.8hF3q8yeN6lM9iV8wD3kP2gJ5bT4rC7vX0zW1mK";

/**
 * Hash password securely with bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

/**
 * Verify password with constant-time comparison
 */
export async function verifyPassword(
  password: string,
  hash?: string | null
): Promise<boolean> {
  if (!hash) {
    // Run comparison against dummy hash to prevent timing attack enumeration
    await bcrypt.compare(password, DUMMY_HASH);
    return false;
  }
  return bcrypt.compare(password, hash);
}

/**
 * Create signed JWT session token with 30-day expiration
 */
export async function createSessionToken(payload: {
  userId: string;
  role: string;
  name: string;
  phone?: string | null;
  email?: string | null;
}): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(JWT_SECRET);
}

/**
 * Verify signed JWT session token
 */
export async function verifySessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as {
      userId: string;
      role: string;
      name: string;
      phone?: string | null;
      email?: string | null;
    };
  } catch {
    return null;
  }
}

/**
 * Generate cryptographically secure 6-digit OTP code using Node crypto
 */
export function generateOtp(): string {
  // Uses CSPRNG instead of Math.random to prevent prediction attacks
  return crypto.randomInt(100000, 1000000).toString();
}

/**
 * Get currently authenticated user from HTTP cookie
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = await verifySessionToken(token);
    if (!payload?.userId) return null;

    const user = await db.findOne("users", (u) => u.id === payload.userId);
    return user || null;
  } catch {
    return null;
  }
}

/**
 * Helper to ensure user is logged in with ADMIN privileges
 */
export async function getAdminUser(): Promise<User | null> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return null;
  }
  return user;
}

export { COOKIE_NAME };
