# AI Expansion Layer (Layer 2)

## Multi-Provider AI Routing and Prompt Management

---

## Document Purpose

This document specifies Layer 2 of the FoundryAI architecture—the AI Expansion Layer. It defines multi-provider AI routing, circuit breaker patterns, prompt management, and cost optimization strategies.

**Audience:** AI/ML Agent, Backend/API Agent

**Prerequisites:**
- `01-ARCHITECTURE/00-system-overview.md`
- `01-ARCHITECTURE/04-logic-layer.md`
- `10-INTEGRATIONS/ai-providers/00-ai-routing.md`

---

## Layer Responsibility

The AI Expansion Layer:
1. Abstracts multiple AI providers (Groq, OpenRouter, etc.)
2. Implements failover and circuit breaker patterns
3. Manages prompt templates and versioning
4. Optimizes costs and token usage
5. Handles context management for conversations

### Technology Stack

| Provider | Models | Use Case |
|----------|--------|----------|
| **Groq** | Mixtral-8x7B, Llama-3-70B | Primary (fast, cost-effective) |
| **OpenRouter** | Claude-3, GPT-4, Llama-3 | Secondary (complex reasoning) |
| **Fallback** | Cached responses | Last resort |

---

## AI Provider Interface

```typescript
// File: lib/ai/providers/types.ts

export interface AIProvider {
  name: string;
  baseUrl: string;
  models: string[];
  defaultModel: string;
  priority: number;  // 1 = primary, 2 = secondary, etc.
  costPerInputToken: number;
  costPerOutputToken: number;
  maxTokens: number;
  timeout: number;  // milliseconds
  headers?: Record<string, string>;
}

export interface GenerateOptions {
  prompt: string;
  systemPrompt?: string;
  model?: string;
  provider?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stream?: boolean;
}

export interface GenerateResult {
  content: string;
  provider: string;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  latency: number;
  cost: number;
  cached: boolean;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatOptions extends GenerateOptions {
  messages: ChatMessage[];
  maxContextLength?: number;
}
```

---

## Provider Registry

```typescript
// File: lib/ai/providers/registry.ts

export const AI_PROVIDERS: AIProvider[] = [
  {
    name: 'groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    models: [
      'mixtral-8x7b-32768',
      'llama3-70b-8192',
      'gemma-7b-it',
    ],
    defaultModel: 'llama3-70b-8192',
    priority: 1,
    costPerInputToken: 0.00000059,  // $0.59 per 1M tokens
    costPerOutputToken: 0.00000079, // $0.79 per 1M tokens
    maxTokens: 8192,
    timeout: 10000,
  },
  {
    name: 'openrouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    models: [
      'meta-llama/llama-3-70b',
      'anthropic/claude-3-opus',
      'anthropic/claude-3-sonnet',
      'openai/gpt-4-turbo',
    ],
    defaultModel: 'meta-llama/llama-3-70b',
    priority: 2,
    costPerInputToken: 0.0000015,   // Variable by model
    costPerOutputToken: 0.000002,
    maxTokens: 128000,
    timeout: 15000,
    headers: {
      'HTTP-Referer': 'https://foundryai.com',
      'X-Title': 'FoundryAI',
    },
  },
];

export function getProvider(name: string): AIProvider | undefined {
  return AI_PROVIDERS.find(p => p.name === name);
}

export function getProvidersByPriority(): AIProvider[] {
  return [...AI_PROVIDERS].sort((a, b) => a.priority - b.priority);
}
```

---

## AI Router with Circuit Breaker

```typescript
// File: lib/ai/router.ts

import { getProvider, getProvidersByPriority } from './providers/registry';
import { CacheManager } from '@/lib/data/cache/manager';

export class AIRouter {
  private circuitBreakers = new Map<string, CircuitBreaker>();
  private cache: CacheManager;
  private costTracker: CostTracker;

  constructor(cache: CacheManager) {
    this.cache = cache;
    this.costTracker = new CostTracker();
    
    // Initialize circuit breakers
    for (const provider of getProvidersByPriority()) {
      this.circuitBreakers.set(provider.name, new CircuitBreaker());
    }
  }

  async generate(options: GenerateOptions): Promise<GenerateResult> {
    const cacheKey = this.generateCacheKey(options);
    
    // Check cache first
    const cached = await this.cache.get<GenerateResult>(cacheKey);
    if (cached) {
      return { ...cached, cached: true };
    }

    // Try providers in priority order
    const errors: string[] = [];
    
    for (const provider of getProvidersByPriority()) {
      const breaker = this.circuitBreakers.get(provider.name)!;
      
      if (breaker.isOpen()) {
        errors.push(`${provider.name}: Circuit breaker open`);
        continue;
      }

      try {
        const result = await this.callProvider(provider, options);
        
        breaker.recordSuccess();
        this.costTracker.record(result);
        
        // Cache successful response
        await this.cache.set(cacheKey, result, this.getCacheTTL(options));
        
        return result;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        breaker.recordFailure();
        errors.push(`${provider.name}: ${errorMsg}`);
      }
    }

    // All providers failed
    throw new AIError(
      `All AI providers failed: ${errors.join('; ')}`,
      'PROVIDERS_UNAVAILABLE',
      errors
    );
  }

  async chat(options: ChatOptions): Promise<GenerateResult> {
    // Convert chat messages to prompt for providers that don't support chat API
    const prompt = this.messagesToPrompt(options.messages);
    
    return this.generate({
      ...options,
      prompt,
      systemPrompt: options.messages.find(m => m.role === 'system')?.content,
    });
  }

  async *stream(options: GenerateOptions): AsyncGenerator<string> {
    const provider = getProvidersByPriority()[0];
    
    const response = await fetch(`${provider.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getApiKey(provider.name)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: options.model || provider.defaultModel,
        messages: [
          ...(options.systemPrompt ? [{ role: 'system', content: options.systemPrompt }] : []),
          { role: 'user', content: options.prompt },
        ],
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens || provider.maxTokens,
        stream: true,
      }),
    });

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim() !== '');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') return;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices[0]?.delta?.content;
            if (content) yield content;
          } catch {
            // Ignore parse errors for incomplete chunks
          }
        }
      }
    }
  }

  private async callProvider(
    provider: AIProvider,
    options: GenerateOptions
  ): Promise<GenerateResult> {
    const startTime = Date.now();
    
    const response = await fetch(`${provider.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getApiKey(provider.name)}`,
        'Content-Type': 'application/json',
        ...(provider.headers || {}),
      },
      body: JSON.stringify({
        model: options.model || provider.defaultModel,
        messages: [
          ...(options.systemPrompt ? [{ role: 'system', content: options.systemPrompt }] : []),
          { role: 'user', content: options.prompt },
        ],
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens || provider.maxTokens,
        top_p: options.topP,
        frequency_penalty: options.frequencyPenalty,
        presence_penalty: options.presencePenalty,
      }),
      signal: AbortSignal.timeout(provider.timeout),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Provider error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    const latency = Date.now() - startTime;
    
    const usage = data.usage || {
      prompt_tokens: this.estimateTokens(options.prompt + (options.systemPrompt || '')),
      completion_tokens: this.estimateTokens(data.choices[0].message.content),
    };

    const cost = this.calculateCost(provider, usage);

    return {
      content: data.choices[0].message.content,
      provider: provider.name,
      model: data.model || options.model || provider.defaultModel,
      usage: {
        promptTokens: usage.prompt_tokens,
        completionTokens: usage.completion_tokens,
        totalTokens: usage.total_tokens,
      },
      latency,
      cost,
      cached: false,
    };
  }

  private generateCacheKey(options: GenerateOptions): string {
    // Normalize options for consistent caching
    const normalized = {
      prompt: options.prompt,
      systemPrompt: options.systemPrompt,
      temperature: options.temperature ?? 0.7,
      maxTokens: options.maxTokens,
    };
    
    return `ai:${hashString(JSON.stringify(normalized))}`;
  }

  private getCacheTTL(options: GenerateOptions): number {
    // Different TTL based on content type
    if (options.prompt.includes('opportunity validation')) {
      return 5 * 60 * 1000; // 5 minutes
    }
    if (options.prompt.includes('code generation')) {
      return 60 * 60 * 1000; // 1 hour
    }
    return 30 * 60 * 1000; // 30 minutes default
  }

  private getApiKey(provider: string): string {
    switch (provider) {
      case 'groq':
        return process.env.GROQ_API_KEY!;
      case 'openrouter':
        return process.env.OPENROUTER_API_KEY!;
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }

  private messagesToPrompt(messages: ChatMessage[]): string {
    return messages
      .map(m => `${m.role.toUpperCase()}: ${m.content}`)
      .join('\n\n');
  }

  private estimateTokens(text: string): number {
    // Rough estimate: ~4 characters per token
    return Math.ceil(text.length / 4);
  }

  private calculateCost(
    provider: AIProvider,
    usage: { prompt_tokens: number; completion_tokens: number }
  ): number {
    const inputCost = usage.prompt_tokens * provider.costPerInputToken;
    const outputCost = usage.completion_tokens * provider.costPerOutputToken;
    return inputCost + outputCost;
  }
}

// Circuit breaker implementation
class CircuitBreaker {
  private failures = 0;
  private lastFailureTime: Date | null = null;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  
  private readonly threshold = 5;
  private readonly timeout = 60000; // 1 minute

  isOpen(): boolean {
    if (this.state === 'open') {
      if (this.lastFailureTime) {
        const elapsed = Date.now() - this.lastFailureTime.getTime();
        if (elapsed > this.timeout) {
          this.state = 'half-open';
          return false; // Try again
        }
      }
      return true;
    }
    return false;
  }

  recordSuccess(): void {
    this.failures = 0;
    this.state = 'closed';
    this.lastFailureTime = null;
  }

  recordFailure(): void {
    this.failures++;
    this.lastFailureTime = new Date();
    
    if (this.failures >= this.threshold) {
      this.state = 'open';
    }
  }
}

// Cost tracking
class CostTracker {
  private totalCost = 0;
  private requestCount = 0;

  record(result: GenerateResult): void {
    this.totalCost += result.cost;
    this.requestCount++;
  }

  getStats(): { totalCost: number; requestCount: number; avgCost: number } {
    return {
      totalCost: this.totalCost,
      requestCount: this.requestCount,
      avgCost: this.requestCount > 0 ? this.totalCost / this.requestCount : 0,
    };
  }
}

// Custom error
class AIError extends Error {
  constructor(
    message: string,
    public code: string,
    public providerErrors: string[]
  ) {
    super(message);
  }
}
```

---

## Prompt Management

### Prompt Template System

```typescript
// File: lib/ai/prompts/manager.ts

export interface PromptTemplate {
  id: string;
  name: string;
  version: string;
  template: string;
  variables: string[];
  systemPrompt?: string;
  defaultModel?: string;
  defaultTemperature?: number;
}

export class PromptManager {
  private templates = new Map<string, PromptTemplate>();

  register(template: PromptTemplate): void {
    this.templates.set(template.id, template);
  }

  render(templateId: string, variables: Record<string, unknown>): string {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template '${templateId}' not found`);
    }

    let rendered = template.template;
    
    for (const [key, value] of Object.entries(variables)) {
      rendered = rendered.replace(
        new RegExp(`{{${key}}}`, 'g'),
        String(value)
      );
    }

    return rendered;
  }

  getTemplate(id: string): PromptTemplate | undefined {
    return this.templates.get(id);
  }
}

// Global prompt manager
export const promptManager = new PromptManager();
```

### Built-in Prompts

```typescript
// File: lib/ai/prompts/templates.ts

import { promptManager } from './manager';

// Opportunity Validation Prompt
promptManager.register({
  id: 'opportunity-validation',
  name: 'Opportunity Validation',
  version: '1.0.0',
  systemPrompt: `You are an expert business analyst specializing in online income opportunities. 
Analyze opportunities across four dimensions and provide objective scoring.`,
  template: `Analyze this business opportunity:

Title: {{title}}
Description: {{description}}
Category: {{category}}
Target Audience: {{targetAudience}}

Provide analysis across these dimensions (score 0-25 each):

1. DEMAND VALIDATION (0-25):
   - Search trend data
   - Pain signal strength
   - Market size indicators
   
2. COMPETITION ANALYSIS (0-25):
   - Existing solutions
   - Differentiation potential
   - Market gaps
   
3. TECHNICAL FEASIBILITY (0-25):
   - Complexity assessment
   - Required skills
   - Build timeline
   
4. MONETIZATION POTENTIAL (0-25):
   - Pricing power
   - Revenue models
   - Market willingness to pay

TOTAL SCORE: /100

RECOMMENDATION: [PROCEED/CONSIDER/REJECT]

Rationale:
- Strengths:
- Weaknesses:
- Key risks:
- Suggested next steps:`,
  variables: ['title', 'description', 'category', 'targetAudience'],
  defaultTemperature: 0.3,
});

// Build Assistant Prompt
promptManager.register({
  id: 'build-assistant',
  name: 'AI Build Assistant',
  version: '1.0.0',
  systemPrompt: `You are an expert {{skillLevel}} helping build a {{projectType}}. 
Provide step-by-step guidance, code examples, and explain WHY not just HOW.
Warn about common pitfalls and suggest next steps.`,
  template: `Current Task: {{taskDescription}}

Context:
- Project: {{projectTitle}}
- Tech Stack: {{techStack}}
- Current Progress: {{progress}}%
- Specific Question: {{question}}

Provide:
1. Direct answer/solution
2. Code example (if applicable)
3. Explanation of the approach
4. Common pitfalls to avoid
5. Suggested next step`,
  variables: [
    'skillLevel',
    'projectType',
    'taskDescription',
    'projectTitle',
    'techStack',
    'progress',
    'question',
  ],
  defaultTemperature: 0.7,
});

// 14-Day Launch Protocol - Daily Check-in
promptManager.register({
  id: 'launch-protocol-checkin',
  name: 'Launch Protocol Daily Check-in',
  version: '1.0.0',
  template: `Day {{day}} of 14-Day Launch Protocol

Project: {{projectName}}
Archetype: {{archetype}}
Yesterday's Progress: {{yesterdayProgress}}
Today's Goal: {{todayGoal}}
Current Blockers: {{blockers}}

Provide:
1. Specific tasks for today
2. Code guidance for each task
3. Time estimates
4. Success criteria
5. Contingency if behind schedule`,
  variables: [
    'day',
    'projectName',
    'archetype',
    'yesterdayProgress',
    'todayGoal',
    'blockers',
  ],
});
```

---

## Context Management

### Conversation Context

```typescript
// File: lib/ai/context/manager.ts

export interface ConversationContext {
  id: string;
  userId: string;
  type: 'build-assistant' | 'opportunity-analysis' | 'therapist';
  messages: ChatMessage[];
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export class ContextManager {
  private maxContextLength = 10; // Keep last N messages
  private maxAge = 60 * 60 * 1000; // 1 hour

  constructor(private storage: StorageAdapter) {}

  async createContext(
    userId: string,
    type: ConversationContext['type'],
    metadata: Record<string, unknown> = {}
  ): Promise<ConversationContext> {
    const context: ConversationContext = {
      id: generateUUID(),
      userId,
      type,
      messages: [],
      metadata,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.saveContext(context);
    return context;
  }

  async getContext(contextId: string): Promise<ConversationContext | null> {
    return this.storage.get<ConversationContext>(`context:${contextId}`);
  }

  async addMessage(
    contextId: string,
    role: ChatMessage['role'],
    content: string
  ): Promise<ConversationContext> {
    const context = await this.getContext(contextId);
    if (!context) throw new Error('Context not found');

    context.messages.push({ role, content });
    
    // Trim to max length
    if (context.messages.length > this.maxContextLength) {
      // Keep system message if present
      const systemMessage = context.messages.find(m => m.role === 'system');
      context.messages = context.messages.slice(-this.maxContextLength);
      
      if (systemMessage && !context.messages.includes(systemMessage)) {
        context.messages.unshift(systemMessage);
      }
    }

    context.updatedAt = new Date();
    await this.saveContext(context);

    return context;
  }

  async getMessagesForProvider(
    contextId: string,
    maxTokens: number
  ): Promise<ChatMessage[]> {
    const context = await this.getContext(contextId);
    if (!context) return [];

    // Estimate and truncate to fit within token limit
    let totalTokens = 0;
    const messages: ChatMessage[] = [];

    for (let i = context.messages.length - 1; i >= 0; i--) {
      const message = context.messages[i];
      const tokens = this.estimateTokens(message.content);
      
      if (totalTokens + tokens > maxTokens) break;
      
      messages.unshift(message);
      totalTokens += tokens;
    }

    return messages;
  }

  private async saveContext(context: ConversationContext): Promise<void> {
    await this.storage.set(`context:${context.id}`, context, this.maxAge);
  }

  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }
}
```

---

## Document Integrity

**Version:** 1.0.0  
**Last Updated:** March 30, 2026  
**Status:** ACTIVE  
**Owner:** AI/ML Agent  

**Related Documents:**
- `10-INTEGRATIONS/ai-providers/00-ai-routing.md` — Provider configuration
- `10-INTEGRATIONS/ai-providers/01-groq.md` — Groq-specific setup
- `10-INTEGRATIONS/ai-providers/02-openrouter.md` — OpenRouter-specific setup

**Change Protocol:**
1. New AI providers need cost analysis
2. Prompt changes need version bump
3. Circuit breaker thresholds need load testing

---

**End of AI Expansion Layer Specification. All AI integration must use these patterns.**
