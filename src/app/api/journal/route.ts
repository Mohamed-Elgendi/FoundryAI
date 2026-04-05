import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseClient } from '@/layer-3-data/storage/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: entries, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(30);

    if (error) throw error;
    return NextResponse.json({ entries: entries || [] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch journal entries' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { entry_type, content, mood_rating, affirmations_used } = body;

    const insertData = {
      user_id: user.id,
      entry_type,
      content,
      mood_rating,
      affirmations_used,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('journal_entries' as any)
      .insert(insertData as any)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create journal entry' }, { status: 500 });
  }
}
