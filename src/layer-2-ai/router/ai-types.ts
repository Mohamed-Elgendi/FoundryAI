/**
 * AI Provider Types
 * Type definitions for AI routing and provider configuration
 */

export type AIProvider = 
  | 'claude'
  | 'groq'
  | 'openai'
  | 'google'
  | 'mistral'
  | 'together'
  | 'openrouter'
  | 'fallback';

export interface ProviderInfo {
  id: AIProvider;
  name: string;
  description: string;
  models: string[];
  requiresApiKey: boolean;
  apiKeyEnv: string;
  baseURL?: string;
  maxTokens: number;
  category: 'primary' | 'fallback' | 'specialist';
}

export interface AIRequest {
  prompt: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
  provider?: AIProvider;
  fallbackProviders?: AIProvider[];
}

export interface AIResponse {
  text: string;
  provider: AIProvider;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  cost?: number;
  latency: number;
}

export const PROVIDER_INFO: ProviderInfo[] = [
  {
    id: 'claude',
    name: 'Claude',
    description: 'Anthropic Claude - Primary recommendation',
    models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
    requiresApiKey: true,
    apiKeyEnv: 'ANTHROPIC_API_KEY',
    maxTokens: 4096,
    category: 'primary'
  },
  {
    id: 'groq',
    name: 'Groq',
    description: 'Fast inference with Llama models',
    models: ['llama-3.1-70b', 'llama-3.1-8b', 'mixtral-8x7b'],
    requiresApiKey: true,
    apiKeyEnv: 'GROQ_API_KEY',
    maxTokens: 8192,
    category: 'primary'
  },
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT-4 and GPT-3.5 models',
    models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    requiresApiKey: true,
    apiKeyEnv: 'OPENAI_API_KEY',
    maxTokens: 4096,
    category: 'primary'
  },
  {
    id: 'google',
    name: 'Google',
    description: 'Gemini models',
    models: ['gemini-pro', 'gemini-pro-vision'],
    requiresApiKey: true,
    apiKeyEnv: 'GOOGLE_API_KEY',
    maxTokens: 8192,
    category: 'specialist'
  },
  {
    id: 'mistral',
    name: 'Mistral',
    description: 'Mistral AI models',
    models: ['mistral-large', 'mistral-medium', 'mistral-small'],
    requiresApiKey: true,
    apiKeyEnv: 'MISTRAL_API_KEY',
    maxTokens: 8192,
    category: 'specialist'
  },
  {
    id: 'together',
    name: 'Together AI',
    description: 'Open source model hosting',
    models: ['llama-2-70b', 'codellama-34b'],
    requiresApiKey: true,
    apiKeyEnv: 'TOGETHER_API_KEY',
    maxTokens: 4096,
    category: 'specialist'
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    description: 'Universal API for multiple models',
    models: ['anthropic/claude-3-opus', 'openai/gpt-4', 'google/gemini-pro'],
    requiresApiKey: true,
    apiKeyEnv: 'OPENROUTER_API_KEY',
    baseURL: 'https://openrouter.ai/api/v1',
    maxTokens: 4096,
    category: 'fallback'
  },
  {
    id: 'fallback',
    name: 'Fallback',
    description: 'Last resort fallback',
    models: [],
    requiresApiKey: false,
    apiKeyEnv: '',
    maxTokens: 2048,
    category: 'fallback'
  }
];

export function getDefaultProvider(): AIProvider {
  return 'groq';
}

export function getProvidersByCategory(category: ProviderInfo['category']): ProviderInfo[] {
  return PROVIDER_INFO.filter(p => p.category === category);
}

export function getProviderInfo(provider: AIProvider): ProviderInfo | undefined {
  return PROVIDER_INFO.find(p => p.id === provider);
}
