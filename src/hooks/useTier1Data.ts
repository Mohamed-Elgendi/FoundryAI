/**
 * Tier 1 Data Hooks
 * React hooks for fetching and updating Tier 1 foundation data
 */

import { useState, useEffect, useCallback } from 'react';
import { tier1Service } from '@/layer-3-data/services/tier1-service';

// Generic hook for data fetching with loading and error states
function useTier1Data<T>(
  fetchFn: () => Promise<T>,
  deps: React.DependencyList = []
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    refetch();
  }, deps);

  return { data, isLoading, error, refetch };
}

// Hook for Brain Dump data
export function useBrainDump() {
  return useTier1Data(() => tier1Service.brainDump.getBrainDumpData(), []);
}

// Hook for Momentum data
export function useMomentum() {
  return useTier1Data(() => tier1Service.momentum.getMomentumData(), []);
}

// Hook for Belief data
export function useBelief() {
  return useTier1Data(() => tier1Service.belief.getBeliefData(), []);
}

// Hook for Confidence data
export function useConfidence() {
  return useTier1Data(() => tier1Service.confidence.getConfidenceData(), []);
}

// Hook for Focus data
export function useFocus() {
  return useTier1Data(() => tier1Service.focus.getFocusData(), []);
}

// Hook for Emotion data
export function useEmotion() {
  return useTier1Data(() => tier1Service.emotion.getEmotionData(), []);
}

// Hook for Journal data
export function useJournal(date?: string) {
  return useTier1Data(() => tier1Service.journal.getJournalData(date), [date]);
}

// Hook for Mindset data
export function useMindset() {
  return useTier1Data(() => tier1Service.mindset.getMindsetData(), []);
}

// Hook for all Tier 1 data (dashboard view)
export function useTier1Dashboard() {
  return useTier1Data(() => tier1Service.getAllFoundationData(), []);
}

// Mutation hooks for data updates
export function useLogMomentumActivity() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (activity: {
    dimensionName: string;
    activityType: string;
    description: string;
    impactScore?: number;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await tier1Service.momentum.logActivity(activity);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { mutate, isLoading, error };
}

export function useAddConfidenceEvidence() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (evidence: {
    layer: 1 | 2 | 3 | 4 | 5;
    evidenceType: string;
    description: string;
    domain?: string;
    impactRating?: number;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await tier1Service.confidence.addEvidence(evidence);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { mutate, isLoading, error };
}

export function useAddBeliefEvidence() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (evidence: {
    evidenceType: string;
    description: string;
    impactScore: number;
    relatedBelief?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await tier1Service.belief.addEvidence(evidence);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { mutate, isLoading, error };
}

export function useCreateJournalEntry() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (entry: {
    entryType: string;
    content: string;
    mood?: string;
    gratitudeItems?: string[];
    affirmationsUsed?: string[];
    mindAlignmentScore?: number;
    bodyAlignmentScore?: number;
    soulAlignmentScore?: number;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await tier1Service.journal.createEntry(entry);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { mutate, isLoading, error };
}

export function useLogMindsetExercise() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (exercise: {
    pillarName: string;
    exerciseType: string;
    content: string;
    completionStatus?: 'started' | 'completed' | 'skipped';
    reflection?: string;
    insight?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await tier1Service.mindset.logExercise(exercise);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { mutate, isLoading, error };
}

export function useCreateBrainDump() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (dump: {
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
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await tier1Service.brainDump.createDump(dump);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { mutate, isLoading, error };
}
