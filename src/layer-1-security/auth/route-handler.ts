/**
 * Route Handler Supabase Client
 * Helper for creating Supabase client in API routes
 */

import { createRouteHandlerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export function createRouteHandlerSupabaseClient() {
  const cookieStore = cookies();

  return createRouteHandlerClient(
    { cookies: () => cookieStore },
    {
      supabaseUrl,
      supabaseKey: supabaseAnonKey,
    }
  );
}
