/**
 * Plans Repository
 * Handles CRUD operations for business plans
 */

import { BaseRepository } from './base-repository';
import { Tables } from '../storage/database.types';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../storage/database.types';

export type Plan = Tables['plans']['Row'];
export type PlanInsert = Tables['plans']['Insert'];
export type PlanUpdate = Tables['plans']['Update'];

export class PlansRepository extends BaseRepository<'plans'> {
  constructor(client: SupabaseClient<Database>) {
    super('plans', client);
  }

  /**
   * Find all plans for a specific user
   */
  async findByUserId(userId: string): Promise<Plan[]> {
    return this.findAll({
      filter: { user_id: userId },
      orderBy: 'created_at',
      orderDirection: 'desc'
    });
  }

  /**
   * Find favorite plans for a user
   */
  async findFavorites(userId: string): Promise<Plan[]> {
    return this.findAll({
      filter: { user_id: userId, is_favorite: true },
      orderBy: 'updated_at',
      orderDirection: 'desc'
    });
  }

  /**
   * Find plans by status
   */
  async findByStatus(userId: string, status: Plan['status']): Promise<Plan[]> {
    return this.findAll({
      filter: { user_id: userId, status },
      orderBy: 'updated_at',
      orderDirection: 'desc'
    });
  }

  /**
   * Toggle favorite status
   */
  async toggleFavorite(id: string, userId: string): Promise<Plan> {
    const plan = await this.findById(id);
    if (!plan || plan.user_id !== userId) {
      throw new Error('Plan not found or access denied');
    }
    return this.update(id, { is_favorite: !plan.is_favorite });
  }

  /**
   * Search plans by title or business idea
   */
  async search(userId: string, query: string): Promise<Plan[]> {
    const { data, error } = await (this.client
      .from('plans')
      .select('*')
      .eq('user_id', userId)
      .or(`title.ilike.%${query}%,business_idea.ilike.%${query}%`)
      .order('updated_at', { ascending: false }) as any);

    if (error) {
      this.handleError(error, 'search');
    }

    return (data || []) as Plan[];
  }

  /**
   * Get plan statistics for a user
   */
  async getStats(userId: string): Promise<{
    total: number;
    draft: number;
    published: number;
    archived: number;
    favorites: number;
  }> {
    const { data, error } = await (this.client
      .from('plans')
      .select('status, is_favorite', { count: 'exact' })
      .eq('user_id', userId) as any);

    if (error) {
      this.handleError(error, 'getStats');
    }

    const plans = data || [];
    return {
      total: plans.length,
      draft: plans.filter((p: Plan) => p.status === 'draft').length,
      published: plans.filter((p: Plan) => p.status === 'published').length,
      archived: plans.filter((p: Plan) => p.status === 'archived').length,
      favorites: plans.filter((p: Plan) => p.is_favorite).length
    };
  }
}
