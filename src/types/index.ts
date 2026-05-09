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
}

// AI Output types
export interface FoundryAIOutput {
  ideaName: string;
  toolIdea?: string;
  targetAudience: {
    description: string;
    painLevel: number;
  };
  problemStatement: {
    coreProblem: string;
    quantifiedCost: string;
    negativeConsequences: string[];
    alternatives: string[];
    reasonsTheyFail: string[];
    coreSolution: string;
    keyBenefits: string[];
    fullStatement: string;
  };
}
