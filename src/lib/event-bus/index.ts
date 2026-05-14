/**
 * Event Bus System
 * 
 * Typed, in-process event bus for cross-layer communication.
 * Supports synchronous and async event handling with lifecycle management.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type EventHandler<T = any> = (event: T) => void | Promise<void>;
export type EventType<T> = { new (): T } | ((...args: any[]) => T);

export interface EventBusEntry<T = any> {
  handler: EventHandler<T>;
  once: boolean;
  id: string;
}

// ─── Domain Events ───────────────────────────────────────────────────────────

export interface GuideCreated {
  type: "guide.created";
  guideId: string;
  userId: string;
  title: string;
  subject: string;
  timestamp: string;
}

export interface GuideUpdated {
  type: "guide.updated";
  guideId: string;
  userId: string;
  changes: Record<string, unknown>;
  timestamp: string;
}

export interface GuideDeleted {
  type: "guide.deleted";
  guideId: string;
  userId: string;
  timestamp: string;
}

export interface CurriculumGenerated {
  type: "curriculum.generated";
  guideId: string;
  curriculum: Array<{
    title: string;
    content: string;
    duration: string;
    type: string;
  }>;
  aiModel: string;
  timestamp: string;
}

export interface AssignmentSubmitted {
  type: "assignment.submitted";
  assignmentId: string;
  userId: string;
  guideId: string;
  score?: number;
  feedback?: string;
  timestamp: string;
}

export interface EnrollmentCreated {
  type: "enrollment.created";
  enrollmentId: string;
  userId: string;
  guideId: string;
  courseId?: string;
  timestamp: string;
}

export interface EnrollmentCompleted {
  type: "enrollment.completed";
  enrollmentId: string;
  userId: string;
  guideId: string;
  completionDate: string;
  finalScore?: number;
  timestamp: string;
}

export interface LessonCompleted {
  type: "lesson.completed";
  lessonId: string;
  userId: string;
  guideId: string;
  timeSpent: number;
  timestamp: string;
}

export interface PaymentProcessed {
  type: "payment.processed";
  paymentId: string;
  userId: string;
  amount: number;
  currency: string;
  planId: string;
  timestamp: string;
}

export interface UserRegistered {
  type: "user.registered";
  userId: string;
  email: string;
  role: "student" | "teacher";
  timestamp: string;
}

export type DomainEvent =
  | GuideCreated
  | GuideUpdated
  | GuideDeleted
  | CurriculumGenerated
  | AssignmentSubmitted
  | EnrollmentCreated
  | EnrollmentCompleted
  | LessonCompleted
  | PaymentProcessed
  | UserRegistered;

export type DomainEventType = DomainEvent["type"];

// ─── Event Bus ───────────────────────────────────────────────────────────────

let instance: EventBus | null = null;

export class EventBus {
  private listeners = new Map<string, Set<EventBusEntry<any>>>();
  private eventLog: Array<{ type: string; timestamp: string; meta?: Record<string, unknown> }> = [];
  private maxLogSize = 1000;
  private paused = false;
  private queuedEvents: Array<{ type: string; payload: any }> = [];

  /** Get singleton instance */
  static getInstance(): EventBus {
    if (!instance) {
      instance = new EventBus();
    }
    return instance;
  }

  /** Reset singleton (for testing) */
  static reset(): void {
    instance = null;
  }

  /**
   * Subscribe to an event type. Returns an unsubscribe function.
   */
  on<T = DomainEvent>(eventType: string, handler: EventHandler<T>): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    const entry: EventBusEntry<T> = {
      handler,
      once: false,
      id: `${eventType}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    };
    this.listeners.get(eventType)!.add(entry);
    return () => this.off(eventType, entry.id);
  }

  /**
   * Subscribe to an event type once. Handler auto-removes after first invocation.
   */
  once<T = DomainEvent>(eventType: string, handler: EventHandler<T>): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    const entry: EventBusEntry<T> = {
      handler,
      once: true,
      id: `${eventType}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    };
    this.listeners.get(eventType)!.add(entry);
    return () => this.off(eventType, entry.id);
  }

  /**
   * Unsubscribe a handler by its ID
   */
  off(eventType: string, handlerId: string): void {
    const entries = this.listeners.get(eventType);
    if (entries) {
      for (const entry of entries) {
        if (entry.id === handlerId) {
          entries.delete(entry);
          break;
        }
      }
    }
  }

  /**
   * Emit an event to all subscribers
   */
  async emit<T = DomainEvent>(eventType: string, payload: T): Promise<void> {
    this.logEvent(eventType, payload);

    if (this.paused) {
      this.queuedEvents.push({ type: eventType, payload });
      return;
    }

    const entries = this.listeners.get(eventType);
    if (!entries || entries.size === 0) return;

    const handlersToRun: Array<EventBusEntry<T>> = [];
    const handlersToRemove: string[] = [];

    for (const entry of entries) {
      handlersToRun.push(entry);
      if (entry.once) {
        handlersToRemove.push(entry.id);
      }
    }

    // Remove one-time handlers
    for (const id of handlersToRemove) {
      this.off(eventType, id);
    }

    // Execute all handlers
    const promises = handlersToRun.map(async (entry) => {
      try {
        await entry.handler(payload);
      } catch (error) {
        console.error(`[EventBus] Handler error for "${eventType}":`, error);
      }
    });

    await Promise.all(promises);
  }

  /**
   * Remove all listeners for an event type (or all types if none specified)
   */
  clear(eventType?: string): void {
    if (eventType) {
      this.listeners.delete(eventType);
    } else {
      this.listeners.clear();
    }
  }

  /**
   * Get event log
   */
  getLog(): Array<{ type: string; timestamp: string; meta?: Record<string, unknown> }> {
    return [...this.eventLog];
  }

  /**
   * Get listener count for an event type
   */
  listenerCount(eventType: string): number {
    return this.listeners.get(eventType)?.size ?? 0;
  }

  /**
   * Pause event processing (events are queued)
   */
  pause(): void {
    this.paused = true;
  }

  /**
   * Resume event processing (flushes queued events)
   */
  async resume(): Promise<void> {
    this.paused = false;
    const queue = [...this.queuedEvents];
    this.queuedEvents = [];
    for (const { type, payload } of queue) {
      await this.emit(type, payload);
    }
  }

  private logEvent(type: string, payload: any): void {
    this.eventLog.push({
      type,
      timestamp: new Date().toISOString(),
      meta: { eventId: `${type}_${Date.now()}` },
    });
    if (this.eventLog.length > this.maxLogSize) {
      this.eventLog = this.eventLog.slice(-this.maxLogSize);
    }
  }
}

// ─── Convenience Functions ───────────────────────────────────────────────────

/** Get the global event bus instance */
export function getEventBus(): EventBus {
  return EventBus.getInstance();
}

/** Subscribe to an event */
export function on<T = DomainEvent>(eventType: string, handler: EventHandler<T>): () => void {
  return EventBus.getInstance().on<T>(eventType, handler);
}

/** Subscribe to an event once */
export function once<T = DomainEvent>(eventType: string, handler: EventHandler<T>): () => void {
  return EventBus.getInstance().once<T>(eventType, handler);
}

/** Unsubscribe from an event */
export function off(eventType: string, handlerId: string): void {
  EventBus.getInstance().off(eventType, handlerId);
}

/** Emit an event */
export function emit<T = DomainEvent>(eventType: string, payload: T): Promise<void> {
  return EventBus.getInstance().emit<T>(eventType, payload);
}

/** Clear all event listeners */
export function clearEventBus(eventType?: string): void {
  EventBus.getInstance().clear(eventType);
}
