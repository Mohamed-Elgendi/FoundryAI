/**
 * Retry Mechanism with Exponential Backoff
 * Automatically retries failed operations with increasing delays
 */

import { safeLogError } from './logger';

interface RetryConfig {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  retryableErrors?: string[];
  onRetry?: (attempt: number, error: unknown, delay: number) => void;
}

const defaultRetryConfig: RetryConfig = {
  maxAttempts: 3,
  initialDelay: 1000,    // 1 second
  maxDelay: 30000,       // 30 seconds
  backoffMultiplier: 2,
};

/**
 * Sleep for a given duration
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Calculate delay with exponential backoff and jitter
 */
function calculateDelay(attempt: number, config: RetryConfig): number {
  const exponentialDelay = config.initialDelay * Math.pow(config.backoffMultiplier, attempt - 1);
  const jitter = Math.random() * 0.3 * exponentialDelay; // Add 0-30% jitter
  const delay = Math.min(exponentialDelay + jitter, config.maxDelay);
  return Math.floor(delay);
}

/**
 * Check if an error is retryable
 */
function isRetryableError(error: unknown, retryableErrors?: string[]): boolean {
  if (!retryableErrors) return true; // Retry all by default
  
  const errorMessage = error instanceof Error ? error.message : String(error);
  return retryableErrors.some(pattern => 
    errorMessage.toLowerCase().includes(pattern.toLowerCase())
  );
}

/**
 * Execute a function with retry logic
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const fullConfig = { ...defaultRetryConfig, ...config };
  let lastError: unknown;

  for (let attempt = 1; attempt <= fullConfig.maxAttempts; attempt++) {
    try {
      const result = await fn();
      
      // Log successful retry
      if (attempt > 1) {
        console.log(`[Retry] Operation succeeded on attempt ${attempt}`);
      }
      
      return result;
    } catch (error) {
      lastError = error;
      
      // Check if we should retry this error
      if (!isRetryableError(error, fullConfig.retryableErrors)) {
        throw error;
      }
      
      // Don't retry on last attempt
      if (attempt === fullConfig.maxAttempts) {
        break;
      }
      
      // Calculate and apply delay
      const delay = calculateDelay(attempt, fullConfig);
      
      // Call retry callback if provided
      fullConfig.onRetry?.(attempt, error, delay);
      
      console.log(`[Retry] Attempt ${attempt} failed, retrying in ${delay}ms...`);
      await sleep(delay);
    }
  }

  // All retries exhausted
  safeLogError(lastError, {
    operation: 'withRetry',
    attempts: fullConfig.maxAttempts,
  });
  
  throw lastError;
}

/**
 * Retry with circuit breaker pattern
 */
export async function withRetryAndCircuitBreaker<T>(
  fn: () => Promise<T>,
  breaker: { execute: (fn: () => Promise<T>, fallback?: T) => Promise<T> },
  config: Partial<RetryConfig> = {},
  fallback?: T
): Promise<T> {
  return breaker.execute(
    () => withRetry(fn, config),
    fallback
  );
}

/**
 * Pre-configured retry strategies
 */
export const retryStrategies = {
  // For AI API calls - more retries with longer delays
  apiCall: {
    maxAttempts: 3,
    initialDelay: 2000,
    maxDelay: 30000,
    backoffMultiplier: 2,
    retryableErrors: ['rate limit', 'timeout', 'network', '429', '503', '502'],
  },
  
  // For database operations - fewer retries
  database: {
    maxAttempts: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2,
    retryableErrors: ['connection', 'timeout', 'busy'],
  },
  
  // For network requests
  network: {
    maxAttempts: 5,
    initialDelay: 1000,
    maxDelay: 60000,
    backoffMultiplier: 2,
    retryableErrors: ['network', 'timeout', 'fetch', 'connection'],
  },
  
  // Quick retries for fast operations
  quick: {
    maxAttempts: 3,
    initialDelay: 100,
    maxDelay: 1000,
    backoffMultiplier: 2,
  },
};

/**
 * Execute with specific retry strategy
 */
export async function withRetryStrategy<T>(
  fn: () => Promise<T>,
  strategy: keyof typeof retryStrategies
): Promise<T> {
  return withRetry(fn, retryStrategies[strategy]);
}

/**
 * Create a debounced function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

/**
 * Create a throttled function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}
