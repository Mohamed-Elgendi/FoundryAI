import { FoundryAIOutput } from '@/types';
import { AIProvider } from '@/lib/ai/ai-types';

export interface PlanGeneratorState {
  input: string;
  output: FoundryAIOutput | null;
  isGenerating: boolean;
  error: string | null;
  provider: AIProvider;
}

export interface PlanContext {
  source: 'idea' | 'radar';
  radarData?: {
    title: string;
    problem: string;
    angle: string;
    market: string;
    niche: string;
    score: number;
    horizon: string;
    validationData?: Record<string, unknown>;
  };
}

export interface PlanGeneratorProps {
  initialInput?: string;
  context: PlanContext;
  onPlanGenerated?: (output: FoundryAIOutput) => void;
  onError?: (error: string) => void;
}

export interface PlanSection {
  id: string;
  title: string;
  content: unknown;
  isExpanded: boolean;
}
