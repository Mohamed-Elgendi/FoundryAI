/**
 * Enhanced AI Router with Multi-Provider Support
 * Claude AI as primary, with smart fallback to other providers
 * Real quota detection and user-controlled provider selection
 */

import { generateText } from 'ai';
import { groq } from '@ai-sdk/groq';
import { google } from '@ai-sdk/google';
import { mistral } from '@ai-sdk/mistral';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';

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

// Provider information for dropdown
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

// Get default provider (Claude 3.5 Sonnet)
export function getDefaultProvider(): AIProvider {
  return 'claude-3-5-sonnet';
}

// Get providers by category
export function getProvidersByCategory(category: ProviderInfo['category']): ProviderInfo[] {
  return PROVIDER_INFO.filter(p => p.category === category);
}

// Get all available providers that are configured
export function getAvailableProviders(): ProviderInfo[] {
  return PROVIDER_INFO.filter(p => isProviderConfigured(p.id));
}

// Check if provider is configured (has API key)
function isProviderConfigured(provider: AIProvider): boolean {
  const config = getProviderConfig(provider);
  if (!config) return provider === 'fallback';
  return !!process.env[config.apiKeyEnv];
}

// Provider configuration
interface ProviderConfig {
  apiKeyEnv: string;
  model: string;
  baseURL?: string;
  provider: string;
  maxTokens: number;
}

// Get configuration for each provider
function getProviderConfig(provider: AIProvider): ProviderConfig | null {
  const configs: Record<AIProvider, ProviderConfig | null> = {
    'claude-3-5-sonnet': {
      apiKeyEnv: 'ANTHROPIC_API_KEY',
      model: 'claude-3-5-sonnet-20241022',
      provider: 'anthropic',
      maxTokens: 8192
    },
    'claude-3-5-haiku': {
      apiKeyEnv: 'ANTHROPIC_API_KEY',
      model: 'claude-3-5-haiku-20241022',
      provider: 'anthropic',
      maxTokens: 4096
    },
    'claude-3-opus': {
      apiKeyEnv: 'ANTHROPIC_API_KEY',
      model: 'claude-3-opus-20240229',
      provider: 'anthropic',
      maxTokens: 4096
    },
    'gpt-4o': {
      apiKeyEnv: 'OPENAI_API_KEY',
      model: 'gpt-4o',
      provider: 'openai',
      maxTokens: 4096
    },
    'gpt-4o-mini': {
      apiKeyEnv: 'OPENAI_API_KEY',
      model: 'gpt-4o-mini',
      provider: 'openai',
      maxTokens: 4096
    },
    'groq-llama-3-3': {
      apiKeyEnv: 'GROQ_API_KEY',
      model: 'llama-3.3-70b-versatile',
      provider: 'groq',
      maxTokens: 4096
    },
    'groq-mixtral': {
      apiKeyEnv: 'GROQ_API_KEY',
      model: 'mixtral-8x7b-32768',
      provider: 'groq',
      maxTokens: 4096
    },
    'gemini-2-flash': {
      apiKeyEnv: 'GEMINI_API_KEY',
      model: 'gemini-2.0-flash-exp',
      provider: 'google',
      maxTokens: 8192
    },
    'gemini-1-5-pro': {
      apiKeyEnv: 'GEMINI_API_KEY',
      model: 'gemini-1.5-pro',
      provider: 'google',
      maxTokens: 8192
    },
    'mistral-small': {
      apiKeyEnv: 'MISTRAL_API_KEY',
      model: 'mistral-small-latest',
      provider: 'mistral',
      maxTokens: 4096
    },
    'mistral-medium': {
      apiKeyEnv: 'MISTRAL_API_KEY',
      model: 'mistral-medium-latest',
      provider: 'mistral',
      maxTokens: 4096
    },
    'deepseek-chat': {
      apiKeyEnv: 'DEEPSEEK_API_KEY',
      model: 'deepseek-chat',
      provider: 'deepseek',
      baseURL: 'https://api.deepseek.com/v1',
      maxTokens: 4096
    },
    'deepseek-coder': {
      apiKeyEnv: 'DEEPSEEK_API_KEY',
      model: 'deepseek-coder',
      provider: 'deepseek',
      baseURL: 'https://api.deepseek.com/v1',
      maxTokens: 4096
    },
    'perplexity-sonar': {
      apiKeyEnv: 'PERPLEXITY_API_KEY',
      model: 'llama-3.1-sonar-large-128k-online',
      provider: 'perplexity',
      baseURL: 'https://api.perplexity.ai',
      maxTokens: 4096
    },
    'together-llama': {
      apiKeyEnv: 'TOGETHER_API_KEY',
      model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
      provider: 'together',
      baseURL: 'https://api.together.xyz/v1',
      maxTokens: 4096
    },
    'cohere-command': {
      apiKeyEnv: 'COHERE_API_KEY',
      model: 'command-r-plus',
      provider: 'cohere',
      maxTokens: 4096
    },
    'openrouter-claude': {
      apiKeyEnv: 'OPENROUTER_API_KEY',
      model: 'anthropic/claude-3.5-sonnet',
      provider: 'openrouter',
      baseURL: 'https://openrouter.ai/api/v1',
      maxTokens: 4096
    },
    'openrouter-gpt': {
      apiKeyEnv: 'OPENROUTER_API_KEY',
      model: 'openai/gpt-4o',
      provider: 'openrouter',
      baseURL: 'https://openrouter.ai/api/v1',
      maxTokens: 4096
    },
    'openrouter-llama': {
      apiKeyEnv: 'OPENROUTER_API_KEY',
      model: 'meta-llama/llama-3.3-70b-instruct',
      provider: 'openrouter',
      baseURL: 'https://openrouter.ai/api/v1',
      maxTokens: 4096
    },
    'fireworks-llama': {
      apiKeyEnv: 'FIREWORKS_API_KEY',
      model: 'accounts/fireworks/models/llama-v3p3-70b-instruct',
      provider: 'fireworks',
      baseURL: 'https://api.fireworks.ai/inference/v1',
      maxTokens: 4096
    },
    'replicate-llama': {
      apiKeyEnv: 'REPLICATE_API_TOKEN',
      model: 'meta/meta-llama-3.1-70b-instruct',
      provider: 'replicate',
      maxTokens: 4096
    },
    'azure-openai': {
      apiKeyEnv: 'AZURE_OPENAI_API_KEY',
      model: process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o',
      provider: 'azure',
      baseURL: process.env.AZURE_OPENAI_ENDPOINT,
      maxTokens: 4096
    },
    'fallback': null
  };
  
  return configs[provider] || null;
}

// Get fallback providers in priority order
export function getFallbackProviders(preferred?: AIProvider): AIProvider[] {
  const priority: AIProvider[] = [
    'claude-3-5-haiku',      // Fast Claude
    'gpt-4o',                // OpenAI
    'groq-llama-3-3',        // Ultra fast
    'gemini-2-flash',        // Google free tier
    'deepseek-chat',         // DeepSeek
    'mistral-small',         // Mistral
    'together-llama',        // Together
    'cohere-command',        // Cohere
    'openrouter-claude',     // OpenRouter backup
    'fallback'               // Local fallback
  ];
  
  if (preferred && preferred !== 'claude-3-5-sonnet' && preferred !== 'claude-3-opus') {
    // If user selected non-Claude, use that first then others
    return [preferred, ...priority.filter(p => p !== preferred)];
  }
  
  return priority;
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

// Main AI processing function
export async function processWithAI(request: AIRequest): Promise<AIResponse> {
  const { 
    prompt, 
    preferredProvider = getDefaultProvider(),
    fallbackProviders,
    maxOutputTokens = 4096,
    temperature = 0.7,
    signal
  } = request;
  
  const startTime = Date.now();
  const providersToTry = fallbackProviders || getFallbackProviders(preferredProvider);
  
  // Try preferred provider first
  if (preferredProvider !== 'fallback') {
    const preferredResult = await tryProvider(preferredProvider, prompt, {
      maxOutputTokens,
      temperature
    });
    
    // If successful, return immediately
    if (preferredResult.content) {
      return {
        ...preferredResult,
        latencyMs: Date.now() - startTime
      };
    }
    
    // If quota exceeded, we'll show that to user
    if (preferredResult.quotaExceeded) {
      return {
        ...preferredResult,
        latencyMs: Date.now() - startTime,
        suggestedAction: 'Claude quota exceeded. Please select another provider from the dropdown.'
      };
    }
  }
  
  // Try fallback providers
  let lastError: AIResponse | null = null;
  
  for (const provider of providersToTry) {
    if (signal?.aborted) {
      throw new Error('Request aborted');
    }
    
    // Skip if same as preferred (already tried)
    if (provider === preferredProvider) continue;
    
    try {
      const result = await tryProvider(provider, prompt, {
        maxOutputTokens,
        temperature
      });
      
      if (result.content) {
        return {
          ...result,
          fallbackUsed: true,
          latencyMs: Date.now() - startTime
        };
      }
      
      if (!lastError || result.quotaExceeded) {
        lastError = result;
      }
    } catch (error: any) {
      console.warn(`Provider ${provider} failed:`, error.message);
      continue;
    }
  }
  
  // All providers failed
  return lastError || {
    content: '',
    provider: 'fallback',
    error: 'All AI providers failed. Please check your API keys or try again later.',
    suggestedAction: 'Add more API keys or select a different provider',
    latencyMs: Date.now() - startTime
  };
}

// Try a specific provider
async function tryProvider(
  provider: AIProvider, 
  prompt: string,
  options: { maxOutputTokens: number; temperature: number }
): Promise<AIResponse> {
  const config = getProviderConfig(provider);
  
  if (!config) {
    return {
      content: getFallbackResponse(prompt),
      provider: 'fallback'
    };
  }
  
  const apiKey = process.env[config.apiKeyEnv];
  
  if (!apiKey) {
    return {
      content: '',
      provider,
      error: `${config.provider} API key not configured`,
      rateLimitError: false
    };
  }
  
  try {
    console.log(`[AI Router] Trying provider: ${provider}`);
    
    let result: string;
    
    switch (config.provider) {
      case 'anthropic':
        result = await tryAnthropic(config.model, prompt, options, apiKey);
        break;
      case 'openai':
        result = await tryOpenAI(config.model, prompt, options, apiKey);
        break;
      case 'groq':
        result = await tryGroq(config.model, prompt, options, apiKey);
        break;
      case 'google':
        result = await tryGemini(config.model, prompt, options, apiKey);
        break;
      case 'mistral':
        result = await tryMistral(config.model, prompt, options, apiKey);
        break;
      case 'deepseek':
        result = await tryDeepSeek(config.model, prompt, options, apiKey, config.baseURL!);
        break;
      case 'perplexity':
        result = await tryPerplexity(config.model, prompt, options, apiKey, config.baseURL!);
        break;
      case 'together':
        result = await tryTogether(config.model, prompt, options, apiKey, config.baseURL!);
        break;
      case 'cohere':
        result = await tryCohere(config.model, prompt, options, apiKey);
        break;
      case 'openrouter':
        result = await tryOpenRouter(config.model, prompt, options, apiKey, config.baseURL!);
        break;
      case 'fireworks':
        result = await tryFireworks(config.model, prompt, options, apiKey, config.baseURL!);
        break;
      case 'replicate':
        result = await tryReplicate(config.model, prompt, options, apiKey);
        break;
      case 'azure':
        result = await tryAzure(config.model, prompt, options, apiKey, config.baseURL!);
        break;
      default:
        throw new Error(`Unknown provider: ${config.provider}`);
    }
    
    return {
      content: result,
      provider
    };
    
  } catch (error: any) {
    console.error(`[${provider}] Error:`, error.message);
    
    const errorMessage = error?.message || '';
    const isQuotaError = errorMessage.includes('quota') || 
                         errorMessage.includes('insufficient_quota') ||
                         errorMessage.includes('billing') ||
                         errorMessage.includes('credit') ||
                         error?.statusCode === 429;
    
    const isRateLimit = error?.statusCode === 429 || 
                        errorMessage.includes('rate limit') ||
                        errorMessage.includes('too many requests');
    
    return {
      content: '',
      provider,
      error: errorMessage,
      rateLimitError: isRateLimit && !isQuotaError,
      quotaExceeded: isQuotaError
    };
  }
}

// Provider implementations
async function tryAnthropic(
  model: string, 
  prompt: string, 
  options: { maxOutputTokens: number; temperature: number },
  apiKey: string
): Promise<string> {
  const { text } = await generateText({
    model: anthropic(model),
    prompt,
    temperature: options.temperature,
    maxOutputTokens: options.maxOutputTokens
  });
  return text;
}

async function tryOpenAI(
  model: string, 
  prompt: string, 
  options: { maxOutputTokens: number; temperature: number },
  apiKey: string
): Promise<string> {
  // OpenAI SDK uses OPENAI_API_KEY from env by default
  // Set it temporarily for this request
  const originalKey = process.env.OPENAI_API_KEY;
  process.env.OPENAI_API_KEY = apiKey;
  
  try {
    const { text } = await generateText({
      model: openai(model),
      prompt,
      temperature: options.temperature,
      maxOutputTokens: options.maxOutputTokens
    });
    return text;
  } finally {
    // Restore original key
    if (originalKey) {
      process.env.OPENAI_API_KEY = originalKey;
    }
  }
}

async function tryGroq(
  model: string, 
  prompt: string, 
  options: { maxOutputTokens: number; temperature: number },
  apiKey: string
): Promise<string> {
  const { text } = await generateText({
    model: groq(model),
    prompt,
    temperature: options.temperature,
    maxOutputTokens: options.maxOutputTokens
  });
  return text;
}

async function tryGemini(
  model: string, 
  prompt: string, 
  options: { maxOutputTokens: number; temperature: number },
  apiKey: string
): Promise<string> {
  const { text } = await generateText({
    model: google(model),
    prompt,
    temperature: options.temperature,
    maxOutputTokens: options.maxOutputTokens
  });
  return text;
}

async function tryMistral(
  model: string, 
  prompt: string, 
  options: { maxOutputTokens: number; temperature: number },
  apiKey: string
): Promise<string> {
  const { text } = await generateText({
    model: mistral(model),
    prompt,
    temperature: options.temperature,
    maxOutputTokens: options.maxOutputTokens
  });
  return text;
}

async function tryDeepSeek(
  model: string, 
  prompt: string, 
  options: { maxOutputTokens: number; temperature: number },
  apiKey: string,
  baseURL: string
): Promise<string> {
  const deepseek = createOpenAICompatible({
    name: 'deepseek',
    apiKey,
    baseURL
  });
  
  const { text } = await generateText({
    model: deepseek(model),
    prompt,
    temperature: options.temperature,
    maxOutputTokens: options.maxOutputTokens
  });
  return text;
}

async function tryPerplexity(
  model: string, 
  prompt: string, 
  options: { maxOutputTokens: number; temperature: number },
  apiKey: string,
  baseURL: string
): Promise<string> {
  const response = await fetch(`${baseURL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: options.temperature,
      max_tokens: options.maxOutputTokens
    })
  });
  
  if (!response.ok) {
    throw new Error(`Perplexity error: ${response.status}`);
  }
  
  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

async function tryTogether(
  model: string, 
  prompt: string, 
  options: { maxOutputTokens: number; temperature: number },
  apiKey: string,
  baseURL: string
): Promise<string> {
  const together = createOpenAICompatible({
    name: 'together',
    apiKey,
    baseURL
  });
  
  const { text } = await generateText({
    model: together(model),
    prompt,
    temperature: options.temperature,
    maxOutputTokens: options.maxOutputTokens
  });
  return text;
}

async function tryCohere(
  model: string, 
  prompt: string, 
  options: { maxOutputTokens: number; temperature: number },
  apiKey: string
): Promise<string> {
  const response = await fetch('https://api.cohere.ai/v1/generate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      prompt,
      temperature: options.temperature,
      max_tokens: options.maxOutputTokens
    })
  });
  
  if (!response.ok) {
    throw new Error(`Cohere error: ${response.status}`);
  }
  
  const data = await response.json();
  return data.generations?.[0]?.text || '';
}

async function tryOpenRouter(
  model: string, 
  prompt: string, 
  options: { maxOutputTokens: number; temperature: number },
  apiKey: string,
  baseURL: string
): Promise<string> {
  const response = await fetch(`${baseURL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://foundryai.vercel.app',
      'X-Title': 'FoundryAI'
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: options.temperature,
      max_tokens: options.maxOutputTokens
    })
  });
  
  if (!response.ok) {
    const status = response.status;
    if (status === 402) {
      throw new Error('OpenRouter requires payment/credits');
    }
    if (status === 429) {
      throw new Error('OpenRouter rate limit reached');
    }
    throw new Error(`OpenRouter error: ${status}`);
  }
  
  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

async function tryFireworks(
  model: string, 
  prompt: string, 
  options: { maxOutputTokens: number; temperature: number },
  apiKey: string,
  baseURL: string
): Promise<string> {
  const fireworks = createOpenAICompatible({
    name: 'fireworks',
    apiKey,
    baseURL
  });
  
  const { text } = await generateText({
    model: fireworks(model),
    prompt,
    temperature: options.temperature,
    maxOutputTokens: options.maxOutputTokens
  });
  return text;
}

async function tryReplicate(
  model: string, 
  prompt: string, 
  options: { maxOutputTokens: number; temperature: number },
  apiKey: string
): Promise<string> {
  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      version: model,
      input: { prompt, max_tokens: options.maxOutputTokens, temperature: options.temperature }
    })
  });
  
  if (!response.ok) {
    throw new Error(`Replicate error: ${response.status}`);
  }
  
  // Replicate is async - return empty for now
  return '';
}

async function tryAzure(
  model: string, 
  prompt: string, 
  options: { maxOutputTokens: number; temperature: number },
  apiKey: string,
  endpoint: string
): Promise<string> {
  const response = await fetch(`${endpoint}/openai/deployments/${model}/chat/completions?api-version=2024-02-15-preview`, {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messages: [{ role: 'user', content: prompt }],
      temperature: options.temperature,
      max_tokens: options.maxOutputTokens
    })
  });
  
  if (!response.ok) {
    throw new Error(`Azure error: ${response.status}`);
  }
  
  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

// Fallback response
function getFallbackResponse(prompt: string): string {
  return JSON.stringify({
    toolIdea: 'AI-Powered Business Plan Generator',
    targetUser: 'Non-technical entrepreneurs',
    problemStatement: 'Difficulty converting ideas into actionable plans',
    marketResearch: {
      tam: '$500B global software market in 2024',
      sam: '$50B SMB software tools market',
      som: '$5M initial target niche',
      marketGrowthRate: '18% YoY growth',
      keyTrends: ['AI-powered automation', 'No-code movement', 'Solo entrepreneurship rise'],
      competitorAnalysis: [
        { name: 'Traditional Consultants', strengths: 'Personalized service', weaknesses: 'Expensive and slow', marketShare: '40%', pricing: '$5,000-50,000/project' },
        { name: 'Template Platforms', strengths: 'Low cost', weaknesses: 'Generic, not actionable', marketShare: '35%', pricing: '$29-99/month' },
        { name: 'AI Tools', strengths: 'Fast generation', weaknesses: 'Lacks business context', marketShare: '15%', pricing: '$20-100/month' }
      ],
      targetDemographics: '25-40 year old aspiring entrepreneurs, $40K-100K income, tech-savvy, time-constrained',
      userPainPoints: ['Don\'t know where to start', 'Can\'t afford expensive consultants', 'Overwhelmed by technical complexity', 'Need validated ideas quickly'],
      marketGaps: ['Affordable AI-powered business planning', 'Actionable step-by-step guidance', 'Integration with modern tech stack']
    },
    mvpFeatures: [
      'Input processing with natural language understanding',
      'Structured output generation with market research',
      'Interactive refinement system',
      'Feedback collection and improvement'
    ],
    techStack: [
      { category: 'Frontend', tool: 'Next.js 15', purpose: 'React framework with App Router', isFree: true },
      { category: 'Styling', tool: 'Tailwind CSS + shadcn/ui', purpose: 'Modern UI components', isFree: true },
      { category: 'Database', tool: 'Supabase', purpose: 'PostgreSQL + Auth', isFree: true },
      { category: 'AI', tool: 'Claude/Groq/Gemini', purpose: 'Multi-provider AI', isFree: true },
      { category: 'Hosting', tool: 'Vercel', purpose: 'Edge deployment', isFree: true }
    ],
    buildPlan: [
      { step: 1, title: 'Project Setup', description: 'Initialize Next.js with TypeScript, Tailwind, and shadcn/ui', estimatedTime: '30 minutes' },
      { step: 2, title: 'AI Integration', description: 'Set up multi-provider AI router with Claude primary', estimatedTime: '2 hours' },
      { step: 3, title: 'UI Components', description: 'Create input form, output display, and provider selector', estimatedTime: '3 hours' }
    ],
    monetizationStrategy: {
      model: 'Freemium SaaS',
      pricing: 'Free: 3 generations/day | Pro: $9/month unlimited',
      firstUserTactics: ['Launch on Product Hunt', 'Post on Indie Hackers', 'Create Twitter threads', 'SEO-optimized blog content'],
      revenueEstimate: '$500-2000 MRR within 6 months'
    }
  });
}

// Get provider status for health check
export function getProviderStatus(): Array<{
  provider: AIProvider;
  available: boolean;
  info: ProviderInfo;
}> {
  return PROVIDER_INFO.map(info => ({
    provider: info.id,
    available: isProviderConfigured(info.id),
    info
  }));
}
