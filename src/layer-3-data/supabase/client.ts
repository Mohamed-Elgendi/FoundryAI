/**
 * Supabase Client Configuration
 * Server and client-side Supabase instances
 */

import { createClient } from '@supabase/supabase-js';
import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Browser client (for client-side)
export const createBrowserSupabaseClient = () => {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};

// Server client (for server components)
export const createServerSupabaseClient = async () => {
  const cookieStore = await cookies();
  
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll().map(c => ({ name: c.name, value: c.value }));
      },
      setAll(cookiesToSet) {
        // Note: In server components, we can't set cookies
        // This is handled by middleware
      },
    },
  });
};

// Admin client (for server-side operations requiring elevated privileges)
export const createAdminSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

// Simple client for non-auth operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
