/**
 * Tier 4 Personal Development API Routes
 * Self-Discovery, Character Stats, Productivity
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerSupabaseClient } from '@/layer-1-security/auth/route-handler';

// GET /api/tier4/self-discovery - Get user's self-discovery data
export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get entrepreneurial DNA
    const { data: dna } = await supabase
      .from('entrepreneurial_dna')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Get cognitive advantages
    const { data: cognitive } = await supabase
      .from('cognitive_advantages')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Get passion evidence
    const { data: passions } = await supabase
      .from('passion_evidence')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Get latest psychometric results
    const { data: assessments } = await supabase
      .from('psychometric_results')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    return NextResponse.json({
      dna,
      cognitive,
      passions: passions || [],
      assessments: assessments || [],
    });
  } catch (error) {
    console.error('Error fetching self-discovery data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch self-discovery data' },
      { status: 500 }
    );
  }
}

// POST /api/tier4/self-discovery/dna - Save entrepreneurial DNA assessment
export async function POSTDNA(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('entrepreneurial_dna')
      .upsert({
        user_id: user.id,
        builder_score: body.builderScore,
        opportunist_score: body.opportunistScore,
        specialist_score: body.specialistScore,
        innovator_score: body.innovatorScore,
        risk_tolerance: body.riskTolerance,
        action_orientation: body.actionOrientation,
        relationship_skills: body.relationshipSkills,
        thought_processing: body.thoughtProcessing,
        primary_dna: body.primaryDna,
        secondary_dna: body.secondaryDna,
        saas_fit: body.saasFit,
        agency_fit: body.agencyFit,
        content_fit: body.contentFit,
        product_fit: body.productFit,
        service_fit: body.serviceFit,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ dna: data, success: true });
  } catch (error) {
    console.error('Error saving DNA assessment:', error);
    return NextResponse.json(
      { error: 'Failed to save DNA assessment' },
      { status: 500 }
    );
  }
}

// POST /api/tier4/self-discovery/cognitive - Save cognitive advantages
export async function POSTCognitive(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('cognitive_advantages')
      .upsert({
        user_id: user.id,
        pattern_recognition: body.patternRecognition,
        systems_thinking: body.systemsThinking,
        creative_problem_solving: body.creativeProblemSolving,
        strategic_foresight: body.strategicForesight,
        rapid_learning: body.rapidLearning,
        emotional_intelligence: body.emotionalIntelligence,
        execution_velocity: body.executionVelocity,
        dominant_advantage: body.dominantAdvantage,
        supporting_advantages: body.supportingAdvantages,
        best_applied_in: body.bestAppliedIn,
        leverage_strategies: body.leverageStrategies,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ cognitive: data, success: true });
  } catch (error) {
    console.error('Error saving cognitive advantages:', error);
    return NextResponse.json(
      { error: 'Failed to save cognitive advantages' },
      { status: 500 }
    );
  }
}
