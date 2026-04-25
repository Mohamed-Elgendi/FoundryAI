// Gamification Service - ACTUAL IMPLEMENTATION
// Beast Mode - Real Working Code

import { supabase } from '@/lib/supabase';
import type {
  UserPoints,
  Badge,
  UserBadge,
  LeaderboardEntry,
  UserStreak,
  GamificationEvent,
  DEFAULT_BADGES
} from '@/types/gamification';

export class GamificationService {
  private static instance: GamificationService;
  private eventListeners: ((event: GamificationEvent) => void)[] = [];

  static getInstance(): GamificationService {
    if (!GamificationService.instance) {
      GamificationService.instance = new GamificationService();
    }
    return GamificationService.instance;
  }

  // Award points to user
  async awardPoints(
    userId: string,
    points: number,
    reason: string,
    metadata?: Record<string, any>
  ): Promise<UserPoints> {
    try {
      // Call the database function
      const { data, error } = await supabase.rpc('award_points', {
        p_user_id: userId,
        p_points: points,
        p_reason: reason,
        p_metadata: metadata || {}
      });

      if (error) throw error;

      // Emit event
      this.emitEvent({
        type: 'points_earned',
        points,
        reason
      });

      // Check for new badges after awarding points
      await this.checkAndAwardBadges(userId);

      return data;
    } catch (error) {
      console.error('Error awarding points:', error);
      throw error;
    }
  }

  // Get user points
  async getUserPoints(userId: string): Promise<UserPoints | null> {
    try {
      const { data, error } = await supabase
        .from('user_points')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user points:', error);
      return null;
    }
  }

  // Get or create user points
  async getOrCreateUserPoints(userId: string): Promise<UserPoints> {
    const existing = await this.getUserPoints(userId);
    if (existing) return existing;

    try {
      const { data, error } = await supabase
        .from('user_points')
        .insert({
          user_id: userId,
          total_points: 0,
          current_level: 1,
          weekly_points: 0,
          monthly_points: 0,
          streak_days: 0
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating user points:', error);
      throw error;
    }
  }

  // Check and award badges
  async checkAndAwardBadges(userId: string): Promise<UserBadge[]> {
    const earnedBadges: UserBadge[] = [];

    try {
      // Get user's current badges
      const { data: userBadges } = await supabase
        .from('user_badges')
        .select('badge_id')
        .eq('user_id', userId);

      const earnedBadgeIds = new Set(userBadges?.map(ub => ub.badge_id) || []);

      // Get all badges not yet earned
      const { data: availableBadges, error } = await supabase
        .from('badges')
        .select('*')
        .not('id', 'in', `(${Array.from(earnedBadgeIds).join(',')})`)
        .eq('active', true);

      if (error) throw error;

      for (const badge of availableBadges || []) {
        const earned = await this.checkBadgeCriteria(userId, badge);
        if (earned) {
          const userBadge = await this.awardBadge(userId, badge.id);
          if (userBadge) {
            earnedBadges.push(userBadge);

            this.emitEvent({
              type: 'badge_earned',
              badge
            });
          }
        }
      }

      return earnedBadges;
    } catch (error) {
      console.error('Error checking badges:', error);
      return earnedBadges;
    }
  }

  // Award a badge to user
  async awardBadge(userId: string, badgeId: string): Promise<UserBadge | null> {
    try {
      const { data, error } = await supabase
        .from('user_badges')
        .insert({
          user_id: userId,
          badge_id: badgeId
        })
        .select('*, badge:badge_id(*)')
        .single();

      if (error) {
        // Badge might already exist
        if (error.code === '23505') return null;
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error awarding badge:', error);
      return null;
    }
  }

  // Get user's badges
  async getUserBadges(userId: string): Promise<UserBadge[]> {
    try {
      const { data, error } = await supabase
        .from('user_badges')
        .select('*, badge:badge_id(*)')
        .eq('user_id', userId)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user badges:', error);
      return [];
    }
  }

  // Update streak
  async updateStreak(userId: string, streakType: string): Promise<UserStreak | null> {
    try {
      const today = new Date().toISOString().split('T')[0];

      const { data: existingStreak } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', userId)
        .eq('streak_type', streakType)
        .single();

      if (!existingStreak) {
        // Create new streak
        const { data, error } = await supabase
          .from('user_streaks')
          .insert({
            user_id: userId,
            streak_type: streakType,
            current_streak: 1,
            longest_streak: 1,
            last_activity_date: today
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        const lastDate = new Date(existingStreak.last_activity_date);
        const todayDate = new Date(today);
        const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          // Continue streak
          const newStreak = existingStreak.current_streak + 1;
          const { data, error } = await supabase
            .from('user_streaks')
            .update({
              current_streak: newStreak,
              longest_streak: Math.max(newStreak, existingStreak.longest_streak),
              last_activity_date: today
            })
            .eq('id', existingStreak.id)
            .select()
            .single();

          if (error) throw error;

          // Award streak milestone points
          if (newStreak % 7 === 0) {
            await this.awardPoints(
              userId,
              newStreak * 10,
              `${newStreak}-day ${streakType} streak milestone!`
            );

            this.emitEvent({
              type: 'streak_milestone',
              streak: newStreak,
              streakType
            });
          }

          return data;
        } else if (diffDays > 1) {
          // Streak broken, start new
          const { data, error } = await supabase
            .from('user_streaks')
            .update({
              current_streak: 1,
              last_activity_date: today
            })
            .eq('id', existingStreak.id)
            .select()
            .single();

          if (error) throw error;
          return data;
        }

        return existingStreak;
      }
    } catch (error) {
      console.error('Error updating streak:', error);
      return null;
    }
  }

  // Get user streaks
  async getUserStreaks(userId: string): Promise<UserStreak[]> {
    try {
      const { data, error } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user streaks:', error);
      return [];
    }
  }

  // Get leaderboard
  async getLeaderboard(
    category: string = 'global',
    limit: number = 100
  ): Promise<LeaderboardEntry[]> {
    try {
      const { data, error } = await supabase
        .from('leaderboard_entries')
        .select('*, user:user_id(id, name, avatar_url)')
        .eq('category', category)
        .order('rank', { ascending: true })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }
  }

  // Get user's rank
  async getUserRank(userId: string, category: string = 'global'): Promise<number | null> {
    try {
      const { data, error } = await supabase
        .from('leaderboard_entries')
        .select('rank')
        .eq('user_id', userId)
        .eq('category', category)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data?.rank || null;
    } catch (error) {
      console.error('Error fetching user rank:', error);
      return null;
    }
  }

  // Calculate user level from points
  calculateLevel(totalPoints: number): number {
    // Exponential level curve: Level = floor(sqrt(points / 100)) + 1
    return Math.floor(Math.sqrt(totalPoints / 100)) + 1;
  }

  // Get points needed for next level
  getPointsForNextLevel(currentLevel: number): number {
    return Math.pow(currentLevel, 2) * 100;
  }

  // Get progress to next level
  getLevelProgress(totalPoints: number, currentLevel: number): number {
    const pointsForCurrentLevel = Math.pow(currentLevel - 1, 2) * 100;
    const pointsForNextLevel = Math.pow(currentLevel, 2) * 100;
    const pointsInLevel = totalPoints - pointsForCurrentLevel;
    const pointsNeeded = pointsForNextLevel - pointsForCurrentLevel;
    return Math.min(100, Math.floor((pointsInLevel / pointsNeeded) * 100));
  }

  // Event system
  onEvent(callback: (event: GamificationEvent) => void): () => void {
    this.eventListeners.push(callback);
    return () => {
      const index = this.eventListeners.indexOf(callback);
      if (index > -1) this.eventListeners.splice(index, 1);
    };
  }

  private emitEvent(event: GamificationEvent): void {
    this.eventListeners.forEach(callback => {
      try {
        callback(event);
      } catch (e) {
        console.error('Error in gamification event listener:', e);
      }
    });
  }

  // Private helper methods
  private async checkBadgeCriteria(userId: string, badge: Badge): Promise<boolean> {
    const { type, value, action } = badge.criteria;

    try {
      switch (type) {
        case 'points': {
          const { data: points } = await supabase
            .from('user_points')
            .select('total_points')
            .eq('user_id', userId)
            .single();
          return (points?.total_points || 0) >= value;
        }

        case 'streak': {
          const { data: streaks } = await supabase
            .from('user_streaks')
            .select('current_streak')
            .eq('user_id', userId)
            .gte('current_streak', value);
          return (streaks?.length || 0) > 0;
        }

        case 'actions': {
          if (!action) return false;
          // This would check activity_logs table
          const { count } = await supabase
            .from('activity_logs')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('action', action)
            .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
          return (count || 0) >= value;
        }

        case 'revenue': {
          // Check if user has generated revenue
          const { data: revenue } = await supabase
            .from('revenue_transactions')
            .select('amount')
            .eq('user_id', userId)
            .gt('amount', 0)
            .limit(1);
          return (revenue?.length || 0) >= value;
        }

        default:
          return false;
      }
    } catch (error) {
      console.error('Error checking badge criteria:', error);
      return false;
    }
  }
}

export const gamificationService = GamificationService.getInstance();
