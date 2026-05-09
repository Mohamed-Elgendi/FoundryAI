import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseClient } from '@/layer-3-data/storage/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: beliefs, error } = await supabase
      .from('belief_scores' as any)
      .select('*, evidence_stack(*)')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    const avgCrystallization = beliefs?.length > 0
      ? Math.round((beliefs as any[]).reduce((acc, b) => acc + (b.identity_crystallization || 0), 0) / beliefs.length)
      : 0;

    return NextResponse.json({
      beliefs: beliefs || [],
      stats: { totalBeliefs: beliefs?.length || 0, avgCrystallization }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch belief data' }, { status: 500 });
  }
}
