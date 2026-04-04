/**
 * Tier 2 Opportunity Detail & Validation API Routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerSupabaseClient } from '@/layer-1-security/auth/route-handler';
import { opportunityRepository, radarService } from '@/layer-3-data/services/radar-service';

// GET /api/tier2/opportunities/[id] - Get opportunity details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const opportunity = await opportunityRepository.getOpportunityById(params.id);

    if (!opportunity) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    }

    const validation = await radarService.validateOpportunity(params.id);

    return NextResponse.json({
      opportunity,
      validation,
    });
  } catch (error) {
    console.error('Error fetching opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch opportunity' },
      { status: 500 }
    );
  }
}
