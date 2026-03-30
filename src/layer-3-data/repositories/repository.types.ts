import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from './database.types';

export type Tables = Database['public']['Tables'];

/**
 * Generic Repository Interface
 * Implements the Repository Pattern for type-safe database operations
 */
export interface Repository<T extends keyof Tables> {
  table: T;
  client: SupabaseClient<Database>;
  
  // Read operations
  findById(id: string): Promise<Tables[T]['Row'] | null>;
  findAll(options?: QueryOptions<T>): Promise<Tables[T]['Row'][]>
  findOne(options: QueryOptions<T>): Promise<Tables[T]['Row'] | null>;
  
  // Write operations
  create(data: Tables[T]['Insert']): Promise<Tables[T]['Row']>;
  update(id: string, data: Tables[T]['Update']): Promise<Tables[T]['Row']>;
  delete(id: string): Promise<void>;
  
  // Count
  count(options?: QueryOptions<T>): Promise<number>;
}

/**
 * Query options for filtering, sorting, and pagination
 */
export interface QueryOptions<T extends keyof Tables> {
  filter?: Partial<Tables[T]['Row']>;
  orderBy?: keyof Tables[T]['Row'];
  orderDirection?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

/**
 * Repository error types
 */
export class RepositoryError extends Error {
  constructor(
    message: string,
    public code: 'NOT_FOUND' | 'CONFLICT' | 'VALIDATION' | 'DATABASE' | 'UNKNOWN',
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'RepositoryError';
  }
}
