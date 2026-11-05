import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "cosmos_session";
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "cosmos-gaming-mumbai-secret-key-2026-ultra-secure"
);

interface SessionPayload {
  userId: string;
  role: string;
  name: string;
  phone?: string | null;
  email?: string | null;
}

async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  // 1. Protect Admin API routes (/api/admin/*)
  if (pathname.startsWith("/api/admin")) {
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required. Missing session cookie." },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: "Invalid or expired session. Please log in again." },
        { status: 401 }
      );
    }

    if (payload.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Administrator privileges required." },
        { status: 403 }
      );
    }

    // Attach verified user info to headers for downstream handlers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", payload.userId);
    requestHeaders.set("x-user-role", payload.role);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // 2. Protect Admin Frontend Pages (/admin/*)
  if (pathname.startsWith("/admin")) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const payload = await verifyToken(token);
    if (!payload) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete(COOKIE_NAME);
      return response;
    }

    if (payload.role !== "ADMIN") {
      // Authenticated but not an admin -> redirect to customer dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // 3. Protect Customer Dashboard (/dashboard/*)
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const payload = await verifyToken(token);
    if (!payload) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete(COOKIE_NAME);
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/dashboard/:path*",
  ],
};
