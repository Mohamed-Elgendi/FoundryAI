import { useState, useEffect, useCallback } from 'react';

interface FocusSession {
  id: string;
  sessionType: string;
  durationMinutes: number;
  focusScore: number;
  interruptionsCount: number;
  distractionsBlocked: number;
  startedAt: string;
  endedAt?: string;
}

interface FocusSettings {
  layer1DigitalEnabled: boolean;
  layer2PhysicalEnabled: boolean;
  layer3CognitiveEnabled: boolean;
  layer4SocialEnabled: boolean;
  layer5InternalEnabled: boolean;
}

interface FocusScore {
  currentScore: number;
  averageScore: number;
  bestScore: number;
  totalSessions: number;
  totalFocusMinutes: number;
  currentStreak: number;
  longestStreak: number;
}

interface UseFocusReturn {
  sessions: FocusSession[];
  settings: FocusSettings | null;
  score: FocusScore | null;
  activeLayers: number;
  isLoading: boolean;
  error: string | null;
  startSession: (data: { sessionType: string; durationMinutes: number; notes?: string }) => Promise<FocusSession>;
  endSession: (sessionId: string, data: { interruptionsCount: number; distractionsBlocked: number }) => Promise<void>;
  updateSettings: (settings: Partial<FocusSettings>) => Promise<void>;
  refetch: () => void;
}

export function useFocus(): UseFocusReturn {
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [settings, setSettings] = useState<FocusSettings | null>(null);
  const [score, setScore] = useState<FocusScore | null>(null);
  const [activeLayers, setActiveLayers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/tier1/focus?sessions=true');
      if (!response.ok) throw new Error('Failed to fetch focus data');
      
      const data = await response.json();
      setSessions(data.sessions || []);
      setSettings(data.settings || null);
      setScore(data.score || null);
      setActiveLayers(data.activeLayers || 0);
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

  const startSession = async (data: { sessionType: string; durationMinutes: number; notes?: string }) => {
    try {
      const response = await fetch('/api/tier1/focus/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start', ...data }),
      });
      
      if (!response.ok) throw new Error('Failed to start session');
      const result = await response.json();
      return result.session;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  const endSession = async (sessionId: string, data: { interruptionsCount: number; distractionsBlocked: number }) => {
    try {
      const response = await fetch('/api/tier1/focus/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'end', sessionId, ...data }),
      });
      
      if (!response.ok) throw new Error('Failed to end session');
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  const updateSettings = async (newSettings: Partial<FocusSettings>) => {
    try {
      const response = await fetch('/api/tier1/focus/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      
      if (!response.ok) throw new Error('Failed to update settings');
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  return {
    sessions,
    settings,
    score,
    activeLayers,
    isLoading,
    error,
    startSession,
    endSession,
    updateSettings,
    refetch: fetchData,
  };
}

// Emotion Controller Hook
interface EmotionCheckin {
  id: string;
  currentState: string;
  intensity: number;
  targetState?: string;
  transitionStrategyUsed?: string;
  wasSuccessful?: boolean;
  notes?: string;
  checkinDate: string;
}

interface FlowSession {
  id: string;
  startedAt: string;
  endedAt?: string;
  durationMinutes?: number;
  depthScore?: number;
  entryMethod: string;
  workType?: string;
}

interface UseEmotionReturn {
  checkins: EmotionCheckin[];
  flowSessions: FlowSession[];
  todayCheckin: EmotionCheckin | null;
  stats: {
    dominantEmotion: string;
    totalCheckins: number;
    flowSessionsCount: number;
    averageFlowDepth: number;
  };
  isLoading: boolean;
  error: string | null;
  createCheckin: (data: Partial<EmotionCheckin>) => Promise<void>;
  startFlow: (data: { entryMethod?: string; workType?: string }) => Promise<void>;
  endFlow: (sessionId: string, data: { depthScore: number; interruptions?: number }) => Promise<void>;
  refetch: () => void;
}

export function useEmotion(): UseEmotionReturn {
  const [checkins, setCheckins] = useState<EmotionCheckin[]>([]);
  const [flowSessions, setFlowSessions] = useState<FlowSession[]>([]);
  const [todayCheckin, setTodayCheckin] = useState<EmotionCheckin | null>(null);
  const [stats, setStats] = useState({
    dominantEmotion: 'neutral',
    totalCheckins: 0,
    flowSessionsCount: 0,
    averageFlowDepth: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/tier1/emotion');
      if (!response.ok) throw new Error('Failed to fetch emotion data');
      
      const data = await response.json();
      setCheckins(data.checkins || []);
      setFlowSessions(data.flowSessions || []);
      setTodayCheckin(data.todayCheckin || null);
      setStats(data.stats || { dominantEmotion: 'neutral', totalCheckins: 0, flowSessionsCount: 0, averageFlowDepth: 0 });
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

  const createCheckin = async (data: Partial<EmotionCheckin>) => {
    try {
      const response = await fetch('/api/tier1/emotion/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to create checkin');
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  const startFlow = async (data: { entryMethod?: string; workType?: string }) => {
    try {
      const response = await fetch('/api/tier1/emotion/flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start', ...data }),
      });
      
      if (!response.ok) throw new Error('Failed to start flow session');
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  const endFlow = async (sessionId: string, data: { depthScore: number; interruptions?: number }) => {
    try {
      const response = await fetch('/api/tier1/emotion/flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'end', sessionId, ...data }),
      });
      
      if (!response.ok) throw new Error('Failed to end flow session');
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  return {
    checkins,
    flowSessions,
    todayCheckin,
    stats,
    isLoading,
    error,
    createCheckin,
    startFlow,
    endFlow,
    refetch: fetchData,
  };
}
