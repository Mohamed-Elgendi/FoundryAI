import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Browser/client-side singleton
let browserClient: SupabaseClient<Database> | null = null;

/**
 * Get Supabase client for browser (singleton pattern)
 */
export function getSupabaseBrowserClient(): SupabaseClient<Database> {
  if (browserClient) return browserClient;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }
  
  browserClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  });
  
  return browserClient;
}

/**
 * Create fresh Supabase client (server-side use)
 */
export function createSupabaseClient(): SupabaseClient<Database> {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }
  
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: false,
    },
  });
}

/**
 * Create service role client (admin operations only)
 */
export function createServiceClient(): SupabaseClient<Database> {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase service role key');
  }
  
  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Store user feedback
 */
export async function storeFeedback(data: {
  userId: string;
  type: 'bug' | 'feature' | 'general';
  message: string;
  rating?: number;
}): Promise<{ success: boolean; error?: string }> {
  const supabase = createSupabaseClient();
  const { error } = await supabase.from('feedback').insert({
    user_id: data.userId,
    type: data.type,
    message: data.message,
    rating: data.rating,
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error('Error storing feedback:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Get feedback statistics
 */
export async function getFeedbackStats(): Promise<{
  total: number;
  byType: Record<string, number>;
  averageRating: number;
}> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('feedback')
    .select('type, rating');

  if (error) {
    console.error('Error getting feedback stats:', error);
    return { total: 0, byType: {}, averageRating: 0 };
  }

  const total = data?.length || 0;
  const byType: Record<string, number> = {};
  let ratingSum = 0;
  let ratingCount = 0;

  data?.forEach((item) => {
    byType[item.type] = (byType[item.type] || 0) + 1;
    if (item.rating) {
      ratingSum += item.rating;
      ratingCount++;
    }
  });

  return {
    total,
    byType,
    averageRating: ratingCount > 0 ? ratingSum / ratingCount : 0,
  };
}

/**
 * Get successful patterns for AI context
 */
export async function getSuccessfulPatterns(limit: number = 50): Promise<{
  patterns: Array<{
    id: string;
    type: string;
    prompt: string;
    response: string;
    rating: number;
    created_at: string;
  }>;
  error?: string;
}> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('ai_interactions')
    .select('id, type, prompt, response, rating, created_at')
    .eq('successful', true)
    .order('rating', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error getting successful patterns:', error);
    return { patterns: [], error: error.message };
  }

  return { patterns: data || [] };
}
