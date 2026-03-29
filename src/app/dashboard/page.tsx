'use client';

import { useEffect, useState } from 'react';
import { DashboardProvider, DashboardShell } from '@/lib/layers/frontend-layer';
import { FoundryAIOutput } from '@/types';
import { 
  Lightbulb, 
  TrendingUp, 
  FileText, 
  Clock,
  ArrowRight,
  Sparkles,
  Target,
  Zap
} from 'lucide-react';
import Link from 'next/link';

interface SavedPlan {
  id: string;
  userInput: string;
  output: FoundryAIOutput;
  createdAt: string;
}

interface DashboardStats {
  totalPlans: number;
  totalOpportunities: number;
  lastActive: string;
  recentPlans: SavedPlan[];
}

function DashboardContent() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPlans: 0,
    totalOpportunities: 0,
    lastActive: 'Never',
    recentPlans: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load real data from localStorage
    const loadData = () => {
      try {
        // Load saved plans
        const savedPlansJson = localStorage.getItem('foundryai-plans');
        const savedPlans: SavedPlan[] = savedPlansJson ? JSON.parse(savedPlansJson) : [];
        
        // Load opportunities count from radar data
        const radarData = localStorage.getItem('radar-opportunities');
        const opportunities = radarData ? JSON.parse(radarData) : [];
        
        // Get last active time
        const lastPlan = savedPlans[0];
        const lastActive = lastPlan 
          ? new Date(lastPlan.createdAt).toLocaleDateString()
          : 'Never';

        setStats({
          totalPlans: savedPlans.length,
          totalOpportunities: opportunities.length,
          lastActive,
          recentPlans: savedPlans.slice(0, 5)
        });
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome back!</h2>
          <p className="text-slate-600 mt-1">
            Here's what's happening with your business ideas
          </p>
        </div>
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          New Plan
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={FileText}
          label="Total Plans"
          value={stats.totalPlans}
          color="violet"
        />
        <StatCard
          icon={Target}
          label="Opportunities Tracked"
          value={stats.totalOpportunities}
          color="emerald"
        />
        <StatCard
          icon={Clock}
          label="Last Active"
          value={stats.lastActive}
          color="amber"
          isText
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <QuickActionCard
          icon={Lightbulb}
          title="Plan Your Idea"
          description="Generate a complete business plan from scratch"
          href="/"
          color="violet"
        />
        <QuickActionCard
          icon={TrendingUp}
          title="Opportunity Radar"
          description="Discover and validate new market opportunities"
          href="/?tab=opportunities"
          color="emerald"
        />
      </div>

      {/* Recent Plans */}
      {stats.recentPlans.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Recent Plans</h3>
            <Link 
              href="/plans" 
              className="text-sm text-violet-600 hover:text-violet-700 flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-slate-200">
            {stats.recentPlans.map((plan) => (
              <div 
                key={plan.id}
                className="px-6 py-4 hover:bg-slate-50 transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-slate-900">
                    {plan.output.ideaName || plan.output.toolIdea || 'Untitled Plan'}
                  </p>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Created {new Date(plan.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Link
                  href={`/?plan=${plan.id}`}
                  className="text-sm text-violet-600 hover:text-violet-700 font-medium"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {stats.recentPlans.length === 0 && (
        <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
          <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Zap className="w-6 h-6 text-violet-600" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">No plans yet</h3>
          <p className="text-slate-600 mb-4 max-w-sm mx-auto">
            Start by generating your first business plan or exploring opportunities
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Create First Plan
          </Link>
        </div>
      )}
    </div>
  );
}

function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  color,
  isText = false 
}: { 
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  color: 'violet' | 'emerald' | 'amber';
  isText?: boolean;
}) {
  const colorClasses = {
    violet: 'bg-violet-50 text-violet-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600'
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-slate-600">{label}</p>
          <p className={`font-bold ${isText ? 'text-lg' : 'text-2xl'} text-slate-900`}>
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function QuickActionCard({
  icon: Icon,
  title,
  description,
  href,
  color
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href: string;
  color: 'violet' | 'emerald';
}) {
  const colorClasses = {
    violet: 'hover:border-violet-300 hover:bg-violet-50/50',
    emerald: 'hover:border-emerald-300 hover:bg-emerald-50/50'
  };

  return (
    <Link
      href={href}
      className={`flex items-start gap-4 p-6 bg-white rounded-xl border border-slate-200 transition-all ${colorClasses[color]}`}
    >
      <div className="flex-1">
        <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
      <ArrowRight className="w-5 h-5 text-slate-400" />
    </Link>
  );
}

export default function DashboardPage() {
  return (
    <DashboardProvider>
      <DashboardShell>
        <DashboardContent />
      </DashboardShell>
    </DashboardProvider>
  );
}
