/**
 * Tier 2 Archetype Analysis API Route
 * Returns opportunity analysis by business archetype
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerSupabaseClient } from '@/layer-1-security/auth/route-handler';
import { radarService } from '@/layer-3-data/services/radar-service';

// GET /api/tier2/archetypes/[name] - Get archetype analysis
export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const analysis = await radarService.getArchetypeAnalysis(params.name);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error fetching archetype analysis:', error);
    return NextResponse.json(
      { error: 'Failed to fetch archetype analysis' },
      { status: 500 }
    );
  }
}
