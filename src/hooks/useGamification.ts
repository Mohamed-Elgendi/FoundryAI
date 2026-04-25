// React Hook for Gamification - ACTUAL IMPLEMENTATION
// Beast Mode - Production Ready

'use client';

import { useState, useEffect, useCallback } from 'react';
import { gamificationService } from '@/layer-3-data/services/gamification-service';
import type { UserPoints, UserBadge, UserStreak, LeaderboardEntry, GamificationEvent } from '@/types/gamification';

interface UseGamificationReturn {
  points: UserPoints | null;
  badges: UserBadge[];
  streaks: UserStreak[];
  leaderboard: LeaderboardEntry[];
  userRank: number | null;
  loading: boolean;
  error: string | null;
  awardPoints: (points: number, reason: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useGamification(userId?: string): UseGamificationReturn {
  const [points, setPoints] = useState<UserPoints | null>(null);
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [streaks, setStreaks] = useState<UserStreak[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch all gamification data in parallel
      const [pointsData, badgesData, streaksData, leaderboardData, rankData] = await Promise.all([
        gamificationService.getUserPoints(userId),
        gamificationService.getUserBadges(userId),
        gamificationService.getUserStreaks(userId),
        gamificationService.getLeaderboard('global', 100),
        gamificationService.getUserRank(userId, 'global')
      ]);

      setPoints(pointsData);
      setBadges(badgesData);
      setStreaks(streaksData);
      setLeaderboard(leaderboardData);
      setUserRank(rankData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch gamification data');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Listen for gamification events
  useEffect(() => {
    if (!userId) return;

    const unsubscribe = gamificationService.onEvent((event: GamificationEvent) => {
      // Refresh data when events occur
      fetchData();
    });

    return () => {
      unsubscribe();
    };
  }, [userId, fetchData]);

  const awardPoints = useCallback(async (points: number, reason: string) => {
    if (!userId) return;

    try {
      await gamificationService.awardPoints(userId, points, reason);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to award points');
    }
  }, [userId, fetchData]);

  return {
    points,
    badges,
    streaks,
    leaderboard,
    userRank,
    loading,
    error,
    awardPoints,
    refresh: fetchData
  };
}
