import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  
  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  try {
    const { data: sessions, error } = await supabase
      .from('focus_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('start_time', { ascending: false })
      .limit(50);

    if (error) throw error;

    // Calculate focus score
    const today = new Date().toISOString().split('T')[0];
    const todaySessions = sessions?.filter(s => s.start_time?.startsWith(today)) || [];
    const avgFocusScore = todaySessions.length > 0 
      ? Math.round(todaySessions.reduce((acc, s) => acc + (s.focus_score || 0), 0) / todaySessions.length)
      : 0;

    const { data: distractions } = await supabase
      .from('distraction_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', today)
      .eq('blocked', true);

    return NextResponse.json({
      sessions: sessions || [],
      stats: {
        focusScore: avgFocusScore,
        sessionsToday: todaySessions.length,
        distractionsBlocked: distractions?.length || 0,
        totalFocusMinutes: todaySessions.reduce((acc, s) => acc + (s.duration_minutes || 0), 0)
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch focus data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, duration_minutes, focus_score, interruptions_count, goal_achieved, notes } = body;

    const { data, error } = await supabase
      .from('focus_sessions')
      .insert({
        user_id,
        duration_minutes,
        focus_score,
        interruptions_count,
        goal_achieved,
        notes,
        start_time: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to log focus session' }, { status: 500 });
  }
}
