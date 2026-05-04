// API Route: Gamification - Main Entry Point
// Beast Mode - Production Ready

import { NextResponse } from 'next/server';

// GET: List available gamification endpoints
export async function GET() {
  return NextResponse.json({
    message: 'FoundryAI Gamification API',
    endpoints: {
      points: '/api/tier5/gamification/points',
      badges: '/api/tier5/gamification/badges',
      streaks: '/api/tier5/gamification/streaks',
      leaderboard: '/api/tier5/gamification/leaderboard',
    },
    documentation: 'Gamification system for tracking user progress and achievements',
  });
}
