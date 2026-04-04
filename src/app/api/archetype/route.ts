import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseClient } from '@/layer-3-data/storage/supabase-client';

const ARCHETYPES = [
  'The_Problem_Solver', 'The_Creative_Artisan', 'The_Community_Builder',
  'The_Knowledge_Sharer', 'The_Digital_Nomad', 'The_Local_Champion',
  'The_Sustainability_Pioneer', 'The_Health_Wellness_Guide',
  'The_Tech_Innovator', 'The_Cultural_Bridge', 'The_Family_Business_Owner',
  'The_Retirement_Reinventor'
];

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile, error } = await supabase
      .from('archetype_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    return NextResponse.json({
      profile: profile || null,
      allArchetypes: ARCHETYPES,
      hasProfile: !!profile
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch archetype profile' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { primary_archetype, secondary_archetype, archetype_score } = body;

    const { data, error } = await supabase
      .from('archetype_profiles')
      .upsert({
        user_id: user.id,
        primary_archetype,
        secondary_archetype,
        archetype_score,
        discovered_at: new Date().toISOString()
      }, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save archetype profile' }, { status: 500 });
  }
}
