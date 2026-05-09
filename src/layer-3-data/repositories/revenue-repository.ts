import { BaseRepository } from './base-repository';
import { Tables } from '../storage/database.types';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../storage/database.types';

export type Revenue = Tables['foundryai_revenue']['Row'];
export type RevenueInsert = Tables['foundryai_revenue']['Insert'];
export type RevenueUpdate = Tables['foundryai_revenue']['Update'];

/**
 * Revenue Repository
 * Manages user revenue records for tier progression
 */
export class RevenueRepository extends BaseRepository<'foundryai_revenue'> {
  constructor(client: SupabaseClient<Database>) {
    super('foundryai_revenue', client);
  }

  /**
   * Get all revenue for a user
   */
  async getByUser(userId: string): Promise<Revenue[]> {
    return this.findAll({ 
      filter: { user_id: userId } as Partial<Revenue>,
      orderBy: 'date',
      orderDirection: 'desc'
    });
  }

  /**
   * Get revenue for user in date range
   */
  async getByDateRange(userId: string, startDate: string, endDate: string): Promise<Revenue[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });

    if (error) {
      this.handleError(error, 'getByDateRange');
    }

    return (data || []) as Revenue[];
  }

  /**
   * Get total revenue for user
   */
  async getTotalRevenue(userId: string): Promise<number> {
    const { data, error } = await this.client
      .from(this.table)
      .select('amount')
      .eq('user_id', userId);

    if (error) {
      this.handleError(error, 'getTotalRevenue');
    }

    return (data || []).reduce((sum, r: { amount?: number }) => sum + (r.amount || 0), 0);
  }

  /**
   * Record revenue with milestone
   */
  async recordMilestoneRevenue(
    userId: string, 
    amount: number, 
    source: string, 
    milestone: string,
    description?: string
  ): Promise<Revenue> {
    return this.create({
      user_id: userId,
      amount,
      source,
      milestone_triggered: milestone,
      description,
      date: new Date().toISOString().split('T')[0]
    });
  }

  /**
   * Get revenue by source
   */
  async getBySource(userId: string, source: string): Promise<Revenue[]> {
    return this.findAll({ 
      filter: { user_id: userId, source } as Partial<Revenue>,
      orderBy: 'date',
      orderDirection: 'desc'
    });
  }

  /**
   * Get milestone-triggered revenue
   */
  async getMilestoneRevenue(userId: string): Promise<Revenue[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select('*')
      .eq('user_id', userId)
      .not('milestone_triggered', 'is', null)
      .order('date', { ascending: false });

    if (error) {
      this.handleError(error, 'getMilestoneRevenue');
    }

    return (data || []) as Revenue[];
  }

  /**
   * Get monthly revenue summary
   */
  async getMonthlySummary(userId: string): Promise<{ month: string; total: number }[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select('date, amount')
      .eq('user_id', userId);

    if (error) {
      this.handleError(error, 'getMonthlySummary');
    }

    const revenues = data || [];
    const monthlyMap = new Map<string, number>();

    revenues.forEach((r: { date: string; amount: number }) => {
      const month = r.date.substring(0, 7); // YYYY-MM
      monthlyMap.set(month, (monthlyMap.get(month) || 0) + r.amount);
    });

    return Array.from(monthlyMap.entries())
      .map(([month, total]) => ({ month, total }))
      .sort((a, b) => b.month.localeCompare(a.month));
  }
}
