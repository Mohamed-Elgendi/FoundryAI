import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

export function initMonitoring() {
  if (!SENTRY_DSN) {
    console.warn('[Sentry] DSN not configured, monitoring disabled');
    return;
  }

  // Sentry is automatically initialized by @sentry/nextjs
  // This function is kept for compatibility and future extension
  console.log('[Sentry] Monitoring initialized');
}

export function trackError(error: Error, context?: Record<string, unknown>) {
  if (!SENTRY_DSN) {
    console.error('[Error]', error, context);
    return;
  }
  
  Sentry.captureException(error, {
    extra: context,
    tags: {
      type: 'application_error',
    },
  });
}

export function trackEvent(event: string, properties?: Record<string, unknown>) {
  if (!SENTRY_DSN) {
    console.log('[Event]', event, properties);
    return;
  }
  
  Sentry.captureMessage(event, {
    level: 'info',
    extra: properties,
    tags: {
      type: 'analytics_event',
    },
  });
}

export function setUserContext(userId: string, email?: string, additionalContext?: Record<string, unknown>) {
  Sentry.setUser({
    id: userId,
    email,
    ...additionalContext,
  });
}

export function clearUserContext() {
  Sentry.setUser(null);
}

export { Sentry };
