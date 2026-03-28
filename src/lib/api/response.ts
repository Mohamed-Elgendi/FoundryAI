/**
 * API Response Utilities
 * Standardized response handlers for API routes
 */

import { NextResponse } from 'next/server';

export interface ApiError {
  message: string;
  code?: string;
  details?: string;
  suggestedAction?: string;
}

export interface ApiSuccess<T> {
  data: T;
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

/**
 * Create standardized success response
 */
export function successResponse<T>(data: T, status: number = 200): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
      },
    },
    { status }
  );
}

/**
 * Create standardized error response
 */
export function errorResponse(
  message: string,
  status: number = 500,
  options?: {
    code?: string;
    details?: string;
    suggestedAction?: string;
  }
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        code: options?.code,
        details: options?.details,
        suggestedAction: options?.suggestedAction,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    },
    { status }
  );
}

/**
 * Common error response helpers
 */
export const errors = {
  badRequest: (message: string, details?: string) =>
    errorResponse(message, 400, { code: 'BAD_REQUEST', details }),
  
  unauthorized: (message: string = 'Unauthorized') =>
    errorResponse(message, 401, { code: 'UNAUTHORIZED' }),
  
  rateLimit: (message: string, retryAfter?: number) =>
    errorResponse(message, 429, {
      code: 'RATE_LIMIT',
      suggestedAction: retryAfter
        ? `Wait ${retryAfter} seconds before retrying`
        : 'Please try again later',
    }),
  
  notFound: (resource: string) =>
    errorResponse(`${resource} not found`, 404, { code: 'NOT_FOUND' }),
  
  aiError: (message: string, suggestedAction?: string, extra?: { rateLimitError?: boolean; quotaExceeded?: boolean }) =>
    errorResponse(message, 502, {
      code: 'AI_SERVICE_ERROR',
      suggestedAction: suggestedAction || 'Please try again or use a different AI provider',
      ...extra,
    }),
  
  internal: (message: string = 'Internal server error', details?: string) =>
    errorResponse(message, 500, { code: 'INTERNAL_ERROR', details }),
};

/**
 * Wrap async handler with error catching
 */
export function withErrorHandler<T>(
  handler: (req: Request) => Promise<NextResponse<T>>
): (req: Request) => Promise<NextResponse<T | { error: ApiError }>> {
  return async (req: Request): Promise<NextResponse<T | { error: ApiError }>> => {
    try {
      return await handler(req);
    } catch (error: any) {
      console.error('[API Error]', error);
      return errors.internal(error?.message || 'Unknown error') as NextResponse<{ error: ApiError }>;
    }
  };
}

/**
 * Validate request body
 */
export function validateBody<T>(
  body: unknown,
  validator: (data: unknown) => data is T
): { valid: true; data: T } | { valid: false; error: NextResponse } {
  if (!validator(body)) {
    return {
      valid: false,
      error: errors.badRequest('Invalid request body'),
    };
  }
  return { valid: true, data: body as T };
}
