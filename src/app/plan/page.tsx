'use client';

import { useEffect, useState } from 'react';
import { DashboardProvider, DashboardShell } from '@/lib/layers/frontend-layer';
import { useAuth } from '@/layer-1-security/auth';
import { FoundryAI } from '@/components/foundryai/FoundryAI';
import { useRouter } from 'next/navigation';
import { Lightbulb, Sparkles } from 'lucide-react';

function PlanContent() {
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
            <Lightbulb className="w-6 h-6 text-violet-600" />
            Plan Your Idea
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Describe your business idea and let AI create a complete blueprint
          </p>
        </div>
      </div>

      {/* Plan Generator */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <FoundryAI />
      </div>
    </div>
  );
}

export default function PlanPage() {
  const { signOut, user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <DashboardProvider>
      <DashboardShell 
        user={user ? { name: user.user_metadata?.name || user.email?.split('@')[0] || 'User', email: user.email || '', role: 'Member' } : undefined}
        onSignOut={handleSignOut}
      >
        <PlanContent />
      </DashboardShell>
    </DashboardProvider>
  );
}
