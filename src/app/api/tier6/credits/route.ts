// API Route: User Credits - ACTUAL IMPLEMENTATION

import { NextRequest, NextResponse } from 'next/server';
import { billingService } from '@/layer-3-data/services/billing-service';

// GET: Fetch user credits
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const credits = await billingService.getOrCreateUserCredits(userId);
    return NextResponse.json(credits);
  } catch (error) {
    console.error('Error fetching user credits:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Calculate credits cost
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { featureType, inputTokens, outputTokens } = body;

    if (!featureType) {
      return NextResponse.json(
        { error: 'Feature type is required' },
        { status: 400 }
      );
    }

    const calculation = await billingService.calculateCredits(
      featureType,
      inputTokens || 0,
      outputTokens || 0
    );

    return NextResponse.json(calculation);
  } catch (error) {
    console.error('Error calculating credits:', error);
    return NextResponse.json(
      { error: 'Failed to calculate credits' },
      { status: 500 }
    );
  }
}
