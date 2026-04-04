/**
 * Revenue Hooks
 * React hooks for revenue tracking and management
 */

import { useState, useEffect, useCallback } from 'react';
import { revenueService, RevenueTransaction, RevenueGoal, RevenueStream, RevenueDashboard } from '@/layer-3-data/services/revenue-service';

// Hook for revenue dashboard
export function useRevenueDashboard() {
  const [data, setData] = useState<RevenueDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await revenueService.getDashboard();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
}

// Hook for transactions
export function useRevenueTransactions(options?: {
  limit?: number;
  source?: string;
  startDate?: string;
  endDate?: string;
}) {
  const [transactions, setTransactions] = useState<RevenueTransaction[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await revenueService.getTransactions({
        ...options,
        offset,
        limit: options?.limit || 50,
      });
      setTransactions(result.transactions);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [options?.source, options?.startDate, options?.endDate, offset]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const loadMore = useCallback(() => {
    setOffset(prev => prev + (options?.limit || 50));
  }, [options?.limit]);

  const createTransaction = useCallback(async (transaction: RevenueTransaction) => {
    const result = await revenueService.createTransaction(transaction);
    refetch();
    return result;
  }, [refetch]);

  return { transactions, total, isLoading, error, refetch, loadMore, createTransaction };
}

// Hook for revenue goals
export function useRevenueGoals() {
  const [goals, setGoals] = useState<RevenueGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await revenueService.getGoals();
      setGoals(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const createGoal = useCallback(async (goal: RevenueGoal) => {
    const result = await revenueService.createGoal(goal);
    refetch();
    return result;
  }, [refetch]);

  const updateGoal = useCallback(async (id: string, goal: Partial<RevenueGoal>) => {
    const result = await revenueService.updateGoal(id, goal);
    refetch();
    return result;
  }, [refetch]);

  return { goals, isLoading, error, refetch, createGoal, updateGoal };
}

// Hook for revenue streams
export function useRevenueStreams() {
  const [streams, setStreams] = useState<RevenueStream[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await revenueService.getStreams();
      setStreams(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const createStream = useCallback(async (stream: RevenueStream) => {
    const result = await revenueService.createStream(stream);
    refetch();
    return result;
  }, [refetch]);

  const updateStream = useCallback(async (id: string, stream: Partial<RevenueStream>) => {
    const result = await revenueService.updateStream(id, stream);
    refetch();
    return result;
  }, [refetch]);

  return { streams, isLoading, error, refetch, createStream, updateStream };
}

// Hook for revenue analytics
export function useRevenueAnalytics(period: 'week' | 'month' | 'quarter' | 'year' = 'month') {
  const [data, setData] = useState<{
    revenue: number;
    transactions: number;
    averageOrderValue: number;
    growthRate: number;
    bySource: Record<string, number>;
    trend: Array<{ date: string; revenue: number; transactions: number }>;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await revenueService.getAnalytics(period);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [period]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
}
