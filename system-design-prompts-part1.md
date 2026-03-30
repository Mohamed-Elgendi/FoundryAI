# FoundryAI Complete System Design Prompts for Figma AI

This document contains 10 comprehensive, production-ready prompts for generating complete system design documentation. Each prompt is structured to elicit detailed, actionable, and well-organized design specifications.

---

## PROMPT 1: SYSTEM ARCHITECTURE & TECHNOLOGY STACK

```
Act as a Principal Software Architect with 15+ years of experience designing scalable SaaS applications. 

Create a comprehensive System Architecture Design Document for "FoundryAI" - an AI-powered business planning SaaS platform. The document must follow industry best practices and include:

## 1. EXECUTIVE SUMMARY
- System purpose and core value proposition
- High-level architecture diagram description
- Key technical decisions and rationale
- Scalability targets (users, requests, data volume)

## 2. ARCHITECTURAL STYLE & PATTERNS
- Primary architectural pattern (Microservices, Modular Monolith, Serverless, etc.)
- Justification for chosen pattern
- Layered architecture breakdown:
  * Presentation Layer (Frontend)
  * Application Layer (API/Business Logic)
  * Domain Layer (Core Business Rules)
  * Infrastructure Layer (External Services, Database)

## 3. TECHNOLOGY STACK SPECIFICATION

### Frontend
- Framework: Next.js 14 (App Router)
- Language: TypeScript 5.x
- Styling: Tailwind CSS 3.x
- State Management: React Context + SWR/React Query
- UI Components: shadcn/ui or Radix UI
- Animation: Framer Motion
- Icons: Lucide React

### Backend
- Framework: Next.js API Routes / Node.js
- Language: TypeScript
- API Style: RESTful with OpenAPI specification
- Real-time: Server-Sent Events (SSE) or WebSockets

### Database & Storage
- Primary Database: PostgreSQL (via Supabase)
- Caching: Redis
- File Storage: Supabase Storage
- Search: PostgreSQL Full-Text Search or Algolia

### AI/ML Services
- LLM Provider: OpenAI GPT-4/Claude
- Embedding Model: OpenAI text-embedding-ada-002
- Vector Database: Pinecone or pgvector
- Rate Limiting: Token bucket algorithm

### Authentication & Security
- Provider: Supabase Auth
- OAuth: Google, GitHub
- Session: JWT with refresh tokens
- Encryption: AES-256 for data at rest

### Infrastructure
- Hosting: Vercel (Edge Network)
- CDN: Vercel Edge Network
- Containerization: Docker (for local dev)
- CI/CD: GitHub Actions

## 4. SYSTEM COMPONENT DIAGRAM
Describe each component with:
- Component name and responsibility
- Input/Output interfaces
- Dependencies on other components
- Scaling characteristics

Components to include:
- Web Application (Next.js)
- API Gateway/Route Handlers
- Authentication Service
- Business Plan Generator Service
- Market Research Service
- Financial Modeling Service
- User Management Service
- Payment/Subscription Service (Stripe)
- Notification Service
- AI Orchestration Service

## 5. DATA FLOW DIAGRAMS
Create detailed descriptions for:
- User Registration Flow
- Business Plan Generation Flow
- Payment Processing Flow
- Real-time Plan Refinement Flow
- Data Export Flow

## 6. SCALABILITY CONSIDERATIONS
- Horizontal scaling strategies
- Database sharding/partitioning approach
- Caching layers and strategies
- Load balancing approach
- Auto-scaling triggers and policies

## 7. TECHNICAL CONSTRAINTS & LIMITATIONS
- Rate limits (API, AI requests)
- File size limits
- Concurrent user limits per plan tier
- Geographic restrictions (if any)

## 8. FUTURE ARCHITECTURE ROADMAP
- Planned architectural improvements
- Migration strategies
- Technology debt management

Format: Professional technical documentation with clear headings, bullet points, and tables where appropriate. Include diagrams described in text (Mermaid format where possible).
```

---

## PROMPT 2: DATABASE SCHEMA & DATA MODEL

```
Act as a Senior Database Architect specializing in PostgreSQL and SaaS data modeling.

Create a comprehensive Database Schema Design Document for "FoundryAI" - an AI-powered business planning SaaS platform. The document must include production-ready schema definitions with proper normalization, indexing, and security considerations.

## 1. DATABASE OVERVIEW
- Database selection rationale (PostgreSQL via Supabase)
- Multi-tenancy strategy (Row-Level Security)
- Data classification (PII, sensitive, public)
- Backup and recovery strategy

## 2. ENTITY-RELATIONSHIP MODEL
Complete ERD description with:
- All entities (tables)
- Relationships (1:1, 1:N, M:N)
- Cardinality constraints
- Cascade behaviors

## 3. COMPLETE TABLE SCHEMAS

For EACH table, provide:

### Table: [table_name]
**Purpose:** [Brief description]

| Column Name | Data Type | Constraints | Default | Description |
|-------------|-----------|-------------|---------|-------------|
| id | UUID | PK, NOT NULL | gen_random_uuid() | Primary key |
| ... | ... | ... | ... | ... |

**Indexes:**
- Primary: id
- Secondary: [column] for [purpose]

**Triggers:**
- [trigger_name]: [purpose and implementation]

**RLS Policies:**
- [policy_name]: [definition]

### Tables to define:

1. **users** - User accounts and profiles
2. **subscriptions** - Plan subscriptions and billing status
3. **plans** - Generated business plans
4. **plan_sections** - Individual sections within plans
5. **opportunities** - Market opportunities data
6. **user_feedback** - User ratings and feedback
7. **api_usage** - API call tracking and rate limiting
8. **exports** - Export history and metadata
9. **sessions** - Active user sessions
10. **webhook_events** - Stripe webhook events
11. **refinements** - Plan refinement history
12. **templates** - Business plan templates
13. **industries** - Industry classification data
14. **competitors** - Competitor analysis cache

## 4. DATA TYPES & CONSTRAINTS
- Custom PostgreSQL types (enums, composites)
- Check constraints for data integrity
- Foreign key relationships
- Not null constraints rationale

## 5. INDEXING STRATEGY
Detailed index specifications:
- B-tree indexes for PK and FK
- GiST/GIN indexes for full-text search
- Partial indexes for filtered queries
- Composite indexes for common query patterns
- Index maintenance procedures

## 6. ROW-LEVEL SECURITY (RLS) POLICIES
Complete RLS implementation:
- Enable RLS on all tenant tables
- Create policies for:
  * Users can only see their own data
  * Admins can see all data
  * Service roles for background jobs
- Policy performance considerations

## 7. DATA RETENTION & ARCHIVAL
- Data retention policies by table
- Archival strategy for old plans
- Soft delete vs hard delete decisions
- GDPR compliance (right to erasure)

## 8. MIGRATION STRATEGY
- Schema versioning approach
- Migration rollback procedures
- Zero-downtime migration patterns
- Data migration scripts structure

## 9. PERFORMANCE OPTIMIZATIONS
- Partitioning strategy (if needed)
- Connection pooling configuration
- Query optimization guidelines
- Materialized views for reporting

## 10. SUPABASE-SPECIFIC CONSIDERATIONS
- Real-time subscriptions configuration
- Storage bucket organization
- Edge function triggers
- Auth integration schema

Format: SQL DDL statements wrapped in Markdown code blocks, with clear comments. Include diagrams described in text.
```

---

## PROMPT 3: API DESIGN & ENDPOINT SPECIFICATION

```
Act as a Senior API Architect with expertise in RESTful design, OpenAPI specifications, and developer experience.

Create a comprehensive API Design Document for "FoundryAI" - an AI-powered business planning SaaS platform. This document will serve as the contract between frontend and backend teams and for external developers.

## 1. API DESIGN PRINCIPLES
- RESTful design standards
- Resource-oriented architecture
- HTTP method semantics (GET, POST, PUT, PATCH, DELETE)
- Status code usage guidelines
- Versioning strategy (URL vs Header)

## 2. BASE URL & ENVIRONMENTS
- Production: https://api.foundryai.com/v1
- Staging: https://api-staging.foundryai.com/v1
- Local: http://localhost:3000/api

## 3. AUTHENTICATION & AUTHORIZATION
- Bearer token (JWT) authentication
- Token refresh mechanism
- Rate limiting headers
- Scope-based permissions

## 4. COMMON HEADERS & RESPONSE FORMAT

### Request Headers
```
Authorization: Bearer <token>
Content-Type: application/json
X-Request-ID: <uuid>
X-API-Version: 2024-01-15
```

### Response Format
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "requestId": "uuid",
    "timestamp": "2024-01-15T10:30:00Z"
  },
  "pagination": {
    "page": 1,
    "perPage": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input provided",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  },
  "meta": { ... }
}
```

## 5. ENDPOINT SPECIFICATIONS

For EACH endpoint, provide:

### [METHOD] /[path]
**Summary:** Brief description

**Authentication:** Required/Optional + Scopes

**Request Parameters:**
| Name | Type | Required | Location | Description |
|------|------|----------|----------|-------------|
| ... | ... | ... | ... | ... |

**Request Body:** (if applicable)
```json
{
  "field": "type"
}
```

**Response Codes:**
- 200: Success description
- 400: Validation error
- 401: Unauthorized
- 403: Forbidden
- 404: Not found
- 429: Rate limited
- 500: Server error

**Response Body:**
```json
{ ... }
```

### Endpoints to define:

#### Authentication
- POST /auth/register
- POST /auth/login
- POST /auth/logout
- POST /auth/refresh
- POST /auth/oauth/google
- POST /auth/oauth/github
- POST /auth/forgot-password
- POST /auth/reset-password

#### User Management
- GET /users/me
- PATCH /users/me
- DELETE /users/me
- GET /users/me/subscription

#### Business Plans
- GET /plans (list with filters, pagination)
- POST /plans (create/generate)
- GET /plans/:id
- PATCH /plans/:id (update metadata)
- DELETE /plans/:id
- POST /plans/:id/refine (AI refinement)
- POST /plans/:id/export
- GET /plans/:id/export/:format

#### Opportunities/Radar
- GET /opportunities (list)
- GET /opportunities/:id
- POST /opportunities/save

#### Market Research (AI-powered)
- POST /research/market (async job)
- GET /research/market/:jobId/status
- GET /research/market/:jobId/results

#### Financial Modeling
- POST /financial/projections
- GET /financial/templates

#### Subscriptions & Billing
- GET /subscriptions/plans
- POST /subscriptions (create)
- PATCH /subscriptions/:id (upgrade/downgrade)
- DELETE /subscriptions/:id (cancel)
- GET /billing/history
- POST /billing/portal-session

#### Webhooks
- POST /webhooks/stripe
- POST /webhooks/supabase

## 6. RATE LIMITING SPECIFICATION
- Rate limit tiers by subscription:
  * Free: 10 requests/minute, 100/day
  * Pro: 60 requests/minute, 1000/day
  * Enterprise: 300 requests/minute, unlimited
- Rate limit headers (X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset)
- Burst handling and queue management

## 7. WEBSOCKET/REAL-TIME ENDPOINTS
- Connection establishment
- Event types and payloads
- Reconnection strategy
- Subscription management

## 8. WEBHOOK SPECIFICATION
- Event types delivered
- Payload structure
- Signature verification
- Retry policy with exponential backoff
- Idempotency handling

## 9. SDK & CLIENT LIBRARY DESIGN
- Client initialization
- Authentication handling
- Error handling patterns
- TypeScript type definitions

## 10. API CHANGELOG & DEPRECATION POLICY
- Version lifecycle
- Deprecation notice period
- Sunset headers
- Migration guides

## 11. ERROR CODE CATALOG
Complete list of error codes:
| Code | HTTP Status | Description | Resolution |
|------|-------------|-------------|------------|
| INVALID_TOKEN | 401 | Authentication token expired | Refresh token or re-login |
| ... | ... | ... | ... |

Format: OpenAPI 3.0 specification in YAML, with Markdown documentation for each endpoint.
```

---

## PROMPT 4: FRONTEND ARCHITECTURE & COMPONENT SYSTEM

```
Act as a Senior Frontend Architect specializing in React, Next.js, and design systems.

Create a comprehensive Frontend Architecture Document for "FoundryAI" - an AI-powered business planning SaaS platform. This document will guide the implementation of a scalable, maintainable, and performant frontend.

## 1. ARCHITECTURE OVERVIEW
- Framework: Next.js 14 with App Router
- Rendering strategy (SSR, SSG, ISR, Client Components)
- Directory structure and organization
- Module boundary definitions

## 2. DIRECTORY STRUCTURE
```
app/
├── (marketing)/          # Marketing pages (landing, pricing)
├── (dashboard)/          # Authenticated dashboard routes
│   ├── dashboard/
│   ├── plan/
│   ├── plans/
│   ├── radar/
│   └── settings/
├── api/                  # API routes
├── layout.tsx           # Root layout
└── error.tsx            # Global error boundary

components/
├── ui/                  # Base UI components (shadcn)
├── foundryai/          # Feature-specific components
├── dashboard/          # Dashboard components
├── marketing/          # Landing page components
└── shared/             # Shared utilities

lib/
├── auth/               # Authentication logic
├── db/                 # Database clients
├── layers/             # Layer architecture
├── theme/              # Theme management
├── utils/              # Utilities
└── hooks/              # Custom React hooks

types/
├── api.ts              # API types
├── models.ts           # Data models
└── index.ts            # Type exports

public/
├── images/
├── fonts/
└── icons/
```

## 3. COMPONENT ARCHITECTURE

### Component Classification
1. **Server Components** (default)
   - Data fetching
   - SEO-critical content
   - Static layouts

2. **Client Components** ('use client')
   - Interactivity required
   - Browser APIs
   - State management
   - Event handlers

### Component Patterns
- Compound components
- Render props (legacy migration)
- Custom hooks pattern
- Higher-order components (avoid)

## 4. STATE MANAGEMENT STRATEGY

### Global State
- React Context for:
  * Authentication state
  * Theme state
  * UI state (sidebar, modals)

### Server State
- SWR or React Query for:
  * API data fetching
  * Caching and revalidation
  * Optimistic updates
  * Background refetching

### Local State
- useState for component-level state
- useReducer for complex state logic

## 5. DESIGN SYSTEM SPECIFICATION

### Color Tokens
```typescript
// tailwind.config.ts extension
colors: {
  primary: {
    50: '#f5f3ff',
    100: '#ede9fe',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
  },
  // ... full color scale
}
```

### Typography Scale
- Heading 1: 2.5rem/40px, font-bold
- Heading 2: 2rem/32px, font-bold
- Heading 3: 1.5rem/24px, font-semibold
- Body: 1rem/16px, font-normal
- Small: 0.875rem/14px, font-normal

### Spacing Scale
Based on Tailwind's 4px grid:
- xs: 4px (1)
- sm: 8px (2)
- md: 16px (4)
- lg: 24px (6)
- xl: 32px (8)
- 2xl: 48px (12)

### Component Primitives
Specify for each:
- Button (variants: primary, secondary, ghost, danger)
- Input (states: default, focus, error, disabled)
- Card (variants: default, outlined, elevated)
- Badge (variants: default, success, warning, error)
- Modal/Dialog
- Dropdown Menu
- Toast/Notification
- Skeleton (loading states)

## 6. CUSTOM HOOKS LIBRARY

Document each hook:

### useAuth()
- Returns: { user, isLoading, signIn, signOut, ... }
- Purpose: Authentication state and methods

### usePlans()
- Returns: { plans, isLoading, createPlan, deletePlan, ... }
- Purpose: Business plan CRUD operations

### useSubscription()
- Returns: { subscription, isPro, ... }
- Purpose: Subscription status and features

### useTheme()
- Returns: { theme, toggleTheme, ... }
- Purpose: Dark/light mode management

### useLocalStorage(key, initialValue)
- Purpose: Persist state to localStorage

### useDebounce(value, delay)
- Purpose: Debounce rapid changes

### useMediaQuery(query)
- Purpose: Responsive design hooks

## 7. ROUTING & NAVIGATION

### Route Structure
- Public routes: /, /pricing, /login, /signup
- Protected routes: /dashboard, /plan, /plans, /settings
- API routes: /api/*

### Navigation Patterns
- Breadcrumb implementation
- Active state management
- Deep linking support

## 8. DATA FETCHING PATTERNS

### Server Components
```typescript
async function PlansPage() {
  const plans = await getPlans(); // Server-side fetch
  return <PlansList plans={plans} />;
}
```

### Client Components
```typescript
function PlansList() {
  const { data: plans, isLoading } = useSWR('/api/plans', fetcher);
  // ...
}
```

### Mutation Patterns
- Optimistic updates
- Error handling
- Loading states

## 9. FORM HANDLING

### Form Library: React Hook Form + Zod

Pattern specification:
```typescript
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

function LoginForm() {
  const form = useForm({
    resolver: zodResolver(schema),
  });
  // ...
}
```

## 10. ERROR HANDLING

### Error Boundaries
- Global error boundary (error.tsx)
- Feature-level error boundaries
- Error logging to monitoring service

### Error States
- 404 handling (not-found.tsx)
- API error handling
- Form validation errors

## 11. PERFORMANCE OPTIMIZATION

### Code Splitting
- Route-based splitting (automatic in Next.js)
- Component-level lazy loading
- Dynamic imports for heavy components

### Image Optimization
- Next.js Image component usage
- Responsive image sizing
- Format optimization (WebP, AVIF)

### Bundle Optimization
- Tree shaking
- Dead code elimination
- Dependency analysis

### Rendering Optimization
- useMemo for expensive computations
- useCallback for stable references
- React.memo for pure components

## 12. TESTING STRATEGY

### Unit Tests (Vitest)
- Component testing with React Testing Library
- Hook testing
- Utility function testing

### Integration Tests (Playwright)
- Critical user flows
- Cross-browser testing
- Mobile responsiveness

### E2E Tests
- Authentication flows
- Plan creation workflow
- Payment flows (Stripe)

## 13. ACCESSIBILITY (A11Y)

### Requirements
- WCAG 2.1 AA compliance
- Screen reader support
- Keyboard navigation
- Focus management
- Color contrast (4.5:1 minimum)

### Implementation
- ARIA labels and roles
- Semantic HTML
- Focus indicators
- Skip links

## 14. ANIMATION & MOTION

### Philosophy
- Purposeful, not decorative
- Respect prefers-reduced-motion
- Performance-first (GPU-accelerated)

### Patterns
- Page transitions
- Loading states
- Micro-interactions
- Scroll animations

Format: Complete technical specification with code examples in TypeScript/TSX.
```

---

## PROMPT 5: AUTHENTICATION & SECURITY ARCHITECTURE

```
Act as a Security Architect specializing in SaaS authentication, authorization, and data protection.

Create a comprehensive Security Architecture Document for "FoundryAI" - an AI-powered business planning SaaS platform. This document must address OWASP Top 10, compliance requirements, and industry best practices.

## 1. SECURITY OVERVIEW
- Threat model summary
- Security principles (defense in depth, least privilege, etc.)
- Compliance requirements (GDPR, SOC 2 considerations)
- Security ownership and responsibilities

## 2. AUTHENTICATION ARCHITECTURE

### Identity Provider
- Supabase Auth as primary IdP
- JWT-based session management
- Token structure and claims

### Authentication Methods
1. **Email/Password**
   - Password requirements (min 8 chars, complexity)
   - bcrypt hashing with salt rounds
   - Account lockout after failed attempts

2. **OAuth 2.0 (Social Login)**
   - Google OAuth 2.0
   - GitHub OAuth
   - Token exchange flow
   - Account linking strategy

3. **Magic Links** (optional)
   - Email-based passwordless login
   - Token expiration (15 minutes)

### Session Management
- Access token lifetime (1 hour)
- Refresh token lifetime (7 days)
- Refresh token rotation
- Concurrent session handling
- Session invalidation (logout, password change)

### Multi-Factor Authentication (MFA)
- TOTP-based MFA (Google Authenticator)
- Backup recovery codes
- Enforced MFA for Enterprise plans

## 3. AUTHORIZATION ARCHITECTURE

### Access Control Model
- Role-Based Access Control (RBAC)
- Attribute-Based Access Control (ABAC) for features

### Roles Definition
| Role | Permissions | Description |
|------|-------------|-------------|
| User | Own plans CRUD, own profile | Standard user |
| Admin | All users/plans, system settings | Internal admin |
| Support | Read user data, moderate | Customer support |

### Resource-Level Permissions
- User can only access own plans
- Plan sharing permissions (read-only, edit)
- Team/organization permissions (Enterprise)

### Implementation
- Supabase Row Level Security (RLS)
- Middleware route protection
- API route authorization checks

## 4. DATA PROTECTION

### Encryption at Rest
- Database: AES-256 (managed by Supabase)
- File storage: Server-side encryption
- Backups: Encrypted

### Encryption in Transit
- TLS 1.3 for all connections
- HSTS headers
- Secure cookie flags

### Sensitive Data Handling
- PII classification
- Data minimization principles
- Secure deletion procedures

## 5. API SECURITY

### Input Validation
- Strict schema validation (Zod)
- SQL injection prevention (parameterized queries)
- XSS prevention (output encoding)
- CSRF protection (SameSite cookies)

### Rate Limiting
- Tiered rate limits by subscription
- IP-based and user-based limiting
- DDoS protection via Vercel/Vercel Edge

### API Authentication
- Bearer token validation
- API key support (Enterprise)
- Scope validation

## 6. VULNERABILITY PROTECTION

### OWASP Top 10 Mitigation
1. **Broken Access Control** - RLS, middleware checks
2. **Cryptographic Failures** - Proper encryption, key management
3. **Injection** - Parameterized queries, input sanitization
4. **Insecure Design** - Security by design principles
5. **Security Misconfiguration** - Hardened configs
6. **Vulnerable Components** - Dependency scanning
7. **Authentication Failures** - MFA, strong passwords
8. **Data Integrity Failures** - Digital signatures
9. **Logging Failures** - Security event logging
10. **Server-Side Request Forgery** - URL validation

### Additional Protections
- Content Security Policy (CSP)
- X-Frame-Options (clickjacking)
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy

## 7. SECRETS MANAGEMENT

### Environment Variables
- DATABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- OPENAI_API_KEY
- STRIPE_SECRET_KEY
- JWT_SECRET
- ENCRYPTION_KEY

### Best Practices
- No secrets in code
- Environment-specific secrets
- Secret rotation procedures
- Local development secrets management

## 8. AUDITING & MONITORING

### Security Events to Log
- Authentication attempts (success/failure)
- Authorization failures
- Data access (sensitive operations)
- Configuration changes
- Admin actions

### Log Format
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "event": "auth.login",
  "userId": "uuid",
  "ip": "1.2.3.4",
  "userAgent": "...",
  "success": true,
  "metadata": {}
}
```

### Alerting
- Unusual login patterns
- Rate limit exceeded
- Failed authentication spikes
- Admin activity

## 9. INCIDENT RESPONSE

### Incident Classification
- P1: Data breach, system compromise
- P2: Authentication bypass
- P3: Unauthorized access
- P4: Security misconfiguration

### Response Procedures
1. Detection and identification
2. Containment
3. Investigation
4. Remediation
5. Communication
6. Post-incident review

## 10. PENETRATION TESTING

### Scope
- Web application
- API endpoints
- Authentication flows
- Payment integration

### Frequency
- Annual third-party pen test
- Quarterly internal scans
- Continuous automated scanning

## 11. COMPLIANCE & PRIVACY

### GDPR Compliance
- Data processing agreements
- Consent management
- Right to access, portability, erasure
- Data breach notification (72 hours)

### Data Retention
- User data: Duration of account + 30 days
- Logs: 90 days
- Backups: 30 days

### Privacy by Design
- Data minimization
- Purpose limitation
- Storage limitation

## 12. THIRD-PARTY SECURITY

### Vendor Assessment
- OpenAI (LLM processing)
- Supabase (database/auth)
- Stripe (payments)
- Vercel (hosting)

### Requirements
- SOC 2 Type II preferred
- Data processing agreements
- Security questionnaires

## 13. DEVELOPMENT SECURITY

### Secure Development Lifecycle
- Security requirements in planning
- Secure code review checklist
- SAST/DAST integration
- Pre-commit hooks (secret scanning)

### Dependency Management
- npm audit automation
- Dependabot/ Renovate
- License compliance

Format: Security-focused technical documentation with clear procedures and implementation guidance.
```

---

## PROMPT 6: AI/ML SYSTEM ARCHITECTURE

```
Act as an AI Systems Architect with expertise in LLM integration, prompt engineering, and AI service architecture.

Create a comprehensive AI System Architecture Document for "FoundryAI" - an AI-powered business planning SaaS platform. This document covers the integration of Large Language Models (LLMs) and AI services.

## 1. AI SYSTEM OVERVIEW
- AI capabilities in the product
- LLM provider selection and rationale
- AI service architecture pattern
- Cost and performance considerations

## 2. LLM PROVIDER STRATEGY

### Primary Provider: OpenAI
- Model selection by use case:
  * GPT-4 Turbo: Complex business plan generation
  * GPT-4: Detailed market analysis
  * GPT-3.5 Turbo: Quick refinements, simple queries
  * text-embedding-ada-002: Semantic search

### Fallback Strategy
- Circuit breaker pattern for provider outages
- Secondary provider (Claude/Anthropic)
- Graceful degradation

### Rate Limits & Quotas
- Tier-based limits:
  * Free: 50 requests/day
  * Pro: 500 requests/day
  * Enterprise: 2000 requests/day
- Token usage tracking
- Cost per user calculation

## 3. PROMPT ENGINEERING SYSTEM

### Prompt Structure
```
[SYSTEM INSTRUCTION]
You are an expert business consultant with 20 years of experience...

[CONTEXT]
Industry: {industry}
Business Model: {model}
Target Market: {market}

[TASK]
Generate a comprehensive executive summary...

[OUTPUT FORMAT]
JSON structure with sections...

[CONSTRAINTS]
- Max 1000 words
- Professional tone
- Include specific metrics
```

### Prompt Templates
Document each prompt:

1. **Business Plan Generator**
   - Input: Business idea, industry, target market
   - Output: Complete business plan structure
   - Token estimate: 3000-4000 tokens

2. **Market Research Assistant**
   - Input: Industry, location, target demographic
   - Output: Market size, trends, competitors
   - Token estimate: 2000-3000 tokens

3. **Financial Projections Generator**
   - Input: Revenue model, costs, growth assumptions
   - Output: 3-year financial forecast
   - Token estimate: 2000 tokens

4. **Plan Refinement Assistant**
   - Input: Existing plan section, user feedback
   - Output: Improved section
   - Token estimate: 1500-2500 tokens

### Prompt Versioning
- Semantic versioning for prompts
- A/B testing capability
- Rollback procedures

## 4. AI ORCHESTRATION LAYER

### Service Architecture
```
┌─────────────────┐
│  API Request    │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Request Queue   │ (Redis/Bull)
└────────┬────────┘
         ▼
┌─────────────────┐
│  Orchestrator   │ (Node.js/Bull Worker)
└────────┬────────┘
         ▼
┌─────────────────┐
│  LLM Provider   │ (OpenAI API)
└────────┬────────┘
         ▼
┌─────────────────┐
│ Response Parser │
└────────┬────────┘
         ▼
┌─────────────────┐
│  Post-Process   │ (Validation, Formatting)
└────────┬────────┘
         ▼
┌─────────────────┐
│   Store Result  │ (Database)
└─────────────────┘
```

### Job Queue System
- BullMQ for job management
- Priority queues (paid users higher priority)
- Retry logic with exponential backoff
- Dead letter queue for failed jobs

### Processing Modes
1. **Synchronous** (for quick operations)
   - Timeout: 30 seconds
   - Use cases: Refinements, quick analysis

2. **Asynchronous** (for complex generation)
   - Webhook/SSE notification on completion
   - Use cases: Full business plan generation
   - Progress tracking

## 5. CONTEXT MANAGEMENT

### Context Window Optimization
- Sliding window for long conversations
- Summary injection for context preservation
- Relevant document retrieval

### RAG (Retrieval-Augmented Generation)
- Vector database: Pinecone or pgvector
- Embedding model: text-embedding-ada-002
- Chunking strategy: 500 tokens, 100 overlap
- Similarity search: Cosine similarity, top-k=5

## 6. OUTPUT PARSING & VALIDATION

### Structured Output
- JSON mode (response_format: { type: "json_object" })
- Zod schema validation
- Fallback to regex extraction

### Quality Checks
- Content length validation
- Required field presence
- Tone consistency check
- Hallucination detection (fact-checking)

### Error Recovery
- Retry with modified prompt
- Fallback to simpler model
- Human-in-the-loop for critical failures

## 7. COST OPTIMIZATION

### Token Optimization
- Prompt compression techniques
- Context pruning
- Model selection based on complexity

### Caching Strategy
- Semantic caching (similar queries)
- Result caching for identical inputs
- Cache TTL: 24 hours

### Smart Routing
- Simple queries → GPT-3.5
- Complex analysis → GPT-4
- Code generation → GPT-4 Turbo

## 8. AI SAFETY & ETHICS

### Content Filtering
- Input moderation (OpenAI Moderation API)
- Output safety checks
- Sensitive topic detection

### Bias Mitigation
- Diverse training data considerations
- Regular bias audits
- User feedback incorporation

### Transparency
- AI-generated content labeling
- Confidence scoring
- Source citation where applicable

## 9. MONITORING & ANALYTICS

### Key Metrics
- Token usage per user/request
- Cost per generation
- Latency (time to first token, total time)
- Error rates by prompt type
- User satisfaction scores

### Logging
```json
{
  "event": "ai.generation.complete",
  "model": "gpt-4",
  "tokens": { "prompt": 1200, "completion": 2500 },
  "cost": 0.042,
  "duration": 4500,
  "success": true,
  "cache_hit": false
}
```

### Alerting
- Cost threshold exceeded
- Error rate spike
- Latency degradation
- Provider outage

## 10. TESTING & EVALUATION

### Prompt Testing
- Unit tests for each prompt template
- Golden dataset for regression testing
- A/B test framework

### Evaluation Metrics
- BLEU/ROUGE scores (comparing to reference)
- Human evaluation rubric
- Business metric correlation

### Continuous Improvement
- Feedback loop from users
- Prompt refinement workflow
- Model upgrade strategy

## 11. SCALABILITY CONSIDERATIONS

### Horizontal Scaling
- Worker pool auto-scaling
- Queue depth monitoring
- Load balancing across workers

### Rate Limiting
- Per-user rate limiting
- Global rate limiting
- Queue prioritization

### Disaster Recovery
- Backup LLM providers
- Degraded mode operations
- Data retention for regeneration

## 12. INTEGRATION PATTERNS

### Real-time Streaming
- Server-Sent Events for progressive responses
- Token-by-token display
- Cancellation support

### Batch Processing
- Bulk job submission
- Progress reporting
- Result aggregation

Format: Technical specification with code examples, diagrams, and implementation details.
```

---

Continue with prompts 7-10 in the next sections...
