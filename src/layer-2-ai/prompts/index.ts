/**
 * AI Prompts Module
 * Prompt templates and builders
 */

export interface PromptTemplate {
  name: string;
  template: string;
  variables: string[];
}

export const businessPlanPrompt: PromptTemplate = {
  name: 'business_plan',
  template: `Create a comprehensive business plan for: {{businessIdea}}

Target Market: {{targetMarket}}
Budget: {{budget}}
Timeline: {{timeline}}

Include:
1. Executive Summary
2. Market Analysis
3. Go-to-Market Strategy
4. Financial Projections
5. Action Plan`,
  variables: ['businessIdea', 'targetMarket', 'budget', 'timeline']
};

export function fillTemplate(
  template: PromptTemplate,
  variables: Record<string, string>
): string {
  let filled = template.template;
  
  for (const [key, value] of Object.entries(variables)) {
    filled = filled.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }
  
  return filled;
}

export function createOpportunityPrompt(niche: string, budget: number): string {
  return `Analyze the ${niche} market and identify 3 high-opportunity business ideas for a $${budget} budget. Focus on online/digital businesses with low startup costs.`;
}
