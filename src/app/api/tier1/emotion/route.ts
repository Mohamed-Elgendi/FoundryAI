/**
 * Tier 1 Foundation API Routes - Emotion
 * Emotion Controller endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerSupabaseClient } from '@/layer-1-security/auth/route-handler';
import { tier1Repositories } from '@/layer-3-data/repositories/tier1-repositories';

// GET /api/tier1/emotion - Get emotion checkins and flow sessions
export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const checkins = await tier1Repositories.emotionCheckin.getRecentByUserId(user.id, limit);
    const flowSessions = await tier1Repositories.flowSession.getRecentByUserId(user.id, limit);
    const todayCheckin = await tier1Repositories.emotionCheckin.getTodayCheckin(user.id);

    // Calculate emotion stats
    const emotionCounts: Record<string, number> = {};
    for (const checkin of checkins) {
      emotionCounts[checkin.currentState] = (emotionCounts[checkin.currentState] || 0) + 1;
    }

    const dominantEmotion = Object.entries(emotionCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'neutral';

    return NextResponse.json({
      checkins,
      flowSessions,
      todayCheckin,
      stats: {
        dominantEmotion,
        totalCheckins: checkins.length,
        flowSessionsCount: flowSessions.length,
        averageFlowDepth: flowSessions.length > 0
          ? flowSessions.reduce((acc, s) => acc + (s.depthScore || 0), 0) / flowSessions.length
          : 0,
      },
    });
  } catch (error) {
    console.error('Error fetching emotion data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch emotion data' },
      { status: 500 }
    );
  }
}

// POST /api/tier1/emotion/checkin - Create emotion checkin
export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const checkin = await tier1Repositories.emotionCheckin.create({
      userId: user.id,
      currentState: body.currentState,
      intensity: body.intensity,
      triggerIdentified: body.triggerIdentified,
      targetState: body.targetState,
      transitionStrategyUsed: body.transitionStrategyUsed,
      wasSuccessful: body.wasSuccessful,
      notes: body.notes,
      checkinDate: new Date().toISOString(),
    } as any);

    // Record emotion pattern if successful transition
    if (body.wasSuccessful && body.targetState) {
      await supabase.from('emotion_patterns').insert({
        user_id: user.id,
        pattern_type: 'trigger_response',
        description: `Transition from ${body.currentState} to ${body.targetState}`,
        success_rate: 1.0,
        insights: {
          strategy: body.transitionStrategyUsed,
          intensity: body.intensity,
        },
      });
    }

    return NextResponse.json({ checkin, success: true });
  } catch (error) {
    console.error('Error creating emotion checkin:', error);
    return NextResponse.json(
      { error: 'Failed to create checkin' },
      { status: 500 }
    );
  }
}

// POST /api/tier1/emotion/flow - Start/end flow session
export async function POSTFlow(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (body.action === 'start') {
      const session = await tier1Repositories.flowSession.create({
        userId: user.id,
        startedAt: new Date().toISOString(),
        entryMethod: body.entryMethod || 'direct_entry',
        workType: body.workType,
        interruptions: 0,
        createdAt: new Date().toISOString(),
      } as any);

      return NextResponse.json({ session, success: true });
    } else if (body.action === 'end') {
      const session = await tier1Repositories.flowSession.findById(body.sessionId);
      if (!session) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
      }

      const now = new Date();
      const startedAt = new Date(session.startedAt);
      const durationMinutes = Math.floor((now.getTime() - startedAt.getTime()) / 60000);

      const updated = await tier1Repositories.flowSession.update(session.id, {
        endedAt: now.toISOString(),
        durationMinutes,
        depthScore: body.depthScore,
        interruptions: body.interruptions || session.interruptions,
        workType: body.workType || session.workType,
        satisfactionScore: body.satisfactionScore,
      });

      return NextResponse.json({ session: updated, success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error managing flow session:', error);
    return NextResponse.json(
      { error: 'Failed to manage flow session' },
      { status: 500 }
    );
  }
}
