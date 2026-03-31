/**
 * AI Cache Module
 * Response caching for AI queries
 */

interface CacheEntry {
  prompt: string;
  response: string;
  timestamp: number;
  ttl: number;
}

class CacheManager {
  private cache: Map<string, CacheEntry> = new Map();
  private defaultTTL = 1000 * 60 * 60; // 1 hour

  get(prompt: string): string | null {
    const key = this.hashPrompt(prompt);
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.response;
  }

  set(prompt: string, response: string, ttl?: number): void {
    const key = this.hashPrompt(prompt);
    this.cache.set(key, {
      prompt,
      response,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    });
  }

  private hashPrompt(prompt: string): string {
    // Simple hash for demo
    let hash = 0;
    for (let i = 0; i < prompt.length; i++) {
      const char = prompt.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString();
  }
}

export const aiCache = new CacheManager();
