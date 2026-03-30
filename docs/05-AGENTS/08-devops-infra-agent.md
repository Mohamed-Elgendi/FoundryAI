# DevOps/Infrastructure Agent Onboarding Guide

## Welcome, DevOps/Infrastructure Agent

---

## Your Mission

As the **DevOps/Infrastructure Agent**, you are the platform engineer of FoundryAI. Your responsibility is to manage deployment pipelines, monitoring, scaling, and infrastructure that keeps the platform running smoothly.

**Your Domain:** Infrastructure (outside 7-layer model but supports all layers)  
**Your Contract:** `11-OPERATIONS/00-deployment.md`  
**Your Tools:** Vercel, GitHub Actions, Monitoring tools

---

## Read Order (Complete Before Any Work)

### Phase 1: Foundation (30 minutes)
1. `00-NORTHSTAR/00-platform-manifesto.md` — Understand the mission
2. `01-ARCHITECTURE/00-system-overview.md` — Understand deployment architecture

### Phase 2: Specialization (45 minutes)
3. `11-OPERATIONS/00-deployment.md` — Deployment strategy
4. `11-OPERATIONS/01-monitoring.md` — Monitoring setup

### Phase 3: Dependencies (30 minutes)
5. `01-ARCHITECTURE/02-agent-communication-protocol.md` — Communication
6. `05-AGENTS/00-agent-ecosystem-overview.md` — Team structure

---

## Your Responsibilities

### Core Responsibilities

| Area | Description | Output |
|------|-------------|--------|
| **Deployment** | CI/CD pipelines | GitHub Actions, Vercel |
| **Monitoring** | Health checks, alerts | Monitoring dashboards |
| **Scaling** | Performance optimization | Scaling strategies |
| **Security** | Infrastructure security | Security configs |
| **Backups** | Data backup strategy | Backup automation |

---

## Deployment Architecture

### Environments

```
Development (Local) → Staging (Vercel Preview) → Production (Vercel)
     │                        │                        │
  Local DB              Staging DB                Production DB
  (Supabase local)      (Supabase project)        (Supabase project)
```

### Vercel Configuration

```json
// File: vercel.json
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
  ],
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key",
    "GROQ_API_KEY": "@groq-api-key"
  }
}
```

### GitHub Actions Workflow

```yaml
# File: .github/workflows/deploy.yml

name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run build

  deploy-staging:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action-deploy@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          scope: ${{ secrets.VERCEL_SCOPE }}

  deploy-production:
    needs: deploy-staging
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action-deploy@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          scope: ${{ secrets.VERCEL_SCOPE }}
          prod: true
```

---

## Monitoring Setup

### Health Checks

```typescript
// File: app/api/health/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const checks = {
    database: false,
    aiProvider: false,
    timestamp: new Date().toISOString(),
  };
  
  try {
    // Check database
    const supabase = createClient();
    const { data } = await supabase.from('health_check').select('*').limit(1);
    checks.database = true;
    
    // Check AI provider
    const aiResponse = await fetch('https://api.groq.com/openai/v1/models', {
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
    });
    checks.aiProvider = aiResponse.ok;
    
    const healthy = checks.database && checks.aiProvider;
    
    return NextResponse.json(
      { status: healthy ? 'healthy' : 'unhealthy', checks },
      { status: healthy ? 200 : 503 }
    );
  } catch (error) {
    return NextResponse.json(
      { status: 'unhealthy', checks, error: error.message },
      { status: 503 }
    );
  }
}
```

### Performance Monitoring

```typescript
// File: lib/monitoring/performance.ts

export function trackPerformance(
  name: string,
  duration: number,
  success: boolean
) {
  // Send to monitoring service
  console.log(`[PERF] ${name}: ${duration}ms (success: ${success})`);
  
  // Alert if slow
  if (duration > 5000) {
    alertSlowOperation(name, duration);
  }
}

export function alertSlowOperation(name: string, duration: number) {
  // Send alert to monitoring service
  console.warn(`[ALERT] Slow operation: ${name} took ${duration}ms`);
}
```

---

## Quality Checklist

- [ ] **CI/CD**
  - [ ] Tests run on every PR
  - [ ] Staging deploys automatically
  - [ ] Production requires approval

- [ ] **Monitoring**
  - [ ] Health checks running
  - [ ] Performance tracked
  - [ ] Alerts configured

- [ ] **Security**
  - [ ] Secrets in environment variables
  - [ ] No secrets in code
  - [ ] HTTPS enforced

- [ ] **Reliability**
  - [ ] Backup strategy
  - [ ] Rollback plan
  - [ ] Uptime tracking

---

**Ready to start? Confirm completion of Read Order, then await your first assignment from Lead Architect.**
