import { useState, useEffect, useCallback } from 'react';

// Tier 6: Monetization Hooks

interface MembershipTier {
  id: string;
  name: string;
  slug: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  limits: {
    brainDumpsPerDay: number;
    focusSessionsPerDay: number;
    aiRequestsPerDay: number;
    storageMb: number;
  };
}

interface UserSubscription {
  tierId: string;
  status: string;
  billingInterval: string;
  currentPeriodEnd: string;
}

interface CoinBalance {
  balance: number;
  lifetimeEarned: number;
  lifetimeSpent: number;
  multiplier: number;
  dailyLoginStreak: number;
}

interface UseMembershipReturn {
  tiers: MembershipTier[];
  subscription: UserSubscription | null;
  coins: CoinBalance | null;
  isLoading: boolean;
  error: string | null;
  redeemCoins: (data: { coinsToSpend: number; redemptionType: string; description: string; valueReceived: number }) => Promise<void>;
  refetch: () => void;
}

export function useMembership(): UseMembershipReturn {
  const [tiers, setTiers] = useState<MembershipTier[]>([]);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [coins, setCoins] = useState<CoinBalance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/tier6/membership');
      if (!response.ok) throw new Error('Failed to fetch membership data');
      
      const data = await response.json();
      setTiers(data.tiers || []);
      setSubscription(data.subscription || null);
      setCoins(data.coins || null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const redeemCoins = async (data: { coinsToSpend: number; redemptionType: string; description: string; valueReceived: number }) => {
    try {
      const response = await fetch('/api/tier6/membership/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to redeem coins');
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  return {
    tiers,
    subscription,
    coins,
    isLoading,
    error,
    redeemCoins,
    refetch: fetchData,
  };
}

// Revenue Tracking Hook
interface RevenueStream {
  id: string;
  name: string;
  type: string;
  status: string;
  monthlyRevenue: number;
  monthlyTarget: number;
}

interface RevenueGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  progressPercentage: number;
  targetDate: string;
}

interface RevenueTransaction {
  id: string;
  amount: number;
  type: string;
  date: string;
  description: string;
}

interface UseRevenueReturn {
  streams: RevenueStream[];
  goals: RevenueGoal[];
  transactions: RevenueTransaction[];
  stats: {
    mrr: number;
    arr: number;
    totalRevenue: number;
  };
  isLoading: boolean;
  error: string | null;
  addTransaction: (data: { amount: number; type: string; streamId?: string; description: string }) => Promise<void>;
  createGoal: (data: { name: string; targetAmount: number; targetDate: string }) => Promise<void>;
  refetch: () => void;
}

export function useRevenue(days: number = 30): UseRevenueReturn {
  const [streams, setStreams] = useState<RevenueStream[]>([]);
  const [goals, setGoals] = useState<RevenueGoal[]>([]);
  const [transactions, setTransactions] = useState<RevenueTransaction[]>([]);
  const [stats, setStats] = useState({ mrr: 0, arr: 0, totalRevenue: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/tier6/revenue?days=${days}`);
      if (!response.ok) throw new Error('Failed to fetch revenue data');
      
      const data = await response.json();
      setStreams(data.streams || []);
      setGoals(data.goals || []);
      setTransactions(data.transactions || []);
      setStats(data.totals || { mrr: 0, arr: 0, totalRevenue: 0 });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addTransaction = async (data: { amount: number; type: string; streamId?: string; description: string }) => {
    try {
      const response = await fetch('/api/tier6/revenue/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to add transaction');
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  const createGoal = async (data: { name: string; targetAmount: number; targetDate: string }) => {
    try {
      const response = await fetch('/api/tier6/revenue/goal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to create goal');
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  return {
    streams,
    goals,
    transactions,
    stats,
    isLoading,
    error,
    addTransaction,
    createGoal,
    refetch: fetchData,
  };
}

// Affiliate Hook
interface AffiliateStats {
  totalClicks: number;
  totalConversions: number;
  totalEarnings: number;
  pendingEarnings: number;
  paidEarnings: number;
  conversionRate: number;
  currentTier: number;
  affiliateCode: string;
  referralLink: string;
}

interface Conversion {
  id: string;
  customerEmail: string;
  orderValue: number;
  commissionAmount: number;
  status: string;
  convertedAt: string;
}

interface UseAffiliateReturn {
  stats: AffiliateStats | null;
  conversions: Conversion[];
  isLoading: boolean;
  error: string | null;
  register: (data: { payoutMethod: string; payoutDetails?: object }) => Promise<void>;
  requestPayout: () => Promise<void>;
  refetch: () => void;
}

export function useAffiliate(): UseAffiliateReturn {
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/tier6/affiliate');
      if (!response.ok) throw new Error('Failed to fetch affiliate data');
      
      const data = await response.json();
      setStats(data.stats || null);
      setConversions(data.conversions || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const register = async (data: { payoutMethod: string; payoutDetails?: object }) => {
    try {
      const response = await fetch('/api/tier6/affiliate/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to register as affiliate');
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  const requestPayout = async () => {
    try {
      const response = await fetch('/api/tier6/affiliate/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) throw new Error('Failed to request payout');
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  return {
    stats,
    conversions,
    isLoading,
    error,
    register,
    requestPayout,
    refetch: fetchData,
  };
}
