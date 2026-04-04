/**
 * Tier 6 Revenue API Routes
 * Revenue tracking, goals, streams
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerSupabaseClient } from '@/layer-1-security/auth/route-handler';

// GET /api/tier6/revenue - Get user's revenue data
export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    // Get revenue streams
    const { data: streams } = await supabase
      .from('revenue_streams')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Get recent transactions
    const { data: transactions } = await supabase
      .from('revenue_transactions')
      .select('*')
      .eq('user_id', user.id)
      .gte('transaction_date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('transaction_date', { ascending: false });

    // Get active goals
    const { data: goals } = await supabase
      .from('revenue_goals')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_achieved', false)
      .order('target_date', { ascending: true });

    // Get daily stats for chart
    const { data: dailyStats } = await supabase
      .from('daily_revenue_stats')
      .select('*')
      .eq('user_id', user.id)
      .gte('stats_date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('stats_date', { ascending: true });

    // Calculate totals
    const totalRevenue = transactions?.reduce((acc, t) => acc + parseFloat(t.amount), 0) || 0;
    const mrr = dailyStats?.[dailyStats.length - 1]?.mrr || 0;

    return NextResponse.json({
      streams: streams || [],
      transactions: transactions || [],
      goals: goals || [],
      dailyStats: dailyStats || [],
      totals: {
        totalRevenue,
        mrr,
        arr: mrr * 12,
        transactionCount: transactions?.length || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch revenue data' },
      { status: 500 }
    );
  }
}

// POST /api/tier6/revenue/transaction - Record revenue transaction
export async function POSTTransaction(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('revenue_transactions')
      .insert({
        user_id: user.id,
        stream_id: body.streamId,
        amount: body.amount,
        currency: body.currency || 'USD',
        transaction_date: body.date || new Date().toISOString().split('T')[0],
        transaction_type: body.type || 'one_time',
        source_type: body.sourceType || 'manual',
        external_transaction_id: body.externalId,
        customer_email: body.customerEmail,
        customer_name: body.customerName,
        description: body.description,
        is_recurring: body.isRecurring || false,
        recurring_interval: body.recurringInterval,
      })
      .select()
      .single();

    if (error) throw error;

    // Update revenue goal progress if applicable
    if (body.streamId) {
      await supabase.rpc('update_revenue_goal_progress', {
        p_user_id: user.id,
        p_amount: body.amount,
      });
    }

    // Check for milestone achievements
    await supabase.rpc('check_revenue_milestones', {
      p_user_id: user.id,
    });

    return NextResponse.json({ transaction: data, success: true });
  } catch (error) {
    console.error('Error recording transaction:', error);
    return NextResponse.json(
      { error: 'Failed to record transaction' },
      { status: 500 }
    );
  }
}

// POST /api/tier6/revenue/goal - Create revenue goal
export async function POSTGoal(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('revenue_goals')
      .insert({
        user_id: user.id,
        goal_name: body.name,
        goal_type: body.type,
        target_amount: body.targetAmount,
        current_amount: body.currentAmount || 0,
        target_date: body.targetDate,
        start_date: body.startDate || new Date().toISOString().split('T')[0],
        stream_id: body.streamId,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ goal: data, success: true });
  } catch (error) {
    console.error('Error creating goal:', error);
    return NextResponse.json(
      { error: 'Failed to create goal' },
      { status: 500 }
    );
  }
}
