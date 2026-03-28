import { FoundryAIOutput } from '@/types';
import { parseJSON } from '@/lib/utils/json-parser';

export interface RefinementContext {
  originalInput: string;
  currentOutput: FoundryAIOutput;
  iterationCount: number;
  previousRefinements: string[];
  focusAreas?: string[];
}

export function buildRefinementPrompt(context: RefinementContext): string {
  const { originalInput, currentOutput, iterationCount, previousRefinements } = context;
  
  const iterationDescriptions = [
    "FIRST REFINEMENT: Expand all sections with 2-3x more detail. Add specific examples, edge cases, and implementation notes.",
    "SECOND REFINEMENT: Deepen technical architecture. Add database schemas, API endpoints, component hierarchies, and state management patterns.",
    "THIRD REFINEMENT: Enhance user experience with detailed user flows, wireframe descriptions, interaction patterns, and micro-interactions.",
    "FOURTH REFINEMENT: Strengthen monetization with pricing psychology, cohort analysis, churn prediction, and growth hacking tactics.",
    "FIFTH+ REFINEMENT: Masterclass level detail. Add competitive moats, technical debt management, scaling strategies, and advanced optimization.",
  ];
  
  const currentFocus = iterationDescriptions[Math.min(iterationCount - 1, 4)];
  
  return `You are FoundryAI's Refinement Engine - an elite product architect that transforms good plans into exceptional, publication-quality blueprints.

## REFINEMENT MISSION
This is REFINEMENT ITERATION #${iterationCount}. ${currentFocus}

Transform the current output into a meticulously-crafted, comprehensive masterpiece. Every section must be expanded, deepened, and polished to professional standards.

## ORIGINAL USER INPUT
"""${originalInput}"""

## CURRENT OUTPUT TO REFINE
${JSON.stringify(currentOutput, null, 2)}

${previousRefinements.length > 0 ? `\n## PREVIOUS REFINEMENTS APPLIED\n${previousRefinements.map((r, i) => `${i + 1}. ${r}`).join('\n')}` : ''}

## REFINEMENT REQUIREMENTS

### 1. TOOL IDEA
- Expand from simple name to full brand concept
- Include: Tagline, positioning statement, unique value proposition
- Add: Target market size, TAM/SAM/SOM analysis with updated real data
- Define: Brand voice, personality, emotional appeal

### 2. TARGET USER
- Create detailed persona with name, photo description, daily routine
- Add psychographics: fears, desires, objections, triggers
- Include user journey map: awareness → consideration → adoption → advocacy
- Define user segments: primary, secondary, tertiary audiences

### 3. PROBLEM STATEMENT
- Structure as: Situation → Complication → Question → Answer (SCQA)
- Quantify pain with research/data points
- List 5 specific pain points with severity ratings
- Map to Maslow's hierarchy or JTBD framework
- Competitive gap analysis: feature-by-feature comparison matrix

### 4. MARKET RESEARCH (NEW SECTION - ADD THIS)
Expand market research with real 2024-2025 data:

**Market Size & Growth:**
- Update TAM/SAM/SOM with industry-specific research
- Include market growth rate with CAGR calculations
- Reference real market research reports/studies

**Industry Trends:**
- 5-7 specific 2024-2025 trends affecting this market
- Technology shifts, consumer behavior changes, regulatory factors
- Data-backed trend analysis with statistics

**Competitive Landscape:**
- 5 detailed competitor profiles (real company names)
- Market share percentages with sources
- Feature comparison matrix (your product vs competitors)
- Pricing analysis across the competitive set
- SWOT analysis for top 3 competitors

**Target Demographics:**
- Detailed persona demographics with data
- Firmographics (if B2B): company size, industry, revenue
- Behavioral patterns and buying triggers

**Market Gaps & Opportunities:**
- 5 specific unmet needs with evidence
- Market whitespace analysis
- First-mover advantage opportunities

**Market Risks:**
- 3-5 potential market threats
- Regulatory risks, competitive responses, economic factors

### 5. MVP FEATURES (Expand to 8-10 features)
For EACH feature, provide:
- Feature name and ID (F-001, F-002, etc.)
- Detailed description (3-4 sentences)
- User story: "As a [user], I want [feature] so that [benefit]"
- Acceptance criteria (5-7 specific, testable conditions)
- Technical complexity: Low/Medium/High with justification
- Business priority: Must-have/Should-have/Could-have/Won't-have
- Effort estimate in hours
- Dependencies on other features
- UI/UX notes: key interactions, animations, feedback states
- Edge cases and error handling
- Success metrics: how to measure this feature's impact

### 6. TECH STACK (Expand to 10-12 tools)
For EACH tool, provide:
- Full tool name with version
- Specific use cases (3-5 concrete examples)
- Configuration details
- Alternative tools considered and why this was chosen
- Learning curve estimate
- Community/resources available
- Cost structure (even if free, note limits)
- Integration code snippet or pattern
- Troubleshooting: common issues and solutions
- Performance characteristics

### 7. BUILD PLAN (Expand to 12-15 steps)
For EACH step:
- Step number and clear title
- Detailed objective (2-3 paragraphs)
- Prerequisites and dependencies
- Specific deliverables (checklist of 5-10 items)
- Tools/commands needed
- Estimated time with breakdown
- Risk factors and mitigation strategies
- Testing criteria: how to verify completion
- AI tool prompt (highly detailed, copy-paste ready):
  * Full system context
  * File structure needed
  * Component hierarchy
  * State management approach
  * API integration details
  * Error handling strategy
  * Styling requirements
  * Testing approach
- Common pitfalls to avoid
- Resources/tutorials to reference
- Code review checklist

### 8. MONETIZATION STRATEGY
Expand to include:
- Revenue model deep-dive with justification
- Pricing strategy: cost-plus, value-based, competitive, penetration
- Price anchoring tactics
- 3-tier pricing structure with detailed breakdowns:
  * Tier 1 (Free): Exact limits, features, conversion triggers
  * Tier 2 (Growth): $X/month - feature matrix, ideal customer
  * Tier 3 (Pro): $Y/month - enterprise features, support SLAs
- Unit economics: CAC, LTV, payback period, margin analysis
- 10 specific launch tactics with:
  * Platform/channel
  * Exact execution steps
  * Timeline
  * Expected metrics
  * Required assets
  * Success criteria
- Sales funnel optimization
- Retention strategies: onboarding, engagement, win-back
- Expansion revenue opportunities
- Revenue projections: Month 1-3, 4-6, 7-12, Year 2-3
- Break-even analysis
- Risk factors: market, technical, execution
- Mitigation strategies for each risk

### 9. ADDITIONAL SECTIONS TO ADD

#### USER ACQUISITION FUNNEL
- Awareness channels with specific tactics
- Acquisition: landing page optimization, A/B test ideas
- Activation: onboarding flow, time-to-value optimization
- Retention: engagement hooks, habit formation
- Referral: viral loops, incentive structures
- Revenue: conversion optimization, pricing experiments

#### TECHNICAL ARCHITECTURE
- System architecture diagram (describe in detail)
- Database schema: all tables, fields, types, indexes, relationships
- API design: endpoints, methods, request/response schemas
- Frontend architecture: component tree, state management, routing
- Security considerations: auth, authorization, data protection
- Performance optimization: caching, lazy loading, CDN strategy
- Scalability plan: horizontal scaling, database sharding
- Monitoring and logging: tools, metrics, alerts

#### GROWTH & MARKETING PLAYBOOK
- Content calendar: 30-day launch plan
- SEO strategy: keywords, content pillars, link building
- Social media playbook: platforms, content types, posting schedule
- Partnership opportunities: potential collaborators
- PR strategy: press releases, media targets, pitch angles
- Community building: forums, Discord, events
- Case study template for social proof

#### OPERATIONS & SUPPORT
- Customer support: channels, response times, automation
- Documentation: user guides, API docs, tutorials
- Legal: terms of service, privacy policy, compliance
- Analytics: metrics dashboard, reporting cadence
- Team structure: roles needed, hiring timeline

## QUALITY BARRIERS - MUST PASS ALL

✓ **Logical Coherence**: Every recommendation flows logically from the problem statement
✓ **Implementation Ready**: Can start building immediately with no ambiguity
✓ **Measurable Outcomes**: Every section includes metrics and success criteria
✓ **Risk-Aware**: Acknowledges challenges and provides mitigation
✓ **Scalable Foundation**: Architecture supports 10x-100x growth
✓ **Differentiated**: Clear competitive advantages articulated
✓ **User-Centric**: Every decision traced back to user needs
✓ **Financially Viable**: Realistic path to profitability
✓ **Market-Validated**: Based on real industry data and trends

## OUTPUT FORMAT
Return ONLY a valid JSON object. Escape all quotes properly. No markdown, no code blocks, no explanations outside JSON.

The output must be a complete FoundryAIOutput with ALL fields significantly expanded and enhanced from the input, INCLUDING the new marketResearch section.

{
  "toolIdea": "Enhanced with full brand concept",
  "targetUser": "Detailed persona with journey map",
  "problemStatement": "SCQA structure with quantified pain",
  "marketResearch": {
    "tam": "Updated market size with real 2024 data",
    "sam": "Serviceable market with industry sources",
    "som": "Initial target with specific demographics",
    "marketGrowthRate": "CAGR and trend direction",
    "keyTrends": ["5-7 real 2024-2025 trends"],
    "competitorAnalysis": [/* 5 detailed competitors */],
    "targetDemographics": "Detailed demographic profile",
    "userPainPoints": [/* 5 specific pain points */],
    "marketGaps": [/* 5 market opportunities */]
  },
  "mvpFeatures": [/* 8-10 detailed features */],
  "techStack": [/* 10-12 detailed tools */],
  "buildPlan": [/* 12-15 detailed steps */],
  "monetizationStrategy": {
    "model": "Detailed model with unit economics",
    "pricing": "3-tier structure with anchoring",
    "firstUserTactics": [/* 10 specific tactics */],
    "revenueEstimate": "Month-by-month projections with assumptions"
  }
}`;
}

/**
 * Parse refinement response using shared JSON parser
 */
export function parseRefinementResponse(response: string): FoundryAIOutput | null {
  const result = parseJSON<VibeBuilderOutput>(response, validateRefinedOutput);
  
  if (!result.success) {
    console.error('[Refinement] Parse failed:', result.error);
    console.error('[Refinement] Raw snippet:', result.rawSnippet?.slice(0, 500));
    return null;
  }
  
  return result.data || null;
}

function validateRefinedOutput(parsed: unknown): FoundryAIOutput | null {
  if (!parsed || typeof parsed !== 'object') {
    console.error('Parsed output is not an object');
    return null;
  }
  
  const output = parsed as Partial<FoundryAIOutput>;
  
  // Log what we received
  console.log('Validating refinement output:', {
    hasToolIdea: !!output.toolIdea,
    mvpFeaturesCount: output.mvpFeatures?.length,
    techStackCount: output.techStack?.length,
    buildPlanCount: output.buildPlan?.length,
  });
  
  // Very lenient validation - accept any non-empty arrays
  const mvpFeatures = Array.isArray(output.mvpFeatures) && output.mvpFeatures.length > 0
    ? output.mvpFeatures 
    : null;
    
  const techStack = Array.isArray(output.techStack) && output.techStack.length > 0
    ? output.techStack
    : null;
    
  const buildPlan = Array.isArray(output.buildPlan) && output.buildPlan.length > 0
    ? output.buildPlan
    : null;
  
  if (!mvpFeatures || !techStack || !buildPlan) {
    console.error('Refined output missing required arrays:', {
      mvpFeatures: !!mvpFeatures,
      techStack: !!techStack,
      buildPlan: !!buildPlan,
    });
    return null;
  }
  
  return {
    toolIdea: output.toolIdea || 'Refined AI Tool',
    targetUser: output.targetUser || 'Target users',
    problemStatement: output.problemStatement || 'Problem statement',
    marketResearch: output.marketResearch || {
      tam: '$10B+ global market in 2024',
      sam: '$500M serviceable market segment',
      som: '$10M initial obtainable market',
      marketGrowthRate: '15% YoY growth',
      keyTrends: ['AI automation', 'Remote work adoption', 'No-code tools rise'],
      competitorAnalysis: [
        { name: 'Generic Competitor 1', strengths: 'Brand recognition', weaknesses: 'High pricing', marketShare: '25%', pricing: '$50-200/month' },
        { name: 'Generic Competitor 2', strengths: 'Feature-rich', weaknesses: 'Complex UI', marketShare: '20%', pricing: '$30-150/month' },
      ],
      targetDemographics: '25-45 year old professionals, $50K-150K income, urban/suburban',
      userPainPoints: ['Current tools too expensive', 'Too complex for small needs', 'Lack of automation'],
      marketGaps: ['Affordable solution', 'Simplified UX', 'AI-powered features'],
    },
    mvpFeatures,
    techStack,
    buildPlan,
    monetizationStrategy: output.monetizationStrategy || {
      model: 'Freemium',
      pricing: 'Free and Pro tiers',
      firstUserTactics: ['Product Hunt launch', 'Content marketing', 'Community engagement'],
      revenueEstimate: '$500-5000/month within 12 months',
    },
  };
}
