// Central types export - Beast Mode Complete
export * from './gamification';
export * from './billing';
export * from './curriculum';
export * from './affiliate';

// AI Output types
export interface FoundryAIOutput {
  ideaName: string;
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
