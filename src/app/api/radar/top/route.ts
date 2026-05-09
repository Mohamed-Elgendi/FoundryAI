import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Lazy initialization - only create client when needed
let supabase: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  if (!supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }
    
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }
  return supabase;
}

/**
 * GET /api/radar/top
 * Returns the single best opportunity (short-term, highest score)
 */
export async function GET() {
  try {
    const { data, error } = await getSupabaseClient()
      .from('opportunities')
      .select('*')
      .eq('is_active', true)
      .eq('horizon', 'short')
      .order('score', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      // If no rows found, try without horizon filter
      if (error.code === 'PGRST116') {
        const { data: fallbackData, error: fallbackError } = await getSupabaseClient()
          .from('opportunities')
          .select('*')
          .eq('is_active', true)
          .order('score', { ascending: false })
          .limit(1)
          .single();
        
        if (fallbackError) {
          return NextResponse.json(
            { success: false, error: 'No opportunities found' },
            { status: 404 }
          );
        }
        
        return NextResponse.json({
          success: true,
          data: fallbackData
        });
      }
      
      throw error;
    }

    return NextResponse.json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Error fetching top opportunity:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch opportunity' },
      { status: 500 }
    );
  }
}
