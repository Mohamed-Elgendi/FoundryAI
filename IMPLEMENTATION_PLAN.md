# FoundryAI Comprehensive Implementation Plan
## Strategic Roadmap to Production-Ready Platform

---

## Executive Summary

**FoundryAI** is an AI-powered digital entrepreneurship platform with a 7-layer architecture. This implementation plan provides a strategic roadmap to resolve all technical debt, complete missing features, and achieve a production-ready state capable of serving users and generating revenue.

### Current State Assessment
- **Architecture**: 7-layer modular design (Security → AI → Data → Logic → Presentation → UX → Design System)
- **Tech Stack**: Next.js 16, React 19, TypeScript, Supabase, Stripe, Multi-provider AI SDK
- **Critical Issues**: 45+ TypeScript errors, missing components, incomplete module exports
- **Completion Level**: ~65% (Core auth working, AI router partially functional, UI incomplete)

---

## Phase 1: Foundation Stabilization (Week 1-2)
**Goal**: Resolve all TypeScript errors and establish a stable build

### 1.1 Type System Architecture Repair
**Priority**: CRITICAL | **Impact**: BLOCKING | **Effort**: 3 days

#### 1.1.1 AI Router Type Synchronization
**Location**: `src/layer-2-ai/router/ai-types.ts` + `ai-router.ts`

**Issues Identified**:
```typescript
// PROBLEM: Property name mismatches
AIResponse.content  // ❌ Used in router but doesn't exist
AIResponse.text       // ✅ Should be used

AIRequest.preferredProvider  // ❌ Doesn't exist
AIRequest.provider           // ✅ Should be used

// PROBLEM: Missing properties in AIResponse
latencyMs  // ❌ Used in router
latency    // ✅ Should be used
```

**Implementation Steps**:
1. **Audit ai-types.ts** - Add all missing properties:
   - `content?: string` (alias for backward compatibility)
   - `error?: string`
   - `rateLimitError?: boolean`
   - `quotaExceeded?: boolean`
   - `fallbackUsed?: boolean`
   - `suggestedAction?: string`

2. **Update ai-router.ts** - Fix all property references:
   - Replace `response.content` → `response.text`
   - Replace `request.preferredProvider` → `request.provider`
   - Replace `latencyMs` → `latency`

3. **Provider Configuration Type Fix**:
   - Fix `Record<AIProvider, ProviderConfig | null>` entries
   - Add missing providers: 'claude-3-5-sonnet', 'claude-3-5-haiku', 'gpt-4o', 'groq-llama-3-3', etc.

**Prevention Pattern**:
```typescript
// ALWAYS verify property names against ai-types.ts
// Use TypeScript's "Go to Definition" before using any AI property
```

---

#### 1.1.2 Missing Module Exports Resolution
**Location**: `src/layer-1-security/index.ts`, `src/layer-2-ai/index.ts`

**Issues Identified**:
```typescript
// src/layer-1-security/index.ts
export * from './permissions';   // ❌ Directory exists, no index.ts
export * from './sanitization';  // ❌ Directory exists, no index.ts
export * from './validation';    // ❌ Directory exists, no index.ts
export * from './audit';         // ❌ Directory exists, no index.ts

// src/layer-2-ai/index.ts  
export * from './providers';     // ❌ Directory exists, no index.ts
export * from './prompts';       // ⚠️ Only prompts.ts, not index.ts
export * from './context';       // ❌ Directory exists, no index.ts
export * from './cache';         // ❌ Directory exists, no index.ts
```

**Implementation Steps**:
1. Create `src/layer-1-security/permissions/index.ts`:
   ```typescript
   export * from './permission-checker';
   export * from './role-manager';
   // Add any existing permission utilities
   ```

2. Create `src/layer-1-security/sanitization/index.ts`:
   ```typescript
   export * from './input-sanitizer';
   export * from './output-encoder';
   ```

3. Create `src/layer-1-security/validation/index.ts`:
   ```typescript
   export * from './schema-validator';
   export * from './input-validator';
   ```

4. Create `src/layer-1-security/audit/index.ts`:
   ```typescript
   export * from './audit-logger';
   export * from './activity-tracker';
   ```

5. Create `src/layer-2-ai/providers/index.ts`:
   ```typescript
   export * from './provider-config';
   export * from './provider-factory';
   ```

6. Create `src/layer-2-ai/context/index.ts`:
   ```typescript
   export * from './context-builder';
   export * from './context-manager';
   ```

7. Create `src/layer-2-ai/cache/index.ts`:
   ```typescript
   export * from './cache-manager';
   export * from './redis-client';
   ```

**Verification**:
```bash
npx tsc --noEmit 2>&1 | grep "Cannot find module" | wc -l
# Should return 0
```

---

#### 1.1.3 Supabase Type System Integration
**Location**: `src/layer-3-data/storage/database.types.ts`, `base-repository.ts`, `webhook/route.ts`

**Issues Identified**:
```typescript
// base-repository.ts - Symbol to string conversion
.filter('id', 'eq', id)  // ❌ id can be symbol

// webhook/route.ts - Missing table types
.from('users').update({...})  // ❌ 'users' table not in Database type
```

**Implementation Steps**:
1. **Complete Database Type Definition**:
   ```typescript
   // Add to database.types.ts
   export interface Database {
     public: {
       Tables: {
         users: {
           Row: {
             id: string;
             email: string;
             name?: string;
             subscription_tier: string | null;
             subscription_status: string | null;
             stripe_customer_id: string | null;
             subscription_period_start: string | null;
             subscription_period_end: string | null;
             created_at: string;
             updated_at: string;
           };
           Insert: {
             id?: string;
             email: string;
             name?: string;
             subscription_tier?: string | null;
             subscription_status?: string | null;
             stripe_customer_id?: string | null;
             // ...
           };
           Update: {
             email?: string;
             name?: string;
             subscription_tier?: string | null;
             subscription_status?: string | null;
             // ...
           };
         };
         plans: {
           // ... define plan table schema
         };
         opportunities: {
           // ... define opportunities table schema
         };
       };
     };
   }
   ```

2. **Fix base-repository.ts Symbol Issue**:
   ```typescript
   // Wrap symbol conversion
   .filter('id', 'eq', String(id))  // ✅ Convert symbol to string
   ```

3. **Repository Generic Type Fix**:
   ```typescript
   // Constrain T[key] to string for table names
   class BaseRepository<T extends Record<string, any>> {
     constructor(
       private tableName: string,  // ✅ Explicit string type
       // ...
     ) {}
   }
   ```

---

### 1.2 Dashboard Component Architecture
**Priority**: HIGH | **Impact**: USER EXPERIENCE | **Effort**: 2 days

#### 1.2.1 Dashboard Shell Implementation
**Location**: `src/lib/layers/frontend-layer.tsx` (exists) + `src/app/dashboard/page.tsx`

**Issues Identified**:
```typescript
// dashboard/page.tsx
<DashboardProvider>  // ❌ Not imported
<DashboardShell>     // ❌ Not imported
```

**Implementation Steps**:
1. **Verify frontend-layer.tsx exports**:
   ```typescript
   // Check if these exist in frontend-layer.tsx
   export function DashboardProvider({ children }: { children: React.ReactNode }) { ... }
   export function DashboardShell({ user, onSignOut, children }: DashboardShellProps) { ... }
   ```

2. **Create Missing Components** (if not in frontend-layer.tsx):
   ```typescript
   // src/components/dashboard/DashboardProvider.tsx
   'use client';
   import { createContext, useContext, ReactNode } from 'react';
   
   interface DashboardContextType {
     isLoading: boolean;
     refreshData: () => void;
   }
   
   const DashboardContext = createContext<DashboardContextType | null>(null);
   
   export function DashboardProvider({ children }: { children: ReactNode }) {
     // Implementation
   }
   
   export function useDashboard() {
     const context = useContext(DashboardContext);
     if (!context) throw new Error('useDashboard must be used within DashboardProvider');
     return context;
   }
   ```

3. **Create DashboardShell Component**:
   ```typescript
   // src/components/dashboard/DashboardShell.tsx
   'use client';
   import { ReactNode } from 'react';
   import { Sidebar } from './Sidebar';
   import { Header } from './Header';
   
   interface DashboardShellProps {
     user?: { name: string; email: string; role: string };
     onSignOut: () => void;
     children: ReactNode;
   }
   
   export function DashboardShell({ user, onSignOut, children }: DashboardShellProps) {
     return (
       <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
         <Sidebar user={user} onSignOut={onSignOut} />
         <div className="flex-1 flex flex-col overflow-hidden">
           <Header user={user} />
           <main className="flex-1 overflow-y-auto p-6">
             {children}
           </main>
         </div>
       </div>
     );
   }
   ```

4. **Update dashboard/page.tsx imports**:
   ```typescript
   // Replace commented import
   import { DashboardProvider, DashboardShell } from '@/components/dashboard';
   // OR if in lib/layers:
   import { DashboardProvider, DashboardShell } from '@/lib/layers/frontend-layer';
   ```

---

### 1.3 Settings & Plans Page Type Fixes
**Priority**: HIGH | **Impact**: USER FUNCTIONALITY | **Effort**: 1 day

#### 1.3.1 Settings Page Type Resolution
**Location**: `src/app/settings/page.tsx`

**Issues Identified**:
```typescript
// Line 90-92: Type 'never' errors
profile.subscription_tier   // ❌ Property doesn't exist on 'never'
profile.subscription_status // ❌ Property doesn't exist on 'never'
profile.created_at          // ❌ Property doesn't exist on 'never'
```

**Implementation Steps**:
1. **Define Proper Profile Type**:
   ```typescript
   interface UserProfile {
     id: string;
     email: string;
     name?: string;
     subscription_tier: string | null;
     subscription_status: string | null;
     stripe_customer_id: string | null;
     created_at: string;
     updated_at: string;
   }
   ```

2. **Fix useState Hook**:
   ```typescript
   // Replace
   const [profile, setProfile] = useState(null);  // ❌ Inferred as 'never'
   
   // With
   const [profile, setProfile] = useState<UserProfile | null>(null);  // ✅
   ```

#### 1.3.2 Plans Page Type Fix
**Location**: `src/app/plans/page.tsx`

**Issues Identified**:
```typescript
// Line 75, 118: Type 'undefined' not assignable to '{}'
someFunction(planId)  // ❌ planId can be undefined
```

**Implementation Steps**:
1. **Add Null Checks**:
   ```typescript
   // Before calling function
   if (!planId) {
     setError('Plan ID is required');
     return;
   }
   someFunction(planId);  // ✅ Now string, not undefined
   ```

2. **Or Use Type Assertion** (if null is handled internally):
   ```typescript
   someFunction(planId as string);  // ✅ Force type
   ```

---

## Phase 2: Core Feature Implementation (Week 3-4)
**Goal**: Complete all essential user-facing features

### 2.1 Business Plan Generator Module
**Priority**: CRITICAL | **Impact**: CORE FEATURE | **Effort**: 5 days

#### 2.1.1 Plan Generator Architecture
**Location**: `src/modules/plan-generator/`

**Current Structure**:
```
plan-generator/
├── components/
│   ├── PlanGenerator.tsx
│   ├── PlanOutput.tsx
│   └── TemplateGallery.tsx
├── hooks/
│   └── usePlanGeneration.ts
├── types/
│   └── plan-types.ts
└── index.ts
```

**Implementation Steps**:

1. **Complete Plan Types Definition**:
   ```typescript
   // types/plan-types.ts
   export interface PlanInput {
     businessIdea: string;
     targetMarket?: string;
     budget?: number;
     timeline?: 'short-term' | 'medium-term' | 'long-term';
     archetype: BusinessArchetype;
   }
   
   export interface PlanOutput {
     id: string;
     title: string;
     sections: PlanSection[];
     opportunities: Opportunity[];
     actionItems: ActionItem[];
     metadata: {
       createdAt: string;
       aiProvider: string;
       version: string;
     };
   }
   
   export interface PlanSection {
     title: string;
     content: string;
     subsections?: SubSection[];
   }
   ```

2. **Implement usePlanGeneration Hook**:
   ```typescript
   // hooks/usePlanGeneration.ts
   'use client';
   import { useState, useCallback } from 'react';
   import { useAI } from '@/layer-2-ai/hooks/useAI';
   
   export function usePlanGeneration() {
     const [isGenerating, setIsGenerating] = useState(false);
     const [progress, setProgress] = useState(0);
     const { generateText, error } = useAI();
     
     const generatePlan = useCallback(async (input: PlanInput): Promise<PlanOutput> => {
       setIsGenerating(true);
       setProgress(0);
       
       try {
         // Step 1: Generate business model canvas (0-20%)
         setProgress(10);
         const canvas = await generateCanvas(input);
         
         // Step 2: Generate market analysis (20-40%)
         setProgress(30);
         const marketAnalysis = await generateMarketAnalysis(input, canvas);
         
         // Step 3: Generate go-to-market strategy (40-60%)
         setProgress(50);
         const gtmStrategy = await generateGTMStrategy(input, canvas, marketAnalysis);
         
         // Step 4: Generate financial projections (60-80%)
         setProgress(70);
         const financials = await generateFinancials(input, canvas, marketAnalysis);
         
         // Step 5: Compile and save (80-100%)
         setProgress(90);
         const plan = await compilePlan(input, canvas, marketAnalysis, gtmStrategy, financials);
         
         setProgress(100);
         return plan;
       } finally {
         setIsGenerating(false);
       }
     }, [generateText]);
     
     return { generatePlan, isGenerating, progress, error };
   }
   ```

3. **Complete PlanGenerator Component**:
   ```typescript
   // components/PlanGenerator.tsx
   'use client';
   import { useState } from 'react';
   import { usePlanGeneration } from '../hooks/usePlanGeneration';
   import { PlanInput } from '../types/plan-types';
   
   export function PlanGenerator() {
     const [input, setInput] = useState<PlanInput>({
       businessIdea: '',
       archetype: 'ai-agency'
     });
     const { generatePlan, isGenerating, progress, error } = usePlanGeneration();
     
     const handleSubmit = async (e: React.FormEvent) => {
       e.preventDefault();
       const plan = await generatePlan(input);
       // Handle plan result
     };
     
     return (
       <div className="max-w-4xl mx-auto p-6">
         <form onSubmit={handleSubmit}>
           {/* Business Idea Input */}
           <textarea
             value={input.businessIdea}
             onChange={(e) => setInput({ ...input, businessIdea: e.target.value })}
             placeholder="Describe your business idea..."
             className="w-full p-4 border rounded-lg"
           />
           
           {/* Archetype Selector */}
           <ArchetypeSelector
             value={input.archetype}
             onChange={(archetype) => setInput({ ...input, archetype })}
           />
           
           {/* Generate Button */}
           <button
             type="submit"
             disabled={isGenerating}
             className="w-full py-3 bg-violet-600 text-white rounded-lg"
           >
             {isGenerating ? `Generating... ${progress}%` : 'Generate Business Plan'}
           </button>
         </form>
         
         {error && <ErrorDisplay error={error} />}
       </div>
     );
   }
   ```

---

#### 2.1.2 AI Integration Layer
**Location**: `src/layer-2-ai/hooks/useAI.ts`

**Implementation**:
```typescript
// hooks/useAI.ts
'use client';
import { useCallback, useState } from 'react';
import { AIProvider, generateWithRouter } from '../router/ai-router';

interface UseAIOptions {
  preferredProvider?: AIProvider;
  enableFallback?: boolean;
}

export function useAI(options: UseAIOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const generateText = useCallback(async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await generateWithRouter({
        prompt,
        provider: options.preferredProvider,
        enableFallback: options.enableFallback ?? true
      });
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      return response.text || '';
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [options.preferredProvider, options.enableFallback]);
  
  return { generateText, isLoading, error };
}
```

---

### 2.2 Opportunity Radar System
**Priority**: HIGH | **Impact**: UNIQUE VALUE PROPOSITION | **Effort**: 4 days

#### 2.2.1 Radar Service Architecture
**Location**: `radar-service/`

**Implementation**:
```typescript
// radar-service/opportunity-scanner.ts
import { OpenAI } from 'openai';
import { z } from 'zod';

const OpportunitySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.enum(['trending', 'emerging', 'underserved', 'seasonal']),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  potentialRevenue: z.object({
    min: z.number(),
    max: z.number(),
    timeframe: z.string()
  }),
  requiredSkills: z.array(z.string()),
  startupCost: z.number(),
  timeToFirstRevenue: z.string(),
  source: z.string(),
  confidence: z.number().min(0).max(1)
});

export type Opportunity = z.infer<typeof OpportunitySchema>;

export class OpportunityScanner {
  private openai: OpenAI;
  
  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  
  async scanForOpportunities(criteria: {
    archetype?: string;
    budget?: number;
    skills?: string[];
  }): Promise<Opportunity[]> {
    // Implementation: Scan multiple data sources
    // 1. Google Trends API
    // 2. Reddit discussions
    // 3. Product Hunt
    // 4. Job boards (Fiverr, Upwork)
    // 5. AI analysis of market gaps
    
    const prompt = `
      Analyze current market trends and identify 5 specific, actionable 
      business opportunities for a ${criteria.archetype || 'digital entrepreneur'} 
      with ${criteria.budget ? `$${criteria.budget} budget` : 'minimal budget'}.
      
      Return opportunities that are:
      - Verified by current market data
      - Specific (not generic like "start a blog")
      - Actionable within 30 days
      - Include realistic revenue potential
    `;
    
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    });
    
    const opportunities = JSON.parse(response.choices[0].message.content || '{}');
    return opportunities.opportunities.map((opp: any) => OpportunitySchema.parse(opp));
  }
}
```

#### 2.2.2 Radar API Route
**Location**: `src/app/api/radar/route.ts`

**Implementation**:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { OpportunityScanner } from '@/radar-service/opportunity-scanner';
import { requireAuth } from '@/layer-1-security/middleware/auth-middleware';

export async function GET(req: NextRequest) {
  try {
    // Authenticate user
    const user = await requireAuth(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const archetype = searchParams.get('archetype') || undefined;
    const budget = searchParams.get('budget') ? parseInt(searchParams.get('budget')!) : undefined;
    
    // Scan for opportunities
    const scanner = new OpportunityScanner();
    const opportunities = await scanner.scanForOpportunities({
      archetype,
      budget
    });
    
    return NextResponse.json({ opportunities });
  } catch (error) {
    console.error('Radar scan error:', error);
    return NextResponse.json(
      { error: 'Failed to scan for opportunities' },
      { status: 500 }
    );
  }
}
```

---

### 2.3 Payment & Subscription System
**Priority**: CRITICAL | **Impact**: REVENUE | **Effort**: 3 days

#### 2.3.1 Stripe Integration Completion
**Location**: `src/app/api/stripe/`

**Implementation Steps**:

1. **Create Checkout Session Route**:
   ```typescript
   // src/app/api/stripe/checkout/route.ts
   import { NextRequest, NextResponse } from 'next/server';
   import Stripe from 'stripe';
   import { createSupabaseServiceClient } from '@/layer-3-data/storage/supabase-client';
   
   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
     apiVersion: '2024-12-18.acacia'
   });
   
   export async function POST(req: NextRequest) {
     try {
       const { priceId, userId } = await req.json();
       
       // Get user from Supabase
       const supabase = createSupabaseServiceClient();
       const { data: user } = await supabase
         .from('users')
         .select('email, stripe_customer_id')
         .eq('id', userId)
         .single();
       
       // Create or retrieve customer
       let customerId = user?.stripe_customer_id;
       if (!customerId) {
         const customer = await stripe.customers.create({
           email: user?.email,
           metadata: { userId }
         });
         customerId = customer.id;
         
         // Save customer ID to user record
         await supabase
           .from('users')
           .update({ stripe_customer_id: customerId })
           .eq('id', userId);
       }
       
       // Create checkout session
       const session = await stripe.checkout.sessions.create({
         customer: customerId,
         line_items: [{ price: priceId, quantity: 1 }],
         mode: 'subscription',
         success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?success=true`,
         cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
         metadata: { userId, tier: priceId.includes('pro') ? 'pro' : 'starter' }
       });
       
       return NextResponse.json({ sessionId: session.id, url: session.url });
     } catch (error) {
       console.error('Checkout error:', error);
       return NextResponse.json(
         { error: 'Failed to create checkout session' },
         { status: 500 }
       );
     }
   }
   ```

2. **Create Customer Portal Route**:
   ```typescript
   // src/app/api/stripe/portal/route.ts
   import { NextRequest, NextResponse } from 'next/server';
   import Stripe from 'stripe';
   import { createSupabaseServiceClient } from '@/layer-3-data/storage/supabase-client';
   
   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
     apiVersion: '2024-12-18.acacia'
   });
   
   export async function POST(req: NextRequest) {
     try {
       const { userId } = await req.json();
       
       const supabase = createSupabaseServiceClient();
       const { data: user } = await supabase
         .from('users')
         .select('stripe_customer_id')
         .eq('id', userId)
         .single();
       
       if (!user?.stripe_customer_id) {
         return NextResponse.json(
           { error: 'No subscription found' },
           { status: 400 }
         );
       }
       
       // Create portal session
       const portalSession = await stripe.billingPortal.sessions.create({
         customer: user.stripe_customer_id,
         return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`
       });
       
       return NextResponse.json({ url: portalSession.url });
     } catch (error) {
       console.error('Portal error:', error);
       return NextResponse.json(
         { error: 'Failed to create portal session' },
         { status: 500 }
       );
     }
   }
   ```

---

## Phase 3: AI Engine Enhancement (Week 5-6)
**Goal**: Optimize AI performance, add multi-provider support, implement caching

### 3.1 Multi-Provider AI Architecture
**Priority**: HIGH | **Impact**: PERFORMANCE | **Effort**: 4 days

#### 3.1.1 Provider Configuration System
**Location**: `src/layer-2-ai/providers/`

**Implementation**:
```typescript
// providers/provider-config.ts
export interface ProviderConfig {
  id: AIProvider;
  name: string;
  description: string;
  models: ModelConfig[];
  capabilities: ProviderCapability[];
  pricing: PricingConfig;
  rateLimits: RateLimitConfig;
}

interface ModelConfig {
  id: string;
  name: string;
  contextWindow: number;
  maxTokens: number;
  supportsStreaming: boolean;
  supportsVision: boolean;
  supportsTools: boolean;
}

export const PROVIDER_CONFIGS: Record<AIProvider, ProviderConfig> = {
  'claude-3-5-sonnet': {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    description: 'Most intelligent model for complex tasks',
    models: [{
      id: 'claude-3-5-sonnet-20241022',
      name: 'Claude 3.5 Sonnet',
      contextWindow: 200000,
      maxTokens: 8192,
      supportsStreaming: true,
      supportsVision: true,
      supportsTools: true
    }],
    capabilities: ['reasoning', 'coding', 'analysis', 'writing'],
    pricing: { inputPer1M: 3.0, outputPer1M: 15.0 },
    rateLimits: { requestsPerMinute: 50, tokensPerMinute: 40000 }
  },
  // ... other providers
};
```

#### 3.1.2 Smart Router with Fallback
**Location**: `src/layer-2-ai/router/ai-router.ts`

**Enhanced Implementation**:
```typescript
// Smart routing algorithm
export async function routeToProvider(request: AIRequest): Promise<AIResponse> {
  const { prompt, provider, enableFallback = true, priority = 'balanced' } = request;
  
  // Step 1: Determine provider priority queue
  const providerQueue = provider 
    ? [provider, ...getFallbackProviders(provider)]
    : getOptimalProviders(prompt, priority);
  
  // Step 2: Try providers in order
  for (const providerId of providerQueue) {
    try {
      // Check rate limits
      if (await isRateLimited(providerId)) {
        continue;
      }
      
      // Attempt generation
      const response = await generateWithProvider(providerId, prompt);
      
      // Log successful routing
      await logRoutingDecision(request, providerId, 'success');
      
      return {
        ...response,
        provider: providerId,
        fallbackUsed: providerId !== provider
      };
    } catch (error) {
      // Log failure and continue to next provider
      await logRoutingDecision(request, providerId, 'failed', error);
      
      if (!enableFallback) {
        throw error;
      }
    }
  }
  
  // All providers failed
  throw new Error('All AI providers unavailable');
}

function getFallbackProviders(primary: AIProvider): AIProvider[] {
  const fallbackMap: Record<AIProvider, AIProvider[]> = {
    'claude-3-5-sonnet': ['claude-3-5-haiku', 'gpt-4o', 'groq-llama-3-3'],
    'claude-3-5-haiku': ['gpt-4o-mini', 'groq-llama-3-3', 'mistral-small'],
    'gpt-4o': ['claude-3-5-sonnet', 'groq-llama-3-3', 'gemini-2-flash'],
    // ... complete mapping
  };
  
  return fallbackMap[primary] || ['groq-llama-3-3', 'mistral-small'];
}
```

---

### 3.2 Caching Layer
**Priority**: MEDIUM | **Impact**: COST REDUCTION | **Effort**: 2 days

#### 3.2.1 Semantic Caching System
**Location**: `src/layer-2-ai/cache/`

**Implementation**:
```typescript
// cache/cache-manager.ts
import { createHash } from 'crypto';
import { SupabaseClient } from '@supabase/supabase-js';

interface CacheEntry {
  id: string;
  promptHash: string;
  promptEmbedding: number[];
  response: string;
  provider: string;
  model: string;
  createdAt: string;
  accessCount: number;
  lastAccessed: string;
}

export class AICacheManager {
  private supabase: SupabaseClient;
  private similarityThreshold = 0.95;
  
  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }
  
  async getCachedResponse(prompt: string): Promise<string | null> {
    const promptHash = this.hashPrompt(prompt);
    
    // Try exact match first
    const { data: exactMatch } = await this.supabase
      .from('ai_response_cache')
      .select('*')
      .eq('prompt_hash', promptHash)
      .single();
    
    if (exactMatch) {
      await this.updateAccessStats(exactMatch.id);
      return exactMatch.response;
    }
    
    // Try semantic similarity (if embedding service available)
    const embedding = await this.generateEmbedding(prompt);
    const { data: similarMatches } = await this.supabase.rpc('find_similar_prompts', {
      query_embedding: embedding,
      similarity_threshold: this.similarityThreshold
    });
    
    if (similarMatches && similarMatches.length > 0) {
      await this.updateAccessStats(similarMatches[0].id);
      return similarMatches[0].response;
    }
    
    return null;
  }
  
  async cacheResponse(
    prompt: string, 
    response: string, 
    provider: string, 
    model: string
  ): Promise<void> {
    const promptHash = this.hashPrompt(prompt);
    const embedding = await this.generateEmbedding(prompt);
    
    await this.supabase
      .from('ai_response_cache')
      .upsert({
        prompt_hash: promptHash,
        prompt_embedding: embedding,
        response,
        provider,
        model,
        created_at: new Date().toISOString(),
        access_count: 1,
        last_accessed: new Date().toISOString()
      });
  }
  
  private hashPrompt(prompt: string): string {
    return createHash('sha256').update(prompt).digest('hex');
  }
  
  private async generateEmbedding(text: string): Promise<number[]> {
    // Use OpenAI's embedding API
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: text
      })
    });
    
    const data = await response.json();
    return data.data[0].embedding;
  }
  
  private async updateAccessStats(cacheId: string): Promise<void> {
    await this.supabase
      .from('ai_response_cache')
      .update({
        access_count: sql`access_count + 1`,
        last_accessed: new Date().toISOString()
      })
      .eq('id', cacheId);
  }
}
```

---

## Phase 4: Data Layer & Persistence (Week 6-7)
**Goal**: Complete database schema, implement repositories, add real-time features

### 4.1 Database Schema Completion
**Priority**: HIGH | **Impact**: DATA INTEGRITY | **Effort**: 3 days

#### 4.1.1 Core Tables Implementation
**Location**: `supabase/migrations/`

**Migration Files**:
```sql
-- 001_create_users_table.sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  avatar_url TEXT,
  
  -- Subscription fields
  subscription_tier VARCHAR(50) DEFAULT 'free',
  subscription_status VARCHAR(50) DEFAULT 'inactive',
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  subscription_period_start TIMESTAMP WITH TIME ZONE,
  subscription_period_end TIMESTAMP WITH TIME ZONE,
  
  -- User preferences
  preferred_archetype VARCHAR(100),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 002_create_plans_table.sql
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Plan content
  title VARCHAR(500) NOT NULL,
  business_idea TEXT NOT NULL,
  archetype VARCHAR(100) NOT NULL,
  
  -- Structured data
  canvas JSONB,
  market_analysis JSONB,
  gtm_strategy JSONB,
  financial_projections JSONB,
  action_items JSONB,
  
  -- Metadata
  ai_provider VARCHAR(100),
  generation_time_ms INTEGER,
  version VARCHAR(20) DEFAULT '1.0',
  
  -- Status
  status VARCHAR(50) DEFAULT 'draft',
  is_favorite BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 003_create_opportunities_table.sql
CREATE TABLE opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  difficulty VARCHAR(50) NOT NULL,
  
  -- Metrics
  potential_revenue_min INTEGER,
  potential_revenue_max INTEGER,
  revenue_timeframe VARCHAR(100),
  startup_cost INTEGER,
  time_to_first_revenue VARCHAR(100),
  
  -- Details
  required_skills TEXT[],
  source VARCHAR(255),
  source_url TEXT,
  confidence_score DECIMAL(3,2),
  
  -- User interaction
  views INTEGER DEFAULT 0,
  saves INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- 004_create_user_opportunities_table.sql
CREATE TABLE user_opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'saved', -- saved, in_progress, completed, dismissed
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, opportunity_id)
);

-- 005_create_cache_table.sql
CREATE TABLE ai_response_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prompt_hash VARCHAR(64) UNIQUE NOT NULL,
  prompt_embedding VECTOR(1536), -- Requires pgvector extension
  response TEXT NOT NULL,
  provider VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  access_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_plans_user_id ON plans(user_id);
CREATE INDEX idx_plans_status ON plans(status);
CREATE INDEX idx_plans_created_at ON plans(created_at DESC);
CREATE INDEX idx_opportunities_category ON opportunities(category);
CREATE INDEX idx_opportunities_difficulty ON opportunities(difficulty);
CREATE INDEX idx_cache_hash ON ai_response_cache(prompt_hash);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_opportunities ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own data" ON users
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can manage own plans" ON plans
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view opportunities" ON opportunities
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own saved opportunities" ON user_opportunities
  FOR ALL USING (auth.uid() = user_id);
```

---

#### 4.1.2 Repository Pattern Implementation
**Location**: `src/layer-3-data/repositories/`

**Base Repository**:
```typescript
// repositories/base-repository.ts
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../storage/database.types';

export interface RepositoryOptions {
  softDelete?: boolean;
}

export abstract class BaseRepository<T extends { id: string }, K extends keyof Database['public']['Tables']> {
  protected tableName: K;
  protected supabase: SupabaseClient<Database>;
  protected options: RepositoryOptions;
  
  constructor(
    supabase: SupabaseClient<Database>,
    tableName: K,
    options: RepositoryOptions = {}
  ) {
    this.supabase = supabase;
    this.tableName = tableName;
    this.options = { softDelete: true, ...options };
  }
  
  async findById(id: string): Promise<T | null> {
    const { data, error } = await this.supabase
      .from(this.tableName as string)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as T;
  }
  
  async findAll(options?: {
    limit?: number;
    offset?: number;
    orderBy?: keyof T;
    orderDirection?: 'asc' | 'desc';
  }): Promise<T[]> {
    let query = this.supabase
      .from(this.tableName as string)
      .select('*');
    
    if (options?.orderBy) {
      query = query.order(options.orderBy as string, {
        ascending: options.orderDirection === 'asc'
      });
    }
    
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data as T[];
  }
  
  async create(data: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<T> {
    const { data: result, error } = await this.supabase
      .from(this.tableName as string)
      .insert({
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return result as T;
  }
  
  async update(id: string, data: Partial<T>): Promise<T> {
    const { data: result, error } = await this.supabase
      .from(this.tableName as string)
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return result as T;
  }
  
  async delete(id: string): Promise<void> {
    if (this.options.softDelete) {
      await this.update(id, { deleted_at: new Date().toISOString() } as any);
    } else {
      const { error } = await this.supabase
        .from(this.tableName as string)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    }
  }
}
```

---

## Phase 5: UI/UX Polish (Week 7-8)
**Goal**: Complete all UI components, implement design system, add animations

### 5.1 Component Library Completion
**Priority**: MEDIUM | **Impact**: USER EXPERIENCE | **Effort**: 4 days

#### 5.1.1 Core UI Components
**Location**: `src/components/ui/`

**Component Checklist**:
- [ ] Button (variants: primary, secondary, ghost, danger, loading)
- [ ] Input (with validation states)
- [ ] Select/Dropdown
- [ ] Card (with hover effects)
- [ ] Modal/Dialog
- [ ] Toast notifications
- [ ] Skeleton loaders
- [ ] Empty states
- [ ] Error boundaries
- [ ] Loading spinners

**Implementation Example - Button**:
```typescript
// components/ui/Button.tsx
import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-violet-600 text-white hover:bg-violet-700 focus-visible:ring-violet-500',
        secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:ring-slate-500',
        ghost: 'hover:bg-slate-100 text-slate-700',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
        outline: 'border border-slate-300 bg-transparent hover:bg-slate-50'
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-lg'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, leftIcon, rightIcon, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

---

### 5.2 Animation System
**Priority**: LOW | **Impact**: POLISH | **Effort**: 2 days

**Implementation**:
```typescript
// lib/animations.ts
import { motion } from 'framer-motion';

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const scaleOnHover = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 }
};

// Usage in components
export const AnimatedCard = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    variants={fadeInUp}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.3 }}
    className="bg-white rounded-xl shadow-lg p-6"
  >
    {children}
  </motion.div>
);
```

---

## Phase 6: Testing & Quality Assurance (Week 8-9)
**Goal**: Achieve 80%+ test coverage, implement CI/CD, security audit

### 6.1 Testing Strategy
**Priority**: HIGH | **Impact**: RELIABILITY | **Effort**: 3 days

#### 6.1.1 Test Structure
```
tests/
├── unit/
│   ├── components/
│   ├── hooks/
│   └── utils/
├── integration/
│   ├── api/
│   ├── auth/
│   └── database/
├── e2e/
│   ├── onboarding/
│   ├── plan-generation/
│   └── payments/
└── fixtures/
```

#### 6.1.2 Critical Test Cases
1. **Authentication Flows**:
   - Sign up with email/password
   - OAuth (Google, GitHub)
   - Password reset
   - Session management
   - Protected route access

2. **Plan Generation**:
   - Input validation
   - AI response handling
   - Error states
   - Progress tracking
   - Plan saving/retrieval

3. **Payment Flows**:
   - Subscription creation
   - Plan upgrades/downgrades
   - Cancellation
   - Webhook handling
   - Graceful degradation

---

### 6.2 CI/CD Pipeline
**Priority**: HIGH | **Impact**: DEPLOYMENT | **Effort**: 2 days

**.github/workflows/ci.yml**:
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run type check
        run: npx tsc --noEmit
      
      - name: Run linter
        run: npm run lint
      
      - name: Run tests
        run: npm test -- --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}

  deploy:
    needs: [test, build]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Vercel
        uses: vercel/action-deploy@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## Phase 7: Launch Preparation (Week 9-10)
**Goal**: Production deployment, monitoring, documentation

### 7.1 Production Checklist
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Stripe webhooks configured
- [ ] Supabase RLS policies active
- [ ] Error tracking (Sentry) enabled
- [ ] Analytics (PostHog/Amplitude) configured
- [ ] SEO meta tags complete
- [ ] Performance optimized (Lighthouse 90+)
- [ ] Accessibility audit passed
- [ ] Security headers configured

### 7.2 Monitoring & Observability
```typescript
// lib/monitoring.ts
import * as Sentry from '@sentry/nextjs';

export function initMonitoring() {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false
      })
    ]
  });
}

// Custom error tracking
export function trackError(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, {
    extra: context
  });
}

export function trackEvent(event: string, properties?: Record<string, any>) {
  // Send to analytics
  if (window.analytics) {
    window.analytics.track(event, properties);
  }
}
```

---

## Implementation Priority Matrix

| Phase | Priority | Effort | Impact | Dependencies |
|-------|----------|--------|--------|--------------|
| **1.1.1** AI Router Types | CRITICAL | 2 days | BLOCKING | None |
| **1.1.2** Module Exports | CRITICAL | 1 day | BLOCKING | None |
| **1.1.3** Supabase Types | CRITICAL | 2 days | BLOCKING | None |
| **1.2** Dashboard Components | HIGH | 2 days | UX | 1.1.x |
| **2.1** Plan Generator | CRITICAL | 5 days | CORE | 1.x |
| **2.2** Opportunity Radar | HIGH | 4 days | VALUE | 1.x |
| **2.3** Payments | CRITICAL | 3 days | REVENUE | 1.x |
| **3.1** AI Multi-Provider | HIGH | 4 days | PERFORMANCE | 1.1.1 |
| **3.2** Caching | MEDIUM | 2 days | COST | 3.1 |
| **4.1** Database Schema | HIGH | 3 days | DATA | 1.1.3 |
| **4.2** Repositories | MEDIUM | 2 days | ARCHITECTURE | 4.1 |
| **5.x** UI Polish | MEDIUM | 6 days | UX | All above |
| **6.x** Testing | HIGH | 5 days | QUALITY | All above |
| **7.x** Launch | CRITICAL | 3 days | GO-LIVE | All above |

**Total Estimated Duration**: 8-10 weeks (with parallel workstreams: 6-8 weeks)

---

## Success Metrics

### Technical Metrics
- TypeScript errors: 0
- Test coverage: ≥80%
- Lighthouse score: ≥90
- Build time: <2 minutes
- API response time: <500ms (p95)
- Error rate: <0.1%

### Business Metrics
- User signups: 100 in first month
- Plan generations: 500 in first month
- Conversion rate: 5%+ (free → paid)
- Churn rate: <10% monthly
- NPS score: >50

---

## Risk Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| AI provider outages | HIGH | MEDIUM | Multi-provider fallback system |
| Stripe webhook failures | HIGH | LOW | Idempotency keys, retry logic |
| Type complexity | MEDIUM | HIGH | Strict typing, incremental fixes |
| Scope creep | HIGH | HIGH | Phased approach, MVP focus |
| Performance issues | MEDIUM | MEDIUM | Caching, optimization, monitoring |

---

## Daily Development Workflow

1. **Morning**: Review DEPLOYMENT_ISSUES_LOG.md for patterns
2. **Before coding**: Check database.types.ts for table existence
3. **During coding**: Run `npx tsc --noEmit` every 30 minutes
4. **After changes**: Verify exports in index.ts files
5. **Before commit**: Full type check and lint
6. **After commit**: Push to GitHub, verify CI passes

---

## Emergency Contacts & Resources

- **Type Issues**: Check `ai-types.ts` and `database.types.ts`
- **Build Failures**: Read `DEPLOYMENT_ISSUES_LOG.md` first
- **Supabase Errors**: Verify table exists in types before query
- **AI Errors**: Check property names (`text` not `content`, `provider` not `preferredProvider`)

---

**Document Version**: 1.0  
**Last Updated**: 2026-03-31  
**Status**: ACTIVE  
**Next Review**: Weekly or after each phase completion

---

*This plan is a living document. Update it as requirements change, new issues are discovered, or phases are completed.*
