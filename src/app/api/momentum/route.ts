import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseClient } from '@/layer-3-data/storage/supabase-client';

const MOMENTUM_DIMENSIONS = [
  'Financial', 'Social', 'Physical', 'Mental', 'Educational', 'Professional', 'Spiritual'
];

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all momentum dimensions for user
    const { data: dimensions, error } = await supabase
      .from('momentum_dimensions')
      .select('*')
      .eq('user_id', user.id);

    if (error) throw error;

    // Initialize missing dimensions
    const existingDims = new Set(dimensions?.map(d => d.dimension) || []);
    const missingDims = MOMENTUM_DIMENSIONS.filter(d => !existingDims.has(d));
    
    if (missingDims.length > 0) {
      const newDims = missingDims.map(dim => ({
        user_id: user.id,
        dimension: dim,
        current_level: 1,
        momentum_score: 0
      }));
      
      await supabase.from('momentum_dimensions').insert(newDims);
    }

    // Calculate overall momentum
    const allDims = [...(dimensions || []), ...missingDims.map(d => ({ dimension: d, current_level: 1, momentum_score: 0 }))];
    const overallMomentum = Math.round(
      allDims.reduce((acc, d) => acc + (d.momentum_score || 0), 0) / 7
    );

    return NextResponse.json({
      dimensions: allDims,
      overallMomentum,
      flywheelActive: overallMomentum > 50
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch momentum data' }, { status: 500 });
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
    const { dimension, momentum_score, current_level } = body;

    const { data, error } = await supabase
      .from('momentum_dimensions')
      .upsert({
        user_id: user.id,
        dimension,
        momentum_score,
        current_level,
        last_calculated: new Date().toISOString()
      }, { onConflict: 'user_id,dimension' })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update momentum' }, { status: 500 });
  }
}
