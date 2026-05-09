import { useState, useEffect, useCallback } from 'react';

// Tier 5: Learning & Education Hooks

interface LearningPath {
  id: string;
  pathName: string;
  description: string;
  category: string;
  totalModules: number;
  completedModules: number;
  progressPercentage: number;
  status: string;
  estimatedHoursTotal: number;
  hoursSpent: number;
}

interface LearningModule {
  id: string;
  moduleNumber: number;
  title: string;
  description: string;
  isCompleted: boolean;
  contentType: string;
  timeSpentMinutes: number;
}

interface UseLearningReturn {
  paths: LearningPath[];
  activePath: LearningPath | null;
  modules: LearningModule[];
  todayStats: {
    totalLearningMinutes: number;
    videosWatched: number;
    exercisesCompleted: number;
  } | null;
  isLoading: boolean;
  error: string | null;
  selectPath: (pathId: string) => Promise<void>;
  completeModule: (moduleId: string, data: { timeSpent: number; quizScore?: number }) => Promise<void>;
  refetch: () => void;
}

export function useLearning(): UseLearningReturn {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [activePath, setActivePath] = useState<LearningPath | null>(null);
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [todayStats, setTodayStats] = useState<UseLearningReturn['todayStats']>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/tier5/learning');
      if (!response.ok) throw new Error('Failed to fetch learning data');
      
      const data = await response.json();
      setPaths(data.learningPaths || []);
      setTodayStats(data.todayStats || null);
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

  const selectPath = async (pathId: string) => {
    try {
      const path = paths.find(p => p.id === pathId);
      setActivePath(path || null);
      
      // Fetch modules for this path
      const response = await fetch(`/api/tier5/learning/path/${pathId}/modules`);
      if (!response.ok) throw new Error('Failed to fetch modules');
      
      const data = await response.json();
      setModules(data.modules || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  const completeModule = async (moduleId: string, data: { timeSpent: number; quizScore?: number }) => {
    try {
      const response = await fetch('/api/tier5/learning/module', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleId, isCompleted: true, timeSpent: data.timeSpent, quizScore: data.quizScore }),
      });
      
      if (!response.ok) throw new Error('Failed to complete module');
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  return {
    paths,
    activePath,
    modules,
    todayStats,
    isLoading,
    error,
    selectPath,
    completeModule,
    refetch: fetchData,
  };
}

// Skill Matrix Hook
interface UserSkill {
  id: string;
  skillName: string;
  category: string;
  proficiencyLevel: number;
  yearsExperience: number;
  isTargetSkill: boolean;
  isCoreCompetency: boolean;
  projectsCompleted: number;
}

interface UseSkillsReturn {
  skills: UserSkill[];
  categories: string[];
  isLoading: boolean;
  error: string | null;
  updateSkill: (skillId: string, data: { proficiencyLevel?: number; isTargetSkill?: boolean }) => Promise<void>;
  refetch: () => void;
}

export function useSkills(): UseSkillsReturn {
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/tier5/learning'); // Reuse learning endpoint for skills
      if (!response.ok) throw new Error('Failed to fetch skills');
      
      const data = await response.json();
      setSkills(data.userSkills || []);
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

  const updateSkill = async (skillId: string, data: { proficiencyLevel?: number; isTargetSkill?: boolean }) => {
    try {
      const response = await fetch('/api/tier5/learning/skill', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skillId, ...data }),
      });
      
      if (!response.ok) throw new Error('Failed to update skill');
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  const categories = [...new Set(skills.map(s => s.category))];

  return {
    skills,
    categories,
    isLoading,
    error,
    updateSkill,
    refetch: fetchData,
  };
}

// Spaced Repetition Hook
interface ReviewCard {
  id: string;
  cardId: string;
  frontContent: string;
  backContent: string;
  category: string;
  difficulty: number;
  interval: number;
  streak: number;
  totalReviews: number;
  correctReviews: number;
}

interface UseSpacedRepetitionReturn {
  dueCards: ReviewCard[];
  stats: {
    dueToday: number;
    completedToday: number;
    streakDays: number;
    totalCards: number;
    retentionRate: number;
  };
  isLoading: boolean;
  error: string | null;
  reviewCard: (cardId: string, queueId: string, rating: number, responseTimeSeconds?: number) => Promise<void>;
  refetch: () => void;
}

export function useSpacedRepetition(): UseSpacedRepetitionReturn {
  const [dueCards, setDueCards] = useState<ReviewCard[]>([]);
  const [stats, setStats] = useState<UseSpacedRepetitionReturn['stats']>({
    dueToday: 0,
    completedToday: 0,
    streakDays: 0,
    totalCards: 0,
    retentionRate: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/tier5/learning');
      if (!response.ok) throw new Error('Failed to fetch review queue');
      
      const data = await response.json();
      setDueCards(data.reviewQueue || []);
      // Stats would come from a separate endpoint in real implementation
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

  const reviewCard = async (cardId: string, queueId: string, rating: number, responseTimeSeconds?: number) => {
    try {
      const response = await fetch('/api/tier5/learning/card-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId, queueId, rating, responseTimeSeconds }),
      });
      
      if (!response.ok) throw new Error('Failed to review card');
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  return {
    dueCards,
    stats,
    isLoading,
    error,
    reviewCard,
    refetch: fetchData,
  };
}
