// React Hook for Credits & Billing - ACTUAL IMPLEMENTATION
// Beast Mode - Production Ready

'use client';

import { useState, useEffect, useCallback } from 'react';
import { billingService } from '@/layer-3-data/services/billing-service';
import type { UserCredits, CreditTransaction, UsageStats } from '@/types/billing';

interface UseCreditsReturn {
  credits: UserCredits | null;
  transactions: CreditTransaction[];
  stats: UsageStats | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  calculateCost: (featureType: string, inputTokens: number, outputTokens: number) => Promise<number>;
}

export function useCredits(userId?: string): UseCreditsReturn {
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch all billing data in parallel
      const [creditsData, transactionsData, statsData] = await Promise.all([
        billingService.getUserCredits(userId),
        billingService.getTransactions(userId, 50),
        billingService.getUsageStats(userId, 'month')
      ]);

      setCredits(creditsData);
      setTransactions(transactionsData);
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch credits data');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const calculateCost = useCallback(async (
    featureType: string,
    inputTokens: number,
    outputTokens: number
  ): Promise<number> => {
    try {
      const calculation = await billingService.calculateCredits(featureType, inputTokens, outputTokens);
      return calculation.totalCredits;
    } catch (err) {
      console.error('Error calculating cost:', err);
      return 1; // Safe default
    }
  }, []);

  return {
    credits,
    transactions,
    stats,
    loading,
    error,
    refresh: fetchData,
    calculateCost
  };
}
