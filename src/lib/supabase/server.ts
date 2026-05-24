/**
 * Supabase Client - Server
 * 
 * Creates a Supabase client for server-side operations.
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { DATABASE_URL } from "@/lib/constants";
import { ANON_KEY } from "@/lib/constants";

export async function createSupabaseServerClient(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  return createServerClient(DATABASE_URL, ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
}

/** Create a Supabase client without cookies (for webhooks/server contexts) */
export async function createClient() {
  return createServerClient(DATABASE_URL, ANON_KEY, {
    cookies: {
      getAll() {
        return [];
      },
      setAll() {
        // No-op for webhook context
      },
    },
  });
}
