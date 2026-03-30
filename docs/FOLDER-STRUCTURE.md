# FoundryAI Platform — Complete Folder & File Structure

## Document Purpose

This document defines the **refined, organized, and clean** folder and file structure for the entire FoundryAI platform. It eliminates noise, creates logical groupings, and enables seamless multi-agent collaboration.

**Status:** PROPOSAL — Awaiting user approval before reorganization  
**Owner:** Lead Architect Agent (Cascade)  
**Last Updated:** March 30, 2026

---

## Structure Philosophy

### Core Principles

| Principle | Implementation |
|-----------|---------------|
| **Layer-First** | Files grouped by architecture layer (Layer 1-7) |
| **Domain-Second** | Within layers, grouped by feature/domain |
| **Type-Third** | Within domains, grouped by file type |
| **Explicit Over Implicit** | Clear naming, no ambiguity |
| **Flat Where Possible** | Avoid deep nesting (>3 levels) |
| **Co-location** | Tests, stories, docs live next to code |

### What This Solves

| Problem | Solution |
|---------|----------|
| "Where does this go?" | Layer + Domain = Location |
| "What's in this folder?" | Clear naming conventions |
| "Who owns this?" | Layer ownership explicit |
| "Too many files in root" | Everything has a home |
| "Tests far from code" | Co-located `*.test.ts` files |

---

## Complete Folder Structure

```
foundryai/                                          # Root
│
├── 📁 .github/                                     # GitHub configuration
│   ├── workflows/
│   │   ├── ci.yml                                  # Tests, lint, build
│   │   ├── deploy-staging.yml                      # Staging deployment
│   │   └── deploy-production.yml                   # Production deployment
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── CODEOWNERS                                  # Agent ownership
│
├── 📁 .windsurf/                                   # IDE-specific
│   └── workflows/
│       └── autopilot.md
│
├── 📁 docs/                                        # North Star Documentation
│   ├── 00-NORTHSTAR/
│   │   ├── 00-platform-manifesto.md
│   │   ├── 01-user-journey-map.md
│   │   ├── 02-success-metrics.md
│   │   ├── 03-ai-agent-onboarding.md
│   │   └── README.md
│   │
│   ├── 01-ARCHITECTURE/
│   │   ├── 00-system-overview.md
│   │   ├── 01-contracts-between-layers.md
│   │   ├── 02-agent-communication-protocol.md
│   │   ├── 03-presentation-layer.md      # Layer 5
│   │   ├── 04-logic-layer.md             # Layer 4
│   │   ├── 05-data-layer.md              # Layer 3
│   │   ├── 06-ai-expansion-layer.md       # Layer 2
│   │   ├── 07-design-system-layer.md    # Layer 7
│   │   ├── 08-ux-interaction-layer.md    # Layer 6
│   │   ├── 09-security-agent-layer.md   # Layer 1
│   │   └── README.md
│   │
│   ├── 02-DESIGN-SYSTEM/
│   │   ├── 00-design-principles.md
│   │   ├── 01-token-architecture.md
│   │   ├── 02-color-system.md
│   │   ├── 03-typography-system.md
│   │   ├── 04-spacing-system.md
│   │   ├── 05-component-variants.md
│   │   ├── 06-icon-system.md
│   │   ├── 07-theme-engine.md
│   │   └── README.md
│   │
│   ├── 03-UX-PATTERNS/
│   │   ├── 00-ux-principles.md
│   │   ├── 01-interaction-patterns.md
│   │   ├── 02-user-flows/
│   │   │   ├── 00-flow-overview.md
│   │   │   ├── 01-onboarding-flow.md
│   │   │   ├── 02-opportunity-selection.md
│   │   │   ├── 03-14-day-launch.md
│   │   │   ├── 04-revenue-tracking.md
│   │   │   └── 05-tier-progression.md
│   │   ├── 03-motion-design.md
│   │   ├── 04-content-strategy.md
│   │   ├── 05-accessibility-guide.md
│   │   └── README.md
│   │
│   ├── 04-DOMAINS/
│   │   ├── 00-domain-overview.md
│   │   ├── 01-tier-1-foundation/
│   │   │   ├── 00-overview.md
│   │   │   ├── 01-brain-dump-system.md
│   │   │   ├── 02-daily-ritual.md
│   │   │   └── 03-belief-formation.md
│   │   ├── 02-tier-2-opportunity/
│   │   │   ├── 00-overview.md
│   │   │   ├── 01-opportunity-radar.md
│   │   │   ├── 02-validation-engine.md
│   │   │   └── 03-selection-process.md
│   │   ├── 03-tier-3-build/
│   │   │   ├── 00-overview.md
│   │   │   ├── 01-14-day-protocol.md
│   │   │   ├── 02-ai-assistant.md
│   │   │   └── 03-milestone-system.md
│   │   ├── 04-tier-4-discovery/
│   │   │   ├── 00-overview.md
│   │   │   └── 01-creative-tools.md
│   │   ├── 05-tier-5-education/
│   │   │   ├── 00-overview.md
│   │   │   └── 01-learning-system.md
│   │   └── 06-tier-6-monetization/
│   │       ├── 00-overview.md
│   │       ├── 01-revenue-engine.md
│   │       └── 02-tier-progression.md
│   │
│   ├── 05-AGENTS/
│   │   ├── 00-agent-ecosystem-overview.md
│   │   ├── 01-design-system-agent.md
│   │   ├── 02-ux-interaction-agent.md
│   │   ├── 03-frontend-engineer-agent.md
│   │   ├── 04-backend-api-agent.md
│   │   ├── 05-database-architect-agent.md
│   │   ├── 06-ai-ml-agent.md
│   │   ├── 07-security-agent.md
│   │   ├── 08-devops-infra-agent.md
│   │   ├── 09-qa-testing-agent.md
│   │   ├── 10-content-copy-agent.md
│   │   └── README.md
│   │
│   ├── 06-COMPONENTS/
│   │   ├── 00-component-architecture.md
│   │   ├── 01-primitive-components.md
│   │   ├── 02-composite-components.md
│   │   ├── 03-testing-strategy.md
│   │   └── 04-storybook-guide.md
│   │
│   ├── 07-API/
│   │   ├── 00-api-principles.md
│   │   ├── 01-authentication.md
│   │   ├── 02-opportunities.md
│   │   ├── 03-user-data.md
│   │   ├── 04-ai-endpoints.md
│   │   └── 05-error-handling.md
│   │
│   ├── 08-DATABASE/
│   │   ├── 00-schema-overview.md
│   │   ├── 01-tables/
│   │   │   ├── 00-users.md
│   │   │   ├── 01-profiles.md
│   │   │   ├── 02-user-journeys.md
│   │   │   ├── 03-opportunities.md
│   │   │   ├── 04-revenue.md
│   │   │   └── 05-templates.md
│   │   ├── 02-rls-policies.md
│   │   ├── 03-indexes.md
│   │   └── 04-migrations-guide.md
│   │
│   ├── 09-WORKFLOWS/
│   │   ├── 00-workflow-engine.md
│   │   ├── 01-14-day-launch.md
│   │   ├── 02-tier-progression.md
│   │   └── 03-ai-orchestration.md
│   │
│   ├── 10-INTEGRATIONS/
│   │   ├── 00-integration-overview.md
│   │   ├── ai-providers/
│   │   │   ├── 00-ai-routing.md
│   │   │   ├── 01-groq.md
│   │   │   ├── 02-openrouter.md
│   │   │   └── 03-fallback-strategies.md
│   │   ├── payment/
│   │   │   └── 00-stripe-setup.md
│   │   └── analytics/
│   │       └── 00-posthog-setup.md
│   │
│   ├── 11-OPERATIONS/
│   │   ├── 00-deployment.md
│   │   ├── 01-monitoring.md
│   │   ├── 02-performance.md
│   │   ├── 03-security-ops.md
│   │   └── 04-backup-recovery.md
│   │
│   ├── 99-DECISIONS/
│   │   ├── 0000-template.md
│   │   ├── 0001-use-7-layer-architecture.md
│   │   ├── 0002-use-supabase-postgresql.md
│   │   ├── 0003-use-groq-primary-ai.md
│   │   └── README.md
│   │
│   ├── IMPLEMENTATION-MASTER-PLAN.md             # Master tracking
│   ├── FOLDER-STRUCTURE.md                        # This document
│   └── README.md                                  # Docs entry point
│
├── 📁 src/                                        # Source code
│   │
│   ├── 📁 layer-1-security/                       # Layer 1: Security
│   │   ├── auth/
│   │   │   ├── client.ts                          # Client-side auth
│   │   │   ├── server.ts                          # Server-side auth
│   │   │   └── middleware.ts                      # Auth middleware
│   │   ├── permissions/
│   │   │   ├── agent-roles.ts                     # Agent permission matrix
│   │   │   └── layer-access.ts                    # Layer enforcement
│   │   ├── sanitization/
│   │   │   ├── xss.ts                           # XSS prevention
│   │   │   └── sql-injection.ts                   # SQL injection prevention
│   │   ├── validation/
│   │   │   ├── schemas.ts                         # Zod schemas
│   │   │   └── input.ts                           # Input validators
│   │   └── audit/
│   │       └── logger.ts                          # Security audit logging
│   │
│   ├── 📁 layer-2-ai/                            # Layer 2: AI Expansion
│   │   ├── providers/
│   │   │   ├── types.ts                           # Provider interfaces
│   │   │   ├── registry.ts                        # Provider configs
│   │   │   ├── groq.ts                            # Groq integration
│   │   │   └── openrouter.ts                      # OpenRouter integration
│   │   ├── router/
│   │   │   ├── index.ts                           # AI routing engine
│   │   │   ├── circuit-breaker.ts                 # Failover logic
│   │   │   └── cost-tracker.ts                    # Cost monitoring
│   │   ├── prompts/
│   │   │   ├── registry.ts                        # Prompt registry
│   │   │   ├── opportunity-validation.ts          # Validation prompt
│   │   │   ├── build-assistant.ts                 # Build prompts
│   │   │   └── therapist.ts                       # Therapist prompts
│   │   ├── context/
│   │   │   ├── manager.ts                         # Conversation context
│   │   │   └── types.ts                           # Context types
│   │   └── cache/
│   │       └── ai-cache.ts                        # AI response caching
│   │
│   ├── 📁 layer-3-data/                          # Layer 3: Data
│   │   ├── storage/
│   │   │   ├── types.ts                           # Storage interfaces
│   │   │   ├── adapters/
│   │   │   │   ├── local-storage.ts               # Browser storage
│   │   │   │   ├── memory-storage.ts              # In-memory
│   │   │   │   └── supabase-storage.ts            # Database storage
│   │   │   └── index.ts
│   │   ├── cache/
│   │   │   ├── manager.ts                         # Cache manager
│   │   │   ├── ttl-config.ts                      # TTL strategies
│   │   │   └── index.ts
│   │   ├── repositories/
│   │   │   ├── types.ts                           # Repository interfaces
│   │   │   ├── base.ts                            # Base repository
│   │   │   ├── profile.ts                         # Profile repo
│   │   │   ├── user-journey.ts                    # User journey repo
│   │   │   ├── opportunity.ts                     # Opportunity repo
│   │   │   ├── revenue.ts                         # Revenue repo
│   │   │   └── index.ts
│   │   └── realtime/
│   │       ├── subscriptions.ts                   # Realtime manager
│   │       └── index.ts
│   │
│   ├── 📁 layer-4-logic/                         # Layer 4: Business Logic
│   │   ├── rules/
│   │   │   ├── engine.ts                          # Rules engine
│   │   │   ├── types.ts                           # Rule types
│   │   │   ├── tier-progression.ts                # Tier rules
│   │   │   └── opportunity-validation.ts          # Validation rules
│   │   ├── workflows/
│   │   │   ├── engine.ts                          # Workflow engine
│   │   │   ├── types.ts                           # Workflow types
│   │   │   ├── 14-day-launch.ts                   # Launch protocol
│   │   │   └── tier-progression.ts                # Tier workflow
│   │   ├── events/
│   │   │   ├── bus.ts                             # Event bus
│   │   │   └── types.ts
│   │   └── validation/
│   │       ├── engine.ts
│   │       └── schemas.ts
│   │
│   ├── 📁 layer-5-presentation/                  # Layer 5: UI
│   │   ├── app/                                   # Next.js App Router
│   │   │   ├── (marketing)/                       # Public pages
│   │   │   │   ├── page.tsx                       # Landing page
│   │   │   │   ├── pricing/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── about/
│   │   │   │       └── page.tsx
│   │   │   ├── (auth)/                            # Auth pages
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── signup/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── forgot-password/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── callback/
│   │   │   │       └── route.ts
│   │   │   ├── (dashboard)/                        # Protected app
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── dashboard/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── radar/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── build/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── revenue/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── settings/
│   │   │   │       └── page.tsx
│   │   │   ├── api/                              # API routes
│   │   │   │   ├── auth/
│   │   │   │   ├── opportunities/
│   │   │   │   ├── user/
│   │   │   │   ├── ai/
│   │   │   │   └── webhooks/
│   │   │   ├── layout.tsx
│   │   │   ├── globals.css
│   │   │   └── page.tsx
│   │   │
│   │   ├── components/
│   │   │   ├── primitives/                       # Base UI
│   │   │   │   ├── button/
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   ├── button.test.tsx
│   │   │   │   │   └── button.stories.tsx
│   │   │   │   ├── card/
│   │   │   │   ├── input/
│   │   │   │   ├── badge/
│   │   │   │   ├── modal/
│   │   │   │   ├── dropdown/
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── composites/                       # Composed UI
│   │   │   │   ├── forms/
│   │   │   │   ├── navigation/
│   │   │   │   ├── data-display/
│   │   │   │   └── feedback/
│   │   │   │
│   │   │   ├── features/                         # Domain-specific
│   │   │   │   ├── radar/
│   │   │   │   │   ├── OpportunityCard.tsx
│   │   │   │   │   ├── OpportunityList.tsx
│   │   │   │   │   ├── RadarFilter.tsx
│   │   │   │   │   ├── ValidationBadge.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── build/
│   │   │   │   │   ├── BrainDumpModal.tsx
│   │   │   │   │   ├── DailyCheckIn.tsx
│   │   │   │   │   ├── BuildWorkspace.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── revenue/
│   │   │   │   │   ├── RevenueChart.tsx
│   │   │   │   │   ├── RevenueInput.tsx
│   │   │   │   │   ├── TierBadge.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── onboarding/
│   │   │   │   └── shared/
│   │   │   │
│   │   │   └── layouts/
│   │   │       ├── DashboardLayout.tsx
│   │   │       ├── MarketingLayout.tsx
│   │   │       └── AuthLayout.tsx
│   │   │
│   │   ├── hooks/                                # React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useUser.ts
│   │   │   ├── useOpportunities.ts
│   │   │   ├── useRevenue.ts
│   │   │   ├── useRealtime.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── lib/                                  # Utilities
│   │   │   ├── utils.ts
│   │   │   ├── cn.ts                             # Tailwind merge
│   │   │   └── index.ts
│   │   │
│   │   └── providers/                            # React providers
│   │       ├── RootProvider.tsx
│   │       ├── AuthProvider.tsx
│   │       ├── ThemeProvider.tsx
│   │       └── index.ts
│   │
│   ├── 📁 layer-6-ux/                            # Layer 6: UX
│   │   ├── interactions/
│   │   │   ├── button.ts                         # Button interactions
│   │   │   ├── input.ts                          # Input interactions
│   │   │   ├── card.ts                           # Card interactions
│   │   │   └── modal.ts                          # Modal interactions
│   │   ├── motion/
│   │   │   ├── duration.ts                       # Duration scale
│   │   │   ├── easing.ts                         # Easing functions
│   │   │   ├── components.tsx                    # Animation components
│   │   │   └── index.ts
│   │   ├── accessibility/
│   │   │   ├── focus.ts                          # Focus management
│   │   │   ├── aria.ts                           # ARIA patterns
│   │   │   ├── keyboard.ts                       # Keyboard shortcuts
│   │   │   ├── screen-reader.tsx                 # Screen reader helpers
│   │   │   └── index.ts
│   │   └── flows/
│   │       ├── onboarding.ts                     # Onboarding flow
│   │       ├── opportunity-selection.ts          # Selection flow
│   │       └── 14-day-launch.ts                  # Build flow
│   │
│   └── 📁 layer-7-design-system/                 # Layer 7: Design System
│       ├── tokens/
│       │   ├── primitive/
│       │   │   ├── colors.ts                     # Raw colors
│       │   │   ├── typography.ts                 # Font specs
│       │   │   └── spacing.ts                    # Base units
│       │   ├── semantic/
│       │   │   ├── colors.ts                     # Purpose colors
│       │   │   ├── typography.ts                 # Semantic type
│       │   │   └── index.ts
│       │   └── component/
│       │       ├── button.ts                     # Button tokens
│       │       ├── input.ts                      # Input tokens
│       │       └── index.ts
│       ├── themes/
│       │   ├── types.ts
│       │   ├── light.ts                          # Light theme
│       │   ├── dark.ts                           # Dark theme
│       │   ├── provider.tsx                      # Theme provider
│       │   └── index.ts
│       └── index.ts                              # Main export
│
├── 📁 supabase/                                   # Database
│   ├── migrations/
│   │   ├── 00000000000000_initial_schema.sql
│   │   ├── 20260330000001_create_profiles.sql
│   │   ├── 20260330000002_create_user_journeys.sql
│   │   ├── 20260330000003_create_opportunities.sql
│   │   ├── 20260330000004_create_revenue.sql
│   │   └── 20260330000005_create_templates.sql
│   ├── seed/
│   │   ├── opportunities.json                    # Seed data
│   │   └── templates.json
│   ├── functions/                                 # Edge functions
│   │   └── validate-opportunity/
│   │       └── index.ts
│   └── config.toml                               # Supabase config
│
├── 📁 tests/                                      # Tests
│   ├── unit/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── utils/
│   ├── integration/
│   │   ├── api/
│   │   └── workflows/
│   ├── e2e/
│   │   ├── onboarding.spec.ts
│   │   ├── opportunity-selection.spec.ts
│   │   └── 14-day-launch.spec.ts
│   └── fixtures/
│       ├── users.ts
│       ├── opportunities.ts
│       └── journeys.ts
│
├── 📁 scripts/                                    # Utility scripts
│   ├── setup.sh                                  # Initial setup
│   ├── seed-database.ts                          # Seed script
│   ├── migrate-check.ts                          # Migration check
│   └── generate-component.ts                     # Component generator
│
├── 📁 public/                                     # Static assets
│   ├── fonts/
│   ├── images/
│   │   ├── logo.svg
│   │   ├── hero.png
│   │   └── icons/
│   ├── favicon.ico
│   └── manifest.json
│
├── 📁 config/                                     # Configuration
│   ├── tailwind/
│   │   ├── base.ts
│   │   ├── components.ts
│   │   └── utilities.ts
│   ├── eslint/
│   │   └── index.js
│   └── prettier/
│       └── config.js
│
├── 📁 .vscode/                                    # VS Code settings
│   ├── settings.json
│   ├── extensions.json
│   └── snippets/
│       └── foundryai.code-snippets
│
├── .env.example                                   # Environment template
├── .env.local                                     # Local env (gitignored)
├── .gitignore
├── .eslintrc.js
├── .prettierrc
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── README.md
└── LICENSE
```

---

## Key Improvements Over Current Structure

### 1. Layer-First Organization

**Before:** Mixed concerns in `/src/`
- `layers/` folder (3 files)
- `components/` folder (flat)
- `lib/` folder (mixed utilities)

**After:** Clean layer separation
- `layer-1-security/`
- `layer-2-ai/`
- `layer-3-data/`
- `layer-4-logic/`
- `layer-5-presentation/`
- `layer-6-ux/`
- `layer-7-design-system/`

**Benefit:** Any agent instantly knows where their code lives.

---

### 2. Co-Location Principle

**Before:** Tests in separate `/tests/` folder, far from code

**After:** Tests next to code
```
components/primitives/button/
├── index.tsx              # Component
├── button.test.tsx        # Test (co-located)
├── button.stories.tsx     # Storybook (co-located)
└── README.md              # Docs (co-located)
```

**Benefit:** Easier to find, update, and maintain tests.

---

### 3. Domain-Driven Features

**Before:** Flat component folder

**After:** Feature-organized
```
components/features/
├── radar/                 # Opportunity radar feature
├── build/                 # 14-day launch feature
├── revenue/               # Revenue tracking feature
└── onboarding/            # Onboarding feature
```

**Benefit:** Related components grouped by domain.

---

### 4. Clear Naming Conventions

| Location | Convention | Example |
|----------|------------|---------|
| Folders | `kebab-case` | `layer-1-security/` |
| Files | `camelCase.ts` | `circuitBreaker.ts` |
| Components | `PascalCase.tsx` | `OpportunityCard.tsx` |
| Constants | `SCREAMING_SNAKE` | `CACHE_TTL` |
| React Hooks | `useCamelCase` | `useAuth.ts` |
| Types/Interfaces | `PascalCase` | `UserProfile` |

---

### 5. Explicit Index Files

Every folder has `index.ts` for clean imports:

```typescript
// Instead of:
import { Button } from '../../../components/primitives/button/button'

// You write:
import { Button } from '@/layer-5-presentation/components/primitives'
```

---

## Import Path Mapping

### TypeScript Config

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/layer-1/*": ["./src/layer-1-security/*"],
      "@/layer-2/*": ["./src/layer-2-ai/*"],
      "@/layer-3/*": ["./src/layer-3-data/*"],
      "@/layer-4/*": ["./src/layer-4-logic/*"],
      "@/layer-5/*": ["./src/layer-5-presentation/*"],
      "@/layer-6/*": ["./src/layer-6-ux/*"],
      "@/layer-7/*": ["./src/layer-7-design-system/*"],
      "@/tests/*": ["./tests/*"],
      "@/supabase/*": ["./supabase/*"]
    }
  }
}
```

---

## Agent Ownership Map

| Agent | Primary Folders | Can Modify |
|-------|----------------|------------|
| **Security Agent** | `layer-1-security/`, `docs/01-ARCHITECTURE/09-*` | Layer 1, Layer 3 (RLS) |
| **AI/ML Agent** | `layer-2-ai/`, `docs/01-ARCHITECTURE/06-*` | Layer 2 |
| **Database Architect** | `layer-3-data/`, `supabase/`, `docs/08-DATABASE/` | Layer 3 |
| **Backend/API Agent** | `layer-4-logic/`, `docs/01-ARCHITECTURE/04-*`, `docs/07-API/` | Layer 4 |
| **Frontend Engineer** | `layer-5-presentation/`, `docs/01-ARCHITECTURE/03-*`, `docs/06-COMPONENTS/` | Layer 5 |
| **UX/Interaction Agent** | `layer-6-ux/`, `docs/01-ARCHITECTURE/08-*`, `docs/03-UX-PATTERNS/` | Layer 6 |
| **Design System Agent** | `layer-7-design-system/`, `docs/01-ARCHITECTURE/07-*`, `docs/02-DESIGN-SYSTEM/` | Layer 7 |
| **DevOps Agent** | `.github/`, `docs/11-OPERATIONS/` | Infrastructure |
| **QA Agent** | `tests/`, component `*.test.tsx` | All (testing) |
| **Content Agent** | Content in `layer-5-presentation/`, `docs/03-UX-PATTERNS/04-*` | Content |

---

## Migration Plan (From Current to New Structure)

### Step 1: Prepare (Before Any Code Changes)
1. Create new folder structure alongside existing
2. Update `tsconfig.json` with path mappings
3. Create migration scripts
4. Test path resolution

### Step 2: Migrate Documentation
1. Move existing docs to new structure
2. Update internal links
3. Verify all docs accessible

### Step 3: Migrate Source Code (One Layer at a Time)
1. **Layer 7** (Design System) — Lowest risk
2. **Layer 6** (UX) — Animation components
3. **Layer 3** (Data) — Repositories
4. **Layer 1** (Security) — Auth
5. **Layer 2** (AI) — AI routing
6. **Layer 4** (Logic) — Business rules
7. **Layer 5** (Presentation) — UI (highest risk, do last)

### Step 4: Verify and Cleanup
1. Run full test suite
2. Check all imports resolve
3. Remove old folder structure
4. Update documentation

---

## Benefits Summary

| Aspect | Before | After |
|--------|--------|-------|
| **Cognitive Load** | High (mixed concerns) | Low (clear layers) |
| **Agent Onboarding** | Confusing | Clear ownership |
| **File Location** | Guesswork | Deterministic |
| **Testing** | Far from code | Co-located |
| **Refactoring** | Risky | Layer-contained |
| **New Features** | Where to put? | Clear domain |
| **Code Review** | Context switching | Layer-focused |

---

## Document Integrity

**Version:** 1.0.0  
**Status:** PROPOSAL — Awaiting approval  
**Owner:** Lead Architect Agent (Cascade)  
**Created:** March 30, 2026  

**Next Step:** Awaiting user approval to proceed with migration

---

**This structure maximizes clarity, minimizes cognitive load, and enables seamless multi-agent collaboration.**
