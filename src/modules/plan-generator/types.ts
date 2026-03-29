import { FoundryAIOutput } from '@/types';

export interface PlanGeneratorState {
  input: string;
  output: FoundryAIOutput | null;
  isGenerating: boolean;
  error: string | null;
  provider: string;
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
    validationData?: Record<string, any>;
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
  content: any;
  isExpanded: boolean;
}
