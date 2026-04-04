/**
 * Tier 1 Foundation API Routes - Journal
 * Affirmation & Journaling endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerSupabaseClient } from '@/layer-1-security/auth/route-handler';
import { tier1Repositories } from '@/layer-3-data/repositories/tier1-repositories';

// GET /api/tier1/journal - Get journal entries and streaks
export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const limit = parseInt(searchParams.get('limit') || '10');

    const streak = await tier1Repositories.journalStreak.getOrCreate(user.id);
    const affirmations = await tier1Repositories.affirmation.getActiveByUserId(user.id);

    let entries;
    if (date) {
      entries = await tier1Repositories.journalEntry.getByUserIdAndDate(user.id, date);
    } else {
      entries = await tier1Repositories.journalEntry.getRecentEntries(user.id, limit);
    }

    return NextResponse.json({ entries, streak, affirmations });
  } catch (error) {
    console.error('Error fetching journal data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch journal data' },
      { status: 500 }
    );
  }
}

// POST /api/tier1/journal - Create journal entry
export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const today = new Date().toISOString().split('T')[0];

    // Create journal entry
    const entry = await tier1Repositories.journalEntry.create({
      userId: user.id,
      entryType: body.entryType,
      content: body.content,
      mood: body.mood,
      gratitudeItems: body.gratitudeItems || [],
      affirmationsUsed: body.affirmationsUsed || [],
      mindAlignmentScore: body.mindAlignmentScore,
      bodyAlignmentScore: body.bodyAlignmentScore,
      soulAlignmentScore: body.soulAlignmentScore,
      entryDate: today,
    });

    // Update streak
    const streak = await tier1Repositories.journalStreak.getOrCreate(user.id);
    const lastDate = streak.lastEntryDate;
    const isConsecutive = lastDate && 
      new Date(today).getTime() - new Date(lastDate).getTime() <= 86400000;

    await tier1Repositories.journalStreak.update(streak.id, {
      totalEntries: streak.totalEntries + 1,
      currentStreak: isConsecutive ? streak.currentStreak + 1 : 1,
      longestStreak: Math.max(streak.longestStreak, isConsecutive ? streak.currentStreak + 1 : 1),
      morningCompletions: body.entryType === 'morning_ritual' 
        ? streak.morningCompletions + 1 
        : streak.morningCompletions,
      eveningCompletions: body.entryType === 'evening_ritual'
        ? streak.eveningCompletions + 1
        : streak.eveningCompletions,
      lastEntryDate: today,
    });

    // Update affirmation usage counts
    if (body.affirmationsUsed) {
      for (const affirmationId of body.affirmationsUsed) {
        await tier1Repositories.affirmation.incrementUsage(affirmationId);
      }
    }

    return NextResponse.json({ entry, success: true });
  } catch (error) {
    console.error('Error creating journal entry:', error);
    return NextResponse.json(
      { error: 'Failed to create journal entry' },
      { status: 500 }
    );
  }
}

// POST /api/tier1/journal/affirmation - Create affirmation
export async function POSTAffirmation(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    const affirmation = await tier1Repositories.affirmation.create({
      userId: user.id,
      affirmationText: body.affirmationText,
      category: body.category,
      isProofBased: body.isProofBased || false,
      evidenceReference: body.evidenceReference,
      usageCount: 0,
      isActive: true,
    });

    return NextResponse.json({ affirmation, success: true });
  } catch (error) {
    console.error('Error creating affirmation:', error);
    return NextResponse.json(
      { error: 'Failed to create affirmation' },
      { status: 500 }
    );
  }
}
