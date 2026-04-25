// API Route: Credit Transactions - ACTUAL IMPLEMENTATION

import { NextRequest, NextResponse } from 'next/server';
import { billingService } from '@/layer-3-data/services/billing-service';

// GET: Fetch transaction history
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '50', 10);

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const transactions = await billingService.getTransactions(userId, limit);
    return NextResponse.json({
      transactions,
      count: transactions.length,
      limit
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
