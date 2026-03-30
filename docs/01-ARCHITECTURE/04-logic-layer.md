# Logic Layer (Layer 4)

## Business Rules, Workflow Engine, and AI Integration

---

## Document Purpose

This document specifies Layer 4 of the FoundryAI architecture—the Logic Layer. It defines business rules, workflow orchestration, AI routing, and the contract between Presentation (Layer 5) and Data (Layer 3).

**Audience:** Backend/API Agent, AI/ML Agent

**Prerequisites:** 
- `01-ARCHITECTURE/00-system-overview.md`
- `01-ARCHITECTURE/03-presentation-layer.md`
- `01-ARCHITECTURE/05-data-layer.md`

---

## Layer Responsibility

The Logic Layer:
1. Encodes all business rules and validation logic
2. Orchestrates multi-step workflows (14-day launch, tier progression)
3. Routes AI requests to appropriate providers
4. Manages application state transitions
5. Provides clean API for Presentation Layer

### Design Principles

| Principle | Implementation |
|-----------|---------------|
| **Pure Functions** | Business logic is deterministic and testable |
| **Immutable State** | State changes are explicit and traceable |
| **Event-Driven** | Components communicate via Event Bus |
| **Rule-Based** | Business rules are declarative and composable |
| **Fail-Safe** | Graceful degradation when AI providers fail |

---

## Business Rules Engine

### Rule Definition

```typescript
// File: lib/logic/rules/types.ts

export interface BusinessRule<T> {
  id: string;
  name: string;
  description: string;
  condition: (data: T) => boolean;
  action: (data: T) => T | Promise<T>;
  errorMessage?: string;
  priority: number;  // Lower = higher priority
}

export interface RuleExecutionResult<T> {
  data: T;
  appliedRules: string[];
  failedRules: Array<{ id: string; error: string }>;
  executionTime: number;
}
```

### Rules Engine Implementation

```typescript
// File: lib/logic/rules/engine.ts

export class RulesEngine<T> {
  private rules: BusinessRule<T>[] = [];
  
  register(rule: BusinessRule<T>): this {
    this.rules.push(rule);
    this.rules.sort((a, b) => a.priority - b.priority);
    return this;
  }
  
  async execute(data: T): Promise<RuleExecutionResult<T>> {
    const startTime = Date.now();
    let result = data;
    const appliedRules: string[] = [];
    const failedRules: Array<{ id: string; error: string }> = [];
    
    for (const rule of this.rules) {
      try {
        if (rule.condition(result)) {
          result = await rule.action(result);
          appliedRules.push(rule.name);
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        failedRules.push({ id: rule.id, error: errorMsg });
        
        if (rule.errorMessage) {
          throw new Error(`${rule.errorMessage}: ${errorMsg}`);
        }
      }
    }
    
    return {
      data: result,
      appliedRules,
      failedRules,
      executionTime: Date.now() - startTime,
    };
  }
}
```

### Example: Tier Progression Rules

```typescript
// File: lib/logic/rules/tier-progression.ts

import { RulesEngine } from './engine';
import type { UserProfile, Tier } from '@/types';

interface TierContext {
  profile: UserProfile;
  revenue: number;
  currentTier: Tier;
}

export const tierProgressionEngine = new RulesEngine<TierContext>();

// Rule: Check if user qualifies for Starter tier
 tierProgressionEngine.register({
  id: 'starter-qualification',
  name: 'Starter Tier Qualification',
  description: 'User qualifies for Starter tier at $100 revenue',
  priority: 1,
  condition: (ctx) => ctx.revenue >= 100 && ctx.currentTier === 'free',
  action: async (ctx) => {
    // Notify user of tier unlock
    await notifyUser(ctx.profile.id, {
      type: 'tier_unlocked',
      tier: 'starter',
      message: 'Congratulations! You\'ve unlocked Starter tier.',
    });
    
    return {
      ...ctx,
      currentTier: 'starter' as Tier,
    };
  },
});

// Rule: Check if user qualifies for Pro tier
tierProgressionEngine.register({
  id: 'pro-qualification',
  name: 'Pro Tier Qualification',
  description: 'User qualifies for Pro tier at $1K MRR',
  priority: 2,
  condition: (ctx) => ctx.revenue >= 1000 && ctx.currentTier === 'starter',
  action: async (ctx) => {
    await notifyUser(ctx.profile.id, {
      type: 'tier_unlocked',
      tier: 'pro',
      message: 'Amazing! You\'ve reached $1K MRR. Pro tier unlocked.',
    });
    
    return {
      ...ctx,
      currentTier: 'pro' as Tier,
    };
  },
});

// Rule: Check if user qualifies for Elite tier
tierProgressionEngine.register({
  id: 'elite-qualification',
  name: 'Elite Tier Qualification',
  description: 'User qualifies for Elite tier at $10K MRR',
  priority: 3,
  condition: (ctx) => ctx.revenue >= 10000 && ctx.currentTier === 'pro',
  action: async (ctx) => {
    await notifyUser(ctx.profile.id, {
      type: 'tier_unlocked',
      tier: 'elite',
      message: 'Incredible! You\'ve reached $10K MRR. Elite tier unlocked.',
    });
    
    return {
      ...ctx,
      currentTier: 'elite' as Tier,
    };
  },
});

// Rule: Check if user qualifies for Legend tier
tierProgressionEngine.register({
  id: 'legend-qualification',
  name: 'Legend Tier Qualification',
  description: 'User qualifies for Legend tier at $100K MRR',
  priority: 4,
  condition: (ctx) => ctx.revenue >= 100000 && ctx.currentTier === 'elite',
  action: async (ctx) => {
    await notifyUser(ctx.profile.id, {
      type: 'tier_unlocked',
      tier: 'legend',
      message: 'Legendary! You\'ve reached $100K MRR. Welcome to Legend tier.',
    });
    
    return {
      ...ctx,
      currentTier: 'legend' as Tier,
    };
  },
});
```

---

## Workflow Engine

### Workflow Definition

```typescript
// File: lib/logic/workflows/types.ts

export type WorkflowStep<TInput, TOutput> = {
  id: string;
  name: string;
  execute: (input: TInput, context: WorkflowContext) => Promise<TOutput>;
  onError?: (error: Error, context: WorkflowContext) => Promise<void>;
  timeout?: number;  // milliseconds
};

export interface WorkflowContext {
  workflowId: string;
  startedAt: Date;
  currentStep: number;
  totalSteps: number;
  metadata: Record<string, unknown>;
}

export interface WorkflowResult<T> {
  success: boolean;
  data?: T;
  error?: Error;
  completedSteps: string[];
  failedStep?: string;
  executionTime: number;
}
```

### Workflow Engine Implementation

```typescript
// File: lib/logic/workflows/engine.ts

export class WorkflowEngine {
  async execute<TInput, TOutput>(
    steps: WorkflowStep<unknown, unknown>[],
    input: TInput,
    metadata: Record<string, unknown> = {}
  ): Promise<WorkflowResult<TOutput>> {
    const workflowId = generateUUID();
    const startedAt = new Date();
    const context: WorkflowContext = {
      workflowId,
      startedAt,
      currentStep: 0,
      totalSteps: steps.length,
      metadata,
    };
    
    let currentData: unknown = input;
    const completedSteps: string[] = [];
    
    for (const step of steps) {
      try {
        context.currentStep++;
        
        const result = await this.executeWithTimeout(
          () => step.execute(currentData, context),
          step.timeout
        );
        
        currentData = result;
        completedSteps.push(step.id);
        
        // Emit progress event
        eventBus.emit('workflow:step:completed', {
          workflowId,
          stepId: step.id,
          progress: (context.currentStep / context.totalSteps) * 100,
        });
      } catch (error) {
        // Try error handler if available
        if (step.onError) {
          await step.onError(error as Error, context);
        }
        
        return {
          success: false,
          error: error as Error,
          completedSteps,
          failedStep: step.id,
          executionTime: Date.now() - startedAt.getTime(),
        };
      }
    }
    
    return {
      success: true,
      data: currentData as TOutput,
      completedSteps,
      executionTime: Date.now() - startedAt.getTime(),
    };
  }
  
  private async executeWithTimeout<T>(
    fn: () => Promise<T>,
    timeout?: number
  ): Promise<T> {
    if (!timeout) return fn();
    
    return Promise.race([
      fn(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Workflow step timeout')), timeout)
      ),
    ]);
  }
}
```

### Example: 14-Day Launch Protocol Workflow

```typescript
// File: lib/logic/workflows/launch-protocol.ts

import { WorkflowEngine } from './engine';
import type { Opportunity, LaunchContext } from '@/types';

const launchWorkflowEngine = new WorkflowEngine();

export async function execute14DayLaunch(
  opportunity: Opportunity,
  userId: string
) {
  const steps = [
    {
      id: 'day-1-2',
      name: 'Project Setup & Tech Stack',
      execute: async (ctx: LaunchContext) => {
        // AI-assisted project scaffolding
        const setup = await aiService.generate({
          prompt: `Setup project for: ${ctx.opportunity.title}`,
          context: { archetype: ctx.opportunity.archetype },
        });
        
        return { ...ctx, setup };
      },
      timeout: 300000, // 5 minutes
    },
    {
      id: 'day-3-7',
      name: 'Core Features Build',
      execute: async (ctx: LaunchContext) => {
        // Daily check-ins with AI assistant
        for (let day = 3; day <= 7; day++) {
          await aiService.chat({
            messages: [
              { role: 'system', content: 'You are a pair programming assistant' },
              { role: 'user', content: `Day ${day}: Working on ${ctx.opportunity.title}` },
            ],
          });
        }
        
        return ctx;
      },
      timeout: 600000, // 10 minutes
    },
    {
      id: 'day-8-12',
      name: 'Polish & Integration',
      execute: async (ctx: LaunchContext) => {
        // UI refinement, payment integration
        const polished = await aiService.generate({
          prompt: `Polish UI and add payment for: ${ctx.opportunity.title}`,
        });
        
        return { ...ctx, polished };
      },
      timeout: 300000,
    },
    {
      id: 'day-13-14',
      name: 'Launch Preparation',
      execute: async (ctx: LaunchContext) => {
        // Final checklist, deployment
        const launchReady = await validateLaunchReadiness(ctx);
        
        if (!launchReady.valid) {
          throw new Error(`Launch blocked: ${launchReady.issues.join(', ')}`);
        }
        
        return { ...ctx, launchReady };
      },
      timeout: 300000,
    },
  ];
  
  const context: LaunchContext = {
    opportunity,
    userId,
    startDate: new Date(),
  };
  
  return await launchWorkflowEngine.execute(steps, context, {
    workflowType: '14-day-launch',
    userId,
    opportunityId: opportunity.id,
  });
}
```

---

## Event Bus

### Event Bus Implementation

```typescript
// File: lib/logic/events/bus.ts

export type EventType = 
  // User events
  | 'user:signup'
  | 'user:login'
  | 'user:tier:upgraded'
  // Revenue events
  | 'revenue:recorded'
  | 'revenue:milestone'
  // Opportunity events
  | 'opportunity:created'
  | 'opportunity:validated'
  | 'opportunity:selected'
  // Build events
  | 'build:started'
  | 'build:checkpoint'
  | 'build:completed'
  // System events
  | 'ai:request'
  | 'ai:response'
  | 'error:occurred';

export interface Event<T = unknown> {
  id: string;
  type: EventType;
  payload: T;
  timestamp: Date;
  source: string;
}

export class EventBus {
  private listeners = new Map<EventType, Set<(event: Event) => void>>();
  private history: Event[] = [];
  private maxHistorySize: number;
  
  constructor(maxHistorySize = 1000) {
    this.maxHistorySize = maxHistorySize;
  }
  
  on<T>(type: EventType, handler: (event: Event<T>) => void): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    
    const handlerSet = this.listeners.get(type)!;
    const wrappedHandler = handler as (event: Event) => void;
    handlerSet.add(wrappedHandler);
    
    return () => handlerSet.delete(wrappedHandler);
  }
  
  emit<T>(type: EventType, payload: T, source = 'system'): void {
    const event: Event<T> = {
      id: generateUUID(),
      type,
      payload,
      timestamp: new Date(),
      source,
    };
    
    // Store in history
    this.history.push(event as Event);
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }
    
    // Notify listeners
    const handlers = this.listeners.get(type);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(event as Event);
        } catch (error) {
          console.error('Event handler error:', error);
        }
      });
    }
  }
  
  getHistory(type?: EventType, limit = 100): Event[] {
    let events = [...this.history];
    
    if (type) {
      events = events.filter(e => e.type === type);
    }
    
    return events.slice(-limit);
  }
}

// Global event bus instance
export const globalEventBus = new EventBus();
```

---

## AI Routing

### AI Router Implementation

```typescript
// File: lib/logic/ai/router.ts

import type { AIProvider, GenerateOptions, GenerateResult } from './types';

export class AIRouter {
  private providers: AIProvider[] = [];
  private currentProvider: string;
  private circuitBreaker = new Map<string, CircuitBreaker>();
  
  constructor() {
    // Register providers from configuration
    this.registerProvider({
      name: 'groq',
      baseUrl: 'https://api.groq.com/openai/v1',
      models: ['mixtral-8x7b-32768', 'llama3-70b-8192'],
      priority: 1,
      costPerToken: 0.000002,
      maxTokens: 32768,
      timeout: 10000,
    });
    
    this.registerProvider({
      name: 'openrouter',
      baseUrl: 'https://openrouter.ai/api/v1',
      models: ['meta-llama/llama-3-70b', 'anthropic/claude-3-opus'],
      priority: 2,
      costPerToken: 0.000003,
      maxTokens: 128000,
      timeout: 15000,
    });
    
    this.currentProvider = 'groq';
  }
  
  registerProvider(provider: AIProvider): void {
    this.providers.push(provider);
    this.providers.sort((a, b) => a.priority - b.priority);
    this.circuitBreaker.set(provider.name, new CircuitBreaker());
  }
  
  async generate(options: GenerateOptions): Promise<GenerateResult> {
    // Try providers in priority order
    for (const provider of this.providers) {
      const breaker = this.circuitBreaker.get(provider.name)!;
      
      if (!breaker.isOpen()) {
        try {
          const result = await this.callProvider(provider, options);
          breaker.recordSuccess();
          return result;
        } catch (error) {
          breaker.recordFailure();
          console.warn(`Provider ${provider.name} failed:`, error);
        }
      }
    }
    
    throw new Error('All AI providers unavailable');
  }
  
  private async callProvider(
    provider: AIProvider,
    options: GenerateOptions
  ): Promise<GenerateResult> {
    const response = await fetch(`${provider.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getApiKey(provider.name)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: options.model || provider.models[0],
        messages: [{ role: 'user', content: options.prompt }],
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens || provider.maxTokens,
      }),
      signal: AbortSignal.timeout(provider.timeout),
    });
    
    if (!response.ok) {
      throw new Error(`Provider error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      content: data.choices[0].message.content,
      provider: provider.name,
      model: data.model,
      usage: data.usage,
      latency: Date.now(), // Calculate actual latency
    };
  }
}

// Circuit breaker for provider health
class CircuitBreaker {
  private failures = 0;
  private lastFailureTime: Date | null = null;
  private readonly threshold = 5;
  private readonly timeout = 60000; // 1 minute
  
  isOpen(): boolean {
    if (this.failures >= this.threshold) {
      if (this.lastFailureTime) {
        const elapsed = Date.now() - this.lastFailureTime.getTime();
        if (elapsed < this.timeout) {
          return true; // Circuit open
        }
        // Try again after timeout
        this.failures = 0;
      }
    }
    return false; // Circuit closed
  }
  
  recordSuccess(): void {
    this.failures = 0;
    this.lastFailureTime = null;
  }
  
  recordFailure(): void {
    this.failures++;
    this.lastFailureTime = new Date();
  }
}
```

---

## Validation Engine

### Input Validation

```typescript
// File: lib/logic/validation/engine.ts

import { z } from 'zod';

export class ValidationEngine {
  private schemas = new Map<string, z.ZodSchema>();
  
  register<T>(name: string, schema: z.ZodSchema<T>): void {
    this.schemas.set(name, schema);
  }
  
  validate<T>(name: string, data: unknown): ValidationResult<T> {
    const schema = this.schemas.get(name);
    if (!schema) {
      return {
        valid: false,
        errors: [{ path: [], message: `Schema '${name}' not found` }],
      };
    }
    
    const result = schema.safeParse(data);
    
    if (result.success) {
      return {
        valid: true,
        data: result.data as T,
      };
    }
    
    return {
      valid: false,
      errors: result.error.errors.map(err => ({
        path: err.path.map(String),
        message: err.message,
      })),
    };
  }
}

export interface ValidationResult<T> {
  valid: boolean;
  data?: T;
  errors?: ValidationError[];
}

export interface ValidationError {
  path: string[];
  message: string;
}

// Register schemas
export const validationEngine = new ValidationEngine();

validationEngine.register('opportunity-input', z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(5000),
  category: z.enum(['saas', 'content', 'service', 'product']),
  archetype: z.string(),
}));

validationEngine.register('revenue-record', z.object({
  userId: z.string().uuid(),
  amount: z.number().positive(),
  source: z.string(),
  date: z.string().datetime(),
}));
```

---

## Document Integrity

**Version:** 1.0.0  
**Last Updated:** March 30, 2026  
**Status:** ACTIVE  
**Owner:** Backend/API Agent  

**Related Documents:**
- `01-ARCHITECTURE/06-ai-expansion-layer.md` — AI provider details
- `01-ARCHITECTURE/05-data-layer.md` — Data persistence
- `09-WORKFLOWS/*.md` — Business process definitions

**Change Protocol:**
1. Business rule changes need Product review
2. Workflow changes need UX review (user impact)
3. AI routing changes need AI/ML Agent review

---

**End of Logic Layer Specification. All business logic must use these patterns.**
