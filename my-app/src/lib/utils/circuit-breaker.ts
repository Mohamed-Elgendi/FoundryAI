/**
 * Circuit Breaker Pattern for API Resilience
 * Prevents cascading failures when APIs are down or rate-limited
 */

import { safeLogError } from './logger';

interface CircuitBreakerConfig {
  failureThreshold: number;      // Number of failures before opening circuit
  resetTimeout: number;          // Time in ms before attempting to close
  halfOpenMaxCalls: number;      // Max calls in half-open state
}

interface CircuitState {
  status: 'closed' | 'open' | 'half-open';
  failures: number;
  lastFailureTime: number | null;
  halfOpenCalls: number;
}

const defaultConfig: CircuitBreakerConfig = {
  failureThreshold: 5,
  resetTimeout: 30000, // 30 seconds
  halfOpenMaxCalls: 3,
};

// Store circuit states for different API endpoints
const circuits = new Map<string, CircuitState>();

/**
 * Circuit Breaker - Prevents cascading failures
 */
export class CircuitBreaker {
  private name: string;
  private config: CircuitBreakerConfig;

  constructor(name: string, config: Partial<CircuitBreakerConfig> = {}) {
    this.name = name;
    this.config = { ...defaultConfig, ...config };
    
    if (!circuits.has(name)) {
      circuits.set(name, {
        status: 'closed',
        failures: 0,
        lastFailureTime: null,
        halfOpenCalls: 0,
      });
    }
  }

  /**
   * Execute a function with circuit breaker protection
   */
  async execute<T>(fn: () => Promise<T>, fallback?: T): Promise<T> {
    const state = circuits.get(this.name)!;

    // Check if circuit is open
    if (state.status === 'open') {
      const now = Date.now();
      if (state.lastFailureTime && now - state.lastFailureTime >= this.config.resetTimeout) {
        // Try half-open state
        state.status = 'half-open';
        state.halfOpenCalls = 0;
        console.log(`[CircuitBreaker] ${this.name}: Entering half-open state`);
      } else {
        // Circuit still open, return fallback
        const remainingTime = state.lastFailureTime 
          ? Math.ceil((this.config.resetTimeout - (now - state.lastFailureTime)) / 1000)
          : 0;
        
        console.log(`[CircuitBreaker] ${this.name}: Circuit OPEN, try again in ${remainingTime}s`);
        
        if (fallback !== undefined) {
          return fallback;
        }
        
        throw new Error(`Circuit breaker for ${this.name} is OPEN. Try again later.`);
      }
    }

    // Limit half-open calls
    if (state.status === 'half-open' && state.halfOpenCalls >= this.config.halfOpenMaxCalls) {
      throw new Error(`Circuit breaker for ${this.name} is at capacity in half-open state.`);
    }

    // Track half-open calls
    if (state.status === 'half-open') {
      state.halfOpenCalls++;
    }

    try {
      const result = await fn();
      
      // Success - close the circuit
      this.onSuccess();
      
      return result;
    } catch (error) {
      // Failure - record it
      this.onFailure();
      
      safeLogError(error, {
        circuitBreaker: this.name,
        status: state.status,
        failures: state.failures,
      });

      if (fallback !== undefined) {
        return fallback;
      }
      
      throw error;
    }
  }

  /**
   * Record a successful call
   */
  private onSuccess(): void {
    const state = circuits.get(this.name)!;
    
    if (state.status === 'half-open') {
      // Close the circuit
      state.status = 'closed';
      state.failures = 0;
      state.halfOpenCalls = 0;
      console.log(`[CircuitBreaker] ${this.name}: Circuit CLOSED (recovered)`);
    } else {
      // Reset failures in closed state
      state.failures = 0;
    }
  }

  /**
   * Record a failed call
   */
  private onFailure(): void {
    const state = circuits.get(this.name)!;
    
    state.failures++;
    state.lastFailureTime = Date.now();

    if (state.status === 'half-open') {
      // Re-open the circuit
      state.status = 'open';
      state.halfOpenCalls = 0;
      console.log(`[CircuitBreaker] ${this.name}: Circuit OPENED (still failing)`);
    } else if (state.failures >= this.config.failureThreshold) {
      // Open the circuit
      state.status = 'open';
      console.log(`[CircuitBreaker] ${this.name}: Circuit OPENED (${state.failures} failures)`);
    }
  }

  /**
   * Get current circuit status
   */
  getStatus(): CircuitState {
    return { ...circuits.get(this.name)! };
  }

  /**
   * Manually reset the circuit
   */
  reset(): void {
    circuits.set(this.name, {
      status: 'closed',
      failures: 0,
      lastFailureTime: null,
      halfOpenCalls: 0,
    });
    console.log(`[CircuitBreaker] ${this.name}: Manually reset`);
  }
}

// Pre-configured circuit breakers for common APIs
export const apiCircuitBreakers = {
  groq: new CircuitBreaker('groq', { failureThreshold: 3, resetTimeout: 60000 }),
  gemini: new CircuitBreaker('gemini', { failureThreshold: 3, resetTimeout: 60000 }),
  mistral: new CircuitBreaker('mistral', { failureThreshold: 3, resetTimeout: 60000 }),
  together: new CircuitBreaker('together', { failureThreshold: 3, resetTimeout: 60000 }),
  cohere: new CircuitBreaker('cohere', { failureThreshold: 3, resetTimeout: 60000 }),
  openrouter: new CircuitBreaker('openrouter', { failureThreshold: 3, resetTimeout: 60000 }),
  generate: new CircuitBreaker('generate-api', { failureThreshold: 5, resetTimeout: 30000 }),
  refine: new CircuitBreaker('refine-api', { failureThreshold: 5, resetTimeout: 30000 }),
  feedback: new CircuitBreaker('feedback-api', { failureThreshold: 5, resetTimeout: 30000 }),
};

/**
 * Wrap an API call with circuit breaker protection
 */
export async function withCircuitBreaker<T>(
  circuitName: keyof typeof apiCircuitBreakers,
  fn: () => Promise<T>,
  fallback?: T
): Promise<T> {
  const breaker = apiCircuitBreakers[circuitName];
  return breaker.execute(fn, fallback);
}

/**
 * Get status of all circuits (for monitoring)
 */
export function getAllCircuitStatuses(): Record<string, CircuitState> {
  return Object.fromEntries(
    Object.entries(apiCircuitBreakers).map(([name, breaker]) => [
      name,
      breaker.getStatus(),
    ])
  );
}
