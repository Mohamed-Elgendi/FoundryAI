/**
 * Tier 1 Foundation API Routes
 * Belief Architecture & Success Mindset endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerSupabaseClient } from '@/layer-1-security/auth/route-handler';
import {
  tier1Repositories,
} from '@/layer-3-data/repositories/tier1-repositories';

// ============================================
// BELIEF ARCHITECTURE API
// ============================================

// GET /api/tier1/belief - Get user's belief score
export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const score = await tier1Repositories.beliefScore.getOrCreate(user.id);
    const evidence = await tier1Repositories.beliefEvidence.getByUserId(user.id);

    return NextResponse.json({ score, evidence });
  } catch (error) {
    console.error('Error fetching belief score:', error);
    return NextResponse.json(
      { error: 'Failed to fetch belief score' },
      { status: 500 }
    );
  }
}

// POST /api/tier1/belief/evidence - Add belief evidence
export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const evidence = await tier1Repositories.beliefEvidence.create({
      userId: user.id,
      evidenceType: body.evidenceType,
      description: body.description,
      impactScore: body.impactScore,
      relatedBelief: body.relatedBelief,
      dateRecorded: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    } as any);

    // Update belief score counts
    const currentScore = await tier1Repositories.beliefScore.getOrCreate(user.id);
    const updateData: Record<string, number> = {};

    switch (body.evidenceType) {
      case 'micro_proof':
        updateData.microProofCount = (currentScore.microProofCount || 0) + 1;
        break;
      case 'pattern':
        updateData.patternRecognitionCount = (currentScore.patternRecognitionCount || 0) + 1;
        break;
      case 'capability':
        updateData.capabilityEvidenceCount = (currentScore.capabilityEvidenceCount || 0) + 1;
        break;
      case 'identity':
        updateData.identityMilestones = (currentScore.identityMilestones || 0) + 1;
        break;
      case 'legendary':
        updateData.legendaryMoments = (currentScore.legendaryMoments || 0) + 1;
        break;
    }

    // Calculate new overall score based on evidence
    const totalEvidence =
      (updateData.microProofCount || currentScore.microProofCount) +
      (updateData.patternRecognitionCount || currentScore.patternRecognitionCount) * 2 +
      (updateData.capabilityEvidenceCount || currentScore.capabilityEvidenceCount) * 5 +
      (updateData.identityMilestones || currentScore.identityMilestones) * 10 +
      (updateData.legendaryMoments || currentScore.legendaryMoments) * 20;

    updateData.overallScore = Math.min(100, Math.floor(totalEvidence / 5) + 50);
    updateData.level = Math.min(5, Math.floor(updateData.overallScore / 20) + 1);

    await tier1Repositories.beliefScore.update(currentScore.id, updateData);

    return NextResponse.json({ evidence, success: true });
  } catch (error) {
    console.error('Error adding belief evidence:', error);
    return NextResponse.json(
      { error: 'Failed to add belief evidence' },
      { status: 500 }
    );
  }
}
