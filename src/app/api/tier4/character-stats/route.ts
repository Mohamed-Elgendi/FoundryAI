/**
 * Tier 4 Character Stats API Routes
 * Gamification, achievements, character progression
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerSupabaseClient } from '@/layer-1-security/auth/route-handler';

// GET /api/tier4/character-stats - Get user's character stats and gamification data
export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get latest character stats
    const { data: stats } = await supabase
      .from('character_stats')
      .select('*')
      .eq('user_id', user.id)
      .order('recorded_at', { ascending: false })
      .limit(1)
      .single();

    // Get gamification progress
    const { data: gamification } = await supabase
      .from('gamification_progress')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Get recent achievements
    const { data: achievements } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', user.id)
      .order('unlocked_at', { ascending: false })
      .limit(10);

    // Get all achievements count by rarity
    const { data: achievementStats } = await supabase
      .from('achievements')
      .select('rarity, count')
      .eq('user_id', user.id)
      .group('rarity');

    return NextResponse.json({
      stats,
      gamification,
      achievements: achievements || [],
      achievementStats: achievementStats || [],
    });
  } catch (error) {
    console.error('Error fetching character stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch character stats' },
      { status: 500 }
    );
  }
}

// POST /api/tier4/character-stats - Record new character stats
export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('character_stats')
      .insert({
        user_id: user.id,
        resilience: body.resilience,
        creativity: body.creativity,
        discipline: body.discipline,
        intelligence: body.intelligence,
        charisma: body.charisma,
        luck: body.luck,
        adaptability: body.adaptability,
        current_level: body.currentLevel,
        experience_points: body.experiencePoints,
        next_level_xp: body.nextLevelXp,
        recorded_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ stats: data, success: true });
  } catch (error) {
    console.error('Error recording character stats:', error);
    return NextResponse.json(
      { error: 'Failed to record character stats' },
      { status: 500 }
    );
  }
}

// POST /api/tier4/character-stats/achievement - Unlock achievement
export async function POSTAchievement(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Check if achievement already unlocked
    const { data: existing } = await supabase
      .from('achievements')
      .select('id')
      .eq('user_id', user.id)
      .eq('achievement_id', body.achievementId)
      .single();

    if (existing) {
      return NextResponse.json({ 
        error: 'Achievement already unlocked',
        achievement: existing 
      }, { status: 409 });
    }

    // Create achievement
    const { data: achievement, error } = await supabase
      .from('achievements')
      .insert({
        user_id: user.id,
        achievement_id: body.achievementId,
        achievement_name: body.name,
        achievement_description: body.description,
        rarity: body.rarity || 'common',
        points: body.points || 10,
        category: body.category,
        unlocked_at: new Date().toISOString(),
        unlock_context: body.context || {},
      })
      .select()
      .single();

    if (error) throw error;

    // Update gamification progress
    await supabase.rpc('increment_achievement_count', {
      p_user_id: user.id,
      p_points: body.points || 10,
    });

    // Add coins for achievement
    await supabase.rpc('add_coins', {
      p_user_id: user.id,
      p_amount: (body.points || 10) * 10, // 10 coins per point
      p_transaction_type: 'achievement',
      p_description: `Unlocked: ${body.name}`,
    });

    return NextResponse.json({ achievement, success: true });
  } catch (error) {
    console.error('Error unlocking achievement:', error);
    return NextResponse.json(
      { error: 'Failed to unlock achievement' },
      { status: 500 }
    );
  }
}

// POST /api/tier4/character-stats/xp - Add experience points
export async function POSTXp(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Get current gamification data
    const { data: gamification } = await supabase
      .from('gamification_progress')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!gamification) {
      return NextResponse.json({ error: 'Gamification data not found' }, { status: 404 });
    }

    const newXp = gamification.total_experience + body.xpAmount;
    const newLevel = Math.floor(newXp / 100) + 1;
    const levelUp = newLevel > gamification.current_level;

    // Update gamification progress
    const { data: updated, error } = await supabase
      .from('gamification_progress')
      .update({
        total_experience: newXp,
        current_level: newLevel,
        experience_to_next_level: (newLevel * 100) - newXp,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      gamification: updated,
      levelUp,
      newLevel,
      xpGained: body.xpAmount,
      success: true,
    });
  } catch (error) {
    console.error('Error adding XP:', error);
    return NextResponse.json(
      { error: 'Failed to add XP' },
      { status: 500 }
    );
  }
}
