// @ts-nocheck
/**
 * Supabase Client Configuration
 * Server and client-side Supabase instances
 */

import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Browser client for client-side usage
export function createBrowserSupabaseClient() {
  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  );
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
