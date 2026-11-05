import { createClient, SupabaseClient } from "@supabase/supabase-js";

// SECURITY GUARD: Ensure this module is never bundled into or executed by the browser client
if (typeof window !== "undefined") {
  throw new Error(
    "SECURITY VIOLATION: src/lib/supabase.ts contains server secrets and cannot be imported in client-side code."
  );
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

/**
 * Checks if Supabase has been properly configured with actual credentials
 */
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  supabaseUrl.startsWith("http") &&
  !supabaseUrl.includes("your-project-id")
);

/**
 * Server-side Supabase Client instance (null if unconfigured)
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

export default supabase;
