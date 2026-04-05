/**
 * Tier 1 Foundation API Routes - Focus
 * Distractions Killer & Focus Session endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerSupabaseClient } from '@/layer-1-security/auth/route-handler';
import { tier1Repositories } from '@/layer-3-data/repositories/tier1-repositories';

// GET /api/tier1/focus - Get focus settings and sessions
export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const includeSessions = searchParams.get('sessions') === 'true';

    const settings = await tier1Repositories.digitalFortress.getOrCreate(user.id);
    const score = await tier1Repositories.focusScore.getOrCreate(user.id);

    let sessions: any[] = [];
    if (includeSessions) {
      sessions = await tier1Repositories.focusSession.getTodaySessions(user.id);
    }

    return NextResponse.json({
      settings,
      score,
      sessions,
      activeLayers: [
        settings.layer1DigitalEnabled,
        settings.layer2PhysicalEnabled,
        settings.layer3CognitiveEnabled,
        settings.layer4SocialEnabled,
        settings.layer5InternalEnabled,
      ].filter(Boolean).length,
    });
  } catch (error) {
    console.error('Error fetching focus data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch focus data' },
      { status: 500 }
    );
  }
}

// POST /api/tier1/focus/session - Start/End focus session
export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const settings = await tier1Repositories.digitalFortress.getOrCreate(user.id);

    const activeLayers = [
      settings.layer1DigitalEnabled,
      settings.layer2PhysicalEnabled,
      settings.layer3CognitiveEnabled,
      settings.layer4SocialEnabled,
      settings.layer5InternalEnabled,
    ].filter(Boolean).length;

    if (body.action === 'start') {
      // Start new session
      const session = await tier1Repositories.focusSession.create({
        userId: user.id,
        sessionType: body.sessionType || 'deep_work',
        durationMinutes: body.durationMinutes,
        startedAt: new Date().toISOString(),
        interruptionsCount: 0,
        distractionsBlocked: 0,
        layersActive: activeLayers,
        notes: body.notes,
        createdAt: new Date().toISOString(),
      } as any);

      return NextResponse.json({ session, success: true });
    } else if (body.action === 'end') {
      // End existing session
      const session = await tier1Repositories.focusSession.findById(body.sessionId);
      if (!session) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
      }

      const now = new Date();
      const startedAt = new Date(session.startedAt);
      const actualDuration = Math.floor((now.getTime() - startedAt.getTime()) / 60000);

      // Calculate focus score based on interruptions and layers
      const baseScore = 100;
      const interruptionPenalty = session.interruptionsCount * 10;
      const layerBonus = activeLayers * 2;
      const focusScore = Math.max(0, Math.min(100, baseScore - interruptionPenalty + layerBonus));

      const updatedSession = await tier1Repositories.focusSession.update(session.id, {
        endedAt: now.toISOString(),
        durationMinutes: actualDuration,
        focusScore,
        distractionsBlocked: body.distractionsBlocked || session.distractionsBlocked,
        interruptionsCount: body.interruptionsCount || session.interruptionsCount,
      });

      // Update focus score stats
      const score = await tier1Repositories.focusScore.getOrCreate(user.id);
      const newTotalSessions = score.totalSessions + 1;
      const newTotalMinutes = score.totalFocusMinutes + actualDuration;
      const newAverageScore = Math.round(
        (score.averageScore * score.totalSessions + focusScore) / newTotalSessions
      );

      await tier1Repositories.focusScore.update(score.id, {
        currentScore: focusScore,
        averageScore: newAverageScore,
        bestScore: Math.max(score.bestScore, focusScore),
        totalSessions: newTotalSessions,
        totalFocusMinutes: newTotalMinutes,
        currentStreak: focusScore >= 70 ? score.currentStreak + 1 : 0,
        longestStreak: Math.max(score.longestStreak, focusScore >= 70 ? score.currentStreak + 1 : 0),
        lastSessionAt: now.toISOString(),
      });

      return NextResponse.json({ session: updatedSession, focusScore, success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error managing focus session:', error);
    return NextResponse.json(
      { error: 'Failed to manage focus session' },
      { status: 500 }
    );
  }
}

// PATCH /api/tier1/focus/settings - Update fortress settings
export async function PATCH(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const settings = await tier1Repositories.digitalFortress.getOrCreate(user.id);

    const updated = await tier1Repositories.digitalFortress.update(settings.id, body);

    return NextResponse.json({ settings: updated, success: true });
  } catch (error) {
    console.error('Error updating fortress settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
