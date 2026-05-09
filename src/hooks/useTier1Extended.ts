import { useState, useEffect, useCallback } from 'react';

// Momentum Builder Hook
interface MomentumDimension {
  id: string;
  dimensionName: string;
  currentLevel: number;
  maxLevel: number;
  progressPercentage: number;
  weeklyWins: number;
}

interface MomentumWin {
  id: string;
  dimensionId: string;
  winDescription: string;
  impactScore: number;
  createdAt: string;
}

interface UseMomentumReturn {
  dimensions: MomentumDimension[];
  recentWins: MomentumWin[];
  isLoading: boolean;
  error: string | null;
  logWin: (data: { dimensionId: string; description: string; impactScore: number }) => Promise<void>;
  refetch: () => void;
}

export function useMomentum(): UseMomentumReturn {
  const [dimensions, setDimensions] = useState<MomentumDimension[]>([]);
  const [recentWins, setRecentWins] = useState<MomentumWin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/tier1/momentum');
      if (!response.ok) throw new Error('Failed to fetch momentum data');
      
      const data = await response.json();
      setDimensions(data.dimensions || []);
      setRecentWins(data.recentWins || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const logWin = async (data: { dimensionId: string; description: string; impactScore: number }) => {
    try {
      const response = await fetch('/api/tier1/momentum/win', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to log win');
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  return {
    dimensions,
    recentWins,
    isLoading,
    error,
    logWin,
    refetch: fetchData,
  };
}

// Belief Architecture Hook
interface BeliefScore {
  id: string;
  currentScore: number;
  evidenceCount: number;
  lastCalibrationDate: string;
}

interface EvidenceItem {
  id: string;
  evidenceType: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  createdAt: string;
}

interface UseBeliefReturn {
  beliefScore: BeliefScore | null;
  evidenceStack: EvidenceItem[];
  isLoading: boolean;
  error: string | null;
  addEvidence: (data: { type: string; description: string; impact: string }) => Promise<void>;
  calibrate: () => Promise<void>;
  refetch: () => void;
}

export function useBelief(): UseBeliefReturn {
  const [beliefScore, setBeliefScore] = useState<BeliefScore | null>(null);
  const [evidenceStack, setEvidenceStack] = useState<EvidenceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/tier1/belief');
      if (!response.ok) throw new Error('Failed to fetch belief data');
      
      const data = await response.json();
      setBeliefScore(data.score || null);
      setEvidenceStack(data.evidence || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addEvidence = async (data: { type: string; description: string; impact: string }) => {
    try {
      const response = await fetch('/api/tier1/belief/evidence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to add evidence');
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  const calibrate = async () => {
    try {
      const response = await fetch('/api/tier1/belief/calibrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) throw new Error('Failed to calibrate');
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  return {
    beliefScore,
    evidenceStack,
    isLoading,
    error,
    addEvidence,
    calibrate,
    refetch: fetchData,
  };
}

// Confidence Core Hook
interface ConfidenceQuotient {
  id: string;
  overallCq: number;
  domainCqs: Record<string, number>;
  evidenceLayers: number;
  lastAssessmentDate: string;
}

interface UseConfidenceReturn {
  cq: ConfidenceQuotient | null;
  isLoading: boolean;
  error: string | null;
  recordEvidence: (data: { domain: string; evidence: string; impact: number }) => Promise<void>;
  refetch: () => void;
}

export function useConfidence(): UseConfidenceReturn {
  const [cq, setCq] = useState<ConfidenceQuotient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/tier1/confidence');
      if (!response.ok) throw new Error('Failed to fetch confidence data');
      
      const data = await response.json();
      setCq(data.cq || null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const recordEvidence = async (data: { domain: string; evidence: string; impact: number }) => {
    try {
      const response = await fetch('/api/tier1/confidence/evidence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to record evidence');
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  return {
    cq,
    isLoading,
    error,
    recordEvidence,
    refetch: fetchData,
  };
}

// Success Mindset Forge Hook
interface MindsetPillar {
  id: string;
  pillarName: string;
  currentLevel: number;
  maxLevel: number;
  weeklyReflections: number;
}

interface MindsetReframe {
  id: string;
  originalThought: string;
  reframedThought: string;
  pillarId: string;
  createdAt: string;
}

interface UseMindsetReturn {
  pillars: MindsetPillar[];
  recentReframes: MindsetReframe[];
  isLoading: boolean;
  error: string | null;
  createReframe: (data: { original: string; reframed: string; pillarId: string }) => Promise<void>;
  refetch: () => void;
}

export function useMindset(): UseMindsetReturn {
  const [pillars, setPillars] = useState<MindsetPillar[]>([]);
  const [recentReframes, setRecentReframes] = useState<MindsetReframe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/tier1/mindset');
      if (!response.ok) throw new Error('Failed to fetch mindset data');
      
      const data = await response.json();
      setPillars(data.pillars || []);
      setRecentReframes(data.reframes || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createReframe = async (data: { original: string; reframed: string; pillarId: string }) => {
    try {
      const response = await fetch('/api/tier1/mindset/reframe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to create reframe');
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  return {
    pillars,
    recentReframes,
    isLoading,
    error,
    createReframe,
    refetch: fetchData,
  };
}

// Affirmation & Journaling Hook
interface AffirmationSession {
  id: string;
  sessionType: 'morning' | 'evening';
  completedAt: string;
  moodBefore?: number;
  moodAfter?: number;
}

interface JournalEntry {
  id: string;
  entryType: string;
  content: string;
  createdAt: string;
}

interface UseJournalReturn {
  sessions: AffirmationSession[];
  entries: JournalEntry[];
  streak: number;
  isLoading: boolean;
  error: string | null;
  createEntry: (data: { type: string; content: string }) => Promise<void>;
  completeSession: (data: { type: 'morning' | 'evening'; moodBefore?: number; moodAfter?: number }) => Promise<void>;
  refetch: () => void;
}

export function useJournal(): UseJournalReturn {
  const [sessions, setSessions] = useState<AffirmationSession[]>([]);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [streak, setStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/tier1/journal');
      if (!response.ok) throw new Error('Failed to fetch journal data');
      
      const data = await response.json();
      setSessions(data.sessions || []);
      setEntries(data.entries || []);
      setStreak(data.streak || 0);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createEntry = async (data: { type: string; content: string }) => {
    try {
      const response = await fetch('/api/tier1/journal/entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to create entry');
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  const completeSession = async (data: { type: 'morning' | 'evening'; moodBefore?: number; moodAfter?: number }) => {
    try {
      const response = await fetch('/api/tier1/journal/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to complete session');
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  return {
    sessions,
    entries,
    streak,
    isLoading,
    error,
    createEntry,
    completeSession,
    refetch: fetchData,
  };
}
