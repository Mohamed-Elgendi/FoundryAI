import { BaseRepository } from './base-repository';
import { Tables } from '../storage/database.types';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../storage/database.types';

export type Template = Tables['foundryai_templates']['Row'];
export type TemplateInsert = Tables['foundryai_templates']['Insert'];
export type TemplateUpdate = Tables['foundryai_templates']['Update'];

export type TemplateTier = Template['tier'];

/**
 * Template Repository
 * Manages AI-generated building templates organized by tier
 */
export class TemplateRepository extends BaseRepository<'foundryai_templates'> {
  constructor(client: SupabaseClient<Database>) {
    super('foundryai_templates', client);
  }

  /**
   * Get templates available for a specific tier
   */
  async getByTier(tier: TemplateTier): Promise<Template[]> {
    return this.findAll({ 
      filter: { is_active: true } as Partial<Template>,
      orderBy: 'created_at',
      orderDirection: 'desc'
    });
  }

  /**
   * Get templates for user's tier and below
   */
  async getAvailableForTier(userTier: TemplateTier): Promise<Template[]> {
    const tierHierarchy: Record<TemplateTier, number> = {
      free: 0,
      starter: 1,
      pro: 2,
      elite: 3,
      legend: 4
    };

    const userTierLevel = tierHierarchy[userTier];
    const allowedTiers = Object.entries(tierHierarchy)
      .filter(([, level]) => level <= userTierLevel)
      .map(([tier]) => tier) as TemplateTier[];

    const { data, error } = await this.client
      .from(this.table)
      .select('*')
      .eq('is_active', true)
      .in('tier', allowedTiers)
      .order('tier', { ascending: true });

    if (error) {
      this.handleError(error, 'getAvailableForTier');
    }

    return (data || []) as Template[];
  }

  /**
   * Find templates by archetype
   */
  async findByArchetype(archetype: string): Promise<Template[]> {
    return this.findAll({ 
      filter: { archetype, is_active: true } as Partial<Template>,
      orderBy: 'tier',
      orderDirection: 'asc'
    });
  }

  /**
   * Find templates by category
   */
  async findByCategory(category: string): Promise<Template[]> {
    return this.findAll({ 
      filter: { category, is_active: true } as Partial<Template>,
      orderBy: 'created_at',
      orderDirection: 'desc'
    });
  }

  /**
   * Get free templates
   */
  async getFreeTemplates(): Promise<Template[]> {
    return this.findAll({ 
      filter: { tier: 'free', is_active: true } as Partial<Template>,
      orderBy: 'created_at',
      orderDirection: 'desc'
    });
  }

  /**
   * Search templates by title
   */
  async searchByTitle(searchTerm: string): Promise<Template[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select('*')
      .eq('is_active', true)
      .ilike('title', `%${searchTerm}%`);

    if (error) {
      this.handleError(error, 'searchByTitle');
    }

    return (data || []) as Template[];
  }

  /**
   * Get templates for specific archetype and tier
   */
  async getForArchetypeAndTier(archetype: string, tier: TemplateTier): Promise<Template[]> {
    return this.findAll({ 
      filter: { archetype, tier, is_active: true } as Partial<Template>,
      orderBy: 'created_at',
      orderDirection: 'desc'
    });
  }

  /**
   * Clone a template (for customization)
   */
  async cloneTemplate(templateId: string, newTitle: string): Promise<Template> {
    const original = await this.findById(templateId);
    if (!original) {
      throw new Error('Template not found');
    }

    return this.create({
      title: newTitle,
      content: original.content,
      archetype: original.archetype,
      tier: original.tier,
      category: original.category,
      is_active: true
    });
  }
}
