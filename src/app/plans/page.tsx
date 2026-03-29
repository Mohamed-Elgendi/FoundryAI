'use client';

import { useEffect, useState } from 'react';
import { DashboardProvider, DashboardShell } from '@/lib/layers/frontend-layer';
import { useAuth } from '@/lib/auth/auth-context';
import { supabase } from '@/lib/db/supabase';
import { FoundryAIOutput } from '@/types';
import { 
  FileText, 
  Trash2, 
  Eye,
  Loader2,
  Search,
  Filter,
  MoreVertical,
  Download,
  Share2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SavedPlan {
  id: string;
  userInput: string;
  output: FoundryAIOutput;
  createdAt: string;
  updatedAt: string;
}

function PlansContent() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [plans, setPlans] = useState<SavedPlan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<SavedPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!user) return;
    loadPlans();
  }, [user]);

  // Filter plans when search changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPlans(plans);
      return;
    }
    
    const filtered = plans.filter(plan => {
      const name = plan.output.ideaName || plan.output.toolIdea || '';
      const input = plan.userInput || '';
      return name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             input.toLowerCase().includes(searchQuery.toLowerCase());
    });
    setFilteredPlans(filtered);
  }, [searchQuery, plans]);

  const loadPlans = async () => {
    try {
      setIsLoading(true);

      if (supabase) {
        const { data, error } = await supabase
          .from('plans')
          .select('*')
          .eq('user_id', user?.id)
          .order('updated_at', { ascending: false });

        if (error) {
          console.error('Error fetching plans:', error);
          return;
        }

        const transformed = (data || []).map((plan: any) => ({
          id: plan.id,
          userInput: plan.user_input || '',
          output: plan.content as FoundryAIOutput,
          createdAt: plan.created_at,
          updatedAt: plan.updated_at
        }));

        setPlans(transformed);
        setFilteredPlans(transformed);
      } else {
        // Fallback to localStorage
        const saved = localStorage.getItem('foundryai-plans');
        const parsed = saved ? JSON.parse(saved) : [];
        setPlans(parsed);
        setFilteredPlans(parsed);
      }
    } catch (error) {
      console.error('Failed to load plans:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deletePlan = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;

    try {
      setDeleteLoading(planId);

      if (supabase) {
        const { error } = await supabase
          .from('plans')
          .delete()
          .eq('id', planId)
          .eq('user_id', user?.id);

        if (error) {
          console.error('Error deleting plan:', error);
          alert('Failed to delete plan');
          return;
        }
      } else {
        // Fallback to localStorage
        const saved = localStorage.getItem('foundryai-plans');
        if (saved) {
          const parsed = JSON.parse(saved);
          const filtered = parsed.filter((p: SavedPlan) => p.id !== planId);
          localStorage.setItem('foundryai-plans', JSON.stringify(filtered));
        }
      }

      // Update state
      setPlans(prev => prev.filter(p => p.id !== planId));
      setFilteredPlans(prev => prev.filter(p => p.id !== planId));
    } catch (error) {
      console.error('Failed to delete plan:', error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const exportPlan = (plan: SavedPlan) => {
    const json = JSON.stringify(plan.output, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(plan.output.ideaName || plan.output.toolIdea || 'plan').replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const sharePlan = async (plan: SavedPlan) => {
    const shareData = {
      title: `FoundryAI Plan: ${plan.output.ideaName || plan.output.toolIdea}`,
      text: `Check out this business plan for "${plan.output.ideaName || plan.output.toolIdea}"`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        console.log('Share cancelled');
      }
    } else {
      // Copy to clipboard
      await navigator.clipboard.writeText(shareData.text);
      alert('Plan name copied to clipboard!');
    }
  };

  if (authLoading || isLoading) {
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">My Plans</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {plans.length} {plans.length === 1 ? 'plan' : 'plans'} saved
          </p>
        </div>
        <Link
          href="/"
          className="flex items-center justify-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
        >
          <FileText className="w-4 h-4" />
          Create New Plan
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search plans..."
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400"
        />
      </div>

      {/* Plans List */}
      {filteredPlans.length > 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {filteredPlans.map((plan) => (
              <div 
                key={plan.id}
                className="p-4 sm:p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                      {plan.output.ideaName || plan.output.toolIdea || 'Untitled Plan'}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {plan.userInput || 'No description'}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-400 dark:text-slate-500">
                      <span>Created {new Date(plan.createdAt).toLocaleDateString()}</span>
                      {plan.updatedAt !== plan.createdAt && (
                        <span>Updated {new Date(plan.updatedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/?plan=${plan.id}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/30 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Link>
                    <button
                      onClick={() => exportPlan(plan)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      title="Export as JSON"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => sharePlan(plan)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      title="Share"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deletePlan(plan.id)}
                      disabled={deleteLoading === plan.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      {deleteLoading === plan.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-6 h-6 text-violet-600 dark:text-violet-400" />
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
            {searchQuery ? 'No plans found' : 'No plans yet'}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4 max-w-sm mx-auto">
            {searchQuery 
              ? 'Try adjusting your search query'
              : 'Start by generating your first business plan'
            }
          </p>
          {!searchQuery && (
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Create First Plan
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default function PlansPage() {
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
        <PlansContent />
      </DashboardShell>
    </DashboardProvider>
  );
}
