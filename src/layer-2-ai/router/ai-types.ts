/**
 * AI Provider Types
 * Type definitions for AI routing and provider configuration
 */

export type AIProvider = 
  | 'claude-3-5-sonnet'
  | 'claude-3-5-haiku'
  | 'claude-3-opus'
  | 'gpt-4o'
  | 'gpt-4o-mini'
  | 'groq-llama-3-3'
  | 'groq-mixtral'
  | 'gemini-2-flash'
  | 'gemini-1-5-pro'
  | 'mistral-small'
  | 'mistral-medium'
  | 'deepseek-chat'
  | 'deepseek-coder'
  | 'perplexity-sonar'
  | 'together-llama'
  | 'cohere-command'
  | 'openrouter-claude'
  | 'openrouter-gpt'
  | 'openrouter-llama'
  | 'fireworks-llama'
  | 'replicate-llama'
  | 'azure-openai'
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
  color?: string;
}

export interface AIRequest {
  prompt: string;
  model?: string;
  maxTokens?: number;
  maxOutputTokens?: number;
  temperature?: number;
  systemPrompt?: string;
  provider?: AIProvider;
  preferredProvider?: AIProvider;
  fallbackProviders?: AIProvider[];
  signal?: AbortSignal;
}

export interface AIResponse {
  text?: string;
  content?: string;
  error?: string;
  provider: AIProvider;
  model?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  cost?: number;
  latency?: number;
  latencyMs?: number;
  rateLimitError?: boolean;
  quotaExceeded?: boolean;
  fallbackUsed?: boolean;
  suggestedAction?: string;
}

export const PROVIDER_INFO: ProviderInfo[] = [
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    description: 'Anthropic Claude 3.5 Sonnet - Most intelligent model',
    models: ['claude-3-5-sonnet-20241022'],
    requiresApiKey: true,
    apiKeyEnv: 'ANTHROPIC_API_KEY',
    maxTokens: 8192,
    category: 'primary',
    color: '#D97757'
  },
  {
    id: 'claude-3-5-haiku',
    name: 'Claude 3.5 Haiku',
    description: 'Fast Claude model for quick tasks',
    models: ['claude-3-5-haiku-20241022'],
    requiresApiKey: true,
    apiKeyEnv: 'ANTHROPIC_API_KEY',
    maxTokens: 4096,
    category: 'primary',
    color: '#D97757'
  },
  {
    id: 'groq-llama-3-3',
    name: 'Groq Llama 3.3',
    description: 'Ultra-fast inference with Llama 3.3 70B',
    models: ['llama-3.3-70b-versatile'],
    requiresApiKey: true,
    apiKeyEnv: 'GROQ_API_KEY',
    maxTokens: 8192,
    category: 'primary',
    color: '#F55036'
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    description: 'OpenAI GPT-4o - Advanced multimodal model',
    models: ['gpt-4o'],
    requiresApiKey: true,
    apiKeyEnv: 'OPENAI_API_KEY',
    maxTokens: 4096,
    category: 'primary',
    color: '#10A37F'
  },
  {
    id: 'gemini-2-flash',
    name: 'Gemini 2.0 Flash',
    description: 'Google Gemini 2.0 Flash - Fast and capable',
    models: ['gemini-2.0-flash-exp'],
    requiresApiKey: true,
    apiKeyEnv: 'GEMINI_API_KEY',
    maxTokens: 8192,
    category: 'specialist',
    color: '#4285F4'
  },
  {
    id: 'mistral-small',
    name: 'Mistral Small',
    description: 'Mistral AI Small model - Efficient',
    models: ['mistral-small-latest'],
    requiresApiKey: true,
    apiKeyEnv: 'MISTRAL_API_KEY',
    maxTokens: 4096,
    category: 'specialist',
    color: '#5D5FEF'
  },
  {
    id: 'together-llama',
    name: 'Together Llama',
    description: 'Open source Llama models hosted by Together AI',
    models: ['meta-llama/Llama-3.3-70B-Instruct-Turbo'],
    requiresApiKey: true,
    apiKeyEnv: 'TOGETHER_API_KEY',
    maxTokens: 4096,
    category: 'specialist',
    color: '#FF6B35'
  },
  {
    id: 'openrouter-claude',
    name: 'OpenRouter Claude',
    description: 'Claude via OpenRouter - Universal API fallback',
    models: ['anthropic/claude-3.5-sonnet'],
    requiresApiKey: true,
    apiKeyEnv: 'OPENROUTER_API_KEY',
    maxTokens: 4096,
    category: 'fallback',
    color: '#9333EA'
  },
  {
    id: 'fallback',
    name: 'Fallback',
    description: 'Last resort local fallback',
    models: [],
    requiresApiKey: false,
    apiKeyEnv: '',
    maxTokens: 2048,
    category: 'fallback',
    color: '#6B7280'
  }
];

export function getDefaultProvider(): AIProvider {
  return 'groq-llama-3-3';
}

export function getProvidersByCategory(category: ProviderInfo['category']): ProviderInfo[] {
  return PROVIDER_INFO.filter(p => p.category === category);
}

export function getProviderInfo(provider: AIProvider): ProviderInfo | undefined {
  return PROVIDER_INFO.find(p => p.id === provider);
}
