/**
 * Tier 1 Foundation API Routes - Confidence
 * Confidence Core endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerSupabaseClient } from '@/layer-1-security/auth/route-handler';
import { tier1Repositories } from '@/layer-3-data/repositories/tier1-repositories';

// GET /api/tier1/confidence - Get user's confidence quotient
export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const cq = await tier1Repositories.confidenceQuotient.getOrCreate(user.id);
    const evidence = await tier1Repositories.confidenceEvidence.getByUserIdAndLayer(user.id);

    return NextResponse.json({ cq, evidence });
  } catch (error) {
    console.error('Error fetching confidence data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch confidence data' },
      { status: 500 }
    );
  }
}

// POST /api/tier1/confidence/evidence - Add confidence evidence
export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    const evidence = await tier1Repositories.confidenceEvidence.create({
      userId: user.id,
      layer: body.layer,
      evidenceType: body.evidenceType,
      description: body.description,
      domain: body.domain,
      impactRating: body.impactRating,
      dateRecorded: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    } as any);

    // Recalculate domain-specific CQ scores
    const allEvidence = await tier1Repositories.confidenceEvidence.getByUserIdAndLayer(user.id);
    const cq = await tier1Repositories.confidenceQuotient.getOrCreate(user.id);

    const domainScores: Record<string, number> = {};
    const domains = ['technical', 'sales', 'strategy', 'creative', 'communication', 'leadership'];

    for (const domain of domains) {
      const domainEvidence = allEvidence.filter(e => e.domain === domain);
      const baseScore = 40;
      const bonus = domainEvidence.reduce((acc, e) => acc + (e.impactRating || 1) * e.layer, 0);
      domainScores[`${domain}Cq`] = Math.min(100, baseScore + bonus);
    }

    // Calculate overall CQ as average of domain scores
    const overallCQ = Math.round(
      Object.values(domainScores).reduce((a, b) => a + b, 0) / domains.length
    );

    await tier1Repositories.confidenceQuotient.update(cq.id, {
      ...domainScores,
      overallCq: overallCQ,
      lastAssessment: new Date().toISOString(),
    });

    return NextResponse.json({ evidence, cq: { overallCQ, ...domainScores }, success: true });
  } catch (error) {
    console.error('Error adding confidence evidence:', error);
    return NextResponse.json(
      { error: 'Failed to add confidence evidence' },
      { status: 500 }
    );
  }
}
