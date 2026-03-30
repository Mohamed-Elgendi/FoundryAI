# Security & Agent Coordination Layer (Layer 1)

## Authentication, Authorization, and Multi-Agent Orchestration

---

## Document Purpose

This document specifies Layer 1 of the FoundryAI architecture—the foundational Security & Agent Coordination Layer. It defines authentication flows, authorization policies, input sanitization, and the protocol for multi-agent collaboration.

**Audience:** Security Agent, Lead Architect, All AI Agents

**Prerequisites:**
- `01-ARCHITECTURE/00-system-overview.md`
- `01-ARCHITECTURE/02-agent-communication-protocol.md`
- `08-DATABASE/00-schema-overview.md` (RLS policies)

---

## Layer Responsibility

The Security & Agent Coordination Layer:
1. Enforces authentication and session management
2. Implements Row Level Security (RLS) policies
3. Sanitizes all inputs and prevents injection attacks
4. Coordinates multi-agent workflows
5. Maintains audit logs of all changes
6. Prevents unauthorized cross-layer modifications

### Security Principles

| Principle | Implementation |
|-----------|---------------|
| **Zero Trust** | Verify every request, every time |
| **Least Privilege** | Agents only access what they need |
| **Defense in Depth** | Multiple security layers |
| **Fail Secure** | Deny access on any error |
| **Audit Everything** | Log all security-relevant actions |

---

## Authentication Architecture

### Supabase Auth Integration

```typescript
// File: lib/security/auth/client.ts

import { createClient } from '@supabase/supabase-js';

export const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Authentication methods
export const auth = {
  // Sign up
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
  
  // Sign in
  async signIn(email: string, password: string) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },
  
  // OAuth (Google, GitHub, etc.)
  async signInWithOAuth(provider: 'google' | 'github' | 'discord') {
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    
    if (error) throw error;
    return data;
  },
  
  // Sign out
  async signOut() {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
  },
  
  // Password reset
  async resetPassword(email: string) {
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    
    if (error) throw error;
  },
  
  // Update password
  async updatePassword(newPassword: string) {
    const { error } = await supabaseClient.auth.updateUser({
      password: newPassword,
    });
    
    if (error) throw error;
  },
  
  // Get current session
  async getSession() {
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    if (error) throw error;
    return session;
  },
  
  // Get current user
  async getUser() {
    const { data: { user }, error } = await supabaseClient.auth.getUser();
    if (error) throw error;
    return user;
  },
  
  // Listen for auth changes
  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return supabaseClient.auth.onAuthStateChange(callback);
  },
};
```

### Server-Side Authentication

```typescript
// File: lib/security/auth/server.ts

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStore = cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Handle middleware context
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch {
            // Handle middleware context
          }
        },
      },
    }
  );
}

// Server-side auth helper
export async function getServerUser() {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }
  
  return user;
}

// Protected route helper
export async function requireAuth() {
  const user = await getServerUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  return user;
}
```

### Middleware Authentication

```typescript
// File: middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/security/auth/server';

// Public routes that don't require auth
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
  
  // Check if route is public
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }
  
  // Check for auth
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    // Redirect to login
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

---

## Row Level Security (RLS)

### Database RLS Policies

```sql
-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only access their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- User Journeys: Users can only access their own journey
CREATE POLICY "Users can view own journey"
  ON public.user_journeys FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own journey"
  ON public.user_journeys FOR UPDATE
  USING (auth.uid() = user_id);

-- Revenue: Users can only access their own revenue records
CREATE POLICY "Users can view own revenue"
  ON public.revenue FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own revenue"
  ON public.revenue FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Opportunities: Public read for active opportunities
CREATE POLICY "Opportunities are public read"
  ON public.opportunities FOR SELECT
  TO PUBLIC
  USING (is_active = true);

-- Templates: Public read for active templates
CREATE POLICY "Templates are public read"
  ON public.templates FOR SELECT
  TO PUBLIC
  USING (is_active = true);

-- Admin policies (for admin dashboard)
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### Service Role Operations

```typescript
// File: lib/security/admin/service-role.ts

import { createClient } from '@supabase/supabase-js';

// Service role client for admin operations
// WARNING: Only use in server-side admin functions
const serviceClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export const adminOperations = {
  // Get all users (admin only)
  async getAllUsers() {
    const { data, error } = await serviceClient.auth.admin.listUsers();
    if (error) throw error;
    return data.users;
  },
  
  // Update any profile (admin only)
  async updateUserProfile(userId: string, updates: object) {
    const { error } = await serviceClient
      .from('profiles')
      .update(updates)
      .eq('id', userId);
    
    if (error) throw error;
  },
  
  // Create opportunity (admin only)
  async createOpportunity(opportunity: object) {
    const { data, error } = await serviceClient
      .from('opportunities')
      .insert(opportunity)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
};
```

---

## Input Sanitization

### XSS Prevention

```typescript
// File: lib/security/sanitization/xss.ts

import DOMPurify from 'isomorphic-dompurify';

// Sanitize HTML content
export function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'title'],
  });
}

// Strip all HTML
export function stripHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [] });
}

// Sanitize for attribute
export function sanitizeAttribute(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
```

### SQL Injection Prevention

```typescript
// File: lib/security/sanitization/sql.ts

// Parameterized queries are enforced via Supabase client
// Never concatenate user input into SQL strings

// BAD - DO NOT DO THIS:
// const query = `SELECT * FROM users WHERE email = '${email}'`;

// GOOD - Use parameterized queries:
// const { data } = await supabase
//   .from('users')
//   .select('*')
//   .eq('email', email);

// Input validation helper
export function validateOrderBy(column: string, allowed: string[]): string {
  if (!allowed.includes(column)) {
    throw new Error(`Invalid order column: ${column}`);
  }
  return column;
}

export function validateFilter(
  filter: Record<string, unknown>,
  allowed: string[]
): Record<string, unknown> {
  const validated: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(filter)) {
    if (!allowed.includes(key)) {
      throw new Error(`Invalid filter field: ${key}`);
    }
    validated[key] = value;
  }
  
  return validated;
}
```

### Input Validation

```typescript
// File: lib/security/validation/input.ts

import { z } from 'zod';

// Email validation
export const emailSchema = z
  .string()
  .email('Invalid email address')
  .max(255, 'Email too long');

// Password validation
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password too long')
  .regex(/[A-Z]/, 'Password must contain uppercase letter')
  .regex(/[a-z]/, 'Password must contain lowercase letter')
  .regex(/[0-9]/, 'Password must contain number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain special character');

// User input sanitization
export const userInputSchema = z
  .string()
  .max(10000, 'Input too long')
  .transform((val) => val.trim())
  .transform((val) => stripHTML(val));

// UUID validation
export const uuidSchema = z.string().uuid();

// Revenue amount validation
export const revenueSchema = z
  .number()
  .positive('Amount must be positive')
  .max(1000000000, 'Amount too large');

// Generic validator
export function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return {
    success: false,
    errors: result.error.errors.map(e => e.message),
  };
}
```

---

## Agent Authorization System

### Agent Roles and Permissions

```typescript
// File: lib/security/agents/roles.ts

export type AgentRole = 
  | 'lead-architect'
  | 'design-system'
  | 'ux-interaction'
  | 'frontend-engineer'
  | 'backend-engineer'
  | 'database-architect'
  | 'ai-ml'
  | 'security'
  | 'devops'
  | 'qa'
  | 'content';

export type LayerAccess = 'read' | 'write' | 'admin';

export interface AgentPermissions {
  role: AgentRole;
  layerAccess: Record<string, LayerAccess>;
  canApproveChanges: boolean;
  canModifyOtherLayers: boolean;
}

// Permission matrix
export const AGENT_PERMISSIONS: Record<AgentRole, AgentPermissions> = {
  'lead-architect': {
    role: 'lead-architect',
    layerAccess: {
      'layer-1': 'admin',
      'layer-2': 'admin',
      'layer-3': 'admin',
      'layer-4': 'admin',
      'layer-5': 'admin',
      'layer-6': 'admin',
      'layer-7': 'admin',
    },
    canApproveChanges: true,
    canModifyOtherLayers: true,
  },
  
  'design-system': {
    role: 'design-system',
    layerAccess: {
      'layer-7': 'admin',
      'layer-5': 'read',  // Can read presentation layer
    },
    canApproveChanges: false,
    canModifyOtherLayers: false,
  },
  
  'ux-interaction': {
    role: 'ux-interaction',
    layerAccess: {
      'layer-6': 'admin',
      'layer-5': 'read',
      'layer-7': 'read',
    },
    canApproveChanges: false,
    canModifyOtherLayers: false,
  },
  
  'frontend-engineer': {
    role: 'frontend-engineer',
    layerAccess: {
      'layer-5': 'admin',
      'layer-6': 'read',
      'layer-7': 'read',
    },
    canApproveChanges: false,
    canModifyOtherLayers: false,
  },
  
  'backend-engineer': {
    role: 'backend-engineer',
    layerAccess: {
      'layer-4': 'admin',
      'layer-3': 'read',
      'layer-2': 'read',
    },
    canApproveChanges: false,
    canModifyOtherLayers: false,
  },
  
  'database-architect': {
    role: 'database-architect',
    layerAccess: {
      'layer-3': 'admin',
    },
    canApproveChanges: false,
    canModifyOtherLayers: false,
  },
  
  'ai-ml': {
    role: 'ai-ml',
    layerAccess: {
      'layer-2': 'admin',
    },
    canApproveChanges: false,
    canModifyOtherLayers: false,
  },
  
  'security': {
    role: 'security',
    layerAccess: {
      'layer-1': 'admin',
      'layer-3': 'admin', // For RLS policies
      'layer-4': 'read',  // For auth logic
    },
    canApproveChanges: true, // For security-related changes
    canModifyOtherLayers: true, // Limited to security aspects
  },
  
  'devops': {
    role: 'devops',
    layerAccess: {}, // Infrastructure layer (outside 7-layer model)
    canApproveChanges: true,
    canModifyOtherLayers: false,
  },
  
  'qa': {
    role: 'qa',
    layerAccess: {
      'layer-1': 'read',
      'layer-2': 'read',
      'layer-3': 'read',
      'layer-4': 'read',
      'layer-5': 'read',
      'layer-6': 'read',
      'layer-7': 'read',
    },
    canApproveChanges: false,
    canModifyOtherLayers: false,
  },
  
  'content': {
    role: 'content',
    layerAccess: {
      'layer-5': 'read',
      'layer-6': 'read',
    },
    canApproveChanges: false,
    canModifyOtherLayers: false,
  },
};
```

### Layer Access Enforcement

```typescript
// File: lib/security/agents/enforcement.ts

import { AGENT_PERMISSIONS, type AgentRole } from './roles';

export class LayerAccessEnforcer {
  // Check if agent can read a layer
  canReadLayer(agentRole: AgentRole, layer: string): boolean {
    const perms = AGENT_PERMISSIONS[agentRole];
    const access = perms.layerAccess[layer];
    return access === 'read' || access === 'write' || access === 'admin';
  }
  
  // Check if agent can write to a layer
  canWriteLayer(agentRole: AgentRole, layer: string): boolean {
    const perms = AGENT_PERMISSIONS[agentRole];
    const access = perms.layerAccess[layer];
    return access === 'write' || access === 'admin';
  }
  
  // Check if agent can modify another layer (with approval)
  canModifyOtherLayer(
    agentRole: AgentRole,
    targetLayer: string,
    hasApproval: boolean
  ): boolean {
    const perms = AGENT_PERMISSIONS[agentRole];
    
    // Lead architect and security can modify with approval
    if (perms.canModifyOtherLayers && hasApproval) {
      return true;
    }
    
    return false;
  }
  
  // Validate agent action
  validateAction(
    agentRole: AgentRole,
    action: {
      layer: string;
      type: 'read' | 'write' | 'modify';
      targetLayer?: string;
      hasApproval?: boolean;
    }
  ): { allowed: boolean; reason?: string } {
    // Check read
    if (action.type === 'read') {
      if (!this.canReadLayer(agentRole, action.layer)) {
        return { 
          allowed: false, 
          reason: `Agent ${agentRole} cannot read layer ${action.layer}` 
        };
      }
      return { allowed: true };
    }
    
    // Check write
    if (action.type === 'write') {
      if (!this.canWriteLayer(agentRole, action.layer)) {
        return { 
          allowed: false, 
          reason: `Agent ${agentRole} cannot write to layer ${action.layer}` 
        };
      }
      return { allowed: true };
    }
    
    // Check modify other layer
    if (action.type === 'modify' && action.targetLayer) {
      if (!this.canModifyOtherLayer(
        agentRole,
        action.targetLayer,
        action.hasApproval || false
      )) {
        return { 
          allowed: false, 
          reason: `Agent ${agentRole} cannot modify layer ${action.targetLayer}. Approval required.` 
        };
      }
      return { allowed: true };
    }
    
    return { allowed: false, reason: 'Invalid action type' };
  }
}

// Global enforcer instance
export const layerEnforcer = new LayerAccessEnforcer();
```

---

## Audit Logging

### Audit System

```typescript
// File: lib/security/audit/logger.ts

export type AuditEventType = 
  | 'agent:action'
  | 'layer:modify'
  | 'auth:login'
  | 'auth:logout'
  | 'data:access'
  | 'security:policy-change';

export interface AuditEvent {
  id: string;
  timestamp: Date;
  type: AuditEventType;
  actor: string;          // Agent name or user ID
  actorType: 'agent' | 'user' | 'system';
  action: string;
  resource: string;
  details: Record<string, unknown>;
  success: boolean;
  errorMessage?: string;
  ipAddress?: string;
  userAgent?: string;
}

export class AuditLogger {
  async log(event: Omit<AuditEvent, 'id' | 'timestamp'>): Promise<void> {
    const auditEvent: AuditEvent = {
      ...event,
      id: generateUUID(),
      timestamp: new Date(),
    };
    
    // Log to database
    const supabase = createServiceClient();
    await supabase.from('audit_logs').insert({
      ...auditEvent,
      details: JSON.stringify(auditEvent.details),
    });
    
    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[AUDIT]', auditEvent);
    }
  }
  
  // Log agent actions
  async logAgentAction(
    agent: string,
    action: string,
    details: Record<string, unknown>,
    success: boolean,
    error?: string
  ): Promise<void> {
    await this.log({
      type: 'agent:action',
      actor: agent,
      actorType: 'agent',
      action,
      resource: details.layer as string || 'unknown',
      details,
      success,
      errorMessage: error,
    });
  }
  
  // Log layer modifications
  async logLayerModification(
    agent: string,
    layer: string,
    change: string,
    approved: boolean
  ): Promise<void> {
    await this.log({
      type: 'layer:modify',
      actor: agent,
      actorType: 'agent',
      action: 'modify',
      resource: layer,
      details: { change, approved },
      success: approved,
    });
  }
}

// Global audit logger
export const auditLogger = new AuditLogger();
```

---

## Document Integrity

**Version:** 1.0.0  
**Last Updated:** March 30, 2026  
**Status:** ACTIVE  
**Owner:** Security Agent / Lead Architect  

**Related Documents:**
- `01-ARCHITECTURE/02-agent-communication-protocol.md` — Agent messaging
- `08-DATABASE/00-schema-overview.md` — RLS policy definitions
- `05-AGENTS/*.md` — Individual agent permissions

**Change Protocol:**
1. Security policy changes need Security Agent approval
2. RLS policy changes need testing in staging
3. Agent permission changes need Lead Architect approval

---

**End of Security & Agent Coordination Layer Specification. All security decisions must be logged and auditable.**
