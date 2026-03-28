/**
 * Crash-proof Logger Utility
 * Safely logs errors without crashing the application
 */

interface LogContext {
  [key: string]: unknown;
}

interface ErrorReport {
  timestamp: string;
  message: string;
  stack?: string;
  context?: LogContext;
  url?: string;
  userAgent?: string;
}

// In-memory error queue for batching
const errorQueue: ErrorReport[] = [];
const MAX_QUEUE_SIZE = 100;

/**
 * Safely log an error without throwing
 */
export function safeLogError(error: unknown, context?: LogContext): void {
  try {
    const errorReport = createErrorReport(error, context);
    
    // Add to queue
    errorQueue.push(errorReport);
    
    // Trim queue if too large
    if (errorQueue.length > MAX_QUEUE_SIZE) {
      errorQueue.shift();
    }
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[SafeLogger]', errorReport);
    }
    
    // Send to any external logging service
    flushErrorQueue();
  } catch (loggingError) {
    // Last resort - can't even log the error
    console.error('Failed to log error:', loggingError);
  }
}

/**
 * Create a structured error report
 */
function createErrorReport(error: unknown, context?: LogContext): ErrorReport {
  let message = 'Unknown error';
  let stack: string | undefined;
  
  if (error instanceof Error) {
    message = error.message;
    stack = error.stack;
  } else if (typeof error === 'string') {
    message = error;
  } else if (error !== null && typeof error === 'object') {
    message = JSON.stringify(error);
  }
  
  return {
    timestamp: new Date().toISOString(),
    message,
    stack,
    context,
    url: typeof window !== 'undefined' ? window.location.href : undefined,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
  };
}

/**
 * Flush error queue to external service
 */
function flushErrorQueue(): void {
  if (errorQueue.length === 0) return;
  
  // In production, you would send to Sentry, LogRocket, etc.
  // For now, just keep in memory
  if (process.env.NODE_ENV === 'development' && errorQueue.length > 0) {
    console.warn(`[SafeLogger] ${errorQueue.length} errors in queue`);
  }
}

/**
 * Safely execute a function and log any errors
 */
export function safeExecute<T>(
  fn: () => T,
  fallback: T,
  context?: LogContext
): T {
  try {
    return fn();
  } catch (error) {
    safeLogError(error, { ...context, operation: 'safeExecute' });
    return fallback;
  }
}

/**
 * Safely execute an async function and log any errors
 */
export async function safeExecuteAsync<T>(
  fn: () => Promise<T>,
  fallback: T,
  context?: LogContext
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    safeLogError(error, { ...context, operation: 'safeExecuteAsync' });
    return fallback;
  }
}

/**
 * Safely parse JSON without throwing
 */
export function safeJsonParse<T>(json: string, fallback: T | null = null): T | null {
  try {
    return JSON.parse(json) as T;
  } catch (error) {
    safeLogError(error, { operation: 'safeJsonParse', json: json.substring(0, 100) });
    return fallback;
  }
}

/**
 * Safely stringify JSON without throwing
 */
export function safeJsonStringify(obj: unknown, fallback = '{}'): string {
  try {
    return JSON.stringify(obj);
  } catch (error) {
    safeLogError(error, { operation: 'safeJsonStringify' });
    return fallback;
  }
}

/**
 * Safely access localStorage
 */
export function safeLocalStorageGet(key: string, fallback: string | null = null): string | null {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    safeLogError(error, { operation: 'safeLocalStorageGet', key });
    return fallback;
  }
}

/**
 * Safely set localStorage
 */
export function safeLocalStorageSet(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    safeLogError(error, { operation: 'safeLocalStorageSet', key });
    return false;
  }
}

/**
 * Safely remove from localStorage
 */
export function safeLocalStorageRemove(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    safeLogError(error, { operation: 'safeLocalStorageRemove', key });
    return false;
  }
}

/**
 * Get all errors in queue (for debugging)
 */
export function getErrorQueue(): ErrorReport[] {
  return [...errorQueue];
}

/**
 * Clear error queue
 */
export function clearErrorQueue(): void {
  errorQueue.length = 0;
}
