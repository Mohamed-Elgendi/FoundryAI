// API Route: Gamification Leaderboard - ACTUAL IMPLEMENTATION

import { NextRequest, NextResponse } from 'next/server';
import { gamificationService } from '@/layer-3-data/services/gamification-service';

// GET: Fetch leaderboard
export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get('category') || 'global';
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '100', 10);
    const userId = request.nextUrl.searchParams.get('userId');

    // Get leaderboard
    const leaderboard = await gamificationService.getLeaderboard(category, limit);

    // If userId provided, get their rank too
    let userRank = null;
    if (userId) {
      userRank = await gamificationService.getUserRank(userId, category);
    }

    return NextResponse.json({
      leaderboard,
      userRank,
      category,
      total: leaderboard.length
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
