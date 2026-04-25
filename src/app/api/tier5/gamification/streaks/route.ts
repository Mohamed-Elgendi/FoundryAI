// API Route: Gamification Streaks - ACTUAL IMPLEMENTATION

import { NextRequest, NextResponse } from 'next/server';
import { gamificationService } from '@/layer-3-data/services/gamification-service';

// GET: Fetch user streaks
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const streaks = await gamificationService.getUserStreaks(userId);
    return NextResponse.json(streaks);
  } catch (error) {
    console.error('Error fetching user streaks:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Update a streak
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, streakType } = body;

    if (!userId || !streakType) {
      return NextResponse.json(
        { error: 'User ID and streak type are required' },
        { status: 400 }
      );
    }

    const result = await gamificationService.updateStreak(userId, streakType);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating streak:', error);
    return NextResponse.json(
      { error: 'Failed to update streak' },
      { status: 500 }
    );
  }
}
