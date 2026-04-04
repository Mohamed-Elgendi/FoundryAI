/**
 * Tier 1 Foundation API Routes - Mindset
 * Success Mindset Forge endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerSupabaseClient } from '@/layer-1-security/auth/route-handler';
import { tier1Repositories } from '@/layer-3-data/repositories/tier1-repositories';

// GET /api/tier1/mindset - Get user's mindset pillars
export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const pillars = await tier1Repositories.mindsetPillar.getOrInitialize(user.id);
    const exercises = await tier1Repositories.mindsetExercise.findByUserId(user.id, {
      orderBy: 'created_at',
      orderDirection: 'desc',
      limit: 20,
    });

    return NextResponse.json({ pillars, exercises });
  } catch (error) {
    console.error('Error fetching mindset data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mindset data' },
      { status: 500 }
    );
  }
}

// POST /api/tier1/mindset/exercise - Log mindset exercise
export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // Create exercise record
    const exercise = await tier1Repositories.mindsetExercise.create({
      userId: user.id,
      pillarName: body.pillarName,
      exerciseType: body.exerciseType,
      content: body.content,
      completionStatus: body.completionStatus || 'completed',
      reflection: body.reflection,
      completedAt: body.completionStatus === 'completed' ? new Date().toISOString() : undefined,
    });

    // Update pillar score and streak if exercise was completed
    if (body.completionStatus === 'completed') {
      const pillars = await tier1Repositories.mindsetPillar.getByUserId(user.id);
      const pillar = pillars.find(p => p.pillarName === body.pillarName);
      
      if (pillar) {
        const newScore = Math.min(100, pillar.currentScore + 2);
        const newStreak = pillar.lastPracticed 
          ? (new Date().getTime() - new Date(pillar.lastPracticed).getTime() < 86400000 * 2 
            ? pillar.practiceStreak + 1 
            : 1)
          : 1;

        await tier1Repositories.mindsetPillar.update(pillar.id, {
          currentScore: newScore,
          practiceStreak: newStreak,
          lastPracticed: new Date().toISOString(),
          insights: body.insight 
            ? [...pillar.insights, body.insight].slice(-10)
            : pillar.insights,
        });
      }
    }

    return NextResponse.json({ exercise, success: true });
  } catch (error) {
    console.error('Error logging mindset exercise:', error);
    return NextResponse.json(
      { error: 'Failed to log mindset exercise' },
      { status: 500 }
    );
  }
}

// PATCH /api/tier1/mindset/pillar - Update pillar target
export async function PATCH(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const pillars = await tier1Repositories.mindsetPillar.getByUserId(user.id);
    const pillar = pillars.find(p => p.pillarName === body.pillarName);

    if (!pillar) {
      return NextResponse.json({ error: 'Pillar not found' }, { status: 404 });
    }

    const updated = await tier1Repositories.mindsetPillar.update(pillar.id, {
      targetScore: body.targetScore,
    });

    return NextResponse.json({ pillar: updated, success: true });
  } catch (error) {
    console.error('Error updating pillar:', error);
    return NextResponse.json(
      { error: 'Failed to update pillar' },
      { status: 500 }
    );
  }
}
