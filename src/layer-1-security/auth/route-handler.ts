/**
 * Route Handler Supabase Client
 * Helper for creating Supabase client in API routes
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export function createRouteHandlerSupabaseClient() {
  const cookieStore = cookies();

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: (cookies) => { cookies.forEach((c) => cookieStore.set(c)); } } }
  );
}
