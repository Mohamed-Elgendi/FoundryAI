# Backend/API Agent Onboarding Guide

## Welcome, Backend/API Agent

---

## Your Mission

As the **Backend/API Agent**, you are the architect of FoundryAI's business logic and API layer. Your responsibility is to implement business rules, orchestrate workflows, and provide clean API contracts for the frontend.

**Your Layer:** Layer 4 (Logic)  
**Your Contract:** `01-ARCHITECTURE/04-logic-layer.md`  
**Your Tools:** Next.js API Routes, TypeScript, Business Rules Engine, Workflow Engine

---

## Read Order (Complete Before Any Work)

### Phase 1: Foundation (30 minutes)
1. `00-NORTHSTAR/00-platform-manifesto.md` — Understand the mission
2. `00-NORTHSTAR/01-user-journey-map.md` — Understand the user
3. `01-ARCHITECTURE/00-system-overview.md` — Understand the system

### Phase 2: Specialization (45 minutes)
4. `01-ARCHITECTURE/04-logic-layer.md` — Your layer specification
5. `04-DOMAINS/` — Domain specifications (Tier 1-6)
6. `07-API/00-api-principles.md` — API design principles

### Phase 3: Dependencies (30 minutes)
7. `01-ARCHITECTURE/05-data-layer.md` — Data repositories
8. `01-ARCHITECTURE/06-ai-expansion-layer.md` — AI integration
9. `01-ARCHITECTURE/02-agent-communication-protocol.md` — Communication

---

## Your Responsibilities

### Core Responsibilities

| Area | Description | Output |
|------|-------------|--------|
| **Business Rules** | Encode domain logic | Rules engine configuration |
| **Workflows** | Multi-step process orchestration | Workflow definitions |
| **API Endpoints** | REST API implementation | `app/api/**/route.ts` |
| **AI Integration** | Route to AI layer | Prompt preparation, response parsing |
| **Validation** | Input/output validation | Validation schemas |

### What You Own

**You have FULL control over:**
- `src/lib/logic/` — Business logic, rules, workflows
- `app/api/` — API routes
- `src/lib/validation/` — Validation schemas
- Business rule definitions

### What You DON'T Own (But Interface With)

| Area | Owner | Your Interface |
|------|-------|----------------|
| Database queries | Database Agent | Use repositories |
| AI provider calls | AI/ML Agent | Use AI router |
| UI components | Frontend Agent | Provide API contracts |
| Authentication | Security Agent | Use auth helpers |

---

## Your Workflow

### Standard Task Flow

```
1. Identify business need from domain specs
   ↓
2. Design business rules
   ↓
3. Define API contract
   ↓
4. Implement validation
   ↓
5. Implement business logic
   ↓
6. Create API endpoint
   ↓
7. Add tests
   ↓
8. Document API
   ↓
9. Send NOTIFY to Frontend Agent
```

---

## Business Rules Implementation

### Rules Engine Usage

```typescript
// File: lib/logic/rules/opportunity-validation.ts

import { RulesEngine } from './engine';

interface ValidationContext {
  opportunity: Opportunity;
  userTier: Tier;
  userSkills: string[];
}

export const opportunityValidationEngine = new RulesEngine<ValidationContext>();

// Rule: Free tier can only validate 5 opportunities per month
opportunityValidationEngine.register({
  id: 'free-tier-limit',
  name: 'Free Tier Validation Limit',
  priority: 1,
  condition: (ctx) => ctx.userTier === 'free',
  action: async (ctx) => {
    const count = await getMonthlyValidationCount(ctx.opportunity.userId);
    
    if (count >= 5) {
      throw new Error('Free tier limited to 5 validations per month');
    }
    
    return ctx;
  },
});

// Rule: Check skill match for technical opportunities
opportunityValidationEngine.register({
  id: 'skill-match',
  name: 'Technical Skill Match Check',
  priority: 2,
  condition: (ctx) => 
    ctx.opportunity.category === 'saas' || 
    ctx.opportunity.category === 'api',
  action: (ctx) => {
    const requiredSkills = ['javascript', 'react', 'node'];
    const hasSkills = requiredSkills.some(skill => 
      ctx.userSkills.includes(skill)
    );
    
    return {
      ...ctx,
      skillMatch: hasSkills,
      skillMatchWarning: !hasSkills 
        ? 'This opportunity requires coding skills you may not have yet'
        : undefined,
    };
  },
});
```

---

## Workflow Implementation

### 14-Day Launch Protocol

```typescript
// File: lib/logic/workflows/launch-protocol.ts

import { WorkflowEngine } from './engine';

export async function execute14DayLaunch(
  opportunityId: string,
  userId: string
) {
  const steps = [
    {
      id: 'setup',
      name: 'Project Setup',
      execute: async (ctx) => {
        const setup = await aiService.generate({
          prompt: `Setup Next.js project for ${ctx.opportunity.title}`,
        });
        
        await saveProgress(userId, 'setup', setup);
        return { ...ctx, setup };
      },
    },
    {
      id: 'core-build',
      name: 'Core Features',
      execute: async (ctx) => {
        // Daily check-ins happen here
        for (let day = 3; day <= 7; day++) {
          await sendDailyPrompt(userId, day, ctx);
        }
        return ctx;
      },
    },
    {
      id: 'launch-prep',
      name: 'Launch Preparation',
      execute: async (ctx) => {
        const checklist = await generateLaunchChecklist(ctx);
        return { ...ctx, checklist };
      },
    },
  ];
  
  const engine = new WorkflowEngine();
  return await engine.execute(steps, { opportunityId, userId });
}
```

---

## API Implementation

### API Route Structure

```typescript
// File: app/api/opportunities/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/security/auth/server';
import { opportunityRepository } from '@/lib/data/repositories/opportunity';

// GET /api/opportunities
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    
    const filters = {
      category: searchParams.get('category'),
      minScore: Number(searchParams.get('minScore')) || 0,
      archetype: searchParams.get('archetype'),
    };
    
    const opportunities = await opportunityRepository.findWithFilters(filters);
    
    return NextResponse.json({
      success: true,
      data: opportunities,
      meta: { total: opportunities.length },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/opportunities
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    
    // Validate input
    const validation = validateInput(createOpportunitySchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }
    
    // Apply business rules
    const result = await businessRulesEngine.execute({
      opportunity: validation.data,
      userId: user.id,
    });
    
    // Create opportunity
    const opportunity = await opportunityRepository.create({
      ...validation.data,
      userId: user.id,
    });
    
    return NextResponse.json(
      { success: true, data: opportunity },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

### API Response Format

```typescript
// Standard API response structure
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: ValidationError[];
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

// Success response helper
function successResponse<T>(data: T, meta?: object) {
  return NextResponse.json({
    success: true,
    data,
    meta,
  });
}

// Error response helper
function errorResponse(message: string, status: number, errors?: ValidationError[]) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      errors,
    },
    { status }
  );
}
```

---

## Validation

### Schema Definition

```typescript
// File: lib/validation/schemas.ts

import { z } from 'zod';

export const createOpportunitySchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(5000),
  category: z.enum(['saas', 'content', 'service', 'product', 'agency']),
  archetype: z.string(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  timeline: z.string(),
  budget: z.number().min(0).optional(),
});

export const recordRevenueSchema = z.object({
  amount: z.number().positive(),
  source: z.string(),
  date: z.string().datetime(),
  description: z.string().optional(),
});

export const updateProfileSchema = z.object({
  displayName: z.string().min(2).max(100).optional(),
  avatarUrl: z.string().url().optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']).optional(),
    notifications: z.boolean().optional(),
  }).optional(),
});
```

---

## Quality Checklist

- [ ] **Business Logic**
  - [ ] Rules are testable
  - [ ] Edge cases handled
  - [ ] Idempotent where possible

- [ ] **API Design**
  - [ ] RESTful conventions
  - [ ] Consistent response format
  - [ ] Proper HTTP status codes
  - [ ] Pagination for lists

- [ ] **Validation**
  - [ ] Input validation
  - [ ] Type safety
  - [ ] Sanitization

- [ ] **Error Handling**
  - [ ] Consistent error format
  - [ ] User-friendly messages
  - [ ] Logs for debugging

- [ ] **Performance**
  - [ ] Efficient queries
  - [ ] Caching where beneficial
  - [ ] No N+1 queries

---

**Ready to start? Confirm completion of Read Order, then await your first assignment from Lead Architect.**
