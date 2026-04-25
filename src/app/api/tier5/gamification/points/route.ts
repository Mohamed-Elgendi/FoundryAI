// API Route: Gamification Points - ACTUAL IMPLEMENTATION
// Beast Mode - Production Ready

import { NextRequest, NextResponse } from 'next/server';
import { gamificationService } from '@/layer-3-data/services/gamification-service';

// GET: Fetch user points
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const points = await gamificationService.getUserPoints(userId);
    
    if (!points) {
      return NextResponse.json(
        { error: 'User points not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(points);
  } catch (error) {
    console.error('Error fetching user points:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Award points to user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, points, reason, metadata } = body;

    if (!userId || typeof points !== 'number' || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, points, reason' },
        { status: 400 }
      );
    }

    const result = await gamificationService.awardPoints(userId, points, reason, metadata);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error awarding points:', error);
    return NextResponse.json(
      { error: 'Failed to award points' },
      { status: 500 }
    );
  }
}
