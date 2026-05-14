/**
 * Supabase Client - Middleware
 * 
 * Creates a Supabase client for middleware operations.
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { DATABASE_URL } from "@/lib/constants";
import { ANON_KEY } from "@/lib/constants";

export function createSupabaseMiddlewareClient(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  return {
    supabase: createServerClient(DATABASE_URL, ANON_KEY, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            request.cookies.set(name, value);
            supabaseResponse = NextResponse.next({
              request,
            });
            supabaseResponse.cookies.set(name, value, options);
          }
        },
      },
    }),
    response: supabaseResponse,
  };
}
