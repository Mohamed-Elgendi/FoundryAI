import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseClient } from '@/layer-3-data/storage/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = new Date().toISOString().split('T')[0];
    
    const { data: checkins, error } = await supabase
      .from('emotion_checkins')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', today)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ data: checkins });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch emotion data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { current_state, intensity, trigger, transition_target } = body;

    const { data, error } = await supabase
      .from('emotion_checkins')
      .insert({
        user_id: user.id,
        current_state,
        intensity,
        trigger,
        transition_target,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to log emotion checkin' }, { status: 500 });
  }
}
