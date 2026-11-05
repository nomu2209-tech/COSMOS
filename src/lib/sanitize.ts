/**
 * Cosmos Security & Sanitization Utilities
 * Protects against Cross-Site Scripting (XSS), SQL/NoSQL injection, and malformed inputs.
 */

/**
 * Strips dangerous HTML tags, attributes, and script injection vectors from string input.
 */
export function sanitizeString(input: unknown, maxLength: number = 500): string {
  if (typeof input !== "string") {
    return "";
  }

  return input
    .trim()
    .slice(0, maxLength)
    // Strip script and style blocks entirely
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    // Strip HTML tags
    .replace(/<[^>]+>/g, "")
    // Remove javascript: and data: URIs
    .replace(/javascript:/gi, "")
    .replace(/data:text\/html/gi, "")
    // Strip inline event attributes like onload=, onerror=, etc.
    .replace(/on\w+\s*=/gi, "")
    // Normalize basic HTML entities
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

/**
 * Validates and normalizes phone number
 */
export function sanitizePhone(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const digits = input.replace(/\D/g, "");
  // Support 10 digit Indian mobiles or with country code 91
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+${digits}`;
  }
  return null;
}

/**
 * Validates and normalizes email address
 */
export function sanitizeEmail(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const trimmed = input.trim().toLowerCase().slice(0, 150);
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(trimmed) ? trimmed : null;
}

/**
 * Clamps numeric ratings between min and max
 */
export function sanitizeRating(input: unknown, min = 1, max = 5): number {
  const num = typeof input === "number" ? input : parseInt(String(input), 10);
  if (isNaN(num)) return min;
  return Math.max(min, Math.min(max, num));
}

/**
 * Sanitizes an object of key-value pairs recursively
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      result[key] = sanitizeString(value);
    } else if (Array.isArray(value)) {
      result[key] = value.map((item) =>
        typeof item === "string" ? sanitizeString(item) : item
      );
    } else if (typeof value === "object" && value !== null) {
      result[key] = sanitizeObject(value);
    } else {
      result[key] = value;
    }
  }
  return result as T;
}

