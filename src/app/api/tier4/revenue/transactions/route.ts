/**
 * Revenue Transactions API
 * GET /api/tier4/revenue/transactions
 * POST /api/tier4/revenue/transactions
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
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const source = searchParams.get('source');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let query = supabase
      .from('foundryai_revenue_transactions')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('transaction_date', { ascending: false })
      .range(offset, offset + limit - 1);

    if (source) query = query.eq('source', source);
    if (startDate) query = query.gte('transaction_date', startDate);
    if (endDate) query = query.lte('transaction_date', endDate);

    const { data, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      transactions: data || [],
      total: count || 0,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
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
      .from('foundryai_revenue_transactions')
      .insert({
        user_id: user.id,
        amount: body.amount,
        currency: body.currency || 'USD',
        source: body.source,
        description: body.description,
        opportunity_id: body.opportunityId,
        project_id: body.projectId,
        customer_id: body.customerId,
        transaction_date: body.transactionDate || new Date().toISOString(),
        transaction_type: body.transactionType || 'income',
        payment_method: body.paymentMethod,
        payment_status: body.paymentStatus || 'completed',
        is_recurring: body.isRecurring || false,
        recurring_interval: body.recurringInterval,
        tax_amount: body.taxAmount || 0,
        fee_amount: body.feeAmount || 0,
        metadata: body.metadata || {},
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Create transaction error:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}
