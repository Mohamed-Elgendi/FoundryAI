/**
 * App Initialization and Wiring Layer
 * Connects all layers together, handles startup, dependency injection
 */

'use client';

import { Database } from './layers/data-layer';
import { SecurityLayer } from './layers/security-layer';
import { FeedbackLayer } from './layers/feedback-layer';
import { AIService, PlanService, ServiceRegistry, serviceRegistry } from './layers/services-layer';
import { LogicLayer } from './layers/logic-layer';
import { Component, ReactNode, useState, useEffect } from 'react';

// Application context - holds all initialized layers
export interface AppContext {
  // Layer 5: Data
  database: Database;
  
  // Layer 6: Security
  security: SecurityLayer;
  
  // Layer 7: Feedback
  feedback: FeedbackLayer;
  
  // Layer 8: Services
  services: {
    ai: AIService;
    plans: PlanService;
  };
  
  // Layer 4: Logic
  logic: LogicLayer;
}

// App initialization state
export enum AppState {
  UNINITIALIZED = 'uninitialized',
  INITIALIZING = 'initializing',
  READY = 'ready',
  ERROR = 'error',
}

// App initializer - singleton
class AppInitializer {
  private static instance: AppInitializer;
  private state: AppState = AppState.UNINITIALIZED;
  private context: AppContext | null = null;
  private error: Error | null = null;
  
  static getInstance(): AppInitializer {
    if (!AppInitializer.instance) {
      AppInitializer.instance = new AppInitializer();
    }
    return AppInitializer.instance;
  }
  
  async initialize(): Promise<AppContext> {
    if (this.state === AppState.READY && this.context) {
      return this.context;
    }
    
    if (this.state === AppState.INITIALIZING) {
      // Wait for initialization to complete
      while (this.state === AppState.INITIALIZING) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      if (this.context) return this.context;
      throw this.error || new Error('Initialization failed');
    }
    
    this.state = AppState.INITIALIZING;
    
    try {
      console.log('[App] Starting initialization...');
      
      // Step 1: Initialize Database (Layer 5)
      console.log('[App] Initializing Database...');
      const database = Database;
      
      // Step 2: Initialize Security (Layer 6)
      console.log('[App] Initializing Security...');
      const security = new SecurityLayer(database.getInstance());
      await security.initialize();
      
      // Step 3: Initialize Feedback (Layer 7)
      console.log('[App] Initializing Feedback...');
      const feedback = new FeedbackLayer(database.getInstance());
      
      // Step 4: Initialize Services (Layer 8)
      console.log('[App] Initializing Services...');
      const aiService = new AIService(feedback);
      const planService = new PlanService(database, security, feedback);
      
      // Register services
      serviceRegistry.register(aiService);
      serviceRegistry.register(planService);
      await serviceRegistry.initializeAll();
      
      // Step 5: Initialize Logic (Layer 4)
      console.log('[App] Initializing Logic Layer...');
      const logic = new LogicLayer(aiService, planService, security, feedback);
      
      // Build context
      this.context = {
        database,
        security,
        feedback,
        services: {
          ai: aiService,
          plans: planService,
        },
        logic,
      };
      
      // Health check
      console.log('[App] Running health checks...');
      const health = await serviceRegistry.healthCheck();
      console.log('[App] Service health:', health);
      
      this.state = AppState.READY;
      console.log('[App] Initialization complete!');
      
      return this.context;
    } catch (error) {
      this.state = AppState.ERROR;
      this.error = error instanceof Error ? error : new Error(String(error));
      console.error('[App] Initialization failed:', error);
      throw this.error;
    }
  }
  
  getState(): AppState {
    return this.state;
  }
  
  getContext(): AppContext | null {
    return this.context;
  }
  
  async dispose(): Promise<void> {
    if (this.context?.feedback) {
      this.context.feedback.dispose();
    }
    this.state = AppState.UNINITIALIZED;
    this.context = null;
    this.error = null;
  }
}

// Export singleton
export const appInitializer = AppInitializer.getInstance();

// React hook for accessing app context
export function useApp(): AppContext {
  const [context, setContext] = useState<AppContext | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    appInitializer.initialize()
      .then(setContext)
      .catch(setError);
  }, []);
  
  if (error) {
    throw error;
  }
  
  if (!context) {
    throw new Error('App not initialized - use AppProvider');
  }
  
  return context;
}

// Error boundary for app initialization failures
interface AppErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  constructor(props: AppErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: any) {
    console.error('App Error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-slate-600 mb-4">
              {this.state.error?.message || 'Failed to initialize the application'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }
    
    return this.props.children;
  }
}
