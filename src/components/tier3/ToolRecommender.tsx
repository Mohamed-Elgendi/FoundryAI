'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Wrench,
  Zap,
  CheckCircle2,
  ExternalLink,
  DollarSign,
  Star,
  ArrowRight,
  Lightbulb,
  Code,
  Palette,
  Database,
  Globe,
  Mail,
  CreditCard,
  BarChart3,
  MessageSquare,
  Search,
  Filter
} from 'lucide-react';

// Tool database with archetype matching
interface Tool {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  pricing: 'free' | 'freemium' | 'paid';
  priceRange: string;
  archetypes: string[];
  useCase: string;
  setupTime: string;
  learningCurve: 'easy' | 'medium' | 'hard';
  alternatives: string[];
  url: string;
  tier: 1 | 2 | 3 | 4 | 5 | 6;
}

const TOOLS: Tool[] = [
  // Tier 1: Core Infrastructure (Free/Freemium)
  {
    id: 'nextjs',
    name: 'Next.js 15',
    category: 'Framework',
    description: 'Full-stack React framework with App Router, Server Components, and API routes',
    icon: Code,
    pricing: 'free',
    priceRange: '$0',
    archetypes: ['saas', 'micro_saas', 'paas', 'marketplace', 'content_creator'],
    useCase: 'Frontend and backend development',
    setupTime: '30 min',
    learningCurve: 'medium',
    alternatives: ['Nuxt', 'SvelteKit', 'Remix'],
    url: 'https://nextjs.org',
    tier: 1,
  },
  {
    id: 'supabase',
    name: 'Supabase',
    category: 'Database & Auth',
    description: 'Open-source Firebase alternative with PostgreSQL, Auth, and Storage',
    icon: Database,
    pricing: 'freemium',
    priceRange: '$0-25/month',
    archetypes: ['saas', 'micro_saas', 'api_service', 'marketplace', 'digital_products'],
    useCase: 'Database, authentication, and file storage',
    setupTime: '15 min',
    learningCurve: 'easy',
    alternatives: ['Firebase', 'PlanetScale', 'Neon'],
    url: 'https://supabase.com',
    tier: 1,
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    category: 'Styling',
    description: 'Utility-first CSS framework for rapid UI development',
    icon: Palette,
    pricing: 'free',
    priceRange: '$0',
    archetypes: ['all'],
    useCase: 'Styling and responsive design',
    setupTime: '10 min',
    learningCurve: 'easy',
    alternatives: ['Chakra UI', 'MUI', 'Bootstrap'],
    url: 'https://tailwindcss.com',
    tier: 1,
  },
  {
    id: 'shadcn',
    name: 'shadcn/ui',
    category: 'Components',
    description: 'Re-usable components built with Radix UI and Tailwind CSS',
    icon: Wrench,
    pricing: 'free',
    priceRange: '$0',
    archetypes: ['all'],
    useCase: 'Pre-built accessible UI components',
    setupTime: '15 min',
    learningCurve: 'easy',
    alternatives: ['Chakra UI', 'Mantine', 'Ant Design'],
    url: 'https://ui.shadcn.com',
    tier: 1,
  },
  {
    id: 'vercel',
    name: 'Vercel',
    category: 'Hosting',
    description: 'Platform for frontend frameworks and serverless functions',
    icon: Globe,
    pricing: 'freemium',
    priceRange: '$0-20/month',
    archetypes: ['all'],
    useCase: 'Deployment, preview environments, and edge functions',
    setupTime: '5 min',
    learningCurve: 'easy',
    alternatives: ['Netlify', 'Railway', 'Render'],
    url: 'https://vercel.com',
    tier: 1,
  },
  
  // Tier 2: Communication & Marketing
  {
    id: 'resend',
    name: 'Resend',
    category: 'Email',
    description: 'Email API for developers with high deliverability',
    icon: Mail,
    pricing: 'freemium',
    priceRange: '$0-20/month',
    archetypes: ['saas', 'micro_saas', 'digital_products', 'ai_agency'],
    useCase: 'Transactional and marketing emails',
    setupTime: '20 min',
    learningCurve: 'easy',
    alternatives: ['SendGrid', 'Mailgun', 'Postmark'],
    url: 'https://resend.com',
    tier: 2,
  },
  {
    id: 'stripe',
    name: 'Stripe',
    category: 'Payments',
    description: 'Payment processing platform with subscriptions and invoicing',
    icon: CreditCard,
    pricing: 'paid',
    priceRange: '2.9% + 30¢ per transaction',
    archetypes: ['saas', 'micro_saas', 'marketplace', 'digital_products', 'ecommerce'],
    useCase: 'Payments, subscriptions, and billing',
    setupTime: '1 hour',
    learningCurve: 'medium',
    alternatives: ['LemonSqueezy', 'Paddle', 'Chargebee'],
    url: 'https://stripe.com',
    tier: 2,
  },
  {
    id: 'lemonsqueezy',
    name: 'LemonSqueezy',
    category: 'Merchant of Record',
    description: 'All-in-one platform for selling digital products with tax handling',
    icon: Zap,
    pricing: 'paid',
    priceRange: '5% + 50¢ per transaction',
    archetypes: ['digital_products', 'saas', 'micro_saas'],
    useCase: 'Digital product sales with global tax compliance',
    setupTime: '30 min',
    learningCurve: 'easy',
    alternatives: ['Stripe', 'Paddle', 'Gumroad'],
    url: 'https://lemonsqueezy.com',
    tier: 2,
  },
  
  // Tier 3: Analytics & Monitoring
  {
    id: 'plausible',
    name: 'Plausible',
    category: 'Analytics',
    description: 'Privacy-friendly, GDPR-compliant web analytics',
    icon: BarChart3,
    pricing: 'paid',
    priceRange: '$9-49/month',
    archetypes: ['all'],
    useCase: 'Website traffic and conversion analytics',
    setupTime: '10 min',
    learningCurve: 'easy',
    alternatives: ['Fathom', 'SimpleAnalytics', 'Google Analytics'],
    url: 'https://plausible.io',
    tier: 3,
  },
  {
    id: 'posthog',
    name: 'PostHog',
    category: 'Product Analytics',
    description: 'Open-source product analytics with session replay and feature flags',
    icon: Search,
    pricing: 'freemium',
    priceRange: '$0-450/month',
    archetypes: ['saas', 'micro_saas', 'marketplace'],
    useCase: 'User behavior, funnels, and feature experimentation',
    setupTime: '30 min',
    learningCurve: 'medium',
    alternatives: ['Amplitude', 'Mixpanel', 'Heap'],
    url: 'https://posthog.com',
    tier: 3,
  },
  
  // Tier 4: AI & Automation
  {
    id: 'groq',
    name: 'Groq API',
    category: 'AI',
    description: 'Fastest LLM inference with competitive pricing',
    icon: Zap,
    pricing: 'paid',
    priceRange: '$0.06-0.30 per 1M tokens',
    archetypes: ['ai_agency', 'saas', 'micro_saas', 'content_creator'],
    useCase: 'AI text generation and chat capabilities',
    setupTime: '15 min',
    learningCurve: 'easy',
    alternatives: ['OpenAI', 'Anthropic', 'Cohere'],
    url: 'https://groq.com',
    tier: 4,
  },
  {
    id: 'openai',
    name: 'OpenAI API',
    category: 'AI',
    description: 'GPT-4, GPT-3.5, and DALL-E APIs for various AI tasks',
    icon: Lightbulb,
    pricing: 'paid',
    priceRange: '$0.03-30 per 1M tokens',
    archetypes: ['ai_agency', 'saas', 'content_creator', 'digital_products'],
    useCase: 'Advanced AI text, image, and code generation',
    setupTime: '15 min',
    learningCurve: 'easy',
    alternatives: ['Groq', 'Anthropic', 'Cohere'],
    url: 'https://openai.com',
    tier: 4,
  },
  {
    id: 'make',
    name: 'Make (Integromat)',
    category: 'Automation',
    description: 'Visual automation platform connecting apps and services',
    icon: Wrench,
    pricing: 'freemium',
    priceRange: '$0-16/month',
    archetypes: ['ai_agency', 'saas', 'digital_products'],
    useCase: 'Workflow automation without code',
    setupTime: '30 min',
    learningCurve: 'easy',
    alternatives: ['Zapier', 'n8n', 'Pipedream'],
    url: 'https://make.com',
    tier: 4,
  },
  
  // Tier 5: Advanced Features
  {
    id: 'clerk',
    name: 'Clerk',
    category: 'Auth',
    description: 'Complete user management with beautiful components',
    icon: CheckCircle2,
    pricing: 'freemium',
    priceRange: '$0-25/month',
    archetypes: ['saas', 'micro_saas', 'marketplace'],
    useCase: 'Advanced authentication and user management',
    setupTime: '20 min',
    learningCurve: 'easy',
    alternatives: ['Auth0', 'Firebase Auth', 'Supabase Auth'],
    url: 'https://clerk.com',
    tier: 5,
  },
  {
    id: 'uploadthing',
    name: 'UploadThing',
    category: 'File Uploads',
    description: 'File uploads for the modern web with TypeScript support',
    icon: ExternalLink,
    pricing: 'freemium',
    priceRange: '$0-30/month',
    archetypes: ['saas', 'marketplace', 'content_creator'],
    useCase: 'Type-safe file uploads with validation',
    setupTime: '20 min',
    learningCurve: 'easy',
    alternatives: ['Cloudinary', 'S3', 'Uploadcare'],
    url: 'https://uploadthing.com',
    tier: 5,
  },
  
  // Tier 6: Professional/Enterprise
  {
    id: 'sentry',
    name: 'Sentry',
    category: 'Error Tracking',
    description: 'Application monitoring and error tracking',
    icon: Search,
    pricing: 'freemium',
    priceRange: '$0-26/month',
    archetypes: ['saas', 'micro_saas', 'paas'],
    useCase: 'Error tracking, performance monitoring, and session replay',
    setupTime: '15 min',
    learningCurve: 'easy',
    alternatives: ['LogRocket', 'Datadog', 'New Relic'],
    url: 'https://sentry.io',
    tier: 6,
  },
  {
    id: 'crisp',
    name: 'Crisp',
    category: 'Support',
    description: 'Customer messaging platform with chat, email, and automation',
    icon: MessageSquare,
    pricing: 'freemium',
    priceRange: '$0-95/month',
    archetypes: ['saas', 'marketplace', 'ecommerce'],
    useCase: 'Live chat, email support, and knowledge base',
    setupTime: '20 min',
    learningCurve: 'easy',
    alternatives: ['Intercom', 'Zendesk', 'Help Scout'],
    url: 'https://crisp.chat',
    tier: 6,
  },
];

// Tool recommendations by archetype
const ARCHETYPE_RECOMMENDATIONS: Record<string, { essential: string[]; recommended: string[]; advanced: string[] }> = {
  saas: {
    essential: ['nextjs', 'supabase', 'tailwind', 'shadcn', 'vercel'],
    recommended: ['stripe', 'resend', 'posthog', 'groq'],
    advanced: ['clerk', 'sentry', 'uploadthing'],
  },
  micro_saas: {
    essential: ['nextjs', 'supabase', 'tailwind', 'shadcn'],
    recommended: ['lemonsqueezy', 'vercel', 'resend', 'groq'],
    advanced: ['plausible', 'crisp'],
  },
  digital_products: {
    essential: ['nextjs', 'tailwind', 'shadcn', 'lemonsqueezy'],
    recommended: ['resend', 'vercel', 'plausible'],
    advanced: ['posthog', 'make'],
  },
  ai_agency: {
    essential: ['nextjs', 'supabase', 'tailwind', 'groq'],
    recommended: ['make', 'resend', 'vercel', 'openai'],
    advanced: ['stripe', 'posthog', 'crisp'],
  },
  content_creator: {
    essential: ['nextjs', 'tailwind', 'shadcn', 'vercel'],
    recommended: ['plausible', 'groq', 'uploadthing'],
    advanced: ['resend', 'lemonsqueezy', 'make'],
  },
  default: {
    essential: ['nextjs', 'tailwind', 'shadcn', 'vercel'],
    recommended: ['supabase', 'resend', 'plausible'],
    advanced: ['stripe', 'groq', 'sentry'],
  },
};

const ToolRecommender: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedArchetype, setSelectedArchetype] = useState('saas');
  const [selectedTier, setSelectedTier] = useState<number | 'all'>('all');
  const [viewMode, setViewMode] = useState<'recommendations' | 'all'>('recommendations');

  const archetypeRecs = ARCHETYPE_RECOMMENDATIONS[selectedArchetype] || ARCHETYPE_RECOMMENDATIONS.default;

  const filteredTools = TOOLS.filter(tool => {
    if (selectedTier !== 'all' && tool.tier !== selectedTier) return false;
    if (viewMode === 'recommendations') {
      const allRecommended = [...archetypeRecs.essential, ...archetypeRecs.recommended, ...archetypeRecs.advanced];
      return allRecommended.includes(tool.id) || tool.archetypes.includes(selectedArchetype) || tool.archetypes.includes('all');
    }
    return tool.archetypes.includes(selectedArchetype) || tool.archetypes.includes('all');
  });

  const getToolStatus = (toolId: string) => {
    if (archetypeRecs.essential.includes(toolId)) return 'essential';
    if (archetypeRecs.recommended.includes(toolId)) return 'recommended';
    if (archetypeRecs.advanced.includes(toolId)) return 'advanced';
    return 'optional';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'essential':
        return <Badge className="bg-red-500 text-white">Essential</Badge>;
      case 'recommended':
        return <Badge className="bg-blue-500 text-white">Recommended</Badge>;
      case 'advanced':
        return <Badge className="bg-purple-500 text-white">Advanced</Badge>;
      default:
        return <Badge variant="outline">Optional</Badge>;
    }
  };

  const getPricingBadge = (pricing: string) => {
    switch (pricing) {
      case 'free':
        return <Badge variant="secondary" className="text-green-600">Free</Badge>;
      case 'freemium':
        return <Badge variant="secondary" className="text-blue-600">Freemium</Badge>;
      default:
        return <Badge variant="secondary" className="text-orange-600">Paid</Badge>;
    }
  };

  // Mini button
  if (!isOpen) {
    return (
      <div className="fixed bottom-40 left-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 shadow-lg bg-gradient-to-r from-green-500 to-teal-500"
        >
          <Wrench className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <Wrench className="w-6 h-6 text-green-600" />
            <CardTitle>Tool Recommender</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <ArrowRight className="w-4 h-4 rotate-45" />
          </Button>
        </CardHeader>

        <CardContent className="overflow-y-auto max-h-[calc(90vh-100px)]">
          {/* Filters */}
          <div className="space-y-3 mb-4">
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground py-2">Archetype:</span>
              {['saas', 'micro_saas', 'digital_products', 'ai_agency', 'content_creator', 'ecommerce'].map(arch => (
                <button
                  key={arch}
                  onClick={() => setSelectedArchetype(arch)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    selectedArchetype === arch
                      ? 'bg-green-500 text-white'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {arch.replace('_', ' ')}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Tier:</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setSelectedTier('all')}
                  className={`px-3 py-1 rounded-full text-xs ${
                    selectedTier === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}
                >
                  All
                </button>
                {[1, 2, 3, 4, 5, 6].map(tier => (
                  <button
                    key={tier}
                    onClick={() => setSelectedTier(tier)}
                    className={`px-3 py-1 rounded-full text-xs ${
                      selectedTier === tier ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}
                  >
                    T{tier}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('recommendations')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'recommendations'
                    ? 'bg-green-100 text-green-700 dark:bg-green-950'
                    : 'bg-muted'
                }`}
              >
                <Star className="w-4 h-4 inline mr-1" />
                Smart Recommendations
              </button>
              <button
                onClick={() => setViewMode('all')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'all'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-950'
                    : 'bg-muted'
                }`}
              >
                <Filter className="w-4 h-4 inline mr-1" />
                All Tools
              </button>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="p-3 bg-red-50 dark:bg-red-950 rounded text-center">
              <div className="text-lg font-bold text-red-600">
                {archetypeRecs.essential.length}
              </div>
              <div className="text-xs text-muted-foreground">Essential</div>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded text-center">
              <div className="text-lg font-bold text-blue-600">
                {archetypeRecs.recommended.length}
              </div>
              <div className="text-xs text-muted-foreground">Recommended</div>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded text-center">
              <div className="text-lg font-bold text-purple-600">
                {archetypeRecs.advanced.length}
              </div>
              <div className="text-xs text-muted-foreground">Advanced</div>
            </div>
            <div className="p-3 bg-muted rounded text-center">
              <div className="text-lg font-bold">
                {TOOLS.filter(t => t.pricing === 'free').length}
              </div>
              <div className="text-xs text-muted-foreground">Free Tools</div>
            </div>
          </div>

          {/* Tool Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredTools.map(tool => {
              const Icon = tool.icon;
              const status = getToolStatus(tool.id);
              
              return (
                <div
                  key={tool.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    status === 'essential'
                      ? 'border-red-200 bg-red-50/50 dark:bg-red-950/20'
                      : status === 'recommended'
                        ? 'border-blue-200 bg-blue-50/50 dark:bg-blue-950/20'
                        : status === 'advanced'
                          ? 'border-purple-200 bg-purple-50/50 dark:bg-purple-950/20'
                          : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{tool.name}</span>
                          {getPricingBadge(tool.pricing)}
                        </div>
                        <div className="text-xs text-muted-foreground">{tool.category}</div>
                      </div>
                    </div>
                    {getStatusBadge(status)}
                  </div>

                  <p className="text-sm mt-3">{tool.description}</p>

                  <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {tool.setupTime} setup
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      {tool.priceRange}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      Tier {tool.tier}
                    </Badge>
                  </div>

                  <div className="mt-3 pt-3 border-t flex gap-2">
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button variant="outline" size="sm" className="w-full">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Visit
                      </Button>
                    </a>
                    {tool.alternatives.length > 0 && (
                      <Badge variant="secondary" className="text-xs py-1">
                        Alt: {tool.alternatives.slice(0, 2).join(', ')}
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Setup Checklist */}
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              Essential Setup Checklist for {selectedArchetype.replace('_', ' ')}
            </h4>
            <div className="space-y-2">
              {TOOLS.filter(t => archetypeRecs.essential.includes(t.id)).map((tool, idx) => (
                <div key={tool.id} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </div>
                  <span className="text-sm">Setup {tool.name}</span>
                  <span className="text-xs text-muted-foreground ml-auto">({tool.setupTime})</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ToolRecommender;
