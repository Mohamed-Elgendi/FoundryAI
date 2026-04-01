'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Trophy,
  Plus,
  X
} from 'lucide-react';

interface RevenueEntry {
  id: string;
  amount: number;
  source: string;
  date: string;
  description?: string;
  milestone_triggered?: string;
}

interface RevenueStats {
  total: number;
  thisMonth: number;
  count: number;
}

// ==========================================
// TIER PROGRESSION SYSTEM
// ==========================================

export const TIERS = [
  { 
    name: 'Free', 
    minRevenue: 0, 
    color: 'bg-slate-100 text-slate-700',
    benefits: ['Access to Opportunity Radar', 'Basic AI Plan Generation']
  },
  { 
    name: 'Starter', 
    minRevenue: 100, 
    color: 'bg-emerald-100 text-emerald-700',
    benefits: ['Everything in Free', '14-Day Launch Protocol', 'Brain Dump System']
  },
  { 
    name: 'Pro', 
    minRevenue: 500, 
    color: 'bg-blue-100 text-blue-700',
    benefits: ['Everything in Starter', 'Advanced AI Assistant', 'Priority Support']
  },
  { 
    name: 'Elite', 
    minRevenue: 2000, 
    color: 'bg-violet-100 text-violet-700',
    benefits: ['Everything in Pro', 'Custom Workflows', '1-on-1 Strategy Calls']
  },
  { 
    name: 'Legend', 
    minRevenue: 10000, 
    color: 'bg-amber-100 text-amber-700',
    benefits: ['Everything in Elite', 'White-glove Onboarding', 'Lifetime Access']
  }
];

export function getCurrentTier(revenue: number) {
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (revenue >= TIERS[i].minRevenue) {
      return TIERS[i];
    }
  }
  return TIERS[0];
}

export function getNextTier(revenue: number) {
  const current = getCurrentTier(revenue);
  const currentIndex = TIERS.findIndex(t => t.name === current.name);
  return TIERS[currentIndex + 1] || null;
}

export function getTierProgress(revenue: number) {
  const current = getCurrentTier(revenue);
  const next = getNextTier(revenue);
  
  if (!next) return { percentage: 100, remaining: 0 };
  
  const range = next.minRevenue - current.minRevenue;
  const progress = revenue - current.minRevenue;
  const percentage = Math.min(Math.round((progress / range) * 100), 100);
  const remaining = next.minRevenue - revenue;
  
  return { percentage, remaining };
}

// ==========================================
// REVENUE INPUT COMPONENT
// ==========================================

interface RevenueInputProps {
  onSubmit: (entry: Omit<RevenueEntry, 'id'>) => void;
  onClose: () => void;
}

function RevenueInput({ onSubmit, onClose }: RevenueInputProps) {
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');
  const [description, setDescription] = useState('');

  const sources = [
    'Product Sales',
    'Service Revenue',
    'Subscription',
    'Affiliate',
    'Ad Revenue',
    'Consulting',
    'Other'
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-900">Record Revenue</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Amount ($)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-10"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Source
          </label>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-500"
          >
            <option value="">Select source...</option>
            {sources.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Description (optional)
          </label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., First customer payment"
          />
        </div>

        <Button
          onClick={() => {
            if (amount && source) {
              onSubmit({
                amount: parseFloat(amount),
                source,
                description,
                date: new Date().toISOString()
              });
              onClose();
            }
          }}
          className="w-full bg-violet-600 hover:bg-violet-700"
          disabled={!amount || !source}
        >
          Record Revenue
        </Button>
      </div>
    </div>
  );
}

// ==========================================
// MILESTONE CELEBRATION
// ==========================================

function MilestoneCelebration({ milestone, onClose }: { milestone: string; onClose: () => void }) {
  const titles: Record<string, string> = {
    '$10_ACHIEVED': '🎉 First $10!',
    '$100_ACHIEVED': '🚀 $100 Milestone!',
    '$1K_ACHIEVED': '💰 $1,000 Milestone!'
  };

  const messages: Record<string, string> = {
    '$10_ACHIEVED': 'Your first revenue! This is where it all begins.',
    '$100_ACHIEVED': 'Triple digits! You\'re building real momentum.',
    '$1K_ACHIEVED': 'Four figures! You\'ve proven your business model works.'
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center shadow-2xl">
        <div className="w-20 h-20 bg-gradient-to-br from-violet-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">
          {titles[milestone] || 'Milestone Achieved!'}
        </h3>
        <p className="text-slate-600 mb-6">
          {messages[milestone] || 'Keep up the great work!'}
        </p>
        <Button onClick={onClose} className="bg-violet-600 hover:bg-violet-700 px-8">
          Continue
        </Button>
      </div>
    </div>
  );
}

// ==========================================
// MAIN REVENUE PAGE
// ==========================================

export default function RevenuePage() {
  const [showInput, setShowInput] = useState(false);
  const [revenue, setRevenue] = useState<RevenueEntry[]>([]);
  const [stats, setStats] = useState<RevenueStats>({ total: 0, thisMonth: 0, count: 0 });
  const [celebration, setCelebration] = useState<string | null>(null);
  const [userId] = useState('temp-user-id'); // Replace with actual auth

  // Load revenue data
  useEffect(() => {
    fetchRevenue();
  }, [userId]);

  const fetchRevenue = async () => {
    try {
      const response = await fetch(`/api/revenue?userId=${userId}`);
      const data = await response.json();
      if (data.success) {
        setRevenue(data.revenue);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to load revenue:', error);
    }
  };

  const handleAddRevenue = async (entry: Omit<RevenueEntry, 'id'>) => {
    try {
      const response = await fetch('/api/revenue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...entry, userId })
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchRevenue();
        if (data.milestone) {
          setCelebration(data.milestone);
        }
      }
    } catch (error) {
      console.error('Failed to add revenue:', error);
    }
  };

  const currentTier = getCurrentTier(stats.total);
  const nextTier = getNextTier(stats.total);
  const progress = getTierProgress(stats.total);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Revenue Dashboard</h1>
            <p className="text-slate-600 mt-1">Track your earnings and tier progression</p>
          </div>
          <Button 
            onClick={() => setShowInput(true)}
            className="bg-violet-600 hover:bg-violet-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Revenue
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-sm text-slate-500">Total Revenue</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">
              ${stats.total.toLocaleString()}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm text-slate-500">This Month</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">
              ${stats.thisMonth.toLocaleString()}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-violet-600" />
              </div>
              <span className="text-sm text-slate-500">Transactions</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">
              {stats.count}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Tier Progress */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Tier Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Current Tier</h2>
                  <Badge className={`mt-2 ${currentTier.color}`}>
                    {currentTier.name}
                  </Badge>
                </div>
                <div className="text-right">
                  {nextTier && (
                    <>
                      <p className="text-sm text-slate-500">Next: {nextTier.name}</p>
                      <p className="text-lg font-semibold text-slate-900">
                        ${progress.remaining.toLocaleString()} to go
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 rounded-full h-3 mb-4">
                <div 
                  className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all duration-500"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
              <p className="text-sm text-slate-500 text-center">{progress.percentage}% to next tier</p>
            </div>

            {/* Revenue History */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Revenue History</h3>
              {revenue.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  No revenue recorded yet. Add your first transaction!
                </div>
              ) : (
                <div className="space-y-3">
                  {revenue.map((entry) => (
                    <div 
                      key={entry.id} 
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">${entry.amount}</p>
                          <p className="text-sm text-slate-500">{entry.source}</p>
                          {entry.description && (
                            <p className="text-xs text-slate-400">{entry.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-500">
                          {new Date(entry.date).toLocaleDateString()}
                        </p>
                        {entry.milestone_triggered && (
                          <Badge className="mt-1 bg-amber-100 text-amber-700">
                            <Trophy className="w-3 h-3 mr-1" />
                            Milestone
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Tier Benefits */}
          <div>
            <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Tier Benefits</h3>
              <div className="space-y-4">
                {TIERS.map((tier) => (
                  <div 
                    key={tier.name}
                    className={`p-4 rounded-lg border ${
                      tier.name === currentTier.name 
                        ? 'border-violet-300 bg-violet-50' 
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={tier.color}>{tier.name}</Badge>
                      <span className="text-sm text-slate-500">
                        ${tier.minRevenue.toLocaleString()}+
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {tier.benefits.map((benefit, idx) => (
                        <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                          <div className="w-1 h-1 bg-slate-400 rounded-full mt-2" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showInput && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <RevenueInput onSubmit={handleAddRevenue} onClose={() => setShowInput(false)} />
        </div>
      )}

      {celebration && (
        <MilestoneCelebration 
          milestone={celebration} 
          onClose={() => setCelebration(null)} 
        />
      )}
    </div>
  );
}
