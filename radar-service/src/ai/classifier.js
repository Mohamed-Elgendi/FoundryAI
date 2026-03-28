import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });
dotenv.config({ path: join(__dirname, '../.env') });

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

/**
 * Classify a Reddit post into structured business opportunity data
 * @param {{title: string, text: string, subreddit: string}} post 
 * @returns {Promise<{title: string, market: string, niche: string, sub_niche: string, angle: string, problem: string, horizon: string}>}
 */
export async function classifyOpportunity(post) {
  if (!GROQ_API_KEY) {
    console.warn('GROQ_API_KEY not set, using mock classification');
    return generateMockClassification(post);
  }

  const prompt = `Analyze this Reddit post and extract a business opportunity. Respond with ONLY valid JSON.

Post Title: "${post.title}"
Post Text: "${post.text?.substring(0, 1000)}"
Subreddit: r/${post.subreddit}

Extract the following fields:
- title: A catchy name for this business opportunity (max 60 chars)
- market: Broad market category (e.g., "Fintech", "HealthTech", "SaaS", "E-commerce", "AI Tools")
- niche: Specific niche within the market (e.g., "Invoicing", "Fitness Tracking", "Content Creation")
- sub_niche: Even more specific (e.g., "Cross-border invoicing for freelancers")
- angle: The unique selling proposition (e.g., "AI-powered compliance automation")
- problem: Clear description of the pain point this solves (2-3 sentences)
- horizon: Time to market - "short" (can build in 1-2 months), "mid" (3-6 months), or "long" (6+ months)

Return ONLY a JSON object with these exact keys: title, market, niche, sub_niche, angle, problem, horizon. No markdown, no explanation.`;

  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'system',
            content: 'You are a business analyst specializing in identifying startup opportunities from social media discussions. You extract structured data and return valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 800
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    const content = response.data?.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('Empty response from Groq');
    }

    // Extract JSON from response (handle potential markdown)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    // Validate required fields
    const required = ['title', 'market', 'niche', 'problem'];
    for (const field of required) {
      if (!parsed[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    return {
      title: parsed.title.substring(0, 100),
      market: parsed.market || 'SaaS',
      niche: parsed.niche || 'General',
      sub_niche: parsed.sub_niche || parsed.niche || 'General',
      angle: parsed.angle || 'AI-powered solution',
      problem: parsed.problem,
      horizon: ['short', 'mid', 'long'].includes(parsed.horizon) ? parsed.horizon : 'mid'
    };

  } catch (error) {
    console.error('Classification error:', error.message);
    
    // Fallback to mock if API fails
    if (error.response?.status === 429) {
      console.log('Rate limited, waiting 10s...');
      await sleep(10000);
    }
    
    return generateMockClassification(post);
  }
}

function generateMockClassification(post) {
  const markets = ['SaaS', 'Fintech', 'HealthTech', 'AI Tools', 'E-commerce', 'Productivity'];
  const market = markets[Math.floor(Math.random() * markets.length)];
  
  return {
    title: post.title.substring(0, 60),
    market: market,
    niche: 'Automation',
    sub_niche: `${market} Automation`,
    angle: 'Streamlined workflow solution',
    problem: `Users struggle with manual processes in ${market.toLowerCase()}. This tool automates repetitive tasks and saves hours of work.`,
    horizon: Math.random() > 0.5 ? 'short' : 'mid'
  };
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
