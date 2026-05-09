import { BaseRepository } from './base-repository';
import { Tables } from '../storage/database.types';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../storage/database.types';

export type Profile = Tables['foundryai_profiles']['Row'];
export type ProfileInsert = Tables['foundryai_profiles']['Insert'];
export type ProfileUpdate = Tables['foundryai_profiles']['Update'];

/**
 * Profile Repository
 * Manages user profiles with tier and revenue tracking
 */
export class ProfileRepository extends BaseRepository<'foundryai_profiles'> {
  constructor(client: SupabaseClient<Database>) {
    super('foundryai_profiles', client);
  }

  /**
   * Find profile by email
   */
  async findByEmail(email: string): Promise<Profile | null> {
    return this.findOne({ filter: { email } as Partial<Profile> });
  }

  /**
   * Find profiles by tier
   */
  async findByTier(tier: Profile['tier']): Promise<Profile[]> {
    return this.findAll({ filter: { tier } as Partial<Profile> });
  }

  /**
   * Update user archetype
   */
  async updateArchetype(userId: string, archetype: string): Promise<Profile> {
    return this.update(userId, { archetype });
  }

  /**
   * Update user tier
   */
  async updateTier(userId: string, tier: Profile['tier']): Promise<Profile> {
    return this.update(userId, { tier });
  }

  /**
   * Add revenue to user's total
   */
  async addRevenue(userId: string, amount: number): Promise<Profile> {
    const profile = await this.findById(userId);
    if (!profile) {
      throw new Error('Profile not found');
    }
    
    const newRevenue = (profile.revenue_generated || 0) + amount;
    return this.update(userId, { revenue_generated: newRevenue });
  }

  /**
   * Search profiles by display name (case-insensitive)
   */
  async searchByName(searchTerm: string): Promise<Profile[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select('*')
      .ilike('display_name', `%${searchTerm}%`);

    if (error) {
      this.handleError(error, 'searchByName');
    }

    return (data || []) as Profile[];
  }
}
