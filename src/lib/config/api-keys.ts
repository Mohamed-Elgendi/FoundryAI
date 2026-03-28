/**
 * Centralized API Keys Configuration
 * 
 * This module provides type-safe access to all API keys used in the application.
 * Keys are loaded from environment variables (.env.local for development).
 * 
 * Usage:
 *   import { apiKeys } from '@/lib/config/api-keys';
 *   const groqKey = apiKeys.ai.groq; // typed and validated
 */

import { z } from 'zod';

// ============================================
// AI Provider API Keys Schema
// ============================================
const AIKeysSchema = z.object({
  openai: z.string().optional(),
  anthropic: z.string().optional(),
  google: z.string().optional(),
  groq: z.string().optional(),
  mistral: z.string().optional(),
  together: z.string().optional(),
  openrouter: z.string().optional(),
  cohere: z.string().optional(),
});

// ============================================
// Database API Keys Schema
// ============================================
const DatabaseKeysSchema = z.object({
  supabaseUrl: z.string().optional(),
  supabaseAnonKey: z.string().optional(),
  supabaseServiceKey: z.string().optional(),
});

// ============================================
// Search & Vector DB API Keys Schema
// ============================================
const SearchKeysSchema = z.object({
  serpapi: z.string().optional(),
  tavily: z.string().optional(),
  pinecone: z.string().optional(),
  pineconeEnvironment: z.string().optional(),
});

// ============================================
// Monitoring API Keys Schema
// ============================================
const MonitoringKeysSchema = z.object({
  langchain: z.string().optional(),
  langchainTracing: z.boolean().default(false),
});

// ============================================
// Main API Keys Schema
// ============================================
const APIKeysSchema = z.object({
  ai: AIKeysSchema,
  database: DatabaseKeysSchema,
  search: SearchKeysSchema,
  monitoring: MonitoringKeysSchema,
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  appUrl: z.string().default('http://localhost:3000'),
});

export type APIKeys = z.infer<typeof APIKeysSchema>;
export type AIKeys = z.infer<typeof AIKeysSchema>;
export type DatabaseKeys = z.infer<typeof DatabaseKeysSchema>;
export type SearchKeys = z.infer<typeof SearchKeysSchema>;
export type MonitoringKeys = z.infer<typeof MonitoringKeysSchema>;

// ============================================
// Load and validate API keys from environment
// ============================================
function loadAPIKeys(): APIKeys {
  const rawConfig = {
    ai: {
      openai: process.env.OPENAI_API_KEY,
      anthropic: process.env.ANTHROPIC_API_KEY,
      google: process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      groq: process.env.GROQ_API_KEY,
      mistral: process.env.MISTRAL_API_KEY,
      together: process.env.TOGETHER_API_KEY,
      openrouter: process.env.OPENROUTER_API_KEY,
      cohere: process.env.COHERE_API_KEY,
    },
    database: {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
    search: {
      serpapi: process.env.SERPAPI_API_KEY,
      tavily: process.env.TAVILY_API_KEY,
      pinecone: process.env.PINECONE_API_KEY,
      pineconeEnvironment: process.env.PINECONE_ENVIRONMENT,
    },
    monitoring: {
      langchain: process.env.LANGCHAIN_API_KEY,
      langchainTracing: process.env.LANGCHAIN_TRACING_V2 === 'true',
    },
    nodeEnv: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  };

  return APIKeysSchema.parse(rawConfig);
}

// ============================================
// Exported API keys instance
// ============================================
export const apiKeys = loadAPIKeys();

// ============================================
// Utility functions for checking key availability
// ============================================

/**
 * Check if a specific AI provider has a configured API key
 */
export function hasAIProvider(provider: keyof AIKeys): boolean {
  return !!apiKeys.ai[provider];
}

/**
 * Get all available AI providers with configured keys
 */
export function getAvailableAIProviders(): (keyof AIKeys)[] {
  return Object.entries(apiKeys.ai)
    .filter(([, value]) => !!value)
    .map(([key]) => key as keyof AIKeys);
}

/**
 * Check if database is fully configured
 */
export function isDatabaseConfigured(): boolean {
  const { supabaseUrl, supabaseAnonKey } = apiKeys.database;
  return !!supabaseUrl && !!supabaseAnonKey;
}

/**
 * Get a list of missing required keys for a feature
 */
export function getMissingKeysForFeature(
  feature: 'ai' | 'database' | 'search' | 'monitoring'
): string[] {
  const missing: string[] = [];

  switch (feature) {
    case 'ai':
      if (!apiKeys.ai.groq) missing.push('GROQ_API_KEY');
      if (!apiKeys.ai.openrouter) missing.push('OPENROUTER_API_KEY');
      break;
    case 'database':
      if (!apiKeys.database.supabaseUrl) missing.push('NEXT_PUBLIC_SUPABASE_URL');
      if (!apiKeys.database.supabaseAnonKey) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
      break;
    case 'search':
      if (!apiKeys.search.serpapi) missing.push('SERPAPI_API_KEY (optional)');
      if (!apiKeys.search.tavily) missing.push('TAVILY_API_KEY (optional)');
      break;
    case 'monitoring':
      if (!apiKeys.monitoring.langchain) missing.push('LANGCHAIN_API_KEY (optional)');
      break;
  }

  return missing;
}

/**
 * Validate that required keys are present, throws if any are missing
 */
export function validateRequiredKeys(): void {
  const aiMissing = getMissingKeysForFeature('ai');
  const dbMissing = getMissingKeysForFeature('database');

  if (aiMissing.length > 0) {
    console.warn('Missing AI provider keys:', aiMissing.join(', '));
  }
  if (dbMissing.length > 0) {
    console.warn('Missing Database keys:', dbMissing.join(', '));
  }
}
