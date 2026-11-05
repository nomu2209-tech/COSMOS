import { NextResponse } from "next/server";
import db from "@/lib/db";
import { enforceRateLimit } from "@/lib/rate-limit";
import { sanitizeString, sanitizeRating } from "@/lib/sanitize";
import { Review } from "@/types";

export async function POST(request: Request) {
  // 1. Rate limit review submissions: 3 per 10 minutes to prevent review spam / DoS
  const rateLimitResponse = enforceRateLimit(request, {
    limit: 3,
    windowSeconds: 600,
    prefix: "review_submit",
  });
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await request.json();
    const rawAuthor = body.authorName;
    const rawRating = body.rating;
    const rawComment = body.comment;
    const rawGame = body.gamePlayed;

    const authorName = sanitizeString(rawAuthor, 60);
    const comment = sanitizeString(rawComment, 400);
    const gamePlayed = rawGame ? sanitizeString(rawGame, 50) : null;
    const rating = sanitizeRating(rawRating, 1, 5);

    if (!authorName || !comment) {
      return NextResponse.json(
        { error: "Author name and review comments are required." },
        { status: 400 }
      );
    }

    const newReview: Review = {
      id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      authorName,
      rating,
      comment,
      gamePlayed,
      isVerified: false,
      status: "APPROVED",
      createdAt: new Date().toISOString(),
    };

    await db.insert("reviews", newReview);

    return NextResponse.json({
      success: true,
      message: "Thank you! Your feedback has been verified and recorded.",
      review: newReview,
    });
  } catch (error: any) {
    console.error("Review Submit Error:", error?.message || "Unknown");
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
