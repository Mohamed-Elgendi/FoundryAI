/**
 * Profile Repository
 * User profile data access
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from './base';

export interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  tier: 'free' | 'starter' | 'pro' | 'elite' | 'legend';
  revenue_generated: number;
  archetype: string | null;
  created_at: string;
  updated_at: string;
}

export class ProfileRepository extends BaseRepository<Profile> {
  constructor(client: SupabaseClient) {
    super('foundryai_profiles', client);
  }

  async findByEmail(email: string): Promise<Profile | null> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') {
      this.handleError(error, 'findByEmail');
    }

    return data as Profile | null;
  }
}
