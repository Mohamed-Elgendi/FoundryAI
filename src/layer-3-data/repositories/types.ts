/**
 * Repository Types
 * Type definitions for data layer repositories
 */

import { PostgrestError } from '@supabase/supabase-js';

export interface QueryOptions<T> {
  filter?: Partial<T>;
  orderBy?: keyof T;
  orderDirection?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export class RepositoryError extends Error {
  constructor(
    message: string,
    public code: 'NOT_FOUND' | 'CONFLICT' | 'VALIDATION' | 'DATABASE' | 'UNAUTHORIZED',
    public originalError?: PostgrestError | unknown
  ) {
    super(message);
    this.name = 'RepositoryError';
  }
}

export interface Repository<T> {
  findById(id: string): Promise<T | null>;
  findAll(options?: QueryOptions<T>): Promise<T[]>;
  create(data: Omit<T, 'id' | 'created_at'>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}
