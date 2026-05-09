import { BaseRepository } from './base-repository';
import { Tables } from '../storage/database.types';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../storage/database.types';

export type UserJourney = Tables['foundryai_user_journeys']['Row'];
export type UserJourneyInsert = Tables['foundryai_user_journeys']['Insert'];
export type UserJourneyUpdate = Tables['foundryai_user_journeys']['Update'];

export type JourneyStage = UserJourney['current_stage'];

/**
 * User Journey Repository
 * Manages user progress through the platform stages
 */
export class UserJourneyRepository extends BaseRepository<'foundryai_user_journeys'> {
  constructor(client: SupabaseClient<Database>) {
    super('foundryai_user_journeys', client);
  }

  /**
   * Get or create journey for user
   */
  async getOrCreate(userId: string): Promise<UserJourney> {
    let journey = await this.findOne({ filter: { user_id: userId } as Partial<UserJourney> });
    
    if (!journey) {
      journey = await this.create({
        user_id: userId,
        current_stage: 'discovery',
        build_progress: 0,
        revenue_generated: 0,
        milestones_achieved: [],
        momentum_scores: {},
        brain_dumps: [],
      });
    }
    
    return journey;
  }

  /**
   * Update user's current stage
   */
  async updateStage(userId: string, stage: JourneyStage): Promise<UserJourney> {
    const journey = await this.getOrCreate(userId);
    return this.update(journey.id, { current_stage: stage });
  }

  /**
   * Update build progress (0-100)
   */
  async updateBuildProgress(userId: string, progress: number): Promise<UserJourney> {
    const clampedProgress = Math.max(0, Math.min(100, progress));
    const journey = await this.getOrCreate(userId);
    return this.update(journey.id, { build_progress: clampedProgress });
  }

  /**
   * Select archetype for user
   */
  async selectArchetype(userId: string, archetype: string): Promise<UserJourney> {
    const journey = await this.getOrCreate(userId);
    return this.update(journey.id, { 
      selected_archetype: archetype,
      current_stage: 'foundation'
    });
  }

  /**
   * Select opportunity for user
   */
  async selectOpportunity(userId: string, opportunityId: string): Promise<UserJourney> {
    const journey = await this.getOrCreate(userId);
    return this.update(journey.id, { 
      selected_opportunity_id: opportunityId,
      current_stage: 'build'
    });
  }

  /**
   * Add milestone achievement
   */
  async addMilestone(userId: string, milestone: string): Promise<UserJourney> {
    const journey = await this.getOrCreate(userId);
    const milestones = [...(journey.milestones_achieved || []), milestone];
    return this.update(journey.id, { milestones_achieved: milestones });
  }

  /**
   * Update momentum scores
   */
  async updateMomentumScores(userId: string, scores: Record<string, number>): Promise<UserJourney> {
    const journey = await this.getOrCreate(userId);
    const currentScores = (journey.momentum_scores || {}) as Record<string, number>;
    const updatedScores = { ...currentScores, ...scores };
    return this.update(journey.id, { momentum_scores: updatedScores });
  }

  /**
   * Add brain dump
   */
  async addBrainDump(userId: string, dump: { title: string; content: string; date: string }): Promise<UserJourney> {
    const journey = await this.getOrCreate(userId);
    const dumps = [...((journey.brain_dumps as unknown as Array<Record<string, unknown>>) || []), dump as Record<string, unknown>];
    return this.update(journey.id, { brain_dumps: dumps as unknown as never });
  }

  /**
   * Find users by stage
   */
  async findByStage(stage: JourneyStage): Promise<UserJourney[]> {
    return this.findAll({ filter: { current_stage: stage } as Partial<UserJourney> });
  }

  /**
   * Add revenue to journey total
   */
  async addRevenue(userId: string, amount: number): Promise<UserJourney> {
    const journey = await this.getOrCreate(userId);
    const newRevenue = (journey.revenue_generated || 0) + amount;
    return this.update(journey.id, { revenue_generated: newRevenue });
  }
}
