# FoundryAI Complete System Design Prompts - Part 2

## PROMPT 7: INFRASTRUCTURE & DEPLOYMENT ARCHITECTURE

```
Act as a DevOps Architect with expertise in cloud infrastructure, CI/CD pipelines, and SaaS deployment strategies.

Create a comprehensive Infrastructure & Deployment Architecture Document for "FoundryAI" - an AI-powered business planning SaaS platform. This document covers hosting, scaling, and operational infrastructure.

## 1. INFRASTRUCTURE OVERVIEW
- Deployment strategy (Serverless vs Containers vs VMs)
- Cloud provider selection rationale
- Multi-region considerations
- Cost optimization strategy

## 2. CLOUD ARCHITECTURE

### Primary Platform: Vercel (Frontend + Edge Functions)
**Rationale:**
- Global Edge Network for low latency
- Automatic scaling
- Built-in CI/CD from Git
- Next.js native optimization

**Configuration:**
- Production: Pro plan with Analytics
- Team collaboration enabled
- Custom domain with SSL
- Edge Network enabled

### Database: Supabase (PostgreSQL)
**Configuration:**
- Region: Close to primary user base
- Compute: Auto-scaling based on connections
- Storage: Row-level security enabled
- Backups: Daily automated + 7-day retention
- Point-in-time recovery enabled

### Alternative/Supplementary Services
- Redis: Upstash (serverless Redis)
- File Storage: Supabase Storage
- Monitoring: Vercel Analytics + Logflare
- Error Tracking: Sentry

## 3. ENVIRONMENT STRATEGY

### Environment Tiers
1. **Local Development**
   - Next.js dev server
   - Local Supabase (Docker)
   - Environment: `.env.local`

2. **Staging/Preview**
   - Vercel Preview Deployments (per-branch)
   - Supabase staging project
   - Automated deployments on PR

3. **Production**
   - Vercel Production
   - Supabase production project
   - Manual promotion from staging
   - Protected environment variables

### Environment Variables Management
```
# Database
DATABASE_URL (encrypted)
SUPABASE_SERVICE_ROLE_KEY (encrypted)

# Authentication
JWT_SECRET (encrypted)
NEXTAUTH_SECRET (encrypted)

# AI Services
OPENAI_API_KEY (encrypted)
ANTHROPIC_API_KEY (encrypted)

# Payments
STRIPE_SECRET_KEY (encrypted)
STRIPE_WEBHOOK_SECRET (encrypted)

# Monitoring
SENTRY_DSN
LOGFLARE_API_KEY
```

## 4. CI/CD PIPELINE

### GitHub Actions Workflow
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
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build

  deploy-preview:
    if: github.event_name == 'pull_request'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: vercel/action-deploy@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          github-token: ${{ secrets.GITHUB_TOKEN }}

  deploy-production:
    if: github.ref == 'refs/heads/main'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: vercel/action-deploy@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
          production: true
```

### Deployment Checklist
- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] Security scan clean
- [ ] Database migrations ready
- [ ] Environment variables set
- [ ] Feature flags configured
- [ ] Monitoring alerts active

## 5. SCALING STRATEGY

### Auto-Scaling Configuration
**Vercel Functions:**
- Concurrent function limit: 1000
- Execution timeout: 60 seconds (API routes)
- Memory allocation: 1024MB (adjust per function)

**Database Connection Pooling:**
- Supabase connection pooler enabled
- Max connections: 100 (scales with compute)
- Connection timeout: 30 seconds

### Traffic Scaling Patterns
1. **Normal Load**
   - Standard Vercel deployment
   - Database on default compute

2. **High Traffic Events**
   - Pre-warm function instances
   - Database compute upgrade (temporary)
   - Enable read replicas if available

3. **Viral/Growth Spikes**
   - Vercel Enterprise support contact
   - Database connection pooling increase
   - Consider Edge caching strategy

## 6. DISASTER RECOVERY

### Backup Strategy
**Database:**
- Automated daily backups (7-day retention)
- Manual backups before major releases
- Cross-region backup storage
- Recovery Time Objective (RTO): 1 hour
- Recovery Point Objective (RPO): 24 hours

**Application Code:**
- GitHub as source of truth
- Immutable deployments on Vercel
- Rollback capability (instant via Vercel dashboard)

### Failover Procedures
1. **Database Failover**
   - Supabase automatic failover (multi-AZ)
   - Read replica promotion if needed
   - Application reconnection logic

2. **Application Failover**
   - Vercel automatic traffic routing
   - Previous deployment instant rollback
   - Static fallback page (maintenance mode)

## 7. SECURITY HARDENING

### Network Security
- DDoS protection (Vercel built-in + Cloudflare if needed)
- IP allowlisting for database (if applicable)
- VPC for sensitive services (if self-hosted)

### Application Security
- HTTPS only (HSTS enabled)
- Secure headers (CSP, X-Frame-Options, etc.)
- WAF rules (Web Application Firewall)

### Secrets Management
- No secrets in code (git-secrets, pre-commit hooks)
- Vercel Environment Variables (encrypted)
- Local: `.env.local` (gitignored)
- Rotation schedule: Quarterly

## 8. COST OPTIMIZATION

### Compute Optimization
- Use Edge Functions for simple operations
- Database query optimization (indexes, N+1 prevention)
- Image optimization (Next.js Image component)
- Bundle size monitoring

### AI Cost Management
- Token usage monitoring per user
- Request caching for common queries
- Model selection based on complexity
- Rate limiting to prevent abuse

### Monitoring Costs
- Vercel Analytics (included in Pro)
- Supabase monitoring (within limits)
- Log retention policies

## 9. MAINTENANCE PROCEDURES

### Regular Maintenance
- **Weekly:** Security patch review
- **Monthly:** Dependency updates (minor versions)
- **Quarterly:** Major dependency upgrades, secret rotation
- **Annually:** Architecture review, cost optimization audit

### Zero-Downtime Deployments
- Database migrations: Expand-contract pattern
- Feature flags for gradual rollout
- Blue-green deployment capability (Vercel)
- Health checks before traffic routing

## 10. INFRASTRUCTURE AS CODE (IaC)

### Terraform/Supabase CLI
```bash
# Supabase project management
supabase link --project-ref <project-id>
supabase db push
supabase functions deploy

# Infrastructure provisioning (if needed)
terraform plan
terraform apply
```

### Version Control
- Infrastructure changes in Git
- Code review for infrastructure changes
- Automated testing where possible

Format: Infrastructure documentation with specific configurations, commands, and procedures.
```

---

## PROMPT 8: TESTING STRATEGY & QUALITY ASSURANCE

```
Act as a QA Architect with expertise in test automation, quality metrics, and continuous testing practices.

Create a comprehensive Testing Strategy Document for "FoundryAI" - an AI-powered business planning SaaS platform. This document ensures reliability, performance, and user satisfaction.

## 1. TESTING PHILOSOPHY
- Shift-left testing (catch early)
- Automated-first approach
- Risk-based testing prioritization
- Continuous quality feedback

## 2. TEST PYRAMID STRUCTURE

### Unit Tests (70% of tests)
**Tools:** Vitest + React Testing Library

**Coverage Targets:**
- Business logic: 90%
- Utilities: 95%
- Components: 80%

**Testing Patterns:**
```typescript
// Component test example
describe('PlanCard', () => {
  it('renders plan details correctly', () => {
    render(<PlanCard plan={mockPlan} />);
    expect(screen.getByText(mockPlan.title)).toBeInTheDocument();
  });

  it('calls onDelete when delete button clicked', async () => {
    const onDelete = vi.fn();
    render(<PlanCard plan={mockPlan} onDelete={onDelete} />);
    await user.click(screen.getByRole('button', { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledWith(mockPlan.id);
  });
});
```

**What to Test:**
- Component rendering
- User interactions
- State changes
- Props validation
- Hook behavior
- Utility functions

### Integration Tests (20% of tests)
**Tools:** Vitest + MSW (Mock Service Worker)

**Focus Areas:**
- API integration
- Database operations
- Authentication flows
- State management
- Third-party services (mocked)

**Patterns:**
```typescript
// API integration test
it('creates plan via API', async () => {
  server.use(
    http.post('/api/plans', async ({ request }) => {
      const body = await request.json();
      return HttpResponse.json({ id: '123', ...body });
    })
  );

  const result = await createPlan({ title: 'Test Plan' });
  expect(result.id).toBeDefined();
});
```

### E2E Tests (10% of tests)
**Tools:** Playwright

**Critical User Journeys:**
1. User Registration & Onboarding
2. Business Plan Creation (full flow)
3. Plan Refinement
4. Subscription Upgrade
5. Export Functionality
6. Settings Management

**Test Structure:**
```typescript
// E2E test example
test('user can create a business plan', async ({ page }) => {
  await page.goto('/plan');
  
  // Step 1: Enter business idea
  await page.fill('[data-testid="idea-input"]', 'Sustainable coffee subscription');
  await page.selectOption('[data-testid="industry-select"]', 'Food & Beverage');
  
  // Step 2: Submit
  await page.click('[data-testid="generate-button"]');
  
  // Step 3: Wait for generation
  await page.waitForSelector('[data-testid="plan-result"]', { timeout: 60000 });
  
  // Step 4: Assertions
  await expect(page.locator('[data-testid="plan-title"]')).toContainText('Coffee');
});
```

## 3. TEST CATEGORIES

### Functional Testing
- **Positive cases:** Happy path scenarios
- **Negative cases:** Error handling, invalid inputs
- **Boundary cases:** Edge values, limits
- **State transitions:** User workflow progression

### Non-Functional Testing
- **Performance:** Page load < 2s, API response < 500ms
- **Accessibility:** WCAG 2.1 AA compliance (axe-core)
- **Security:** Auth bypass attempts, injection testing
- **SEO:** Meta tags, structured data, Lighthouse scores

### AI-Specific Testing
- **Prompt testing:** Golden dataset validation
- **Output validation:** Schema compliance, quality metrics
- **Cost monitoring:** Token usage limits
- **Fallback testing:** Provider failure scenarios

## 4. TEST DATA MANAGEMENT

### Fixtures
```typescript
// fixtures/plans.ts
export const mockPlan = {
  id: 'plan-123',
  title: 'Eco-Friendly Packaging Startup',
  industry: 'Manufacturing',
  status: 'completed',
  createdAt: '2024-01-15T10:00:00Z',
  sections: [...]
};
```

### Test Database
- Separate Supabase project for testing
- Seed data for consistent tests
- Reset between test runs

### Factories
- Generate realistic test data
- Randomized data for edge cases
- FactoryBot-style helpers

## 5. CONTINUOUS TESTING INTEGRATION

### Pre-Commit Hooks
```json
{
  "husky": {
    "pre-commit": [
      "lint-staged",
      "npm run test:changed"
    ]
  }
}
```

### CI Pipeline Integration
```yaml
# .github/workflows/test.yml
test:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - run: npm ci
    - run: npm run lint
    - run: npm run typecheck
    - run: npm run test:unit -- --coverage
    - run: npm run test:integration
    - run: npm run test:e2e
    - uses: codecov/codecov-action@v3
```

### Coverage Reporting
- Codecov integration
- Coverage badges in README
- Coverage diffs in PRs

## 6. PERFORMANCE TESTING

### Load Testing
**Tools:** k6 or Artillery

**Scenarios:**
- 100 concurrent users creating plans
- API rate limit validation
- Database connection pool stress

**Metrics:**
- Response time P50, P95, P99
- Error rate < 0.1%
- Throughput (requests/second)

### Browser Performance
- Lighthouse CI integration
- Performance budgets
- Core Web Vitals monitoring

## 7. VISUAL TESTING

### Visual Regression
**Tools:** Chromatic or Percy

**Coverage:**
- Component stories (Storybook)
- Critical page screenshots
- Responsive breakpoints
- Dark mode variants

## 8. EXPLORATORY TESTING

### Manual Testing Strategy
- New feature validation
- Edge case discovery
- UX flow verification
- Cross-browser checks

### Bug Bash Sessions
- Monthly team testing sessions
- Focus on specific areas
- Reward system for findings

## 9. TEST ENVIRONMENT MANAGEMENT

### Environments
1. **Local:** Developer machines
2. **CI:** Ephemeral test runs
3. **Staging:** Pre-production validation
4. **Production:** Smoke tests, monitoring

### Data Isolation
- No production data in tests
- Synthetic data generation
- Database per test suite

## 10. QUALITY METRICS & KPIs

### Primary Metrics
- **Test Coverage:** > 80% overall
- **Defect Escape Rate:** < 5% to production
- **Mean Time To Detection:** < 1 hour
- **Test Execution Time:** < 10 minutes (CI)

### Secondary Metrics
- Flaky test rate < 1%
- Bug reopen rate < 10%
- Customer-reported bugs trend

### Dashboards
- Real-time test status
- Coverage trends
- Performance regression alerts

## 11. TEST MAINTENANCE

### Test Refactoring
- Regular test code review
- Eliminate flaky tests immediately
- Update tests with code changes
- Remove obsolete tests

### Documentation
- Test purpose documentation
- Test data explanation
- Known limitations noted

Format: Comprehensive testing guide with implementation examples and integration instructions.
```

---

## PROMPT 9: MONITORING, OBSERVABILITY & INCIDENT MANAGEMENT

```
Act as a Site Reliability Engineer (SRE) with expertise in observability, alerting, and incident response.

Create a comprehensive Monitoring & Observability Document for "FoundryAI" - an AI-powered business planning SaaS platform. This ensures system health, quick issue detection, and effective incident response.

## 1. OBSERVABILITY STRATEGY

### Three Pillars
1. **Metrics:** Numeric data over time (performance, business)
2. **Logs:** Event records (errors, access, AI interactions)
3. **Traces:** Request flow across services

### Data Collection Principles
- High cardinality where valuable
- Cost-conscious sampling
- Privacy-compliant logging
- Real-time where critical

## 2. MONITORING STACK

### Application Performance Monitoring (APM)
**Tool:** Sentry + Vercel Analytics

**Metrics Collected:**
- Page load times
- API response times
- Error rates by endpoint
- Core Web Vitals (LCP, FID, CLS)
- AI generation latency

### Infrastructure Monitoring
**Tool:** Vercel Dashboard + Supabase Dashboard

**Metrics:**
- Function execution duration
- Function error rates
- Database connection count
- Database query performance
- Storage usage

### Business Metrics
**Tool:** Custom dashboards (Supabase + Frontend)

**KPIs:**
- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- Plan generation count
- Conversion rate (free to paid)
- Churn rate
- AI token consumption
- Revenue (MRR, ARR)

### Log Aggregation
**Tool:** Logflare (via Supabase) or custom

**Log Types:**
- Application logs (INFO, WARN, ERROR)
- Access logs (requests)
- Audit logs (security events)
- AI interaction logs (prompts, costs)

## 3. DASHBOARDS & VISUALIZATION

### Executive Dashboard
- DAU/MAU trends
- Revenue metrics
- Churn rate
- Customer satisfaction (NPS)

### Engineering Dashboard
- Error rates by service
- API response times
- Database performance
- AI service health
- Deployment status

### AI Operations Dashboard
- Token usage by model
- Cost per user
- Generation success rates
- Prompt effectiveness
- Cache hit rates

### Real-Time Monitoring
- Active users
- Current plan generations
- Queue depth
- Error spike detection

## 4. ALERTING STRATEGY

### Alert Severity Levels

**P1 - Critical (Page immediately)**
- Site down (0% availability)
- Database unavailable
- Payment processing failure
- Security breach detection

**P2 - High (Page within 15 minutes)**
- Error rate > 5%
- API latency > 2 seconds
- AI service failure
- Database performance degraded

**P3 - Medium (Alert within 1 hour)**
- Error rate > 1%
- Unusual traffic patterns
- Rate limiting triggered frequently
- Cache hit rate < 50%

**P4 - Low (Alert during business hours)**
- Approaching resource limits
- Security scan findings
- Performance degradation trends

### Alert Channels
- P1/P2: PagerDuty → SMS + Phone
- P3: Slack #alerts channel
- P4: Email digest

### Alert Configuration Examples
```yaml
# Sentry Alert Rule
alert:
  name: "High Error Rate"
  condition: error_rate > 5% for 5 minutes
  action: pagerduty_escalation

# Custom Metric Alert
alert:
  name: "AI Service Latency"
  condition: ai_generation_p95 > 30 seconds
  action: slack_notification + email
```

## 5. INCIDENT MANAGEMENT

### Incident Lifecycle
1. **Detection** (automated or reported)
2. **Triage** (severity assignment)
3. **Response** (on-call engineer engaged)
4. **Resolution** (service restored)
5. **Post-Incident Review** (lessons learned)

### On-Call Rotation
- Primary: Weekly rotation
- Secondary: Monthly rotation
- Escalation: Auto-escalate after 15 min
- Coverage: 24/7 for P1/P2

### Incident Response Procedures

**Site Down (P1):**
1. Verify outage (multiple sources)
2. Check Vercel status page
3. Check Supabase status page
4. If provider issue: communicate to users
5. If application issue: investigate logs
6. Execute rollback if recent deploy
7. Post status updates every 15 min

**Database Issues:**
1. Check Supabase dashboard
2. Review slow query logs
3. Consider connection pool scaling
4. Contact Supabase support if needed

**AI Service Down:**
1. Check OpenAI status page
2. Verify API key validity
3. Switch to fallback provider (if configured)
4. Queue jobs for later processing
5. Notify users of degraded service

### Communication Templates

**Status Page Update:**
```
[Investigating] Plan Generation Delays
We are investigating increased latency in plan generation. 
Estimated impact: 5-10 minute delays for some users.
Last updated: 2024-01-15 10:30 UTC
```

**User Notification:**
```
We're experiencing technical difficulties with plan generation. 
Our team is working on a fix. Thank you for your patience.
```

## 6. ERROR TRACKING & DEBUGGING

### Sentry Configuration
```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  release: process.env.VERCEL_GIT_COMMIT_SHA,
  tracesSampleRate: 1.0,
  beforeSend(event) {
    // Filter out PII
    return filterSensitiveData(event);
  },
});
```

### Error Classification
- **Fatal:** Crash, data corruption
- **Error:** Feature failure, user impact
- **Warning:** Degraded experience
- **Info:** Notable events

### Debugging Runbooks
For each error type:
- Common causes
- Diagnostic steps
- Resolution procedures
- Prevention measures

## 7. PERFORMANCE MONITORING

### Core Web Vitals Targets
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1
- **TTFB (Time to First Byte):** < 600ms
- **FCP (First Contentful Paint):** < 1.8s

### Performance Budgets
- JavaScript: < 300KB initial
- Images: WebP format, lazy loaded
- CSS: Critical CSS inlined
- Third-party scripts: < 100KB

### Real User Monitoring (RUM)
- Vercel Analytics enabled
- Custom performance marks
- User flow timing
- Geographical performance

## 8. SECURITY MONITORING

### Security Events to Monitor
- Failed authentication attempts
- Unusual access patterns
- Rate limit violations
- Privilege escalation attempts
- Data export anomalies

### SIEM Integration
- Log aggregation for security events
- Correlation rules
- Threat intelligence feeds

## 9. COST MONITORING

### AI Cost Tracking
- Token usage per user
- Cost per plan generation
- Daily/weekly/monthly spend
- Alert at 80% of budget

### Infrastructure Costs
- Vercel usage
- Supabase compute/storage
- Third-party API costs
- Anomaly detection

## 10. POST-INCIDENT REVIEWS (PIR)

### PIR Template
1. **Incident Summary**
   - What happened
   - Impact assessment
   - Timeline

2. **Root Cause Analysis**
   - 5 Whys technique
   - Contributing factors
   - Trigger vs root cause

3. **Resolution**
   - How it was fixed
   - Time to detect/resolve

4. **Lessons Learned**
   - What went well
   - What could be improved

5. **Action Items**
   - Specific tasks with owners
   - Due dates
   - Prevention measures

Format: Operational runbook with monitoring configurations, alert rules, and incident procedures.
```

---

## PROMPT 10: THIRD-PARTY INTEGRATIONS & API ECOSYSTEM

```
Act as an Integration Architect with expertise in third-party service integration, API ecosystems, and vendor management.

Create a comprehensive Third-Party Integration Document for "FoundryAI" - an AI-powered business planning SaaS platform. This covers all external services and their integration patterns.

## 1. INTEGRATION OVERVIEW

### Integration Philosophy
- Best-of-breed service selection
- API-first integration approach
- Graceful degradation for failures
- Vendor lock-in mitigation

### Integration Categories
1. **Core Infrastructure** (Required)
2. **Business Critical** (High availability needed)
3. **Value Add** (Functional but not critical)
4. **Analytics & Monitoring** (Operational)

## 2. AUTHENTICATION & IDENTITY

### Supabase Auth (Primary)
**Purpose:** User authentication, authorization, user management

**Integration Points:**
- Sign up/Sign in flows
- OAuth (Google, GitHub)
- Session management
- Row-Level Security

**Configuration:**
```typescript
// lib/db/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

**Fallback Strategy:**
- None (critical dependency)
- Circuit breaker for API calls
- Cached session data

### OAuth Providers
**Google OAuth:**
- Sign-in with Google
- Profile data sync
- Token refresh handling

**GitHub OAuth:**
- Developer-friendly sign-in
- Repository access (optional)

## 3. PAYMENTS & BILLING

### Stripe (Primary)
**Purpose:** Subscription management, payment processing, invoicing

**Integration Components:**
1. **Stripe Checkout**
   - Hosted payment pages
   - Subscription creation
   - Trial handling

2. **Customer Portal**
   - Self-service billing
   - Invoice access
   - Payment method management

3. **Webhooks**
   - Event-driven updates
   - Subscription status changes
   - Failed payment handling

**Webhook Events Handled:**
```typescript
const relevantEvents = [
  'checkout.session.completed',
  'invoice.paid',
  'invoice.payment_failed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
];
```

**Integration Pattern:**
```typescript
// Webhook handler
export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get('stripe-signature');
  
  const event = stripe.webhooks.constructEvent(
    payload, signature, webhookSecret
  );
  
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutComplete(event.data);
      break;
    // ... other cases
  }
  
  return new Response('OK');
}
```

**Testing:**
- Stripe Test Mode
- Webhook local forwarding (Stripe CLI)
- Test cards for various scenarios

**Fallback Strategy:**
- Graceful handling of payment failures
- Manual invoice generation
- Support-assisted upgrades

## 4. ARTIFICIAL INTELLIGENCE

### OpenAI (Primary LLM)
**Purpose:** Business plan generation, market analysis, content creation

**API Integration:**
```typescript
// lib/ai/openai.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateBusinessPlan(prompt: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    max_tokens: 4000,
  });
  
  return response.choices[0].message.content;
}
```

**Rate Limiting:**
- Tier-based limits (Free/Pro/Enterprise)
- Token budgeting per user
- Queue management for high demand

**Fallback Strategy:**
- Secondary provider (Anthropic Claude)
- Queue and retry with backoff
- Degraded mode (canned responses)

**Cost Management:**
- Token usage tracking
- Cost per generation
- Monthly budgeting

### Anthropic Claude (Secondary)
**Purpose:** Fallback LLM, different model strengths

**Use Cases:**
- Complex reasoning tasks
- When OpenAI is unavailable
- A/B testing model quality

## 5. DATABASE & STORAGE

### Supabase (PostgreSQL)
**Purpose:** Primary database, real-time subscriptions, file storage

**Integration Features:**
- Database queries
- Real-time change subscriptions
- File storage buckets
- Edge functions

**Real-Time Subscriptions:**
```typescript
// Subscribe to plan changes
const subscription = supabase
  .channel('plan_changes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'plans',
    filter: `user_id=eq.${userId}`,
  }, callback)
  .subscribe();
```

**File Storage:**
```typescript
// Upload export file
const { data, error } = await supabase.storage
  .from('exports')
  .upload(`user-${userId}/plan-${planId}.pdf`, file);
```

**Backup Strategy:**
- Automated daily backups (Supabase managed)
- Manual pre-deployment backups
- Point-in-time recovery

## 6. SEARCH & ANALYTICS

### Algolia (Optional)
**Purpose:** Advanced search capabilities (if needed beyond PostgreSQL)

**Use Cases:**
- Plan content search
- User discovery features
- Faceted search

**Integration:**
- Index synchronization
- Real-time updates
- Search UI components

### Google Analytics / PostHog
**Purpose:** Product analytics, user behavior tracking

**Events Tracked:**
- Page views
- Feature usage
- Conversion funnels
- AI interaction metrics

**Privacy Compliance:**
- GDPR-compliant tracking
- Consent management
- Data retention limits

## 7. COMMUNICATION

### Email Service (Resend / SendGrid)
**Purpose:** Transactional emails, notifications

**Email Types:**
- Welcome emails
- Password reset
- Plan completion notifications
- Billing invoices
- Marketing (if applicable)

**Template Management:**
- React Email for type-safe templates
- Responsive design
- Dark mode support

## 8. MONITORING & ERROR TRACKING

### Sentry
**Purpose:** Error tracking, performance monitoring, release health

**Integration Scope:**
- Frontend errors
- API errors
- AI service errors
- Performance transactions

### Vercel Analytics
**Purpose:** Web Vitals, traffic analysis

**Metrics:**
- Core Web Vitals
- Traffic sources
- Geographic distribution
- Device breakdown

## 9. INFRASTRUCTURE

### Vercel (Hosting)
**Purpose:** Application hosting, edge network, serverless functions

**Features Used:**
- Edge Network
- Serverless Functions
- Image Optimization
- Analytics

### Upstash (Redis)
**Purpose:** Caching, rate limiting, session store

**Use Cases:**
- API response caching
- Rate limit counters
- Job queue management

## 10. DEVELOPMENT & DEPLOYMENT

### GitHub
**Purpose:** Source control, CI/CD, issue tracking

**Integrations:**
- GitHub Actions (CI/CD)
- Vercel deployment integration
- Dependabot (dependency updates)
- Code review automation

### Figma (Design)
**Purpose:** UI/UX design, design system, prototyping

**Developer Handoff:**
- Inspect mode
- CSS export
- Asset export
- Comment collaboration

## 11. INTEGRATION MANAGEMENT

### API Key Management
- Environment variable encryption
- Key rotation schedule
- Separate keys per environment
- Access logging

### Rate Limiting Strategy
- Per-service limits
- Tier-based allocation
- Queue management
- Throttling responses

### Error Handling Patterns
```typescript
// Graceful degradation pattern
async function callExternalService() {
  try {
    return await primaryProvider.call();
  } catch (error) {
    logger.warn('Primary provider failed, trying fallback', error);
    
    try {
      return await fallbackProvider.call();
    } catch (fallbackError) {
      logger.error('Fallback also failed', fallbackError);
      return getDefaultResponse();
    }
  }
}
```

### Vendor Evaluation Criteria
- Reliability (SLA/ uptime)
- Cost (pricing model, scalability)
- Support (response time, quality)
- Documentation quality
- Security compliance
- API stability (versioning)

### Contract & SLA Management
- Service Level Agreements review
- Billing monitoring
- Usage tracking
- Contract renewal calendar

## 12. INTEGRATION ARCHITECTURE DIAGRAM

Describe the complete integration architecture showing:
- Data flow between services
- Authentication/authorization patterns
- Webhook communication paths
- Fallback/circuit breaker patterns
- Monitoring and logging integration

## 13. TESTING INTEGRATIONS

### Integration Test Strategy
- Mock external services
- Contract testing (Pact)
- Staging environment with test accounts
- Webhook testing (ngrok/Stripe CLI)

### Sandbox Environments
- Stripe Test Mode
- Supabase staging project
- OpenAI test API key
- OAuth test apps

Format: Integration guide with configuration examples, fallback strategies, and operational procedures for each third-party service.
```

---

## BONUS PROMPT 11: DATA PIPELINE & ANALYTICS ARCHITECTURE

```
Act as a Data Engineer with expertise in data pipelines, ETL processes, and analytics engineering.

Create a comprehensive Data Pipeline & Analytics Architecture Document for "FoundryAI" - an AI-powered business planning SaaS platform.

## 1. DATA STRATEGY OVERVIEW
- Data as a product philosophy
- Real-time vs batch processing decisions
- Data quality and governance
- Privacy and compliance considerations

## 2. DATA SOURCES

### Application Events
- User actions (clicks, form submissions)
- Feature usage
- AI interactions
- Performance metrics

### Database Change Data Capture (CDC)
- Plan creation events
- Subscription changes
- User profile updates

### Third-Party Data
- Stripe billing events
- Analytics events (PostHog)
- Error events (Sentry)

## 3. DATA PIPELINE ARCHITECTURE

### Real-Time Pipeline
**Tools:** Supabase Realtime + Event-driven consumers

**Flow:**
Database Change → Supabase Realtime → Webhook → Event Processor → Analytics Store

**Use Cases:**
- Real-time dashboards
- Live user activity
- Immediate alerts

### Batch Pipeline
**Tools:** Scheduled jobs (Vercel Cron)

**Schedule:**
- Hourly: User activity aggregation
- Daily: Business metrics calculation
- Weekly: AI performance analysis

**Flow:**
Source Data → Extract → Transform → Load → Data Warehouse

## 4. ANALYTICS DATA MODEL

### Event Schema
```typescript
interface AnalyticsEvent {
  event_id: string;        // UUID
  event_name: string;      // 'plan_created'
  user_id: string;         // UUID or anonymous
  session_id: string;      // UUID
  timestamp: string;       // ISO 8601
  properties: object;      // Event-specific data
  context: {
    page_url: string;
    referrer: string;
    user_agent: string;
    ip_address: string;    // Hashed
  };
}
```

### Dimensional Model (Star Schema)

**Fact Tables:**
- fact_plan_generations
- fact_user_sessions
- fact_ai_interactions
- fact_payments

**Dimension Tables:**
- dim_users
- dim_plans
- dim_subscriptions
- dim_date
- dim_industries

## 5. REPORTING & DASHBOARDS

### Product Analytics
- Feature adoption rates
- User engagement metrics
- Retention analysis (cohorts)
- Funnel analysis (signup → paid)

### Business Intelligence
- MRR/ARR tracking
- Churn analysis
- CAC and LTV calculations
- Plan tier distribution

### AI Performance Metrics
- Generation success rates
- Token efficiency
- Model comparison
- Cost per outcome

## 6. DATA GOVERNANCE

### Data Quality Checks
- Schema validation
- Freshness monitoring
- Completeness checks
- Anomaly detection

### Data Retention Policies
- Raw events: 90 days
- Aggregated metrics: 2 years
- User deletion (GDPR): Immediate purge

### Privacy & Compliance
- PII masking in logs
- Consent tracking
- Data access audit trail
- Encryption at rest

Format: Data engineering specification with pipeline architecture, data models, and analytics implementation details.
```

---

## BONUS PROMPT 12: MULTI-TENANCY & ENTERPRISE ARCHITECTURE

```
Act as an Enterprise Architect with expertise in multi-tenant SaaS, organization management, and enterprise features.

Create a comprehensive Multi-Tenancy & Enterprise Architecture Document for "FoundryAI" - an AI-powered business planning SaaS platform.

## 1. TENANCY MODEL

### Single-Tenant vs Multi-Tenant
- Decision: Multi-tenant with Row-Level Security
- Rationale: Cost efficiency, operational simplicity
- Isolation level: Logical (RLS policies)

### Tenant Identification
- Tenant = Organization/Team
- User can belong to multiple tenants
- Current tenant in session/context

## 2. DATA ISOLATION STRATEGY

### Row-Level Security (RLS)
```sql
-- Plans table policy
CREATE POLICY "Users can access their org's plans" ON plans
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM user_organizations 
      WHERE user_id = auth.uid()
    )
  );
```

### Schema Separation (if needed)
- Shared tables with tenant_id column
- Separate schemas per tenant (Enterprise option)
- Hybrid approach

## 3. ORGANIZATION MANAGEMENT

### Organization Entity
- Organization ID (UUID)
- Name, slug
- Subscription tier
- Billing owner
- Created/updated timestamps

### Membership & Roles
- Owner: Full control, billing
- Admin: Manage members, settings
- Member: Create plans, view org plans
- Viewer: Read-only access

### Invitation System
- Email invitations
- Join links
- Role assignment
- Expiration handling

## 4. ENTERPRISE FEATURES

### Single Sign-On (SSO)
- SAML 2.0 support
- OIDC support
- Identity provider configuration
- Just-in-time provisioning

### Advanced Security
- Enforced MFA
- IP allowlisting
- Session timeout policies
- Audit logging

### Compliance
- SOC 2 readiness
- GDPR data processing agreements
- HIPAA (if healthcare use case)
- Data residency options

## 5. SCALING CONSIDERATIONS

### Tenant-Aware Operations
- Resource quotas per tenant
- Fair scheduling (no noisy neighbor)
- Tenant-specific rate limits

### Database Scaling
- Read replicas for heavy tenants
- Connection pooling per tenant
- Query optimization for multi-tenant

Format: Enterprise architecture guide with multi-tenancy patterns, organization management, and scaling strategies.
```

---

## Summary

These 12 comprehensive prompts cover:

1. **System Architecture** - Core tech stack and patterns
2. **Database Schema** - Complete data model
3. **API Design** - RESTful API specification
4. **Frontend Architecture** - React/Next.js patterns
5. **Security Architecture** - Auth, encryption, compliance
6. **AI System Architecture** - LLM integration and orchestration
7. **Infrastructure & Deployment** - DevOps and scaling
8. **Testing Strategy** - Quality assurance framework
9. **Monitoring & Observability** - SRE practices
10. **Third-Party Integrations** - External service ecosystem
11. **Data Pipeline** - Analytics and ETL (Bonus)
12. **Multi-Tenancy** - Enterprise architecture (Bonus)

Each prompt is:
- **Well-structured** with clear sections
- **Comprehensive** covering all aspects
- **Actionable** with specific implementation details
- **Professional** suitable for enterprise documentation
- **Adaptable** to Figma AI or any documentation generator

Copy these prompts individually into your Figma AI interface to generate complete, production-ready system design documentation for FoundryAI.
