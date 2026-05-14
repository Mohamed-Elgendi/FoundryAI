// Central types export - Beast Mode Complete
export * from './gamification';
export * from './billing';
export * from './curriculum';
export * from './affiliate';

// Feedback types
export interface FeedbackData {
  id?: string;
  userId: string;
  email: string;
  feedback: string;
  rating: number;
  createdAt?: string;
  userInput?: string;
  isHelpful?: boolean;
  output?: FoundryAIOutput;
  userAgent?: string;
  timestamp?: string;
}

export interface StoredPattern {
  inputPattern: string;
  outputStructure: string;
  successRate: number;
  usageCount: number;
  lastUsed: string;
}

export interface ProblemStatement {
  coreProblem: string;
  quantifiedCost: string;
  negativeConsequences: string[];
  alternatives: string[];
  reasonsTheyFail: string[];
  coreSolution: string;
  keyBenefits: string[];
  fullStatement: string;
}

// AI Output types
export interface FoundryAIOutput {
  ideaName: string;
  toolIdea?: string;
  targetUser?: string;
  targetAudience: {
    description: string;
    painLevel: number;
  };
  problemStatement: ProblemStatement;
  marketResearch?: {
    tam: string;
    sam: string;
    som: string;
    marketGrowthRate: string;
    keyTrends: string[];
    competitorAnalysis: {
      name: string;
      marketShare: string;
      strengths: string;
      weaknesses: string;
      pricing: string;
    }[];
    targetDemographics: string;
    userPainPoints: string[];
    marketGaps: string[];
  };
  mvpFeatures?: string[];
  techStack?: {
    category: string;
    tool: string;
    purpose: string;
    isFree: boolean;
  }[];
  buildPlan?: {
    step: number;
    title: string;
    description: string;
    estimatedTime: string;
    aiToolAction?: string;
  }[];
  monetizationStrategy?: {
    model: string;
    pricing: string;
    firstUserTactics: string[];
    revenueEstimate: string;
  };
  refinementMetadata?: {
    iterationCount: number;
    refinementFocus: string[];
  };
}

// Refinement state types
export interface RefinementState {
  iterationCount: number;
  isRefining: boolean;
  previousRefinements: string[];
  originalInput: string;
}
