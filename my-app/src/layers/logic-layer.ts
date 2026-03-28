/**
 * LAYER 2: LOGIC LAYER
 * ====================
 * Deep, profound, stable business logic layer
 * Handles all business rules, state management, and processing workflows
 */

import { safeLogError } from '@/lib/utils/logger';
import { validateIdeaInput, validateRefinementInput, type ValidationResult } from '@/lib/utils/validation';

// ==========================================
// CORE STATE MANAGEMENT
// ==========================================

/**
 * Immutable State Container
 * Prevents accidental mutations and tracks changes
 */
export class ImmutableState<T> {
  private _state: T;
  private _history: T[] = [];
  private _listeners: Set<(state: T, prevState: T) => void> = new Set();

  constructor(initialState: T) {
    this._state = this.deepFreeze(initialState);
  }

  get state(): T {
    return this._state;
  }

  get history(): T[] {
    return [...this._history];
  }

  /**
   * Update state immutably
   */
  setState(updater: (prev: T) => T): T {
    const prevState = this._state;
    const newState = this.deepFreeze(updater(prevState));
    
    this._history.push(prevState);
    this._state = newState;
    
    // Notify listeners
    this._listeners.forEach(listener => {
      try {
        listener(newState, prevState);
      } catch (error) {
        safeLogError(error, { operation: 'stateListener' });
      }
    });
    
    return newState;
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: (state: T, prevState: T) => void): () => void {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }

  /**
   * Deep freeze object to prevent mutations
   */
  private deepFreeze<U>(obj: U): U {
    if (obj === null || typeof obj !== 'object') return obj;
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.deepFreeze(item)) as unknown as U;
    }
    
    const frozen: Record<string, unknown> = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        frozen[key] = this.deepFreeze((obj as Record<string, unknown>)[key]);
      }
    }
    return frozen as U;
  }

  /**
   * Reset to initial or specific state
   */
  reset(toState?: T): T {
    const targetState = toState ?? this._history[0];
    if (targetState) {
      this._state = this.deepFreeze(targetState);
      this._history = [];
    }
    return this._state;
  }
}

// ==========================================
// WORKFLOW ENGINE
// ==========================================

export type WorkflowStep = 
  | 'input_validation'
  | 'idea_processing'
  | 'ai_generation'
  | 'result_parsing'
  | 'ui_rendering'
  | 'user_feedback';

export type WorkflowStatus = 'idle' | 'running' | 'paused' | 'completed' | 'failed';

export interface WorkflowContext {
  step: WorkflowStep;
  status: WorkflowStatus;
  data: unknown;
  metadata: Record<string, unknown>;
  startTime: number;
  endTime?: number;
  error?: string;
}

/**
 * Workflow Engine - Manages complex multi-step processes
 */
export class WorkflowEngine {
  private steps: Map<WorkflowStep, (ctx: WorkflowContext) => Promise<WorkflowContext>> = new Map();
  private onStepComplete?: (step: WorkflowStep, ctx: WorkflowContext) => void;
  private onStepError?: (step: WorkflowStep, error: Error, ctx: WorkflowContext) => void;

  /**
   * Register a workflow step
   */
  registerStep(
    step: WorkflowStep,
    handler: (ctx: WorkflowContext) => Promise<WorkflowContext>
  ): this {
    this.steps.set(step, handler);
    return this;
  }

  /**
   * Execute workflow
   */
  async execute(
    steps: WorkflowStep[],
    initialData: unknown,
    options: {
      onStepComplete?: (step: WorkflowStep, ctx: WorkflowContext) => void;
      onStepError?: (step: WorkflowStep, error: Error, ctx: WorkflowContext) => void;
      timeout?: number;
    } = {}
  ): Promise<WorkflowContext> {
    this.onStepComplete = options.onStepComplete;
    this.onStepError = options.onStepError;

    let context: WorkflowContext = {
      step: steps[0],
      status: 'running',
      data: initialData,
      metadata: {},
      startTime: Date.now(),
    };

    for (const stepName of steps) {
      const handler = this.steps.get(stepName);
      if (!handler) {
        throw new Error(`Workflow step "${stepName}" not registered`);
      }

      try {
        context = await this.runWithTimeout(
          () => handler({ ...context, step: stepName }),
          options.timeout
        );
        
        context.step = stepName;
        this.onStepComplete?.(stepName, context);
      } catch (error) {
        context.status = 'failed';
        context.error = error instanceof Error ? error.message : 'Unknown error';
        context.endTime = Date.now();
        
        this.onStepError?.(stepName, error as Error, context);
        throw error;
      }
    }

    context.status = 'completed';
    context.endTime = Date.now();
    return context;
  }

  /**
   * Run with timeout protection
   */
  private async runWithTimeout<T>(
    fn: () => Promise<T>,
    timeoutMs?: number
  ): Promise<T> {
    if (!timeoutMs) return fn();

    return Promise.race([
      fn(),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Workflow step timeout')), timeoutMs)
      ),
    ]);
  }
}

// ==========================================
// BUSINESS RULES ENGINE
// ==========================================

export interface BusinessRule<T> {
  name: string;
  condition: (data: T) => boolean;
  action: (data: T) => T | Promise<T>;
  errorMessage?: string;
  priority: number;
}

/**
 * Rules Engine - Applies business rules in priority order
 */
export class RulesEngine<T> {
  private rules: BusinessRule<T>[] = [];

  /**
   * Add a business rule
   */
  addRule(rule: BusinessRule<T>): this {
    this.rules.push(rule);
    this.rules.sort((a, b) => a.priority - b.priority);
    return this;
  }

  /**
   * Execute all applicable rules
   */
  async execute(data: T): Promise<{
    result: T;
    appliedRules: string[];
    failedRules: { name: string; error: string }[];
  }> {
    let result = data;
    const appliedRules: string[] = [];
    const failedRules: { name: string; error: string }[] = [];

    for (const rule of this.rules) {
      try {
        if (rule.condition(result)) {
          result = await rule.action(result);
          appliedRules.push(rule.name);
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Rule execution failed';
        failedRules.push({ name: rule.name, error: errorMsg });
        
        if (rule.errorMessage) {
          throw new Error(`${rule.errorMessage}: ${errorMsg}`);
        }
      }
    }

    return { result, appliedRules, failedRules };
  }

  /**
   * Remove a rule by name
   */
  removeRule(name: string): this {
    this.rules = this.rules.filter(r => r.name !== name);
    return this;
  }

  /**
   * Get all registered rules
   */
  getRules(): BusinessRule<T>[] {
    return [...this.rules];
  }
}

// ==========================================
// IDEA PROCESSING LOGIC
// ==========================================

export interface IdeaInput {
  raw: string;
  validated?: string;
  enhanced?: string;
  category?: string;
  complexity?: 'simple' | 'medium' | 'complex';
}

export interface ProcessingResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  warnings: string[];
  metadata: {
    processingTime: number;
    steps: string[];
    confidence: number;
  };
}

/**
 * Idea Processing Engine
 */
export class IdeaProcessor {
  private validationRules: RulesEngine<IdeaInput>;

  constructor() {
    this.validationRules = new RulesEngine<IdeaInput>();
    this.setupDefaultRules();
  }

  private setupDefaultRules(): void {
    // Rule 1: Input must not be empty
    this.validationRules.addRule({
      name: 'non_empty_check',
      condition: (input) => !input.validated || input.validated.length === 0,
      action: (input) => { throw new Error('Input cannot be empty'); },
      errorMessage: 'Validation failed',
      priority: 1,
    });

    // Rule 2: Categorize by keywords
    this.validationRules.addRule({
      name: 'auto_categorize',
      condition: () => true,
      action: (input) => {
        const categories = [
          { name: 'saas', keywords: ['app', 'platform', 'software', 'tool', 'service'] },
          { name: 'ecommerce', keywords: ['shop', 'store', 'product', 'sell', 'marketplace'] },
          { name: 'content', keywords: ['blog', 'video', 'podcast', 'newsletter', 'course'] },
          { name: 'ai', keywords: ['ai', 'ml', 'automation', 'gpt', 'chatbot'] },
        ];

        const text = input.validated?.toLowerCase() || '';
        for (const cat of categories) {
          if (cat.keywords.some(kw => text.includes(kw))) {
            return { ...input, category: cat.name };
          }
        }
        return { ...input, category: 'general' };
      },
      priority: 2,
    });

    // Rule 3: Assess complexity
    this.validationRules.addRule({
      name: 'complexity_assessment',
      condition: () => true,
      action: (input) => {
        const length = input.validated?.length || 0;
        const words = input.validated?.split(' ').length || 0;
        
        let complexity: 'simple' | 'medium' | 'complex' = 'simple';
        if (words > 50 || length > 500) complexity = 'complex';
        else if (words > 20 || length > 200) complexity = 'medium';
        
        return { ...input, complexity };
      },
      priority: 3,
    });
  }

  /**
   * Process raw idea input
   */
  async process(rawInput: string): Promise<ProcessingResult<IdeaInput>> {
    const startTime = Date.now();
    const warnings: string[] = [];
    const steps: string[] = [];

    try {
      // Step 1: Validation
      steps.push('validation');
      const validation: ValidationResult = validateIdeaInput(rawInput);
      
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error,
          warnings,
          metadata: {
            processingTime: Date.now() - startTime,
            steps,
            confidence: 0,
          },
        };
      }

      // Step 2: Apply business rules
      steps.push('business_rules');
      let idea: IdeaInput = {
        raw: rawInput,
        validated: validation.sanitized,
      };

      const rulesResult = await this.validationRules.execute(idea);
      idea = rulesResult.result;

      if (rulesResult.failedRules.length > 0) {
        warnings.push(`Some rules failed: ${rulesResult.failedRules.map(r => r.name).join(', ')}`);
      }

      const processingTime = Date.now() - startTime;

      return {
        success: true,
        data: idea,
        warnings,
        metadata: {
          processingTime,
          steps,
          confidence: this.calculateConfidence(idea),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Processing failed',
        warnings,
        metadata: {
          processingTime: Date.now() - startTime,
          steps,
          confidence: 0,
        },
      };
    }
  }

  /**
   * Calculate confidence score based on input quality
   */
  private calculateConfidence(idea: IdeaInput): number {
    let score = 0.5; // Base score

    // Length bonus
    const length = idea.validated?.length || 0;
    if (length > 100) score += 0.2;
    if (length > 300) score += 0.1;

    // Category bonus
    if (idea.category && idea.category !== 'general') score += 0.1;

    // Complexity appropriate
    if (idea.complexity === 'medium') score += 0.1;

    return Math.min(score, 1.0);
  }
}

// ==========================================
// EVENT BUS - Decoupled Communication
// ==========================================

export type EventType = 
  | 'idea:submitted'
  | 'idea:validated'
  | 'generation:started'
  | 'generation:completed'
  | 'generation:failed'
  | 'refinement:requested'
  | 'feedback:submitted'
  | 'error:occurred'
  | 'cache:set'
  | 'cache:remove'
  | 'cache:clear'
  | 'data:initialized'
  | 'data:imported'
  | 'data:cleared'
  | 'plugin:registered'
  | 'plugin:unregistered'
  | 'module:enabled'
  | 'module:disabled'
  | 'services:initialized'
  | 'services:cleanup'
  | 'expansion:initialized'
  | 'ai:request'
  | 'ai:success'
  | 'ai:error';

export interface Event<T = unknown> {
  type: EventType;
  payload: T;
  timestamp: number;
  id: string;
}

/**
 * Event Bus for decoupled component communication
 */
export class EventBus {
  private listeners: Map<EventType, Set<(event: Event) => void>> = new Map();
  private history: Event[] = [];
  private maxHistorySize: number;

  constructor(maxHistorySize = 100) {
    this.maxHistorySize = maxHistorySize;
  }

  /**
   * Subscribe to an event type
   */
  on<T>(type: EventType, handler: (event: Event<T>) => void): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    
    this.listeners.get(type)!.add(handler as (event: Event) => void);
    
    return () => {
      this.listeners.get(type)?.delete(handler as (event: Event) => void);
    };
  }

  /**
   * Emit an event
   */
  emit<T>(type: EventType, payload: T): void {
    const event: Event<T> = {
      type,
      payload,
      timestamp: Date.now(),
      id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    // Store in history
    this.history.push(event as Event);
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }

    // Notify listeners
    const handlers = this.listeners.get(type);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(event as Event);
        } catch (error) {
          safeLogError(error, { operation: 'eventHandler', eventType: type });
        }
      });
    }
  }

  /**
   * Get event history
   */
  getHistory(type?: EventType): Event[] {
    if (type) {
      return this.history.filter(e => e.type === type);
    }
    return [...this.history];
  }

  /**
   * Clear history
   */
  clearHistory(): void {
    this.history = [];
  }
}

// Singleton instances
export const globalEventBus = new EventBus();
export const globalWorkflowEngine = new WorkflowEngine();
export const ideaProcessor = new IdeaProcessor();
