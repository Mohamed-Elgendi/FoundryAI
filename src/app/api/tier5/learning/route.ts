/**
 * Tier 5 Training & Education API Routes
 * Learning paths, skills, spaced repetition
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerSupabaseClient } from '@/layer-1-security/auth/route-handler';

// GET /api/tier5/learning - Get learning data
export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get active learning paths
    const { data: learningPaths } = await supabase
      .from('learning_paths')
      .select(`
        *,
        learning_modules (
          id,
          module_number,
          title,
          is_completed,
          completion_date
        )
      `)
      .eq('user_id', user.id)
      .order('priority', { ascending: false });

    // Get user skills
    const { data: userSkills } = await supabase
      .from('user_skills')
      .select(`
        *,
        skills (
          skill_name,
          skill_description,
          category_id
        )
      `)
      .eq('user_id', user.id)
      .order('proficiency_level', { ascending: false });

    // Get spaced repetition queue (due today)
    const today = new Date().toISOString().split('T')[0];
    const { data: reviewQueue } = await supabase
      .from('spaced_repetition_queue')
      .select(`
        *,
        knowledge_cards (*)
      `)
      .eq('user_id', user.id)
      .lte('next_review_date', today)
      .eq('is_suspended', false)
      .order('next_review_date', { ascending: true })
      .limit(20);

    // Get daily learning stats
    const { data: todayStats } = await supabase
      .from('daily_learning_stats')
      .select('*')
      .eq('user_id', user.id)
      .eq('stats_date', today)
      .single();

    return NextResponse.json({
      learningPaths: learningPaths || [],
      userSkills: userSkills || [],
      reviewQueue: reviewQueue || [],
      todayStats,
    });
  } catch (error) {
    console.error('Error fetching learning data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch learning data' },
      { status: 500 }
    );
  }
}

// POST /api/tier5/learning/path - Create learning path
export async function POSTPath(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('learning_paths')
      .insert({
        user_id: user.id,
        path_name: body.pathName,
        path_description: body.description,
        category: body.category,
        total_modules: body.totalModules,
        estimated_hours_total: body.estimatedHours,
        priority: body.priority || 5,
        scheduled_start_date: body.startDate,
        target_completion_date: body.targetDate,
        status: 'not_started',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ path: data, success: true });
  } catch (error) {
    console.error('Error creating learning path:', error);
    return NextResponse.json(
      { error: 'Failed to create learning path' },
      { status: 500 }
    );
  }
}

// PATCH /api/tier5/learning/module - Update module progress
export async function PATCHModule(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const updates: any = {
      updated_at: new Date().toISOString(),
    };

    if (body.isCompleted) {
      updates.is_completed = true;
      updates.completion_date = new Date().toISOString();
      updates.time_spent_minutes = body.timeSpent;
    }

    if (body.quizScore !== undefined) {
      updates.quiz_score = body.quizScore;
      updates.quiz_passed = body.quizPassed;
    }

    const { data, error } = await supabase
      .from('learning_modules')
      .update(updates)
      .eq('id', body.moduleId)
      .select()
      .single();

    if (error) throw error;

    // Update learning path progress
    if (body.isCompleted) {
      await supabase.rpc('update_learning_path_progress', {
        p_path_id: data.path_id,
      });
    }

    return NextResponse.json({ module: data, success: true });
  } catch (error) {
    console.error('Error updating module:', error);
    return NextResponse.json(
      { error: 'Failed to update module' },
      { status: 500 }
    );
  }
}

// POST /api/tier5/learning/card-review - Review spaced repetition card
export async function POSTCardReview(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { cardId, queueId, rating, responseTimeSeconds } = body;

    // Record review history
    await supabase
      .from('review_history')
      .insert({
        user_id: user.id,
        card_id: cardId,
        queue_id: queueId,
        rating,
        response_time_seconds: responseTimeSeconds,
        reviewed_at: new Date().toISOString(),
      });

    // Calculate next review date (SM-2 algorithm simplified)
    const { data: queue } = await supabase
      .from('spaced_repetition_queue')
      .select('*')
      .eq('id', queueId)
      .single();

    let interval = queue.interval_days;
    let easeFactor = queue.ease_factor;
    let repetitions = queue.repetition_count;

    if (rating >= 3) {
      // Good or Easy
      if (repetitions === 0) {
        interval = 1;
      } else if (repetitions === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      repetitions += 1;
      
      if (rating === 4) {
        easeFactor = Math.min(2.5, easeFactor + 0.15);
      }
    } else {
      // Again or Hard
      repetitions = 0;
      interval = 1;
      easeFactor = Math.max(1.3, easeFactor - 0.2);
    }

    // Update queue
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + interval);

    const { data: updatedQueue, error } = await supabase
      .from('spaced_repetition_queue')
      .update({
        interval_days: interval,
        repetition_count: repetitions,
        ease_factor: easeFactor,
        next_review_date: nextReviewDate.toISOString().split('T')[0],
        last_reviewed_at: new Date().toISOString(),
        last_rating: rating,
        total_reviews: queue.total_reviews + 1,
        correct_reviews: rating >= 3 ? queue.correct_reviews + 1 : queue.correct_reviews,
        streak: rating >= 3 ? queue.streak + 1 : 0,
        updated_at: new Date().toISOString(),
      })
      .eq('id', queueId)
      .select()
      .single();

    if (error) throw error;

    // Add XP for reviewing
    await supabase.rpc('add_xp', {
      p_user_id: user.id,
      p_xp_amount: rating >= 3 ? 5 : 2,
      p_source: 'card_review',
    });

    return NextResponse.json({
      queue: updatedQueue,
      nextReviewDate: nextReviewDate.toISOString().split('T')[0],
      success: true,
    });
  } catch (error) {
    console.error('Error reviewing card:', error);
    return NextResponse.json(
      { error: 'Failed to review card' },
      { status: 500 }
    );
  }
}
