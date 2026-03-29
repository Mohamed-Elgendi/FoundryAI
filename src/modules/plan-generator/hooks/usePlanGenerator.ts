'use client';

import { useState, useCallback } from 'react';
import { FoundryAIOutput } from '@/types';
import { AIProvider } from '@/lib/ai/ai-types';
import { PlanContext, PlanGeneratorState } from '../types';

export function usePlanGenerator(context: PlanContext) {
  const [state, setState] = useState<PlanGeneratorState>({
    input: '',
    output: null,
    isGenerating: false,
    error: null,
    provider: 'groq' as AIProvider
  });

  const setInput = useCallback((input: string) => {
    setState(prev => ({ ...prev, input }));
  }, []);

  const setProvider = useCallback((provider: AIProvider) => {
    setState(prev => ({ ...prev, provider }));
  }, []);

  const reset = useCallback(() => {
    setState({
      input: '',
      output: null,
      isGenerating: false,
      error: null,
      provider: 'groq' as AIProvider
    });
  }, []);

  const generatePlan = useCallback(async (inputText: string, selectedProvider: AIProvider = 'groq' as AIProvider): Promise<FoundryAIOutput | null> => {
    setState(prev => ({ ...prev, isGenerating: true, error: null }));

    try {
      const enrichedPrompt = buildEnrichedPrompt(inputText, context);
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput: enrichedPrompt,
          provider: selectedProvider
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || `API error: ${response.status}`);
      }

      if (!data.output) {
        throw new Error('No output in response');
      }

      setState(prev => ({
        ...prev,
        output: data.output,
        isGenerating: false
      }));

      return data.output;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to generate plan';
      setState(prev => ({ ...prev, error: errorMsg, isGenerating: false }));
      return null;
    }
  }, [context]);

  return {
    ...state,
    setInput,
    setProvider,
    generatePlan,
    reset
  };
}

function buildEnrichedPrompt(input: string, context: PlanContext): string {
  if (context.source === 'radar' && context.radarData) {
    const { title, problem, angle, market, niche, score, horizon, validationData } = context.radarData;
    
    return `You are FoundryAI - create a complete executable business plan for: ${title}

## VALIDATED INTELLIGENCE
Problem: ${problem}
Angle: ${angle}
Market: ${market} / ${niche}
Radar Score: ${score}/100 | Horizon: ${horizon}
${validationData?.upvotes ? `Community: ${validationData.upvotes} upvotes` : ''}

## REQUIRED OUTPUT - Complete JSON Business Plan

{
  "ideaName": "Specific compelling product name (2-5 words)",
  "targetAudience": {
    "description": "Detailed persona with job title, income, pain level 1-10",
    "painLevel": 8
  },
  "problemStatement": {
    "coreProblem": "What the user struggles with",
    "quantifiedCost": "Cost in time/money/stress",
    "negativeConsequences": ["Consequence 1", "Consequence 2"],
    "alternatives": ["Current solution 1", "Current solution 2"],
    "reasonsTheyFail": ["Why alternative 1 fails", "Why alternative 2 fails"],
    "coreSolution": "How your product solves it",
    "keyBenefits": ["Benefit 1", "Benefit 2", "Benefit 3"],
    "fullStatement": "Complete problem statement paragraph"
  },
  "marketResearch": {
    "tam": "$X billion market with 2024 data source",
    "sam": "$X million serviceable segment",
    "som": "$X initial target",
    "marketGrowthRate": "X% YoY with specific driver",
    "keyTrends": ["Trend 1", "Trend 2", "Trend 3", "Trend 4", "Trend 5"],
    "competitorAnalysis": [
      {"name": "Competitor 1", "strengths": "...", "weaknesses": "...", "marketShare": "X%", "pricing": "$X/month"}
    ],
    "targetDemographics": "Age, income, location, company size, tech level",
    "userPainPoints": ["Pain 1", "Pain 2", "Pain 3", "Pain 4", "Pain 5"],
    "marketGaps": ["Gap 1", "Gap 2", "Gap 3"]
  },
  "mvpFeatures": [
    "Feature 1: Core function - specific capability",
    "Feature 2: Secondary - specific",
    "Feature 3: UX element - specific",
    "Feature 4: Integration - specific",
    "Feature 5: Admin - specific",
    "Feature 6: Monetization - specific",
    "Feature 7: Analytics - specific",
    "Feature 8: Operations - specific"
  ],
  "techStack": [
    {"category": "Frontend", "tool": "Next.js 15 + TypeScript", "purpose": "Full-stack React framework", "isFree": true},
    {"category": "Styling", "tool": "Tailwind + shadcn/ui", "purpose": "UI components", "isFree": true},
    {"category": "Database", "tool": "Supabase", "purpose": "PostgreSQL + Auth + Realtime", "isFree": true},
    {"category": "AI", "tool": "Groq API", "purpose": "Ultra-fast inference, 1M tokens/day free", "isFree": true},
    {"category": "Storage", "tool": "Supabase Storage", "purpose": "Files with CDN, 1GB free", "isFree": true},
    {"category": "Email", "tool": "Resend", "purpose": "3,000 emails/month free", "isFree": true},
    {"category": "Payments", "tool": "Stripe", "purpose": "Subscription billing", "isFree": true},
    {"category": "Monitoring", "tool": "Vercel Analytics", "purpose": "Performance insights", "isFree": true}
  ],
  "buildPlan": [
    {"step": 1, "title": "Foundation", "description": "Next.js setup, Tailwind, shadcn/ui, Supabase config", "estimatedTime": "2 hours", "aiToolAction": "Create Next.js project with shadcn/ui, Supabase connection, dashboard shell"},
    {"step": 2, "title": "Auth & DB", "description": "Supabase Auth, schema, RLS policies, onboarding", "estimatedTime": "3 hours", "aiToolAction": "Build auth system, user profiles, protected routes, onboarding checklist"},
    {"step": 3, "title": "Core Data", "description": "CRUD interfaces, search/filter, optimistic updates", "estimatedTime": "5 hours", "aiToolAction": "Create data management UI with tables, forms, React Hook Form + Zod"},
    {"step": 4, "title": "AI Features", "description": "Groq integration, NLP commands, smart extraction", "estimatedTime": "4 hours", "aiToolAction": "Build AI module, natural language parser, data extraction"},
    {"step": 5, "title": "Workflows", "description": "Visual builder, 25+ templates, scheduling engine", "estimatedTime": "6 hours", "aiToolAction": "Create drag-and-drop builder, triggers, actions, template gallery"},
    {"step": 6, "title": "Integrations", "description": "OAuth for Gmail/Slack/Stripe, webhooks, status dashboard", "estimatedTime": "5 hours", "aiToolAction": "Build OAuth flows, webhook handlers, API key management"},
    {"step": 7, "title": "Mobile & Polish", "description": "Responsive design, skeletons, error handling, accessibility", "estimatedTime": "4 hours", "aiToolAction": "Apply responsive styling, loading states, error boundaries, toast notifications"},
    {"step": 8, "title": "Monetization", "description": "Stripe subscriptions, pricing page, feature gating", "estimatedTime": "5 hours", "aiToolAction": "Implement Stripe Checkout, subscription tiers, usage tracking"},
    {"step": 9, "title": "Launch", "description": "Landing page, analytics, Product Hunt prep", "estimatedTime": "6 hours", "aiToolAction": "Build landing page with hero, features, pricing, testimonials"}
  ],
  "monetizationStrategy": {
    "model": "Freemium SaaS",
    "pricing": "Free: 3 users, 500 records, 5 automations | Pro: $19/month unlimited | Enterprise: $49/user SSO",
    "firstUserTactics": ["Product Hunt launch with demo video", "Reddit/LinkedIn case studies", "30-day content series", "Micro-influencer partnerships", "First 100 users: 50% lifetime discount", "Viral referral loop", "Cold outreach to 200/week"],
    "revenueEstimate": "M1-3: $0-500 | M4-6: $1K-3K | M7-12: $5K-15K/month | Break-even: 4-6mo | $50K MRR: 24mo"
  }
}

## RULES
- NO generic advice - every item SPECIFIC and IMPLEMENTABLE
- QUANTIFY everything - numbers for time, cost, market
- REALISTIC scope - 40 hours total across 9 steps
- SPECIFIC tools only - real available tools
- JSON ONLY - no markdown, no explanation`;
  }

  return `You are FoundryAI - create a complete executable business plan for: ${input}

## USER INPUT
${input}

## REQUIRED OUTPUT - Complete JSON Business Plan

{
  "ideaName": "Specific compelling product name (2-5 words)",
  "targetAudience": {
    "description": "Detailed persona with job title, income, pain level 1-10",
    "painLevel": 8
  },
  "problemStatement": {
    "coreProblem": "What the user struggles with",
    "quantifiedCost": "Cost in time/money/stress",
    "negativeConsequences": ["Consequence 1", "Consequence 2"],
    "alternatives": ["Current solution 1", "Current solution 2"],
    "reasonsTheyFail": ["Why alternative 1 fails", "Why alternative 2 fails"],
    "coreSolution": "How your product solves it",
    "keyBenefits": ["Benefit 1", "Benefit 2", "Benefit 3"],
    "fullStatement": "Complete problem statement paragraph"
  },
  "marketResearch": {
    "tam": "$X billion market with 2024 data source",
    "sam": "$X million serviceable segment",
    "som": "$X initial target",
    "marketGrowthRate": "X% YoY with specific driver",
    "keyTrends": ["Trend 1", "Trend 2", "Trend 3", "Trend 4", "Trend 5"],
    "competitorAnalysis": [
      {"name": "Competitor 1", "strengths": "...", "weaknesses": "...", "marketShare": "X%", "pricing": "$X/month"}
    ],
    "targetDemographics": "Age, income, location, company size, tech level",
    "userPainPoints": ["Pain 1", "Pain 2", "Pain 3", "Pain 4", "Pain 5"],
    "marketGaps": ["Gap 1", "Gap 2", "Gap 3"]
  },
  "mvpFeatures": [
    "Feature 1: Core function - specific capability",
    "Feature 2: Secondary - specific",
    "Feature 3: UX element - specific",
    "Feature 4: Integration - specific",
    "Feature 5: Admin - specific",
    "Feature 6: Monetization - specific",
    "Feature 7: Analytics - specific",
    "Feature 8: Operations - specific"
  ],
  "techStack": [
    {"category": "Frontend", "tool": "Next.js 15 + TypeScript", "purpose": "Full-stack React framework", "isFree": true},
    {"category": "Styling", "tool": "Tailwind + shadcn/ui", "purpose": "UI components", "isFree": true},
    {"category": "Database", "tool": "Supabase", "purpose": "PostgreSQL + Auth + Realtime", "isFree": true},
    {"category": "AI", "tool": "Groq API", "purpose": "Ultra-fast inference, 1M tokens/day free", "isFree": true},
    {"category": "Storage", "tool": "Supabase Storage", "purpose": "Files with CDN, 1GB free", "isFree": true},
    {"category": "Email", "tool": "Resend", "purpose": "3,000 emails/month free", "isFree": true},
    {"category": "Payments", "tool": "Stripe", "purpose": "Subscription billing", "isFree": true},
    {"category": "Monitoring", "tool": "Vercel Analytics", "purpose": "Performance insights", "isFree": true}
  ],
  "buildPlan": [
    {"step": 1, "title": "Foundation", "description": "Next.js setup, Tailwind, shadcn/ui, Supabase config", "estimatedTime": "2 hours", "aiToolAction": "Create Next.js project with shadcn/ui, Supabase connection, dashboard shell"},
    {"step": 2, "title": "Auth & DB", "description": "Supabase Auth, schema, RLS policies, onboarding", "estimatedTime": "3 hours", "aiToolAction": "Build auth system, user profiles, protected routes, onboarding checklist"},
    {"step": 3, "title": "Core Data", "description": "CRUD interfaces, search/filter, optimistic updates", "estimatedTime": "5 hours", "aiToolAction": "Create data management UI with tables, forms, React Hook Form + Zod"},
    {"step": 4, "title": "AI Features", "description": "Groq integration, NLP commands, smart extraction", "estimatedTime": "4 hours", "aiToolAction": "Build AI module, natural language parser, data extraction"},
    {"step": 5, "title": "Workflows", "description": "Visual builder, 25+ templates, scheduling engine", "estimatedTime": "6 hours", "aiToolAction": "Create drag-and-drop builder, triggers, actions, template gallery"},
    {"step": 6, "title": "Integrations", "description": "OAuth for Gmail/Slack/Stripe, webhooks, status dashboard", "estimatedTime": "5 hours", "aiToolAction": "Build OAuth flows, webhook handlers, API key management"},
    {"step": 7, "title": "Mobile & Polish", "description": "Responsive design, skeletons, error handling, accessibility", "estimatedTime": "4 hours", "aiToolAction": "Apply responsive styling, loading states, error boundaries, toast notifications"},
    {"step": 8, "title": "Monetization", "description": "Stripe subscriptions, pricing page, feature gating", "estimatedTime": "5 hours", "aiToolAction": "Implement Stripe Checkout, subscription tiers, usage tracking"},
    {"step": 9, "title": "Launch", "description": "Landing page, analytics, Product Hunt prep", "estimatedTime": "6 hours", "aiToolAction": "Build landing page with hero, features, pricing, testimonials"}
  ],
  "monetizationStrategy": {
    "model": "Freemium SaaS",
    "pricing": "Free: 3 users, 500 records, 5 automations | Pro: $19/month unlimited | Enterprise: $49/user SSO",
    "firstUserTactics": ["Product Hunt launch with demo video", "Reddit/LinkedIn case studies", "30-day content series", "Micro-influencer partnerships", "First 100 users: 50% lifetime discount", "Viral referral loop", "Cold outreach to 200/week"],
    "revenueEstimate": "M1-3: $0-500 | M4-6: $1K-3K | M7-12: $5K-15K/month | Break-even: 4-6mo | $50K MRR: 24mo"
  }
}

## RULES
- NO generic advice - every item SPECIFIC and IMPLEMENTABLE
- QUANTIFY everything - numbers for time, cost, market
- REALISTIC scope - 40 hours total across 9 steps
- SPECIFIC tools only - real available tools
- JSON ONLY - no markdown, no explanation`;
}
