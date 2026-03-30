# System Architecture Overview

## The 7-Layer FoundryAI Architecture

---

## Document Purpose

This document provides the complete architectural blueprint for FoundryAI. It defines the 7-layer system, explains how layers interact, and establishes the principles guiding all technical decisions.

**Audience:** All AI agents, technical architects, system designers

**Prerequisites:** `00-NORTHSTAR/00-platform-manifesto.md`

---

## Architectural Philosophy

### Core Principles

1. **Separation of Concerns:** Each layer has one responsibility
2. **Contract-Based Communication:** Layers communicate through stable interfaces
3. **Documentation-First:** Architecture drives implementation
4. **Agent-Safe:** Any agent can work in their layer without breaking others
5. **Change-Resilient:** Modifications are isolated and traceable

### The Layer Cake Model

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    LAYER 7: DESIGN SYSTEM                                │
│  Visual Language • Design Tokens • Theme Engine • Component Styling     │
├─────────────────────────────────────────────────────────────────────────┤
│                    LAYER 6: USER EXPERIENCE                              │
│  Interaction Patterns • Motion Design • Accessibility • User Flows      │
├─────────────────────────────────────────────────────────────────────────┤
│                    LAYER 5: PRESENTATION                                 │
│  Next.js 14 • React Server Components • TypeScript • Tailwind           │
├─────────────────────────────────────────────────────────────────────────┤
│                    LAYER 4: LOGIC                                        │
│  Business Rules • Workflow Engine • Event Bus • AI Routing            │
├─────────────────────────────────────────────────────────────────────────┤
│                    LAYER 3: DATA                                         │
│  Supabase • PostgreSQL • Redis • RLS • Repository Pattern             │
├─────────────────────────────────────────────────────────────────────────┤
│                    LAYER 2: AI EXPANSION                               │
│  Multi-Provider AI • Circuit Breaker • Prompt Manager • Failover        │
├─────────────────────────────────────────────────────────────────────────┤
│                    LAYER 1: SECURITY & AGENT COORDINATION              │
│  Auth Hardening • RLS Policies • Agent Protocol • Audit Logging         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Layer 7: Design System

### Responsibility
Define the visual language of FoundryAI. All visual elements—colors, typography, spacing, shapes—originate here.

### Key Components

| Component | Purpose | Owner |
|-----------|---------|-------|
| Design Tokens | Immutable visual values | Design System Agent |
| Theme Engine | Light/dark/custom theme switching | Design System Agent |
| Color System | Semantic color palette | Design System Agent |
| Typography Scale | Font hierarchy and usage | Design System Agent |
| Spacing System | Layout rhythm and consistency | Design System Agent |

### Contract (Interface)

```typescript
// What Layer 7 exposes to Layer 6
interface DesignSystemContract {
  tokens: {
    colors: ColorPalette;
    typography: TypographyScale;
    spacing: SpacingScale;
    shadows: ShadowScale;
    radii: BorderRadiusScale;
  };
  themes: {
    light: Theme;
    dark: Theme;
    custom?: Theme[];
  };
  getCurrentTheme(): Theme;
  setTheme(name: string): void;
  subscribe(callback: (theme: Theme) => void): Unsubscribe;
}
```

### Dependencies
- None (foundational layer)

### Stability Guarantee
**Design tokens NEVER change their semantic meaning.**
- `primary` always means "main brand color"
- `danger` always means "error/destructive"
- Implementation values may change (e.g., blue → purple), semantics don't

---

## Layer 6: User Experience

### Responsibility
Define how users interact with the system. Motion, feedback, accessibility, and flow all originate here.

### Key Components

| Component | Purpose | Owner |
|-----------|---------|-------|
| Interaction Patterns | Hover, focus, active states | UX/Interaction Agent |
| Motion Design | Animations, transitions, gestures | UX/Interaction Agent |
| Accessibility | A11y compliance, keyboard nav | UX/Interaction Agent |
| User Flows | Journey orchestration | UX/Interaction Agent |
| Feedback Systems | Loading, success, error states | UX/Interaction Agent |

### Contract (Interface)

```typescript
// What Layer 6 exposes to Layer 5
interface UXSystemContract {
  patterns: {
    button: ButtonInteraction;
    input: InputInteraction;
    card: CardInteraction;
    modal: ModalInteraction;
  };
  motion: {
    duration: DurationScale;
    easing: EasingFunctions;
    transitions: TransitionPresets;
  };
  accessibility: {
    focusManagement: FocusManager;
    screenReader: ScreenReaderAnnouncer;
    keyboardShortcuts: ShortcutMap;
  };
  applyPattern(element: string, pattern: InteractionPattern): void;
}
```

### Dependencies
- **Layer 7:** Uses design tokens for visual consistency

### Stability Guarantee
**Interaction patterns maintain semantic behavior.**
- Primary button always triggers main action
- Modal always traps focus
- Form submission always shows loading state

---

## Layer 5: Presentation

### Responsibility
Render the user interface. This is where React components live, where pages are composed, and where user input is captured.

### Key Components

| Component | Purpose | Owner |
|-----------|---------|-------|
| Page Components | Route-level page composition | Frontend Engineer Agent |
| Feature Components | Domain-specific UI blocks | Frontend Engineer Agent |
| Shared Primitives | Reusable UI elements | Frontend Engineer Agent |
| State Management | React hooks, context, stores | Frontend Engineer Agent |
| Routing | Next.js App Router configuration | Frontend Engineer Agent |

### Contract (Interface)

```typescript
// What Layer 5 exposes to Layer 4
interface PresentationLayerContract {
  components: {
    pages: Record<string, PageComponent>;
    features: Record<string, FeatureComponent>;
    primitives: Record<string, PrimitiveComponent>;
  };
  hooks: {
    useUser: () => UserContext;
    useTheme: () => ThemeContext;
    useAI: () => AIContext;
  };
  events: {
    emit(event: UIEvent): void;
    subscribe(event: string, handler: Handler): Unsubscribe;
  };
}

// What Layer 5 consumes from Layer 4
interface LogicLayerResponse {
  data: unknown;
  error?: Error;
  loading: boolean;
}
```

### Dependencies
- **Layer 7:** Uses design tokens for styling
- **Layer 6:** Uses interaction patterns for behavior
- **Layer 4:** Consumes business logic and data

### Stability Guarantee
**Components maintain their contract (props interface).**
- `<Button variant="primary">` always works
- `onClick` always receives event
- Component may be reimplemented, interface stays stable

---

## Layer 4: Logic

### Responsibility
Encode business rules, orchestrate workflows, route AI requests, and manage application state.

### Key Components

| Component | Purpose | Owner |
|-----------|---------|-------|
| Business Rules Engine | Rule-based validation/processing | Backend/API Agent |
| Workflow Engine | Multi-step process orchestration | Backend/API Agent |
| Event Bus | Decoupled component communication | Backend/API Agent |
| AI Router | Multi-provider AI request routing | Backend/API Agent |
| Validation Engine | Input/output validation | Backend/API Agent |

### Contract (Interface)

```typescript
// What Layer 4 exposes to Layer 5
interface LogicLayerContract {
  workflows: {
    execute(name: string, context: WorkflowContext): Promise<Result>;
    register(name: string, steps: WorkflowStep[]): void;
  };
  rules: {
    validate<T>(data: T, rules: Rule[]): ValidationResult;
    apply<T>(data: T, ruleSet: string): Promise<T>;
  };
  ai: {
    generate(prompt: string, options?: AIOptions): Promise<AIResponse>;
    chat(messages: Message[], options?: ChatOptions): Promise<ChatResponse>;
  };
  events: EventBus;
}

// What Layer 4 consumes from Layer 3
interface DataLayerContract {
  repositories: Record<string, Repository>;
  queries: QueryBuilder;
  cache: CacheManager;
}
```

### Dependencies
- **Layer 3:** Uses repositories for data persistence
- **Layer 2:** Uses AI providers for intelligence

### Stability Guarantee
**Business rules maintain semantic meaning.**
- "User must be authenticated" always means the same thing
- "Validation score 70+" always triggers the same actions
- Implementation may optimize, behavior stays consistent

---

## Layer 3: Data

### Responsibility
Manage all data persistence, caching, and retrieval. Abstract storage mechanisms from business logic.

### Key Components

| Component | Purpose | Owner |
|-----------|---------|-------|
| Repository Pattern | Data access abstraction | Database Architect Agent |
| Storage Adapters | LocalStorage, Memory, Remote | Database Architect Agent |
| Cache Manager | Multi-level caching | Database Architect Agent |
| Supabase Client | PostgreSQL + Realtime + Auth | Database Architect Agent |
| Migration System | Schema versioning | Database Architect Agent |

### Contract (Interface)

```typescript
// What Layer 3 exposes to Layer 4
interface DataLayerContract {
  repositories: {
    users: UserRepository;
    journeys: JourneyRepository;
    opportunities: OpportunityRepository;
    revenue: RevenueRepository;
    [key: string]: Repository<unknown>;
  };
  cache: {
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T, ttl?: number): Promise<void>;
    invalidate(pattern: string): Promise<void>;
  };
  realtime: {
    subscribe(channel: string, callback: Handler): Unsubscribe;
    publish(channel: string, payload: unknown): Promise<void>;
  };
}

// What Layer 3 consumes from infrastructure
interface DatabaseConnection {
  query(sql: string, params?: unknown[]): Promise<QueryResult>;
  transaction<T>(fn: (trx: Transaction) => Promise<T>): Promise<T>;
}
```

### Dependencies
- **Infrastructure:** PostgreSQL, Redis, Supabase services

### Stability Guarantee
**Repository interfaces maintain CRUD operations.**
- `findById(id)` always returns entity or null
- `save(entity)` always persists or throws
- Schema migrations always maintain backward compatibility

---

## Layer 2: AI Expansion

### Responsibility
Abstract AI provider complexity. Handle failover, caching, prompt management, and cost optimization.

### Key Components

| Component | Purpose | Owner |
|-----------|---------|-------|
| Provider Registry | Multi-provider configuration | AI/ML Agent |
| Circuit Breaker | Failover and health monitoring | AI/ML Agent |
| Prompt Manager | Template and version management | AI/ML Agent |
| Cost Optimizer | Token usage and budgeting | AI/ML Agent |
| Context Manager | Conversation state management | AI/ML Agent |

### Contract (Interface)

```typescript
// What Layer 2 exposes to Layer 4
interface AIExpansionContract {
  generate(options: GenerateOptions): Promise<AIResponse>;
  chat(options: ChatOptions): Promise<ChatResponse>;
  embed(text: string): Promise<number[]>;
  providers: {
    list(): Provider[];
    health(provider: string): HealthStatus;
    switch(provider: string): void;
  };
  prompts: {
    load(name: string, context: unknown): string;
    version: string;
  };
}

type GenerateOptions = {
  prompt: string;
  model?: string;
  provider?: string;
  temperature?: number;
  maxTokens?: number;
};

type AIResponse = {
  content: string;
  provider: string;
  model: string;
  usage: TokenUsage;
  latency: number;
};
```

### Dependencies
- **External:** Groq API, OpenRouter API, other LLM providers

### Stability Guarantee
**AI interface maintains consistent behavior regardless of provider.**
- Same prompt → semantically similar response
- Failover happens transparently
- Cost/quality trade-offs configurable

---

## Layer 1: Security & Agent Coordination

### Responsibility
Protect the system and coordinate multi-agent collaboration. Foundational layer that enables safe parallel work.

### Key Components

| Component | Purpose | Owner |
|-----------|---------|-------|
| Auth Hardening | Secure authentication flows | Security Agent |
| RLS Policies | Database access control | Security Agent |
| Input Sanitization | XSS, injection prevention | Security Agent |
| Agent Protocol | Inter-agent communication standard | Lead Architect |
| Audit Logging | Change tracking and accountability | Security Agent |

### Contract (Interface)

```typescript
// What Layer 1 exposes to all other layers
interface SecurityContract {
  auth: {
    verify(token: string): Promise<UserIdentity>;
    requirePermission(user: User, resource: string, action: string): Promise<void>;
  };
  input: {
    sanitize(html: string): string;
    validateSchema<T>(data: unknown, schema: Schema): T;
  };
  audit: {
    log(action: string, actor: string, details: unknown): void;
  };
}

// Agent Communication Protocol
interface AgentProtocol {
  send(message: AgentMessage): Promise<void>;
  subscribe(filter: MessageFilter, handler: Handler): Unsubscribe;
  requestApproval(request: ChangeRequest): Promise<Approval>;
}
```

### Dependencies
- **External:** Auth providers, security services

### Stability Guarantee
**Security policies are non-negotiable and globally enforced.**
- All data access goes through RLS
- All inputs are sanitized
- All changes are audited

---

## Cross-Cutting Concerns

Concerns that span all layers:

### 1. Error Handling

```typescript
// Uniform error structure
interface FoundryError {
  code: string;
  message: string;
  layer: LayerName;
  context: Record<string, unknown>;
  recoverable: boolean;
  userMessage: string;
}
```

### 2. Logging

```typescript
// Structured logging across layers
interface LogEntry {
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  layer: LayerName;
  agent: string;
  message: string;
  context: unknown;
}
```

### 3. Performance Monitoring

```typescript
// Performance tracking
interface PerformanceMetric {
  name: string;
  layer: LayerName;
  duration: number;
  success: boolean;
  timestamp: string;
}
```

### 4. Feature Flags

```typescript
// Gradual rollout control
interface FeatureFlag {
  name: string;
  enabled: boolean;
  rollout: number; // 0-100
  targeting?: Rule[];
}
```

---

## Data Flow Examples

### Example 1: User Signup

```
User → Layer 5 (Presentation)
  ├── Validates input format (Layer 5)
  ├── Calls signup workflow (Layer 4)
  │   ├── Validates business rules (Layer 4)
  │   ├── Checks if user exists (Layer 3)
  │   ├── Creates user record (Layer 3)
  │   ├── Initializes journey (Layer 3)
  │   └── Logs audit event (Layer 1)
  ├── Receives success response
  └── Redirects to onboarding
```

### Example 2: AI Opportunity Validation

```
User → Layer 5 (Presentation: Radar UI)
  ├── Submits opportunity idea (Layer 5)
  ├── Calls validation workflow (Layer 4)
  │   ├── Prepares AI prompt (Layer 4)
  │   ├── Routes to AI provider (Layer 2)
  │   │   ├── Tries Groq (primary)
  │   │   ├── Falls back to OpenRouter if needed
  │   │   └── Returns AI analysis
  │   ├── Parses AI response (Layer 4)
  │   ├── Calculates validation score (Layer 4)
  │   └── Caches result (Layer 3)
  ├── Receives validation result
  └── Renders score breakdown (Layer 5 + Layer 7)
```

### Example 3: Theme Change

```
User → Layer 5 (Presentation: Settings)
  ├── Clicks "Switch to Dark Mode"
  ├── Calls theme.setTheme('dark') (Layer 6)
  │   ├── Updates theme state (Layer 6)
  │   ├── Notifies subscribers (Layer 6)
  │   └── Persists preference (Layer 3)
  ├── Layer 5 receives theme change event
  ├── Re-renders with new tokens (Layer 7)
  └── All components update automatically
```

---

## Deployment Architecture

### Production Stack

| Layer | Technology | Deployment |
|-------|------------|------------|
| 7, 6, 5 | Next.js 14 | Vercel Edge |
| 4 | Next.js API Routes | Vercel Serverless |
| 3 | Supabase | Supabase Cloud |
| 2 | AI SDK | Edge/Serverless |
| 1 | Auth/Security | Supabase + Vercel |

### Environment Strategy

```
Development → Staging → Production
     │            │           │
  Local        Vercel      Vercel
  Supabase     Preview     Prod
```

---

## Document Integrity

**Version:** 1.0.0  
**Last Updated:** March 30, 2026  
**Status:** ACTIVE  
**Owner:** Lead Architect (Cascade)  

**Related Documents:**
- `03-presentation-layer.md` — Layer 5 deep dive
- `04-logic-layer.md` — Layer 4 deep dive
- `05-data-layer.md` — Layer 3 deep dive
- `06-ai-expansion-layer.md` — Layer 2 deep dive
- `07-design-system-layer.md` — Layer 7 deep dive
- `08-ux-interaction-layer.md` — Layer 6 deep dive
- `09-security-agent-layer.md` — Layer 1 deep dive

**Change Protocol:**
1. Layer boundary changes require Lead Architect approval
2. Contract changes require all affected layer agents to review
3. Architecture Decision Records (ADR) required for structural changes

---

**End of System Architecture Overview. All implementation must align with this structure.**
