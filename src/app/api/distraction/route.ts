import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseClient } from '@/layer-3-data/storage/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const today = new Date().toISOString().split('T')[0];
    
    const [{ data: logs }, { data: fortress }] = await Promise.all([
      supabase.from('distraction_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', today)
        .order('created_at', { ascending: false }),
      supabase.from('digital_fortress_settings')
        .select('*')
        .eq('user_id', user.id)
        .single()
    ]);

    const stats = {
      attemptsToday: logs?.length || 0,
      blockedCount: logs?.filter(l => l.blocked).length || 0,
      byLayer: {
        1: logs?.filter(l => l.defense_layer === 1).length || 0,
        2: logs?.filter(l => l.defense_layer === 2).length || 0,
        3: logs?.filter(l => l.defense_layer === 3).length || 0,
        4: logs?.filter(l => l.defense_layer === 4).length || 0,
        5: logs?.filter(l => l.defense_layer === 5).length || 0
      }
    };

    return NextResponse.json({ logs: logs || [], fortress: fortress || null, stats });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch distraction data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { distraction_type, source, intensity, blocked, defense_layer } = body;

    const { data, error } = await supabase
      .from('distraction_logs')
      .insert({
        user_id: user.id,
        distraction_type,
        source,
        intensity,
        blocked,
        defense_layer,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to log distraction' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { website_blocklist, app_blocklist, notification_settings } = body;

    const { data, error } = await supabase
      .from('digital_fortress_settings')
      .upsert({
        user_id: user.id,
        website_blocklist,
        app_blocklist,
        notification_settings,
        last_updated: new Date().toISOString()
      }, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update fortress settings' }, { status: 500 });
  }
}
