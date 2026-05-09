'use client';

import { useAuth } from '@/layer-1-security/auth';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { Tier1FoundationPanel } from '@/components/tier1/Tier1FoundationPanel';

export default function Tier1Page() {
  const { user, signOut } = useAuth();

  return (
    <DashboardShell 
      user={user ? { name: user.user_metadata?.name || 'User', email: user.email || '', role: 'Founder' } : undefined}
      onSignOut={signOut}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Tier 1 - Foundation Systems
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Core psychological and productivity systems for entrepreneurial success
          </p>
        </div>
        <Tier1FoundationPanel />
      </div>
    </DashboardShell>
  );
}
