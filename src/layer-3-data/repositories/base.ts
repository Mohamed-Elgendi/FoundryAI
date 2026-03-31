/**
 * Base Repository
 * Simplified base repository with type-safe operations
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { Repository, QueryOptions, RepositoryError } from './types';

export abstract class BaseRepository<T extends Record<string, any>> implements Repository<T> {
  constructor(
    protected tableName: string,
    protected client: SupabaseClient
  ) {}

  protected handleError(error: unknown, operation: string): never {
    const pgError = error as { code?: string; message?: string };
    
    if (pgError?.code === 'PGRST116') {
      throw new RepositoryError(
        `Record not found in ${this.tableName}`,
        'NOT_FOUND',
        error
      );
    }
    
    if (pgError?.code === '23505') {
      throw new RepositoryError(
        `Duplicate record in ${this.tableName}`,
        'CONFLICT',
        error
      );
    }
    
    throw new RepositoryError(
      `Database error in ${this.tableName}: ${pgError?.message || 'Unknown error'}`,
      'DATABASE',
      error
    );
  }

  async findById(id: string): Promise<T | null> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      this.handleError(error, 'findById');
    }

    return data as T | null;
  }

  async findAll(options?: QueryOptions<T>): Promise<T[]> {
    let query = this.client.from(this.tableName).select('*');

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

    return (data as T[]) || [];
  }

  async create(data: Omit<T, 'id' | 'created_at'>): Promise<T> {
    const { data: result, error } = await this.client
      .from(this.tableName)
      .insert({
        ...data,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      this.handleError(error, 'create');
    }

    return result as T;
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const { data: result, error } = await this.client
      .from(this.tableName)
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      this.handleError(error, 'update');
    }

    return result as T;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) {
      this.handleError(error, 'delete');
    }
  }
}
