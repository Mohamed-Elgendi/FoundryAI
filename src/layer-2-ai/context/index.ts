/**
 * AI Context Module
 * Context building and management for AI prompts
 */

export interface PromptContext {
  userProfile?: Record<string, unknown>;
  conversationHistory?: Array<{ role: string; content: string }>;
  systemPrompt?: string;
  metadata?: Record<string, unknown>;
}

export function buildContext(basePrompt: string, context: PromptContext): string {
  let fullPrompt = '';
  
  if (context.systemPrompt) {
    fullPrompt += `System: ${context.systemPrompt}\n\n`;
  }
  
  if (context.conversationHistory?.length) {
    fullPrompt += context.conversationHistory
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join('\n\n');
    fullPrompt += '\n\n';
  }
  
  fullPrompt += `User: ${basePrompt}`;
  
  return fullPrompt;
}

export function createBusinessPlanContext(archetype: string, tier: string): PromptContext {
  return {
    systemPrompt: `You are an expert business strategist specializing in ${archetype} businesses. ` +
      `Create comprehensive, actionable business plans for ${tier} tier entrepreneurs.`,
    metadata: { archetype, tier, type: 'business_plan' }
  };
}
