# Data Layer (Layer 3)

## Database Architecture, Storage, and Repository Pattern

---

## Document Purpose

This document specifies Layer 3 of the FoundryAI architecture—the Data Layer. It defines database schema design, storage abstractions, caching strategy, and the contract between Logic (Layer 4) and the persistence layer.

**Audience:** Database Architect Agent, Backend/API Agent

**Prerequisites:**
- `01-ARCHITECTURE/00-system-overview.md`
- `01-ARCHITECTURE/04-logic-layer.md`
- `08-DATABASE/00-schema-overview.md`

---

## Layer Responsibility

The Data Layer:
1. Abstracts storage mechanisms (PostgreSQL, Redis, local storage)
2. Implements Repository Pattern for type-safe data access
3. Manages caching with TTL and invalidation
4. Enforces Row Level Security (RLS) policies
5. Handles database migrations and schema versioning

### Technology Stack

| Technology | Purpose |
|------------|---------|
| **Supabase** | PostgreSQL database, Auth, Realtime |
| **PostgreSQL** | Primary data store |
| **Redis** | Caching layer (Upstash) |
| **Prisma** | Schema definition, type generation (optional) |
| **Drizzle** | Query builder, migrations (alternative) |

---

## Storage Abstractions

### Storage Adapter Interface

```typescript
// File: lib/data/storage/types.ts

export interface StorageAdapter {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<boolean>;
  remove(key: string): Promise<boolean>;
  clear(): Promise<boolean>;
  keys(): Promise<string[]>;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  version: string;
}
```

### Storage Implementations

```typescript
// File: lib/data/storage/adapters.ts

// 1. LocalStorage Adapter (Client-side)
export class LocalStorageAdapter implements StorageAdapter {
  async get<T>(key: string): Promise<T | null> {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error('LocalStorage get error:', error);
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<boolean> {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('LocalStorage set error:', error);
      return false;
    }
  }

  async remove(key: string): Promise<boolean> {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }

  async clear(): Promise<boolean> {
    try {
      localStorage.clear();
      return true;
    } catch {
      return false;
    }
  }

  async keys(): Promise<string[]> {
    return Object.keys(localStorage);
  }
}

// 2. Memory Adapter (Server-side, request-scoped)
export class MemoryStorageAdapter implements StorageAdapter {
  private store = new Map<string, unknown>();

  async get<T>(key: string): Promise<T | null> {
    return (this.store.get(key) as T) ?? null;
  }

  async set<T>(key: string, value: T): Promise<boolean> {
    this.store.set(key, value);
    return true;
  }

  async remove(key: string): Promise<boolean> {
    this.store.delete(key);
    return true;
  }

  async clear(): Promise<boolean> {
    this.store.clear();
    return true;
  }

  async keys(): Promise<string[]> {
    return Array.from(this.store.keys());
  }
}

// 3. Supabase Adapter (Database)
export class SupabaseStorageAdapter implements StorageAdapter {
  constructor(private table: string) {}

  async get<T>(key: string): Promise<T | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from(this.table)
      .select('value')
      .eq('key', key)
      .single();

    if (error || !data) return null;
    return data.value as T;
  }

  async set<T>(key: string, value: T): Promise<boolean> {
    const supabase = createClient();
    const { error } = await supabase
      .from(this.table)
      .upsert({ key, value, updated_at: new Date().toISOString() });

    return !error;
  }

  async remove(key: string): Promise<boolean> {
    const supabase = createClient();
    const { error } = await supabase
      .from(this.table)
      .delete()
      .eq('key', key);

    return !error;
  }

  // ... remaining methods
}
```

---

## Cache Manager

### Multi-Level Caching

```typescript
// File: lib/data/cache/manager.ts

import { EventBus } from '@/lib/logic/events/bus';

export class CacheManager {
  private storage: StorageAdapter;
  private prefix: string;
  private eventBus: EventBus;

  constructor(
    storage: StorageAdapter,
    prefix = 'cache:',
    eventBus = globalEventBus
  ) {
    this.storage = storage;
    this.prefix = prefix;
    this.eventBus = eventBus;
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = await this.storage.get<CacheEntry<T>>(this.prefix + key);

    if (!entry) return null;

    // Check expiration
    if (Date.now() - entry.timestamp > entry.ttl) {
      await this.remove(key);
      return null;
    }

    return entry.data;
  }

  async set<T>(key: string, value: T, ttlMs = 5 * 60 * 1000): Promise<boolean> {
    const entry: CacheEntry<T> = {
      data: value,
      timestamp: Date.now(),
      ttl: ttlMs,
      version: '1.0',
    };

    const success = await this.storage.set(this.prefix + key, entry);

    if (success) {
      this.eventBus.emit('cache:set', { key, ttl: ttlMs });
    }

    return success;
  }

  async remove(key: string): Promise<boolean> {
    const success = await this.storage.remove(this.prefix + key);

    if (success) {
      this.eventBus.emit('cache:remove', { key });
    }

    return success;
  }

  async getOrCompute<T>(
    key: string,
    compute: () => Promise<T>,
    ttlMs?: number
  ): Promise<T> {
    const cached = await this.get<T>(key);

    if (cached !== null) {
      return cached;
    }

    const computed = await compute();
    await this.set(key, computed, ttlMs);

    return computed;
  }

  async invalidate(pattern: string): Promise<number> {
    const keys = await this.storage.keys();
    const matchingKeys = keys.filter(k => 
      k.startsWith(this.prefix) && k.includes(pattern)
    );

    for (const key of matchingKeys) {
      await this.storage.remove(key);
    }

    this.eventBus.emit('cache:invalidate', { 
      pattern, 
      count: matchingKeys.length 
    });

    return matchingKeys.length;
  }

  async getStats(): Promise<CacheStats> {
    const keys = await this.storage.keys();
    const cacheKeys = keys.filter(k => k.startsWith(this.prefix));

    let expired = 0;
    let totalSize = 0;

    for (const key of cacheKeys) {
      const entry = await this.storage.get<CacheEntry<unknown>>(key);
      if (entry) {
        if (Date.now() - entry.timestamp > entry.ttl) {
          expired++;
        }
        totalSize += JSON.stringify(entry).length;
      }
    }

    return {
      total: cacheKeys.length,
      expired,
      valid: cacheKeys.length - expired,
      totalSize,
    };
  }
}

export interface CacheStats {
  total: number;
  expired: number;
  valid: number;
  totalSize: number;
}
```

### Cache TTL Strategy

```typescript
// File: lib/data/cache/ttl-config.ts

export const CACHE_TTL = {
  // L1: In-Memory (server-side)
  memory: {
    userSession: 60 * 1000,        // 1 minute
    activeOpportunities: 30 * 1000, // 30 seconds
    aiResponse: 5 * 60 * 1000,     // 5 minutes
  },

  // L2: Redis
  redis: {
    opportunities: 5 * 60 * 1000,    // 5 minutes
    userProfile: 60 * 60 * 1000,   // 1 hour
    templates: 24 * 60 * 60 * 1000, // 24 hours
    aiConversations: 60 * 60 * 1000, // 1 hour
  },

  // L3: CDN/Edge
  edge: {
    staticAssets: 365 * 24 * 60 * 60 * 1000, // 1 year
    apiResponses: 60 * 1000,       // 1 minute (stale-while-revalidate)
  },
};

// Invalidation triggers
export const CACHE_INVALIDATION = {
  onUserUpdate: ['user:*', 'profile:*'],
  onOpportunityCreate: ['opportunities:*', 'radar:*'],
  onRevenueRecord: ['revenue:*', 'tier:*', 'momentum:*'],
  onAIResponse: ['ai:*', 'chat:*'],
};
```

---

## Repository Pattern

### Repository Interface

```typescript
// File: lib/data/repositories/types.ts

export interface Repository<T extends Entity> {
  findById(id: string): Promise<T | null>;
  findAll(options?: QueryOptions): Promise<T[]>;
  findOne(where: WhereClause<T>): Promise<T | null>;
  findMany(where: WhereClause<T>, options?: QueryOptions): Promise<T[]>;
  create(entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  update(id: string, entity: Partial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;
  exists(id: string): Promise<boolean>;
  count(where?: WhereClause<T>): Promise<number>;
}

export interface Entity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: { column: string; direction: 'asc' | 'desc' };
}

export type WhereClause<T> = Partial<T> | {
  [K in keyof T]?: T[K] | { operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in'; value: unknown };
};
```

### Base Repository Implementation

```typescript
// File: lib/data/repositories/base.ts

export abstract class BaseRepository<T extends Entity> implements Repository<T> {
  protected abstract tableName: string;
  protected abstract cache: CacheManager;
  protected cacheTTL = 5 * 60 * 1000; // 5 minutes default

  constructor(protected supabase: SupabaseClient) {}

  async findById(id: string): Promise<T | null> {
    const cacheKey = `${this.tableName}:${id}`;
    
    return this.cache.getOrCompute(
      cacheKey,
      async () => {
        const { data, error } = await this.supabase
          .from(this.tableName)
          .select('*')
          .eq('id', id)
          .single();

        if (error) return null;
        return this.transformFromDB(data);
      },
      this.cacheTTL
    );
  }

  async findAll(options?: QueryOptions): Promise<T[]> {
    let query = this.supabase
      .from(this.tableName)
      .select('*');

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    if (options?.orderBy) {
      query = query.order(options.orderBy.column, { 
        ascending: options.orderBy.direction === 'asc' 
      });
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data || []).map(this.transformFromDB);
  }

  async findOne(where: WhereClause<T>): Promise<T | null> {
    const results = await this.findMany(where, { limit: 1 });
    return results[0] || null;
  }

  async findMany(where: WhereClause<T>, options?: QueryOptions): Promise<T[]> {
    let query = this.supabase
      .from(this.tableName)
      .select('*');

    // Apply where clauses
    query = this.applyWhere(query, where);

    // Apply options
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.orderBy) {
      query = query.order(options.orderBy.column, { 
        ascending: options.orderBy.direction === 'asc' 
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

    const result = this.transformFromDB(data);
    
    // Invalidate related caches
    await this.invalidateCaches();
    
    return result;
  }

  async update(id: string, entity: Partial<T>): Promise<T> {
    const dbEntity = {
      ...this.transformToDB(entity),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await this.supabase
      .from(this.tableName)
      .update(dbEntity)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Invalidate cache
    await this.cache.remove(`${this.tableName}:${id}`);
    await this.invalidateCaches();

    return this.transformFromDB(data);
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) return false;

    // Invalidate cache
    await this.cache.remove(`${this.tableName}:${id}`);
    await this.invalidateCaches();

    return true;
  }

  async exists(id: string): Promise<boolean> {
    const entity = await this.findById(id);
    return entity !== null;
  }

  async count(where?: WhereClause<T>): Promise<number> {
    let query = this.supabase
      .from(this.tableName)
      .select('*', { count: 'exact', head: true });

    if (where) {
      query = this.applyWhere(query, where);
    }

    const { count, error } = await query;

    if (error) throw error;
    return count || 0;
  }

  protected abstract transformFromDB(data: unknown): T;
  protected abstract transformToDB(entity: Partial<T>): Record<string, unknown>;

  protected applyWhere(
    query: PostgrestQueryBuilder,
    where: WhereClause<T>
  ): PostgrestQueryBuilder {
    for (const [key, value] of Object.entries(where)) {
      if (value && typeof value === 'object' && 'operator' in value) {
        const { operator, value: opValue } = value;
        
        switch (operator) {
          case 'eq': query = query.eq(key, opValue); break;
          case 'neq': query = query.neq(key, opValue); break;
          case 'gt': query = query.gt(key, opValue); break;
          case 'gte': query = query.gte(key, opValue); break;
          case 'lt': query = query.lt(key, opValue); break;
          case 'lte': query = query.lte(key, opValue); break;
          case 'like': query = query.like(key, `%${opValue}%`); break;
          case 'in': query = query.in(key, opValue as unknown[]); break;
        }
      } else {
        query = query.eq(key, value);
      }
    }
    
    return query;
  }

  protected async invalidateCaches(): Promise<void> {
    await this.cache.invalidate(`${this.tableName}:*`);
  }
}
```

### Specific Repository: UserJourneyRepository

```typescript
// File: lib/data/repositories/user-journey.ts

import { BaseRepository } from './base';
import type { UserJourney } from '@/types';

export class UserJourneyRepository extends BaseRepository<UserJourney> {
  protected tableName = 'user_journeys';

  protected transformFromDB(data: unknown): UserJourney {
    const db = data as Record<string, unknown>;
    return {
      id: db.id as string,
      userId: db.user_id as string,
      currentStage: db.current_stage as string,
      selectedArchetype: db.selected_archetype as string | undefined,
      buildProgress: db.build_progress as number,
      revenueGenerated: db.revenue_generated as number,
      milestonesAchieved: db.milestones_achieved as string[],
      momentumScores: db.momentum_scores as Record<string, number>,
      createdAt: new Date(db.created_at as string),
      updatedAt: new Date(db.updated_at as string),
    };
  }

  protected transformToDB(entity: Partial<UserJourney>): Record<string, unknown> {
    return {
      ...(entity.userId && { user_id: entity.userId }),
      ...(entity.currentStage && { current_stage: entity.currentStage }),
      ...(entity.selectedArchetype && { selected_archetype: entity.selectedArchetype }),
      ...(entity.buildProgress !== undefined && { build_progress: entity.buildProgress }),
      ...(entity.revenueGenerated !== undefined && { revenue_generated: entity.revenueGenerated }),
      ...(entity.milestonesAchieved && { milestones_achieved: entity.milestonesAchieved }),
      ...(entity.momentumScores && { momentum_scores: entity.momentumScores }),
    };
  }

  // Custom methods
  async findByUserId(userId: string): Promise<UserJourney | null> {
    return this.findOne({ userId: { operator: 'eq', value: userId } } as WhereClause<UserJourney>);
  }

  async updateProgress(
    userId: string, 
    progress: number,
    milestone?: string
  ): Promise<UserJourney> {
    const journey = await this.findByUserId(userId);
    
    if (!journey) {
      throw new Error(`User journey not found for user ${userId}`);
    }

    const updates: Partial<UserJourney> = {
      buildProgress: progress,
    };

    if (milestone) {
      updates.milestonesAchieved = [
        ...journey.milestonesAchieved,
        milestone,
      ];
    }

    return this.update(journey.id, updates);
  }
}
```

---

## Real-Time Subscriptions

### Subscription Manager

```typescript
// File: lib/data/realtime/subscriptions.ts

export class RealtimeSubscriptionManager {
  private subscriptions = new Map<string, RealtimeChannel>();
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  subscribe<T>(
    channel: string,
    table: string,
    callback: (payload: RealtimePostgresChangesPayload<T>) => void,
    filter?: { column: string; value: string }
  ): () => void {
    const channelName = `${table}:${channel}`;

    // Check if already subscribed
    if (this.subscriptions.has(channelName)) {
      return () => this.unsubscribe(channelName);
    }

    const subscription = this.supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          ...(filter && { filter: `${filter.column}=eq.${filter.value}` }),
        },
        callback
      )
      .subscribe();

    this.subscriptions.set(channelName, subscription);

    return () => this.unsubscribe(channelName);
  }

  unsubscribe(channelName: string): void {
    const subscription = this.subscriptions.get(channelName);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(channelName);
    }
  }

  unsubscribeAll(): void {
    for (const [name, subscription] of this.subscriptions) {
      subscription.unsubscribe();
    }
    this.subscriptions.clear();
  }
}

// Usage example
export function useRealtimeRevenue(userId: string) {
  const [revenue, setRevenue] = useState<Revenue[]>([]);

  useEffect(() => {
    const manager = new RealtimeSubscriptionManager(supabase);
    
    const unsubscribe = manager.subscribe(
      'revenue-updates',
      'revenue',
      (payload) => {
        if (payload.eventType === 'INSERT') {
          setRevenue(prev => [...prev, payload.new as Revenue]);
        }
      },
      { column: 'user_id', value: userId }
    );

    return unsubscribe;
  }, [userId]);

  return revenue;
}
```

---

## Document Integrity

**Version:** 1.0.0  
**Last Updated:** March 30, 2026  
**Status:** ACTIVE  
**Owner:** Database Architect Agent  

**Related Documents:**
- `08-DATABASE/00-schema-overview.md` — Database schema specification
- `08-DATABASE/01-tables/*.md` — Individual table definitions
- `01-ARCHITECTURE/04-logic-layer.md` — Logic Layer integration

**Change Protocol:**
1. Schema changes require migration plan
2. RLS policy changes need Security Agent review
3. Repository changes need type safety verification

---

**End of Data Layer Specification. All data access must use these patterns.**
