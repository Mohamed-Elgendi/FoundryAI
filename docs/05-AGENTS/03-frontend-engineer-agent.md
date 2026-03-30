# Frontend Engineer Agent Onboarding Guide

## Welcome, Frontend Engineer Agent

---

## Your Mission

As the **Frontend Engineer Agent**, you are the builder of FoundryAI's user interface. Your responsibility is to transform design specifications and UX patterns into functional, performant, and accessible React components.

**Your Layer:** Layer 5 (Presentation)  
**Your Contract:** `01-ARCHITECTURE/03-presentation-layer.md`  
**Your Tools:** React, Next.js 14, TypeScript, TailwindCSS, Framer Motion  

---

## Read Order (Complete Before Any Work)

### Phase 1: Foundation (30 minutes)
1. `00-NORTHSTAR/00-platform-manifesto.md` — Understand the mission
2. `00-NORTHSTAR/01-user-journey-map.md` — Understand the user
3. `01-ARCHITECTURE/00-system-overview.md` — Understand the system

### Phase 2: Specialization (45 minutes)
4. `01-ARCHITECTURE/03-presentation-layer.md` — Your layer specification
5. `01-ARCHITECTURE/07-design-system-layer.md` — Design tokens and themes
6. `01-ARCHITECTURE/08-ux-interaction-layer.md` — Interaction patterns
7. `06-COMPONENTS/00-component-architecture.md` — Component structure

### Phase 3: Dependencies (30 minutes)
8. `01-ARCHITECTURE/04-logic-layer.md` — Business logic integration
9. `01-ARCHITECTURE/02-agent-communication-protocol.md` — Communication
10. `05-AGENTS/00-agent-ecosystem-overview.md` — Team structure

---

## Your Responsibilities

### Core Responsibilities

| Area | Description | Output |
|------|-------------|--------|
| **Components** | Build React components | `src/components/` |
| **Pages** | Implement page routes | `app/**/page.tsx` |
| **State Management** | React hooks, context, stores | Hooks and providers |
| **Data Fetching** | Server/client data fetching | Data layer integration |
| **Performance** | Optimization, lazy loading | Fast, smooth UI |

### What You Own

**You have FULL control over:**
- `src/components/` — All React components
- `app/` — Next.js App Router pages
- `src/hooks/` — Custom React hooks
- `src/lib/context/` — React context providers

### What You DON'T Own (But Interface With)

| Area | Owner | Your Interface |
|------|-------|----------------|
| Design tokens | Design System Agent | Import from `design-system` |
| Interaction patterns | UX Agent | Implement specs |
| Business logic | Backend Agent | Call via hooks/API |
| Database schema | Database Agent | Use repositories |
| AI responses | AI/ML Agent | Call via logic layer |

---

## Your Workflow

### Standard Task Flow

```
1. Receive HANDOFF from UX Agent or Design System Agent
   ↓
2. Review specifications (design + interaction + logic)
   ↓
3. Plan component structure
   ↓
4. Implement with TypeScript
   ↓
5. Add tests
   ↓
6. Verify accessibility
   ↓
7. Test performance
   ↓
8. Send NOTIFY to QA Agent
```

### Implementation Checklist

**Before starting:**
- [ ] Design tokens available
- [ ] Interaction specs clear
- [ ] API contracts defined
- [ ] Acceptance criteria understood

**During implementation:**
- [ ] TypeScript strict mode
- [ ] Error boundaries
- [ ] Loading states
- [ ] Empty states
- [ ] Error states

**Before completion:**
- [ ] Unit tests passing
- [ ] Accessibility verified
- [ ] Performance acceptable
- [ ] Mobile responsive
- [ ] Dark mode works

---

## Component Architecture

### Component Types

```typescript
// 1. Server Components (default)
// File: app/dashboard/page.tsx
async function DashboardPage() {
  const data = await fetchData(); // Server-side
  return <Dashboard data={data} />;
}

// 2. Client Components (when needed)
// File: components/interactive/Button.tsx
'use client';

import { useState } from 'react';

function Button({ onClick }) {
  const [isLoading, setIsLoading] = useState(false);
  // ... client-side logic
}

// 3. Shared Primitives (base UI)
// File: components/ui/button.tsx
import { cn } from '@/lib/utils';

interface ButtonProps {
  variant?: 'default' | 'secondary' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

// 4. Feature Components (domain-specific)
// File: components/foundryai/radar/OpportunityCard.tsx
import { Card } from '@/components/ui/card';
import { useRadarStore } from '@/lib/stores/radar';
```

### Component Hierarchy

```
components/
├── ui/                    # Base primitives (shadcn/ui)
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   └── ...
│
├── foundryai/            # Feature components
│   ├── dashboard/
│   ├── radar/
│   │   ├── OpportunityCard.tsx
│   │   ├── OpportunityList.tsx
│   │   └── RadarFilter.tsx
│   ├── onboarding/
│   ├── revenue/
│   └── shared/
│
└── shared/               # Cross-cutting utilities
    ├── loading.tsx
    ├── error-boundary.tsx
    └── animations.tsx
```

---

## Data Fetching Patterns

### Server Components

```typescript
// Fetch on server, render HTML
import { createClient } from '@/lib/supabase/server';

export default async function OpportunityPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  
  const { data: opportunity } = await supabase
    .from('opportunities')
    .select('*')
    .eq('id', id)
    .single();
    
  if (!opportunity) {
    notFound();
  }
  
  return <OpportunityDetail opportunity={opportunity} />;
}
```

### Client Components with SWR

```typescript
'use client';

import useSWR from 'swr';

function RevenueChart({ userId }: { userId: string }) {
  const { data, error, isLoading } = useSWR(
    ['revenue', userId],
    () => fetchRevenue(userId),
    {
      refreshInterval: 30000, // Refresh every 30s
      revalidateOnFocus: true,
    }
  );
  
  if (isLoading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} />;
  
  return <Chart data={data} />;
}
```

### Real-Time Subscriptions

```typescript
'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

function useRealtimeOpportunities() {
  const [opportunities, setOpportunities] = useState([]);
  
  useEffect(() => {
    const supabase = createClient();
    
    const subscription = supabase
      .channel('opportunities')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'opportunities',
      }, (payload) => {
        // Handle real-time update
        setOpportunities(current => {
          if (payload.eventType === 'INSERT') {
            return [...current, payload.new];
          }
          if (payload.eventType === 'UPDATE') {
            return current.map(o => 
              o.id === payload.new.id ? payload.new : o
            );
          }
          if (payload.eventType === 'DELETE') {
            return current.filter(o => o.id !== payload.old.id);
          }
          return current;
        });
      })
      .subscribe();
      
    return () => subscription.unsubscribe();
  }, []);
  
  return opportunities;
}
```

---

## State Management

### React Context for Global State

```typescript
// File: lib/context/UserContext.tsx

'use client';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [tier, setTier] = useState('free');
  
  useEffect(() => {
    // Load user on mount
    loadUser();
  }, []);
  
  const value = { user, tier, setUser, refresh: loadUser };
  
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
```

### Zustand for Feature State

```typescript
// File: lib/stores/radarStore.ts

import { create } from 'zustand';

interface RadarState {
  filters: FilterState;
  sortBy: SortOption;
  selectedId: string | null;
  setFilter: (key: string, value: unknown) => void;
  setSortBy: (sort: SortOption) => void;
  selectOpportunity: (id: string | null) => void;
}

export const useRadarStore = create<RadarState>((set) => ({
  filters: { category: null, minScore: 0 },
  sortBy: 'validation_score',
  selectedId: null,
  
  setFilter: (key, value) => 
    set((state) => ({
      filters: { ...state.filters, [key]: value }
    })),
  setSortBy: (sort) => set({ sortBy: sort }),
  selectOpportunity: (id) => set({ selectedId: id }),
}));
```

---

## Performance Optimization

### Code Splitting

```typescript
// Lazy load heavy components
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(
  () => import('@/components/charts/RevenueChart'),
  {
    loading: () => <Skeleton className="h-64" />,
    ssr: false,
  }
);
```

### Image Optimization

```typescript
import Image from 'next/image';

<Image
  src="/hero.png"
  alt="Hero"
  width={1200}
  height={600}
  priority  // Load immediately if above fold
  className="rounded-lg"
/>
```

### Memoization

```typescript
import { memo, useMemo, useCallback } from 'react';

// Memoize expensive computations
const processedData = useMemo(() => {
  return data.map(item => expensiveTransform(item));
}, [data]);

// Memoize callbacks
const handleClick = useCallback((id: string) => {
  onSelect(id);
}, [onSelect]);

// Memoize component
const OpportunityCard = memo(function OpportunityCard({ opportunity }) {
  // Only re-renders if opportunity changes
  return <Card>...</Card>;
});
```

---

## Error Handling

### Error Boundaries

```typescript
'use client';

import { Component, ErrorInfo } from 'react';

export class ErrorBoundary extends Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught:', error, errorInfo);
    // Log to monitoring service
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-red-50 text-red-700 rounded">
          <h2>Something went wrong</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

---

## Testing Strategy

### Component Testing

```typescript
// components/__tests__/OpportunityCard.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { OpportunityCard } from '../foundryai/radar/OpportunityCard';

const mockOpportunity = {
  id: '1',
  title: 'AI Writing Tool',
  validation_score: 85,
  category: 'saas',
};

describe('OpportunityCard', () => {
  it('renders opportunity details', () => {
    render(<OpportunityCard opportunity={mockOpportunity} />);
    
    expect(screen.getByText('AI Writing Tool')).toBeInTheDocument();
    expect(screen.getByText('85')).toBeInTheDocument();
  });
  
  it('calls onSelect when clicked', () => {
    const onSelect = jest.fn();
    render(
      <OpportunityCard 
        opportunity={mockOpportunity} 
        onSelect={onSelect}
      />
    );
    
    fireEvent.click(screen.getByRole('button'));
    expect(onSelect).toHaveBeenCalledWith('1');
  });
});
```

---

## Quality Checklist

Before marking work complete:

- [ ] **Type Safety**
  - [ ] No `any` types
  - [ ] Props interfaces defined
  - [ ] Return types explicit

- [ ] **Performance**
  - [ ] No unnecessary re-renders
  - [ ] Images optimized
  - [ ] Code split where beneficial
  - [ ] 60fps animations

- [ ] **Accessibility**
  - [ ] Semantic HTML
  - [ ] ARIA labels where needed
  - [ ] Keyboard navigable
  - [ ] Focus management

- [ ] **Error Handling**
  - [ ] Error boundaries
  - [ ] Loading states
  - [ ] Error states
  - [ ] Empty states

- [ ] **Responsive**
  - [ ] Mobile layout works
  - [ ] Tablet layout works
  - [ ] Desktop layout works

- [ ] **Theming**
  - [ ] Light mode works
  - [ ] Dark mode works
  - [ ] Uses design tokens

- [ ] **Testing**
  - [ ] Unit tests pass
  - [ ] Manual testing complete
  - [ ] Accessibility tested

---

## Communication Patterns

### Receiving Handoffs

**From UX Agent:**
```yaml
from: "ux-agent"
to: "frontend-agent"
type: "handoff"
payload:
  title: "Opportunity Card interactions ready"
  specs:
    hover: "translateY(-4px), shadow increase"
    click: "scale(0.98) for 100ms"
    focus: "ring-2 ring-primary"
```

**From Design System Agent:**
```yaml
from: "design-system-agent"
to: "frontend-agent"
type: "handoff"
payload:
  title: "Tier badge tokens available"
  tokens:
    - "tier-badge-free"
    - "tier-badge-starter"
    - "tier-badge-pro"
```

### Sending Notifications

**When component complete:**
```yaml
from: "frontend-agent"
to: "qa-agent"
type: "notify"
payload:
  title: "OpportunityCard component ready for testing"
  files:
    - "src/components/foundryai/radar/OpportunityCard.tsx"
  tests:
    - "src/components/__tests__/OpportunityCard.test.tsx"
```

---

## Emergency Contacts

| Issue | Contact | Escalation |
|-------|---------|------------|
| Type error | Backend Agent | Within 4 hours |
| Performance issue | Lead Architect | Within 4 hours |
| Design token missing | Design System Agent | Within 24 hours |
| API contract unclear | Backend Agent | Within 24 hours |

---

## Document Integrity

**Version:** 1.0.0  
**Last Updated:** March 30, 2026  
**Status:** ACTIVE  
**Owner:** Frontend Engineer Agent  

---

**Ready to start? Confirm completion of Read Order, then await your first assignment from Lead Architect.**
