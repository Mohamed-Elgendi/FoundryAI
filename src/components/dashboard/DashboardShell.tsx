'use client';

import { ReactNode } from 'react';

interface DashboardShellProps {
  user?: { name: string; email: string; role: string };
  onSignOut: () => void;
  children: ReactNode;
}

export function DashboardShell({ user, onSignOut, children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">FoundryAI</h1>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  {user.name} ({user.role})
                </div>
              )}
              <button
                onClick={onSignOut}
                className="px-4 py-2 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
