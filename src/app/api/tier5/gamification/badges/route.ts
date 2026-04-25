// API Route: Gamification Badges - ACTUAL IMPLEMENTATION

import { NextRequest, NextResponse } from 'next/server';
import { gamificationService } from '@/layer-3-data/services/gamification-service';

// GET: Fetch user badges
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const badges = await gamificationService.getUserBadges(userId);
    return NextResponse.json(badges);
  } catch (error) {
    console.error('Error fetching user badges:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Check and award badges
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const newBadges = await gamificationService.checkAndAwardBadges(userId);
    
    return NextResponse.json({
      success: true,
      newBadges,
      count: newBadges.length
    });
  } catch (error) {
    console.error('Error checking badges:', error);
    return NextResponse.json(
      { error: 'Failed to check badges' },
      { status: 500 }
    );
  }
}
