/**
 * Revenue Analytics API
 * GET /api/tier4/revenue/analytics
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

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'month';

    // Calculate date range
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'quarter':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
    }

    // Get period transactions
    const { data: transactions } = await supabase
      .from('foundryai_revenue_transactions')
      .select('*')
      .eq('user_id', user.id)
      .eq('payment_status', 'completed')
      .gte('transaction_date', startDate.toISOString())
      .order('transaction_date', { ascending: true });

    // Calculate metrics
    const revenue = transactions?.reduce((sum, t) => sum + (t.net_amount || 0), 0) || 0;
    const transactionCount = transactions?.length || 0;
    const averageOrderValue = transactionCount > 0 ? revenue / transactionCount : 0;

    // Get previous period for growth rate
    const prevStartDate = new Date(startDate.getTime() - (now.getTime() - startDate.getTime()));
    const { data: prevTransactions } = await supabase
      .from('foundryai_revenue_transactions')
      .select('net_amount')
      .eq('user_id', user.id)
      .eq('payment_status', 'completed')
      .gte('transaction_date', prevStartDate.toISOString())
      .lt('transaction_date', startDate.toISOString());

    const prevRevenue = prevTransactions?.reduce((sum, t) => sum + (t.net_amount || 0), 0) || 0;
    const growthRate = prevRevenue > 0 ? ((revenue - prevRevenue) / prevRevenue) * 100 : 0;

    // Revenue by source
    const bySource: Record<string, number> = {};
    transactions?.forEach((t) => {
      bySource[t.source] = (bySource[t.source] || 0) + (t.net_amount || 0);
    });

    // Daily trend
    const trendMap = new Map<string, { revenue: number; transactions: number }>();
    transactions?.forEach((t) => {
      const date = new Date(t.transaction_date).toISOString().split('T')[0];
      const current = trendMap.get(date) || { revenue: 0, transactions: 0 };
      trendMap.set(date, {
        revenue: current.revenue + (t.net_amount || 0),
        transactions: current.transactions + 1,
      });
    });

    const trend = Array.from(trendMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, data]) => ({ date, ...data }));

    return NextResponse.json({
      revenue,
      transactions: transactionCount,
      averageOrderValue,
      growthRate,
      bySource,
      trend,
      period,
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
