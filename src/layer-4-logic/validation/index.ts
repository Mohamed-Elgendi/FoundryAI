/**
 * Layer 4: Logic - Validation
 * Data validation utilities
 */

export interface ValidationRule<T> {
  field: keyof T;
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'date';
  min?: number;
  max?: number;
  pattern?: RegExp;
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validate<T>(
  data: T,
  rules: ValidationRule<T>[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const rule of rules) {
    const value = data[rule.field];

    if (rule.required && (value === undefined || value === null || value === '')) {
      errors.push(`${String(rule.field)} is required`);
      continue;
    }

    if (value !== undefined && value !== null) {
      if (rule.type === 'string' && typeof value !== 'string') {
        errors.push(`${String(rule.field)} must be a string`);
      }
      if (rule.type === 'number' && typeof value !== 'number') {
        errors.push(`${String(rule.field)} must be a number`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}
