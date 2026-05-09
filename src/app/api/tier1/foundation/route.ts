import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseClient } from '@/layer-3-data/storage/supabase-client';

// GET /api/tier1/foundation - Get all Tier 1 foundation data for current user
export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = new Date().toISOString().split('T')[0];

    // Fetch all Tier 1 data in parallel
    const [
      beliefScore,
      confidenceData,
      emotionData,
      momentumData,
      focusData,
      brainDumpData,
      cognitiveLoad,
    ] = await Promise.all([
      // Belief score
      supabase
        .from('foundryai_belief_scores' as any)
        .select('*')
        .eq('user_id', user.id)
        .order('calibration_date', { ascending: false })
        .limit(1)
        .single(),
      
      // Confidence quotients
      supabase
        .from('foundryai_confidence_quotients' as any)
        .select('*')
        .eq('user_id', user.id)
        .order('calculated_at', { ascending: false })
        .limit(6),
      
      // Emotion check-ins
      supabase
        .from('foundryai_emotion_checkins' as any)
        .select('*')
        .eq('user_id', user.id)
        .gte('checked_in_at', today)
        .order('checked_in_at', { ascending: false })
        .limit(1)
        .single(),
      
      // Momentum dimensions
      supabase
        .from('foundryai_momentum_dimensions' as any)
        .select('*')
        .eq('user_id', user.id)
        .gte('calculated_at', today)
        .order('calculated_at', { ascending: false })
        .limit(7),
      
      // Focus sessions
      supabase
        .from('foundryai_focus_sessions' as any)
        .select('*')
        .eq('user_id', user.id)
        .gte('started_at', today)
        .order('started_at', { ascending: false }),
      
      // Brain dumps
      supabase
        .from('foundryai_brain_dumps' as any)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single(),
      
      // Cognitive load
      supabase
        .from('foundryai_cognitive_load_readings' as any)
        .select('*')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: false })
        .limit(1)
        .single(),
    ]);

    // Calculate overall foundation health score
    const beliefStrength = (beliefScore.data as any)?.belief_strength || 50;
    const avgConfidence = (confidenceData.data as any[])?.length 
      ? (confidenceData.data as any[]).reduce((acc: number, c: any) => acc + (c.cq_score || 0), 0) / (confidenceData.data as any[]).length 
      : 50;
    const cognitiveLoadValue = (cognitiveLoad.data as any)?.load_percentage || 50;
    const focusScore = (focusData.data as any[])?.length 
      ? (focusData.data as any[]).reduce((acc: number, f: any) => acc + (f.focus_score || 70), 0) / (focusData.data as any[]).length 
      : 70;

    // Foundation health: weighted average
    const foundationHealth = Math.round(
      (beliefStrength * 0.25) +
      (avgConfidence * 0.25) +
      ((100 - cognitiveLoadValue) * 0.2) +
      (focusScore * 0.3)
    );

    return NextResponse.json({
      foundationHealth,
      belief: {
        score: beliefStrength,
        level: (beliefScore.data as any)?.identity_level || 1,
        intention: (beliefScore.data as any)?.morning_intention || '',
      },
      confidence: {
        overall: Math.round(avgConfidence),
        domains: confidenceData.data || [],
      },
      emotion: {
        currentState: (emotionData.data as any)?.current_state || 'neutral',
        intensity: (emotionData.data as any)?.intensity || 5,
      },
      momentum: {
        dimensions: momentumData.data || [],
      },
      focus: {
        sessionsToday: focusData.data?.length || 0,
        averageScore: Math.round(focusScore),
        activeSession: (focusData.data as any[])?.find((f: any) => !f.ended_at) || null,
      },
      brainDump: {
        lastDump: brainDumpData.data || null,
        cognitiveLoad: cognitiveLoadValue,
      },
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Tier 1 foundation fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch foundation data' },
      { status: 500 }
    );
  }
}
