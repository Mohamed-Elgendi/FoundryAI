/**
 * Tier 2 Opportunity Radar API Routes
 * Multi-source intelligence gathering and opportunity validation
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerSupabaseClient } from '@/layer-1-security/auth/route-handler';
import { radarService, ideaExtractionService } from '@/layer-3-data/services/radar-service';

// GET /api/tier2/radar - Get radar dashboard data
export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const dashboard = await radarService.getRadarDashboard();
    return NextResponse.json(dashboard);
  } catch (error) {
    console.error('Error fetching radar dashboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch radar data' },
      { status: 500 }
    );
  }
}

// POST /api/tier2/radar/extract - Extract opportunities from vague idea
export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const opportunities = await ideaExtractionService.extractOpportunities({
      vagueIdea: body.vagueIdea,
      skills: body.skills || [],
      interests: body.interests || [],
      timeAvailability: body.timeAvailability || 'moderate',
      budget: body.budget || 'zero',
    });

    return NextResponse.json({ opportunities, success: true });
  } catch (error) {
    console.error('Error extracting ideas:', error);
    return NextResponse.json(
      { error: 'Failed to extract opportunities' },
      { status: 500 }
    );
  }
}
