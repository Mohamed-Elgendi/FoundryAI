export interface VibeBuilderOutput {
  toolIdea: string;
  targetUser: string;
  problemStatement: string;
  marketResearch: MarketResearch;
  mvpFeatures: string[];
  techStack: TechStackItem[];
  buildPlan: BuildStep[];
  monetizationStrategy: MonetizationStrategy;
  refinementMetadata?: {
    iterationCount: number;
    lastRefinedAt: string;
    refinementFocus: string[];
  };
}

export interface MarketResearch {
  tam: string;
  sam: string;
  som: string;
  marketGrowthRate: string;
  keyTrends: string[];
  competitorAnalysis: Competitor[];
  targetDemographics: string;
  userPainPoints: string[];
  marketGaps: string[];
}

export interface Competitor {
  name: string;
  strengths: string;
  weaknesses: string;
  marketShare: string;
  pricing: string;
}

export interface RefinementState {
  iterationCount: number;
  isRefining: boolean;
  previousRefinements: string[];
  originalInput: string;
}

export interface TechStackItem {
  category: string;
  tool: string;
  purpose: string;
  isFree: boolean;
}

export interface BuildStep {
  step: number;
  title: string;
  description: string;
  estimatedTime: string;
  aiToolAction?: string;
}

export interface MonetizationStrategy {
  model: string;
  pricing: string;
  firstUserTactics: string[];
  revenueEstimate: string;
}

export interface FeedbackData {
  id?: string;
  userInput: string;
  output: VibeBuilderOutput;
  isHelpful: boolean;
  timestamp: string;
  userAgent?: string;
}

export interface StoredPattern {
  id?: string;
  inputPattern: string;
  outputStructure: string;
  successRate: number;
  usageCount: number;
  lastUsed: string;
}
