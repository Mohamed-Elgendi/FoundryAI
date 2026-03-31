import * as Sentry from '@sentry/nextjs';
import { initMonitoring } from '@/lib/monitoring';

export async function register() {
  // Initialize monitoring
  initMonitoring();
}

export const onRequestError = Sentry.captureRequestError;
