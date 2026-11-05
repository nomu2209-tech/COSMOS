import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://smasvdcvqhvjgfgjlvwy.supabase.co";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_quLLbUc4eYd3DNZZN84YpQ_JZPlK9W8";

export const createClient = () =>
  createBrowserClient(
    supabaseUrl,
    supabaseKey,
  );

