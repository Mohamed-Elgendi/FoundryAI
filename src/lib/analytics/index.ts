import { trackEvent as trackSentryEvent } from '@/lib/monitoring';

// Analytics configuration
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';

// Initialize PostHog (lazy loaded)
let posthogInstance: any = null;

async function getPostHog() {
  if (typeof window === 'undefined') return null;
  if (posthogInstance) return posthogInstance;
  
  if (!POSTHOG_KEY) {
    console.warn('[Analytics] PostHog key not configured');
    return null;
  }
  
  try {
    const posthog = await import('posthog-js');
    posthogInstance = posthog.default || posthog;
    posthogInstance.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      loaded: (posthog: any) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('[Analytics] PostHog loaded');
        }
      },
    });
    return posthogInstance;
  } catch (error) {
    console.error('[Analytics] Failed to load PostHog:', error);
    return null;
  }
}

// Analytics tracking functions
export async function track(event: string, properties?: Record<string, unknown>) {
  // Track in PostHog
  const posthog = await getPostHog();
  if (posthog) {
    posthog.capture(event, properties);
  }
  
  // Also track in Sentry for error monitoring correlation
  trackSentryEvent(event, properties);
  
  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', event, properties);
  }
}

export async function identify(userId: string, traits?: Record<string, unknown>) {
  const posthog = await getPostHog();
  if (posthog) {
    posthog.identify(userId, traits);
  }
  
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] Identify:', userId, traits);
  }
}

export async function reset() {
  const posthog = await getPostHog();
  if (posthog) {
    posthog.reset();
  }
}

export async function pageView(url: string, properties?: Record<string, unknown>) {
  const posthog = await getPostHog();
  if (posthog) {
    posthog.capture('$pageview', {
      $current_url: url,
      ...properties,
    });
  }
}

// Business-specific tracking functions
export function trackPlanGenerated(provider: string, duration: number) {
  track('plan_generated', {
    provider,
    duration_ms: duration,
  });
}

export function trackPlanRefined(originalProvider: string, feedback: string) {
  track('plan_refined', {
    original_provider: originalProvider,
    feedback_length: feedback.length,
  });
}

export function trackFeedbackSubmitted(rating: number, category: string) {
  track('feedback_submitted', {
    rating,
    category,
  });
}

export function trackProviderSwitched(from: string, to: string) {
  track('provider_switched', {
    from_provider: from,
    to_provider: to,
  });
}

export function trackErrorOccurred(errorType: string, context?: Record<string, unknown>) {
  track('error_occurred', {
    error_type: errorType,
    ...context,
  });
}

export function trackUserEngagement(action: string, metadata?: Record<string, unknown>) {
  track('user_engagement', {
    action,
    ...metadata,
  });
}
