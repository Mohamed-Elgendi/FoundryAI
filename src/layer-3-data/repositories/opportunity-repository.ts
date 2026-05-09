import { BaseRepository } from './base-repository';
import { Tables } from '../storage/database.types';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../storage/database.types';

export type Opportunity = Tables['foundryai_opportunities']['Row'];
export type OpportunityInsert = Tables['foundryai_opportunities']['Insert'];
export type OpportunityUpdate = Tables['foundryai_opportunities']['Update'];

export type OpportunityCategory = Opportunity['category'];
export type DifficultyLevel = Opportunity['difficulty_level'];

/**
 * Opportunity Repository
 * Manages AI-validated business opportunities
 */
export class OpportunityRepository extends BaseRepository<'foundryai_opportunities'> {
  constructor(client: SupabaseClient<Database>) {
    super('foundryai_opportunities', client);
  }

  /**
   * Find opportunities by archetype
   */
  async findByArchetype(archetype: string): Promise<Opportunity[]> {
    return this.findAll({ 
      filter: { archetype, is_active: true } as Partial<Opportunity>,
      orderBy: 'validation_score',
      orderDirection: 'desc'
    });
  }

  /**
   * Find opportunities by category
   */
  async findByCategory(category: OpportunityCategory): Promise<Opportunity[]> {
    return this.findAll({ 
      filter: { category, is_active: true } as Partial<Opportunity>,
      orderBy: 'validation_score',
      orderDirection: 'desc'
    });
  }

  /**
   * Find opportunities by difficulty level
   */
  async findByDifficulty(level: DifficultyLevel): Promise<Opportunity[]> {
    return this.findAll({ 
      filter: { difficulty_level: level, is_active: true } as Partial<Opportunity>,
      orderBy: 'validation_score',
      orderDirection: 'desc'
    });
  }

  /**
   * Get trending opportunities
   */
  async getTrending(limit: number = 10): Promise<Opportunity[]> {
    return this.findAll({ 
      filter: { is_trending: true, is_active: true } as Partial<Opportunity>,
      orderBy: 'trending_score',
      orderDirection: 'desc',
      limit
    });
  }

  /**
   * Get top validated opportunities
   */
  async getTopValidated(limit: number = 10): Promise<Opportunity[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select('*')
      .eq('is_active', true)
      .order('validation_score', { ascending: false })
      .limit(limit);

    if (error) {
      this.handleError(error, 'getTopValidated');
    }

    return (data || []) as Opportunity[];
  }

  /**
   * Search opportunities by keywords
   */
  async searchByKeywords(keywords: string[]): Promise<Opportunity[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select('*')
      .eq('is_active', true)
      .overlaps('keywords', keywords);

    if (error) {
      this.handleError(error, 'searchByKeywords');
    }

    return (data || []) as Opportunity[];
  }

  /**
   * Find opportunities matching user archetype and tier
   */
  async findMatching(archetype: string, tier: string, limit: number = 5): Promise<Opportunity[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select('*')
      .eq('is_active', true)
      .eq('archetype', archetype)
      .order('validation_score', { ascending: false })
      .limit(limit);

    if (error) {
      this.handleError(error, 'findMatching');
    }

    return (data || []) as Opportunity[];
  }

  /**
   * Mark opportunity as trending
   */
  async markAsTrending(id: string, trendingScore: number): Promise<Opportunity> {
    return this.update(id, { 
      is_trending: true, 
      trending_score: trendingScore 
    });
  }

  /**
   * Activate/deactivate opportunity
   */
  async setActive(id: string, active: boolean): Promise<Opportunity> {
    return this.update(id, { is_active: active });
  }

  /**
   * Get opportunities for beginner users
   */
  async getBeginnerOpportunities(limit: number = 5): Promise<Opportunity[]> {
    return this.findAll({ 
      filter: { 
        difficulty_level: 'beginner', 
        is_active: true 
      } as Partial<Opportunity>,
      orderBy: 'validation_score',
      orderDirection: 'desc',
      limit
    });
  }
}
