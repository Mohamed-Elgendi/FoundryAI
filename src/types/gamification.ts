// Gamification System Types - ACTUAL IMPLEMENTATION
// Generated during BEAST MODE execution

export interface UserPoints {
  id: string;
  userId: string;
  totalPoints: number;
  currentLevel: number;
  weeklyPoints: number;
  monthlyPoints: number;
  streakDays: number;
  lastActivityDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  category: 'learning' | 'productivity' | 'revenue' | 'social';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  pointsAwarded: number;
  criteria: BadgeCriteria;
  createdAt: Date;
}

export interface BadgeCriteria {
  type: 'streak' | 'points' | 'actions' | 'revenue';
  value: number;
  action?: string;
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  badge?: Badge;
  earnedAt: Date;
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  category: string;
  archetype?: string;
  score: number;
  rank: number;
  periodStart: Date;
  periodEnd: Date;
  updatedAt: Date;
}

export interface UserStreak {
  id: string;
  userId: string;
  streakType: string;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date;
  createdAt: Date;
}

export interface GamificationEventData {
  type: 'points_earned' | 'badge_earned' | 'level_up' | 'streak_milestone';
  points?: number;
  reason?: string;
  badge?: Badge;
  newLevel?: number;
  streak?: number;
  streakType?: string;
}

export type GamificationEvent = GamificationEventData;

// Default badges configuration
export const DEFAULT_BADGES: Omit<Badge, 'id' | 'createdAt'>[] = [
  {
    name: 'First Steps',
    description: 'Complete your first action on the platform',
    iconUrl: '/badges/first-steps.svg',
    category: 'learning',
    rarity: 'common',
    pointsAwarded: 10,
    criteria: { type: 'actions', value: 1, action: 'first_action' }
  },
  {
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    iconUrl: '/badges/week-warrior.svg',
    category: 'productivity',
    rarity: 'rare',
    pointsAwarded: 100,
    criteria: { type: 'streak', value: 7 }
  },
  {
    name: 'Point Collector',
    description: 'Earn 1,000 total points',
    iconUrl: '/badges/point-collector.svg',
    category: 'learning',
    rarity: 'rare',
    pointsAwarded: 50,
    criteria: { type: 'points', value: 1000 }
  },
  {
    name: 'Revenue Generator',
    description: 'Generate your first revenue',
    iconUrl: '/badges/revenue-gen.svg',
    category: 'revenue',
    rarity: 'epic',
    pointsAwarded: 200,
    criteria: { type: 'revenue', value: 1 }
  },
  {
    name: 'Month Master',
    description: 'Maintain a 30-day streak',
    iconUrl: '/badges/month-master.svg',
    category: 'productivity',
    rarity: 'legendary',
    pointsAwarded: 500,
    criteria: { type: 'streak', value: 30 }
  }
];
