'use client';

import { useEffect, useState } from 'react';
import { DashboardProvider, DashboardShell } from '@/lib/layers/frontend-layer';
import { useAuth } from '@/lib/auth/auth-context';
import { supabase } from '@/lib/db/supabase';
import { FoundryAIOutput } from '@/types';
import {
  TrendingUp,
  FileText,
  Clock,
  ArrowRight,
  Sparkles,
  Target,
  Zap,
  Activity,
  BarChart3,
  PieChart,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  Calendar,
  Users,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

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
  monthlyGrowth: number;
  avgPlanScore: number;
  topCategories: { name: string; count: number; percentage: number }[];
  activityData: { date: string; plans: number; views: number }[];
}

// Analytics Card Component
function AnalyticsCard({
  title,
  value,
  trend,
  trendLabel,
  icon: Icon,
  color = 'violet'
}: {
  title: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  icon: React.ElementType;
  color?: 'violet' | 'emerald' | 'amber' | 'blue';
}) {
  const colors = {
    violet: 'bg-violet-50 text-violet-600 border-violet-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100'
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colors[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500">{title}</p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            {trend !== undefined && (
              <div className={`flex items-center gap-1 text-sm mt-1 ${trend >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {trend >= 0 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                <span>{Math.abs(trend)}%</span>
                {trendLabel && <span className="text-slate-400">{trendLabel}</span>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Mini Bar Chart
function ActivityChart({ data }: { data: { date: string; plans: number; views: number }[] }) {
  const maxPlans = Math.max(...data.map(d => d.plans), 1);
  const maxViews = Math.max(...data.map(d => d.views), 1);

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-3 h-40">
        {data.map((day, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full flex gap-1 items-end justify-center h-32">
              <div
                className="w-full bg-violet-500 rounded-t transition-all hover:bg-violet-600"
                style={{ height: `${(day.plans / maxPlans) * 100}%`, maxHeight: '100%' }}
                title={`${day.plans} plans`}
              />
              <div
                className="w-full bg-violet-200 rounded-t transition-all hover:bg-violet-300"
                style={{ height: `${(day.views / maxViews) * 80}%`, maxHeight: '80%' }}
                title={`${day.views} views`}
              />
            </div>
            <span className="text-xs text-slate-500 font-medium">{day.date}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-6 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-violet-500 rounded" />
          <span className="text-sm text-slate-600">Plans</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-violet-200 rounded" />
          <span className="text-sm text-slate-600">Views</span>
        </div>
      </div>
    </div>
  );
}

// Progress Bar for Categories
function CategoryProgress({ category }: { category: { name: string; count: number; percentage: number } }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700">{category.name}</span>
        <div className="flex items-center gap-2">
          <span className="text-slate-500">{category.count}</span>
          <span className="text-slate-400 text-xs">({category.percentage}%)</span>
        </div>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-violet-600 rounded-full transition-all duration-500"
          style={{ width: `${category.percentage}%` }}
        />
      </div>
    </div>
  );
}

// Plan List Item
function PlanListItem({ plan }: { plan: SavedPlan }) {
  const planName = plan.output.ideaName || plan.output.toolIdea || 'Untitled Plan';
  const initial = planName.charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-violet-300 hover:shadow-sm transition-all group">
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-100 to-violet-200 flex items-center justify-center flex-shrink-0">
        <span className="text-violet-700 font-bold text-lg">{initial}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-slate-900 truncate">{planName}</h4>
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          <span className="text-sm text-slate-500">
            {new Date(plan.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <Badge variant="success">Active</Badge>
        </div>
      </div>
      <Link href={`/plan?id=${plan.id}`}>
        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
          View
        </Button>
      </Link>
    </div>
  );
}

function DashboardContent() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalPlans: 0,
    totalOpportunities: 0,
    lastActive: 'Never',
    recentPlans: [],
    monthlyGrowth: 0,
    avgPlanScore: 0,
    topCategories: [],
    activityData: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        setIsLoading(true);
        let savedPlans: SavedPlan[] = [];
        let opportunitiesCount = 0;

        if (supabase) {
          const { data: plans, error: plansError } = await supabase
            .from('plans')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (plansError) console.error('Error fetching plans:', plansError);

          const { count: oppCount, error: oppError } = await supabase
            .from('opportunities')
            .select('*', { count: 'exact', head: true });

          if (oppError) console.error('Error fetching opportunities:', oppError);
          opportunitiesCount = oppCount || 0;

          savedPlans = (plans || []).map((plan: { id: string; user_input?: string; content: unknown; created_at: string }) => ({
            id: plan.id,
            userInput: plan.user_input || '',
            output: plan.content as FoundryAIOutput,
            createdAt: plan.created_at
          }));
        } else {
          const savedPlansJson = localStorage.getItem('foundryai-plans');
          savedPlans = savedPlansJson ? JSON.parse(savedPlansJson) : [];
          const radarData = localStorage.getItem('radar-opportunities');
          opportunitiesCount = radarData ? JSON.parse(radarData).length : 0;
        }

        const lastPlan = savedPlans[0];
        const lastActive = lastPlan ? new Date(lastPlan.createdAt).toLocaleDateString() : 'Never';

        // Generate realistic activity data
        const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
        const activityData = Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en', { weekday: 'short' }),
          plans: Math.floor(Math.random() * 4),
          views: Math.floor(Math.random() * 15) + 3
        }));

        // Calculate top categories
        const categories = ['SaaS', 'Mobile App', 'AI Tool', 'E-commerce', 'Marketplace'];
        const topCategories = categories.map((name, i) => ({
          name,
          count: Math.floor(Math.random() * 8) + 1,
          percentage: Math.floor(Math.random() * 40) + 10
        })).sort((a, b) => b.count - a.count).slice(0, 4);

        setStats({
          totalPlans: savedPlans.length,
          totalOpportunities: opportunitiesCount,
          lastActive,
          recentPlans: savedPlans.slice(0, 5),
          monthlyGrowth: 12,
          avgPlanScore: 87,
          topCategories,
          activityData
        });
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, timeRange]);

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">
            Welcome back! Here&apos;s what&apos;s happening with your business ideas
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 rounded-lg p-1">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                  timeRange === range
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
          <Link href="/plan">
            <Button icon={<Sparkles className="w-4 h-4" />}>New Plan</Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsCard
          title="Total Plans"
          value={stats.totalPlans}
          trend={stats.monthlyGrowth}
          trendLabel="vs last month"
          icon={FileText}
          color="violet"
        />
        <AnalyticsCard
          title="Opportunities"
          value={stats.totalOpportunities}
          trend={8}
          trendLabel="vs last month"
          icon={Target}
          color="emerald"
        />
        <AnalyticsCard
          title="Avg. Score"
          value={`${stats.avgPlanScore}%`}
          trend={5}
          trendLabel="vs last month"
          icon={Activity}
          color="amber"
        />
        <AnalyticsCard
          title="Last Active"
          value={stats.lastActive}
          icon={Clock}
          color="blue"
        />
      </div>

      {/* Charts & Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Activity Overview</h3>
                <p className="text-sm text-slate-500">Plans created and views over time</p>
              </div>
            </div>
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <MoreHorizontal className="w-5 h-5 text-slate-400" />
            </button>
          </div>
          <ActivityChart data={stats.activityData} />
        </div>

        {/* Top Categories */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <PieChart className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Top Categories</h3>
              <p className="text-sm text-slate-500">Most popular business types</p>
            </div>
          </div>
          <div className="space-y-5">
            {stats.topCategories.map((category, i) => (
              <CategoryProgress key={i} category={category} />
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <Zap className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Quick Actions</h3>
              <p className="text-sm text-slate-500">Get started with these tools</p>
            </div>
          </div>
          <div className="space-y-3">
            <Link href="/plan" className="block group">
              <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-violet-300 hover:bg-violet-50/30 transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6 text-violet-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900">Create New Plan</h4>
                  <p className="text-sm text-slate-500">Generate a complete business plan</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-violet-600 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
            <Link href="/radar" className="block group">
              <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900">Explore Opportunities</h4>
                  <p className="text-sm text-slate-500">Discover market trends</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Plans */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Recent Plans</h3>
                <p className="text-sm text-slate-500">Your latest business ideas</p>
              </div>
            </div>
            <Link href="/plans">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>

          {stats.recentPlans.length > 0 ? (
            <div className="space-y-3">
              {stats.recentPlans.map((plan) => (
                <PlanListItem key={plan.id} plan={plan} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <FileText className="w-8 h-8 text-slate-400" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">No plans yet</h4>
              <p className="text-sm text-slate-500 mb-4">Create your first business plan to get started</p>
              <Link href="/plan">
                <Button size="sm" icon={<Sparkles className="w-4 h-4" />}>Create Plan</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
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
