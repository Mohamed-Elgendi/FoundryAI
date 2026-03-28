/**
 * Enhanced AI Router with Multi-Provider Auto-Rotation
 * Supports multiple free-tier AI providers with automatic failover and rotation
 */

import { generateText } from 'ai';
import { groq } from '@ai-sdk/groq';
import { google } from '@ai-sdk/google';
import { mistral } from '@ai-sdk/mistral';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

export type AIProvider = 
  | 'groq' 
  | 'gemini' 
  | 'mistral' 
  | 'together' 
  | 'cohere' 
  | 'openrouter' 
  | 'fallback';

export interface AIRequest {
  prompt: string;
  preferredProvider?: AIProvider;
  maxOutputTokens?: number;
  temperature?: number;
}

export interface AIResponse {
  content: string;
  provider: AIProvider;
  error?: string;
  rateLimitError?: boolean;
  suggestedAction?: string;
  latencyMs?: number;
}

export interface ProviderConfig {
  name: AIProvider;
  enabled: boolean;
  priority: number;
  apiKeyEnv: string;
  model: string;
  description: string;
  freeTier: {
    requests?: number;
    tokens?: number;
    per: 'day' | 'month';
  };
}

// Comprehensive provider configurations with free tier info
const PROVIDER_CONFIGS: ProviderConfig[] = [
  { 
    name: 'groq', 
    enabled: true, 
    priority: 1,
    apiKeyEnv: 'GROQ_API_KEY',
    model: 'llama-3.3-70b-versatile',
    description: 'Groq - 100K tokens/day free',
    freeTier: { tokens: 100000, per: 'day' }
  },
  { 
    name: 'gemini', 
    enabled: true, 
    priority: 2,
    apiKeyEnv: 'GEMINI_API_KEY',
    model: 'gemini-2.0-flash-exp',
    description: 'Google Gemini - 1500 requests/day free',
    freeTier: { requests: 1500, per: 'day' }
  },
  { 
    name: 'mistral', 
    enabled: true, 
    priority: 3,
    apiKeyEnv: 'MISTRAL_API_KEY',
    model: 'mistral-small-latest',
    description: 'Mistral AI - Free tier available',
    freeTier: { per: 'day' }
  },
  { 
    name: 'together', 
    enabled: true, 
    priority: 4,
    apiKeyEnv: 'TOGETHER_API_KEY',
    model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
    description: 'Together AI - $5 free credit (~100K tokens)',
    freeTier: { tokens: 100000, per: 'month' }
  },
  { 
    name: 'cohere', 
    enabled: true, 
    priority: 5,
    apiKeyEnv: 'COHERE_API_KEY',
    model: 'command-r-plus',
    description: 'Cohere - Free tier available',
    freeTier: { per: 'day' }
  },
  { 
    name: 'openrouter', 
    enabled: true, 
    priority: 6,
    apiKeyEnv: 'OPENROUTER_API_KEY',
    model: 'meta-llama/llama-3.3-70b-instruct',
    description: 'OpenRouter - Free tier with rate limits',
    freeTier: { per: 'day' }
  },
  { 
    name: 'fallback', 
    enabled: true, 
    priority: 99,
    apiKeyEnv: '',
    model: '',
    description: 'Local fallback (no API needed)',
    freeTier: { per: 'day' }
  }
];

// Track failed providers for the current request to avoid retrying
const failedProviders = new Set<AIProvider>();

/**
 * Main AI processing function with automatic provider rotation
 */
export async function processWithAI(request: AIRequest): Promise<AIResponse> {
  const { prompt, preferredProvider } = request;
  const startTime = Date.now();
  
  // Clear failed providers for new request
  failedProviders.clear();
  
  // Get all enabled providers sorted by priority
  const providers = getEnabledProviders(preferredProvider);
  
  let lastError: AIResponse | null = null;
  
  for (const provider of providers) {
    // Skip if already failed this request
    if (failedProviders.has(provider)) continue;
    
    const config = PROVIDER_CONFIGS.find(p => p.name === provider);
    if (!config) continue;
    
    // Check if API key exists
    const apiKey = process.env[config.apiKeyEnv];
    if (!apiKey && provider !== 'fallback') {
      console.log(`[AI Router] Skipping ${provider}: ${config.apiKeyEnv} not configured`);
      continue;
    }
    
    try {
      console.log(`[AI Router] Trying provider: ${provider} (${config.description})`);
      const result = await executeProvider(provider, prompt, request, config);
      
      if (result.content) {
        const latencyMs = Date.now() - startTime;
        console.log(`[AI Router] Success with ${provider} in ${latencyMs}ms`);
        return { ...result, latencyMs };
      }
      
      // Mark provider as failed for this request if it hit rate limit or auth error
      if (result.rateLimitError || result.error?.includes('not configured')) {
        failedProviders.add(provider);
      }
      
      // Store error but continue to next provider
      if (!lastError || result.rateLimitError) {
        lastError = result;
      }
    } catch (error: any) {
      console.warn(`[AI Router] Provider ${provider} failed:`, error.message);
      failedProviders.add(provider);
      continue;
    }
  }
  
  // All providers failed - return last error or generic failure
  return lastError || {
    content: '',
    provider: 'fallback',
    error: 'All AI providers failed. Please check your API keys and rate limits.',
    suggestedAction: 'Add more free API keys to .env.local (GEMINI_API_KEY, MISTRAL_API_KEY, TOGETHER_API_KEY, COHERE_API_KEY)'
  };
}

/**
 * Get enabled providers sorted by priority, optionally starting with preferred
 */
function getEnabledProviders(preferred?: AIProvider): AIProvider[] {
  const enabled = PROVIDER_CONFIGS
    .filter(p => p.enabled)
    .sort((a, b) => a.priority - b.priority)
    .map(p => p.name);
  
  if (preferred && enabled.includes(preferred)) {
    // Move preferred to front
    return [preferred, ...enabled.filter(p => p !== preferred)];
  }
  
  return enabled;
}

/**
 * Build provider execution chain based on preference (legacy function)
 */
function buildProviderChain(preferred: AIProvider): AIProvider[] {
  return getEnabledProviders(preferred);
}

/**
 * Execute specific provider
 */
async function executeProvider(
  provider: AIProvider, 
  prompt: string,
  request: AIRequest,
  config: ProviderConfig
): Promise<AIResponse> {
  switch (provider) {
    case 'groq':
      return tryGroq(prompt, request);
    case 'gemini':
      return tryGemini(prompt, request);
    case 'mistral':
      return tryMistral(prompt, request);
    case 'together':
      return tryTogether(prompt, request);
    case 'cohere':
      return tryCohere(prompt, request);
    case 'openrouter':
      return tryOpenRouter(prompt, request);
    case 'fallback':
      return { 
        content: getFallbackResponse(prompt), 
        provider: 'fallback' 
      };
    default:
      return {
        content: '',
        provider: 'fallback',
        error: `Unknown provider: ${provider}`
      };
  }
}

/**
 * Try Groq API
 */
async function tryGroq(prompt: string, request: AIRequest): Promise<AIResponse> {
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    return {
      content: '',
      provider: 'groq',
      error: 'Groq API key not configured',
      rateLimitError: false
    };
  }

  try {
    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      prompt,
      temperature: request.temperature ?? 0.7,
      maxOutputTokens: request.maxOutputTokens ?? 4000,
    });
    
    return { content: text, provider: 'groq' };
  } catch (error: any) {
    console.error('[Groq] Error:', error.message);
    
    const errorMessage = error?.message || '';
    const isRateLimit = errorMessage.includes('rate_limit') || 
                        errorMessage.includes('Rate limit') ||
                        error?.statusCode === 429 ||
                        errorMessage.includes('tokens per day');
    
    if (isRateLimit) {
      const retryMatch = errorMessage.match(/try again in ([\dms\s.]+)/);
      const retryTime = retryMatch ? retryMatch[1] : 'some time';
      
      return {
        content: '',
        provider: 'groq',
        rateLimitError: true,
        error: `Groq rate limit reached (100K tokens/day). Try again in ${retryTime}.`,
        suggestedAction: 'Switching to next available provider...'
      };
    }
    
    return {
      content: '',
      provider: 'groq',
      error: errorMessage
    };
  }
}

/**
 * Try Google Gemini API
 */
async function tryGemini(prompt: string, request: AIRequest): Promise<AIResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return {
      content: '',
      provider: 'gemini',
      error: 'Gemini API key not configured'
    };
  }

  try {
    const { text } = await generateText({
      model: google('gemini-2.0-flash-exp'),
      prompt,
      temperature: request.temperature ?? 0.7,
      maxOutputTokens: request.maxOutputTokens ?? 4000,
    });
    
    return { content: text, provider: 'gemini' };
  } catch (error: any) {
    console.error('[Gemini] Error:', error.message);
    
    const errorMessage = error?.message || '';
    const isRateLimit = errorMessage.includes('429') || 
                        errorMessage.includes('quota') ||
                        errorMessage.includes('rate limit');
    
    return {
      content: '',
      provider: 'gemini',
      rateLimitError: isRateLimit,
      error: errorMessage,
      suggestedAction: isRateLimit ? 'Gemini rate limit reached (1500 requests/day)' : undefined
    };
  }
}

/**
 * Try Mistral AI API
 */
async function tryMistral(prompt: string, request: AIRequest): Promise<AIResponse> {
  const apiKey = process.env.MISTRAL_API_KEY;
  
  if (!apiKey) {
    return {
      content: '',
      provider: 'mistral',
      error: 'Mistral API key not configured'
    };
  }

  try {
    const { text } = await generateText({
      model: mistral('mistral-small-latest'),
      prompt,
      temperature: request.temperature ?? 0.7,
      maxOutputTokens: request.maxOutputTokens ?? 4000,
    });
    
    return { content: text, provider: 'mistral' };
  } catch (error: any) {
    console.error('[Mistral] Error:', error.message);
    
    const errorMessage = error?.message || '';
    const isRateLimit = error?.statusCode === 429 || 
                        errorMessage.includes('rate limit');
    
    return {
      content: '',
      provider: 'mistral',
      rateLimitError: isRateLimit,
      error: errorMessage,
      suggestedAction: isRateLimit ? 'Mistral rate limit reached' : undefined
    };
  }
}

/**
 * Try Together AI API
 */
async function tryTogether(prompt: string, request: AIRequest): Promise<AIResponse> {
  const apiKey = process.env.TOGETHER_API_KEY;
  
  if (!apiKey) {
    return {
      content: '',
      provider: 'together',
      error: 'Together API key not configured'
    };
  }

  try {
    const together = createOpenAICompatible({
      name: 'together',
      apiKey,
      baseURL: 'https://api.together.xyz/v1',
    });
    
    const { text } = await generateText({
      model: together('meta-llama/Llama-3.3-70B-Instruct-Turbo'),
      prompt,
      temperature: request.temperature ?? 0.7,
      maxOutputTokens: request.maxOutputTokens ?? 4000,
    });
    
    return { content: text, provider: 'together' };
  } catch (error: any) {
    console.error('[Together] Error:', error.message);
    
    const errorMessage = error?.message || '';
    const isRateLimit = error?.statusCode === 429 || 
                        errorMessage.includes('rate limit') ||
                        errorMessage.includes('insufficient');
    
    return {
      content: '',
      provider: 'together',
      rateLimitError: isRateLimit,
      error: errorMessage,
      suggestedAction: isRateLimit ? 'Together AI credit exhausted ($5 free tier)' : undefined
    };
  }
}

/**
 * Try Cohere API
 */
async function tryCohere(prompt: string, request: AIRequest): Promise<AIResponse> {
  const apiKey = process.env.COHERE_API_KEY;
  
  if (!apiKey) {
    return {
      content: '',
      provider: 'cohere',
      error: 'Cohere API key not configured'
    };
  }

  try {
    const response = await fetch('https://api.cohere.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'command-r-plus',
        prompt,
        temperature: request.temperature ?? 0.7,
        max_tokens: request.maxOutputTokens ?? 4000,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      const data = await response.json().catch(() => ({}));
      
      if (status === 429) {
        return {
          content: '',
          provider: 'cohere',
          rateLimitError: true,
          error: 'Cohere rate limit reached',
          suggestedAction: 'Free tier limits exceeded'
        };
      }
      
      return {
        content: '',
        provider: 'cohere',
        error: data.message || `Cohere HTTP error: ${status}`
      };
    }

    const data = await response.json();
    return { 
      content: data.generations?.[0]?.text || '', 
      provider: 'cohere' 
    };
  } catch (error: any) {
    console.error('[Cohere] Error:', error.message);
    return {
      content: '',
      provider: 'cohere',
      error: error?.message || 'Cohere request failed'
    };
  }
}

/**
 * Try OpenRouter API
 */
async function tryOpenRouter(prompt: string, request: AIRequest): Promise<AIResponse> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    return {
      content: '',
      provider: 'openrouter',
      error: 'OpenRouter API key not configured'
    };
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'FoundryAI',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [{ role: 'user', content: prompt }],
        temperature: request.temperature ?? 0.7,
        max_tokens: request.maxOutputTokens ?? 4000,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      
      if (status === 402) {
        return {
          content: '',
          provider: 'openrouter',
          rateLimitError: true,
          error: 'OpenRouter requires payment/credits.',
          suggestedAction: 'Add credits at https://openrouter.ai/credits'
        };
      }
      
      if (status === 429) {
        return {
          content: '',
          provider: 'openrouter',
          rateLimitError: true,
          error: 'OpenRouter rate limit reached.',
          suggestedAction: 'Check your account limits or try again later'
        };
      }
      
      return {
        content: '',
        provider: 'openrouter',
        error: `OpenRouter HTTP error: ${status}`
      };
    }

    const data = await response.json();
    return { 
      content: data.choices?.[0]?.message?.content || '', 
      provider: 'openrouter' 
    };
  } catch (error: any) {
    console.error('[OpenRouter] Error:', error.message);
    return {
      content: '',
      provider: 'openrouter',
      error: error?.message || 'OpenRouter request failed'
    };
  }
}

/**
 * Generate fallback response for demo/testing
 */
function getFallbackResponse(prompt: string): string {
  return JSON.stringify({
    toolIdea: 'AI-Powered Solution Generator',
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
      'Feedback collection and improvement',
    ],
    techStack: [
      { category: 'Frontend', tool: 'Next.js 15', purpose: 'React framework with App Router', isFree: true },
      { category: 'Styling', tool: 'Tailwind CSS + shadcn/ui', purpose: 'Modern UI components', isFree: true },
      { category: 'Database', tool: 'Supabase', purpose: 'PostgreSQL + Auth', isFree: true },
      { category: 'AI', tool: 'Groq', purpose: 'Fast LLM inference', isFree: true },
      { category: 'Hosting', tool: 'Vercel', purpose: 'Edge deployment', isFree: true },
    ],
    buildPlan: [
      {
        step: 1,
        title: 'Project Setup',
        description: 'Initialize Next.js with TypeScript, Tailwind, and shadcn/ui',
        estimatedTime: '30 minutes',
      },
      {
        step: 2,
        title: 'AI Integration',
        description: 'Set up Groq API and build prompt engineering system',
        estimatedTime: '2 hours',
      },
      {
        step: 3,
        title: 'UI Components',
        description: 'Create input form, output display, and refinement UI',
        estimatedTime: '3 hours',
      },
    ],
    monetizationStrategy: {
      model: 'Freemium SaaS',
      pricing: 'Free: 3 generations/month | Pro: $9/month unlimited',
      firstUserTactics: [
        'Launch on Product Hunt',
        'Post on Indie Hackers',
        'Create Twitter threads',
        'SEO-optimized blog content',
      ],
      revenueEstimate: '$500-2000 MRR within 6 months',
    },
  });
}

/**
 * Get provider status information
 */
export function getProviderStatus(): Array<{name: AIProvider; available: boolean; description: string}> {
  return PROVIDER_CONFIGS
    .filter(p => p.name !== 'fallback')
    .map(p => ({
      name: p.name,
      available: !!process.env[p.apiKeyEnv],
      description: p.description
    }));
}
