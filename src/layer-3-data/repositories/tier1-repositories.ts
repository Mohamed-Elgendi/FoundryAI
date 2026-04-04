/**
 * Tier 1 Foundation Repository
 * Repository for all Tier 1 Core Foundation systems
 */

import { BaseRepository, QueryOptions } from './base';
import { RepositoryError } from './types';
import { supabase } from '../supabase/client';
import type {
  BeliefScore,
  BeliefEvidence,
  MindsetPillar,
  MindsetExercise,
  ConfidenceQuotient,
  ConfidenceEvidence,
  JournalEntry,
  Affirmation,
  JournalStreak,
  DigitalFortressSettings,
  FocusSession,
  FocusScore,
  BrainDump,
  BrainDumpItem,
  CognitiveLoadReading,
  EmotionCheckin,
  FlowSession,
  EmotionPattern,
  MomentumDimension,
  MomentumActivity,
  MomentumFlywheel,
} from '@/types/tier1';

// ============================================
// 1. BELIEF ARCHITECTURE REPOSITORY
// ============================================

export class BeliefScoreRepository extends BaseRepository<BeliefScore> {
  protected tableName = 'belief_scores';

  async getOrCreate(userId: string): Promise<BeliefScore> {
    const existing = await this.findOneByUserId(userId);
    if (existing) return existing;

    const newScore = await this.create({
      userId,
      overallScore: 50,
      level: 1,
      microProofCount: 0,
      patternRecognitionCount: 0,
      capabilityEvidenceCount: 0,
      identityMilestones: 0,
      legendaryMoments: 0,
    } as Omit<BeliefScore, 'id' | 'createdAt' | 'updatedAt'>);

    if (!newScore) {
      throw new RepositoryError('Failed to create belief score', 'DATABASE');
    }

    return newScore;
  }

  async updateScore(userId: string, score: Partial<BeliefScore>): Promise<BeliefScore> {
    const existing = await this.getOrCreate(userId);
    const updated = await this.update(existing.id, score);
    if (!updated) {
      throw new RepositoryError('Failed to update belief score', 'DATABASE');
    }
    return updated;
  }
}

export class BeliefEvidenceRepository extends BaseRepository<BeliefEvidence> {
  protected tableName = 'belief_evidence';

  async getByUserId(userId: string, evidenceType?: string): Promise<BeliefEvidence[]> {
    let query = supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId);

    if (evidenceType) {
      query = query.eq('evidence_type', evidenceType);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw new RepositoryError('Failed to fetch belief evidence', 'DATABASE', error);
    }

    return (data as unknown as BeliefEvidence[]) || [];
  }
}

// ============================================
// 2. SUCCESS MINDSET FORGE REPOSITORY
// ============================================

export class MindsetPillarRepository extends BaseRepository<MindsetPillar> {
  protected tableName = 'mindset_pillars';

  async initializePillars(userId: string): Promise<MindsetPillar[]> {
    const pillars: Omit<MindsetPillar, 'id' | 'createdAt' | 'updatedAt'>[] = [
      { userId, pillarName: 'abundance_consciousness', currentScore: 50, targetScore: 80, practiceStreak: 0, insights: [], lastPracticed: undefined },
      { userId, pillarName: 'growth_mindset', currentScore: 50, targetScore: 80, practiceStreak: 0, insights: [], lastPracticed: undefined },
      { userId, pillarName: 'resilience', currentScore: 50, targetScore: 80, practiceStreak: 0, insights: [], lastPracticed: undefined },
      { userId, pillarName: 'possibility_expansion', currentScore: 50, targetScore: 80, practiceStreak: 0, insights: [], lastPracticed: undefined },
      { userId, pillarName: 'owner_mentality', currentScore: 50, targetScore: 80, practiceStreak: 0, insights: [], lastPracticed: undefined },
      { userId, pillarName: 'long_term_vision', currentScore: 50, targetScore: 80, practiceStreak: 0, insights: [], lastPracticed: undefined },
      { userId, pillarName: 'limitless_potential', currentScore: 50, targetScore: 80, practiceStreak: 0, insights: [], lastPracticed: undefined },
    ];

    const created: MindsetPillar[] = [];
    for (const pillar of pillars) {
      const result = await this.create(pillar);
      if (result) created.push(result);
    }

    return created;
  }

  async getByUserId(userId: string): Promise<MindsetPillar[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId)
      .order('pillar_name', { ascending: true });

    if (error) {
      throw new RepositoryError('Failed to fetch mindset pillars', 'DATABASE', error);
    }

    return (data as unknown as MindsetPillar[]) || [];
  }

  async getOrInitialize(userId: string): Promise<MindsetPillar[]> {
    const existing = await this.getByUserId(userId);
    if (existing.length > 0) return existing;
    return this.initializePillars(userId);
  }
}

// ============================================
// 3. CONFIDENCE CORE REPOSITORY
// ============================================

export class ConfidenceQuotientRepository extends BaseRepository<ConfidenceQuotient> {
  protected tableName = 'confidence_quotients';

  async getOrCreate(userId: string): Promise<ConfidenceQuotient> {
    const existing = await this.findOneByUserId(userId);
    if (existing) return existing;

    const newCq = await this.create({
      userId,
      overallCq: 50,
      technicalCq: 40,
      salesCq: 40,
      strategyCq: 40,
      creativeCq: 50,
      communicationCq: 45,
      leadershipCq: 35,
    } as Omit<ConfidenceQuotient, 'id' | 'createdAt' | 'updatedAt'>);

    if (!newCq) {
      throw new RepositoryError('Failed to create confidence quotient', 'DATABASE');
    }

    return newCq;
  }
}

export class ConfidenceEvidenceRepository extends BaseRepository<ConfidenceEvidence> {
  protected tableName = 'confidence_evidence_stack';

  async getByUserIdAndLayer(userId: string, layer?: number): Promise<ConfidenceEvidence[]> {
    let query = supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId);

    if (layer) {
      query = query.eq('layer', layer);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw new RepositoryError('Failed to fetch confidence evidence', 'DATABASE', error);
    }

    return (data as unknown as ConfidenceEvidence[]) || [];
  }
}

// ============================================
// 4. AFFIRMATION & JOURNALING REPOSITORY
// ============================================

export class JournalEntryRepository extends BaseRepository<JournalEntry> {
  protected tableName = 'journal_entries';

  async getByUserIdAndDate(userId: string, date: string): Promise<JournalEntry[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId)
      .eq('entry_date', date)
      .order('created_at', { ascending: false });

    if (error) {
      throw new RepositoryError('Failed to fetch journal entries', 'DATABASE', error);
    }

    return (data as unknown as JournalEntry[]) || [];
  }

  async getRecentEntries(userId: string, limit = 10): Promise<JournalEntry[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId)
      .order('entry_date', { ascending: false })
      .limit(limit);

    if (error) {
      throw new RepositoryError('Failed to fetch recent entries', 'DATABASE', error);
    }

    return (data as unknown as JournalEntry[]) || [];
  }
}

export class AffirmationRepository extends BaseRepository<Affirmation> {
  protected tableName = 'affirmations';

  async getActiveByUserId(userId: string): Promise<Affirmation[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('usage_count', { ascending: false });

    if (error) {
      throw new RepositoryError('Failed to fetch affirmations', 'DATABASE', error);
    }

    return (data as unknown as Affirmation[]) || [];
  }

  async incrementUsage(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .update({
        usage_count: supabase.rpc('increment', { x: 1 }),
        last_used: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      throw new RepositoryError('Failed to update affirmation usage', 'DATABASE', error);
    }
  }
}

export class JournalStreakRepository extends BaseRepository<JournalStreak> {
  protected tableName = 'journal_streaks';

  async getOrCreate(userId: string): Promise<JournalStreak> {
    const existing = await this.findOneByUserId(userId);
    if (existing) return existing;

    const newStreak = await this.create({
      userId,
      currentStreak: 0,
      longestStreak: 0,
      totalEntries: 0,
      morningCompletions: 0,
      eveningCompletions: 0,
    } as Omit<JournalStreak, 'id' | 'createdAt' | 'updatedAt'>);

    if (!newStreak) {
      throw new RepositoryError('Failed to create journal streak', 'DATABASE');
    }

    return newStreak;
  }
}

// ============================================
// 5. DISTRACTIONS KILLER REPOSITORY
// ============================================

export class DigitalFortressRepository extends BaseRepository<DigitalFortressSettings> {
  protected tableName = 'digital_fortress_settings';

  async getOrCreate(userId: string): Promise<DigitalFortressSettings> {
    const existing = await this.findOneByUserId(userId);
    if (existing) return existing;

    const newSettings = await this.create({
      userId,
      layer1DigitalEnabled: false,
      blockedApps: [],
      blockedWebsites: [],
      notificationSilenced: false,
      layer2PhysicalEnabled: false,
      workspaceSetupNotes: '',
      sensoryPreferences: {},
      layer3CognitiveEnabled: false,
      singleTaskMode: false,
      intentionStatement: '',
      layer4SocialEnabled: false,
      statusMessage: '',
      autoResponderEnabled: false,
      layer5InternalEnabled: false,
      urgeSurfingActive: false,
    } as Omit<DigitalFortressSettings, 'id' | 'createdAt' | 'updatedAt'>);

    if (!newSettings) {
      throw new RepositoryError('Failed to create fortress settings', 'DATABASE');
    }

    return newSettings;
  }
}

export class FocusSessionRepository extends BaseRepository<FocusSession> {
  protected tableName = 'focus_sessions';

  async getByUserId(userId: string, options?: QueryOptions<FocusSession>): Promise<FocusSession[]> {
    let query = supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId);

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query.order('started_at', { ascending: false });

    if (error) {
      throw new RepositoryError('Failed to fetch focus sessions', 'DATABASE', error);
    }

    return (data as unknown as FocusSession[]) || [];
  }

  async getTodaySessions(userId: string): Promise<FocusSession[]> {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId)
      .gte('started_at', today)
      .order('started_at', { ascending: false });

    if (error) {
      throw new RepositoryError('Failed to fetch today\'s sessions', 'DATABASE', error);
    }

    return (data as unknown as FocusSession[]) || [];
  }
}

export class FocusScoreRepository extends BaseRepository<FocusScore> {
  protected tableName = 'focus_scores';

  async getOrCreate(userId: string): Promise<FocusScore> {
    const existing = await this.findOneByUserId(userId);
    if (existing) return existing;

    const newScore = await this.create({
      userId,
      currentScore: 70,
      averageScore: 70,
      bestScore: 70,
      totalSessions: 0,
      totalFocusMinutes: 0,
      currentStreak: 0,
      longestStreak: 0,
      vulnerabilitiesDetected: 0,
      attemptsBlockedToday: 0,
    } as Omit<FocusScore, 'id' | 'createdAt' | 'updatedAt'>);

    if (!newScore) {
      throw new RepositoryError('Failed to create focus score', 'DATABASE');
    }

    return newScore;
  }
}

// ============================================
// 6. BRAIN DUMP REPOSITORY
// ============================================

export class BrainDumpRepository extends BaseRepository<BrainDump> {
  protected tableName = 'brain_dumps';

  async getRecentByUserId(userId: string, limit = 10): Promise<BrainDump[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new RepositoryError('Failed to fetch brain dumps', 'DATABASE', error);
    }

    return (data as unknown as BrainDump[]) || [];
  }
}

export class BrainDumpItemRepository extends BaseRepository<BrainDumpItem> {
  protected tableName = 'brain_dump_items';

  async getByDumpId(dumpId: string): Promise<BrainDumpItem[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('dump_id', dumpId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new RepositoryError('Failed to fetch brain dump items', 'DATABASE', error);
    }

    return (data as unknown as BrainDumpItem[]) || [];
  }

  async getPendingByUserId(userId: string): Promise<BrainDumpItem[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId)
      .eq('completed', false)
      .order('priority', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      throw new RepositoryError('Failed to fetch pending items', 'DATABASE', error);
    }

    return (data as unknown as BrainDumpItem[]) || [];
  }
}

// ============================================
// 7. EMOTION CONTROLLER REPOSITORY
// ============================================

export class EmotionCheckinRepository extends BaseRepository<EmotionCheckin> {
  protected tableName = 'emotion_checkins';

  async getRecentByUserId(userId: string, limit = 10): Promise<EmotionCheckin[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId)
      .order('checkin_date', { ascending: false })
      .limit(limit);

    if (error) {
      throw new RepositoryError('Failed to fetch emotion checkins', 'DATABASE', error);
    }

    return (data as unknown as EmotionCheckin[]) || [];
  }

  async getTodayCheckin(userId: string): Promise<EmotionCheckin | null> {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId)
      .gte('checkin_date', today)
      .maybeSingle();

    if (error) {
      throw new RepositoryError('Failed to fetch today\'s checkin', 'DATABASE', error);
    }

    return (data as unknown as EmotionCheckin) || null;
  }
}

export class FlowSessionRepository extends BaseRepository<FlowSession> {
  protected tableName = 'flow_sessions';

  async getRecentByUserId(userId: string, limit = 10): Promise<FlowSession[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId)
      .order('started_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new RepositoryError('Failed to fetch flow sessions', 'DATABASE', error);
    }

    return (data as unknown as FlowSession[]) || [];
  }
}

// ============================================
// 8. MOMENTUM BUILDER REPOSITORY
// ============================================

export class MomentumDimensionRepository extends BaseRepository<MomentumDimension> {
  protected tableName = 'momentum_dimensions';

  async initializeDimensions(userId: string): Promise<MomentumDimension[]> {
    const dimensions: Omit<MomentumDimension, 'id' | 'createdAt' | 'updatedAt'>[] = [
      { userId, dimensionName: 'financial', currentStage: 1, currentScore: 20, momentumVelocity: 0, streakWeeks: 0, totalMilestones: 0 },
      { userId, dimensionName: 'social', currentStage: 1, currentScore: 20, momentumVelocity: 0, streakWeeks: 0, totalMilestones: 0 },
      { userId, dimensionName: 'physical', currentStage: 1, currentScore: 20, momentumVelocity: 0, streakWeeks: 0, totalMilestones: 0 },
      { userId, dimensionName: 'mental_emotional', currentStage: 1, currentScore: 20, momentumVelocity: 0, streakWeeks: 0, totalMilestones: 0 },
      { userId, dimensionName: 'educational', currentStage: 1, currentScore: 20, momentumVelocity: 0, streakWeeks: 0, totalMilestones: 0 },
      { userId, dimensionName: 'professional', currentStage: 1, currentScore: 20, momentumVelocity: 0, streakWeeks: 0, totalMilestones: 0 },
      { userId, dimensionName: 'spiritual_meaning', currentStage: 1, currentScore: 20, momentumVelocity: 0, streakWeeks: 0, totalMilestones: 0 },
    ];

    const created: MomentumDimension[] = [];
    for (const dim of dimensions) {
      const result = await this.create(dim);
      if (result) created.push(result);
    }

    return created;
  }

  async getOrInitialize(userId: string): Promise<MomentumDimension[]> {
    const existing = await this.findByUserId(userId);
    if (existing.length > 0) return existing;
    return this.initializeDimensions(userId);
  }

  async getByDimensionName(userId: string, dimensionName: string): Promise<MomentumDimension | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId)
      .eq('dimension_name', dimensionName)
      .maybeSingle();

    if (error) {
      throw new RepositoryError('Failed to fetch momentum dimension', 'DATABASE', error);
    }

    return (data as unknown as MomentumDimension) || null;
  }
}

export class MomentumFlywheelRepository extends BaseRepository<MomentumFlywheel> {
  protected tableName = 'momentum_flywheel';

  async getOrCreate(userId: string): Promise<MomentumFlywheel> {
    const existing = await this.findOneByUserId(userId);
    if (existing) return existing;

    const newFlywheel = await this.create({
      userId,
      overallMomentumScore: 25,
      flywheelSpeed: 0,
      compoundGrowthRate: 0,
      dimensionsInSync: 0,
    } as Omit<MomentumFlywheel, 'id' | 'createdAt' | 'updatedAt'>);

    if (!newFlywheel) {
      throw new RepositoryError('Failed to create momentum flywheel', 'DATABASE');
    }

    return newFlywheel;
  }
}

// ============================================
// REPOSITORY FACTORY
// ============================================

export const tier1Repositories = {
  // Belief Architecture
  beliefScore: new BeliefScoreRepository(),
  beliefEvidence: new BeliefEvidenceRepository(),

  // Success Mindset Forge
  mindsetPillar: new MindsetPillarRepository(),
  mindsetExercise: new MindsetExerciseRepository(),

  // Confidence Core
  confidenceQuotient: new ConfidenceQuotientRepository(),
  confidenceEvidence: new ConfidenceEvidenceRepository(),

  // Affirmation & Journaling
  journalEntry: new JournalEntryRepository(),
  affirmation: new AffirmationRepository(),
  journalStreak: new JournalStreakRepository(),

  // Distractions Killer
  digitalFortress: new DigitalFortressRepository(),
  focusSession: new FocusSessionRepository(),
  focusScore: new FocusScoreRepository(),

  // Brain Dump
  brainDump: new BrainDumpRepository(),
  brainDumpItem: new BrainDumpItemRepository(),

  // Emotion Controller
  emotionCheckin: new EmotionCheckinRepository(),
  flowSession: new FlowSessionRepository(),

  // Momentum Builder
  momentumDimension: new MomentumDimensionRepository(),
  momentumFlywheel: new MomentumFlywheelRepository(),
};
