/**
 * TTL Configuration for Cache
 */

export interface TTLConfig {
  default: number;
  max: number;
}

export const DEFAULT_TTL: TTLConfig = {
  default: 300, // 5 minutes
  max: 3600      // 1 hour
};

export function getTTL(priority: 'low' | 'medium' | 'high'): number {
  const ttls = {
    low: 600,    // 10 minutes
    medium: 300, // 5 minutes
    high: 60     // 1 minute
  };
  return ttls[priority];
}
