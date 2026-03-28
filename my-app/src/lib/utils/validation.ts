/**
 * Input Validation Utilities
 * Validates all user inputs to prevent crashes from malformed data
 */

import { safeLogError } from './logger';

export interface ValidationResult {
  valid: boolean;
  error?: string;
  sanitized?: string;
}

/**
 * Validate and sanitize user input for idea generation
 */
export function validateIdeaInput(input: unknown): ValidationResult {
  // Check if input exists
  if (input === null || input === undefined) {
    return { valid: false, error: 'Input is required' };
  }

  // Convert to string
  let str = String(input).trim();

  // Check length
  if (str.length === 0) {
    return { valid: false, error: 'Please describe your idea' };
  }

  if (str.length < 10) {
    return { valid: false, error: 'Please provide more details (at least 10 characters)' };
  }

  if (str.length > 2000) {
    return { valid: false, error: 'Input is too long (max 2000 characters)' };
  }

  // Sanitize - remove potentially dangerous characters
  str = str
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ''); // Remove control characters

  // Check for common injection patterns
  const dangerousPatterns = [
    /javascript:/gi,
    /data:text\/html/gi,
    /<script/gi,
    /on\w+\s*=/gi, // onclick, onerror, etc.
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(str)) {
      return { valid: false, error: 'Input contains invalid characters' };
    }
  }

  return { valid: true, sanitized: str };
}

/**
 * Validate refinement input
 */
export function validateRefinementInput(input: unknown): ValidationResult {
  if (input === null || input === undefined) {
    return { valid: false, error: 'Refinement input is required' };
  }

  let str = String(input).trim();

  if (str.length === 0) {
    return { valid: false, error: 'Please provide refinement instructions' };
  }

  if (str.length < 5) {
    return { valid: false, error: 'Please provide more details' };
  }

  if (str.length > 1000) {
    return { valid: false, error: 'Refinement input is too long (max 1000 characters)' };
  }

  // Sanitize
  str = str.replace(/[<>\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  return { valid: true, sanitized: str };
}

/**
 * Validate email address
 */
export function validateEmail(email: unknown): ValidationResult {
  if (email === null || email === undefined) {
    return { valid: false, error: 'Email is required' };
  }

  const str = String(email).trim();

  if (str.length === 0) {
    return { valid: false, error: 'Email is required' };
  }

  // RFC 5322 compliant regex (simplified)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(str)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }

  // Check length
  if (str.length > 254) {
    return { valid: false, error: 'Email address is too long' };
  }

  return { valid: true, sanitized: str.toLowerCase() };
}

/**
 * Validate feedback data
 */
export function validateFeedbackData(data: unknown): { valid: boolean; error?: string } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid feedback data' };
  }

  const d = data as Record<string, unknown>;

  // Check required fields
  if (typeof d.userInput !== 'string') {
    return { valid: false, error: 'Missing userInput' };
  }

  if (!d.output || typeof d.output !== 'object') {
    return { valid: false, error: 'Missing output' };
  }

  if (typeof d.isHelpful !== 'boolean') {
    return { valid: false, error: 'Missing isHelpful' };
  }

  // Validate input length
  if (d.userInput.length > 5000) {
    return { valid: false, error: 'userInput too long' };
  }

  return { valid: true };
}

/**
 * Sanitize string for display
 */
export function sanitizeForDisplay(input: string): string {
  if (!input) return '';
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

/**
 * Validate JSON structure
 */
export function validateJsonStructure<T>(
  json: string,
  validator: (data: unknown) => data is T
): { valid: boolean; data?: T; error?: string } {
  try {
    const parsed = JSON.parse(json);
    
    if (validator(parsed)) {
      return { valid: true, data: parsed };
    }
    
    return { valid: false, error: 'JSON structure validation failed' };
  } catch (error) {
    safeLogError(error, { operation: 'validateJsonStructure' });
    return { valid: false, error: 'Invalid JSON format' };
  }
}

/**
 * Type guard for VibeBuilderOutput
 */
export function isValidVibeBuilderOutput(data: unknown): boolean {
  if (!data || typeof data !== 'object') return false;
  
  const d = data as Record<string, unknown>;
  
  const requiredFields = [
    'toolIdea',
    'targetUser', 
    'problemStatement',
    'marketResearch',
    'mvpFeatures',
    'techStack',
    'buildPlan',
    'monetizationStrategy'
  ];
  
  for (const field of requiredFields) {
    if (!(field in d)) {
      console.warn(`Missing required field: ${field}`);
      return false;
    }
  }
  
  return true;
}

/**
 * Validate API request body
 */
export function validateApiBody<T>(
  body: unknown,
  requiredFields: (keyof T)[],
  maxSizeBytes: number = 1024 * 1024 // 1MB default
): { valid: boolean; error?: string; data?: T } {
  if (!body) {
    return { valid: false, error: 'Request body is required' };
  }

  // Check size if string
  if (typeof body === 'string') {
    const size = new Blob([body]).size;
    if (size > maxSizeBytes) {
      return { valid: false, error: `Request body too large (max ${maxSizeBytes} bytes)` };
    }
  }

  const obj = typeof body === 'string' ? JSON.parse(body) : body;

  if (typeof obj !== 'object' || obj === null) {
    return { valid: false, error: 'Invalid request body format' };
  }

  for (const field of requiredFields) {
    if (!(field in obj)) {
      return { valid: false, error: `Missing required field: ${String(field)}` };
    }
  }

  return { valid: true, data: obj as T };
}

/**
 * Safe string truncation
 */
export function safeTruncate(str: string, maxLength: number, suffix = '...'): string {
  if (!str || str.length <= maxLength) return str;
  return str.substring(0, maxLength - suffix.length) + suffix;
}
