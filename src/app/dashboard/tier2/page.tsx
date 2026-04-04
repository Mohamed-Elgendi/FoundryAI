'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/layer-1-security/auth';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Radar, 
  Target, 
  TrendingUp, 
  Plus,
  Lightbulb,
  Briefcase,
  ArrowRight
} from 'lucide-react';

interface Opportunity {
  id: string;
  opportunity_title: string;
  description: string;
  market_size: string;
  archetype_fit_score: number;
  status: string;
  is_validated: boolean;
}

export default function Tier2Dashboard() {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, validated: 0, avgFitScore: 0 });

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const res = await fetch('/api/opportunity');
        if (res.ok) {
          const data = await res.json();
          setOpportunities(data.opportunities || []);
          setStats(data.stats || { total: 0, validated: 0, avgFitScore: 0 });
        }
      } catch (error) {
        console.error('Failed to fetch opportunities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  if (!user) return null;

  return (
    <DashboardShell user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Tier 2: Opportunity Intelligence
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Discover and validate business opportunities matched to your archetype
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Opportunity
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Total Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Radar className="w-5 h-5 text-violet-500" />
                <span className="text-2xl font-bold">{stats.total}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Validated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-500" />
                <span className="text-2xl font-bold">{stats.validated}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Avg Archetype Fit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <span className="text-2xl font-bold">{stats.avgFitScore}%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Opportunities List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : opportunities.length > 0 ? (
              <div className="space-y-4">
                {opportunities.map(opp => (
                  <div 
                    key={opp.id} 
                    className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${opp.is_validated ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-violet-100 dark:bg-violet-900/30'}`}>
                        {opp.is_validated ? <Briefcase className="w-5 h-5 text-emerald-600" /> : <Lightbulb className="w-5 h-5 text-violet-600" />}
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-900 dark:text-white">{opp.opportunity_title}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1">{opp.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={opp.is_validated ? "default" : "secondary"}>
                            {opp.status}
                          </Badge>
                          <span className="text-xs text-slate-500">
                            Archetype Fit: {opp.archetype_fit_score}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Radar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">
                  No opportunities yet. Start by completing your archetype assessment.
                </p>
                <Button className="mt-4" variant="outline">
                  Discover Opportunities
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
