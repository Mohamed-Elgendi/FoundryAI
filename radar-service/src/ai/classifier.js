import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../../.env.local') });
dotenv.config({ path: join(__dirname, '../../../.env') });
dotenv.config({ path: join(__dirname, '../.env') });

// API Keys
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// API URLs
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

/**
 * Provider configuration with priority and capabilities
 */
const PROVIDERS = [
  {
    name: 'claude-3-5-sonnet',
    priority: 1,
    enabled: !!ANTHROPIC_API_KEY,
    model: 'claude-3-5-sonnet-20241022',
    apiUrl: ANTHROPIC_API_URL,
    apiKey: ANTHROPIC_API_KEY,
    maxTokens: 2048,
    type: 'anthropic'
  },
  {
    name: 'gpt-4o',
    priority: 2,
    enabled: !!OPENAI_API_KEY,
    model: 'gpt-4o',
    apiUrl: OPENAI_API_URL,
    apiKey: OPENAI_API_KEY,
    maxTokens: 2048,
    type: 'openai'
  },
  {
    name: 'groq-llama-3-3',
    priority: 3,
    enabled: !!GROQ_API_KEY,
    model: 'llama-3.3-70b-versatile',
    apiUrl: GROQ_API_URL,
    apiKey: GROQ_API_KEY,
    maxTokens: 2048,
    type: 'groq'
  }
];

/**
 * Enhanced classification prompt for powerful models
 */
function buildClassificationPrompt(post) {
  return `You are an expert business analyst and startup strategist. Analyze this Reddit post and extract a high-potential business opportunity.

## POST TO ANALYZE
Title: "${post.title}"
Content: "${post.text?.substring(0, 2000)}"
Subreddit: r/${post.subreddit}
Engagement: ${post.upvotes} upvotes, ${post.numComments} comments

## EXTRACTION TASK
Extract these fields as a valid JSON object:

1. **title** (string, 40-60 chars): A compelling, specific name for this business opportunity. Not generic. Make it sound like a real product.

2. **market** (string): Broad, proven market category. Choose from: Fintech, HealthTech, SaaS, AI Tools, E-commerce, Creator Economy, Productivity, EdTech, DevTools, Sustainability, LegalTech, HR Tech, Cybersecurity, Real Estate Tech, or Consumer Apps.

3. **niche** (string): Specific segment within the market (e.g., "Automated Bookkeeping", "AI Meeting Notes", "Micro-SaaS for Dentists")

4. **sub_niche** (string): Ultra-specific focus area (e.g., "Solo freelancer bookkeeping", "Real-time meeting transcription for remote teams")

5. **angle** (string, 100-150 chars): The unique selling proposition. What makes this different? Why now? Use specific, concrete language.

6. **problem** (string, 2-3 sentences): The pain point this solves. Be specific about WHO suffers and WHY it's painful. Include emotional and financial costs.

7. **horizon** (string): Time to viable MVP. Choose based on complexity:
   - "short" = 1-2 months (simple tool, no AI training, standard APIs)
   - "mid" = 3-6 months (moderate complexity, some custom dev needed)
   - "long" = 6+ months (complex platform, AI training, regulatory hurdles)

8. **validation_signals** (array of 3 strings): Evidence from the post that this is a real problem (e.g., "Multiple users asking for solution", "High engagement on pain point", "Existing workarounds mentioned")

## OUTPUT FORMAT
Return ONLY a JSON object with these exact keys: title, market, niche, sub_niche, angle, problem, horizon, validation_signals.

Example output:
{
  "title": "InvoiceAI - Smart Freelance Billing",
  "market": "Fintech",
  "niche": "Freelancer Invoicing",
  "sub_niche": "AI-powered invoice generation for creative freelancers",
  "angle": "Reads your emails and Slack messages to auto-generate invoices. Eliminates the 'forgot to bill' problem that costs freelancers $12K/year on average.",
  "problem": "Freelancers lose thousands in unbilled hours because tracking time and creating invoices feels tedious. They procrastinate on billing, leading to cash flow problems and client payment delays. Current tools require manual data entry which defeats the purpose.",
  "horizon": "short",
  "validation_signals": ["High engagement on pain point", "Users sharing current workarounds", "Multiple solution requests in comments"]
}

## RULES
- Be SPECIFIC, not generic. "AI productivity tool" is bad. "AI that summarizes Slack threads for async teams" is good.
- The angle must be DIFFERENTIATED. What makes this unique?
- Horizon must be REALISTIC based on technical complexity visible in the post.
- Validation signals must be EVIDENCE-BASED from the post content.
- Return ONLY valid JSON. No markdown, no explanation, no code blocks.`;
}

/**
 * Classify opportunity using best available AI model with fallback
 * @param {Object} post - Reddit post data
 * @returns {Promise<Object>} Classified opportunity
 */
export async function classifyOpportunity(post) {
  // Try providers in priority order
  const enabledProviders = PROVIDERS.filter(p => p.enabled).sort((a, b) => a.priority - b.priority);
  
  if (enabledProviders.length === 0) {
    console.warn('No AI providers configured. Set ANTHROPIC_API_KEY, OPENAI_API_KEY, or GROQ_API_KEY');
    console.warn('Falling back to mock classification');
    return generateMockClassification(post);
  }

  const prompt = buildClassificationPrompt(post);
  
  for (const provider of enabledProviders) {
    try {
      console.log(`🤖 Trying ${provider.name}...`);
      
      let result;
      if (provider.type === 'anthropic') {
        result = await callAnthropic(prompt, provider);
      } else if (provider.type === 'openai') {
        result = await callOpenAI(prompt, provider);
      } else {
        result = await callGroq(prompt, provider);
      }
      
      // Validate the result
      const validated = validateAndNormalize(result, post);
      console.log(`✅ Successfully classified with ${provider.name}`);
      
      return {
        ...validated,
        _meta: {
          provider: provider.name,
          classified_at: new Date().toISOString()
        }
      };
      
    } catch (error) {
      console.error(`❌ ${provider.name} failed:`, error.message);
      
      // Rate limit handling
      if (error.response?.status === 429) {
        const retryAfter = parseInt(error.response.headers['retry-after']) || 5;
        console.log(`⏳ Rate limited. Waiting ${retryAfter}s...`);
        await sleep(retryAfter * 1000);
      }
      
      // Continue to next provider
      continue;
    }
  }
  
  // All providers failed
  console.warn('All AI providers failed. Using mock classification.');
  return generateMockClassification(post);
}

async function callAnthropic(prompt, provider) {
  const response = await axios.post(
    provider.apiUrl,
    {
      model: provider.model,
      max_tokens: provider.maxTokens,
      temperature: 0.2,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    },
    {
      headers: {
        'x-api-key': provider.apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      timeout: 60000
    }
  );

  const content = response.data?.content?.[0]?.text;
  return parseJSONResponse(content);
}

async function callOpenAI(prompt, provider) {
  const response = await axios.post(
    provider.apiUrl,
    {
      model: provider.model,
      messages: [
        {
          role: 'system',
          content: 'You are an expert business analyst. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: provider.maxTokens,
      response_format: { type: 'json_object' }
    },
    {
      headers: {
        'Authorization': `Bearer ${provider.apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 60000
    }
  );

  const content = response.data?.choices?.[0]?.message?.content;
  return parseJSONResponse(content);
}

async function callGroq(prompt, provider) {
  const response = await axios.post(
    provider.apiUrl,
    {
      model: provider.model,
      messages: [
        {
          role: 'system',
          content: 'You are an expert business analyst. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: provider.maxTokens
    },
    {
      headers: {
        'Authorization': `Bearer ${provider.apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 60000
    }
  );

  const content = response.data?.choices?.[0]?.message?.content;
  return parseJSONResponse(content);
}

function parseJSONResponse(content) {
  if (!content) {
    throw new Error('Empty response from AI');
  }

  // Try to extract JSON from various formats
  // 1. Direct JSON
  try {
    return JSON.parse(content);
  } catch {}

  // 2. JSON in markdown code block
  const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch) {
    try {
      return JSON.parse(codeBlockMatch[1]);
    } catch {}
  }

  // 3. JSON object anywhere in text
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch {}
  }

  throw new Error('Could not parse JSON from response');
}

function validateAndNormalize(data, post) {
  const required = ['title', 'market', 'niche', 'problem', 'horizon'];
  
  for (const field of required) {
    if (!data[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  // Normalize fields
  return {
    title: data.title?.substring(0, 100) || 'Untitled Opportunity',
    market: data.market || 'SaaS',
    niche: data.niche || 'General',
    sub_niche: data.sub_niche || data.niche || 'General',
    angle: data.angle || 'AI-powered solution',
    problem: data.problem,
    horizon: ['short', 'mid', 'long'].includes(data.horizon) ? data.horizon : 'mid',
    validation_signals: Array.isArray(data.validation_signals) 
      ? data.validation_signals.slice(0, 3) 
      : ['Post analyzed for opportunity extraction']
  };
}

function generateMockClassification(post) {
  const markets = ['SaaS', 'Fintech', 'HealthTech', 'AI Tools', 'Productivity', 'Creator Economy'];
  const market = markets[Math.floor(Math.random() * markets.length)];
  
  return {
    title: post.title?.substring(0, 60) || 'New Opportunity',
    market: market,
    niche: 'Automation',
    sub_niche: `${market} Automation`,
    angle: 'Streamlined workflow solution using modern AI',
    problem: `Users in ${market} struggle with manual processes that waste time and create errors. This opportunity addresses that pain point with an automated approach.`,
    horizon: Math.random() > 0.5 ? 'short' : 'mid',
    validation_signals: ['Mock classification - no AI provider configured'],
    _meta: {
      provider: 'mock',
      classified_at: new Date().toISOString()
    }
  };
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get available classifier providers
 */
export function getAvailableClassifiers() {
  return PROVIDERS.filter(p => p.enabled).map(p => p.name);
}
