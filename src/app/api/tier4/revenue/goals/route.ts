/**
 * Revenue Goals API
 * GET /api/tier4/revenue/goals
 * POST /api/tier4/revenue/goals
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/layer-1-security/auth/route-handler';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createRouteHandlerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('foundryai_revenue_goals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Get goals error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch goals' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createRouteHandlerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const { data, error } = await supabase
      .from('foundryai_revenue_goals')
      .insert({
        user_id: user.id,
        name: body.name,
        target_amount: body.targetAmount,
        current_amount: body.currentAmount || 0,
        goal_type: body.goalType,
        start_date: body.startDate,
        end_date: body.endDate,
        status: body.status || 'active',
        metadata: body.metadata || {},
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Create goal error:', error);
    return NextResponse.json(
      { error: 'Failed to create goal' },
      { status: 500 }
    );
  }
}
