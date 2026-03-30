# Presentation Layer (Layer 5)

## Next.js 14 + React Server Components Implementation Guide

---

## Document Purpose

This document specifies Layer 5 of the FoundryAI architecture—the Presentation Layer. It defines how the user interface is rendered, how components are structured, and how the layer interfaces with Logic (Layer 4) and UX (Layer 6).

**Audience:** Frontend Engineer Agent, UX/Interaction Agent

**Prerequisites:** 
- `01-ARCHITECTURE/00-system-overview.md`
- `02-DESIGN-SYSTEM/00-design-principles.md`
- `03-UX-PATTERNS/00-ux-principles.md`

---

## Layer Responsibility

The Presentation Layer:
1. Renders UI components using React and Next.js 14
2. Composes pages from feature and primitive components
3. Manages client-side state (React hooks, context)
4. Handles user input and events
5. Communicates with Logic Layer (Layer 4) for business operations

### Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.x | Full-stack framework, App Router |
| React | 18.x | UI library, Server Components |
| TypeScript | 5.x | Type safety |
| TailwindCSS | 3.x | Utility-first styling |
| shadcn/ui | Latest | Base component library |
| Framer Motion | 11.x | Animations and transitions |

---

## Architecture Patterns

### Server Components First

```typescript
// ✅ PREFERRED: Server Component (default in App Router)
// File: app/dashboard/page.tsx
export default async function DashboardPage() {
  // Data fetching happens on server
  const user = await getUser();
  const opportunities = await getOpportunities();
  
  return (
    <DashboardLayout>
      <UserWelcome user={user} />
      <OpportunityGrid opportunities={opportunities} />
    </DashboardLayout>
  );
}
```

```typescript
// ✅ CLIENT COMPONENT: Only when needed
// File: components/opportunity/OpportunityCard.tsx
'use client';

import { useState } from 'react';

export function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Client-side interactivity
  return (
    <Card onClick={() => setIsExpanded(!isExpanded)}>
      {/* ... */}
    </Card>
  );
}
```

**When to use 'use client':**
- useState, useEffect, useReducer
- Event listeners (onClick, onSubmit)
- Browser APIs (localStorage, window)
- Custom hooks that use browser APIs

### Component Hierarchy

```
app/                          # Next.js App Router
├── layout.tsx                # Root layout (Server)
├── page.tsx                  # Landing page (Server)
├── dashboard/
│   ├── layout.tsx            # Dashboard layout (Server)
│   ├── page.tsx              # Dashboard home (Server)
│   └── radar/
│       └── page.tsx          # Opportunity radar (Server)
│
components/
├── foundryai/               # Feature-specific components
│   ├── dashboard/
│   ├── radar/
│   ├── onboarding/
│   └── revenue/
│
├── ui/                      # Base components (shadcn)
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   └── ...
│
└── shared/                  # Shared utilities
    ├── loading.tsx
    ├── error-boundary.tsx
    └── animations.tsx
```

---

## Data Fetching Patterns

### Server-Side Data Fetching

```typescript
// File: app/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server';

async function getUserJourney(userId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('user_journeys')
    .select('*')
    .eq('user_id', userId)
    .single();
    
  if (error) throw error;
  return data;
}

export default async function DashboardPage() {
  const journey = await getUserJourney(userId);
  
  return <Dashboard journey={journey} />;
}
```

### Client-Side Data Fetching

```typescript
// File: components/opportunity/OpportunityList.tsx
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function OpportunityList() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from('opportunities')
        .select('*')
        .order('validation_score', { ascending: false });
        
      setOpportunities(data || []);
      setLoading(false);
    }
    
    load();
  }, []);
  
  if (loading) return <Loading />;
  
  return (
    <div className="grid gap-4">
      {opportunities.map(opp => (
        <OpportunityCard key={opp.id} opportunity={opp} />
      ))}
    </div>
  );
}
```

### Real-Time Subscriptions

```typescript
// File: hooks/useRealtime.ts
'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useRealtimeRevenue(userId: string, onUpdate: (data: Revenue) => void) {
  useEffect(() => {
    const supabase = createClient();
    
    const subscription = supabase
      .channel('revenue_updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'revenue',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => onUpdate(payload.new as Revenue)
      )
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [userId, onUpdate]);
}
```

---

## Component Patterns

### Compound Components

```typescript
// Feature-specific compound component
// File: components/foundryai/radar/RadarCard.tsx

import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface RadarCardProps {
  opportunity: Opportunity;
  onSelect: (id: string) => void;
  onValidate: (id: string) => void;
}

export function RadarCard({ opportunity, onSelect, onValidate }: RadarCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg">{opportunity.title}</h3>
          <ValidationBadge score={opportunity.validation_score} />
        </div>
        <p className="text-muted-foreground text-sm">
          {opportunity.category} • {opportunity.timeline}
        </p>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm line-clamp-3">{opportunity.description}</p>
        
        <div className="mt-4 flex gap-2">
          <ArchetypeBadge archetype={opportunity.archetype} />
          <DifficultyBadge level={opportunity.difficulty} />
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="ghost" onClick={() => onSelect(opportunity.id)}>
          Learn More
        </Button>
        <Button onClick={() => onValidate(opportunity.id)}>
          Validate
        </Button>
      </CardFooter>
    </Card>
  );
}

// Validation badge with color coding
function ValidationBadge({ score }: { score: number }) {
  const variant = score >= 80 ? 'default' : score >= 60 ? 'secondary' : 'destructive';
  const label = score >= 80 ? 'Exceptional' : score >= 60 ? 'Strong' : 'Moderate';
  
  return (
    <Badge variant={variant}>
      {label} ({score})
    </Badge>
  );
}
```

### Render Props Pattern

```typescript
// For flexible data-dependent rendering
// File: components/shared/DataLoader.tsx

interface DataLoaderProps<T> {
  load: () => Promise<T>;
  children: (data: T, loading: boolean, error: Error | null) => React.ReactNode;
}

export function DataLoader<T>({ load, children }: DataLoaderProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    load()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [load]);
  
  return <>{children(data as T, loading, error)}</>;
}

// Usage:
<DataLoader load={() => fetchUser()}>
  {(user, loading, error) => {
    if (loading) return <Skeleton />;
    if (error) return <ErrorMessage error={error} />;
    return <UserProfile user={user} />;
  }}
</DataLoader>
```

---

## State Management

### React Context for Global State

```typescript
// File: lib/context/UserContext.tsx

'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface UserContextType {
  user: User | null;
  tier: Tier;
  loading: boolean;
  refresh: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tier, setTier] = useState<Tier>('free');
  const [loading, setLoading] = useState(true);
  
  async function loadUser() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('tier')
        .eq('id', user.id)
        .single();
        
      setUser(user);
      setTier(profile?.tier || 'free');
    }
    
    setLoading(false);
  }
  
  useEffect(() => {
    loadUser();
  }, []);
  
  return (
    <UserContext.Provider value={{ user, tier, loading, refresh: loadUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
}
```

### Zustand for Complex State

```typescript
// For complex feature state
// File: lib/stores/radarStore.ts

import { create } from 'zustand';

interface RadarState {
  filters: {
    category: string | null;
    minScore: number;
    maxTimeline: number;
  };
  sortBy: 'validation_score' | 'trending' | 'newest';
  opportunities: Opportunity[];
  selectedId: string | null;
  
  setFilter: (key: keyof RadarState['filters'], value: unknown) => void;
  setSortBy: (sort: RadarState['sortBy']) => void;
  setOpportunities: (opportunities: Opportunity[]) => void;
  selectOpportunity: (id: string | null) => void;
}

export const useRadarStore = create<RadarState>((set) => ({
  filters: {
    category: null,
    minScore: 0,
    maxTimeline: 90,
  },
  sortBy: 'validation_score',
  opportunities: [],
  selectedId: null,
  
  setFilter: (key, value) => 
    set((state) => ({ 
      filters: { ...state.filters, [key]: value } 
    })),
  setSortBy: (sort) => set({ sortBy: sort }),
  setOpportunities: (opportunities) => set({ opportunities }),
  selectOpportunity: (id) => set({ selectedId: id }),
}));
```

---

## Routing Structure

### App Router Configuration

```typescript
// File: app/layout.tsx (Root Layout)

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider>
          <AuthProvider>
            <UserProvider>
              {children}
            </UserProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### Route Groups

```
app/
├── (marketing)/              # Marketing pages (no auth required)
│   ├── page.tsx              # Landing page
│   ├── pricing/
│   └── about/
│
├── (auth)/                   # Auth pages
│   ├── login/
│   ├── signup/
│   └── forgot-password/
│
├── (dashboard)/              # Protected dashboard
│   ├── layout.tsx            # Auth guard
│   ├── dashboard/
│   ├── radar/
│   ├── settings/
│   └── plan/
│
└── api/                      # API routes
    └── ...
```

### Protected Routes

```typescript
// File: app/(dashboard)/layout.tsx

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }
  
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
```

---

## Error Handling

### Error Boundaries

```typescript
// File: components/shared/error-boundary.tsx

'use client';

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to error tracking service
    console.error('Error caught by boundary:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive">
          <h2 className="font-semibold">Something went wrong</h2>
          <p className="text-sm">{this.state.error?.message}</p>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-2 text-sm underline"
          >
            Try again
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

### API Error Handling

```typescript
// File: lib/api/errors.ts

export class FoundryError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number,
    public userMessage: string
  ) {
    super(message);
  }
}

export function handleAPIError(error: unknown): FoundryError {
  if (error instanceof FoundryError) return error;
  
  if (error instanceof Error) {
    // Log to monitoring service
    return new FoundryError(
      error.message,
      'UNKNOWN_ERROR',
      500,
      'An unexpected error occurred. Please try again.'
    );
  }
  
  return new FoundryError(
    'Unknown error',
    'UNKNOWN_ERROR',
    500,
    'An unexpected error occurred. Please try again.'
  );
}
```

---

## Performance Optimization

### Image Optimization

```typescript
import Image from 'next/image';

// ✅ Automatic optimization
<Image
  src="/hero-image.png"
  alt="Hero"
  width={1200}
  height={600}
  priority  // Load above-the-fold images immediately
  className="rounded-lg"
/>
```

### Code Splitting

```typescript
// Dynamic imports for heavy components
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('@/components/charts/RevenueChart'), {
  loading: () => <Skeleton className="h-64" />,
  ssr: false,  // Disable SSR for browser-only components
});
```

### Route Prefetching

```typescript
import Link from 'next/link';

// ✅ Automatic prefetching on hover
<Link 
  href="/dashboard/radar"
  className="..."
>
  Opportunity Radar
</Link>
```

---

## Testing Strategy

### Component Testing

```typescript
// File: components/__tests__/RadarCard.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { RadarCard } from '../foundryai/radar/RadarCard';

const mockOpportunity = {
  id: '1',
  title: 'AI Writing Assistant',
  validation_score: 85,
  category: 'saas',
  archetype: 'saas-products',
  difficulty: 'medium',
  description: 'AI-powered writing tool...',
  timeline: '14-30 days',
};

describe('RadarCard', () => {
  it('renders opportunity details', () => {
    render(<RadarCard opportunity={mockOpportunity} />);
    
    expect(screen.getByText('AI Writing Assistant')).toBeInTheDocument();
    expect(screen.getByText('Exceptional (85)')).toBeInTheDocument();
  });
  
  it('calls onSelect when Learn More clicked', () => {
    const onSelect = jest.fn();
    render(
      <RadarCard 
        opportunity={mockOpportunity} 
        onSelect={onSelect}
      />
    );
    
    fireEvent.click(screen.getByText('Learn More'));
    expect(onSelect).toHaveBeenCalledWith('1');
  });
});
```

---

## Document Integrity

**Version:** 1.0.0  
**Last Updated:** March 30, 2026  
**Status:** ACTIVE  
**Owner:** Frontend Engineer Agent  

**Related Documents:**
- `02-DESIGN-SYSTEM/00-design-principles.md` — Visual system
- `03-UX-PATTERNS/00-ux-principles.md` — Interaction patterns
- `04-logic-layer.md` — API integration

**Change Protocol:**
1. Pattern changes require UX Agent review
2. New component patterns need Design System Agent alignment
3. Routing changes need architecture review

---

**End of Presentation Layer Specification. All UI implementation must follow these patterns.**
