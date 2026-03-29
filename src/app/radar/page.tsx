'use client';

import { useEffect, useState } from 'react';
import { DashboardProvider, DashboardShell } from '@/lib/layers/frontend-layer';
import { useAuth } from '@/lib/auth/auth-context';
import { OpportunityRadar } from '@/components/foundryai/OpportunityRadar';
import { useRouter } from 'next/navigation';
import { TrendingUp } from 'lucide-react';

function RadarContent() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
            Opportunity Radar
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Discover and validate new market opportunities with AI-powered insights
          </p>
        </div>
      </div>

      {/* Radar Component */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <OpportunityRadar limit={10} />
      </div>
    </div>
  );
}

export default function RadarPage() {
  return (
    <DashboardProvider>
      <DashboardShell>
        <RadarContent />
      </DashboardShell>
    </DashboardProvider>
  );
}
