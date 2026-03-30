# System Architecture

## Technical Infrastructure & Platform Design

---

## Architecture Overview

FoundryAI operates on a **multi-layer resilient architecture** designed for reliability, scalability, and optimal user experience. The system is built to handle the complex demands of real-time AI assistance, opportunity detection, and user progress tracking while maintaining 99.9% uptime.

### Architectural Principles

1. **Resilience over complexity** — Simple, robust systems that recover quickly
2. **Progressive enhancement** — Core functionality works offline; AI enhances when available
3. **Multi-modal AI** — No single point of failure in AI layer
4. **Edge-first** — Static generation where possible; dynamic only when necessary
5. **Security by design** — Privacy and security built into every layer

---

## The Four-Layer Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FOUNDRYAI SYSTEM ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌───────────────────────────────────────────────────────────────────────┐   │
│  │                    PRESENTATION LAYER                                  │   │
│  │                                                                        │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │   │
│  │  │   Landing   │  │  Dashboard  │  │   Radar UI  │  │   Learning  │  │   │
│  │  │    Page     │  │    Portal   │  │  Interface  │  │   Platform  │  │   │
│  │  │  (Static)   │  │  (Dynamic)  │  │  (Dynamic)  │  │  (Hybrid)   │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │   │
│  │                                                                        │   │
│  │  Technology Stack:                                                     │   │
│  │  • Next.js 14 (App Router)                                             │   │
│  │  • React Server Components                                             │   │
│  │  • TypeScript (strict mode)                                            │   │
│  │  • TailwindCSS (utility-first)                                         │   │
│  │  • shadcn/ui (accessible components)                                   │   │
│  │  • Framer Motion (animations)                                          │   │
│  │                                                                        │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                    ↓                                          │
│  ┌───────────────────────────────────────────────────────────────────────┐   │
│  │                       LOGIC LAYER                                      │   │
│  │                                                                        │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │   │
│  │  │  AI Router  │  │ Validation  │  │  Business   │  │   Tiering   │  │   │
│  │  │ (Multi-AI)  │  │   Engine    │  │   Logic     │  │   Engine    │  │   │
│  │  │             │  │             │  │             │  │             │  │   │
│  │  │ • Groq      │  │ • Input     │  │ • Opportunity│  │ • Progress  │  │   │
│  │  │ • OpenRouter│  │   sanitization│ • User journey│  │   tracking  │  │   │
│  │  │ • Fallback  │  │ • Schema    │  │ • Revenue   │  │ • Feature   │  │   │
│  │  │   queue     │  │   validation│  │   calculation│  │   gating    │  │   │
│  │  │ • Caching   │  │ • Safety    │  │ • Milestone │  │ • Affiliate │  │   │
│  │  │   layer     │  │   checks    │  │   checks    │  │   revenue   │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │   │
│  │                                                                        │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                    ↓                                          │
│  ┌───────────────────────────────────────────────────────────────────────┐   │
│  │                        DATA LAYER                                      │   │
│  │                                                                        │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │   │
│  │  │  Supabase   │  │  AI Cache   │  │ Opportunity│  │  Analytics  │  │   │
│  │  │  (Primary)   │  │   Layer     │  │  Database  │  │   Store     │  │   │
│  │  │             │  │             │  │             │  │             │  │   │
│  │  │ • PostgreSQL│  │ • Redis     │  │ • 1000+    │  │ • PostHog   │  │   │
│  │  │ • Row Level │  │ • AI response│  │   templates│  │ • Event     │  │   │
│  │  │   Security  │  │   caching   │  │ • Market    │  │   tracking  │  │   │
│  │  │ • Real-time │  │ • Rate limit│  │   data      │  │ • User      │  │   │
│  │  │   subscriptions│ • Context    │  │ • Trending │  │   analytics │  │   │
│  │  │ • Auth      │  │   storage   │  │   scores    │  │ • Funnel    │  │   │
│  │  │             │  │             │  │             │  │   analysis  │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │   │
│  │                                                                        │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                    ↓                                          │
│  ┌───────────────────────────────────────────────────────────────────────┐   │
│  │                    AI EXPANSION LAYER                                  │   │
│  │                                                                        │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │   │
│  │  │    Groq     │  │ OpenRouter  │  │  AI Fallback│  │   Prompt    │  │   │
│  │  │  (Primary)  │  │(Secondary)  │  │   System    │  │   Manager   │  │   │
│  │  │             │  │             │  │             │  │             │  │   │
│  │  │ • Fast      │  │ • Multi-    │  │ • Queue     │  │ • Template  │  │   │
│  │  │   inference │  │   provider  │  │   system    │  │   library │  │   │
│  │  │ • Mixtral   │  │ • Llama 3   │  │ • Retry     │  │ • Context   │  │   │
│  │  │ • Llama 3   │  │ • Claude    │  │   logic      │  │   injection│  │   │
│  │  │ • Cost      │  │ • GPT-4     │  │ • Circuit   │  │ • Output    │  │   │
│  │  │   efficient │  │   (fallback)│  │   breaker   │  │   parsing   │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │   │
│  │                                                                        │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Layer 1: Presentation Layer

### Technology Stack

| Technology | Purpose | Justification |
|------------|---------|---------------|
| **Next.js 14** | Full-stack React framework | App Router, RSC, optimal performance |
| **TypeScript** | Type safety | Reduces runtime errors, better DX |
| **TailwindCSS** | Styling | Rapid development, consistent design |
| **shadcn/ui** | UI components | Accessible, customizable primitives |
| **Framer Motion** | Animations | Smooth UX, professional feel |

### Key Pages & Routes

```
/app
├── page.tsx                    # Landing page (static, edge-cached)
├── layout.tsx                  # Root layout with providers
├── globals.css                 # Global styles + Tailwind
│
├── (marketing)/
│   ├── about/page.tsx
│   ├── pricing/page.tsx
│   └── features/page.tsx
│
├── (auth)/
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   └── forgot-password/page.tsx
│
├── dashboard/
│   ├── page.tsx                # Main dashboard
│   ├── layout.tsx              # Dashboard shell
│   ├── opportunities/
│   │   └── page.tsx            # Opportunity Radar UI
│   ├── build/
│   │   └── page.tsx            # AI Build Assistant
│   ├── profile/
│   │   └── page.tsx            # User settings
│   └── settings/
│       └── page.tsx
│
├── api/
│   ├── ai/route.ts             # AI proxy endpoints
│   ├── opportunities/route.ts  # Opportunity data
│   ├── revenue/route.ts        # Revenue tracking
│   └── webhooks/               # External service webhooks
│
└── components/
    ├── foundryai/              # Domain-specific components
    └── ui/                     # shadcn/ui components
```

### Performance Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│  PRESENTATION LAYER PERFORMANCE                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  STATIC GENERATION (ISR):                                         │
│  ├── Landing page: Revalidated every 60 seconds                  │
│  ├── Marketing pages: Revalidated every 5 minutes                  │
│  ├── Template gallery: Revalidated on new template addition      │
│  └── Result: Sub-100ms TTFB for static content                    │
│                                                                   │
│  DYNAMIC RENDERING:                                               │
│  ├── Dashboard: SSR with user data                              │
│  ├── AI chat: Streaming responses                                  │
│  ├── Opportunity Radar: SSR + client-side polling                │
│  └── Result: Fresh data, fast initial paint                       │
│                                                                   │
│  EDGE CACHING:                                                    │
│  ├── Static assets: 1 year cache                                  │
│  ├── API responses: Varies by endpoint                            │
│  │   ├── /api/opportunities: 5 minutes                          │
│   │   ├── /api/user: No cache (private)                          │
│   │   └── /api/ai: 1 hour (anonymized patterns)                   │
│   └── Result: Reduced origin load, faster global access            │
│                                                                   │
│  IMAGE OPTIMIZATION:                                              │
│   ├── Next.js Image component for automatic optimization           │
│   ├── WebP format with fallbacks                                   │
│   ├── Responsive srcset                                            │
│   └── Result: 60-80% smaller images                                │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Layer 2: Logic Layer

### AI Router Architecture

The AI Router is the critical component that ensures 99.9% AI availability through multi-provider failover.

```
┌─────────────────────────────────────────────────────────────────┐
│  AI ROUTER: MULTI-PROVIDER FAILOVER SYSTEM                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  REQUEST FLOW:                                                    │
│                                                                   │
│  User Request → AI Router → Primary (Groq)                   │
│                                   ↓                              │
│                              Success?                           │
│                              /        \                         │
│                            Yes         No (failover)            │
│                             ↓            ↓                       │
│                        Return       Secondary (OpenRouter)      │
│                        Response           ↓                      │
│                                    Success?                       │
│                                    /        \                   │
│                                  Yes         No (queue)         │
│                                   ↓            ↓                │
│                              Return       Add to retry           │
│                              Response        queue               │
│                                              ↓                   │
│                                         Background               │
│                                         processing               │
│                                                                   │
│  CIRCUIT BREAKER PATTERN:                                         │
│  ├── Monitor failure rate per provider                          │
│  ├── If failure rate > 10% in 1 minute: Open circuit            │
│  ├── Route all traffic to healthy providers                      │
│  ├── After 30 seconds: Half-open (test health)                   │
│  └── If healthy: Close circuit, resume normal routing             │
│                                                                   │
│  COST OPTIMIZATION:                                               │
│  ├── Route simple queries to cheaper models (Llama 3)            │
│  ├── Reserve expensive models (GPT-4) for complex tasks            │
│  ├── Cache identical requests (Redis)                            │
│  └── Batch non-urgent requests (queue system)                    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### AI Provider Configuration

```typescript
// src/lib/ai/ai-router.ts

interface AIProvider {
  name: string;
  baseUrl: string;
  models: string[];
  priority: number; // 1 = primary, 2 = secondary, etc.
  costPerToken: number;
  maxTokens: number;
  timeout: number; // milliseconds
}

const PROVIDERS: AIProvider[] = [
  {
    name: 'groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    models: ['mixtral-8x7b-32768', 'llama3-70b-8192'],
    priority: 1,
    costPerToken: 0.000002,
    maxTokens: 32768,
    timeout: 10000
  },
  {
    name: 'openrouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    models: ['meta-llama/llama-3-70b', 'anthropic/claude-3-opus'],
    priority: 2,
    costPerToken: 0.000003,
    maxTokens: 128000,
    timeout: 15000
  }
];

class AIRouter {
  private circuitBreaker: CircuitBreaker;
  private cache: RedisCache;
  
  async generate(prompt: string, options: AIOptions): Promise<AIResponse> {
    // Check cache first
    const cached = await this.cache.get(prompt);
    if (cached) return cached;
    
    // Try providers in priority order
    for (const provider of this.getHealthyProviders()) {
      try {
        const response = await this.callProvider(provider, prompt, options);
        await this.cache.set(prompt, response, 3600); // 1 hour cache
        return response;
      } catch (error) {
        this.circuitBreaker.recordFailure(provider.name);
        continue; // Try next provider
      }
    }
    
    // All providers failed - queue for retry
    return this.queueForRetry(prompt, options);
  }
}
```

### Validation Engine

```
┌─────────────────────────────────────────────────────────────────┐
│  VALIDATION ENGINE ARCHITECTURE                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  INPUT SANITIZATION:                                              │
│  ├── XSS prevention: DOMPurify for all user inputs                │
│  ├── SQL injection: Parameterized queries (Supabase)            │
│  ├── Rate limiting: 100 requests/minute per user                │
│  ├── Size limits: Max 10KB per request                            │
│  └── Content filtering: Block harmful/offensive content           │
│                                                                   │
│  SCHEMA VALIDATION:                                               │
│  ├── Zod schemas for all API inputs                               │
│  ├── Type-safe validation with detailed error messages           │
│  ├── Custom validators for domain-specific logic                  │
│  └── Automatic OpenAPI spec generation                            │
│                                                                   │
│  SAFETY CHECKS:                                                   │
│  ├── AI output moderation: Flag harmful content                 │
│  ├── Business logic validation: Revenue can't be negative         │
│  ├── User permission checks: RLS policies enforced              │
│  └── Audit logging: All actions tracked                           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Layer 3: Data Layer

### Supabase Schema

```sql
-- Core user profiles and progress
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'starter', 'pro', 'elite', 'legend')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User journeys and progress tracking
CREATE TABLE public.user_journeys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  current_stage TEXT NOT NULL,
  selected_archetype TEXT,
  build_progress INTEGER DEFAULT 0,
  revenue_generated DECIMAL(10,2) DEFAULT 0,
  milestones_achieved TEXT[] DEFAULT '{}',
  momentum_scores JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI-generated opportunities from radar
CREATE TABLE public.opportunities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  archetype TEXT NOT NULL,
  category TEXT,
  difficulty_level TEXT,
  monetization_potential INTEGER,
  competition_level TEXT,
  validation_score DECIMAL(5,2),
  trending_score DECIMAL(5,2),
  demand_signals JSONB,
  technical_feasibility JSONB,
  monetization_data JSONB,
  keywords TEXT[],
  template_data JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Template gallery
CREATE TABLE public.templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  archetype TEXT NOT NULL,
  category TEXT,
  mvp_features TEXT[],
  tech_stack JSONB,
  build_roadmap JSONB,
  monetization_strategy JSONB,
  go_to_market JSONB,
  sales_funnel JSONB,
  business_dev JSONB,
  infinite_growth JSONB,
  estimated_build_days INTEGER,
  difficulty TEXT,
  downloads_count INTEGER DEFAULT 0,
  success_rate DECIMAL(5,2),
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Revenue tracking
CREATE TABLE public.revenue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  source TEXT NOT NULL, -- 'saas', 'digital_product', 'affiliate', etc.
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  description TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Affiliate tracking
CREATE TABLE public.affiliate_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  tool_name TEXT NOT NULL,
  tool_category TEXT,
  clicked_at TIMESTAMPTZ DEFAULT NOW(),
  converted_at TIMESTAMPTZ,
  commission_amount DECIMAL(10,2)
);

-- AI feedback for improvement
CREATE TABLE public.ai_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  prompt TEXT NOT NULL,
  response TEXT NOT NULL,
  is_helpful BOOLEAN,
  user_comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Opportunities are public (read-only)
CREATE POLICY "Opportunities are public"
  ON public.opportunities FOR SELECT
  TO PUBLIC
  USING (is_active = TRUE);

-- Templates are public (read-only)
CREATE POLICY "Templates are public"
  ON public.templates FOR SELECT
  TO PUBLIC
  USING (TRUE);
```

### Caching Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│  MULTI-TIER CACHING ARCHITECTURE                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  L1: IN-MEMORY (Application Level)                                │
│  ├── Next.js Data Cache: React Server Components                │
│  ├── SWR/Stale-While-Revalidate: Client-side state               │
│  └── TTL: 5-60 seconds depending on volatility                    │
│                                                                   │
│  L2: REDIS (Edge Cache)                                           │
│  ├── AI responses: 1 hour TTL                                     │
│  ├── Opportunity data: 5 minutes TTL                             │
│  ├── User sessions: 24 hours TTL                                 │
│  └── Template metadata: 1 hour TTL                               │
│                                                                   │
│  L3: CDN (Vercel Edge Network)                                    │
│  ├── Static assets: 1 year TTL                                   │
│  ├── Static pages: ISR with 60s-5min revalidation               │
│  └── API responses: Cache headers per endpoint                   │
│                                                                   │
│  CACHE INVALIDATION:                                              │
│  ├── Webhook-based: On data change, invalidate relevant caches    │
│  ├── Time-based: Automatic expiration                            │
│  └── Manual: Admin panel for emergency cache clear                 │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Layer 4: AI Expansion Layer

### Multi-Provider Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│  AI PROVIDER ECOSYSTEM                                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  PRIMARY: Groq (70% of traffic)                                   │
│  ├── Strengths:                                                     │
│  │   • 10x faster inference than competitors                      │
│  │   • Cost-effective (Mixtral, Llama 3)                           │
│  │   • High rate limits (1000 req/min)                            │
│  │   • Good for real-time chat                                     │
│  ├── Use cases:                                                     │
│  │   • Chat responses                                              │
│  │   • Code generation                                            │
│  │   • Quick content creation                                     │
│  └── Fallback trigger: >5 second response time                     │
│                                                                   │
│  SECONDARY: OpenRouter (25% of traffic)                            │
│  ├── Strengths:                                                     │
│  │   • Access to 100+ models                                       │
│  │   • Automatic model selection                                   │
│  │   • Claude 3 Opus for complex tasks                             │
│  │   • Good for creative writing                                   │
│  ├── Use cases:                                                     │
│  │   • Complex business strategy                                   │
│  │   • Long-form content                                          │
│  │   • Code review and architecture                                │
│  └── Fallback trigger: Groq failure or timeout                   │
│                                                                   │
│  FALLBACK: Background Queue (5% of traffic)                        │
│  ├── When used:                                                     │
│  │   • All providers unavailable                                   │
│  │   • User request can be async                                  │
│  │   • Non-critical path operations                                │
│  ├── Processing:                                                    │
│  │   • Add to Bull/Redis queue                                     │
│  │   • Process when provider available                             │
│  │   • Notify user via email/notification                          │
│  └── SLA: <5 minute processing time                                │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Prompt Management System

```typescript
// src/lib/ai/prompts/index.ts

interface PromptTemplate {
  id: string;
  category: 'build' | 'opportunity' | 'mindset' | 'productivity';
  version: string;
  template: string;
  variables: string[];
  model: string;
  temperature: number;
  maxTokens: number;
}

const PROMPTS: Record<string, PromptTemplate> = {
  'build-assistant': {
    id: 'build-assistant',
    category: 'build',
    version: '2.1',
    template: `You are an expert software architect and developer helping a beginner build their first {projectType}.

User Context:
- Skill Level: {skillLevel}
- Time Available: {timeAvailable} hours/week
- Archetype: {archetype}
- Current Stage: {currentStage}

Current Task: {taskDescription}

Provide:
1. Step-by-step instructions (numbered)
2. Code examples where relevant
3. Explanations of WHY (not just HOW)
4. Common pitfalls to avoid
5. Next steps after completion

Keep response actionable. Avoid theory without practical application.`,
    variables: ['projectType', 'skillLevel', 'timeAvailable', 'archetype', 'currentStage', 'taskDescription'],
    model: 'mixtral-8x7b-32768',
    temperature: 0.7,
    maxTokens: 2000
  },
  
  'opportunity-analysis': {
    id: 'opportunity-analysis',
    category: 'opportunity',
    version: '1.8',
    template: `Analyze this business opportunity for validation scoring:

Opportunity: {opportunityTitle}
Description: {opportunityDescription}
Archetype: {archetype}

Provide validation analysis across 4 dimensions (score 0-25 each):
1. DEMAND VALIDATION: Search trends, market signals
2. COMPETITION ANALYSIS: Competitive landscape, gaps
3. TECHNICAL FEASIBILITY: Build complexity, skills required
4. MONETIZATION POTENTIAL: Pricing power, market size

Total Score: /100
Recommendation: PROCEED / CONSIDER / REJECT

Be objective and evidence-based.`,
    variables: ['opportunityTitle', 'opportunityDescription', 'archetype'],
    model: 'llama3-70b-8192',
    temperature: 0.3,
    maxTokens: 1500
  }
};

export function getPrompt(id: string, variables: Record<string, string>): string {
  const template = PROMPTS[id];
  if (!template) throw new Error(`Prompt ${id} not found`);
  
  let result = template.template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`{${key}}`, 'g'), value);
  }
  
  return result;
}
```

---

## Security Architecture

### Authentication & Authorization

```
┌─────────────────────────────────────────────────────────────────┐
│  SECURITY ARCHITECTURE                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  AUTHENTICATION (Supabase Auth):                                  │
│  ├── Email/password with strong requirements                      │
│  ├── Magic link (passwordless) option                            │
│  ├── OAuth: Google, GitHub                                        │
│  ├── MFA: TOTP (optional for higher tiers)                       │
│  └── Session management: JWT with refresh tokens                  │
│                                                                   │
│  AUTHORIZATION (RLS Policies):                                    │
│  ├── Row Level Security on all tables                             │
│  ├── Users can only access their own data                         │
│  ├── Admin role for support staff                                 │
│  └── Audit logging for sensitive operations                       │
│                                                                   │
│  DATA PROTECTION:                                                 │
│  ├── Encryption at rest (Supabase default)                       │
│  ├── Encryption in transit (TLS 1.3)                              │
│  ├── API keys: Hashed, never exposed client-side                  │
│  └── PII: Minimized collection, encrypted storage                │
│                                                                   │
│  AI PRIVACY:                                                      │
│  ├── User prompts never used for model training                   │
│  ├── Conversation history: User-controlled retention                │
│  ├── Business ideas: Not shared with AI providers                │
│  └── Data processing agreements with all providers                │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture

### Vercel Deployment Strategy

```yaml
# vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/api/ai",
      "dest": "/api/ai",
      "headers": {
        "Cache-Control": "no-cache"
      }
    },
    {
      "src": "/api/opportunities",
      "dest": "/api/opportunities",
      "headers": {
        "Cache-Control": "public, max-age=300"
      }
    }
  ],
  "crons": [
    {
      "path": "/api/cron/update-opportunities",
      "schedule": "0 */6 * * *"
    },
    {
      "path": "/api/cron/cleanup-cache",
      "schedule": "0 0 * * *"
    }
  ]
}
```

### Environment Configuration

```bash
# .env.local (development)
# .env.production (production)

# Required
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI Providers
GROQ_API_KEY=your-groq-key
OPENROUTER_API_KEY=your-openrouter-key

# Optional - Analytics
POSTHOG_KEY=your-posthog-key
SENTRY_DSN=your-sentry-dsn

# Optional - Monitoring
LOGFLARE_API_KEY=your-logflare-key

# Optional - Rate Limiting
UPSTASH_REDIS_REST_URL=your-upstash-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-token
```

---

## Monitoring & Observability

### Key Metrics

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| **API Response Time** | <500ms p95 | >1s for 5 minutes |
| **AI Response Time** | <3s average | >5s for 10 requests |
| **Error Rate** | <0.1% | >1% for 5 minutes |
| **Uptime** | 99.9% | Any downtime |
| **Cache Hit Rate** | >80% | <60% |
| **DB Connection Pool** | <80% used | >90% |

### Health Check Endpoints

```typescript
// app/api/health/route.ts

export async function GET() {
  const checks = {
    database: await checkDatabase(),
    cache: await checkCache(),
    ai: await checkAIProviders(),
    timestamp: new Date().toISOString()
  };
  
  const allHealthy = Object.values(checks).every(c => c.status === 'ok');
  
  return Response.json(checks, {
    status: allHealthy ? 200 : 503
  });
}

async function checkAIProviders() {
  const providers = ['groq', 'openrouter'];
  const results = await Promise.all(
    providers.map(async p => {
      try {
        // Lightweight ping
        await aiRouter.ping(p);
        return { provider: p, status: 'ok' };
      } catch {
        return { provider: p, status: 'error' };
      }
    })
  );
  
  return {
    status: results.some(r => r.status === 'ok') ? 'ok' : 'error',
    providers: results
  };
}
```

---

## Scalability Roadmap

### Current Capacity

| Resource | Current Limit | Plan |
|----------|---------------|------|
| Concurrent users | 1,000 | 10,000 |
| API requests/min | 10,000 | 100,000 |
| AI requests/day | 50,000 | 500,000 |
| Database size | 10GB | 100GB |
| CDN bandwidth | 1TB/month | 10TB/month |

### Scaling Strategies

1. **Database:**
   - Read replicas for analytics queries
   - Connection pooling (PgBouncer)
   - Partitioning for large tables (revenue, events)

2. **AI Layer:**
   - Load balancing across provider accounts
   - Request queuing for burst handling
   - Edge AI inference (future: local models)

3. **Caching:**
   - Redis Cluster for horizontal scaling
   - Smart cache warming for popular content
   - Regional edge caching

4. **CDN:**
   - Multi-region deployment
   - Edge functions for personalization
   - Static generation at edge

---

## Conclusion

The FoundryAI architecture is designed for:
- **Reliability:** 99.9% uptime through redundancy
- **Performance:** Sub-second response times
- **Scalability:** 10x growth capacity built-in
- **Security:** Defense in depth at every layer
- **Maintainability:** Clean separation of concerns

This architecture enables the platform to serve thousands of entrepreneurs simultaneously, each receiving personalized AI assistance, validated opportunities, and progress tracking without degradation.

---

**Documentation Navigation:**
- ← Previous: [Core Philosophy](./03-core-philosophy.md)
- → Next: [Tier 1 - Core Foundation Layer](./05-tier1-foundation.md)
- ↑ Up: [Documentation Index](./01-platform-overview.md#documentation-index)
