/**
 * Storage Adapter Interface and Implementations
 * Provides abstraction layer for data storage
 */

export interface StorageAdapter {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<boolean>;
  remove(key: string): Promise<boolean>;
  clear(): Promise<boolean>;
  keys(): Promise<string[]>;
}

/**
 * Memory Storage Adapter - For caching and temporary storage
 */
export class MemoryStorageAdapter implements StorageAdapter {
  private store: Map<string, { value: unknown; expiry?: number }> = new Map();

  async get<T>(key: string): Promise<T | null> {
    const item = this.store.get(key);
    if (!item) return null;

    if (item.expiry && Date.now() > item.expiry) {
      this.store.delete(key);
      return null;
    }

    return item.value as T;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    const expiry = ttl ? Date.now() + ttl * 1000 : undefined;
    this.store.set(key, { value, expiry });
    return true;
  }

  async remove(key: string): Promise<boolean> {
    return this.store.delete(key);
  }

  async clear(): Promise<boolean> {
    this.store.clear();
    return true;
  }

  async keys(): Promise<string[]> {
    const now = Date.now();
    return Array.from(this.store.entries())
      .filter(([_, item]) => !item.expiry || item.expiry > now)
      .map(([key]) => key);
  }
}

/**
 * Local Storage Adapter - For browser localStorage
 */
export class LocalStorageAdapter implements StorageAdapter {
  private prefix: string;

  constructor(prefix = 'foundryai:') {
    this.prefix = prefix;
  }

  async get<T>(key: string): Promise<T | null> {
    if (typeof window === 'undefined') return null;

    try {
      const item = localStorage.getItem(this.prefix + key);
      if (!item) return null;

      const parsed = JSON.parse(item);
      if (parsed.expiry && Date.now() > parsed.expiry) {
        localStorage.removeItem(this.prefix + key);
        return null;
      }

      return parsed.value as T;
    } catch {
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    try {
      const expiry = ttl ? Date.now() + ttl * 1000 : undefined;
      localStorage.setItem(
        this.prefix + key,
        JSON.stringify({ value, expiry })
      );
      return true;
    } catch {
      return false;
    }
  }

  async remove(key: string): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    try {
      localStorage.removeItem(this.prefix + key);
      return true;
    } catch {
      return false;
    }
  }

  async clear(): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      }
      return true;
    } catch {
      return false;
    }
  }

  async keys(): Promise<string[]> {
    if (typeof window === 'undefined') return [];

    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(this.prefix)) {
        keys.push(key.slice(this.prefix.length));
      }
    }
    return keys;
  }
}
