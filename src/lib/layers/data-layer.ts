/**
 * Layer 5: Data Layer Architecture
 * Repository pattern with caching, migrations, and backup strategy
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Database schema types
export interface DatabaseSchema {
  users: {
    id: string;
    email: string;
    role: 'free' | 'pro' | 'enterprise';
    created_at: string;
    profile: UserProfile;
    subscription: Subscription;
  };
  
  plans: {
    id: string;
    user_id: string;
    title: string;
    content: PlanContent;
    status: 'draft' | 'generating' | 'complete' | 'refining';
    version: number;
    created_at: string;
    updated_at: string;
  };
  
  opportunities: {
    id: string;
    title: string;
    market: string;
    niche: string;
    score: number;
    horizon: 'short' | 'mid' | 'long';
    validation_data: Record<string, any>;
    created_at: string;
  };
  
  analytics_events: {
    id: string;
    user_id: string;
    event_type: string;
    metadata: Record<string, any>;
    timestamp: string;
  };
  
  feedback: {
    id: string;
    user_id: string;
    plan_id: string;
    rating: number;
    comment: string;
    created_at: string;
  };
}

interface UserProfile {
  name?: string;
  company?: string;
  industry?: string;
}

interface Subscription {
  tier: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due';
  current_period_end: string;
}

interface PlanContent {
  toolIdea: string;
  targetUser: string;
  problemStatement: string;
  marketResearch: any;
  mvpFeatures: string[];
  techStack: any[];
  buildPlan: any[];
  monetizationStrategy: any;
}

// Repository pattern - abstract data access
export abstract class Repository<T> {
  protected supabase: SupabaseClient;
  protected table: string;
  protected cache: Map<string, T> = new Map();
  protected cacheTTL: number = 5 * 60 * 1000; // 5 minutes
  
  constructor(supabase: SupabaseClient, table: string) {
    this.supabase = supabase;
    this.table = table;
  }
  
  // CRUD operations with caching
  async findById(id: string): Promise<T | null> {
    // Check cache first
    const cached = this.cache.get(id);
    if (cached && this.isCacheValid(id)) {
      return cached;
    }
    
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    if (data) {
      this.cache.set(id, data as T);
    }
    return data as T;
  }
  
  async findAll(filters?: Record<string, any>): Promise<T[]> {
    let query = this.supabase.from(this.table).select('*');
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data as T[];
  }
  
  async create(item: Partial<T>): Promise<T> {
    const { data, error } = await this.supabase
      .from(this.table)
      .insert(item)
      .select()
      .single();
    
    if (error) throw error;
    this.cache.set((data as any).id, data as T);
    return data as T;
  }
  
  async update(id: string, updates: Partial<T>): Promise<T> {
    const { data, error } = await this.supabase
      .from(this.table)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    this.cache.set(id, data as T);
    return data as T;
  }
  
  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.table)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    this.cache.delete(id);
  }
  
  // Cache management
  private cacheTimestamps: Map<string, number> = new Map();
  
  private isCacheValid(id: string): boolean {
    const timestamp = this.cacheTimestamps.get(id);
    if (!timestamp) return false;
    return Date.now() - timestamp < this.cacheTTL;
  }
  
  invalidateCache(id?: string): void {
    if (id) {
      this.cache.delete(id);
      this.cacheTimestamps.delete(id);
    } else {
      this.cache.clear();
      this.cacheTimestamps.clear();
    }
  }
}

// Concrete repositories
export class PlansRepository extends Repository<DatabaseSchema['plans']> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'plans');
  }
  
  async findByUser(userId: string): Promise<DatabaseSchema['plans'][]> {
    return this.findAll({ user_id: userId });
  }
  
  async findRecent(userId: string, limit: number = 10): Promise<DatabaseSchema['plans'][]> {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data as DatabaseSchema['plans'][];
  }
}

export class AnalyticsRepository extends Repository<DatabaseSchema['analytics_events']> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'analytics_events');
  }
  
  async trackEvent(userId: string, eventType: string, metadata: Record<string, any>): Promise<void> {
    await this.create({
      user_id: userId,
      event_type: eventType,
      metadata,
      timestamp: new Date().toISOString(),
    } as any);
  }
  
  async getUserStats(userId: string, days: number = 30): Promise<Record<string, number>> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data, error } = await this.supabase
      .from(this.table)
      .select('event_type')
      .eq('user_id', userId)
      .gte('timestamp', startDate.toISOString());
    
    if (error) throw error;
    
    return data.reduce((acc: Record<string, number>, event: any) => {
      acc[event.event_type] = (acc[event.event_type] || 0) + 1;
      return acc;
    }, {});
  }
}

// Database connection singleton
class Database {
  private static instance: SupabaseClient | null = null;
  
  static getInstance(): SupabaseClient {
    if (!Database.instance) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase environment variables');
      }
      
      Database.instance = createClient(supabaseUrl, supabaseKey);
    }
    return Database.instance;
  }
  
  // Repository factory
  static getRepository<T>(type: new (supabase: SupabaseClient) => T): T {
    return new type(Database.getInstance());
  }
}

export { Database };
