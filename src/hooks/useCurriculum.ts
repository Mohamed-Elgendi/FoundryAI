// React Hook for AI Curriculum - ACTUAL IMPLEMENTATION
// Beast Mode - Production Ready

'use client';

import { useState, useEffect, useCallback } from 'react';
import { curriculumService } from '@/layer-3-data/services/curriculum-service';
import type { Curriculum, CurriculumModule, Lesson, Assessment, Certificate, LearningProgress } from '@/types/curriculum';

interface UseCurriculumReturn {
  curricula: Curriculum[];
  currentCurriculum: Curriculum | null;
  loading: boolean;
  error: string | null;
  generateCurriculum: (topic: string, skillLevel: 'beginner' | 'intermediate' | 'advanced') => Promise<void>;
  selectCurriculum: (curriculumId: string) => void;
  completeLesson: (moduleId: string, lessonId: string, timeSpent: number) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useCurriculum(userId?: string): UseCurriculumReturn {
  const [curricula, setCurricula] = useState<Curriculum[]>([]);
  const [currentCurriculum, setCurrentCurriculum] = useState<Curriculum | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurricula = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await curriculumService.getUserCurricula(userId);
      setCurricula(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch curricula');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchCurricula();
  }, [fetchCurricula]);

  const generateCurriculum = useCallback(async (
    topic: string,
    skillLevel: 'beginner' | 'intermediate' | 'advanced'
  ) => {
    if (!userId) return;

    try {
      setLoading(true);
      const newCurriculum = await curriculumService.generateCurriculum(userId, topic, skillLevel);
      await fetchCurricula();
      setCurrentCurriculum(newCurriculum);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate curriculum');
    } finally {
      setLoading(false);
    }
  }, [userId, fetchCurricula]);

  const selectCurriculum = useCallback((curriculumId: string) => {
    const found = curricula.find(c => c.id === curriculumId);
    if (found) {
      setCurrentCurriculum(found);
    }
  }, [curricula]);

  const completeLesson = useCallback(async (
    moduleId: string,
    lessonId: string,
    timeSpent: number
  ) => {
    if (!userId || !currentCurriculum) return;

    try {
      await curriculumService.updateProgress(
        userId,
        currentCurriculum.id,
        moduleId,
        lessonId,
        'completed',
        timeSpent
      );
      await fetchCurricula();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update progress');
    }
  }, [userId, currentCurriculum, fetchCurricula]);

  return {
    curricula,
    currentCurriculum,
    loading,
    error,
    generateCurriculum,
    selectCurriculum,
    completeLesson,
    refresh: fetchCurricula
  };
}
