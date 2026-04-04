import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseClient } from '@/layer-3-data/storage/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: quotients, error } = await supabase
      .from('confidence_quotients')
      .select('*')
      .eq('user_id', user.id)
      .order('cq_score', { ascending: false });

    if (error) throw error;

    const overallCQ = quotients?.length > 0
      ? Math.round(quotients.reduce((acc, q) => acc + (q.cq_score || 0), 0) / quotients.length)
      : 50;

    return NextResponse.json({ domains: quotients || [], overallCQ });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch confidence data' }, { status: 500 });
  }
}
