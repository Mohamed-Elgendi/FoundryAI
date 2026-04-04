/**
 * Tier 2 Opportunity API Routes
 * Individual opportunity endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerSupabaseClient } from '@/layer-1-security/auth/route-handler';
import { opportunityRepository, radarService } from '@/layer-3-data/services/radar-service';

// GET /api/tier2/opportunities - List opportunities with filters
export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    
    const options = {
      archetype: searchParams.get('archetype') || undefined,
      category: searchParams.get('category') || undefined,
      difficulty: searchParams.get('difficulty') || undefined,
      minScore: searchParams.get('minScore') ? parseInt(searchParams.get('minScore')!) : undefined,
      isTrending: searchParams.get('trending') === 'true',
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
    };

    const opportunities = await opportunityRepository.getOpportunities(options);

    return NextResponse.json({
      opportunities,
      total: opportunities.length,
      filters: options,
    });
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch opportunities' },
      { status: 500 }
    );
  }
}
