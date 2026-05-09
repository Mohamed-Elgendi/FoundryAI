/**
 * LAYER 3: DATA LAYER
 * ===================
 * Handles all data persistence, caching, and state management
 * Provides abstraction over storage mechanisms (local, remote, cache)
 */

import { safeLogError, safeJsonParse, safeJsonStringify } from '@/lib/utils/logger';
import { EventBus, globalEventBus } from './logic-layer';

// ==========================================
// STORAGE INTERFACES
// ==========================================

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

// ==========================================
// LOCAL STORAGE ADAPTER
// ==========================================

export class LocalStorageAdapter implements StorageAdapter {
  async get<T>(key: string): Promise<T | null> {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      return safeJsonParse<T>(item, null);
    } catch (error) {
      safeLogError(error, { operation: 'localStorage.get', key });
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<boolean> {
    try {
      localStorage.setItem(key, safeJsonStringify(value));
      return true;
    } catch (error) {
      safeLogError(error, { operation: 'localStorage.set', key });
      return false;
    }
  }

  async remove(key: string): Promise<boolean> {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      safeLogError(error, { operation: 'localStorage.remove', key });
      return false;
    }
  }

  async clear(): Promise<boolean> {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      safeLogError(error, { operation: 'localStorage.clear' });
      return false;
    }
  }

  async keys(): Promise<string[]> {
    try {
      return Object.keys(localStorage);
    } catch (error) {
      safeLogError(error, { operation: 'localStorage.keys' });
      return [];
    }
  }
}

// ==========================================
// MEMORY STORAGE ADAPTER (Server-side safe)
// ==========================================

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

// ==========================================
// CACHE MANAGER
// ==========================================

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

  /**
   * Get cached value with TTL check
   */
  async get<T>(key: string): Promise<T | null> {
    const entry = await this.storage.get<CacheEntry<T>>(this.prefix + key);
    
    if (!entry) return null;
    
    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      await this.remove(key);
      return null;
    }
    
    return entry.data;
  }

  /**
   * Set cache entry with TTL
   */
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

  /**
   * Remove cache entry
   */
  async remove(key: string): Promise<boolean> {
    const success = await this.storage.remove(this.prefix + key);
    
    if (success) {
      this.eventBus.emit('cache:remove', { key });
    }
    
    return success;
  }

  /**
   * Get or compute value
   */
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

  /**
   * Clear all cache entries
   */
  async clear(): Promise<boolean> {
    const keys = await this.storage.keys();
    const cacheKeys = keys.filter(k => k.startsWith(this.prefix));
    
    for (const key of cacheKeys) {
      await this.storage.remove(key);
    }
    
    this.eventBus.emit('cache:clear', { count: cacheKeys.length });
    
    return true;
  }

  /**
   * Get cache stats
   */
  async getStats(): Promise<{
    total: number;
    expired: number;
    valid: number;
  }> {
    const keys = await this.storage.keys();
    const cacheKeys = keys.filter(k => k.startsWith(this.prefix));
    
    let expired = 0;
    
    for (const key of cacheKeys) {
      const entry = await this.storage.get<CacheEntry<unknown>>(key);
      if (entry && Date.now() - entry.timestamp > entry.ttl) {
        expired++;
      }
    }
    
    return {
      total: cacheKeys.length,
      expired,
      valid: cacheKeys.length - expired,
    };
  }
}

// ==========================================
// REPOSITORY PATTERN
// ==========================================

export interface Repository<T> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  save(id: string, entity: T): Promise<boolean>;
  delete(id: string): Promise<boolean>;
  exists(id: string): Promise<boolean>;
}

/**
 * Generic Repository Implementation
 */
export class GenericRepository<T> implements Repository<T> {
  private storage: StorageAdapter;
  private prefix: string;

  constructor(storage: StorageAdapter, prefix: string) {
    this.storage = storage;
    this.prefix = `${prefix}:`;
  }

  async findById(id: string): Promise<T | null> {
    return this.storage.get<T>(this.prefix + id);
  }

  async findAll(): Promise<T[]> {
    const keys = await this.storage.keys();
    const entityKeys = keys.filter(k => k.startsWith(this.prefix));
    
    const entities: T[] = [];
    for (const key of entityKeys) {
      const entity = await this.storage.get<T>(key);
      if (entity) entities.push(entity);
    }
    
    return entities;
  }

  async save(id: string, entity: T): Promise<boolean> {
    return this.storage.set(this.prefix + id, entity);
  }

  async delete(id: string): Promise<boolean> {
    return this.storage.remove(this.prefix + id);
  }

  async exists(id: string): Promise<boolean> {
    const entity = await this.findById(id);
    return entity !== null;
  }

  /**
   * Query with filter
   */
  async query(predicate: (entity: T) => boolean): Promise<T[]> {
    const all = await this.findAll();
    return all.filter(predicate);
  }
}

// ==========================================
// DATA MODELS
// ==========================================

export interface SavedIdea {
  id: string;
  userInput: string;
  output: unknown;
  timestamp: number;
  title: string;
  category?: string;
  tags: string[];
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: boolean;
  autoSave: boolean;
  defaultProvider?: string;
}

export interface Draft {
  id: string;
  content: string;
  timestamp: number;
  autoSave: boolean;
}

// ==========================================
// SPECIFIC REPOSITORIES
// ==========================================

export class SavedIdeasRepository extends GenericRepository<SavedIdea> {
  constructor(storage: StorageAdapter) {
    super(storage, 'saved-ideas');
  }

  async findRecent(limit = 10): Promise<SavedIdea[]> {
    const all = await this.findAll();
    return all
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  async findByCategory(category: string): Promise<SavedIdea[]> {
    return this.query(idea => idea.category === category);
  }

  async search(query: string): Promise<SavedIdea[]> {
    const lowerQuery = query.toLowerCase();
    return this.query(
      idea =>
        idea.title.toLowerCase().includes(lowerQuery) ||
        idea.userInput.toLowerCase().includes(lowerQuery) ||
        idea.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }
}

export class UserPreferencesRepository extends GenericRepository<UserPreferences> {
  private static readonly KEY = 'user-prefs';

  constructor(storage: StorageAdapter) {
    super(storage, 'prefs');
  }

  async getPreferences(): Promise<UserPreferences> {
    const prefs = await this.findById(UserPreferencesRepository.KEY);
    return (
      prefs ?? {
        theme: 'system',
        language: 'en',
        notifications: true,
        autoSave: true,
      }
    );
  }

  async savePreferences(prefs: UserPreferences): Promise<boolean> {
    return this.save(UserPreferencesRepository.KEY, prefs);
  }
}

export class DraftRepository extends GenericRepository<Draft> {
  constructor(storage: StorageAdapter) {
    super(storage, 'drafts');
  }

  async getLatest(): Promise<Draft | null> {
    const all = await this.findAll();
    if (all.length === 0) return null;
    
    return all.sort((a, b) => b.timestamp - a.timestamp)[0];
  }

  async cleanupOld(maxAgeMs = 7 * 24 * 60 * 60 * 1000): Promise<number> {
    const all = await this.findAll();
    const cutoff = Date.now() - maxAgeMs;
    let deleted = 0;
    
    for (const draft of all) {
      if (draft.timestamp < cutoff) {
        await this.delete(draft.id);
        deleted++;
      }
    }
    
    return deleted;
  }
}

// ==========================================
// DATA LAYER FACADE
// ==========================================

export class DataLayer {
  public storage: StorageAdapter;
  public cache: CacheManager;
  public savedIdeas: SavedIdeasRepository;
  public preferences: UserPreferencesRepository;
  public drafts: DraftRepository;

  constructor(isServer = typeof window === 'undefined') {
    // Use appropriate storage for environment
    this.storage = isServer 
      ? new MemoryStorageAdapter() 
      : new LocalStorageAdapter();
    
    this.cache = new CacheManager(this.storage, 'cache:');
    this.savedIdeas = new SavedIdeasRepository(this.storage);
    this.preferences = new UserPreferencesRepository(this.storage);
    this.drafts = new DraftRepository(this.storage);
  }

  /**
   * Initialize data layer
   */
  async initialize(): Promise<void> {
    // Cleanup old drafts
    await this.drafts.cleanupOld();
    
    // Clean expired cache
    const cacheStats = await this.cache.getStats();
    if (cacheStats.expired > 10) {
      // Clear if too many expired entries
      await this.cache.clear();
    }
    
    globalEventBus.emit('data:initialized', { timestamp: Date.now() });
  }

  /**
   * Export all data
   */
  async export(): Promise<{
    ideas: SavedIdea[];
    preferences: UserPreferences;
    drafts: Draft[];
  }> {
    return {
      ideas: await this.savedIdeas.findAll(),
      preferences: await this.preferences.getPreferences(),
      drafts: await this.drafts.findAll(),
    };
  }

  /**
   * Import data
   */
  async import(data: {
    ideas?: SavedIdea[];
    preferences?: UserPreferences;
    drafts?: Draft[];
  }): Promise<boolean> {
    try {
      if (data.ideas) {
        for (const idea of data.ideas) {
          await this.savedIdeas.save(idea.id, idea);
        }
      }
      
      if (data.preferences) {
        await this.preferences.savePreferences(data.preferences);
      }
      
      if (data.drafts) {
        for (const draft of data.drafts) {
          await this.drafts.save(draft.id, draft);
        }
      }
      
      globalEventBus.emit('data:imported', { timestamp: Date.now() });
      return true;
    } catch (error) {
      safeLogError(error, { operation: 'dataLayer.import' });
      return false;
    }
  }

  /**
   * Clear all data
   */
  async clearAll(): Promise<boolean> {
    try {
      await this.storage.clear();
      globalEventBus.emit('data:cleared', { timestamp: Date.now() });
      return true;
    } catch (error) {
      safeLogError(error, { operation: 'dataLayer.clearAll' });
      return false;
    }
  }
}

// Singleton instance
export const dataLayer = new DataLayer();
