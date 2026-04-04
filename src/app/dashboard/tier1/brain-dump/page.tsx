'use client';

import { useAuth } from '@/layer-1-security/auth';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { BrainDumpSystem } from '@/components/tier1/BrainDumpSystem';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function BrainDumpPage() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <DashboardShell user={user}>
      <div className="space-y-6">
        <Link href="/dashboard/tier1">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Tier 1
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Brain Dump</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Clear your mind and let AI organize your thoughts</p>
        </div>
        <BrainDumpSystem />
      </div>
    </DashboardShell>
  );
}
