/**
 * Cache Manager
 * Provides caching capabilities with TTL and invalidation
 */

import { StorageAdapter, MemoryStorageAdapter } from '../storage/adapters';

export interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  oldestEntry?: number;
}

export class CacheManager {
  private adapter: StorageAdapter;
  private stats: { hits: number; misses: number } = { hits: 0, misses: 0 };

  constructor(adapter: StorageAdapter = new MemoryStorageAdapter()) {
    this.adapter = adapter;
  }

  async getOrCompute<T>(
    key: string,
    compute: () => Promise<T>,
    ttlMs?: number
  ): Promise<T> {
    // Try to get from cache
    const cached = await this.adapter.get<T>(key);
    
    if (cached !== null) {
      this.stats.hits++;
      return cached;
    }

    // Compute and cache
    this.stats.misses++;
    const value = await compute();
    await this.adapter.set(key, value, ttlMs ? Math.floor(ttlMs / 1000) : undefined);
    return value;
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.adapter.get<T>(key);
    if (value !== null) {
      this.stats.hits++;
    } else {
      this.stats.misses++;
    }
    return value;
  }

  async set<T>(key: string, value: T, ttlMs?: number): Promise<boolean> {
    return this.adapter.set(key, value, ttlMs ? Math.floor(ttlMs / 1000) : undefined);
  }

  async invalidate(pattern: string): Promise<number> {
    const keys = await this.adapter.keys();
    let count = 0;

    for (const key of keys) {
      if (key.includes(pattern)) {
        await this.adapter.remove(key);
        count++;
      }
    }

    return count;
  }

  async invalidatePrefix(prefix: string): Promise<number> {
    const keys = await this.adapter.keys();
    let count = 0;

    for (const key of keys) {
      if (key.startsWith(prefix)) {
        await this.adapter.remove(key);
        count++;
      }
    }

    return count;
  }

  async clear(): Promise<boolean> {
    return this.adapter.clear();
  }

  async getStats(): Promise<CacheStats> {
    const keys = await this.adapter.keys();
    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      size: keys.length,
    };
  }

  resetStats(): void {
    this.stats = { hits: 0, misses: 0 };
  }
}

// Global cache instance
export const globalCache = new CacheManager();
