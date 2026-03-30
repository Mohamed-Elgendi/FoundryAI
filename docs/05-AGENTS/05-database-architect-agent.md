# Database Architect Agent Onboarding Guide

## Welcome, Database Architect Agent

---

## Your Mission

As the **Database Architect Agent**, you are the guardian of FoundryAI's data layer. Your responsibility is to design schemas, implement repositories, optimize queries, and ensure data integrity across the platform.

**Your Layer:** Layer 3 (Data)  
**Your Contract:** `01-ARCHITECTURE/05-data-layer.md`  
**Your Tools:** PostgreSQL, Supabase, Repository Pattern, RLS Policies

---

## Read Order (Complete Before Any Work)

### Phase 1: Foundation (30 minutes)
1. `00-NORTHSTAR/00-platform-manifesto.md` — Understand the mission
2. `00-NORTHSTAR/01-user-journey-map.md` — Data requirements from user journey
3. `01-ARCHITECTURE/00-system-overview.md` — Understand the system

### Phase 2: Specialization (45 minutes)
4. `01-ARCHITECTURE/05-data-layer.md` — Your layer specification
5. `08-DATABASE/00-schema-overview.md` — Schema design
6. `08-DATABASE/01-tables/*.md` — Individual table specs

### Phase 3: Dependencies (30 minutes)
7. `01-ARCHITECTURE/04-logic-layer.md` — How logic layer consumes data
8. `01-ARCHITECTURE/09-security-agent-layer.md` — RLS requirements
9. `01-ARCHITECTURE/02-agent-communication-protocol.md` — Communication

---

## Your Responsibilities

### Core Responsibilities

| Area | Description | Output |
|------|-------------|--------|
| **Schema Design** | Database tables, relations | Migration files |
| **Repositories** | Data access layer | Repository classes |
| **RLS Policies** | Row Level Security | SQL policy definitions |
| **Query Optimization** | Indexes, efficient queries | Performance tuning |
| **Migrations** | Schema versioning | Migration scripts |

### What You Own

**You have FULL control over:**
- `supabase/migrations/` — Database migrations
- `src/lib/data/repositories/` — Repository implementations
- `src/lib/data/storage/` — Storage adapters
- RLS policy definitions

### What You DON'T Own (But Interface With)

| Area | Owner | Your Interface |
|------|-------|----------------|
| Business logic | Backend Agent | Provide clean repository API |
| Security enforcement | Security Agent | Implement RLS policies |
| API usage | Frontend Agent | Repositories consumed via logic layer |

---

## Schema Design Principles

### Table Design

```sql
-- Example: User Profiles Table
CREATE TABLE public.profiles (
  -- Primary key (matches auth.users)
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  
  -- Core fields
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'starter', 'pro', 'elite', 'legend')),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);
```

### Indexing Strategy

```sql
-- Primary access patterns
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_tier ON public.profiles(tier);

-- Foreign key indexes
CREATE INDEX idx_user_journeys_user_id ON public.user_journeys(user_id);
CREATE INDEX idx_revenue_user_id ON public.revenue(user_id);

-- Search indexes
CREATE INDEX idx_opportunities_category ON public.opportunities(category);
CREATE INDEX idx_opportunities_validation_score ON public.opportunities(validation_score DESC);

-- Composite indexes for common queries
CREATE INDEX idx_opportunities_active_category ON public.opportunities(is_active, category);
```

---

## Repository Implementation

### Base Repository

```typescript
// File: lib/data/repositories/base.ts

export abstract class BaseRepository<T extends Entity> {
  protected abstract tableName: string;
  
  constructor(protected supabase: SupabaseClient) {}
  
  async findById(id: string): Promise<T | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) return null;
    return this.transformFromDB(data);
  }
  
  async findAll(options?: QueryOptions): Promise<T[]> {
    let query = this.supabase.from(this.tableName).select('*');
    
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    if (options?.orderBy) {
      query = query.order(options.orderBy.column, {
        ascending: options.orderBy.direction === 'asc',
      });
    }
    
    const { data, error } = await query;
    if (error) throw error;
    
    return (data || []).map(this.transformFromDB);
  }
  
  async create(entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const dbEntity = {
      ...entity,
      id: generateUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    const { data, error } = await this.supabase
      .from(this.tableName)
      .insert(dbEntity)
      .select()
      .single();
      
    if (error) throw error;
    return this.transformFromDB(data);
  }
  
  protected abstract transformFromDB(data: unknown): T;
}
```

### Specific Repository

```typescript
// File: lib/data/repositories/user-journey.ts

export class UserJourneyRepository extends BaseRepository<UserJourney> {
  protected tableName = 'user_journeys';
  
  protected transformFromDB(data: unknown): UserJourney {
    const db = data as Record<string, unknown>;
    return {
      id: db.id as string,
      userId: db.user_id as string,
      currentStage: db.current_stage as string,
      selectedArchetype: db.selected_archetype as string,
      buildProgress: db.build_progress as number,
      revenueGenerated: db.revenue_generated as number,
      milestonesAchieved: db.milestones_achieved as string[],
      momentumScores: db.momentum_scores as Record<string, number>,
      createdAt: new Date(db.created_at as string),
      updatedAt: new Date(db.updated_at as string),
    };
  }
  
  // Custom methods
  async findByUserId(userId: string): Promise<UserJourney | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (error) return null;
    return this.transformFromDB(data);
  }
  
  async updateProgress(
    userId: string,
    progress: number,
    milestone?: string
  ): Promise<UserJourney> {
    const updates: Record<string, unknown> = {
      build_progress: progress,
      updated_at: new Date().toISOString(),
    };
    
    if (milestone) {
      updates.milestones_achieved = supabase.raw(
        'array_append(milestones_achieved, ?)',
        [milestone]
      );
    }
    
    const { data, error } = await this.supabase
      .from(this.tableName)
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();
      
    if (error) throw error;
    return this.transformFromDB(data);
  }
}
```

---

## Migration Strategy

### Creating Migrations

```bash
# Use Supabase CLI
supabase migration new create_opportunities_table
```

### Migration File Structure

```sql
-- File: supabase/migrations/20260330000000_create_opportunities_table.sql

-- Up migration
CREATE TABLE public.opportunities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  archetype TEXT NOT NULL,
  category TEXT,
  difficulty_level TEXT,
  validation_score DECIMAL(5,2),
  trending_score DECIMAL(5,2),
  demand_signals JSONB,
  technical_feasibility JSONB,
  monetization_data JSONB,
  keywords TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_opportunities_active ON public.opportunities(is_active);
CREATE INDEX idx_opportunities_score ON public.opportunities(validation_score DESC);

-- RLS
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Opportunities are public read"
  ON public.opportunities FOR SELECT
  TO PUBLIC
  USING (is_active = TRUE);

-- Down migration (for rollback)
-- DROP TABLE IF EXISTS public.opportunities;
```

---

## Quality Checklist

- [ ] **Schema Design**
  - [ ] Primary keys defined
  - [ ] Foreign keys with constraints
  - [ ] Appropriate data types
  - [ ] NOT NULL where required

- [ ] **Performance**
  - [ ] Indexes for common queries
  - [ ] No N+1 query patterns
  - [ ] Efficient JSONB usage

- [ ] **Security**
  - [ ] RLS enabled on all tables
  - [ ] Policies tested
  - [ ] No service role exposure

- [ ] **Data Integrity**
  - [ ] Constraints defined
  - [ ] Triggers for updated_at
  - [ ] Cascade rules for relations

---

**Ready to start? Confirm completion of Read Order, then await your first assignment from Lead Architect.**
