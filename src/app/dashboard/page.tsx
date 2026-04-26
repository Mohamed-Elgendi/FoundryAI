'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/layer-1-security/auth/auth-provider';
import {
  Brain,
  Target,
  Zap,
  TrendingUp,
  GraduationCap,
  DollarSign,
  ArrowRight,
  Sparkles,
  FileText,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Tier data for dashboard display
const tiers = [
  {
    id: 'tier1',
    name: 'Foundation',
    description: 'Build unshakeable confidence and belief systems',
    icon: Brain,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    link: '/dashboard/tier1/belief',
    stats: { progress: 45, items: 3 },
  },
  {
    id: 'tier2',
    name: 'Intelligence',
    description: 'Market research, opportunities, and archetypes',
    icon: Target,
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
    link: '/dashboard/tier2/opportunities',
    stats: { progress: 20, items: 3 },
  },
  {
    id: 'tier3',
    name: 'Product Factory',
    description: 'Build and launch your MVP',
    icon: Zap,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    link: '/dashboard/tier3/build',
    stats: { progress: 0, items: 1 },
  },
  {
    id: 'tier4',
    name: 'Growth Engine',
    description: 'Productivity and performance tracking',
    icon: TrendingUp,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    link: '/dashboard/tier4/character-stats',
    stats: { progress: 10, items: 2 },
  },
  {
    id: 'tier5',
    name: 'Academy',
    description: 'Learn, certify, and gamify your journey',
    icon: GraduationCap,
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-50 dark:bg-pink-900/20',
    link: '/dashboard/tier5/curriculum',
    stats: { progress: 5, items: 3 },
  },
  {
    id: 'tier6',
    name: 'Monetization',
    description: 'Revenue streams and affiliate programs',
    icon: DollarSign,
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    link: '/dashboard/tier6/affiliate',
    stats: { progress: 0, items: 3 },
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({
    totalPlans: 0,
    recentActivity: 0,
    lastActive: 'Never',
  });

  useEffect(() => {
    setMounted(true);
    // Load stats from localStorage as fallback
    try {
      const savedPlans = localStorage.getItem('foundryai_plans');
      if (savedPlans) {
        const plans = JSON.parse(savedPlans);
        setStats({
          totalPlans: plans.length || 0,
          recentActivity: plans.length || 0,
          lastActive: plans.length > 0 ? 'Recently' : 'Never',
        });
      }
    } catch {
      // Ignore errors
    }
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Welcome back, {user?.user_metadata?.name || 'Founder'}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Your entrepreneurial journey is just getting started
          </p>
        </div>
        <Link href="/input">
          <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Plan
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Total Plans
            </CardTitle>
            <FileText className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {stats.totalPlans}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Recent Activity
            </CardTitle>
            <Clock className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {stats.recentActivity}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Last Active
            </CardTitle>
            <Sparkles className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {stats.lastActive}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tiers Grid */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
          Platform Tiers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tiers.map((tier) => {
            const Icon = tier.icon;
            return (
              <Link
                key={tier.id}
                href={tier.link}
                className="group block"
              >
                <Card className="h-full hover:shadow-lg transition-shadow border-slate-200 dark:border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                          {tier.name}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          {tier.description}
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <div className={`px-2 py-1 rounded text-xs font-medium ${tier.bgColor} text-slate-700 dark:text-slate-300`}>
                            {tier.stats.items} modules
                          </div>
                          <div className="flex items-center text-xs text-slate-500">
                            <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mr-2">
                              <div
                                className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
                                style={{ width: `${tier.stats.progress}%` }}
                              />
                            </div>
                            {tier.stats.progress}%
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Get Started CTA */}
      {stats.totalPlans === 0 && (
        <Card className="bg-gradient-to-r from-violet-600 to-indigo-600 border-none">
          <CardContent className="p-8 text-center">
            <Sparkles className="w-12 h-12 text-white/80 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Ready to build your business?
            </h3>
            <p className="text-white/80 mb-6 max-w-md mx-auto">
              Start by generating your first AI-powered business plan. It takes just 2 minutes.
            </p>
            <Link href="/input">
              <Button variant="secondary" size="lg">
                Generate Your First Plan
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
