/**
 * Opportunity Radar & Build System Hooks
 * React hooks for Tier 2 and Tier 3 functionality
 */

import { useState, useEffect, useCallback } from 'react';
import { radarService, ideaExtractionService } from '@/layer-3-data/services/radar-service';

// Hook for Radar Dashboard data
export function useRadarDashboard() {
  const [data, setData] = useState<{
    opportunities: unknown[];
    trending: unknown[];
    sources: unknown[];
    stats: {
      totalOpportunities: number;
      averageScore: number;
      scoreDistribution: Record<string, number>;
      lastUpdated: string;
    };
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await radarService.getRadarDashboard();
      setData(result as typeof data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
}

// Hook for opportunity validation
export function useOpportunityValidation(opportunityId: string | null) {
  const [validation, setValidation] = useState<{
    opportunity: unknown;
    dimensions: unknown;
    score: number;
    interpretation: {
      rating: string;
      recommendation: string;
      action: string;
    };
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback(async () => {
    if (!opportunityId) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await radarService.validateOpportunity(opportunityId);
      setValidation(result as typeof validation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [opportunityId]);

  useEffect(() => {
    if (opportunityId) {
      validate();
    }
  }, [opportunityId, validate]);

  return { validation, isLoading, error, validate };
}

// Hook for archetype analysis
export function useArchetypeAnalysis(archetype: string | null) {
  const [analysis, setAnalysis] = useState<{
    archetype: string;
    opportunityCount: number;
    averageScore: number;
    difficultyBreakdown: Record<string, number>;
    topOpportunities: unknown[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async () => {
    if (!archetype) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await radarService.getArchetypeAnalysis(archetype);
      setAnalysis(result as typeof analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [archetype]);

  useEffect(() => {
    if (archetype) {
      analyze();
    }
  }, [archetype, analyze]);

  return { analysis, isLoading, error, analyze };
}

// Hook for idea extraction
export function useIdeaExtraction() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extract = useCallback(async (input: {
    vagueIdea: string;
    skills: string[];
    interests: string[];
    timeAvailability: 'minimal' | 'moderate' | 'significant';
    budget: 'zero' | 'small' | 'moderate';
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await ideaExtractionService.extractOpportunities(input);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { extract, isLoading, error };
}

// Hook for Build Projects
export function useBuildProjects() {
  const [projects, setProjects] = useState<unknown[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/tier3/build');
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { projects, isLoading, error, refetch };
}

// Hook for creating a build project
export function useCreateBuildProject() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (project: {
    name: string;
    description: string;
    archetype: string;
    opportunityId?: string;
    techStack?: string[];
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/tier3/build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });
      if (!response.ok) throw new Error('Failed to create project');
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { create, isLoading, error };
}

// Hook for AI Build Assistance
export function useAIBuildAssistance() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAssistance = useCallback(async (taskType: string, context: Record<string, unknown>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/tier3/build/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskType, context }),
      });
      if (!response.ok) throw new Error('Failed to get assistance');
      const data = await response.json();
      return data.assistance;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { getAssistance, isLoading, error };
}

// Hook for resolving build errors
export function useResolveBuildError() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolve = useCallback(async (errorMessage: string, context: Record<string, unknown>, taskId?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/tier3/build/resolve-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: errorMessage, context, taskId }),
      });
      if (!response.ok) throw new Error('Failed to resolve error');
      const data = await response.json();
      return data.resolution;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { resolve, isLoading, error };
}
