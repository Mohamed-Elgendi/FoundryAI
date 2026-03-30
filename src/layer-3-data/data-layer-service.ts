import { createSupabaseClient, createServiceClient, getSupabaseBrowserClient } from '../storage/supabase-client';
import { ProfileRepository } from '../repositories/profile-repository';
import { UserJourneyRepository } from '../repositories/user-journey-repository';
import { OpportunityRepository } from '../repositories/opportunity-repository';
import { RevenueRepository } from '../repositories/revenue-repository';
import { TemplateRepository } from '../repositories/template-repository';
import { cacheManager } from '../cache/cache-manager';

/**
 * Data Layer Service
 * Unified interface for all data operations with caching
 */
export class DataLayerService {
  // Repositories
  profiles: ProfileRepository;
  userJourneys: UserJourneyRepository;
  opportunities: OpportunityRepository;
  revenue: RevenueRepository;
  templates: TemplateRepository;
  
  // Cache
  cache = cacheManager;

  constructor(isServer: boolean = false, useServiceRole: boolean = false) {
    const client = useServiceRole 
      ? createServiceClient() 
      : isServer 
        ? createSupabaseClient() 
        : getSupabaseBrowserClient();
    
    this.profiles = new ProfileRepository(client);
    this.userJourneys = new UserJourneyRepository(client);
    this.opportunities = new OpportunityRepository(client);
    this.revenue = new RevenueRepository(client);
    this.templates = new TemplateRepository(client);
  }

  /**
   * Create server-side instance
   */
  static forServer(): DataLayerService {
    return new DataLayerService(true, false);
  }

  /**
   * Create browser-side instance
   */
  static forBrowser(): DataLayerService {
    return new DataLayerService(false, false);
  }

  /**
   * Create admin/service role instance (for background jobs)
   */
  static forAdmin(): DataLayerService {
    return new DataLayerService(true, true);
  }

  // ==========================================
  // Cached Operations
  // ==========================================

  /**
   * Get user profile with caching
   */
  async getProfile(userId: string) {
    const cacheKey = `profile:${userId}`;
    return this.cache.getOrCompute(cacheKey, () => 
      this.profiles.findById(userId)
    , 300); // 5 min cache
  }

  /**
   * Get user journey with caching
   */
  async getUserJourney(userId: string) {
    const cacheKey = `journey:${userId}`;
    return this.cache.getOrCompute(cacheKey, () =>
      this.userJourneys.getOrCreate(userId)
    , 60); // 1 min cache (changes frequently)
  }

  /**
   * Get trending opportunities with caching
   */
  async getTrendingOpportunities(limit: number = 10) {
    const cacheKey = `opportunities:trending:${limit}`;
    return this.cache.getOrCompute(cacheKey, () =>
      this.opportunities.getTrending(limit)
    , 600); // 10 min cache
  }

  /**
   * Get opportunities by archetype with caching
   */
  async getOpportunitiesByArchetype(archetype: string) {
    const cacheKey = `opportunities:archetype:${archetype}`;
    return this.cache.getOrCompute(cacheKey, () =>
      this.opportunities.findByArchetype(archetype)
    , 300);
  }

  /**
   * Get available templates for tier with caching
   */
  async getTemplatesForTier(tier: string) {
    const cacheKey = `templates:tier:${tier}`;
    return this.cache.getOrCompute(cacheKey, () =>
      this.templates.getAvailableForTier(tier as any)
    , 600);
  }

  // ==========================================
  // Cache Invalidation
  // ==========================================

  invalidateProfile(userId: string) {
    this.cache.delete(`profile:${userId}`);
  }

  invalidateUserJourney(userId: string) {
    this.cache.delete(`journey:${userId}`);
  }

  invalidateOpportunities() {
    this.cache.invalidatePattern('opportunities:');
  }

  invalidateTemplates() {
    this.cache.invalidatePattern('templates:');
  }
}

// Default export for convenience
export const dataLayer = DataLayerService.forBrowser();
