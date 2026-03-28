/**
 * AI Provider Types (Client-Safe)
 * No server-side imports or process.env references
 */

// All available AI providers
export type AIProvider = 
  | 'claude-3-5-sonnet'    // Anthropic - Primary
  | 'claude-3-5-haiku'     // Anthropic - Fast
  | 'claude-3-opus'        // Anthropic - Powerful
  | 'gpt-4o'               // OpenAI
  | 'gpt-4o-mini'          // OpenAI - Fast/Cheap
  | 'groq-llama-3-3'       // Groq - Ultra fast
  | 'groq-mixtral'         // Groq - Mixtral
  | 'gemini-2-flash'       // Google
  | 'gemini-1-5-pro'       // Google - Pro
  | 'mistral-small'        // Mistral
  | 'mistral-medium'       // Mistral - Better
  | 'deepseek-chat'        // DeepSeek
  | 'deepseek-coder'       // DeepSeek - Code
  | 'perplexity-sonar'     // Perplexity - Online
  | 'together-llama'       // Together AI
  | 'cohere-command'       // Cohere
  | 'openrouter-claude'    // OpenRouter - Claude access
  | 'openrouter-gpt'       // OpenRouter - GPT access
  | 'openrouter-llama'     // OpenRouter - Llama
  | 'fireworks-llama'      // Fireworks AI
  | 'replicate-llama'      // Replicate
  | 'azure-openai'         // Azure OpenAI
  | 'fallback';

// Provider metadata for UI
export interface ProviderInfo {
  id: AIProvider;
  name: string;
  description: string;
  category: 'premium' | 'fast' | 'free' | 'experimental';
  color: string;
  recommended?: boolean;
}

// Provider information for dropdown (client-safe, static data)
export const PROVIDER_INFO: ProviderInfo[] = [
  // Claude - Primary (Premium)
  { 
    id: 'claude-3-5-sonnet', 
    name: 'Claude 3.5 Sonnet', 
    description: 'Anthropic - Best for complex business plans',
    category: 'premium',
    color: '#E57035',
    recommended: true
  },
  { 
    id: 'claude-3-opus', 
    name: 'Claude 3 Opus', 
    description: 'Anthropic - Most powerful (slower)',
    category: 'premium',
    color: '#E57035'
  },
  { 
    id: 'claude-3-5-haiku', 
    name: 'Claude 3.5 Haiku', 
    description: 'Anthropic - Fast & efficient',
    category: 'fast',
    color: '#E57035'
  },
  
  // OpenAI
  { 
    id: 'gpt-4o', 
    name: 'GPT-4o', 
    description: 'OpenAI - Great all-rounder',
    category: 'premium',
    color: '#10A37F'
  },
  { 
    id: 'gpt-4o-mini', 
    name: 'GPT-4o Mini', 
    description: 'OpenAI - Fast & affordable',
    category: 'fast',
    color: '#10A37F'
  },
  
  // Google
  { 
    id: 'gemini-2-flash', 
    name: 'Gemini 2.0 Flash', 
    description: 'Google - 1500 req/day free',
    category: 'free',
    color: '#4285F4'
  },
  { 
    id: 'gemini-1-5-pro', 
    name: 'Gemini 1.5 Pro', 
    description: 'Google - Better quality',
    category: 'premium',
    color: '#4285F4'
  },
  
  // Groq - Ultra Fast
  { 
    id: 'groq-llama-3-3', 
    name: 'Groq Llama 3.3', 
    description: 'Groq - 100K tokens/day free, instant',
    category: 'free',
    color: '#F55036',
    recommended: true
  },
  { 
    id: 'groq-mixtral', 
    name: 'Groq Mixtral', 
    description: 'Groq - Mixtral 8x7B, fast',
    category: 'free',
    color: '#F55036'
  },
  
  // Mistral
  { 
    id: 'mistral-small', 
    name: 'Mistral Small', 
    description: 'Mistral AI - Free tier',
    category: 'free',
    color: '#543DE1'
  },
  { 
    id: 'mistral-medium', 
    name: 'Mistral Medium', 
    description: 'Mistral AI - Better quality',
    category: 'premium',
    color: '#543DE1'
  },
  
  // DeepSeek
  { 
    id: 'deepseek-chat', 
    name: 'DeepSeek Chat', 
    description: 'DeepSeek - Great reasoning',
    category: 'free',
    color: '#4D6BFF'
  },
  { 
    id: 'deepseek-coder', 
    name: 'DeepSeek Coder', 
    description: 'DeepSeek - Code specialist',
    category: 'free',
    color: '#4D6BFF'
  },
  
  // Perplexity - Online
  { 
    id: 'perplexity-sonar', 
    name: 'Perplexity Sonar', 
    description: 'Perplexity - Real-time web search',
    category: 'premium',
    color: '#14B8A6'
  },
  
  // Together AI
  { 
    id: 'together-llama', 
    name: 'Together Llama 3.3', 
    description: 'Together AI - $5 free credit',
    category: 'free',
    color: '#1F2937'
  },
  
  // Cohere
  { 
    id: 'cohere-command', 
    name: 'Cohere Command R+', 
    description: 'Cohere - Free tier available',
    category: 'free',
    color: '#D4A574'
  },
  
  // OpenRouter - Multi-access
  { 
    id: 'openrouter-claude', 
    name: 'OpenRouter → Claude', 
    description: 'Access Claude via OpenRouter',
    category: 'experimental',
    color: '#6B7280'
  },
  { 
    id: 'openrouter-gpt', 
    name: 'OpenRouter → GPT-4o', 
    description: 'Access GPT-4o via OpenRouter',
    category: 'experimental',
    color: '#6B7280'
  },
  { 
    id: 'openrouter-llama', 
    name: 'OpenRouter → Llama', 
    description: 'Access Llama via OpenRouter',
    category: 'experimental',
    color: '#6B7280'
  },
  
  // Fireworks
  { 
    id: 'fireworks-llama', 
    name: 'Fireworks Llama 3', 
    description: 'Fireworks AI - Fast inference',
    category: 'free',
    color: '#EC4899'
  },
  
  // Replicate
  { 
    id: 'replicate-llama', 
    name: 'Replicate Llama', 
    description: 'Replicate - Pay per use',
    category: 'experimental',
    color: '#F97316'
  },
  
  // Azure
  { 
    id: 'azure-openai', 
    name: 'Azure OpenAI', 
    description: 'Azure - Enterprise GPT',
    category: 'premium',
    color: '#0078D4'
  },
];

// Get default provider (hardcoded for client-side)
export function getDefaultProvider(): AIProvider {
  return 'claude-3-5-sonnet';
}

// Get providers by category
export function getProvidersByCategory(category: ProviderInfo['category']): ProviderInfo[] {
  return PROVIDER_INFO.filter(p => p.category === category);
}

// AI Request interface
export interface AIRequest {
  prompt: string;
  preferredProvider?: AIProvider;
  fallbackProviders?: AIProvider[];
  maxOutputTokens?: number;
  temperature?: number;
  signal?: AbortSignal;
}

// AI Response interface
export interface AIResponse {
  content: string;
  provider: AIProvider;
  error?: string;
  rateLimitError?: boolean;
  quotaExceeded?: boolean;
  suggestedAction?: string;
  fallbackUsed?: boolean;
  latencyMs?: number;
}
