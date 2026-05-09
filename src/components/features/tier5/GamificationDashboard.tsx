'use client';

import { useState } from 'react';
import { useGamification } from '@/hooks/useGamification';
import { Trophy, Flame, Star, Target, Medal, Crown, Award } from 'lucide-react';

interface GamificationDashboardProps {
  userId: string;
}

export function GamificationDashboard({ userId }: GamificationDashboardProps) {
  const { points, badges, streaks, leaderboard, userRank, loading, error } = useGamification(userId);
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'leaderboard'>('overview');

  if (loading) {
    return (
      <div className="gamification-loading">
        <div className="animate-pulse flex space-x-4">
          <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-48"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gamification-error p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Error loading gamification data: {error}</p>
      </div>
    );
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-yellow-500 text-yellow-900';
      case 'epic': return 'bg-purple-500 text-purple-900';
      case 'rare': return 'bg-blue-500 text-blue-900';
      default: return 'bg-gray-500 text-gray-900';
    }
  };

  return (
    <div className="gamification-dashboard space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          Gamification
        </h2>
        {userRank && (
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full text-white font-semibold">
            <Crown className="w-5 h-5" />
            Rank #{userRank}
          </div>
        )}
      </div>

      {/* Points Overview Card */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-indigo-100 text-sm">Total Points</p>
            <p className="text-4xl font-bold">{points?.totalPoints?.toLocaleString() || 0}</p>
          </div>
          <div className="text-right">
            <p className="text-indigo-100 text-sm">Level {points?.currentLevel || 1}</p>
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-yellow-300" />
              <span className="text-2xl font-bold">
                {points ? Math.floor((points.totalPoints % 100) / 100 * 100) : 0}%
              </span>
            </div>
            <p className="text-xs text-indigo-200">to next level</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="h-2 bg-indigo-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-400 rounded-full transition-all duration-500"
              style={{ width: `${points ? (points.totalPoints % 100) : 0}%` }}
            ></div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <p className="text-2xl font-bold">{points?.weeklyPoints || 0}</p>
            <p className="text-xs text-indigo-200">This Week</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{points?.monthlyPoints || 0}</p>
            <p className="text-xs text-indigo-200">This Month</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{badges.length}</p>
            <p className="text-xs text-indigo-200">Badges</p>
          </div>
        </div>
      </div>

      {/* Streaks */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {streaks.map((streak) => (
          <div
            key={streak.id}
            className={`p-4 rounded-lg border-2 ${
              streak.currentStreak > 0
                ? 'border-orange-400 bg-orange-50'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Flame
                className={`w-6 h-6 ${
                  streak.currentStreak > 0 ? 'text-orange-500' : 'text-gray-400'
                }`}
              />
              <span className="text-2xl font-bold">{streak.currentStreak}</span>
            </div>
            <p className="text-sm text-gray-600 capitalize">
              {streak.streakType.replace('_', ' ')} Streak
            </p>
            {streak.longestStreak > streak.currentStreak && (
              <p className="text-xs text-gray-400">
                Best: {streak.longestStreak}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4">
          {(['overview', 'badges', 'leaderboard'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-4 font-medium capitalize ${
                activeTab === tab
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'badges' && (
          <div className="badges-grid grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {badges.map((userBadge) => (
              <div
                key={userBadge.id}
                className="badge-card p-4 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                    getRarityColor(userBadge.badge?.rarity || 'common')
                  }`}
                >
                  <Award className="w-6 h-6" />
                </div>
                <p className="font-medium text-sm">{userBadge.badge?.name}</p>
                <p className="text-xs text-gray-500 capitalize">
                  {userBadge.badge?.rarity}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(userBadge.earnedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="leaderboard">
            <div className="space-y-2">
              {leaderboard.slice(0, 10).map((entry, index) => (
                <div
                  key={entry.id}
                  className={`flex items-center gap-4 p-3 rounded-lg ${
                    entry.user?.id === userId
                      ? 'bg-indigo-50 border-2 border-indigo-200'
                      : 'bg-gray-50'
                  }`}
                >
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      index === 0
                        ? 'bg-yellow-400 text-yellow-900'
                        : index === 1
                        ? 'bg-gray-300 text-gray-900'
                        : index === 2
                        ? 'bg-orange-400 text-orange-900'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {entry.rank}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium">
                      {entry.user?.name || 'Anonymous'}
                      {entry.user?.id === userId && (
                        <span className="ml-2 text-xs text-indigo-600">(You)</span>
                      )}
                    </p>
                  </div>
                  <p className="font-bold">{entry.score.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="overview space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Quick Stats
                </h4>
                <ul className="mt-2 space-y-1 text-sm text-blue-800">
                  <li>Current Level: {points?.currentLevel || 1}</li>
                  <li>Total Badges: {badges.length}</li>
                  <li>Active Streaks: {streaks.filter(s => s.currentStreak > 0).length}</li>
                </ul>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900 flex items-center gap-2">
                  <Medal className="w-5 h-5" />
                  Achievements
                </h4>
                <ul className="mt-2 space-y-1 text-sm text-green-800">
                  <li>Legendary: {badges.filter(b => b.badge?.rarity === 'legendary').length}</li>
                  <li>Epic: {badges.filter(b => b.badge?.rarity === 'epic').length}</li>
                  <li>Rare: {badges.filter(b => b.badge?.rarity === 'rare').length}</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
