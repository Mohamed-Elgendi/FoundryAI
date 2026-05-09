/**
 * Opportunity Radar Service
 * Multi-source intelligence gathering and opportunity validation
 */

import { createBrowserSupabaseClient } from '@/layer-3-data/supabase/client';
import { RepositoryError } from '@/layer-3-data/repositories/types';

const supabase = createBrowserSupabaseClient();

// ============================================
// OPPORTUNITY VALIDATION ALGORITHM
// ============================================

export interface ValidationDimensions {
  demandValidation: number;      // 0-25
  competitionAnalysis: number;   // 0-25
  technicalFeasibility: number;  // 0-25
  monetizationPotential: number; // 0-25
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  archetype: string;
  category: 'saas' | 'content' | 'service' | 'product' | 'agency' | 'marketplace';
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  timeline: string;
  budgetEstimate: number;
  validationScore: number;
  trendingScore: number;
  demandSignals: {
    searchVolume: number;
    trendDirection: 'up' | 'down' | 'stable';
    painSignals: string[];
  };
  technicalFeasibility: {
    complexity: 'low' | 'medium' | 'high';
    skillsRequired: string[];
    mvpTimeline: string;
  };
  monetizationData: {
    pricingModel: string;
    priceRange: string;
    marketSize: string;
  };
  competitionAnalysis: {
    competitorCount: number;
    differentiationOpportunity: string;
    marketFragmentation: 'low' | 'medium' | 'high';
  };
  keywords: string[];
  isActive: boolean;
  isTrending: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// INTELLIGENCE GATHERING
// ============================================

export interface IntelligenceSource {
  name: string;
  type: 'search' | 'platform' | 'market' | 'social' | 'competitive' | 'emerging';
  reliability: number; // 0-100
  updateFrequency: string;
  lastUpdate: string;
}

export const intelligenceSources: IntelligenceSource[] = [
  { name: 'Google Trends', type: 'search', reliability: 85, updateFrequency: 'hourly', lastUpdate: new Date().toISOString() },
  { name: 'YouTube Analytics', type: 'platform', reliability: 90, updateFrequency: 'real-time', lastUpdate: new Date().toISOString() },
  { name: 'Reddit Communities', type: 'social', reliability: 70, updateFrequency: '15min', lastUpdate: new Date().toISOString() },
  { name: 'Job Boards', type: 'market', reliability: 75, updateFrequency: '6hours', lastUpdate: new Date().toISOString() },
  { name: 'Product Hunt', type: 'competitive', reliability: 80, updateFrequency: 'weekly', lastUpdate: new Date().toISOString() },
  { name: 'AI Tool Releases', type: 'emerging', reliability: 65, updateFrequency: 'real-time', lastUpdate: new Date().toISOString() },
];

// ============================================
// OPPORTUNITY REPOSITORY
// ============================================

export const opportunityRepository = {
  async getOpportunities(options?: {
    archetype?: string;
    category?: string;
    difficulty?: string;
    minScore?: number;
    isTrending?: boolean;
    limit?: number;
  }): Promise<Opportunity[]> {
    let query = supabase
      .from('opportunities')
      .select('*')
      .eq('is_active', true);

    if (options?.archetype) {
      query = query.eq('archetype', options.archetype);
    }

    if (options?.category) {
      query = query.eq('category', options.category);
    }

    if (options?.difficulty) {
      query = query.eq('difficulty_level', options.difficulty);
    }

    if (options?.minScore) {
      query = query.gte('validation_score', options.minScore);
    }

    if (options?.isTrending) {
      query = query.eq('is_trending', true);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query.order('validation_score', { ascending: false });

    if (error) {
      throw new RepositoryError('Failed to fetch opportunities', 'DATABASE', error);
    }

    return (data as unknown as Opportunity[]) || [];
  },

  async getOpportunityById(id: string): Promise<Opportunity | null> {
    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new RepositoryError('Failed to fetch opportunity', 'DATABASE', error);
    }

    return data as unknown as Opportunity;
  },

  async getTrendingOpportunities(limit = 10): Promise<Opportunity[]> {
    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .eq('is_trending', true)
      .eq('is_active', true)
      .order('trending_score', { ascending: false })
      .limit(limit);

    if (error) {
      throw new RepositoryError('Failed to fetch trending opportunities', 'DATABASE', error);
    }

    return (data as unknown as Opportunity[]) || [];
  },

  async getOpportunitiesByArchetype(archetype: string): Promise<Opportunity[]> {
    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .eq('archetype', archetype)
      .eq('is_active', true)
      .order('validation_score', { ascending: false });

    if (error) {
      throw new RepositoryError('Failed to fetch archetype opportunities', 'DATABASE', error);
    }

    return (data as unknown as Opportunity[]) || [];
  },
};

// ============================================
// VALIDATION SCORING
// ============================================

export function calculateValidationScore(dimensions: ValidationDimensions): number {
  const total = 
    dimensions.demandValidation +
    dimensions.competitionAnalysis +
    dimensions.technicalFeasibility +
    dimensions.monetizationPotential;
  return Math.min(100, Math.max(0, total));
}

export function interpretValidationScore(score: number): {
  rating: string;
  recommendation: string;
  action: 'launch_immediately' | 'proceed' | 'consider_modifications' | 'high_risk' | 'reject';
} {
  if (score >= 80) {
    return {
      rating: 'EXCEPTIONAL',
      recommendation: 'Launch immediately - This is a high-value opportunity with strong validation',
      action: 'launch_immediately',
    };
  } else if (score >= 60) {
    return {
      rating: 'STRONG',
      recommendation: 'Proceed with confidence - Good validation across all dimensions',
      action: 'proceed',
    };
  } else if (score >= 40) {
    return {
      rating: 'MODERATE',
      recommendation: 'Consider modifications - Some dimensions need improvement',
      action: 'consider_modifications',
    };
  } else if (score >= 20) {
    return {
      rating: 'WEAK',
      recommendation: 'High risk - Significant validation issues identified',
      action: 'high_risk',
    };
  } else {
    return {
      rating: 'REJECT',
      recommendation: 'Do not pursue - Insufficient validation across all dimensions',
      action: 'reject',
    };
  }
}

// ============================================
// IDEA EXTRACTION ENGINE
// ============================================

export interface IdeaExtractionInput {
  vagueIdea: string;
  skills: string[];
  interests: string[];
  timeAvailability: 'minimal' | 'moderate' | 'significant';
  budget: 'zero' | 'small' | 'moderate';
}

export interface ExtractedOpportunity {
  archetype: string;
  concept: string;
  description: string;
  validationScore: number;
  reasoning: string;
  firstSteps: string[];
}

export const ideaExtractionService = {
  async extractOpportunities(input: IdeaExtractionInput): Promise<ExtractedOpportunity[]> {
    // This would typically call an AI service to extract opportunities
    // For now, return template-based extractions
    const opportunities: ExtractedOpportunity[] = [];

    // Map vague ideas to archetypes based on keywords
    const ideaLower = input.vagueIdea.toLowerCase();

    if (ideaLower.includes('help') || ideaLower.includes('freelance') || ideaLower.includes('client')) {
      opportunities.push({
        archetype: 'service',
        concept: 'Premium Service Provider',
        description: `Done-for-you ${input.vagueIdea.toLowerCase()} services for businesses`,
        validationScore: 75,
        reasoning: 'Service businesses have low barrier to entry and immediate revenue potential',
        firstSteps: [
          'Define your service offering',
          'Create portfolio pieces',
          'Set up client acquisition system',
          'Price your services',
        ],
      });
    }

    if (ideaLower.includes('app') || ideaLower.includes('tool') || ideaLower.includes('software')) {
      opportunities.push({
        archetype: 'saas',
        concept: 'Niche SaaS Product',
        description: `Specialized tool for ${input.vagueIdea.toLowerCase()}`,
        validationScore: 68,
        reasoning: 'SaaS offers recurring revenue and scalability',
        firstSteps: [
          'Validate problem with potential users',
          'Build MVP with core feature',
          'Get beta users',
          'Iterate based on feedback',
        ],
      });
    }

    if (ideaLower.includes('content') || ideaLower.includes('video') || ideaLower.includes('youtube')) {
      opportunities.push({
        archetype: 'content',
        concept: 'Faceless YouTube Channel',
        description: `Automated content about ${input.vagueIdea.toLowerCase()}`,
        validationScore: 72,
        reasoning: 'Content businesses can generate passive income through multiple revenue streams',
        firstSteps: [
          'Research trending topics in niche',
          'Set up content production system',
          'Create first 10 videos',
          'Optimize for algorithm',
        ],
      });
    }

    return opportunities.sort((a, b) => b.validationScore - a.validationScore);
  },
};

// ============================================
// RADAR SERVICE
// ============================================

export const radarService = {
  async getRadarDashboard() {
    const [
      opportunities,
      trending,
      sources,
    ] = await Promise.all([
      opportunityRepository.getOpportunities({ limit: 20 }),
      opportunityRepository.getTrendingOpportunities(5),
      Promise.resolve(intelligenceSources),
    ]);

    const scoreDistribution = {
      exceptional: opportunities.filter(o => o.validationScore >= 80).length,
      strong: opportunities.filter(o => o.validationScore >= 60 && o.validationScore < 80).length,
      moderate: opportunities.filter(o => o.validationScore >= 40 && o.validationScore < 60).length,
      weak: opportunities.filter(o => o.validationScore < 40).length,
    };

    return {
      opportunities,
      trending,
      sources,
      stats: {
        totalOpportunities: opportunities.length,
        averageScore: opportunities.length > 0
          ? Math.round(opportunities.reduce((a, o) => a + o.validationScore, 0) / opportunities.length)
          : 0,
        scoreDistribution,
        lastUpdated: new Date().toISOString(),
      },
    };
  },

  async validateOpportunity(opportunityId: string) {
    const opportunity = await opportunityRepository.getOpportunityById(opportunityId);
    if (!opportunity) {
      throw new Error('Opportunity not found');
    }

    const dimensions: ValidationDimensions = {
      demandValidation: Math.floor(opportunity.validationScore * 0.25),
      competitionAnalysis: Math.floor(opportunity.validationScore * 0.25),
      technicalFeasibility: Math.floor(opportunity.validationScore * 0.25),
      monetizationPotential: Math.floor(opportunity.validationScore * 0.25),
    };

    const score = calculateValidationScore(dimensions);
    const interpretation = interpretValidationScore(score);

    return {
      opportunity,
      dimensions,
      score,
      interpretation,
    };
  },

  async getArchetypeAnalysis(archetype: string) {
    const opportunities = await opportunityRepository.getOpportunitiesByArchetype(archetype);

    return {
      archetype,
      opportunityCount: opportunities.length,
      averageScore: opportunities.length > 0
        ? Math.round(opportunities.reduce((a, o) => a + o.validationScore, 0) / opportunities.length)
        : 0,
      difficultyBreakdown: {
        beginner: opportunities.filter(o => o.difficultyLevel === 'beginner').length,
        intermediate: opportunities.filter(o => o.difficultyLevel === 'intermediate').length,
        advanced: opportunities.filter(o => o.difficultyLevel === 'advanced').length,
      },
      topOpportunities: opportunities.slice(0, 5),
    };
  },
};
