import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Add optional integrations for additional features
  integrations: [
    Sentry.replayIntegration({
      // Replay settings
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  
  // Define sampling rates
  tracesSampleRate: 1.0,
  
  // Replay settings
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  // Setting this option to true will print useful information to the console
  debug: false,
});
