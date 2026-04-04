/**
 * Tier 2 Radar Trending API Route
 * Returns trending opportunities
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerSupabaseClient } from '@/layer-1-security/auth/route-handler';
import { opportunityRepository } from '@/layer-3-data/services/radar-service';

// GET /api/tier2/trending - Get trending opportunities
export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const opportunities = await opportunityRepository.getTrendingOpportunities(limit);

    return NextResponse.json({
      opportunities,
      total: opportunities.length,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching trending opportunities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trending opportunities' },
      { status: 500 }
    );
  }
}
