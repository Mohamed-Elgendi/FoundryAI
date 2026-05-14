# FoundryAI Architecture

## 7-Layer Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Layer 7: Design System                                  │  Tokens, themes, visual language
├─────────────────────────────────────────────────────────┤
│  Layer 6: Interface Logic                                │  Client-side state, hooks, form handlers
├─────────────────────────────────────────────────────────┤
│  Layer 5: Application                                    │  Server actions, API routes, pages
├─────────────────────────────────────────────────────────┤
│  Layer 4: Logic                                          │  Business rules, workflows, events, AI
├─────────────────────────────────────────────────────────┤
│  Layer 3: Domain                                         │  Domain models, entities, value objects
├─────────────────────────────────────────────────────────┤
│  Layer 2: Infrastructure                                 │  DB clients, external APIs, storage
├─────────────────────────────────────────────────────────┤
│  Layer 1: Foundation                                     │  Types, constants, utilities
└─────────────────────────────────────────────────────────┘
```

### Layer Details

**Layer 1: Foundation** — Shared types, constants, error types, utility functions
- `src/layer-1-foundation/` — Core type definitions and shared utilities

**Layer 2: Infrastructure** — Database clients, external APIs, storage adapters
- `src/layer-2-infrastructure/` — Supabase clients, Stripe SDK, OpenAI client
- `src/lib/supabase/` — Browser, server, and middleware clients

**Layer 3: Domain** — Domain models, entities, and value objects
- `src/layer-3-domain/` — Guide, Course, Assignment, User, Enrollment models

**Layer 4: Logic** — Business rules, event handling, workflow orchestration
- `src/layer-4-logic/` — Orchestration layer
- `src/lib/business-rules-engine/` — Pluggable validation rules
- `src/lib/event-bus/` — Typed event pub/sub system
- `src/lib/workflow-engine/` — Multi-step async workflows
- `src/lib/ai.ts` — OpenAI curriculum generation
- `src/lib/curriculum.ts` — Curriculum utilities

**Layer 5: Application** — Server actions, API routes, page components
- `src/layer-5-application/` — Application-level operations
- `src/app/` — Next.js 15 app router pages and API routes
- `src/app/api/` — API endpoints

**Layer 6: Interface Logic** — Client-side state, hooks, data fetching
- `src/layer-6-interface-logic/` — Client-side logic and hooks

**Layer 7: Design System** — Design tokens, themes, component primitives
- `src/layer-7-design-system/` — Light/dark tokens, visual primitives
- `src/components/ui/` — shadcn/ui components (Button, Card, Input, etc.)
- `src/components/ui/theme-provider.tsx` — Theme context provider
- `src/components/ui/theme-toggle.tsx` — Theme toggle button

---

## Core Systems

### Authentication (Supabase)
- **Methods**: Email/password, magic link, OAuth providers
- **Roles**: Teacher / Student
- **Protection**: Middleware-based route protection (`src/middleware.ts`)
- **Session**: `@supabase/ssr` for Next.js app router compatibility
- **Pages**: Sign-in, Sign-up, Magic Link, Forgot Password, Auth Callback, Error

### Business Rules Engine
- **Location**: `src/lib/business-rules-engine/`
- **Features**:
  - Pluggable validation rules with severity levels
  - Guide, curriculum, assignment validation
  - Circular dependency detection in curriculums
  - Rule registry with custom rule registration
- **API**: `validateGuide()`, `validateCurriculum()`, `validateAssignment()`, `registerRule()`

### Event Bus
- **Location**: `src/lib/event-bus/`
- **Features**:
  - Typed event system with domain events
  - `on()`, `once()`, `off()`, `emit()` API
  - Event logging and history
  - Pause/resume capabilities
  - Singleton pattern with reset for testing
- **Domain Events**: GuideCreated, GuideUpdated, CurriculumGenerated, AssignmentSubmitted, EnrollmentCreated, PaymentProcessed

### Workflow Engine
- **Location**: `src/lib/workflow-engine/`
- **Features**:
  - Multi-step async workflow definitions
  - Retry with exponential backoff
  - Pause/resume/cancel capabilities
  - Step conditions (skip logic)
  - Workflow instance tracking
- **API**: `createWorkflow()`, `executeWorkflow()`, `pauseWorkflow()`, `resumeWorkflow()`

### AI Curriculum Generation (OpenAI)
- **Location**: `src/lib/ai.ts`
- **Features**:
  - Curriculum generation from guide parameters
  - Assignment suggestion generation
  - Quiz question generation
  - Uses GPT-4o-mini (configurable)
- **API**: `generateCurriculum()`, `generateAssignmentSuggestions()`, `generateQuizQuestions()`

### Theme System
- **Location**: `src/components/ui/theme-provider.tsx`
- **Features**:
  - Light/dark themes with localStorage persistence
  - System preference detection
  - Next.js app router compatible
  - CSS variable-based theming via `src/layer-7-design-system/tokens/`

---

## Application Structure

```
src/
├── app/                          # Next.js 15 App Router
│   ├── (auth)/                   # Auth route group
│   │   ├── sign-in/page.tsx
│   │   ├── sign-up/page.tsx
│   │   └── magic-link/page.tsx
│   ├── auth/
│   │   ├── callback/page.tsx     # OAuth callback
│   │   └── error/page.tsx        # Auth error display
│   ├── forgot-password/page.tsx
│   ├── teacher/                  # Teacher portal
│   │   ├── layout.tsx            # Sidebar + Header
│   │   ├── dashboard/page.tsx    # Stats + activity
│   │   ├── guides/               # CRUD
│   │   ├── courses/              # CRUD + management
│   │   └── settings/page.tsx     # Profile, security, billing
│   ├── student/                  # Student portal
│   │   ├── layout.tsx            # Sidebar + Header
│   │   ├── dashboard/page.tsx    # Progress stats
│   │   ├── guides/               # Explore + enroll
│   │   ├── assignments/          # List + submit
│   │   ├── courses/              # My courses
│   │   └── analytics/page.tsx    # Charts + metrics
│   ├── api/                      # API routes
│   │   └── webhooks/stripe/      # Stripe webhook handler
│   ├── page.tsx                  # Landing page
│   └── layout.tsx                # Root layout + ThemeProvider
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── shared/                   # Reusable components
│   │   ├── sidebar.tsx           # Collapsible nav
│   │   ├── header.tsx            # Top bar
│   │   ├── guide-card.tsx        # Guide card
│   │   ├── course-card.tsx       # Course card
│   │   ├── progress-ring.tsx     # SVG progress
│   │   ├── empty-state.tsx       # Empty state
│   │   └── loading-skeleton.tsx  # Skeleton loaders
│   └── landing/                  # Landing page sections
│       ├── hero.tsx
│       ├── features.tsx
│       ├── pricing.tsx
│       ├── testimonials.tsx
│       ├── faq.tsx
│       └── cta.tsx
├── lib/                          # Business logic
│   ├── business-rules-engine/    # Validation engine
│   ├── event-bus/                # Event pub/sub
│   ├── workflow-engine/          # Workflow orchestration
│   ├── supabase/                 # DB clients
│   ├── stripe/                   # Payment integration
│   ├── ai.ts                     # OpenAI integration
│   ├── curriculum.ts             # Curriculum utilities
│   ├── constants.ts              # Config values
│   └── feature-gate.ts           # Feature flags
├── layer-1-foundation/           # Layer 1: Foundation
├── layer-2-infrastructure/       # Layer 2: Infrastructure
├── layer-3-domain/               # Layer 3: Domain
├── layer-4-logic/                # Layer 4: Logic
├── layer-5-application/          # Layer 5: Application
├── layer-6-interface-logic/      # Layer 6: Interface Logic
├── layer-7-design-system/        # Layer 7: Design System
└── middleware.ts                  # Auth middleware
```

---

## Database (Supabase)

Migrations in `supabase/migrations/`:
- `0001` — Schema foundation, user profiles, RLS policies
- `0002-0007` — Guides, curriculums, assignments, enrollments, progress, workflows, events

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL (Supabase) |
| Auth | Supabase Auth (magic link, email/password, OAuth) |
| Payments | Stripe (subscriptions, webhooks) |
| AI | OpenAI (GPT-4o-mini) |
| UI | shadcn/ui + Tailwind CSS |
| Testing | Jest |
| Deployment | Vercel |

---

## Environment Variables

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENAI_API_KEY=

# Stripe (for payments)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
