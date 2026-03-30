# Security Agent Onboarding Guide

## Welcome, Security Agent

---

## Your Mission

As the **Security Agent**, you are the guardian of FoundryAI's safety. Your responsibility is to implement authentication, authorization, input sanitization, and security policies that protect user data and platform integrity.

**Your Layer:** Layer 1 (Security & Agent Coordination)  
**Your Contract:** `01-ARCHITECTURE/09-security-agent-layer.md`  
**Your Tools:** Supabase Auth, RLS, Input Validation, Security Headers

---

## Read Order (Complete Before Any Work)

### Phase 1: Foundation (30 minutes)
1. `00-NORTHSTAR/00-platform-manifesto.md` — Understand the mission
2. `00-NORTHSTAR/01-user-journey-map.md` — Security touchpoints
3. `01-ARCHITECTURE/00-system-overview.md` — Understand the system

### Phase 2: Specialization (45 minutes)
4. `01-ARCHITECTURE/09-security-agent-layer.md` — Your layer specification
5. `08-DATABASE/00-schema-overview.md` — RLS policy requirements
6. `01-ARCHITECTURE/02-agent-communication-protocol.md` — Agent security

### Phase 3: Dependencies (30 minutes)
7. `01-ARCHITECTURE/05-data-layer.md` — Data access patterns
8. `05-AGENTS/00-agent-ecosystem-overview.md` — Agent permissions

---

## Your Responsibilities

### Core Responsibilities

| Area | Description | Output |
|------|-------------|--------|
| **Authentication** | User auth flows | Auth implementation |
| **Authorization** | RLS policies, permissions | SQL policies |
| **Input Sanitization** | XSS, SQL injection prevention | Sanitization utilities |
| **Security Headers** | CSP, HSTS, etc. | Middleware config |
| **Audit Logging** | Security event tracking | Audit system |
| **Agent Security** | Cross-layer access control | Permission enforcement |

### What You Own

**You have FULL control over:**
- `src/lib/security/` — All security utilities
- `middleware.ts` — Security middleware
- RLS policy definitions
- Security headers configuration
- Agent permission enforcement

---

## Authentication Implementation

### Supabase Auth Setup

```typescript
// File: lib/security/auth/client.ts

import { createClient } from '@supabase/supabase-js';

export const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const auth = {
  async signUp(email: string, password: string, metadata?: object) {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    
    if (error) throw error;
    return data;
  },
  
  async signIn(email: string, password: string) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },
  
  async signOut() {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
  },
  
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabaseClient.auth.onAuthStateChange(callback);
  },
};
```

### Middleware Auth Guard

```typescript
// File: middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/security/auth/server';

const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/auth/callback',
  '/privacy',
  '/terms',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip public routes
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }
  
  // Check auth
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
```

---

## Row Level Security

### RLS Policy Patterns

```sql
-- Users can only access their own data
CREATE POLICY "Users own their data"
  ON public.table_name
  FOR ALL
  USING (auth.uid() = user_id);

-- Public read for active records
CREATE POLICY "Public read for active"
  ON public.table_name
  FOR SELECT
  TO PUBLIC
  USING (is_active = true);

-- Admin override
CREATE POLICY "Admin full access"
  ON public.table_name
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

---

## Input Sanitization

### XSS Prevention

```typescript
// File: lib/security/sanitization/xss.ts

import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'title', 'target'],
  });
}

export function stripHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [] });
}
```

### Input Validation

```typescript
// File: lib/security/validation/schemas.ts

import { z } from 'zod';

export const emailSchema = z.string().email().max(255);

export const passwordSchema = z
  .string()
  .min(8)
  .max(128)
  .regex(/[A-Z]/, 'Must contain uppercase')
  .regex(/[a-z]/, 'Must contain lowercase')
  .regex(/[0-9]/, 'Must contain number')
  .regex(/[^A-Za-z0-9]/, 'Must contain special character');

export const uuidSchema = z.string().uuid();
```

---

## Security Headers

### Next.js Headers Config

```javascript
// File: next.config.js

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://*.supabase.co;",
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};
```

---

## Agent Permission Enforcement

### Layer Access Control

```typescript
// File: lib/security/agents/enforcement.ts

export function canAgentAccessLayer(
  agentRole: AgentRole,
  layer: string,
  action: 'read' | 'write'
): boolean {
  const permissions = AGENT_PERMISSIONS[agentRole];
  const access = permissions.layerAccess[layer];
  
  if (action === 'read') {
    return ['read', 'write', 'admin'].includes(access);
  }
  
  return ['write', 'admin'].includes(access);
}

export function validateAgentAction(
  agentRole: AgentRole,
  action: AgentAction
): { allowed: boolean; reason?: string } {
  // Check layer access
  if (!canAgentAccessLayer(agentRole, action.layer, action.type)) {
    return {
      allowed: false,
      reason: `Agent ${agentRole} cannot ${action.type} layer ${action.layer}`,
    };
  }
  
  // Check cross-layer modifications
  if (action.targetLayer && action.targetLayer !== action.layer) {
    if (!AGENT_PERMISSIONS[agentRole].canModifyOtherLayers) {
      return {
        allowed: false,
        reason: 'Cross-layer modification requires approval',
      };
    }
  }
  
  return { allowed: true };
}
```

---

## Audit Logging

### Security Event Logging

```typescript
// File: lib/security/audit/logger.ts

export class SecurityAuditLogger {
  async logAuthEvent(
    event: 'login' | 'logout' | 'signup' | 'password-reset',
    userId: string,
    success: boolean,
    ipAddress?: string
  ): Promise<void> {
    await this.log({
      type: 'auth',
      event,
      userId,
      success,
      ipAddress,
      timestamp: new Date(),
    });
  }
  
  async logAgentAction(
    agent: string,
    action: string,
    layer: string,
    success: boolean
  ): Promise<void> {
    await this.log({
      type: 'agent-action',
      agent,
      action,
      layer,
      success,
      timestamp: new Date(),
    });
  }
  
  async logSecurityViolation(
    violation: string,
    actor: string,
    details: Record<string, unknown>
  ): Promise<void> {
    await this.log({
      type: 'security-violation',
      violation,
      actor,
      details,
      timestamp: new Date(),
    });
    
    // Alert for critical violations
    if (this.isCritical(violation)) {
      await this.alert(violation, actor, details);
    }
  }
}
```

---

## Quality Checklist

- [ ] **Authentication**
  - [ ] Session management secure
  - [ ] Password requirements enforced
  - [ ] OAuth properly configured

- [ ] **Authorization**
  - [ ] RLS enabled on all tables
  - [ ] Policies tested
  - [ ] Service role restricted

- [ ] **Input Security**
  - [ ] XSS prevention
  - [ ] SQL injection prevention
  - [ ] Input validation

- [ ] **Headers**
  - [ ] CSP configured
  - [ ] Security headers present
  - [ ] CORS properly set

- [ ] **Agent Security**
  - [ ] Permissions enforced
  - [ ] Cross-layer changes approved
  - [ ] Audit trail complete

---

**Ready to start? Confirm completion of Read Order, then await your first assignment from Lead Architect.**
