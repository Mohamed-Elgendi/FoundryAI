/**
 * Revenue Service
 * Client-side service for revenue tracking and management
 */

import { createBrowserSupabaseClient } from '@/layer-3-data/supabase/client';

const API_BASE = '/api/tier4/revenue';

export interface RevenueTransaction {
  id?: string;
  amount: number;
  currency?: string;
  source: string;
  description?: string;
  opportunityId?: string;
  projectId?: string;
  customerId?: string;
  transactionDate?: string;
  transactionType?: 'income' | 'refund' | 'chargeback';
  paymentMethod?: string;
  paymentStatus?: 'pending' | 'completed' | 'failed' | 'refunded';
  isRecurring?: boolean;
  recurringInterval?: string;
  taxAmount?: number;
  feeAmount?: number;
  metadata?: Record<string, unknown>;
}

export interface RevenueGoal {
  id?: string;
  name: string;
  targetAmount: number;
  currentAmount?: number;
  goalType: 'monthly' | 'quarterly' | 'yearly' | 'milestone';
  startDate: string;
  endDate?: string;
  status?: 'active' | 'achieved' | 'missed' | 'cancelled';
  metadata?: Record<string, unknown>;
}

export interface RevenueStream {
  id?: string;
  name: string;
  description?: string;
  streamType: string;
  basePrice?: number;
  pricingModel?: string;
  isActive?: boolean;
  launchedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface RevenueDashboard {
  totalRevenue: number;
  mtdRevenue: number;
  ytdRevenue: number;
  totalTransactions: number;
  activeGoals: number;
  revenueBySource: Record<string, number>;
  recentTransactions: RevenueTransaction[];
  dailyTrend: Array<{ date: string; revenue: number }>;
}

export const revenueService = {
  // Get revenue dashboard
  async getDashboard(): Promise<RevenueDashboard> {
    const response = await fetch(`${API_BASE}/dashboard`);
    if (!response.ok) throw new Error('Failed to fetch revenue dashboard');
    return response.json();
  },

  // Get all transactions
  async getTransactions(options?: {
    limit?: number;
    offset?: number;
    source?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{ transactions: RevenueTransaction[]; total: number }> {
    const params = new URLSearchParams();
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.offset) params.append('offset', options.offset.toString());
    if (options?.source) params.append('source', options.source);
    if (options?.startDate) params.append('startDate', options.startDate);
    if (options?.endDate) params.append('endDate', options.endDate);

    const response = await fetch(`${API_BASE}/transactions?${params}`);
    if (!response.ok) throw new Error('Failed to fetch transactions');
    return response.json();
  },

  // Create transaction
  async createTransaction(transaction: RevenueTransaction): Promise<RevenueTransaction> {
    const response = await fetch(`${API_BASE}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction),
    });
    if (!response.ok) throw new Error('Failed to create transaction');
    return response.json();
  },

  // Update transaction
  async updateTransaction(id: string, transaction: Partial<RevenueTransaction>): Promise<RevenueTransaction> {
    const response = await fetch(`${API_BASE}/transactions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction),
    });
    if (!response.ok) throw new Error('Failed to update transaction');
    return response.json();
  },

  // Delete transaction
  async deleteTransaction(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/transactions/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete transaction');
  },

  // Goals
  async getGoals(): Promise<RevenueGoal[]> {
    const response = await fetch(`${API_BASE}/goals`);
    if (!response.ok) throw new Error('Failed to fetch goals');
    return response.json();
  },

  async createGoal(goal: RevenueGoal): Promise<RevenueGoal> {
    const response = await fetch(`${API_BASE}/goals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goal),
    });
    if (!response.ok) throw new Error('Failed to create goal');
    return response.json();
  },

  async updateGoal(id: string, goal: Partial<RevenueGoal>): Promise<RevenueGoal> {
    const response = await fetch(`${API_BASE}/goals/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goal),
    });
    if (!response.ok) throw new Error('Failed to update goal');
    return response.json();
  },

  // Revenue Streams
  async getStreams(): Promise<RevenueStream[]> {
    const response = await fetch(`${API_BASE}/streams`);
    if (!response.ok) throw new Error('Failed to fetch streams');
    return response.json();
  },

  async createStream(stream: RevenueStream): Promise<RevenueStream> {
    const response = await fetch(`${API_BASE}/streams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stream),
    });
    if (!response.ok) throw new Error('Failed to create stream');
    return response.json();
  },

  async updateStream(id: string, stream: Partial<RevenueStream>): Promise<RevenueStream> {
    const response = await fetch(`${API_BASE}/streams/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stream),
    });
    if (!response.ok) throw new Error('Failed to update stream');
    return response.json();
  },

  // Analytics
  async getAnalytics(period: 'week' | 'month' | 'quarter' | 'year'): Promise<{
    revenue: number;
    transactions: number;
    averageOrderValue: number;
    growthRate: number;
    bySource: Record<string, number>;
    trend: Array<{ date: string; revenue: number; transactions: number }>;
  }> {
    const response = await fetch(`${API_BASE}/analytics?period=${period}`);
    if (!response.ok) throw new Error('Failed to fetch analytics');
    return response.json();
  },
};

export default revenueService;
