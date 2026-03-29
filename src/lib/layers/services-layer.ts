/**
 * Layer 8: Services Layer
 * AI service, Plan service, Integration layer
 */

import { FoundryAIOutput } from '@/types';
import { processWithAI, AIProvider } from '@/lib/ai/ai-router';
import { buildMasterPrompt } from '@/lib/engines/master-prompt';
import { Database } from './data-layer';
import { SecurityLayer, Permission } from './security-layer';
import { FeedbackLayer, AnalyticsEventType, ErrorSeverity } from './feedback-layer';

// Service contract interface
export interface Service {
  id: string;
  initialize(): Promise<void>;
  health(): Promise<boolean>;
}

// Circuit breaker for external services
class CircuitBreaker {
  private failures = 0;
  private lastFailureTime: number | null = null;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  private readonly threshold = 5;
  private readonly timeout = 60000; // 1 minute
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - (this.lastFailureTime || 0) > this.timeout) {
        this.state = 'half-open';
      } else {
        throw new Error('Circuit breaker is open');
      }
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  private onSuccess(): void {
    this.failures = 0;
    this.state = 'closed';
  }
  
  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();
    
    if (this.failures >= this.threshold) {
      this.state = 'open';
    }
  }
}

// AI Service with circuit breaker
export class AIService implements Service {
  id = 'ai-service';
  private circuitBreaker = new CircuitBreaker();
  private feedback: FeedbackLayer;
  
  constructor(feedback: FeedbackLayer) {
    this.feedback = feedback;
  }
  
  async initialize(): Promise<void> {
    console.log('AI Service initialized');
  }
  
  async health(): Promise<boolean> {
    try {
      // Quick health check
      await processWithAI({ prompt: 'test', preferredProvider: 'groq-llama-3-3' });
      return true;
    } catch {
      return false;
    }
  }
  
  async generatePlan(
    userInput: string,
    provider: AIProvider = 'groq-llama-3-3',
    userId: string
  ): Promise<FoundryAIOutput> {
    // Track generation start
    await this.feedback.track({
      userId,
      type: AnalyticsEventType.FEATURE_USED,
      metadata: { action: 'plan_generation_start', provider },
      timestamp: new Date().toISOString(),
    });
    
    const startTime = Date.now();
    
    try {
      const prompt = buildMasterPrompt(userInput);
      
      const result = await this.circuitBreaker.execute(async () => {
        const response = await processWithAI({ prompt, preferredProvider: provider });
        if (!response.content) {
          throw new Error('No content in AI response');
        }
        
        // Parse the response
        try {
          const parsed = JSON.parse(response.content);
          return parsed as FoundryAIOutput;
        } catch {
          // Return fallback if parsing fails
          return this.getFallbackOutput(userInput);
        }
      });
      
      // Track success
      const duration = Date.now() - startTime;
      await this.feedback.track({
        userId,
        type: AnalyticsEventType.PLAN_GENERATED,
        metadata: { 
          duration,
          provider,
          providerUsed: result ? 'success' : 'fallback'
        },
        timestamp: new Date().toISOString(),
      });
      
      return result;
    } catch (error) {
      // Track failure
      await this.feedback.reportError(
        error instanceof Error ? error : new Error(String(error)),
        ErrorSeverity.ERROR,
        { userId, action: 'plan_generation' }
      );
      
      // Return fallback
      return this.getFallbackOutput(userInput);
    }
  }
  
  private getFallbackOutput(userInput: string): FoundryAIOutput {
    return {
      ideaName: 'AI-Powered Business Solution',
      targetAudience: {
        description: 'Small to medium businesses struggling with inefficiencies',
        painLevel: 6
      },
      problemStatement: {
        coreProblem: 'Businesses struggle with inefficient manual processes',
        quantifiedCost: 'Loss of 10-20 hours/week and $5,000-15,000 annually',
        negativeConsequences: ['Decreased productivity', 'Employee burnout', 'Missed opportunities'],
        alternatives: ['Hire more staff', 'Use generic tools', 'Outsource tasks'],
        reasonsTheyFail: ['Too expensive', 'Not tailored to needs', 'Loss of control'],
        coreSolution: 'AI-powered automation to streamline operations',
        keyBenefits: ['Save 15+ hours/week', 'Reduce costs by 40%', 'Scale without hiring'],
        fullStatement: `Addressing needs for: ${userInput.slice(0, 100)}`
      },
      marketResearch: {
        tam: '$100B+ global market',
        sam: '$1B serviceable market',
        som: '$10M initial target',
        marketGrowthRate: '15% YoY',
        keyTrends: ['AI automation', 'Digital transformation'],
        competitorAnalysis: [],
        targetDemographics: 'SMBs and professionals',
        userPainPoints: ['Manual processes', 'High costs'],
        marketGaps: ['Affordable solutions'],
      },
      mvpFeatures: [
        'Core AI functionality',
        'User management',
        'Dashboard analytics',
        'Export capabilities',
      ],
      techStack: [
        { category: 'Frontend', tool: 'Next.js', purpose: 'React framework', isFree: true },
        { category: 'Backend', tool: 'Supabase', purpose: 'Database & Auth', isFree: true },
        { category: 'AI', tool: 'OpenAI/Groq', purpose: 'AI processing', isFree: true },
      ],
      buildPlan: [
        { step: 1, title: 'Setup', description: 'Initialize project', estimatedTime: '1 week' },
        { step: 2, title: 'Core', description: 'Build core features', estimatedTime: '2 weeks' },
        { step: 3, title: 'Launch', description: 'Deploy and market', estimatedTime: '1 week' },
      ],
      monetizationStrategy: {
        model: 'Freemium SaaS',
        pricing: 'Free tier + Pro at $19/month',
        firstUserTactics: ['Product Hunt launch'],
        revenueEstimate: '$1K-5K MRR within 6 months',
      },
      // Backward compatibility
      toolIdea: 'AI-Powered Business Solution',
      targetUser: 'Small to medium businesses',
    };
  }
}

// Plan Management Service
export class PlanService implements Service {
  id = 'plan-service';
  private db: Database;
  private security: SecurityLayer;
  private feedback: FeedbackLayer;
  
  constructor(db: Database, security: SecurityLayer, feedback: FeedbackLayer) {
    this.db = db;
    this.security = security;
    this.feedback = feedback;
  }
  
  async initialize(): Promise<void> {
    console.log('Plan Service initialized');
  }
  
  async health(): Promise<boolean> {
    try {
      await Database.getInstance().from('plans').select('id').limit(1);
      return true;
    } catch {
      return false;
    }
  }
  
  async createPlan(userId: string, content: FoundryAIOutput): Promise<string> {
    // Check permission
    this.security.requirePermission(Permission.SAVE_PLAN);
    
    const { data, error } = await Database.getInstance()
      .from('plans')
      .insert({
        user_id: userId,
        title: content.ideaName || content.toolIdea || 'Untitled Plan',
        content: content,
        status: 'complete',
        version: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select('id')
      .single();
    
    if (error) throw error;
    
    // Track
    await this.feedback.track({
      userId,
      type: AnalyticsEventType.PLAN_SAVED,
      metadata: { planId: data.id },
      timestamp: new Date().toISOString(),
    });
    
    return data.id;
  }
  
  async getUserPlans(userId: string, limit: number = 10): Promise<any[]> {
    const { data, error } = await Database.getInstance()
      .from('plans')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  }
  
  async deletePlan(userId: string, planId: string): Promise<void> {
    const { error } = await Database.getInstance()
      .from('plans')
      .delete()
      .eq('id', planId)
      .eq('user_id', userId);
    
    if (error) throw error;
  }
}

// Service Registry - manages all services
export class ServiceRegistry {
  private services: Map<string, Service> = new Map();
  private initialized = false;
  
  register(service: Service): void {
    this.services.set(service.id, service);
  }
  
  get<T extends Service>(id: string): T {
    const service = this.services.get(id);
    if (!service) {
      throw new Error(`Service not found: ${id}`);
    }
    return service as T;
  }
  
  async initializeAll(): Promise<void> {
    for (const [id, service] of this.services) {
      try {
        await service.initialize();
        console.log(`Service ${id} initialized`);
      } catch (error) {
        console.error(`Failed to initialize service ${id}:`, error);
      }
    }
    this.initialized = true;
  }
  
  async healthCheck(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};
    
    for (const [id, service] of this.services) {
      try {
        results[id] = await service.health();
      } catch {
        results[id] = false;
      }
    }
    
    return results;
  }
}

// Singleton registry instance
export const serviceRegistry = new ServiceRegistry();
