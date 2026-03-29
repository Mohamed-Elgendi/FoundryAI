/**
 * FoundryAI - 12-Layer Architecture
 * 
 * Layer Mapping:
 * L1: Customer Journey → User flows, onboarding, navigation
 * L2: UX Design → UI components, theming, accessibility  
 * L3: Architecture → Module boundaries, service communication
 * L4: Logic Layer → Business logic, state management, workflows
 * L5: Data Layer → Supabase repositories, caching, migrations
 * L6: Security → Auth, RBAC, encryption, API security
 * L7: Feedback → Analytics, error tracking, logging
 * L8: Services → AI service, plan service, integrations
 * L9: Frontend → Dashboard shell, navigation, routing
 * L10/11: GTM/Monetization → Plan generation engine, templates
 * L12: Prompt Chain → Sequential prompt system
 */

// Core architectural principles
export const ARCHITECTURE = {
  // Communication patterns
  communication: {
    // Modules communicate via events, not direct imports
    eventBus: 'central-event-bus',
    // Services use defined contracts (interfaces)
    serviceContracts: true,
    // API calls go through gateway with auth, rate limiting
    apiGateway: true,
  },
  
  // Fault tolerance
  resilience: {
    // Circuit breakers for external services
    circuitBreakers: true,
    // Graceful degradation when services fail
    gracefulDegradation: true,
    // Automatic retries with backoff
    retryPolicy: true,
    // Each module isolated - failure doesn't cascade
    moduleIsolation: true,
  },
  
  // Expansion hooks
  extensibility: {
    // Plugin system for new features
    pluginSystem: true,
    // Feature flags for gradual rollout
    featureFlags: true,
    // Module registration system
    moduleRegistry: true,
  }
} as const;

// Module boundaries - each is self-contained
export enum ModuleId {
  AUTH = 'auth',
  ANALYTICS = 'analytics',
  AI_ENGINE = 'ai-engine',
  PLAN_GENERATOR = 'plan-generator',
  OPPORTUNITY_RADAR = 'opportunity-radar',
  USER_DASHBOARD = 'user-dashboard',
  BILLING = 'billing',
  NOTIFICATIONS = 'notifications',
}

// Service contracts - all services implement these
export interface ServiceContract {
  id: string;
  version: string;
  health(): Promise<boolean>;
  initialize(): Promise<void>;
  dispose(): Promise<void>;
}
