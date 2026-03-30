# AI/ML Agent Onboarding Guide

## Welcome, AI/ML Agent

---

## Your Mission

As the **AI/ML Agent**, you are the intelligence architect of FoundryAI. Your responsibility is to manage AI provider integrations, prompt engineering, context management, and cost optimization.

**Your Layer:** Layer 2 (AI Expansion)  
**Your Contract:** `01-ARCHITECTURE/06-ai-expansion-layer.md`  
**Your Tools:** Groq, OpenRouter, Prompt Engineering, Context Management

---

## Read Order (Complete Before Any Work)

### Phase 1: Foundation (30 minutes)
1. `00-NORTHSTAR/00-platform-manifesto.md` — Understand the mission
2. `00-NORTHSTAR/01-user-journey-map.md` — AI touchpoints in user journey
3. `01-ARCHITECTURE/00-system-overview.md` — Understand the system

### Phase 2: Specialization (45 minutes)
4. `01-ARCHITECTURE/06-ai-expansion-layer.md` — Your layer specification
5. `10-INTEGRATIONS/ai-providers/00-ai-routing.md` — AI provider details
6. `04-DOMAINS/` — Domain-specific AI needs

### Phase 3: Dependencies (30 minutes)
7. `01-ARCHITECTURE/04-logic-layer.md` — How AI is consumed
8. `01-ARCHITECTURE/02-agent-communication-protocol.md` — Communication
9. `05-AGENTS/00-agent-ecosystem-overview.md` — Team structure

---

## Your Responsibilities

### Core Responsibilities

| Area | Description | Output |
|------|-------------|--------|
| **AI Routing** | Multi-provider failover | `lib/ai/router.ts` |
| **Prompt Engineering** | Template design | `lib/ai/prompts/*.ts` |
| **Context Management** | Conversation state | `lib/ai/context/*.ts` |
| **Cost Optimization** | Token usage, caching | Cost tracking |
| **Model Selection** | Choose right model for task | Provider configs |

### What You Own

**You have FULL control over:**
- `src/lib/ai/` — AI layer implementation
- `src/lib/ai/prompts/` — Prompt templates
- `src/lib/ai/context/` — Context management
- AI provider configurations

### What You DON'T Own (But Interface With)

| Area | Owner | Your Interface |
|------|-------|----------------|
| Business logic | Backend Agent | Provide AI responses |
| Data persistence | Database Agent | Context storage |
| UI rendering | Frontend Agent | Streaming responses |

---

## Prompt Engineering

### Prompt Template Structure

```typescript
// File: lib/ai/prompts/opportunity-validation.ts

export const opportunityValidationPrompt = {
  id: 'opportunity-validation',
  version: '1.0.0',
  
  systemPrompt: `You are an expert business analyst specializing in online income opportunities.
Analyze opportunities across four dimensions and provide objective scoring.
Be encouraging but honest.`,

  template: `Analyze this business opportunity:

Title: {{title}}
Description: {{description}}
Category: {{category}}
Target Audience: {{targetAudience}}
User Skills: {{userSkills}}

Provide analysis across these dimensions (score 0-25 each):

1. DEMAND VALIDATION (0-25):
   - Market need evidence
   - Search trend indicators
   - Pain point severity
   
2. COMPETITION ANALYSIS (0-25):
   - Existing solutions
   - Differentiation potential
   - Market gaps
   
3. TECHNICAL FEASIBILITY (0-25):
   - Complexity for skill level
   - Required resources
   - Timeline estimation
   
4. MONETIZATION POTENTIAL (0-25):
   - Revenue model viability
   - Pricing power
   - Market willingness to pay

TOTAL SCORE: /100

RECOMMENDATION: [PROCEED/CONSIDER/REJECT]

Rationale:
- Strengths:
- Weaknesses:
- Risks:
- Suggested next steps:`,

  variables: ['title', 'description', 'category', 'targetAudience', 'userSkills'],
  
  defaultModel: 'llama3-70b-8192',
  defaultTemperature: 0.3,
};
```

### Prompt Versioning

```typescript
// File: lib/ai/prompts/registry.ts

class PromptRegistry {
  private prompts = new Map<string, PromptTemplate>();
  
  register(template: PromptTemplate): void {
    this.prompts.set(template.id, template);
  }
  
  get(id: string, version?: string): PromptTemplate {
    const prompt = this.prompts.get(id);
    if (!prompt) throw new Error(`Prompt ${id} not found`);
    
    // Version checking
    if (version && prompt.version !== version) {
      console.warn(`Prompt version mismatch: requested ${version}, found ${prompt.version}`);
    }
    
    return prompt;
  }
  
  render(id: string, variables: Record<string, unknown>): string {
    const prompt = this.get(id);
    
    let rendered = prompt.template;
    for (const [key, value] of Object.entries(variables)) {
      rendered = rendered.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
    }
    
    return rendered;
  }
}

export const promptRegistry = new PromptRegistry();
```

---

## AI Routing

### Multi-Provider Setup

```typescript
// File: lib/ai/router.ts

const AI_PROVIDERS = [
  {
    name: 'groq',
    priority: 1,
    models: ['llama3-70b-8192', 'mixtral-8x7b-32768'],
    defaultModel: 'llama3-70b-8192',
    costPerToken: 0.00000059,
    timeout: 10000,
  },
  {
    name: 'openrouter',
    priority: 2,
    models: ['meta-llama/llama-3-70b', 'anthropic/claude-3-opus'],
    defaultModel: 'meta-llama/llama-3-70b',
    costPerToken: 0.0000015,
    timeout: 15000,
  },
];

export class AIRouter {
  private circuitBreakers = new Map<string, CircuitBreaker>();
  
  async generate(options: GenerateOptions): Promise<GenerateResult> {
    const sortedProviders = [...AI_PROVIDERS].sort((a, b) => a.priority - b.priority);
    
    for (const provider of sortedProviders) {
      const breaker = this.circuitBreakers.get(provider.name);
      
      if (breaker?.isOpen()) {
        continue; // Skip unhealthy provider
      }
      
      try {
        const result = await this.callProvider(provider, options);
        breaker?.recordSuccess();
        return result;
      } catch (error) {
        breaker?.recordFailure();
        console.warn(`${provider.name} failed:`, error);
      }
    }
    
    throw new Error('All AI providers unavailable');
  }
}
```

---

## Context Management

### Conversation Context

```typescript
// File: lib/ai/context/manager.ts

export class ContextManager {
  private maxMessages = 20; // Keep last 20 messages
  
  async createConversation(
    userId: string,
    type: 'build-assistant' | 'opportunity-analysis' | 'therapist'
  ): Promise<string> {
    const conversationId = generateUUID();
    
    await this.save(conversationId, {
      id: conversationId,
      userId,
      type,
      messages: [],
      createdAt: new Date(),
    });
    
    return conversationId;
  }
  
  async addMessage(
    conversationId: string,
    role: 'user' | 'assistant',
    content: string
  ): Promise<void> {
    const conversation = await this.get(conversationId);
    
    conversation.messages.push({ role, content, timestamp: new Date() });
    
    // Trim to max length
    if (conversation.messages.length > this.maxMessages) {
      conversation.messages = conversation.messages.slice(-this.maxMessages);
    }
    
    await this.save(conversationId, conversation);
  }
  
  async getContextForProvider(
    conversationId: string,
    maxTokens: number = 4000
  ): Promise<ChatMessage[]> {
    const conversation = await this.get(conversationId);
    
    // Convert to provider format, respecting token limit
    const messages: ChatMessage[] = [];
    let totalTokens = 0;
    
    for (const msg of [...conversation.messages].reverse()) {
      const tokens = this.estimateTokens(msg.content);
      
      if (totalTokens + tokens > maxTokens) break;
      
      messages.unshift({ role: msg.role, content: msg.content });
      totalTokens += tokens;
    }
    
    return messages;
  }
}
```

---

## Cost Optimization

### Token Usage Tracking

```typescript
// File: lib/ai/cost/tracker.ts

export class CostTracker {
  private totalTokens = 0;
  private totalCost = 0;
  private requestsByProvider = new Map<string, number>();
  
  record(result: GenerateResult): void {
    this.totalTokens += result.usage.totalTokens;
    this.totalCost += result.cost;
    
    const current = this.requestsByProvider.get(result.provider) || 0;
    this.requestsByProvider.set(result.provider, current + 1);
  }
  
  getStats(): CostStats {
    return {
      totalTokens: this.totalTokens,
      totalCost: this.totalCost,
      requestsByProvider: Object.fromEntries(this.requestsByProvider),
    };
  }
}

// Cache configuration based on content type
const CACHE_TTL = {
  'opportunity-validation': 5 * 60 * 1000,  // 5 minutes
  'code-generation': 60 * 60 * 1000,        // 1 hour
  'chat-response': 30 * 60 * 1000,        // 30 minutes
};
```

---

## Quality Checklist

- [ ] **Prompt Quality**
  - [ ] Clear instructions
  - [ ] Examples provided
  - [ ] Output format specified
  - [ ] Edge cases considered

- [ ] **Cost Efficiency**
  - [ ] Appropriate model selected
  - [ ] Caching implemented
  - [ ] Token usage tracked

- [ ] **Reliability**
  - [ ] Circuit breaker working
  - [ ] Failover tested
  - [ ] Timeout handling

- [ ] **Context Management**
  - [ ] Conversation history trimmed
  - [ ] System prompts effective
  - [ ] Memory limits respected

---

**Ready to start? Confirm completion of Read Order, then await your first assignment from Lead Architect.**
