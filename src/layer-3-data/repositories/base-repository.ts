import { SupabaseClient, PostgrestError } from '@supabase/supabase-js';
import { Database, Tables } from '../storage/database.types';
import { Repository, QueryOptions, RepositoryError } from './repository.types';

/**
 * Base Repository Implementation
 * Provides common CRUD operations with error handling
 */
export abstract class BaseRepository<T extends keyof Tables> implements Repository<T> {
  constructor(
    public table: T,
    public client: SupabaseClient<Database>
  ) {}

  protected handleError(error: PostgrestError | unknown, operation: string): never {
    const pgError = error as PostgrestError;
    
    if (pgError?.code === 'PGRST116') {
      throw new RepositoryError(
        `Record not found in ${this.table}`,
        'NOT_FOUND',
        error
      );
    }
    
    if (pgError?.code === '23505') {
      throw new RepositoryError(
        `Duplicate record in ${this.table}`,
        'CONFLICT',
        error
      );
    }
    
    if (pgError?.code?.startsWith('23')) {
      throw new RepositoryError(
        `Validation error in ${this.table}: ${pgError.message}`,
        'VALIDATION',
        error
      );
    }
    
    throw new RepositoryError(
      `Database error in ${this.table}: ${pgError?.message || 'Unknown error'}`,
      'DATABASE',
      error
    );
  }

  async findById(id: string): Promise<Tables[T]['Row'] | null> {
    const { data, error } = await this.client
      .from(this.table)
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      this.handleError(error, 'findById');
    }

    return data as Tables[T]['Row'] | null;
  }

  async findAll(options?: QueryOptions<T>): Promise<Tables[T]['Row'][]> {
    let query = this.client.from(this.table).select('*');

    if (options?.filter) {
      Object.entries(options.filter).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          query = query.eq(key, value);
        }
      });
    }

    if (options?.orderBy) {
      query = query.order(options.orderBy as string, { 
        ascending: options.orderDirection === 'asc' 
      });
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      this.handleError(error, 'findAll');
    }

    return (data || []) as Tables[T]['Row'][];
  }

  async findOne(options: QueryOptions<T>): Promise<Tables[T]['Row'] | null> {
    const results = await this.findAll({ ...options, limit: 1 });
    return results[0] || null;
  }

  async create(data: Tables[T]['Insert']): Promise<Tables[T]['Row']> {
    const { data: result, error } = await this.client
      .from(this.table)
      .insert(data as Record<string, unknown>)
      .select()
      .single();

    if (error) {
      this.handleError(error, 'create');
    }

    if (!result) {
      throw new RepositoryError(
        'Failed to create record: no data returned',
        'DATABASE'
      );
    }

    return result as Tables[T]['Row'];
  }

  async update(id: string, data: Tables[T]['Update']): Promise<Tables[T]['Row']> {
    const { data: result, error } = await this.client
      .from(this.table)
      .update(data as Record<string, unknown>)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      this.handleError(error, 'update');
    }

    if (!result) {
      throw new RepositoryError(
        'Failed to update record: no data returned',
        'DATABASE'
      );
    }

    return result as Tables[T]['Row'];
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client
      .from(this.table)
      .delete()
      .eq('id', id);

    if (error) {
      this.handleError(error, 'delete');
    }
  }

  async count(options?: QueryOptions<T>): Promise<number> {
    let query = this.client.from(this.table).select('*', { count: 'exact', head: true });

    if (options?.filter) {
      Object.entries(options.filter).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          query = query.eq(key, value);
        }
      });
    }

    const { count, error } = await query;

    if (error) {
      this.handleError(error, 'count');
    }

    return count || 0;
  }
}
