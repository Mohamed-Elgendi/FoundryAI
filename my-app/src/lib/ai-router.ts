import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';

export type AIProvider = 'groq' | 'openrouter' | 'fallback';

interface AIResponse {
  content: string;
  provider: AIProvider;
  error?: string;
  rateLimitError?: boolean;
  suggestedAction?: string;
}

export async function processWithAI(
  prompt: string,
  preferredProvider: AIProvider = 'groq'
): Promise<AIResponse> {
  const providers: AIProvider[] = ['groq', 'openrouter', 'fallback'];
  const startIndex = providers.indexOf(preferredProvider);
  const orderedProviders = [
    ...providers.slice(startIndex),
    ...providers.slice(0, startIndex),
  ].filter((p, i, arr) => arr.indexOf(p) === i);

  let lastError: AIResponse | null = null;

  for (const provider of orderedProviders) {
    try {
      const result = await tryProvider(provider, prompt);
      if (result.content) {
        return result;
      }
      // Store error but continue to next provider
      if (!lastError || result.rateLimitError) {
        lastError = result;
      }
    } catch (error: any) {
      console.warn(`Provider ${provider} failed:`, error);
      continue;
    }
  }

  // Return last error or generic failure
  return lastError || {
    content: '',
    provider: 'fallback',
    error: 'All AI providers failed. Please check your API keys and rate limits.',
  };
}

async function tryProvider(provider: AIProvider, prompt: string): Promise<AIResponse> {
  switch (provider) {
    case 'groq': {
      const result = await tryGroq(prompt);
      if (result.content) {
        return { content: result.content, provider: 'groq' };
      }
      return {
        content: '',
        provider: 'groq',
        error: result.error,
        rateLimitError: result.rateLimitError,
        suggestedAction: result.rateLimitError ? 'Try OpenRouter or wait for rate limit reset' : undefined,
      };
    }
    case 'openrouter': {
      const result = await tryOpenRouter(prompt);
      if (result.content) {
        return { content: result.content, provider: 'openrouter' };
      }
      return {
        content: '',
        provider: 'openrouter',
        error: result.error,
        rateLimitError: result.rateLimitError,
        suggestedAction: result.rateLimitError ? 'Check OpenRouter billing/credits' : undefined,
      };
    }
    case 'fallback':
      return {
        content: getFallbackResponse(prompt),
        provider: 'fallback',
      };
    default:
      return {
        content: '',
        provider: 'fallback',
        error: 'Unknown provider',
      };
  }
}

async function tryGroq(prompt: string): Promise<{content: string | null; rateLimitError?: boolean; error?: string}> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.warn('Groq API key not configured');
    return { content: null, error: 'Groq API key not configured' };
  }

  try {
    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      prompt,
      temperature: 0.7,
    });
    return { content: text };
  } catch (error: any) {
    console.error('Groq error:', error);
    
    // Check for rate limit errors
    const errorMessage = error?.message || '';
    const isRateLimit = errorMessage.includes('rate_limit') || 
                        errorMessage.includes('Rate limit') ||
                        error?.statusCode === 429;
    
    if (isRateLimit) {
      const retryMatch = errorMessage.match(/try again in ([\dms\s.]+)/);
      const retryTime = retryMatch ? retryMatch[1] : 'some time';
      
      return {
        content: null,
        rateLimitError: true,
        error: `Groq rate limit reached. Free tier allows 100,000 tokens/day. Try again in ${retryTime} or switch to OpenRouter in settings.`,
      };
    }
    
    return { content: null, error: errorMessage };
  }
}

async function tryOpenRouter(prompt: string): Promise<{content: string | null; rateLimitError?: boolean; error?: string}> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.warn('OpenRouter API key not configured');
    return { content: null, error: 'OpenRouter API key not configured' };
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
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 402) {
        return {
          content: null,
          rateLimitError: true,
          error: 'OpenRouter requires payment/credits. Please add credits at https://openrouter.ai/credits or check your API key.',
        };
      }
      if (status === 429) {
        return {
          content: null,
          rateLimitError: true,
          error: 'OpenRouter rate limit reached. Please check your account limits or try again later.',
        };
      }
      return {
        content: null,
        error: `OpenRouter HTTP error: ${status}`,
      };
    }

    const data = await response.json();
    return { content: data.choices?.[0]?.message?.content || null };
  } catch (error: any) {
    console.error('OpenRouter error:', error);
    return { content: null, error: error?.message || 'OpenRouter request failed' };
  }
}

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
      'Input processing',
      'Structured output generation',
      'Basic feedback system',
    ],
    techStack: [
      { category: 'Frontend', tool: 'Next.js', purpose: 'Web interface', isFree: true },
      { category: 'Backend', tool: 'Next.js API Routes', purpose: 'Server-side logic', isFree: true },
      { category: 'Database', tool: 'Supabase', purpose: 'Data storage', isFree: true },
      { category: 'AI', tool: 'Groq', purpose: 'Text generation', isFree: true },
      { category: 'Hosting', tool: 'Vercel', purpose: 'Deployment', isFree: true },
    ],
    buildPlan: [
      {
        step: 1,
        title: 'Set up project',
        description: 'Initialize Next.js with TypeScript and Tailwind',
        estimatedTime: '30 minutes',
      },
      {
        step: 2,
        title: 'Create API routes',
        description: 'Build endpoints for AI processing',
        estimatedTime: '1 hour',
      },
      {
        step: 3,
        title: 'Build UI components',
        description: 'Create input form and output display',
        estimatedTime: '2 hours',
      },
    ],
    monetizationStrategy: {
      model: 'Freemium',
      pricing: 'Free tier with limited generations, $9/month for unlimited',
      firstUserTactics: [
        'Post on Product Hunt',
        'Share in relevant subreddits',
        'Create Twitter threads',
      ],
      revenueEstimate: '$100-500/month initially',
    },
  });
}
