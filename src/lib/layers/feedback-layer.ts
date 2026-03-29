/**
 * Layer 7: Feedback & Refinement Layer
 * Analytics, error tracking, logging, A/B testing
 */

import { SupabaseClient } from '@supabase/supabase-js';

// Event types for analytics
export enum AnalyticsEventType {
  PAGE_VIEW = 'page_view',
  PLAN_GENERATED = 'plan_generated',
  PLAN_REFINED = 'plan_refined',
  PLAN_SAVED = 'plan_saved',
  PLAN_EXPORTED = 'plan_exported',
  USER_SIGNUP = 'user_signup',
  USER_LOGIN = 'user_login',
  SUBSCRIPTION_UPGRADE = 'subscription_upgrade',
  ERROR_OCCURRED = 'error_occurred',
  FEATURE_USED = 'feature_used',
  TIME_SPENT = 'time_spent',
}

// Analytics event structure
export interface AnalyticsEvent {
  id?: string;
  userId: string;
  type: AnalyticsEventType;
  metadata: Record<string, any>;
  timestamp: string;
  sessionId: string;
}

// Error severity levels
export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

// Error report structure
export interface ErrorReport {
  id?: string;
  userId?: string;
  severity: ErrorSeverity;
  message: string;
  stack?: string;
  context: {
    url: string;
    userAgent: string;
    timestamp: string;
    metadata?: Record<string, any>;
  };
}

// Feedback layer service
export class FeedbackLayer {
  private supabase: SupabaseClient;
  private sessionId: string;
  private eventQueue: AnalyticsEvent[] = [];
  private flushInterval: NodeJS.Timeout | null = null;
  
  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
    this.sessionId = this.generateSessionId();
    this.startFlushInterval();
  }
  
  // Session tracking
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // Track an analytics event
  async track(event: Omit<AnalyticsEvent, 'id' | 'sessionId'>): Promise<void> {
    const fullEvent: AnalyticsEvent = {
      ...event,
      sessionId: this.sessionId,
    };
    
    // Add to queue for batch processing
    this.eventQueue.push(fullEvent);
    
    // Flush if queue is getting large
    if (this.eventQueue.length >= 10) {
      await this.flushEvents();
    }
  }
  
  // Batch flush events to database
  private async flushEvents(): Promise<void> {
    if (this.eventQueue.length === 0) return;
    
    const events = [...this.eventQueue];
    this.eventQueue = [];
    
    try {
      const { error } = await this.supabase
        .from('analytics_events')
        .insert(events.map(e => ({
          user_id: e.userId,
          event_type: e.type,
          metadata: e.metadata,
          timestamp: e.timestamp,
          session_id: e.sessionId,
        })));
      
      if (error) {
        console.error('Failed to flush analytics events:', error);
        // Re-queue events for retry
        this.eventQueue.unshift(...events);
      }
    } catch (err) {
      console.error('Analytics flush error:', err);
      this.eventQueue.unshift(...events);
    }
  }
  
  private startFlushInterval(): void {
    this.flushInterval = setInterval(() => {
      this.flushEvents();
    }, 5000); // Flush every 5 seconds
  }
  
  // Stop flushing (call on app unmount)
  dispose(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    this.flushEvents();
  }
  
  // Error reporting
  async reportError(error: Error, severity: ErrorSeverity = ErrorSeverity.ERROR, metadata?: Record<string, any>): Promise<void> {
    const report: ErrorReport = {
      userId: metadata?.userId,
      severity,
      message: error.message,
      stack: error.stack,
      context: {
        url: typeof window !== 'undefined' ? window.location.href : '',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        timestamp: new Date().toISOString(),
        metadata,
      },
    };
    
    try {
      // Store in database
      await this.supabase.from('error_logs').insert({
        user_id: report.userId,
        severity: report.severity,
        message: report.message,
        stack: report.stack,
        context: report.context,
        created_at: report.context.timestamp,
      });
      
      // Also track as analytics event
      await this.track({
        userId: report.userId || 'anonymous',
        type: AnalyticsEventType.ERROR_OCCURRED,
        metadata: {
          error: report.message,
          severity: report.severity,
        },
        timestamp: report.context.timestamp,
      });
      
      // Critical errors - alert immediately
      if (severity === ErrorSeverity.CRITICAL) {
        await this.alertCriticalError(report);
      }
    } catch (err) {
      console.error('Failed to report error:', err);
    }
  }
  
  private async alertCriticalError(report: ErrorReport): Promise<void> {
    // In production, send to Slack, PagerDuty, etc.
    console.error('CRITICAL ERROR:', report);
  }
  
  // Get user analytics stats
  async getUserStats(userId: string, days: number = 30): Promise<{
    totalPlans: number;
    refinedPlans: number;
    timeSpent: number;
    lastActive: string;
  }> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data: events, error } = await this.supabase
      .from('analytics_events')
      .select('*')
      .eq('user_id', userId)
      .gte('timestamp', startDate.toISOString());
    
    if (error) throw error;
    
    const stats = {
      totalPlans: 0,
      refinedPlans: 0,
      timeSpent: 0,
      lastActive: '',
    };
    
    events?.forEach((event: any) => {
      switch (event.event_type) {
        case AnalyticsEventType.PLAN_GENERATED:
          stats.totalPlans++;
          break;
        case AnalyticsEventType.PLAN_REFINED:
          stats.refinedPlans++;
          break;
        case AnalyticsEventType.TIME_SPENT:
          stats.timeSpent += event.metadata?.duration || 0;
          break;
      }
      
      if (!stats.lastActive || event.timestamp > stats.lastActive) {
        stats.lastActive = event.timestamp;
      }
    });
    
    return stats;
  }
  
  // A/B Testing framework
  async getExperimentVariant(experimentId: string, userId: string): Promise<string> {
    // Deterministic assignment based on userId hash
    const hash = this.hashString(`${experimentId}:${userId}`);
    const variants = ['control', 'variant_a', 'variant_b'];
    return variants[hash % variants.length];
  }
  
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
  
  // Track experiment conversion
  async trackExperimentConversion(experimentId: string, variant: string, event: string): Promise<void> {
    await this.track({
      userId: 'system',
      type: AnalyticsEventType.FEATURE_USED,
      metadata: {
        experiment: experimentId,
        variant,
        conversion: event,
      },
      timestamp: new Date().toISOString(),
    });
  }
}

// React hook for analytics
export function useAnalytics() {
  return {
    trackPageView: (page: string) => {
      // Implementation in hook
    },
    trackEvent: (type: AnalyticsEventType, metadata?: Record<string, any>) => {
      // Implementation in hook
    },
    trackTiming: (action: string, duration: number) => {
      // Implementation in hook
    },
  };
}
