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
        .from('foundryai_belief_scores')
        .select('*')
        .eq('user_id', user.id)
        .order('calibration_date', { ascending: false })
        .limit(1)
        .single(),
      
      // Confidence quotients
      supabase
        .from('foundryai_confidence_quotients')
        .select('*')
        .eq('user_id', user.id)
        .order('calculated_at', { ascending: false })
        .limit(6),
      
      // Emotion check-ins
      supabase
        .from('foundryai_emotion_checkins')
        .select('*')
        .eq('user_id', user.id)
        .gte('checked_in_at', today)
        .order('checked_in_at', { ascending: false })
        .limit(1)
        .single(),
      
      // Momentum dimensions
      supabase
        .from('foundryai_momentum_dimensions')
        .select('*')
        .eq('user_id', user.id)
        .gte('calculated_at', today)
        .order('calculated_at', { ascending: false })
        .limit(7),
      
      // Focus sessions
      supabase
        .from('foundryai_focus_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gte('started_at', today)
        .order('started_at', { ascending: false }),
      
      // Brain dumps
      supabase
        .from('foundryai_brain_dumps')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single(),
      
      // Cognitive load
      supabase
        .from('foundryai_cognitive_load_readings')
        .select('*')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: false })
        .limit(1)
        .single(),
    ]);

    // Calculate overall foundation health score
    const beliefStrength = beliefScore.data?.belief_strength || 50;
    const avgConfidence = confidenceData.data?.length 
      ? confidenceData.data.reduce((acc: number, c: { cq_score: number }) => acc + c.cq_score, 0) / confidenceData.data.length 
      : 50;
    const cognitiveLoadValue = cognitiveLoad.data?.load_percentage || 50;
    const focusScore = focusData.data?.length 
      ? focusData.data.reduce((acc: number, f: { focus_score: number }) => acc + (f.focus_score || 70), 0) / focusData.data.length 
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
        level: beliefScore.data?.identity_level || 1,
        intention: beliefScore.data?.morning_intention || '',
      },
      confidence: {
        overall: Math.round(avgConfidence),
        domains: confidenceData.data || [],
      },
      emotion: {
        currentState: emotionData.data?.current_state || 'neutral',
        intensity: emotionData.data?.intensity || 5,
      },
      momentum: {
        dimensions: momentumData.data || [],
      },
      focus: {
        sessionsToday: focusData.data?.length || 0,
        averageScore: Math.round(focusScore),
        activeSession: focusData.data?.find((f: { ended_at: string | null }) => !f.ended_at) || null,
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
