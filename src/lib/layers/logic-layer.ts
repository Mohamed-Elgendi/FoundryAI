/**
 * Layer 4: Deep Logic Layer
 * Business logic, workflows, state management
 */

import { FoundryAIOutput } from '@/types';
import { AIService, PlanService } from './services-layer';
import { SecurityLayer, Permission } from './security-layer';
import { FeedbackLayer, AnalyticsEventType } from './feedback-layer';
import { AIProvider } from '@/layer-2-ai/router/ai-types';

// Business logic workflows
export class LogicLayer {
  private aiService: AIService;
  private planService: PlanService;
  private security: SecurityLayer;
  private feedback: FeedbackLayer;
  
  constructor(
    aiService: AIService,
    planService: PlanService,
    security: SecurityLayer,
    feedback: FeedbackLayer
  ) {
    this.aiService = aiService;
    this.planService = planService;
    this.security = security;
    this.feedback = feedback;
  }
  
  // Plan generation workflow
  async generatePlanWorkflow(
    userInput: string,
    provider: string,
    userId: string
  ): Promise<{ output: FoundryAIOutput; planId?: string }> {
    // Step 1: Validate input
    this.validateInput(userInput);
    
    // Step 2: Check permissions
    this.security.requirePermission(Permission.GENERATE_PLAN);
    
    // Step 3: Generate plan
    const output = await this.aiService.generatePlan(userInput, provider as AIProvider, userId);
    
    // Step 4: Auto-save to database
    let planId: string | undefined;
    try {
      planId = await this.planService.createPlan(userId, output);
    } catch (error) {
      // Non-critical - just log
      console.warn('Failed to auto-save plan:', error);
    }
    
    return { output, planId };
  }
  
  // Plan refinement workflow
  async refinePlanWorkflow(
    planId: string,
    focusArea: string,
    userId: string
  ): Promise<FoundryAIOutput> {
    // Step 1: Check permissions
    this.security.requirePermission(Permission.REFINE_PLAN);
    
    // Step 2: Fetch existing plan
    const plans = await this.planService.getUserPlans(userId, 1) as Array<{ id: string; content: FoundryAIOutput }>;
    const plan = plans.find(p => p.id === planId);
    
    if (!plan) {
      throw new Error('Plan not found');
    }
    
    // Step 3: Generate refined content
    const refinementPrompt = this.buildRefinementPrompt(plan.content, focusArea);
    const refined = await this.aiService.generatePlan(refinementPrompt, 'groq-llama-3-3' as AIProvider, userId);
    
    // Step 4: Update plan in database
    // Implementation would update the plan record
    
    return refined;
  }
  
  // Input validation rules
  private validateInput(input: string): void {
    if (!input || input.trim().length < 10) {
      throw new Error('Input must be at least 10 characters');
    }
    
    if (input.length > 5000) {
      throw new Error('Input must be less than 5000 characters');
    }
    
    // Check for spam/abuse patterns
    const spamPatterns = [/http:\/\//g, /www\./g, /click here/gi];
    for (const pattern of spamPatterns) {
      if (pattern.test(input)) {
        throw new Error('Input contains suspicious patterns');
      }
    }
  }
  
  private buildRefinementPrompt(original: FoundryAIOutput, focusArea: string): string {
    return `Refine this business plan with focus on ${focusArea}:

Original plan: ${original.toolIdea}
Target: ${original.targetUser}
Problem: ${original.problemStatement}

Provide an enhanced version with more detail in the ${focusArea} section.`;
  }
  
  // User onboarding workflow
  async onboardUser(userId: string, email: string): Promise<void> {
    // Step 1: Track signup
    await this.feedback.track({
      userId,
      type: AnalyticsEventType.USER_SIGNUP,
      metadata: { email },
      timestamp: new Date().toISOString(),
    });
    
    // Step 2: Create default preferences
    // Step 3: Send welcome notification
    // Step 4: Set up free tier limits
  }
  
  // Subscription upgrade workflow
  async upgradeSubscription(userId: string, tier: string): Promise<void> {
    // Step 1: Verify payment
    // Step 2: Update user role
    // Step 3: Enable new features
    // Step 4: Track conversion
    await this.feedback.track({
      userId,
      type: AnalyticsEventType.SUBSCRIPTION_UPGRADE,
      metadata: { tier },
      timestamp: new Date().toISOString(),
    });
  }
  
  // Plan export workflow
  async exportPlanWorkflow(planId: string, format: 'pdf' | 'markdown' | 'json', userId: string): Promise<string> {
    // Step 1: Check permissions
    this.security.requirePermission(Permission.EXPORT_PLAN);
    
    // Step 2: Fetch plan
    const plans = await this.planService.getUserPlans(userId, 1) as Array<{ id: string; content: FoundryAIOutput }>;
    const plan = plans.find(p => p.id === planId);
    
    if (!plan) {
      throw new Error('Plan not found');
    }
    
    // Step 3: Generate export
    let content: string;
    switch (format) {
      case 'json':
        content = JSON.stringify(plan.content, null, 2);
        break;
      case 'markdown':
        content = this.convertToMarkdown(plan.content);
        break;
      case 'pdf':
        // PDF generation would use a library
        content = 'PDF generation not implemented';
        break;
      default:
        throw new Error('Unsupported format');
    }
    
    // Step 4: Track export
    await this.feedback.track({
      userId,
      type: AnalyticsEventType.PLAN_EXPORTED,
      metadata: { format },
      timestamp: new Date().toISOString(),
    });
    
    return content;
  }
  
  private convertToMarkdown(content: FoundryAIOutput): string {
    return `# ${content.toolIdea}

## Target User
${content.targetUser}

## Problem Statement
${content.problemStatement}

## Market Research
- TAM: ${content.marketResearch?.tam}
- SAM: ${content.marketResearch?.sam}
- SOM: ${content.marketResearch?.som}

## MVP Features
${content.mvpFeatures?.map(f => `- ${f}`).join('\n')}

## Tech Stack
${content.techStack?.map(t => `- ${t.tool} (${t.category})`).join('\n')}

## Build Plan
${content.buildPlan?.map(b => `${b.step}. ${b.title} - ${b.description} (${b.estimatedTime})`).join('\n')}
`;
  }
}
