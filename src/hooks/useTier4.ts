import { useState, useEffect, useCallback } from 'react';

interface DNAProfile {
  builderScore: number;
  opportunistScore: number;
  specialistScore: number;
  innovatorScore: number;
  primaryDna: string;
  secondaryDna: string;
}

interface CognitiveAdvantages {
  patternRecognition: number;
  systemsThinking: number;
  creativeProblemSolving: number;
  strategicForesight: number;
  rapidLearning: number;
  emotionalIntelligence: number;
  executionVelocity: number;
  dominantAdvantage: string;
}

interface UseSelfDiscoveryReturn {
  dna: DNAProfile | null;
  cognitive: CognitiveAdvantages | null;
  isLoading: boolean;
  error: string | null;
  saveDNA: (data: Partial<DNAProfile>) => Promise<void>;
  saveCognitive: (data: Partial<CognitiveAdvantages>) => Promise<void>;
  refetch: () => void;
}

export function useSelfDiscovery(): UseSelfDiscoveryReturn {
  const [dna, setDna] = useState<DNAProfile | null>(null);
  const [cognitive, setCognitive] = useState<CognitiveAdvantages | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/tier4/self-discovery');
      if (!response.ok) throw new Error('Failed to fetch self-discovery data');
      
      const data = await response.json();
      setDna(data.dna || null);
      setCognitive(data.cognitive || null);
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

  const saveDNA = async (data: Partial<DNAProfile>) => {
    try {
      const response = await fetch('/api/tier4/self-discovery/dna', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to save DNA profile');
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  const saveCognitive = async (data: Partial<CognitiveAdvantages>) => {
    try {
      const response = await fetch('/api/tier4/self-discovery/cognitive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to save cognitive advantages');
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  return {
    dna,
    cognitive,
    isLoading,
    error,
    saveDNA,
    saveCognitive,
    refetch: fetchData,
  };
}
