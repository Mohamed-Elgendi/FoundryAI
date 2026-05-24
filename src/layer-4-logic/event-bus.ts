// ============================================
// FoundryAI - Event Bus
// Layer 4: Logic Layer
// Centralized event-driven communication
// ============================================

type EventPriority = "low" | "normal" | "high" | "critical";

export interface FoundryEvent<T = any> {
  id: string;
  type: string;
  data: T;
  userId?: string;
  timestamp: Date;
  priority: EventPriority;
  metadata?: Record<string, any>;
}

type EventHandler<T = any> = (event: FoundryEvent<T>) => void | Promise<void>;
type ListenerId = string;

export class EventBus {
  private handlers: Map<string, Map<ListenerId, EventHandler>> = new Map();
  private middleware: Array<(event: FoundryEvent) => void | Promise<void>> = [];
  private static instance: EventBus;

  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  use(fn: (event: FoundryEvent) => void | Promise<void>): void {
    this.middleware.push(fn);
  }

  on<T = any>(eventType: string, handler: EventHandler<T>): ListenerId {
    const listenerId = `listener_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Map());
    }
    this.handlers.get(eventType)!.set(listenerId, handler as EventHandler);
    return listenerId;
  }

  once<T = any>(eventType: string, handler: EventHandler<T>): ListenerId {
    const listenerId = this.on(eventType, async (event) => {
      await handler(event);
      this.off(eventType, listenerId);
    });
    return listenerId;
  }

  off(eventType: string, listenerId: ListenerId): void {
    this.handlers.get(eventType)?.delete(listenerId);
  }

  clear(eventType?: string): void {
    if (eventType) this.handlers.delete(eventType);
    else this.handlers.clear();
  }

  async emit<T = any>(
    eventType: string,
    data: T,
    options: { userId?: string; priority?: EventPriority; metadata?: Record<string, any> } = {}
  ): Promise<void> {
    const event: FoundryEvent<T> = {
      id: `evt_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      type: eventType,
      data,
      userId: options.userId,
      timestamp: new Date(),
      priority: options.priority || "normal",
      metadata: options.metadata,
    };

    for (const mw of this.middleware) await mw(event);

    const handlers = this.handlers.get(eventType);
    if (handlers) {
      const promises = Array.from(handlers.values()).map((h) =>
        Promise.resolve(h(event)).catch((err: Error) => console.error(`Handler error for ${eventType}:`, err))
      );
      await Promise.allSettled(promises);
    }
  }

  getActiveEvents(): string[] {
    return Array.from(this.handlers.keys());
  }
}

export const eventBus = EventBus.getInstance();

// Event Type Constants
export const EVENT_TYPES = {
  USER_SIGNED_UP: "user.signed_up",
  USER_LOGGED_IN: "user.logged_in",
  USER_LOGGED_OUT: "user.logged_out",
  USER_PROFILE_UPDATED: "user.profile_updated",

  DAILY_CHECKIN_COMPLETED: "foundation.checkin_completed",
  MOOD_LOGGED: "foundation.mood_logged",
  BRAIN_DUMP_CREATED: "foundation.brain_dump_created",
  BELIEF_CREATED: "foundation.belief_created",
  CONFIDENCE_EVIDENCE_ADDED: "foundation.confidence_added",
  AFFIRMATION_PRACTICED: "foundation.affirmation_practiced",
  FOCUS_SESSION_COMPLETED: "foundation.focus_completed",
  EMOTIONAL_ENTRY_CREATED: "foundation.emotion_logged",
  MOMENTUM_UPDATED: "foundation.momentum_updated",

  IDEA_EXTRACTED: "opportunity.idea_extracted",
  IDEA_VALIDATED: "opportunity.idea_validated",
  ARCHETYPE_MATCHED: "opportunity.archetype_matched",
  OPPORTUNITY_SCANNED: "opportunity.scanned",

  PROJECT_CREATED: "launch.project_created",
  PROJECT_MILESTONE_COMPLETED: "launch.milestone_completed",
  PROJECT_LAUNCHED: "launch.project_launched",

  REVENUE_RECORDED: "discovery.revenue_recorded",
  CHARACTER_LEVEL_UP: "discovery.level_up",
  SKILL_UPDATED: "discovery.skill_updated",
  PRODUCTIVITY_LOGGED: "discovery.productivity_logged",

  LEARNING_PATH_STARTED: "education.path_started",
  MODULE_COMPLETED: "education.module_completed",
  REPETITION_DONE: "education.repetition_done",

  POINTS_EARNED: "gamification.points_earned",
  ACHIEVEMENT_UNLOCKED: "gamification.achievement_unlocked",
  STREAK_UPDATED: "gamification.streak_updated",

  CREDIT_PURCHASED: "monetization.credits_purchased",
  SUBSCRIPTION_UPGRADED: "monetization.subscription_upgraded",
  AFFILIATE_LINK_CLICKED: "monetization.affiliate_click",

  AI_REQUEST_SENT: "ai.request_sent",
  AI_RESPONSE_RECEIVED: "ai.response_received",
  AI_ERROR_OCCURRED: "ai.error_occurred",
} as const;
