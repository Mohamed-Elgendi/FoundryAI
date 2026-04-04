import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseClient } from '@/layer-3-data/storage/supabase-client';

// Business archetype keywords for heuristic matching
const ARCHETYPE_PATTERNS: Record<string, string[]> = {
  ai_agency: ['service', 'client', 'agency', 'consulting', 'done for you', 'dfy', 'automation service'],
  saas: ['app', 'software', 'platform', 'tool', 'saas', 'subscription', 'recurring revenue'],
  digital_products: ['course', 'template', 'ebook', 'guide', 'download', 'digital product', 'information product'],
  content_creator: ['youtube', 'content', 'video', 'blog', 'podcast', 'influencer', 'audience'],
  online_brand: ['brand', 'community', 'personal brand', 'membership', 'tribe', 'following'],
  marketplace: ['marketplace', 'platform', 'connect', 'network', 'two-sided', 'matching'],
  affiliate: ['affiliate', 'commission', 'referral', 'partner', 'promote', 'earn per sale'],
  micro_saas: ['micro-saas', 'small tool', 'niche tool', 'chrome extension', 'simple app'],
  api_service: ['api', 'backend', 'developer tool', 'integration', 'webhook', 'data service'],
  paas: ['infrastructure', 'hosting', 'platform', 'service provider', 'backend platform'],
  high_ticket: ['premium', 'high ticket', 'coaching', 'mastermind', 'exclusive', 'luxury'],
  ecommerce: ['shop', 'store', 'product', 'physical', 'dropship', 'fulfillment', 'inventory'],
};

export async function POST(request: NextRequest) {
  try {
    const { input } = await request.json();

    if (!input || typeof input !== 'string') {
      return NextResponse.json(
        { error: 'Input is required' },
        { status: 400 }
      );
    }

    const input_lower = input.toLowerCase();

    // Calculate archetype fit scores
    const archetypeScores: Array<{ archetype: string; score: number; reasoning: string }> = [];

    for (const [archetype, patterns] of Object.entries(ARCHETYPE_PATTERNS)) {
      let score = 0;
      let matchedPatterns: string[] = [];

      for (const pattern of patterns) {
        if (input_lower.includes(pattern)) {
          score += 15;
          matchedPatterns.push(pattern);
        }
      }

      // Add semantic analysis bonuses
      if (archetype === 'saas' && (input_lower.includes('build') || input_lower.includes('create'))) {
        score += 10;
      }
      if (archetype === 'digital_products' && (input_lower.includes('teach') || input_lower.includes('learn'))) {
        score += 10;
      }
      if (archetype === 'content_creator' && (input_lower.includes('create content') || input_lower.includes('videos'))) {
        score += 15;
      }

      if (score > 0) {
        archetypeScores.push({
          archetype,
          score: Math.min(95, score + 30), // Base boost for any match
          reasoning: `Matched: ${matchedPatterns.slice(0, 2).join(', ')}`,
        });
      }
    }

    // Sort by score descending
    archetypeScores.sort((a, b) => b.score - a.score);

    // If no clear match, default to digital products
    if (archetypeScores.length === 0) {
      archetypeScores.push({
        archetype: 'digital_products',
        score: 55,
        reasoning: 'Best starting point for idea validation',
      });
    }

    // Generate refined concept
    const refinedConcept = generateRefinedConcept(input, archetypeScores[0]?.archetype || 'digital_products');
    
    // Generate problem statement
    const problemStatement = generateProblemStatement(input);
    
    // Generate solution approach
    const solutionApproach = generateSolutionApproach(archetypeScores[0]?.archetype || 'digital_products');

    // Calculate confidence
    const confidenceScore = Math.round(archetypeScores[0]?.score || 50);

    return NextResponse.json({
      originalInput: input,
      archetypeFit: archetypeScores.slice(0, 3),
      refinedConcept,
      targetAudience: generateTargetAudience(archetypeScores[0]?.archetype || 'digital_products'),
      problemStatement,
      solutionApproach,
      monetizationPath: generateMonetizationPath(archetypeScores[0]?.archetype || 'digital_products'),
      timeToFirstRevenue: generateTimeToRevenue(archetypeScores[0]?.archetype || 'digital_products'),
      startupCost: generateStartupCost(archetypeScores[0]?.archetype || 'digital_products'),
      confidenceScore,
    });
  } catch (error) {
    console.error('Idea extraction error:', error);
    return NextResponse.json(
      { error: 'Failed to extract idea' },
      { status: 500 }
    );
  }
}

function generateRefinedConcept(input: string, topArchetype: string): string {
  const cleanInput = input.split(' ').slice(0, 6).join(' ');
  
  const templates: Record<string, string> = {
    saas: `AI-powered ${cleanInput} automation platform for SMBs`,
    micro_saas: `Smart ${cleanInput} tool for freelancers and small teams`,
    digital_products: `Complete ${cleanInput} mastery system with templates`,
    ai_agency: `Done-for-you ${cleanInput} automation service`,
    content_creator: `${cleanInput} education channel with monetization playbook`,
    online_brand: `${cleanInput} community and authority platform`,
    marketplace: `${cleanInput} matching platform for service providers`,
    affiliate: `Curated ${cleanInput} resource hub with recommendations`,
    high_ticket: `Premium ${cleanInput} transformation program`,
    ecommerce: `Specialized ${cleanInput} product line with DTC model`,
  };

  return templates[topArchetype] || `Smart ${cleanInput} solution with AI enhancement`;
}

function generateProblemStatement(input: string): string {
  return `Users currently struggle with ${input.toLowerCase().split(' ').slice(0, 8).join(' ')} because existing solutions are too expensive, too complex, or don't address the specific workflow needs of the target audience.`;
}

function generateSolutionApproach(archetype: string): string {
  const approaches: Record<string, string> = {
    saas: 'Cloud-based SaaS with freemium tiers, AI-assisted onboarding, and usage-based scaling',
    micro_saas: 'Focused browser extension with immediate value delivery and viral sharing features',
    digital_products: 'Comprehensive digital package with video training, templates, and community access',
    ai_agency: 'Hybrid AI+human service delivery with transparent automation and white-glove onboarding',
    content_creator: 'Multi-platform content strategy with automated distribution and engagement optimization',
    marketplace: 'Curated two-sided platform with quality matching algorithm and trust mechanisms',
    affiliate: 'Authority content hub with honest reviews, comparison tools, and exclusive deals',
    high_ticket: 'High-touch consulting with proven framework, 1-on-1 support, and guaranteed outcomes',
    ecommerce: 'Direct-to-consumer brand with story-driven marketing and subscription replenishment',
  };

  return approaches[archetype] || 'AI-enhanced solution with clear value proposition and scalable delivery model';
}

function generateTargetAudience(archetype: string): string {
  const audiences: Record<string, string> = {
    saas: 'Small business owners and solopreneurs with 1-10 employees',
    micro_saas: 'Freelancers and indie makers seeking productivity gains',
    digital_products: 'Aspiring professionals looking to learn and implement quickly',
    ai_agency: 'Busy business owners who need results without learning curve',
    content_creator: 'Niche enthusiasts seeking education and entertainment',
    marketplace: 'Service providers and buyers in underserved niches',
    affiliate: 'Research-oriented buyers seeking best solutions',
    high_ticket: 'Established professionals ready for premium transformation',
    ecommerce: 'Quality-conscious consumers seeking specialized products',
  };

  return audiences[archetype] || 'Target users with clear pain points and willingness to pay';
}

function generateMonetizationPath(archetype: string): string {
  const paths: Record<string, string> = {
    saas: 'Freemium SaaS ($0-99/month tiers) + enterprise upsells',
    micro_saas: 'One-time purchase ($29-99) + premium feature unlocks',
    digital_products: 'Tiered pricing ($47-297) with order bumps and upsells',
    ai_agency: 'Retainer model ($1K-5K/month) + project bonuses',
    content_creator: 'Ad revenue + sponsorships + affiliate + products',
    marketplace: 'Transaction fees (10-20%) + featured placement + premium accounts',
    affiliate: 'Commission earnings (10-50%) + bonus tiers',
    high_ticket: 'Premium pricing ($2K-10K) with payment plans',
    ecommerce: 'Product margins (40-60%) + subscription replenishment',
  };

  return paths[archetype] || 'Multiple revenue streams with recurring component';
}

function generateTimeToRevenue(archetype: string): string {
  const times: Record<string, string> = {
    saas: '21-45 days (MVP build + beta launch)',
    micro_saas: '7-14 days (simple tool + product hunt)',
    digital_products: '3-7 days (content creation + gumroad launch)',
    ai_agency: '7-21 days (landing page + outreach + first client)',
    content_creator: '30-90 days (audience building + monetization)',
    marketplace: '45-90 days (platform build + supply acquisition)',
    affiliate: '14-30 days (content hub + traffic generation)',
    high_ticket: '14-30 days (authority content + sales calls)',
    ecommerce: '21-45 days (product sourcing + store setup + ads)',
  };

  return times[archetype] || '14-30 days (validation + initial launch)';
}

function generateStartupCost(archetype: string): string {
  const costs: Record<string, string> = {
    saas: '$500-2,000 (development + hosting + initial marketing)',
    micro_saas: '$0-500 (AI-assisted build + free tier hosting)',
    digital_products: '$0-200 (content tools + platform fees)',
    ai_agency: '$0-500 (landing page + tools + outreach)',
    content_creator: '$0-1,000 (equipment + editing tools)',
    marketplace: '$1,000-5,000 (platform development + initial supply incentives)',
    affiliate: '$0-300 (website + content creation tools)',
    high_ticket: '$0-500 (authority building + sales tools)',
    ecommerce: '$500-2,000 (inventory + store + initial ads)',
  };

  return costs[archetype] || '$0-500 (AI-assisted validation and launch)';
}
