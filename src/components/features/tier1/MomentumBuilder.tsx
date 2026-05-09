'use client';

import React, { useState, useEffect } from 'react';
import { momentumService } from '@/layer-3-data/services/tier1-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp,
  Users,
  Activity,
  Brain,
  GraduationCap,
  Briefcase,
  Heart,
  Zap,
  RotateCcw,
  Target,
  Award,
  Flame
} from 'lucide-react';

interface MomentumDimension {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  stages: string[];
  currentStage: number;
  progressPercentage: number;
  weeklyGoal: string;
}

interface MomentumFlywheel {
  flywheelSpeed: number;
  dimensionsActive: number;
  compoundingMultiplier: number;
  streakDays: number;
  dailyRitualCompleted: boolean;
}

const MOMENTUM_DIMENSIONS: Omit<MomentumDimension, 'currentStage' | 'progressPercentage'>[] = [
  {
    id: 'financial',
    name: 'Financial',
    icon: <TrendingUp className="w-5 h-5" />,
    color: 'bg-green-500',
    stages: ['$0', 'First $1', '$100', '$1K', '$10K', '$100K+'],
    weeklyGoal: '+1 income stream',
  },
  {
    id: 'social',
    name: 'Social',
    icon: <Users className="w-5 h-5" />,
    color: 'bg-blue-500',
    stages: ['Isolation', 'Acquaintances', 'Connections', 'Network', 'Community Leader'],
    weeklyGoal: '3 deep connections',
  },
  {
    id: 'physical',
    name: 'Physical',
    icon: <Activity className="w-5 h-5" />,
    color: 'bg-red-500',
    stages: ['Depleted', 'Surviving', 'Stable', 'Energized', 'Optimized', 'Peak'],
    weeklyGoal: '4 workouts',
  },
  {
    id: 'mental_emotional',
    name: 'Mental/Emotional',
    icon: <Brain className="w-5 h-5" />,
    color: 'bg-purple-500',
    stages: ['Chaotic', 'Reactive', 'Stable', 'Resilient', 'Masterful', 'Unshakeable'],
    weeklyGoal: '5 meditation sessions',
  },
  {
    id: 'educational',
    name: 'Educational',
    icon: <GraduationCap className="w-5 h-5" />,
    color: 'bg-yellow-500',
    stages: ['Beginner', 'Learner', 'Practitioner', 'Skilled', 'Expert', 'Master'],
    weeklyGoal: '1 new skill applied',
  },
  {
    id: 'professional',
    name: 'Professional',
    icon: <Briefcase className="w-5 h-5" />,
    color: 'bg-indigo-500',
    stages: ['No projects', 'Learning', 'Contributing', 'Leading', 'Building', 'Empire'],
    weeklyGoal: '1 milestone achieved',
  },
  {
    id: 'spiritual_meaning',
    name: 'Spiritual/Meaning',
    icon: <Heart className="w-5 h-5" />,
    color: 'bg-pink-500',
    stages: ['Lost', 'Searching', 'Emerging', 'Aligned', 'Purposeful', 'Transcendent'],
    weeklyGoal: '1 contribution made',
  },
];

const MomentumBuilder: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dimensions, setDimensions] = useState<MomentumDimension[]>([]);
  const [flywheel, setFlywheel] = useState<MomentumFlywheel>({
    flywheelSpeed: 0,
    dimensionsActive: 0,
    compoundingMultiplier: 1.0,
    streakDays: 0,
    dailyRitualCompleted: false,
  });
  const [selectedDimension, setSelectedDimension] = useState<string | null>(null);
  const [yesterdayWins, setYesterdayWins] = useState<string[]>([]);

  useEffect(() => {
    loadMomentumData();
  }, []);

  const loadMomentumData = async () => {
    try {
      setIsLoading(true);
      const data = await momentumService.getMomentumData();
      
      // Combine static config with dynamic data
      const mergedDimensions = MOMENTUM_DIMENSIONS.map(dim => {
        const apiDim = data.dimensions?.find((d: {dimensionName: string}) => d.dimensionName === dim.id);
        return {
          ...dim,
          currentStage: apiDim?.currentStage || 0,
          progressPercentage: apiDim?.currentScore || 0,
        };
      });
      
      setDimensions(mergedDimensions);
      
      if (data.flywheel) {
        setFlywheel({
          flywheelSpeed: data.flywheel.flywheelSpeed || 0,
          dimensionsActive: data.flywheel.dimensionsInSync || 0,
          compoundingMultiplier: 1 + (data.flywheel.compoundGrowthRate || 0),
          streakDays: data.stats?.currentStreak || 0,
          dailyRitualCompleted: false,
        });
      }
      
      // Calculate yesterday's wins from dimensions with milestones
      const wins = (data.dimensions as Array<{totalMilestones: number; dimensionName: string}>)
        ?.filter((d) => d.totalMilestones > 0)
        .map((d) => {
          const dim = MOMENTUM_DIMENSIONS.find(md => md.id === d.dimensionName);
          return `${dim?.name}: ${d.totalMilestones} milestones`;
        }) || [];
      setYesterdayWins(wins);
    } catch (error) {
      console.error('Error loading momentum data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const recordProgress = async (dimensionId: string) => {
    try {
      const dim = dimensions.find(d => d.id === dimensionId);
      if (!dim) return;
      
      await momentumService.logActivity({
        dimensionName: dimensionId,
        activityType: 'progress_recorded',
        description: `Progress recorded in ${dim.name}`,
        impactScore: 5,
      });
      
      loadMomentumData();
    } catch (error) {
      console.error('Error recording progress:', error);
    }
  };

  const completeDailyRitual = async () => {
    try {
      await Promise.all(
        dimensions.map(dim => 
          momentumService.logActivity({
            dimensionName: dim.id,
            activityType: 'daily_ritual',
            description: `Daily ritual completed for ${dim.name}`,
            impactScore: 3,
          })
        )
      );
      
      setFlywheel(prev => ({
        ...prev,
        dailyRitualCompleted: true,
        streakDays: prev.streakDays + 1,
      }));
      
      loadMomentumData();
    } catch (error) {
      console.error('Error completing ritual:', error);
    }
  };

  const getOverallMomentum = () => {
    if (dimensions.length === 0) return 0;
    const total = dimensions.reduce((acc, d) => acc + d.progressPercentage, 0);
    return Math.round(total / dimensions.length);
  };

  const getFlywheelSpeedColor = (speed: number) => {
    if (speed >= 80) return 'text-green-500';
    if (speed >= 50) return 'text-blue-500';
    if (speed >= 30) return 'text-yellow-500';
    return 'text-gray-500';
  };

  if (!isOpen) {
    const momentum = getOverallMomentum();
    return (
      <div className="fixed bottom-56 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className={`rounded-full w-14 h-14 shadow-lg transition-all ${
            momentum >= 70 
              ? 'bg-green-600 hover:bg-green-700' 
              : momentum >= 40
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-600 hover:bg-gray-700'
          }`}
        >
          <RotateCcw className="w-6 h-6" />
        </Button>
        {flywheel.streakDays > 0 && (
          <Badge className="absolute -top-2 -right-2 bg-orange-500">
            <Flame className="w-3 h-3 mr-1" />
            {flywheel.streakDays}
          </Badge>
        )}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <Card className="w-full max-w-3xl p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading momentum data...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-6 h-6 text-blue-600" />
            <CardTitle>Momentum Builder - 7-Dimension Progress</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Flywheel Speed</div>
              <div className={`font-bold ${getFlywheelSpeedColor(flywheel.flywheelSpeed)}`}>
                {flywheel.flywheelSpeed} RPM
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <Target className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Flywheel Status */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Momentum Flywheel Effect
              </h3>
              <Badge variant={flywheel.dailyRitualCompleted ? 'default' : 'outline'}>
                {flywheel.dailyRitualCompleted ? 'Ritual Complete' : 'Ritual Pending'}
              </Badge>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-white/50 dark:bg-white/10 p-2 rounded">
                <div className="text-xl font-bold text-blue-600">{flywheel.dimensionsActive}/7</div>
                <div className="text-xs text-muted-foreground">Active</div>
              </div>
              <div className="bg-white/50 dark:bg-white/10 p-2 rounded">
                <div className="text-xl font-bold text-green-600">{flywheel.compoundingMultiplier.toFixed(2)}x</div>
                <div className="text-xs text-muted-foreground">Multiplier</div>
              </div>
              <div className="bg-white/50 dark:bg-white/10 p-2 rounded">
                <div className="text-xl font-bold text-orange-600">{flywheel.streakDays}</div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </div>
              <div className="bg-white/50 dark:bg-white/10 p-2 rounded">
                <div className="text-xl font-bold text-purple-600">{getOverallMomentum()}%</div>
                <div className="text-xs text-muted-foreground">Overall</div>
              </div>
            </div>
            {!flywheel.dailyRitualCompleted && (
              <Button
                onClick={completeDailyRitual}
                className="w-full mt-3 bg-blue-600 hover:bg-blue-700"
                size="sm"
              >
                <Award className="w-4 h-4 mr-2" />
                Complete Daily Momentum Ritual (2 min)
              </Button>
            )}
          </div>

          {/* Yesterday's Wins */}
          {yesterdayWins.length > 0 && (
            <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
              <h4 className="font-medium text-sm text-green-900 dark:text-green-100 mb-2">
                Yesterday's Wins Across Dimensions:
              </h4>
              <div className="flex flex-wrap gap-2">
                {yesterdayWins.map((win, idx) => (
                  <Badge key={idx} variant="outline" className="bg-green-100 text-green-700">
                    {win}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* 7 Dimensions Grid */}
          <div className="space-y-2">
            <h3 className="font-semibold">7-Dimensional Progress</h3>
            <div className="grid grid-cols-1 gap-2">
              {dimensions.map((dim) => (
                <div
                  key={dim.id}
                  onClick={() => setSelectedDimension(selectedDimension === dim.id ? null : dim.id)}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedDimension === dim.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${dim.color} text-white`}>
                      {dim.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{dim.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {dim.stages[dim.currentStage] || dim.stages[0]}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={dim.progressPercentage} className="flex-1 h-2" />
                        <span className="text-xs text-muted-foreground w-8">
                          {dim.progressPercentage}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {selectedDimension === dim.id && (
                    <div className="mt-3 pt-3 border-t space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Weekly Goal:</span> {dim.weeklyGoal}
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        {dim.stages.map((stage, idx) => (
                          <Badge
                            key={idx}
                            variant={idx === dim.currentStage ? 'default' : 'outline'}
                            className={`text-xs ${
                              idx < dim.currentStage ? 'bg-green-100 text-green-700' : ''
                            }`}
                          >
                            {stage}
                          </Badge>
                        ))}
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          recordProgress(dim.id);
                        }}
                        size="sm"
                        className="w-full mt-2"
                        variant="outline"
                      >
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Record Progress
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Momentum Compound Calculator */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Compound Growth Projection</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current momentum:</span>
                <span>{getOverallMomentum()}% average across 7 dimensions</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">With flywheel effect:</span>
                <span className="font-medium text-green-600">
                  +{Math.round(getOverallMomentum() * flywheel.compoundingMultiplier)}% effective
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">30-day projection:</span>
                <span className="font-medium text-blue-600">
                  {Math.min(100, Math.round(getOverallMomentum() * 1.5))}% average
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MomentumBuilder;
