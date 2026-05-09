/**
 * Tier 1 Data Services
 * Client-side services for fetching and updating Tier 1 data
 */

import { createBrowserSupabaseClient } from '@/layer-3-data/supabase/client';

const API_BASE = '/api/tier1';

// Generic fetch helper
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// ============================================
// BELIEF ARCHITECTURE SERVICE
// ============================================

export const beliefService = {
  async getBeliefData() {
    return fetchAPI<{ score: unknown; evidence: unknown[] }>('/belief');
  },

  async addEvidence(evidence: {
    evidenceType: string;
    description: string;
    impactScore: number;
    relatedBelief?: string;
  }) {
    return fetchAPI<{ evidence: unknown; success: boolean }>('/belief/evidence', {
      method: 'POST',
      body: JSON.stringify(evidence),
    });
  },
};

// ============================================
// MINDSET SERVICE
// ============================================

export const mindsetService = {
  async getMindsetData() {
    return fetchAPI<{ pillars: unknown[]; exercises: unknown[] }>('/mindset');
  },

  async logExercise(exercise: {
    pillarName: string;
    exerciseType: string;
    content: string;
    completionStatus?: 'started' | 'completed' | 'skipped';
    reflection?: string;
    insight?: string;
  }) {
    return fetchAPI<{ exercise: unknown; success: boolean }>('/mindset', {
      method: 'POST',
      body: JSON.stringify(exercise),
    });
  },

  async updateTarget(pillarName: string, targetScore: number) {
    return fetchAPI<{ pillar: unknown; success: boolean }>('/mindset', {
      method: 'PATCH',
      body: JSON.stringify({ pillarName, targetScore }),
    });
  },
};

// ============================================
// CONFIDENCE SERVICE
// ============================================

export const confidenceService = {
  async getConfidenceData() {
    return fetchAPI<{ cq: unknown; evidence: unknown[] }>('/confidence');
  },

  async addEvidence(evidence: {
    layer: 1 | 2 | 3 | 4 | 5;
    evidenceType: string;
    description: string;
    domain?: string;
    impactRating?: number;
  }) {
    return fetchAPI<{ evidence: unknown; cq: unknown; success: boolean }>('/confidence', {
      method: 'POST',
      body: JSON.stringify(evidence),
    });
  },
};

// ============================================
// JOURNAL SERVICE
// ============================================

export const journalService = {
  async getJournalData(date?: string) {
    const query = date ? `?date=${date}` : '';
    return fetchAPI<{ entries: unknown[]; streak: unknown; affirmations: unknown[] }>(`/journal${query}`);
  },

  async createEntry(entry: {
    entryType: string;
    content: string;
    mood?: string;
    gratitudeItems?: string[];
    affirmationsUsed?: string[];
    mindAlignmentScore?: number;
    bodyAlignmentScore?: number;
    soulAlignmentScore?: number;
  }) {
    return fetchAPI<{ entry: unknown; success: boolean }>('/journal', {
      method: 'POST',
      body: JSON.stringify(entry),
    });
  },

  async createAffirmation(affirmation: {
    affirmationText: string;
    category: string;
    isProofBased?: boolean;
    evidenceReference?: string;
  }) {
    return fetchAPI<{ affirmation: unknown; success: boolean }>('/journal/affirmation', {
      method: 'POST',
      body: JSON.stringify(affirmation),
    });
  },
};

// ============================================
// BRAIN DUMP SERVICE
// ============================================

export const brainDumpService = {
  async getBrainDumpData() {
    return fetchAPI<{
      dumps: unknown[];
      items?: Record<string, unknown[]>;
      pendingItems: unknown[];
      cognitiveLoad: unknown;
    }>('/brain-dump?items=true');
  },

  async createDump(dump: {
    rawContent: string;
    durationSeconds?: number;
    cognitiveLoadBefore?: number;
    cognitiveLoadAfter?: number;
    cognitiveFactors?: string[];
    categorizedItems: Array<{
      content: string;
      category: string;
      priority?: string;
      scheduledDate?: string;
      aiSuggestedAction?: string;
    }>;
  }) {
    return fetchAPI<{ dump: unknown; items: unknown[]; success: boolean }>('/brain-dump', {
      method: 'POST',
      body: JSON.stringify(dump),
    });
  },

  async updateItem(itemId: string, updates: Partial<unknown>) {
    return fetchAPI<{ item: unknown; success: boolean }>('/brain-dump', {
      method: 'PATCH',
      body: JSON.stringify({ itemId, ...updates }),
    });
  },
};

// ============================================
// FOCUS SERVICE
// ============================================

export const focusService = {
  async getFocusData() {
    return fetchAPI<{
      settings: unknown;
      score: unknown;
      sessions: unknown[];
      activeLayers: number;
    }>('/focus?sessions=true');
  },

  async startSession(session: {
    sessionType?: string;
    durationMinutes: number;
    notes?: string;
  }) {
    return fetchAPI<{ session: unknown; success: boolean }>('/focus/session', {
      method: 'POST',
      body: JSON.stringify({ action: 'start', ...session }),
    });
  },

  async endSession(sessionId: string, data: {
    distractionsBlocked?: number;
    interruptionsCount?: number;
  }) {
    return fetchAPI<{ session: unknown; focusScore: number; success: boolean }>('/focus/session', {
      method: 'POST',
      body: JSON.stringify({ action: 'end', sessionId, ...data }),
    });
  },

  async updateSettings(settings: Partial<unknown>) {
    return fetchAPI<{ settings: unknown; success: boolean }>('/focus', {
      method: 'PATCH',
      body: JSON.stringify(settings),
    });
  },
};

// ============================================
// EMOTION SERVICE
// ============================================

export const emotionService = {
  async getEmotionData() {
    return fetchAPI<{
      checkins: unknown[];
      flowSessions: unknown[];
      todayCheckin: unknown | null;
      stats: {
        dominantEmotion: string;
        totalCheckins: number;
        flowSessionsCount: number;
        averageFlowDepth: number;
      };
    }>('/emotion');
  },

  async createCheckin(checkin: {
    currentState: string;
    intensity: number;
    triggerIdentified?: string;
    targetState?: string;
    transitionStrategyUsed?: string;
    wasSuccessful?: boolean;
    notes?: string;
  }) {
    return fetchAPI<{ checkin: unknown; success: boolean }>('/emotion', {
      method: 'POST',
      body: JSON.stringify(checkin),
    });
  },

  async startFlowSession(data: {
    entryMethod?: string;
    workType?: string;
  }) {
    return fetchAPI<{ session: unknown; success: boolean }>('/emotion/flow', {
      method: 'POST',
      body: JSON.stringify({ action: 'start', ...data }),
    });
  },

  async endFlowSession(sessionId: string, data: {
    depthScore?: number;
    interruptions?: number;
    workType?: string;
    satisfactionScore?: number;
  }) {
    return fetchAPI<{ session: unknown; success: boolean }>('/emotion/flow', {
      method: 'POST',
      body: JSON.stringify({ action: 'end', sessionId, ...data }),
    });
  },
};

// ============================================
// MOMENTUM SERVICE
// ============================================

export const momentumService = {
  async getMomentumData() {
    return fetchAPI<{
      dimensions: unknown[];
      flywheel: unknown;
      stats: {
        averageScore: number;
        dimensionsInSync: number;
        totalMilestones: number;
        currentStreak: number;
      };
    }>('/momentum');
  },

  async logActivity(activity: {
    dimensionName: string;
    activityType: string;
    description: string;
    impactScore?: number;
  }) {
    return fetchAPI<{ activity: unknown; success: boolean }>('/momentum/activity', {
      method: 'POST',
      body: JSON.stringify(activity),
    });
  },

  async updateDimensionTarget(dimensionName: string, weeklyTarget: number) {
    return fetchAPI<{ dimension: unknown; success: boolean }>('/momentum/dimension', {
      method: 'PATCH',
      body: JSON.stringify({ dimensionName, weeklyTarget }),
    });
  },
};

// ============================================
// TIER 1 COMPOSITE SERVICE
// ============================================

export const tier1Service = {
  belief: beliefService,
  mindset: mindsetService,
  confidence: confidenceService,
  journal: journalService,
  brainDump: brainDumpService,
  focus: focusService,
  emotion: emotionService,
  momentum: momentumService,

  // Get all Tier 1 data at once
  async getAllFoundationData() {
    const [
      belief,
      mindset,
      confidence,
      journal,
      brainDump,
      focus,
      emotion,
      momentum,
    ] = await Promise.all([
      beliefService.getBeliefData().catch(() => null),
      mindsetService.getMindsetData().catch(() => null),
      confidenceService.getConfidenceData().catch(() => null),
      journalService.getJournalData().catch(() => null),
      brainDumpService.getBrainDumpData().catch(() => null),
      focusService.getFocusData().catch(() => null),
      emotionService.getEmotionData().catch(() => null),
      momentumService.getMomentumData().catch(() => null),
    ]);

    return {
      belief,
      mindset,
      confidence,
      journal,
      brainDump,
      focus,
      emotion,
      momentum,
    };
  },
};
