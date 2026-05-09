'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Swords, 
  Shield, 
  Sparkles, 
  Brain, 
  Users, 
  Zap,
  Target,
  Trophy,
  Star,
  Flame,
  TrendingUp,
  Award
} from 'lucide-react';

interface CharacterStats {
  resilience: number;
  creativity: number;
  discipline: number;
  intelligence: number;
  charisma: number;
  luck: number;
  adaptability: number;
  totalPower: number;
  averageStat: number;
}

interface GamificationData {
  currentLevel: number;
  totalExperience: number;
  experienceToNextLevel: number;
  achievementsUnlocked: number;
  loginStreak: number;
  badgesEarned: string[];
  currentTitle: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  points: number;
  unlockedAt: string;
  icon: string;
}

export default function CharacterStatsDashboard() {
  const [stats, setStats] = useState<CharacterStats | null>(null);
  const [gamification, setGamification] = useState<GamificationData | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAllAchievements, setShowAllAchievements] = useState(false);

  useEffect(() => {
    loadCharacterData();
  }, []);

  const loadCharacterData = async () => {
    try {
      setIsLoading(true);
      // Simulated API calls - replace with actual services
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock character stats
      setStats({
        resilience: 78,
        creativity: 85,
        discipline: 72,
        intelligence: 88,
        charisma: 65,
        luck: 58,
        adaptability: 80,
        totalPower: 526,
        averageStat: 75
      });

      // Mock gamification data
      setGamification({
        currentLevel: 12,
        totalExperience: 2450,
        experienceToNextLevel: 3000,
        achievementsUnlocked: 23,
        loginStreak: 7,
        badgesEarned: ['First Win', 'Streak Master', 'Deep Worker', 'Idea Machine'],
        currentTitle: 'Rising Founder'
      });

      // Mock achievements
      setAchievements([
        { id: '1', name: 'First Revenue', description: 'Earn your first $1 online', rarity: 'common', points: 10, unlockedAt: '2024-01-15', icon: 'dollar' },
        { id: '2', name: '7-Day Streak', description: 'Log in for 7 consecutive days', rarity: 'common', points: 15, unlockedAt: '2024-01-20', icon: 'flame' },
        { id: '3', name: 'Deep Work Master', description: 'Complete 10 hours of deep work', rarity: 'uncommon', points: 25, unlockedAt: '2024-01-25', icon: 'target' },
        { id: '4', name: 'Mindset Shift', description: 'Complete the 4-week mindset program', rarity: 'rare', points: 50, unlockedAt: '2024-02-01', icon: 'brain' },
        { id: '5', name: 'Business Launched', description: 'Launch your first business', rarity: 'epic', points: 100, unlockedAt: '2024-02-15', icon: 'rocket' },
      ]);
    } catch (error) {
      console.error('Error loading character data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatIcon = (statName: string) => {
    const icons: Record<string, React.ElementType> = {
      resilience: Shield,
      creativity: Sparkles,
      discipline: Target,
      intelligence: Brain,
      charisma: Users,
      luck: Zap,
      adaptability: TrendingUp
    };
    return icons[statName] || Star;
  };

  const getStatColor = (statName: string) => {
    const colors: Record<string, string> = {
      resilience: 'bg-red-500',
      creativity: 'bg-purple-500',
      discipline: 'bg-blue-500',
      intelligence: 'bg-indigo-500',
      charisma: 'bg-pink-500',
      luck: 'bg-yellow-500',
      adaptability: 'bg-green-500'
    };
    return colors[statName] || 'bg-slate-500';
  };

  const getRarityColor = (rarity: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      common: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
      uncommon: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
      rare: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
      epic: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
      legendary: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' }
    };
    return colors[rarity] || colors.common;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const experienceProgress = gamification 
    ? (gamification.totalExperience / gamification.experienceToNextLevel) * 100 
    : 0;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
          <Swords className="w-8 h-8 text-violet-600" />
          Character Stats & Progression
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Track your 7 core attributes, level up your founder character, and unlock achievements.
        </p>
      </div>

      {/* Level & Title Card */}
      {gamification && (
        <Card className="bg-gradient-to-r from-violet-600 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                  <Trophy className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-sm text-violet-100">Current Level</div>
                  <div className="text-3xl font-bold">Level {gamification.currentLevel}</div>
                  <div className="text-violet-100">{gamification.currentTitle}</div>
                </div>
              </div>
              
              <div className="flex-1 max-w-md">
                <div className="flex justify-between text-sm mb-2">
                  <span>XP: {gamification.totalExperience.toLocaleString()}</span>
                  <span>Next: {gamification.experienceToNextLevel.toLocaleString()}</span>
                </div>
                <Progress value={experienceProgress} className="h-3 bg-white/20" />
                <div className="text-center text-sm text-violet-100 mt-1">
                  {Math.round(experienceProgress)}% to Level {gamification.currentLevel + 1}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <Flame className="w-5 h-5 text-orange-400" />
                    <span className="text-2xl font-bold">{gamification.loginStreak}</span>
                  </div>
                  <div className="text-xs text-violet-100">Day Streak</div>
                </div>
                <div className="text-center">
                  <Award className="w-5 h-5 mx-auto text-amber-400" />
                  <div className="text-2xl font-bold">{gamification.achievementsUnlocked}</div>
                  <div className="text-xs text-violet-100">Achievements</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Character Stats Grid */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-violet-600" />
              Core Attributes
            </CardTitle>
            <CardDescription>Your 7-dimensional character stats</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(stats)
                .filter(([key]) => !['totalPower', 'averageStat'].includes(key))
                .map(([statName, value]) => {
                  const Icon = getStatIcon(statName);
                  const colorClass = getStatColor(statName);
                  
                  return (
                    <div key={statName} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg ${colorClass} flex items-center justify-center`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-medium capitalize">{statName}</span>
                        </div>
                        <span className="text-lg font-bold">{value}</span>
                      </div>
                      <Progress value={value} className={`h-2 ${colorClass}`} />
                    </div>
                  );
                })}
            </div>

            {/* Total Power */}
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Total Power</div>
                    <div className="text-sm text-slate-600">Combined stat strength</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-violet-600">{stats.totalPower}</div>
                  <div className="text-sm text-slate-600">Avg: {stats.averageStat}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Badges */}
      {gamification && gamification.badgesEarned.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-violet-600" />
              Earned Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {gamification.badgesEarned.map((badge, idx) => (
                <Badge key={idx} variant="outline" className="px-3 py-1">
                  <Star className="w-3 h-3 mr-1 text-amber-500" />
                  {badge}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Achievements */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-violet-600" />
              Recent Achievements
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAllAchievements(!showAllAchievements)}
            >
              {showAllAchievements ? 'Show Less' : 'View All'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {achievements
              .slice(0, showAllAchievements ? undefined : 3)
              .map((achievement) => {
                const rarityColors = getRarityColor(achievement.rarity);
                
                return (
                  <div 
                    key={achievement.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${rarityColors.bg} ${rarityColors.border}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${rarityColors.bg}`}>
                        <Trophy className={`w-5 h-5 ${rarityColors.text}`} />
                      </div>
                      <div>
                        <div className="font-semibold">{achievement.name}</div>
                        <div className="text-sm text-slate-600">{achievement.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={rarityColors.bg + ' ' + rarityColors.text}>
                        {achievement.rarity}
                      </Badge>
                      <div className="text-sm text-slate-500 mt-1">+{achievement.points} XP</div>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
