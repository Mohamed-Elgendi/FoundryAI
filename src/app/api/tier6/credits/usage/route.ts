// API Route: Credit Usage - ACTUAL IMPLEMENTATION

import { NextRequest, NextResponse } from 'next/server';
import { billingService } from '@/layer-3-data/services/billing-service';

// GET: Fetch usage statistics
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    const period = (request.nextUrl.searchParams.get('period') as any) || 'month';

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const stats = await billingService.getUsageStats(userId, period);
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching usage stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
