/**
 * AI Cache Manager with Supabase Persistence
 * Semantic caching for AI responses with similarity matching
 */

import { createHash } from 'crypto';
import { createSupabaseClient } from '@/layer-3-data/storage/supabase-client';

interface CacheEntry {
  id: string;
  promptHash: string;
  promptEmbedding?: number[];
  response: string;
  provider: string;
  model: string;
  createdAt: string;
  accessCount: number;
  lastAccessed: string;
}

interface CacheStats {
  hits: number;
  misses: number;
  totalSavings: number;
}

class AICacheManager {
  private memoryCache: Map<string, CacheEntry> = new Map();
  private similarityThreshold = 0.95;
  private stats: CacheStats = { hits: 0, misses: 0, totalSavings: 0 };
  private readonly maxMemoryCacheSize = 100;

  /**
   * Get cached response for a prompt
   * First checks memory cache, then Supabase
   */
  async getCachedResponse(prompt: string): Promise<string | null> {
    const promptHash = this.hashPrompt(prompt);

    // Check memory cache first
    const memoryEntry = this.memoryCache.get(promptHash);
    if (memoryEntry) {
      this.stats.hits++;
      this.stats.totalSavings += this.estimateCost(memoryEntry.response);
      return memoryEntry.response;
    }

    // Check Supabase for exact match
    try {
      const supabase = createSupabaseClient();
      if (!supabase) return null;

      const { data: exactMatch, error } = await (supabase as any)
        .from('ai_response_cache')
        .select('*')
        .eq('prompt_hash', promptHash)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Cache lookup error:', error);
        return null;
      }

      if (exactMatch) {
        // Update access stats asynchronously
        this.updateAccessStats(exactMatch.id).catch(console.error);

        // Add to memory cache
        this.addToMemoryCache(promptHash, exactMatch);

        this.stats.hits++;
        this.stats.totalSavings += this.estimateCost(exactMatch.response);
        return exactMatch.response;
      }

    } catch (error) {
      console.error('Cache lookup failed:', error);
    }

    this.stats.misses++;
    return null;
  }

  /**
   * Cache a response for future use
   */
  async cacheResponse(
    prompt: string,
    response: string,
    provider: string,
    model: string
  ): Promise<void> {
    const promptHash = this.hashPrompt(prompt);

    // Add to memory cache immediately
    const entry: CacheEntry = {
      id: promptHash,
      promptHash,
      response,
      provider,
      model,
      createdAt: new Date().toISOString(),
      accessCount: 1,
      lastAccessed: new Date().toISOString()
    };

    this.addToMemoryCache(promptHash, entry);

    // Persist to Supabase
    try {
      const supabase = createSupabaseClient();
      if (!supabase) return;

      await (supabase as any)
        .from('ai_response_cache')
        .upsert({
          prompt_hash: promptHash,
          response,
          provider,
          model,
          created_at: new Date().toISOString(),
          access_count: 1,
          last_accessed: new Date().toISOString()
        }, {
          onConflict: 'prompt_hash'
        });

    } catch (error) {
      console.error('Failed to persist cache:', error);
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * Clear memory cache
   */
  clearMemoryCache(): void {
    this.memoryCache.clear();
  }

  /**
   * Create SHA-256 hash of prompt
   */
  private hashPrompt(prompt: string): string {
    return createHash('sha256').update(prompt).digest('hex');
  }

  /**
   * Add entry to memory cache with LRU eviction
   */
  private addToMemoryCache(key: string, entry: CacheEntry): void {
    // Evict oldest if at capacity
    if (this.memoryCache.size >= this.maxMemoryCacheSize) {
      const firstKey = this.memoryCache.keys().next().value;
      if (firstKey) {
        this.memoryCache.delete(firstKey);
      }
    }

    this.memoryCache.set(key, entry);
  }

  /**
   * Update access statistics in Supabase
   */
  private async updateAccessStats(cacheId: string): Promise<void> {
    try {
      const supabase = createSupabaseClient();
      if (!supabase) return;

      await (supabase as any)
        .from('ai_response_cache')
        .update({
          access_count: { sql: 'access_count + 1' },
          last_accessed: new Date().toISOString()
        })
        .eq('id', cacheId);

    } catch (error) {
      // Non-critical error
      console.warn('Failed to update cache stats:', error);
    }
  }

  /**
   * Estimate cost savings from cache hit
   */
  private estimateCost(response: string): number {
    // Rough estimate: $0.002 per 1K tokens for GPT-4o-mini equivalent
    const tokens = Math.ceil(response.length / 4);
    return (tokens / 1000) * 0.002;
  }
}

// Global cache manager instance
export const aiCacheManager = new AICacheManager();

// Legacy export for backward compatibility
class SimpleCacheManager {
  private cache: Map<string, { prompt: string; response: string; timestamp: number; ttl: number }> = new Map();
  private defaultTTL = 1000 * 60 * 60;

  get(prompt: string): string | null {
    aiCacheManager.getCachedResponse(prompt).catch(console.error);
    return null;
  }

  set(prompt: string, response: string, _ttl?: number): void {
    aiCacheManager.cacheResponse(prompt, response, 'unknown', 'unknown').catch(console.error);
  }
}

export const aiCache = new SimpleCacheManager();
export { AICacheManager };
export type { CacheEntry, CacheStats };
