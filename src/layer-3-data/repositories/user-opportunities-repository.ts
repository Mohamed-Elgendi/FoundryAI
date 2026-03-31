/**
 * User Opportunities Repository
 * Handles CRUD operations for user-saved opportunities
 */

import { BaseRepository } from './base-repository';
import { Tables } from '../storage/database.types';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../storage/database.types';

export type UserOpportunity = Tables['user_opportunities']['Row'];
export type UserOpportunityInsert = Tables['user_opportunities']['Insert'];
export type UserOpportunityUpdate = Tables['user_opportunities']['Update'];

export class UserOpportunitiesRepository extends BaseRepository<'user_opportunities'> {
  constructor(client: SupabaseClient<Database>) {
    super('user_opportunities', client);
  }

  /**
   * Find all saved opportunities for a user with opportunity details
   */
  async findByUserId(userId: string): Promise<(UserOpportunity & { opportunity?: any })[]> {
    const { data, error } = await (this.client
      .from('user_opportunities')
      .select(`
        *,
        opportunity:foundryai_opportunities(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false }) as any);

    if (error) {
      this.handleError(error, 'findByUserId');
    }

    return (data || []) as (UserOpportunity & { opportunity?: any })[];
  }

  /**
   * Find by status
   */
  async findByStatus(userId: string, status: UserOpportunity['status']): Promise<UserOpportunity[]> {
    return this.findAll({
      filter: { user_id: userId, status },
      orderBy: 'updated_at',
      orderDirection: 'desc'
    });
  }

  /**
   * Check if user has saved a specific opportunity
   */
  async isSaved(userId: string, opportunityId: string): Promise<boolean> {
    const { data, error } = await (this.client
      .from('user_opportunities')
      .select('id')
      .eq('user_id', userId)
      .eq('opportunity_id', opportunityId)
      .single() as any);

    if (error && error.code !== 'PGRST116') {
      this.handleError(error, 'isSaved');
    }

    return !!data;
  }

  /**
   * Save an opportunity for a user (creates if not exists)
   */
  async saveOpportunity(userId: string, opportunityId: string, notes?: string): Promise<UserOpportunity> {
    const existing = await this.findOne({
      filter: { user_id: userId, opportunity_id: opportunityId }
    });

    if (existing) {
      return this.update(existing.id, { status: 'saved', notes: notes || existing.notes });
    }

    return this.create({
      user_id: userId,
      opportunity_id: opportunityId,
      status: 'saved',
      notes
    });
  }

  /**
   * Update status
   */
  async updateStatus(id: string, status: UserOpportunity['status']): Promise<UserOpportunity> {
    return this.update(id, { status });
  }

  /**
   * Update notes
   */
  async updateNotes(id: string, notes: string): Promise<UserOpportunity> {
    return this.update(id, { notes });
  }

  /**
   * Get statistics for a user
   */
  async getStats(userId: string): Promise<{
    saved: number;
    inProgress: number;
    completed: number;
    dismissed: number;
    total: number;
  }> {
    const { data, error } = await (this.client
      .from('user_opportunities')
      .select('status')
      .eq('user_id', userId) as any);

    if (error) {
      this.handleError(error, 'getStats');
    }

    const items = data || [];
    return {
      saved: items.filter((i: UserOpportunity) => i.status === 'saved').length,
      inProgress: items.filter((i: UserOpportunity) => i.status === 'in_progress').length,
      completed: items.filter((i: UserOpportunity) => i.status === 'completed').length,
      dismissed: items.filter((i: UserOpportunity) => i.status === 'dismissed').length,
      total: items.length
    };
  }
}
