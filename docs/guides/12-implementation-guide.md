# Implementation & Technical Reference

## Development Guide & API Documentation

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Environment Setup](#environment-setup)
3. [Database Schema](#database-schema)
4. [API Reference](#api-reference)
5. [AI Integration](#ai-integration)
6. [Deployment](#deployment)
7. [Testing](#testing)

---

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** — [Download](https://nodejs.org/)
- **Git** — [Download](https://git-scm.com/)
- **Package manager** — npm (included with Node.js) or yarn/pnpm

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/Mohamed-Elgendi/FoundryAI.git
cd FoundryAI

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp env.example .env.local

# 4. Edit .env.local with your keys (see Environment Setup)

# 5. Set up database
# Run supabase/schema.sql in your Supabase SQL editor

# 6. Start development server
npm run dev

# 7. Open http://localhost:3000
```

---

## Environment Setup

### Required Environment Variables

```bash
# .env.local

# Supabase (Database & Auth)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI Providers
GROQ_API_KEY=your-groq-key
OPENROUTER_API_KEY=your-openrouter-key

# Optional: Analytics & Monitoring
POSTHOG_KEY=your-posthog-key
SENTRY_DSN=your-sentry-dsn

# Optional: Rate Limiting
UPSTASH_REDIS_REST_URL=your-upstash-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-token
```

### Getting API Keys

| Service | Sign Up | Key Location |
|---------|---------|--------------|
| **Supabase** | [supabase.com](https://supabase.com) | Project Settings > API |
| **Groq** | [groq.com](https://groq.com) | Dashboard > API Keys |
| **OpenRouter** | [openrouter.ai](https://openrouter.ai) | Keys section |
| **PostHog** | [posthog.com](https://posthog.com) | Project Settings |
| **Sentry** | [sentry.io](https://sentry.io) | Settings > Projects |
| **Upstash** | [upstash.com](https://upstash.com) | Database console |

---

## Database Schema

### Core Tables

```sql
-- User profiles and progress tracking
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'starter', 'pro', 'elite', 'legend')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User journeys and progress
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

-- AI-generated opportunities
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
  source TEXT NOT NULL,
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

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Opportunities are public"
  ON public.opportunities FOR SELECT
  TO PUBLIC
  USING (is_active = TRUE);

CREATE POLICY "Templates are public"
  ON public.templates FOR SELECT
  TO PUBLIC
  USING (TRUE);
```

### Running Migrations

```bash
# Option 1: Use Supabase CLI
supabase db push

# Option 2: Manual execution
# 1. Go to Supabase Dashboard > SQL Editor
# 2. Copy schema.sql content
# 3. Run
```

---

## API Reference

### Authentication Endpoints

```typescript
// POST /api/auth/register
// Register new user
interface RegisterRequest {
  email: string;
  password: string;
  display_name?: string;
}

interface RegisterResponse {
  user: {
    id: string;
    email: string;
    display_name: string;
  };
  session: {
    access_token: string;
    refresh_token: string;
  };
}

// POST /api/auth/login
// Authenticate existing user
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: Profile;
  session: Session;
}
```

### Opportunities API

```typescript
// GET /api/opportunities
// Fetch opportunities with filtering
interface OpportunitiesQuery {
  archetype?: string;
  minScore?: number;
  maxTimeline?: number;
  budget?: '0' | 'low' | 'medium' | 'high';
  trending?: boolean;
  limit?: number;
  offset?: number;
}

interface OpportunitiesResponse {
  opportunities: Opportunity[];
  total: number;
  hasMore: boolean;
}

// GET /api/opportunities/:id
// Get detailed opportunity profile
interface Opportunity {
  id: string;
  title: string;
  description: string;
  archetype: string;
  category: string;
  validationScore: number;
  demandScore: number;
  competitionScore: number;
  feasibilityScore: number;
  monetizationScore: number;
  marketSignals: MarketSignal[];
  monetizationData: {
    pricingRange: string;
    marketSize: string;
    timeline: string;
  };
  technicalRequirements: {
    complexity: string;
    skills: string[];
    tools: string[];
    timeline: string;
  };
  goToMarket: GoToMarketStrategy;
  createdAt: string;
  updatedAt: string;
}

// POST /api/opportunities/extract
// Extract opportunities from user input
interface ExtractRequest {
  input: string;
  context?: {
    skills?: string[];
    interests?: string[];
    timeAvailable?: number;
    budget?: number;
  };
}

interface ExtractResponse {
  extractedConcepts: string[];
  archetypeMatches: {
    archetype: string;
    confidence: number;
    opportunities: Opportunity[];
  }[];
}
```

### AI Assistant API

```typescript
// POST /api/ai/chat
// Send message to AI Build Assistant
interface ChatRequest {
  message: string;
  conversationId?: string;
  context?: {
    currentBuild?: string;
    skillLevel?: 'beginner' | 'intermediate' | 'advanced';
    selectedArchetype?: string;
  };
}

interface ChatResponse {
  message: string;
  conversationId: string;
  suggestedActions?: string[];
  codeBlocks?: {
    language: string;
    code: string;
  }[];
}

// POST /api/ai/generate-roadmap
// Generate build roadmap
interface RoadmapRequest {
  templateId: string;
  userSkills: string[];
  timeAvailable: number; // hours per week
}

interface RoadmapResponse {
  roadmap: {
    phase: string;
    duration: string;
    tasks: {
      title: string;
      description: string;
      estimatedHours: number;
      aiPrompts?: string[];
    }[];
  }[];
  totalDuration: string;
  milestones: string[];
}
```

### Revenue Tracking API

```typescript
// POST /api/revenue
// Record revenue
interface RevenueRequest {
  source: string;
  amount: number;
  currency?: string;
  description?: string;
  date?: string;
}

interface RevenueResponse {
  id: string;
  recorded: boolean;
  newMilestone?: {
    tier: string;
    badge: string;
    reward: number; // FoundryCoins
  };
}

// GET /api/revenue
// Get revenue history
interface RevenueHistoryResponse {
  revenue: {
    id: string;
    source: string;
    amount: number;
    currency: string;
    description: string;
    recordedAt: string;
  }[];
  summary: {
    totalRevenue: number;
    totalThisMonth: number;
    totalThisYear: number;
    bySource: Record<string, number>;
  };
  milestones: {
    next: string;
    progress: number;
    estimatedDate: string;
  };
}
```

---

## AI Integration

### AI Router Implementation

```typescript
// src/lib/ai/ai-router.ts

import { createClient } from '@supabase/supabase-js';
import Redis from 'ioredis';

interface AIProvider {
  name: string;
  baseUrl: string;
  apiKey: string;
  models: string[];
  priority: number;
  timeout: number;
}

interface AIResponse {
  content: string;
  provider: string;
  model: string;
  latency: number;
}

class AIRouter {
  private providers: AIProvider[];
  private redis: Redis;
  private circuitBreaker: Map<string, { failures: number; lastFailure: number }>;

  constructor() {
    this.providers = [
      {
        name: 'groq',
        baseUrl: 'https://api.groq.com/openai/v1',
        apiKey: process.env.GROQ_API_KEY!,
        models: ['mixtral-8x7b-32768', 'llama3-70b-8192'],
        priority: 1,
        timeout: 10000
      },
      {
        name: 'openrouter',
        baseUrl: 'https://openrouter.ai/api/v1',
        apiKey: process.env.OPENROUTER_API_KEY!,
        models: ['meta-llama/llama-3-70b', 'anthropic/claude-3-opus'],
        priority: 2,
        timeout: 15000
      }
    ];
    
    this.redis = new Redis(process.env.REDIS_URL);
    this.circuitBreaker = new Map();
  }

  async generate(prompt: string, options: {
    temperature?: number;
    maxTokens?: number;
    model?: string;
  } = {}): Promise<AIResponse> {
    // Check cache first
    const cacheKey = this.hashPrompt(prompt);
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // Try providers in priority order
    for (const provider of this.getHealthyProviders()) {
      try {
        const response = await this.callProvider(provider, prompt, options);
        
        // Cache successful response
        await this.redis.setex(cacheKey, 3600, JSON.stringify(response));
        
        return response;
      } catch (error) {
        this.recordFailure(provider.name);
        continue;
      }
    }

    throw new Error('All AI providers failed');
  }

  private async callProvider(
    provider: AIProvider,
    prompt: string,
    options: any
  ): Promise<AIResponse> {
    const startTime = Date.now();
    
    const response = await fetch(`${provider.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${provider.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: options.model || provider.models[0],
        messages: [{ role: 'user', content: prompt }],
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 2000
      }),
      signal: AbortSignal.timeout(provider.timeout)
    });

    if (!response.ok) {
      throw new Error(`Provider ${provider.name} failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      content: data.choices[0].message.content,
      provider: provider.name,
      model: data.model,
      latency: Date.now() - startTime
    };
  }

  private getHealthyProviders(): AIProvider[] {
    return this.providers
      .filter(p => {
        const state = this.circuitBreaker.get(p.name);
        if (!state) return true;
        
        // Circuit breaker: 5 failures in 1 minute = open circuit
        const oneMinuteAgo = Date.now() - 60000;
        return state.failures < 5 || state.lastFailure < oneMinuteAgo;
      })
      .sort((a, b) => a.priority - b.priority);
  }

  private recordFailure(providerName: string) {
    const state = this.circuitBreaker.get(providerName) || { failures: 0, lastFailure: 0 };
    state.failures++;
    state.lastFailure = Date.now();
    this.circuitBreaker.set(providerName, state);
  }

  private hashPrompt(prompt: string): string {
    // Simple hash for cache key
    return Buffer.from(prompt).toString('base64').slice(0, 32);
  }
}

export const aiRouter = new AIRouter();
```

### Prompt Templates

```typescript
// src/lib/ai/prompts/index.ts

export const PROMPTS = {
  buildAssistant: (context: {
    projectType: string;
    skillLevel: string;
    timeAvailable: string;
    archetype: string;
    currentStage: string;
    taskDescription: string;
  }) => `You are an expert software architect and developer helping a ${context.skillLevel} build their first ${context.projectType}.

User Context:
- Skill Level: ${context.skillLevel}
- Time Available: ${context.timeAvailable} hours/week
- Archetype: ${context.archetype}
- Current Stage: ${context.currentStage}

Current Task: ${context.taskDescription}

Provide:
1. Step-by-step instructions (numbered)
2. Code examples where relevant
3. Explanations of WHY (not just HOW)
4. Common pitfalls to avoid
5. Next steps after completion

Keep response actionable. Avoid theory without practical application.`,

  opportunityValidation: (context: {
    title: string;
    description: string;
    archetype: string;
  }) => `Analyze this business opportunity for validation scoring:

Opportunity: ${context.title}
Description: ${context.description}
Archetype: ${context.archetype}

Provide validation analysis across 4 dimensions (score 0-25 each):
1. DEMAND VALIDATION: Search trends, market signals
2. COMPETITION ANALYSIS: Competitive landscape, gaps
3. TECHNICAL FEASIBILITY: Build complexity, skills required
4. MONETIZATION POTENTIAL: Pricing power, market size

Total Score: /100
Recommendation: PROCEED / CONSIDER / REJECT

Be objective and evidence-based.`
};
```

---

## Deployment

### Vercel Deployment

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy
vercel --prod

# Or link to GitHub for automatic deployments on push
```

### Environment Variables in Production

```bash
# Add environment variables via Vercel Dashboard
# or using CLI:
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add GROQ_API_KEY
vercel env add OPENROUTER_API_KEY
```

### Build Configuration

```json
// vercel.json
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

---

## Testing

### Test Setup

```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Run tests
npm test

# Run tests in watch mode
npm test -- --watch
```

### Example Tests

```typescript
// __tests__/api/opportunities.test.ts

import { GET } from '@/app/api/opportunities/route';
import { createMocks } from 'node-mocks-http';

describe('Opportunities API', () => {
  it('returns opportunities with correct structure', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { limit: '10' }
    });

    await GET(req);

    expect(res._getStatusCode()).toBe(200);
    
    const data = JSON.parse(res._getData());
    expect(data.opportunities).toBeDefined();
    expect(data.opportunities[0]).toHaveProperty('validationScore');
  });

  it('filters by archetype', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { archetype: 'saas' }
    });

    await GET(req);

    const data = JSON.parse(res._getData());
    expect(data.opportunities.every((o: any) => o.archetype === 'saas')).toBe(true);
  });
});
```

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| `GROQ_API_KEY missing` | Add to `.env.local` and restart dev server |
| Database connection fails | Verify Supabase URL and check network |
| AI responses slow | Check provider status; fallback should activate |
| Build fails | Run `npm install` and check Node.js version |
| 401 Unauthorized | Check auth token and RLS policies |

### Getting Help

- **Discord Community:** [Join](https://discord.gg/foundryai)
- **GitHub Issues:** [Report bugs](https://github.com/Mohamed-Elgendi/FoundryAI/issues)
- **Email Support:** support@foundryai.com (Pro+ tiers)

---

## Conclusion

This implementation guide provides everything needed to set up, develop, and deploy the FoundryAI platform. For additional details, refer to the specific feature documentation in the `/docs` directory.

---

**Documentation Navigation:**
- ← Previous: [Self-Discovery & Mindset Systems](../tiers/11-self-discovery.md)
- ↑ Up: [Documentation Index](../01-platform-overview.md#documentation-index)
