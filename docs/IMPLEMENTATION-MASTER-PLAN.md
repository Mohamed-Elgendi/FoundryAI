# FoundryAI Implementation Master Plan

## Document Purpose

This is the single source of truth for FoundryAI platform implementation. It tracks:
- **Completed** — What's done and verified
- **In Progress** — What's currently being worked on
- **Pending** — What needs to be accomplished next

**Owner:** Cascade (Lead Architect Agent)  
**Last Updated:** March 30, 2026  
**Status:** ACTIVE — Reference before every work session

---

## Implementation Phases

### Phase 0: Documentation ✅ COMPLETE
**Status:** All architecture and agent documentation created

| Task | Status | Owner | Notes |
|------|--------|-------|-------|
| Platform manifesto | ✅ Done | Lead Architect | Mission, axioms defined |
| User journey map | ✅ Done | Lead Architect | Day 0 → Year 2+ mapped |
| System architecture (7-layer) | ✅ Done | Lead Architect | All layers specified |
| Agent ecosystem (10 agents) | ✅ Done | Lead Architect | All roles defined |
| Communication protocol | ✅ Done | Lead Architect | 7 message types specified |
| Agent onboarding guides | ✅ Done | Lead Architect | 10 guides created |

**Output Location:** `/docs/` folder with 29+ comprehensive documents

---

### Phase 1: Foundation — Authentication & Database
**Status:** 🔴 NOT STARTED — This is the next phase to execute

**Goal:** Users can sign up, log in, see dashboard shell

#### Step 1.1: Supabase Project Setup
**Status:** 🔴 Pending  
**Priority:** Critical  
**Owner:** Database Architect Agent  
**Dependencies:** None

**Tasks:**
- [ ] Create Supabase project (production)
- [ ] Create Supabase project (staging)
- [ ] Configure environment variables
- [ ] Test connection from Next.js

**Deliverable:** Connected Supabase instance

**Acceptance Criteria:**
- Supabase client connects without errors
- Environment variables in `.env.local`
- Connection test passes

---

#### Step 1.2: Database Schema Implementation
**Status:** 🔴 Pending  
**Priority:** Critical  
**Owner:** Database Architect Agent  
**Dependencies:** Step 1.1

**Tasks:**
- [ ] Create `profiles` table (id, email, tier, created_at, updated_at)
- [ ] Create `user_journeys` table (user_id, current_stage, selected_archetype, build_progress, revenue_generated, milestones_achieved, momentum_scores)
- [ ] Create `opportunities` table (id, title, description, archetype, category, difficulty_level, validation_score, trending_score, demand_signals, technical_feasibility, monetization_data, keywords, is_active)
- [ ] Create `revenue` table (id, user_id, amount, source, date, description)
- [ ] Create `templates` table (id, title, content, archetype, tier, is_active)
- [ ] Add indexes for performance
- [ ] Enable RLS on all tables
- [ ] Create RLS policies

**Deliverable:** Complete database schema with migrations

**Acceptance Criteria:**
- All tables created in Supabase
- RLS enabled on every table
- Policies tested with real queries
- Indexes optimized for common queries

**Files to Create:**
- `supabase/migrations/20260330000000_create_profiles_table.sql`
- `supabase/migrations/20260330000001_create_user_journeys_table.sql`
- `supabase/migrations/20260330000002_create_opportunities_table.sql`
- `supabase/migrations/20260330000003_create_revenue_table.sql`
- `supabase/migrations/20260330000004_create_templates_table.sql`

---

#### Step 1.3: Data Layer Implementation
**Status:** 🔴 Pending  
**Priority:** Critical  
**Owner:** Database Architect Agent  
**Dependencies:** Step 1.2

**Tasks:**
- [ ] Implement `StorageAdapter` interface
- [ ] Implement `LocalStorageAdapter` (client-side)
- [ ] Implement `SupabaseStorageAdapter` (server-side)
- [ ] Implement `CacheManager` with TTL and invalidation
- [ ] Implement `BaseRepository<T>` abstract class
- [ ] Implement `ProfileRepository`
- [ ] Implement `UserJourneyRepository`
- [ ] Implement `OpportunityRepository`
- [ ] Implement `RevenueRepository`
- [ ] Add real-time subscription helpers

**Deliverable:** Complete data access layer

**Acceptance Criteria:**
- All repositories have CRUD operations
- Type-safe with TypeScript
- RLS policies respected
- Caching works with TTL
- Real-time subscriptions functional

**Files to Create:**
- `src/lib/data/storage/types.ts`
- `src/lib/data/storage/adapters.ts`
- `src/lib/data/cache/manager.ts`
- `src/lib/data/repositories/types.ts`
- `src/lib/data/repositories/base.ts`
- `src/lib/data/repositories/profile.ts`
- `src/lib/data/repositories/user-journey.ts`
- `src/lib/data/repositories/opportunity.ts`
- `src/lib/data/repositories/revenue.ts`

---

#### Step 1.4: Authentication System
**Status:** 🔴 Pending  
**Priority:** Critical  
**Owner:** Security Agent / Frontend Engineer  
**Dependencies:** Step 1.3

**Tasks:**
- [ ] Configure Supabase Auth (email/password, OAuth)
- [ ] Create `auth/client.ts` with signIn, signUp, signOut
- [ ] Create `auth/server.ts` with server-side client
- [ ] Create `middleware.ts` with auth protection
- [ ] Create login page (`app/login/page.tsx`)
- [ ] Create signup page (`app/signup/page.tsx`)
- [ ] Create forgot password flow
- [ ] Create auth callback handler
- [ ] Create `AuthProvider` context
- [ ] Create `useAuth` hook

**Deliverable:** Complete authentication system

**Acceptance Criteria:**
- Users can sign up with email/password
- Users can log in
- Users can reset password
- Protected routes redirect to login
- Auth state persists across page loads
- RLS policies work with authenticated users

**Files to Create:**
- `src/lib/security/auth/client.ts`
- `src/lib/security/auth/server.ts`
- `middleware.ts`
- `app/login/page.tsx`
- `app/signup/page.tsx`
- `app/forgot-password/page.tsx`
- `app/auth/callback/route.ts`
- `src/lib/context/AuthProvider.tsx`
- `src/hooks/useAuth.ts`

---

#### Step 1.5: Dashboard Shell
**Status:** 🔴 Pending  
**Priority:** High  
**Owner:** Frontend Engineer Agent  
**Dependencies:** Step 1.4

**Tasks:**
- [ ] Create dashboard layout with sidebar
- [ ] Create navigation component
- [ ] Create header with user info
- [ ] Create protected route wrapper
- [ ] Create loading states
- [ ] Create error boundary

**Deliverable:** Working dashboard shell

**Acceptance Criteria:**
- Authenticated users see dashboard
- Sidebar navigation works
- User info displayed in header
- Logout functionality works
- Mobile responsive

**Files to Create:**
- `app/(dashboard)/layout.tsx`
- `app/(dashboard)/dashboard/page.tsx`
- `components/dashboard/Sidebar.tsx`
- `components/dashboard/Header.tsx`
- `components/dashboard/Navigation.tsx`

---

#### Step 1.6: Design System Tokens in Code
**Status:** 🔴 Pending  
**Priority:** High  
**Owner:** Design System Agent  
**Dependencies:** None (can run parallel)

**Tasks:**
- [ ] Create primitive color tokens
- [ ] Create semantic color tokens
- [ ] Create spacing tokens
- [ ] Create typography tokens
- [ ] Create shadow tokens
- [ ] Create border radius tokens
- [ ] Configure Tailwind with custom theme
- [ ] Create CSS variables in globals.css
- [ ] Create ThemeProvider with light/dark mode

**Deliverable:** Complete design system in code

**Acceptance Criteria:**
- All tokens match documentation
- Tailwind config uses tokens
- Theme switching works
- CSS variables defined
- Components can use tokens

**Files to Create:**
- `src/design-system/tokens/primitive/colors.ts`
- `src/design-system/tokens/semantic/colors.ts`
- `src/design-system/tokens/spacing.ts`
- `src/design-system/tokens/typography.ts`
- `src/design-system/tokens/shadows.ts`
- `src/design-system/tokens/radii.ts`
- `src/design-system/themes/light.ts`
- `src/design-system/themes/dark.ts`
- `src/design-system/themes/provider.tsx`
- `tailwind.config.ts` (update)
- `src/app/globals.css` (update)

---

### Phase 2: Opportunity Radar — Core Value Proposition
**Status:** 🔴 NOT STARTED  
**Target:** After Phase 1 complete

**Goal:** Users browse, validate, and select opportunities

#### Step 2.1: AI Router Implementation
**Status:** 🔴 Pending  
**Priority:** Critical  
**Owner:** AI/ML Agent  
**Dependencies:** Phase 1

**Tasks:**
- [ ] Configure Groq provider
- [ ] Configure OpenRouter provider
- [ ] Implement circuit breaker pattern
- [ ] Implement cost tracking
- [ ] Implement caching layer
- [ ] Create fallback strategies
- [ ] Add error handling

**Deliverable:** Multi-provider AI routing

---

#### Step 2.2: Opportunity Validation Engine
**Status:** 🔴 Pending  
**Priority:** Critical  
**Owner:** AI/ML Agent  
**Dependencies:** Step 2.1

**Tasks:**
- [ ] Create validation prompt template
- [ ] Implement 4-dimension scoring (demand, competition, technical, monetization)
- [ ] Create validation result parser
- [ ] Add validation history tracking
- [ ] Cache validation results

**Deliverable:** AI-powered opportunity validation

---

#### Step 2.3: Opportunity Repository Seeding
**Status:** 🔴 Pending  
**Priority:** High  
**Owner:** Database Architect Agent  
**Dependencies:** Step 2.2

**Tasks:**
- [ ] Research and curate 50+ real opportunities
- [ ] Run AI validation on each
- [ ] Seed database with opportunities
- [ ] Categorize by archetype
- [ ] Add trending indicators

**Deliverable:** Populated opportunity database

---

#### Step 2.4: Radar UI Components
**Status:** 🔴 Pending  
**Priority:** High  
**Owner:** Frontend Engineer + UX Agent  
**Dependencies:** Step 2.3

**Tasks:**
- [ ] Create OpportunityCard component
- [ ] Create OpportunityList component
- [ ] Create RadarFilter component (category, archetype, score)
- [ ] Create RadarSort component
- [ ] Create ValidationBadge component
- [ ] Create OpportunityDetail modal/drawer

**Deliverable:** Complete radar interface

---

#### Step 2.5: Opportunity Selection Flow
**Status:** 🔴 Pending  
**Priority:** High  
**Owner:** Frontend Engineer + Backend Agent  
**Dependencies:** Step 2.4

**Tasks:**
- [ ] Create selection API endpoint
- [ ] Update user journey on selection
- [ ] Create commitment modal
- [ ] Add to user's active builds
- [ ] Trigger 14-day launch protocol setup

**Deliverable:** Users can select and commit to opportunities

---

### Phase 3: 14-Day Launch Protocol — Guided Build
**Status:** 🔴 NOT STARTED  
**Target:** After Phase 2 complete

**Goal:** Users actively building with AI guidance

#### Step 3.1: Brain Dump System
**Status:** 🔴 Pending  
**Priority:** High  
**Owner:** Frontend Engineer + Backend Agent  
**Dependencies:** Phase 2

**Tasks:**
- [ ] Create BrainDump modal component
- [ ] Add voice input capability
- [ ] Implement auto-categorization
- [ ] Create scheduling integration
- [ ] Add keyboard shortcut (Cmd/Ctrl+Shift+D)

**Deliverable:** Brain dump capture system

---

#### Step 3.2: Workflow Engine
**Status:** 🔴 Pending  
**Priority:** Critical  
**Owner:** Backend Agent  
**Dependencies:** Phase 2

**Tasks:**
- [ ] Implement workflow engine
- [ ] Define 14-day step sequence
- [ ] Create daily check-in scheduler
- [ ] Add progress tracking
- [ ] Implement milestone detection

**Deliverable:** Workflow orchestration system

---

#### Step 3.3: AI Build Assistant
**Status:** 🔴 Pending  
**Priority:** Critical  
**Owner:** AI/ML Agent  
**Dependencies:** Step 3.2

**Tasks:**
- [ ] Create build assistant prompts
- [ ] Implement context management
- [ ] Add code generation support
- [ ] Create troubleshooting mode
- [ ] Add resource recommendations

**Deliverable:** AI pair programming assistant

---

#### Step 3.4: Build Workspace UI
**Status:** 🔴 Pending  
**Priority:** High  
**Owner:** Frontend Engineer + UX Agent  
**Dependencies:** Step 3.3

**Tasks:**
- [ ] Create build dashboard
- [ ] Add daily task list
- [ ] Create progress indicator
- [ ] Add AI chat interface
- [ ] Create resource library
- [ ] Add milestone celebrations

**Deliverable:** Complete build workspace

---

### Phase 4: Revenue Engine — Monetization Loop
**Status:** 🔴 NOT STARTED  
**Target:** After Phase 3 complete

**Goal:** Users see path from $0 to $1K+ MRR

#### Step 4.1: Revenue Tracking
**Status:** 🔴 Pending  
**Priority:** High  
**Owner:** Frontend + Backend Agent  
**Dependencies:** Phase 3

**Tasks:**
- [ ] Create revenue input form
- [ ] Add revenue history view
- [ ] Create revenue chart
- [ ] Add milestone celebrations
- [ ] Implement revenue validation

**Deliverable:** Revenue tracking system

---

#### Step 4.2: Tier Progression System
**Status:** 🔴 Pending  
**Priority:** Critical  
**Owner:** Backend Agent  
**Dependencies:** Step 4.1

**Tasks:**
- [ ] Implement tier rules engine
- [ ] Create tier unlock logic
- [ ] Add tier benefit notifications
- [ ] Implement feature gating
- [ ] Create tier dashboard

**Deliverable:** Automatic tier progression

---

#### Step 4.3: Momentum Dashboard
**Status:** 🔴 Pending  
**Priority:** Medium  
**Owner:** Frontend Engineer  
**Dependencies:** Step 4.2

**Tasks:**
- [ ] Create momentum score calculator
- [ ] Add progress visualization
- [ ] Create streak tracking
- [ ] Add achievement badges
- [ ] Create gamification elements

**Deliverable:** Engagement and motivation system

---

### Phase 5: Polish + Launch — Production Ready
**Status:** 🔴 NOT STARTED  
**Target:** After Phase 4 complete

**Goal:** Public beta launch

#### Step 5.1: Onboarding Flow
**Status:** 🔴 Pending  
**Priority:** High  
**Owner:** UX + Frontend + Content Agent  
**Dependencies:** Phase 4

**Tasks:**
- [ ] Create welcome sequence
- [ ] Build self-discovery quiz
- [ ] Add archetype matching
- [ ] Create progressive onboarding
- [ ] Add skip options for experienced users

**Deliverable:** Smooth user onboarding

---

#### Step 5.2: Mobile Optimization
**Status:** 🔴 Pending  
**Priority:** Medium  
**Owner:** Frontend Engineer  
**Dependencies:** Phase 4

**Tasks:**
- [ ] Mobile-first responsive design
- [ ] Touch-optimized interactions
- [ ] PWA features (offline, install)
- [ ] Mobile navigation patterns
- [ ] Performance optimization

**Deliverable:** Mobile-ready application

---

#### Step 5.3: Performance Optimization
**Status:** 🔴 Pending  
**Priority:** Medium  
**Owner:** Frontend + DevOps Agent  
**Dependencies:** Phase 4

**Tasks:**
- [ ] Core Web Vitals optimization
- [ ] Image optimization
- [ ] Code splitting
- [ ] Caching strategy
- [ ] Bundle size optimization

**Deliverable:** Fast, performant application

---

#### Step 5.4: Testing & QA
**Status:** 🔴 Pending  
**Priority:** Critical  
**Owner:** QA Agent  
**Dependencies:** Phase 4

**Tasks:**
- [ ] Unit test coverage >80%
- [ ] Integration tests
- [ ] E2E tests (Playwright)
- [ ] Accessibility audit
- [ ] Cross-browser testing
- [ ] Load testing

**Deliverable:** Quality assured application

---

#### Step 5.5: Launch Preparation
**Status:** 🔴 Pending  
**Priority:** Critical  
**Owner:** DevOps + Lead Architect  
**Dependencies:** Phase 4

**Tasks:**
- [ ] Production environment setup
- [ ] Domain configuration
- [ ] SSL certificates
- [ ] Monitoring and alerting
- [ ] Backup strategy
- [ ] Rollback plan
- [ ] Launch checklist

**Deliverable:** Production-ready deployment

---

## Current Status Summary

| Phase | Status | Progress | Next Action |
|-------|--------|----------|-------------|
| 0: Documentation | ✅ Complete | 100% | None |
| 1: Foundation | 🔴 Not Started | 0% | **Step 1.1: Supabase Setup** |
| 2: Opportunity Radar | 🔴 Not Started | 0% | Wait for Phase 1 |
| 3: 14-Day Launch | 🔴 Not Started | 0% | Wait for Phase 2 |
| 4: Revenue Engine | 🔴 Not Started | 0% | Wait for Phase 3 |
| 5: Polish + Launch | 🔴 Not Started | 0% | Wait for Phase 4 |

---

## Autopilot Execution Rules

When `@/autopilot` is invoked:

1. **Read this plan** — Check current status
2. **Execute ONE step at a time** — Complete it fully before moving on
3. **Follow quality standards** — Every deliverable must be:
   - Very-well-planned
   - Very-well-logically-built
   - Very-well-organized
   - Very-well-visually-mapped
   - Very-well-designed
   - Very-well-developed
   - Very-well-written
   - Very-well-structured
   - Very-well-articulated
   - Very-full-detailed-comprehensive
   - Meticulously-crafted
   - High-quality
   - Standalone
   - Combined
   - Internalized
   - Synthesized
   - Self-contained

4. **After each step:**
   - Update this plan (mark step complete)
   - Provide summary of work done
   - Ask user if they want to continue to next step
   - If yes, push to GitHub and deploy if applicable

5. **Never skip steps** — Execute in order unless user explicitly requests otherwise

---

## Document Integrity

**Version:** 1.0.0  
**Created:** March 30, 2026  
**Status:** ACTIVE  
**Owner:** Cascade (Lead Architect Agent)  

**Updates:**
- Updated after each completed step
- Revised when scope changes
- Archived when platform launches

---

**This is the master implementation plan. All work references this document.**
