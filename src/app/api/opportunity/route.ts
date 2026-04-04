import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseClient } from '@/layer-3-data/storage/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = supabase
      .from('opportunity_radar')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);

    const { data: opportunities, error } = await query;

    if (error) throw error;

    // Calculate stats
    const stats = {
      total: opportunities?.length || 0,
      discovered: opportunities?.filter(o => o.status === 'discovered').length || 0,
      validated: opportunities?.filter(o => o.status === 'validated').length || 0,
      avgFitScore: opportunities?.length > 0
        ? Math.round(opportunities.reduce((acc, o) => acc + (o.archetype_fit_score || 0), 0) / opportunities.length)
        : 0
    };

    return NextResponse.json({ opportunities: opportunities || [], stats });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch opportunities' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const {
      opportunity_title,
      description,
      market_size,
      competition_level,
      time_to_revenue,
      startup_costs,
      archetype_fit_score,
      source
    } = body;

    const { data, error } = await supabase
      .from('opportunity_radar')
      .insert({
        user_id: user.id,
        opportunity_title,
        description,
        market_size,
        competition_level,
        time_to_revenue,
        startup_costs,
        archetype_fit_score,
        source,
        status: 'discovered',
        is_validated: false,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create opportunity' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = createSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { id, status, is_validated } = body;

    const { data, error } = await supabase
      .from('opportunity_radar')
      .update({ status, is_validated, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update opportunity' }, { status: 500 });
  }
}
