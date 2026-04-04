/**
 * Tier 1 Foundation Dashboard Integration
 * Example of how to use the Tier 1 hooks in a dashboard view
 */

'use client';

import React from 'react';
import { useTier1Dashboard } from '@/hooks/useTier1Data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, TrendingUp, Brain, Target, Zap, Heart, BookOpen, RotateCcw } from 'lucide-react';

export function Tier1DashboardSummary() {
  const { data, isLoading, error } = useTier1Dashboard();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-24 mb-4" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-700">Failed to load foundation data. Please try again.</p>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const systems = [
    {
      name: 'Belief Architecture',
      icon: Target,
      score: data.belief?.score?.overallScore || 50,
      level: data.belief?.score?.level || 1,
      color: 'text-amber-600',
      bgColor: 'bg-amber-500',
    },
    {
      name: 'Success Mindset',
      icon: Brain,
      score: data.mindset?.pillars?.reduce((acc: number, p: {currentScore: number}) => acc + p.currentScore, 0) / (data.mindset?.pillars?.length || 1) || 50,
      count: data.mindset?.pillars?.length || 0,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500',
    },
    {
      name: 'Confidence Core',
      icon: Zap,
      score: data.confidence?.cq?.overallCq || 60,
      domains: 6,
      color: 'text-purple-600',
      bgColor: 'bg-purple-500',
    },
    {
      name: 'Journaling',
      icon: BookOpen,
      streak: data.journal?.streak?.currentStreak || 0,
      entries: data.journal?.streak?.totalEntries || 0,
      color: 'text-green-600',
      bgColor: 'bg-green-500',
    },
    {
      name: 'Brain Dump',
      icon: Target,
      cognitiveLoad: data.brainDump?.cognitiveLoad?.load_percentage || 70,
      pendingItems: data.brainDump?.pendingItems?.length || 0,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-500',
    },
    {
      name: 'Focus Score',
      icon: Zap,
      score: data.focus?.score?.currentScore || 75,
      sessions: data.focus?.score?.totalSessions || 0,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-500',
    },
    {
      name: 'Emotion State',
      icon: Heart,
      dominant: data.emotion?.stats?.dominantEmotion || 'neutral',
      checkins: data.emotion?.stats?.totalCheckins || 0,
      color: 'text-rose-600',
      bgColor: 'bg-rose-500',
    },
    {
      name: 'Momentum',
      icon: RotateCcw,
      score: data.momentum?.stats?.averageScore || 25,
      dimensions: data.momentum?.stats?.dimensionsInSync || 0,
      color: 'text-teal-600',
      bgColor: 'bg-teal-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Tier 1 Core Foundation</h2>
        <Badge variant="outline" className="text-xs">
          Last updated: {new Date().toLocaleTimeString()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {systems.map((system) => {
          const Icon = system.icon;
          return (
            <Card key={system.name} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${system.color}`} />
                    <span className="font-medium text-sm">{system.name}</span>
                  </div>
                </div>

                {'score' in system && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{Math.round(system.score as number)}%</span>
                      {'level' in system && (
                        <Badge variant="outline" className="text-xs">Level {system.level}</Badge>
                      )}
                    </div>
                    <Progress value={system.score as number} className={system.bgColor} />
                  </div>
                )}

                {'streak' in system && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{system.streak}</span>
                      <span className="text-xs text-muted-foreground">day streak</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{system.entries} total entries</p>
                  </div>
                )}

                {'cognitiveLoad' in system && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{system.cognitiveLoad}%</span>
                      <span className="text-xs text-muted-foreground">mental load</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{system.pendingItems} pending items</p>
                  </div>
                )}

                {'dominant' in system && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold capitalize">{system.dominant}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{system.checkins} check-ins today</p>
                  </div>
                )}

                {'dimensions' in system && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{system.dimensions}/7</span>
                      <span className="text-xs text-muted-foreground">in sync</span>
                    </div>
                    <Progress value={(system.dimensions as number) / 7 * 100} className={system.bgColor} />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Badge className="cursor-pointer hover:bg-primary/90">Morning Ritual</Badge>
          <Badge className="cursor-pointer hover:bg-primary/90">Brain Dump</Badge>
          <Badge className="cursor-pointer hover:bg-primary/90">Focus Session</Badge>
          <Badge className="cursor-pointer hover:bg-primary/90">Emotion Check-in</Badge>
          <Badge className="cursor-pointer hover:bg-primary/90">Log Progress</Badge>
        </CardContent>
      </Card>
    </div>
  );
}

export default Tier1DashboardSummary;
