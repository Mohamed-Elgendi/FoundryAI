'use client';

import React from 'react';
import { useRadarDashboard, useIdeaExtraction } from '@/hooks/useRadarAndBuild';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/progress';
import { 
  Radar, 
  TrendingUp, 
  Target, 
  Zap, 
  Lightbulb,
  ArrowRight,
  RefreshCw,
  Filter
} from 'lucide-react';

interface Opportunity {
  id: string;
  title: string;
  description: string;
  score: number;
  difficulty: 'easy' | 'medium' | 'hard';
  timeToFirstRevenue: string;
  archetypes: string[];
  trending: boolean;
}

export function OpportunityRadarDashboard() {
  const { data, isLoading, error, refetch } = useRadarDashboard();
  const { extract, isLoading: isExtracting } = useIdeaExtraction();
  const [showIdeaExtractor, setShowIdeaExtractor] = React.useState(false);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-4 w-24 bg-slate-200 animate-pulse rounded mb-4" />
                <div className="h-8 w-16 bg-slate-200 animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6 space-y-3">
                <div className="h-4 w-3/4 bg-slate-200 animate-pulse rounded" />
                <div className="h-20 bg-slate-200 animate-pulse rounded" />
                <div className="h-8 w-full bg-slate-200 animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <p className="text-red-700">Failed to load radar data: {error}</p>
          <Button onClick={refetch} variant="outline" className="mt-4">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const opportunities: Opportunity[] = (data?.opportunities || []).map((opp: Record<string, unknown>) => ({
    id: opp.id as string,
    title: opp.title as string,
    description: opp.description as string,
    score: opp.score as number,
    difficulty: opp.difficulty as 'easy' | 'medium' | 'hard',
    timeToFirstRevenue: opp.timeToFirstRevenue as string,
    archetypes: opp.archetypes as string[],
    trending: opp.trending as boolean,
  }));

  const stats = data?.stats || {
    totalOpportunities: 0,
    averageScore: 0,
    scoreDistribution: { easy: 0, medium: 0, hard: 0 },
    lastUpdated: new Date().toISOString(),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Radar className="w-6 h-6 text-blue-600" />
            Opportunity Radar
          </h2>
          <p className="text-muted-foreground">
            Live market intelligence • {opportunities.length} opportunities detected
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowIdeaExtractor(!showIdeaExtractor)}
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            Extract Idea
          </Button>
          <Button onClick={refetch} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Opportunities</p>
                <p className="text-2xl font-bold">{stats.totalOpportunities}</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Score</p>
                <p className="text-2xl font-bold">{Math.round(stats.averageScore)}/100</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Easy Wins</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.scoreDistribution?.easy || 0}
                </p>
              </div>
              <Zap className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="text-sm font-medium">
                  {new Date(stats.lastUpdated).toLocaleTimeString()}
                </p>
              </div>
              <RefreshCw className="w-8 h-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Opportunity Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {opportunities.map((opp) => (
          <OpportunityCard key={opp.id} opportunity={opp} />
        ))}
      </div>

      {opportunities.length === 0 && (
        <Card className="p-8 text-center">
          <Radar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-muted-foreground">
            No opportunities detected yet. The radar is scanning...
          </p>
        </Card>
      )}
    </div>
  );
}

function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{opportunity.title}</CardTitle>
          {opportunity.trending && (
            <Badge className="bg-red-500">
              <TrendingUp className="w-3 h-3 mr-1" />
              Trending
            </Badge>
          )}
        </div>
        <div className="flex gap-2 mt-2">
          <Badge variant="outline" className={getDifficultyColor(opportunity.difficulty)}>
            {opportunity.difficulty}
          </Badge>
          <Badge variant="outline">
            {opportunity.timeToFirstRevenue} to revenue
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {opportunity.description}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground">Opportunity Score</span>
            <p className={`text-xl font-bold ${getScoreColor(opportunity.score)}`}>
              {opportunity.score}/100
            </p>
          </div>
          <Button size="sm">
            Analyze
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-1">
          {opportunity.archetypes.map((archetype) => (
            <Badge key={archetype} variant="secondary" className="text-xs">
              {archetype}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default OpportunityRadarDashboard;
