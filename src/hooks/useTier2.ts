import { useState, useEffect, useCallback } from 'react';

interface Opportunity {
  id: string;
  title: string;
  description: string;
  score: number;
  difficulty: 'easy' | 'medium' | 'hard';
  timeToFirstRevenue: string;
  archetype: string;
  marketSize: string;
  competition: 'low' | 'medium' | 'high';
  trending: boolean;
}

interface UseOpportunitiesReturn {
  opportunities: Opportunity[];
  isLoading: boolean;
  error: string | null;
  filters: {
    archetype?: string;
    difficulty?: string;
    trending?: boolean;
  };
  setFilters: (filters: Partial<UseOpportunitiesReturn['filters']>) => void;
  refetch: () => void;
}

export function useOpportunities(): UseOpportunitiesReturn {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [filters, setFiltersState] = useState<UseOpportunitiesReturn['filters']>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (filters.archetype) params.append('archetype', filters.archetype);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.trending) params.append('trending', 'true');
      
      const response = await fetch(`/api/tier2/opportunities?${params}`);
      if (!response.ok) throw new Error('Failed to fetch opportunities');
      
      const data = await response.json();
      setOpportunities(data.opportunities || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const setFilters = (newFilters: Partial<UseOpportunitiesReturn['filters']>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  };

  return {
    opportunities,
    isLoading,
    error,
    filters,
    setFilters,
    refetch: fetchData,
  };
}

interface ExtractedIdea {
  id: string;
  refinedConcept: string;
  archetype: string;
  archetypeFitScore: number;
  marketPotential: string;
  timeToMvp: string;
  estimatedRevenue: string;
  requiredSkills: string[];
  nextSteps: string[];
  confidenceScore: number;
}

interface UseIdeaExtractionReturn {
  extract: (vagueIdea: string, options?: { skills?: string[]; interests?: string[] }) => Promise<ExtractedIdea[]>;
  isLoading: boolean;
  error: string | null;
}

export function useIdeaExtraction(): UseIdeaExtractionReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extract = async (vagueIdea: string, options?: { skills?: string[]; interests?: string[] }): Promise<ExtractedIdea[]> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/tier2/radar/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vagueIdea, ...options }),
      });
      
      if (!response.ok) throw new Error('Failed to extract ideas');
      
      const data = await response.json();
      return data.opportunities || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    extract,
    isLoading,
    error,
  };
}
