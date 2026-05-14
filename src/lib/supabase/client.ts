/**
 * Supabase Client - Browser
 * 
 * Creates a Supabase client for browser-side operations.
 */

import { createBrowserClient } from "@supabase/ssr";
import { DATABASE_URL } from "@/lib/constants";
import { ANON_KEY } from "@/lib/constants";

export function createSupabaseClient() {
  return createBrowserClient(DATABASE_URL, ANON_KEY);
}
