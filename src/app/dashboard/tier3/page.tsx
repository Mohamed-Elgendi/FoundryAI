'use client';

import { useAuth } from '@/layer-1-security/auth';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import WorkflowEngine from '@/components/tier3/WorkflowEngine';
import ToolRecommender from '@/components/tier3/ToolRecommender';

export default function Tier3Page() {
  const { user, signOut } = useAuth();

  return (
    <DashboardShell 
      user={user ? { name: user.user_metadata?.name || 'User', email: user.email || '', role: 'Founder' } : undefined}
      onSignOut={signOut}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Tier 3 - Execution Systems
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Powerful execution tools and workflows to launch and scale your business
          </p>
        </div>

        {/* Workflow Engine */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              14-Day Launch Workflow
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Step-by-step execution protocol with AI-guided tasks and progress tracking
            </p>
          </div>
          <div className="p-6">
            <WorkflowEngine />
          </div>
        </section>

        {/* Tool Recommender */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              Smart Tool Recommendations
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Curated tech stack and tool recommendations for your business archetype
            </p>
          </div>
          <div className="p-6">
            <ToolRecommender />
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
