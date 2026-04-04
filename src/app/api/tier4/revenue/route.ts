/**
 * Revenue API Routes
 * Tier 4 Revenue Engine endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/layer-1-security/auth/route-handler';

// GET /api/tier4/revenue/dashboard
export async function GET(request: NextRequest) {
  try {
    const supabase = await createRouteHandlerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'month';

    // Get total revenue
    const { data: revenueData } = await supabase
      .from('foundryai_revenue_transactions')
      .select('net_amount, source')
      .eq('user_id', user.id)
      .eq('payment_status', 'completed');

    const totalRevenue = revenueData?.reduce((sum, t) => sum + (t.net_amount || 0), 0) || 0;

    // Get MTD revenue
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { data: mtdData } = await supabase
      .from('foundryai_revenue_transactions')
      .select('net_amount')
      .eq('user_id', user.id)
      .eq('payment_status', 'completed')
      .gte('transaction_date', startOfMonth.toISOString());

    const mtdRevenue = mtdData?.reduce((sum, t) => sum + (t.net_amount || 0), 0) || 0;

    // Get YTD revenue
    const startOfYear = new Date();
    startOfYear.setMonth(0, 1);
    startOfYear.setHours(0, 0, 0, 0);

    const { data: ytdData } = await supabase
      .from('foundryai_revenue_transactions')
      .select('net_amount')
      .eq('user_id', user.id)
      .eq('payment_status', 'completed')
      .gte('transaction_date', startOfYear.toISOString());

    const ytdRevenue = ytdData?.reduce((sum, t) => sum + (t.net_amount || 0), 0) || 0;

    // Get revenue by source
    const revenueBySource: Record<string, number> = {};
    revenueData?.forEach((t) => {
      revenueBySource[t.source] = (revenueBySource[t.source] || 0) + (t.net_amount || 0);
    });

    // Get recent transactions
    const { data: recentTransactions } = await supabase
      .from('foundryai_revenue_transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('transaction_date', { ascending: false })
      .limit(10);

    // Get daily trend
    const { data: dailyData } = await supabase
      .from('foundryai_revenue_daily')
      .select('*')
      .eq('user_id', user.id)
      .order('snapshot_date', { ascending: false })
      .limit(30);

    const dailyTrend = (dailyData || [])
      .sort((a, b) => new Date(a.snapshot_date).getTime() - new Date(b.snapshot_date).getTime())
      .map((d) => ({
        date: d.snapshot_date,
        revenue: d.daily_revenue || 0,
      }));

    return NextResponse.json({
      totalRevenue,
      mtdRevenue,
      ytdRevenue,
      totalTransactions: revenueData?.length || 0,
      revenueBySource,
      recentTransactions: recentTransactions || [],
      dailyTrend,
    });
  } catch (error) {
    console.error('Revenue dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch revenue dashboard' },
      { status: 500 }
    );
  }
}
