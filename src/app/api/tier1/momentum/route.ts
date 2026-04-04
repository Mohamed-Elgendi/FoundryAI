/**
 * Tier 1 Foundation API Routes - Momentum
 * Momentum Builder (7 Dimensions) endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerSupabaseClient } from '@/layer-1-security/auth/route-handler';
import { tier1Repositories } from '@/layer-3-data/repositories/tier1-repositories';

// GET /api/tier1/momentum - Get momentum dimensions and flywheel
export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const dimensions = await tier1Repositories.momentumDimension.getOrInitialize(user.id);
    const flywheel = await tier1Repositories.momentumFlywheel.getOrCreate(user.id);

    // Calculate overall stats
    const averageScore = Math.round(
      dimensions.reduce((acc, d) => acc + d.currentScore, 0) / dimensions.length
    );
    const dimensionsInSync = dimensions.filter(d => d.currentScore >= 50).length;

    return NextResponse.json({
      dimensions,
      flywheel,
      stats: {
        averageScore,
        dimensionsInSync,
        totalMilestones: dimensions.reduce((acc, d) => acc + d.totalMilestones, 0),
        currentStreak: Math.min(...dimensions.map(d => d.streakWeeks)),
      },
    });
  } catch (error) {
    console.error('Error fetching momentum data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch momentum data' },
      { status: 500 }
    );
  }
}

// POST /api/tier1/momentum/activity - Log momentum activity
export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Create activity record
    const activity = await tier1Repositories.momentumActivity.create({
      userId: user.id,
      dimensionName: body.dimensionName,
      activityType: body.activityType,
      description: body.description,
      impactScore: body.impactScore || 5,
      activityDate: new Date().toISOString().split('T')[0],
    });

    // Update dimension score
    const dimension = await tier1Repositories.momentumDimension.getByDimensionName(
      user.id,
      body.dimensionName
    );

    if (dimension) {
      const newScore = Math.min(100, dimension.currentScore + (body.impactScore || 5) / 10);
      const newMilestones = dimension.totalMilestones + (newScore >= (dimension.currentStage * 20) ? 1 : 0);
      const stageCalc = Math.min(5, Math.floor(newScore / 20) + 1);
      const newStage: 1 | 2 | 3 | 4 | 5 = stageCalc as 1 | 2 | 3 | 4 | 5;

      await tier1Repositories.momentumDimension.update(dimension.id, {
        currentScore: newScore,
        currentStage: newStage,
        totalMilestones: newMilestones,
        momentumVelocity: (dimension.momentumVelocity + (body.impactScore || 5)) / 2,
      });

      // Recalculate flywheel
      const allDimensions = await tier1Repositories.momentumDimension.getOrInitialize(user.id);
      const avgScore = Math.round(
        allDimensions.reduce((acc, d) => acc + d.currentScore, 0) / allDimensions.length
      );
      const inSync = allDimensions.filter(d => d.currentScore >= 50).length;

      const flywheel = await tier1Repositories.momentumFlywheel.getOrCreate(user.id);
      await tier1Repositories.momentumFlywheel.update(flywheel.id, {
        overallMomentumScore: avgScore,
        dimensionsInSync: inSync,
        flywheelSpeed: inSync >= 5 ? flywheel.flywheelSpeed + 1 : flywheel.flywheelSpeed,
        compoundGrowthRate: (flywheel.compoundGrowthRate * 0.9) + (avgScore * 0.01),
        lastMomentumCheck: new Date().toISOString(),
      });
    }

    return NextResponse.json({ activity, success: true });
  } catch (error) {
    console.error('Error logging momentum activity:', error);
    return NextResponse.json(
      { error: 'Failed to log activity' },
      { status: 500 }
    );
  }
}

// PATCH /api/tier1/momentum/dimension - Update dimension target
export async function PATCH(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const dimension = await tier1Repositories.momentumDimension.getByDimensionName(
      user.id,
      body.dimensionName
    );

    if (!dimension) {
      return NextResponse.json({ error: 'Dimension not found' }, { status: 404 });
    }

    const updated = await tier1Repositories.momentumDimension.update(dimension.id, {
      lastWeeklyTarget: body.weeklyTarget,
    });

    return NextResponse.json({ dimension: updated, success: true });
  } catch (error) {
    console.error('Error updating dimension:', error);
    return NextResponse.json(
      { error: 'Failed to update dimension' },
      { status: 500 }
    );
  }
}
