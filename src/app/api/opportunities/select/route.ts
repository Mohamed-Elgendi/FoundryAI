import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

let supabase: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  if (!supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }
    
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });
  }
  return supabase;
}

/**
 * POST /api/opportunities/select
 * Select an opportunity and start the user journey
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, opportunityId } = body;

    if (!userId || !opportunityId) {
      return NextResponse.json(
        { success: false, error: 'Missing userId or opportunityId' },
        { status: 400 }
      );
    }

    // Verify opportunity exists
    const { data: opportunity, error: oppError } = await getSupabaseClient()
      .from('opportunities')
      .select('*')
      .eq('id', opportunityId)
      .single();

    if (oppError || !opportunity) {
      return NextResponse.json(
        { success: false, error: 'Opportunity not found' },
        { status: 404 }
      );
    }

    // Update or create user journey
    const journeyData = {
      user_id: userId,
      current_stage: 'build',
      selected_opportunity_id: opportunityId,
      build_progress: 0,
      updated_at: new Date().toISOString()
    };

    const { error: journeyError } = await getSupabaseClient()
      .from('foundryai_user_journeys')
      .upsert(journeyData as any, {
        onConflict: 'user_id'
      });

    if (journeyError) {
      throw journeyError;
    }

    return NextResponse.json({
      success: true,
      message: 'Opportunity selected successfully',
      data: {
        opportunityId,
        currentStage: 'build',
        nextStep: '/build'
      }
    });

  } catch (error) {
    console.error('Error selecting opportunity:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to select opportunity' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/opportunities/selection
 * Get current selection status for user
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    const { data: journey, error } = await getSupabaseClient()
      .from('foundryai_user_journeys')
      .select(`
        *,
        opportunity:selected_opportunity_id (*)
      `)
      .eq('user_id', userId)
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: 'No journey found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: journey
    });

  } catch (error) {
    console.error('Error fetching selection:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch selection' },
      { status: 500 }
    );
  }
}
