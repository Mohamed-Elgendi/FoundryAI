/**
 * LAYER 4: SERVICES LAYER
 * =======================
 * Abstraction layer for all external services and APIs
 * Provides unified interfaces, error handling, and fallbacks
 */

import { safeLogError, safeExecuteAsync } from '@/lib/utils/logger';
import { withRetry, withRetryStrategy } from '@/lib/utils/retry';
import { CircuitBreaker, apiCircuitBreakers } from '@/lib/utils/circuit-breaker';
import { globalEventBus } from '@/layer-3-data/repositories/logic-layer';

// ==========================================
// SERVICE INTERFACES
// ==========================================

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  metadata: {
    duration: number;
    retries: number;
    timestamp: number;
  };
}

export interface ServiceConfig {
  timeout: number;
  retries: number;
  circuitBreaker: boolean;
  cacheEnabled: boolean;
  cacheTtl: number;
}

export interface ServiceHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  lastChecked: number;
  responseTime: number;
  errorRate: number;
}

// ==========================================
// BASE SERVICE CLASS
// ==========================================

export abstract class BaseService {
  protected config: ServiceConfig;
  protected circuitBreaker?: CircuitBreaker;
  protected health: ServiceHealth;

  constructor(
    name: string,
    config: Partial<ServiceConfig> = {}
  ) {
    this.config = {
      timeout: 30000,
      retries: 3,
      circuitBreaker: true,
      cacheEnabled: false,
      cacheTtl: 5 * 60 * 1000,
      ...config,
    };

    this.health = {
      status: 'healthy',
      lastChecked: Date.now(),
      responseTime: 0,
      errorRate: 0,
    };

    if (this.config.circuitBreaker) {
      this.circuitBreaker = apiCircuitBreakers[name as keyof typeof apiCircuitBreakers] 
        || new CircuitBreaker(name, { failureThreshold: 5, resetTimeout: 60000 });
    }
  }

  /**
   * Execute service call with all protections
   */
  protected async execute<T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<ServiceResponse<T>> {
    const startTime = Date.now();
    let retries = 0;

    try {
      let result: T;

      if (this.circuitBreaker) {
        result = await this.circuitBreaker.execute(
          async () => {
            retries++;
            return await withRetry(
              async () => {
                const timeoutPromise = new Promise<never>((_, reject) => 
                  setTimeout(() => reject(new Error('Timeout')), this.config.timeout)
                );
                return await Promise.race([operation(), timeoutPromise]);
              },
              {
                maxAttempts: this.config.retries,
                initialDelay: 1000,
                maxDelay: 10000,
                backoffMultiplier: 2,
              }
            );
          }
        );
      } else {
        result = await withRetry(operation, {
          maxAttempts: this.config.retries,
          initialDelay: 1000,
        });
      }

      const duration = Date.now() - startTime;
      this.updateHealth('healthy', duration);

      return {
        success: true,
        data: result,
        metadata: {
          duration,
          retries: Math.max(0, retries - 1),
          timestamp: Date.now(),
        },
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      this.updateHealth('unhealthy', duration, true);

      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      safeLogError(error, {
        service: operationName,
        duration,
        retries,
      });

      return {
        success: false,
        error: errorMessage,
        metadata: {
          duration,
          retries: retries - 1,
          timestamp: Date.now(),
        },
      };
    }
  }

  /**
   * Update service health
   */
  private updateHealth(
    status: ServiceHealth['status'],
    responseTime: number,
    isError = false
  ): void {
    this.health.lastChecked = Date.now();
    this.health.responseTime = responseTime;
    
    // Simple error rate calculation (last 10 calls approximation)
    const currentErrorRate = this.health.errorRate;
    this.health.errorRate = isError 
      ? currentErrorRate * 0.9 + 0.1 
      : currentErrorRate * 0.9;
    
    // Determine status based on error rate
    if (this.health.errorRate > 0.5) {
      this.health.status = 'unhealthy';
    } else if (this.health.errorRate > 0.2) {
      this.health.status = 'degraded';
    } else {
      this.health.status = 'healthy';
    }
  }

  /**
   * Get current health status
   */
  getHealth(): ServiceHealth {
    return { ...this.health };
  }

  /**
   * Check if service is available
   */
  isAvailable(): boolean {
    return this.health.status !== 'unhealthy';
  }
}

// ==========================================
// AI SERVICE
// ==========================================

export interface AIRequest {
  prompt: string;
  temperature?: number;
  maxTokens?: number;
  preferredProvider?: string;
}

export interface AIResult {
  content: string;
  provider: string;
  latency: number;
}

export class AIService extends BaseService {
  private apiEndpoint: string;

  constructor(apiEndpoint = '/api/generate') {
    super('ai-service', {
      timeout: 60000, // AI calls can take longer
      retries: 2,
      circuitBreaker: true,
    });
    this.apiEndpoint = apiEndpoint;
  }

  /**
   * Generate content from AI
   */
  async generate(request: AIRequest): Promise<ServiceResponse<AIResult>> {
    globalEventBus.emit('ai:request', { timestamp: Date.now() });

    const response = await this.execute(async () => {
      const res = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      
      globalEventBus.emit('ai:success', { 
        timestamp: Date.now(),
        provider: data.provider,
      });

      return {
        content: data.content,
        provider: data.provider,
        latency: data.latencyMs || 0,
      } as AIResult;
    }, 'ai-generate');

    if (!response.success) {
      globalEventBus.emit('ai:error', { 
        timestamp: Date.now(),
        error: response.error,
      });
    }

    return response;
  }

  /**
   * Refine existing content
   */
  async refine(
    originalInput: string,
    currentOutput: unknown,
    refinement: string
  ): Promise<ServiceResponse<AIResult>> {
    return this.execute(async () => {
      const res = await fetch('/api/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput: originalInput,
          currentOutput,
          refinementInput: refinement,
        }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      
      return {
        content: data.content,
        provider: data.provider,
        latency: data.latencyMs || 0,
      } as AIResult;
    }, 'ai-refine');
  }
}

// ==========================================
// FEEDBACK SERVICE
// ==========================================

export interface FeedbackRequest {
  userInput: string;
  output: unknown;
  isHelpful: boolean;
  comment?: string;
}

export class FeedbackService extends BaseService {
  constructor() {
    super('feedback-service', {
      timeout: 10000,
      retries: 2,
      circuitBreaker: true,
    });
  }

  /**
   * Submit user feedback
   */
  async submit(request: FeedbackRequest): Promise<ServiceResponse<void>> {
    return this.execute(async () => {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!res.ok) {
        throw new Error(`Failed to submit feedback: ${res.status}`);
      }
    }, 'feedback-submit');
  }
}

// ==========================================
// ANALYTICS SERVICE (Stub for future expansion)
// ==========================================

export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, unknown>;
  timestamp?: number;
}

export class AnalyticsService extends BaseService {
  private queue: AnalyticsEvent[] = [];
  private flushInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    super('analytics-service', {
      timeout: 5000,
      retries: 1,
      circuitBreaker: false,
    });
    
    this.startFlushInterval();
  }

  /**
   * Track an event
   */
  track(event: string, properties?: Record<string, unknown>): void {
    this.queue.push({
      event,
      properties,
      timestamp: Date.now(),
    });
  }

  /**
   * Start automatic flushing
   */
  private startFlushInterval(): void {
    if (typeof window !== 'undefined') {
      this.flushInterval = setInterval(() => {
        this.flush();
      }, 30000); // Flush every 30 seconds
    }
  }

  /**
   * Flush events to server
   */
  async flush(): Promise<void> {
    if (this.queue.length === 0) return;

    const events = [...this.queue];
    this.queue = [];

    await safeExecuteAsync(
      async () => {
        // Placeholder for actual analytics endpoint
        console.log('[Analytics] Flushing events:', events.length);
      },
      undefined,
      { operation: 'analyticsFlush' }
    );
  }

  /**
   * Stop the service
   */
  stop(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    this.flush();
  }
}

// ==========================================
// SERVICE REGISTRY
// ==========================================

export class ServiceRegistry {
  private services = new Map<string, BaseService>();

  /**
   * Register a service
   */
  register(name: string, service: BaseService): this {
    this.services.set(name, service);
    return this;
  }

  /**
   * Get a service
   */
  get<T extends BaseService>(name: string): T | undefined {
    return this.services.get(name) as T;
  }

  /**
   * Get all service health statuses
   */
  getAllHealth(): Record<string, ServiceHealth> {
    const health: Record<string, ServiceHealth> = {};
    
    for (const [name, service] of this.services) {
      health[name] = service.getHealth();
    }
    
    return health;
  }

  /**
   * Check if all critical services are healthy
   */
  areCriticalServicesHealthy(): boolean {
    for (const [name, service] of this.services) {
      if (name === 'ai-service' && !service.isAvailable()) {
        return false;
      }
    }
    return true;
  }
}

// ==========================================
// SERVICE FACADE
// ==========================================

export class ServicesLayer {
  public registry: ServiceRegistry;
  public ai: AIService;
  public feedback: FeedbackService;
  public analytics: AnalyticsService;

  constructor() {
    this.registry = new ServiceRegistry();
    
    // Initialize services
    this.ai = new AIService();
    this.feedback = new FeedbackService();
    this.analytics = new AnalyticsService();
    
    // Register services
    this.registry
      .register('ai', this.ai)
      .register('feedback', this.feedback)
      .register('analytics', this.analytics);
  }

  /**
   * Initialize all services
   */
  async initialize(): Promise<void> {
    globalEventBus.emit('services:initialized', { timestamp: Date.now() });
  }

  /**
   * Get system health status
   */
  getHealth(): {
    overall: 'healthy' | 'degraded' | 'unhealthy';
    services: Record<string, ServiceHealth>;
  } {
    const services = this.registry.getAllHealth();
    
    let overall: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    
    for (const health of Object.values(services)) {
      if (health.status === 'unhealthy') {
        overall = 'unhealthy';
        break;
      } else if (health.status === 'degraded') {
        overall = 'degraded';
      }
    }
    
    return { overall, services };
  }

  /**
   * Cleanup all services
   */
  cleanup(): void {
    this.analytics.stop();
    globalEventBus.emit('services:cleanup', { timestamp: Date.now() });
  }
}

// Singleton instance
export const servicesLayer = new ServicesLayer();
