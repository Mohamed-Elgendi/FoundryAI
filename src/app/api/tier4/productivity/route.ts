/**
 * Tier 4 Productivity API Routes
 * Sessions, time allocation, chronotype
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerSupabaseClient } from '@/layer-1-security/auth/route-handler';

// GET /api/tier4/productivity - Get productivity data
export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');

    // Get chronotype profile
    const { data: chronotype } = await supabase
      .from('chronotype_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Get latest time allocation
    const { data: timeAllocation } = await supabase
      .from('time_allocations')
      .select('*')
      .eq('user_id', user.id)
      .order('recorded_for_date', { ascending: false })
      .limit(1)
      .single();

    // Get recent productivity sessions
    const { data: sessions } = await supabase
      .from('productivity_sessions')
      .select('*')
      .eq('user_id', user.id)
      .gte('started_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('started_at', { ascending: false });

    // Get daily rituals
    const { data: rituals } = await supabase
      .from('daily_rituals')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('scheduled_time', { ascending: true });

    // Calculate stats
    const totalSessions = sessions?.length || 0;
    const completedSessions = sessions?.filter(s => s.task_completed).length || 0;
    const averageFocusScore = sessions?.length 
      ? sessions.reduce((acc, s) => acc + (s.focus_score || 0), 0) / sessions.length 
      : 0;

    return NextResponse.json({
      chronotype,
      timeAllocation,
      sessions: sessions || [],
      rituals: rituals || [],
      stats: {
        totalSessions,
        completedSessions,
        completionRate: totalSessions > 0 ? (completedSessions / totalSessions * 100).toFixed(1) : 0,
        averageFocusScore: averageFocusScore.toFixed(1),
      },
    });
  } catch (error) {
    console.error('Error fetching productivity data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch productivity data' },
      { status: 500 }
    );
  }
}

// POST /api/tier4/productivity/session - Create productivity session
export async function POSTSession(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('productivity_sessions')
      .insert({
        user_id: user.id,
        session_type: body.sessionType,
        task_description: body.taskDescription,
        planned_duration_minutes: body.plannedDuration,
        energy_before: body.energyBefore,
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ session: data, success: true });
  } catch (error) {
    console.error('Error creating productivity session:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}

// PATCH /api/tier4/productivity/session/:id - End/update session
export async function PATCHSession(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const sessionId = body.sessionId;

    const updates: any = {
      updated_at: new Date().toISOString(),
    };

    if (body.action === 'end') {
      updates.ended_at = new Date().toISOString();
      updates.actual_duration_minutes = body.actualDuration;
      updates.focus_score = body.focusScore;
      updates.interruptions_count = body.interruptions;
      updates.task_completed = body.taskCompleted;
      updates.completion_percentage = body.completionPercentage;
      updates.quality_rating = body.qualityRating;
      updates.energy_after = body.energyAfter;
    }

    const { data, error } = await supabase
      .from('productivity_sessions')
      .update(updates)
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ session: data, success: true });
  } catch (error) {
    console.error('Error updating productivity session:', error);
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    );
  }
}

// POST /api/tier4/productivity/chronotype - Save chronotype assessment
export async function POSTChronotype(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('chronotype_profiles')
      .upsert({
        user_id: user.id,
        chronotype: body.chronotype,
        peak_cognitive_start: body.peakCognitiveStart,
        peak_cognitive_end: body.peakCognitiveEnd,
        peak_creative_start: body.peakCreativeStart,
        peak_creative_end: body.peakCreativeEnd,
        optimal_bedtime: body.optimalBedtime,
        optimal_wake_time: body.optimalWakeTime,
        sleep_duration_ideal: body.sleepDurationIdeal,
        assessment_answers: body.assessmentAnswers,
        confidence_score: body.confidenceScore,
        assessed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ chronotype: data, success: true });
  } catch (error) {
    console.error('Error saving chronotype:', error);
    return NextResponse.json(
      { error: 'Failed to save chronotype' },
      { status: 500 }
    );
  }
}
