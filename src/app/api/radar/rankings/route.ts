import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

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
 * GET /api/radar/rankings
 * Returns a list of top opportunities
 * Query params:
 *   - horizon: 'short' | 'mid' | 'long' (default: all)
 *   - limit: number (default: 10, max: 50)
 *   - market: string (optional filter)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const horizon = searchParams.get('horizon');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10', 10), 50);
    const market = searchParams.get('market');

    // Build query
    let query = getSupabaseClient()
      .from('opportunities')
      .select('*')
      .eq('is_active', true)
      .order('score', { ascending: false })
      .limit(limit);

    // Apply horizon filter if provided
    if (horizon && ['short', 'mid', 'long'].includes(horizon)) {
      query = query.eq('horizon', horizon);
    }

    // Apply market filter if provided
    if (market) {
      query = query.ilike('market', `%${market}%`);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // Group by horizon for easier frontend consumption
    const typedData = data || [];
    const grouped = {
      short: typedData.filter((o: any) => o.horizon === 'short'),
      mid: typedData.filter((o: any) => o.horizon === 'mid'),
      long: typedData.filter((o: any) => o.horizon === 'long')
    };

    return NextResponse.json({
      success: true,
      opportunities: data || [],
      grouped,
      meta: {
        total: data?.length || 0,
        filters: { horizon, limit, market }
      }
    });

  } catch (error) {
    console.error('Error fetching rankings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch opportunities' },
      { status: 500 }
    );
  }
}
