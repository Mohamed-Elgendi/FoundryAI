'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Lightbulb, Code, Rocket, Zap, ShoppingBag, Heart, 
  GraduationCap, Briefcase, Gamepad2, Music, Camera, 
  Utensils, Dumbbell, Plane, Home, Car, X, Sparkles,
  Search, Filter, TrendingUp, Users, BookOpen, Globe,
  Smartphone, Layers, Box, Target, Award,
  Bot, Share2, ShoppingCart, Video, Podcast, PenTool,
  Building2, Cpu, Database, Cloud, Wallet, BarChart3,
  MessageSquare, Palette, Wrench, FileText, Headphones,
  Compass, Flame, Crown, Gem, Star, Trophy
} from 'lucide-react';

// 12 Business Archetypes with icons
const ARCHETYPES = [
  { id: 'all', name: 'All Archetypes', icon: Layers, color: 'bg-gray-500' },
  { id: 'ai_agency', name: 'AI Agency', icon: Bot, color: 'bg-blue-500' },
  { id: 'saas', name: 'SaaS', icon: Cloud, color: 'bg-indigo-500' },
  { id: 'digital_products', name: 'Digital Products', icon: Box, color: 'bg-purple-500' },
  { id: 'content_creator', name: 'Content Creator', icon: Video, color: 'bg-red-500' },
  { id: 'online_brand', name: 'Online Brand', icon: Award, color: 'bg-pink-500' },
  { id: 'marketplace', name: 'Marketplace', icon: ShoppingBag, color: 'bg-orange-500' },
  { id: 'affiliate', name: 'Affiliate', icon: Share2, color: 'bg-green-500' },
  { id: 'micro_saas', name: 'Micro-SaaS', icon: Zap, color: 'bg-cyan-500' },
  { id: 'api_service', name: 'API Service', icon: Database, color: 'bg-teal-500' },
  { id: 'paas', name: 'PaaS', icon: Server, color: 'bg-sky-500' },
  { id: 'high_ticket', name: 'High-Ticket', icon: Crown, color: 'bg-amber-500' },
  { id: 'ecommerce', name: 'E-Commerce', icon: ShoppingCart, color: 'bg-emerald-500' },
];

import { Server } from 'lucide-react';

interface Template {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  archetype: string;
  input: string;
  color: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeToLaunch: string;
  revenuePotential: string;
  tags: string[];
}

// Expanded template library with 100+ templates across all archetypes
const TEMPLATES: Template[] = [
  // AI AGENCY Templates
  {
    id: 'agency-1',
    title: 'AI Content Agency',
    description: 'Done-for-you AI content creation service for businesses',
    icon: Bot,
    category: 'Services',
    archetype: 'ai_agency',
    input: 'Create an AI-powered content agency that writes blog posts, social media content, and email sequences for businesses. The service uses AI for first drafts with human editing for quality assurance. Target small businesses spending $2K+ monthly on content.',
    color: 'from-blue-500 to-cyan-500',
    difficulty: 'intermediate',
    timeToLaunch: '14 days',
    revenuePotential: '$5K-20K/month',
    tags: ['content', 'agency', 'b2b', 'recurring']
  },
  {
    id: 'agency-2',
    title: 'AI Customer Support Agency',
    description: 'Chatbot implementation and management for e-commerce',
    icon: Headphones,
    category: 'Services',
    archetype: 'ai_agency',
    input: 'Build an agency that implements AI customer support chatbots for e-commerce stores. Service includes setup, training, ongoing optimization, and human handoff protocols. Target Shopify stores doing $50K+ monthly revenue.',
    color: 'from-blue-600 to-indigo-600',
    difficulty: 'intermediate',
    timeToLaunch: '21 days',
    revenuePotential: '$3K-15K/month',
    tags: ['chatbot', 'ecommerce', 'support', 'automation']
  },
  {
    id: 'agency-3',
    title: 'AI Lead Generation Agency',
    description: 'Automated outreach and qualification system',
    icon: Target,
    category: 'Services',
    archetype: 'ai_agency',
    input: 'Create a lead generation agency using AI for personalized outreach, lead scoring, and appointment setting. System integrates with LinkedIn, email, and CRMs. Target B2B service companies needing 10+ qualified leads monthly.',
    color: 'from-indigo-500 to-purple-500',
    difficulty: 'advanced',
    timeToLaunch: '30 days',
    revenuePotential: '$5K-25K/month',
    tags: ['lead-gen', 'outreach', 'b2b', 'sales']
  },

  // SAAS Templates
  {
    id: 'saas-1',
    title: 'Freelance Finance Tracker',
    description: 'Tool for freelancers to track income, expenses, and taxes',
    icon: Briefcase,
    category: 'Finance',
    archetype: 'saas',
    input: 'I want to build a tool that helps freelancers track their income and expenses. It should categorize transactions, calculate estimated taxes, generate invoices, and show monthly/yearly financial reports. The target users are independent contractors and freelancers who struggle with financial organization.',
    color: 'from-emerald-500 to-teal-500',
    difficulty: 'intermediate',
    timeToLaunch: '45 days',
    revenuePotential: '$10K-50K MRR',
    tags: ['freelance', 'finance', 'taxes', 'productivity']
  },
  {
    id: 'saas-2',
    title: 'Remote Team Standup Tool',
    description: 'Async daily standups for distributed teams',
    icon: Rocket,
    category: 'Productivity',
    archetype: 'saas',
    input: 'A tool for remote teams to do asynchronous daily standups. Team members record quick video or text updates, which are compiled into a digest for the team. It should integrate with Slack, track blockers automatically, and generate weekly summaries. Target is distributed engineering teams across time zones.',
    color: 'from-violet-500 to-purple-500',
    difficulty: 'intermediate',
    timeToLaunch: '30 days',
    revenuePotential: '$5K-30K MRR',
    tags: ['remote', 'team', 'async', 'standup']
  },
  {
    id: 'saas-3',
    title: 'AI Meal Planner',
    description: 'Personalized meal planning with AI-generated recipes and grocery lists',
    icon: Utensils,
    category: 'Health',
    archetype: 'saas',
    input: 'An AI-powered meal planning app that creates personalized weekly meal plans based on dietary restrictions, calorie goals, and budget. It should generate shopping lists, suggest recipes using available ingredients, and track nutrition. Target users are busy professionals and health-conscious families.',
    color: 'from-orange-500 to-amber-500',
    difficulty: 'intermediate',
    timeToLaunch: '60 days',
    revenuePotential: '$8K-40K MRR',
    tags: ['health', 'meal-planning', 'ai', 'nutrition']
  },
  {
    id: 'saas-4',
    title: 'Learning Path Generator',
    description: 'AI-curated learning paths for any skill',
    icon: GraduationCap,
    category: 'Education',
    archetype: 'saas',
    input: 'An AI-powered platform that generates personalized learning paths for any skill or topic. It aggregates free resources (YouTube, articles, courses), creates a structured curriculum with milestones, and tracks progress. Include community features for study groups. Target users are self-directed learners and career switchers.',
    color: 'from-blue-500 to-cyan-500',
    difficulty: 'intermediate',
    timeToLaunch: '45 days',
    revenuePotential: '$5K-25K MRR',
    tags: ['education', 'learning', 'ai', 'community']
  },
  {
    id: 'saas-5',
    title: 'Pet Health Journal',
    description: 'Track pet health, vet visits, and medications',
    icon: Heart,
    category: 'Lifestyle',
    archetype: 'saas',
    input: 'A mobile-first app for pet owners to track their pet\'s health records, vet appointments, medications, vaccinations, and daily activities. Include reminders for meds, photo timeline, and shareable reports for vets. Target users are pet parents with senior pets or chronic conditions.',
    color: 'from-pink-500 to-rose-500',
    difficulty: 'beginner',
    timeToLaunch: '30 days',
    revenuePotential: '$3K-15K MRR',
    tags: ['pets', 'health', 'mobile', 'reminders']
  },

  // MICRO-SAAS Templates
  {
    id: 'micro-1',
    title: 'Micro-SaaS Pricing Calculator',
    description: 'Pricing strategy tool for bootstrapped founders',
    icon: Zap,
    category: 'Business',
    archetype: 'micro_saas',
    input: 'A pricing calculator tool for micro-SaaS founders to determine optimal pricing tiers. It should analyze competitor pricing, calculate unit economics, suggest value-based pricing strategies, and generate pricing page copy. Include A/B testing guidance. Target is solo founders and indie hackers launching their first product.',
    color: 'from-yellow-500 to-orange-500',
    difficulty: 'beginner',
    timeToLaunch: '7 days',
    revenuePotential: '$1K-5K MRR',
    tags: ['pricing', 'saas', 'calculator', 'bootstrap']
  },
  {
    id: 'micro-2',
    title: 'Twitter Thread Formatter',
    description: 'Chrome extension for writing Twitter threads',
    icon: MessageSquare,
    category: 'Social',
    archetype: 'micro_saas',
    input: 'A browser extension that helps users write, format, and schedule Twitter/X threads. Features include character counting, auto-splitting, scheduling, analytics, and templates. Target content creators and marketers who post regularly on Twitter.',
    color: 'from-sky-500 to-blue-500',
    difficulty: 'beginner',
    timeToLaunch: '14 days',
    revenuePotential: '$2K-8K MRR',
    tags: ['twitter', 'social', 'extension', 'content']
  },
  {
    id: 'micro-3',
    title: 'Email Signature Generator',
    description: 'Professional email signatures with tracking',
    icon: Mail,
    category: 'Productivity',
    archetype: 'micro_saas',
    input: 'Create a tool that generates professional email signatures with click tracking, social links, and calendar booking integration. Include templates for different industries and A/B testing for link performance. Target professionals and sales teams.',
    color: 'from-indigo-400 to-purple-400',
    difficulty: 'beginner',
    timeToLaunch: '10 days',
    revenuePotential: '$1K-4K MRR',
    tags: ['email', 'signature', 'tracking', 'productivity']
  },
  {
    id: 'micro-4',
    title: 'JSON Formatter Pro',
    description: 'Advanced JSON viewer and validator with collaboration',
    icon: Code,
    category: 'Developer Tools',
    archetype: 'micro_saas',
    input: 'A developer tool for formatting, validating, and visualizing JSON data. Features include schema validation, diff viewer, team collaboration, API integration, and export options. Target developers working with APIs and configuration files.',
    color: 'from-emerald-400 to-green-400',
    difficulty: 'intermediate',
    timeToLaunch: '21 days',
    revenuePotential: '$2K-10K MRR',
    tags: ['json', 'developer', 'api', 'tool']
  },

  // DIGITAL PRODUCTS Templates
  {
    id: 'digital-1',
    title: 'Notion Second Brain Template',
    description: 'Complete productivity system in Notion',
    icon: BookOpen,
    category: 'Templates',
    archetype: 'digital_products',
    input: 'A comprehensive Notion template system for personal knowledge management, task tracking, goal setting, and content creation. Include PARA method, periodic reviews, and automation. Target knowledge workers and content creators.',
    color: 'from-gray-600 to-gray-800',
    difficulty: 'beginner',
    timeToLaunch: '3 days',
    revenuePotential: '$2K-15K/month',
    tags: ['notion', 'template', 'productivity', 'pkm']
  },
  {
    id: 'digital-2',
    title: 'SaaS Launch Checklist',
    description: 'Complete 90-day launch playbook',
    icon: Rocket,
    category: 'Guides',
    archetype: 'digital_products',
    input: 'A detailed checklist and guide for launching a SaaS product in 90 days. Includes weekly tasks, marketing templates, technical setup guide, and pre-launch sequence. Target first-time founders building their first product.',
    color: 'from-orange-500 to-red-500',
    difficulty: 'beginner',
    timeToLaunch: '7 days',
    revenuePotential: '$3K-20K/month',
    tags: ['saas', 'launch', 'checklist', 'guide']
  },
  {
    id: 'digital-3',
    title: 'YouTube Starter Kit',
    description: 'Templates, scripts, and workflows for new YouTubers',
    icon: Video,
    category: 'Content',
    archetype: 'digital_products',
    input: 'A complete starter kit for new YouTube creators including video script templates, thumbnail formulas, content calendar, SEO checklist, and monetization roadmap. Target aspiring creators with 0-1000 subscribers.',
    color: 'from-red-500 to-pink-500',
    difficulty: 'beginner',
    timeToLaunch: '5 days',
    revenuePotential: '$2K-12K/month',
    tags: ['youtube', 'content', 'templates', 'creator']
  },
  {
    id: 'digital-4',
    title: 'Freelance Proposal Templates',
    description: 'Winning proposal templates for different services',
    icon: FileText,
    category: 'Business',
    archetype: 'digital_products',
    input: 'A collection of proven proposal templates for web designers, developers, marketers, and consultants. Include pricing strategies, scope definitions, and contract clauses. Target freelancers struggling to close deals.',
    color: 'from-teal-500 to-emerald-500',
    difficulty: 'beginner',
    timeToLaunch: '3 days',
    revenuePotential: '$1K-8K/month',
    tags: ['freelance', 'proposals', 'templates', 'sales']
  },

  // CONTENT CREATOR Templates
  {
    id: 'content-1',
    title: 'Faceless YouTube Channel',
    description: 'AI-assisted video creation without showing face',
    icon: Video,
    category: 'YouTube',
    archetype: 'content_creator',
    input: 'Create a faceless YouTube channel using AI for script writing, voiceover, and video editing. Focus on educational content in a profitable niche like finance, technology, or self-improvement. Target introverts who want to build audience without personal brand.',
    color: 'from-red-600 to-rose-600',
    difficulty: 'intermediate',
    timeToLaunch: '14 days',
    revenuePotential: '$1K-50K/month',
    tags: ['youtube', 'faceless', 'ai', 'content']
  },
  {
    id: 'content-2',
    title: 'Niche Newsletter',
    description: 'Curated weekly newsletter for specific industry',
    icon: Mail,
    category: 'Newsletter',
    archetype: 'content_creator',
    input: 'Start a weekly newsletter curating the best content, tools, and insights for a specific niche like AI, no-code, or indie hacking. Include original analysis, sponsor integration, and community features. Target professionals who want to stay updated.',
    color: 'from-purple-500 to-indigo-500',
    difficulty: 'beginner',
    timeToLaunch: '7 days',
    revenuePotential: '$500-20K/month',
    tags: ['newsletter', 'curation', 'niche', 'writing']
  },
  {
    id: 'content-3',
    title: 'Podcast Network',
    description: 'Interview-based show with monetization system',
    icon: Podcast,
    category: 'Audio',
    archetype: 'content_creator',
    input: 'Launch an interview podcast in a business niche, focusing on founder stories or industry insights. Include production workflow, guest outreach system, and sponsor monetization from episode 10. Target aspiring podcasters with 5+ hours weekly.',
    color: 'from-violet-600 to-purple-600',
    difficulty: 'intermediate',
    timeToLaunch: '21 days',
    revenuePotential: '$1K-30K/month',
    tags: ['podcast', 'interviews', 'audio', 'network']
  },

  // AFFILIATE Templates
  {
    id: 'affiliate-1',
    title: 'Tool Comparison Site',
    description: 'Review and compare software tools with affiliate links',
    icon: BarChart3,
    category: 'Review Site',
    archetype: 'affiliate',
    input: 'Create a comparison website for a specific software category like email marketing tools, project management software, or AI writing assistants. Include detailed reviews, feature comparisons, and affiliate links. Target buyers in research phase.',
    color: 'from-green-500 to-emerald-500',
    difficulty: 'intermediate',
    timeToLaunch: '30 days',
    revenuePotential: '$500-10K/month',
    tags: ['affiliate', 'reviews', 'comparison', 'seo']
  },
  {
    id: 'affiliate-2',
    title: 'Resource Directory',
    description: 'Curated tools and resources for specific audience',
    icon: Compass,
    category: 'Directory',
    archetype: 'affiliate',
    input: 'Build a curated directory of tools, resources, and services for a specific audience like freelancers, remote workers, or e-commerce sellers. Include affiliate links, discounts, and original reviews. Target community members seeking recommendations.',
    color: 'from-teal-500 to-cyan-500',
    difficulty: 'beginner',
    timeToLaunch: '14 days',
    revenuePotential: '$300-5K/month',
    tags: ['affiliate', 'directory', 'resources', 'community']
  },

  // ECOMMERCE Templates
  {
    id: 'ecom-1',
    title: 'Print-on-Demand Store',
    description: 'Custom designs on products without inventory',
    icon: Palette,
    category: 'Physical Products',
    archetype: 'ecommerce',
    input: 'Create a print-on-demand store selling custom designed products (t-shirts, mugs, posters) for a specific niche like programmers, dog owners, or entrepreneurs. Use AI for design generation and target passionate hobbyists.',
    color: 'from-pink-500 to-rose-500',
    difficulty: 'beginner',
    timeToLaunch: '7 days',
    revenuePotential: '$500-10K/month',
    tags: ['ecommerce', 'print-on-demand', 'design', 'niche']
  },
  {
    id: 'ecom-2',
    title: 'Digital-Physical Hybrid',
    description: 'Digital course + physical toolkit bundle',
    icon: Box,
    category: 'Hybrid',
    archetype: 'ecommerce',
    input: 'Sell a hybrid product combining digital education with physical tools, like a cooking course with spice kit, or art class with supply box. Target learners who want complete experience. Higher margins than pure digital.',
    color: 'from-amber-500 to-orange-500',
    difficulty: 'intermediate',
    timeToLaunch: '45 days',
    revenuePotential: '$2K-20K/month',
    tags: ['ecommerce', 'hybrid', 'education', 'physical']
  },

  // HIGH-TICKET Templates
  {
    id: 'high-1',
    title: 'Executive Coaching Program',
    description: '1-on-1 coaching for business leaders',
    icon: Crown,
    category: 'Coaching',
    archetype: 'high_ticket',
    input: 'Offer premium 1-on-1 coaching for executives, founders, or high-performers in a specific domain like leadership, productivity, or business growth. Include assessments, weekly calls, and unlimited access. Target $200K+ earners.',
    color: 'from-amber-500 to-yellow-500',
    difficulty: 'advanced',
    timeToLaunch: '30 days',
    revenuePotential: '$10K-50K/month',
    tags: ['coaching', 'high-ticket', 'b2b', 'transformation']
  },
  {
    id: 'high-2',
    title: 'Mastermind Group',
    description: 'Exclusive peer group with monthly fee',
    icon: Users,
    category: 'Community',
    archetype: 'high_ticket',
    input: 'Create a high-ticket mastermind group for a specific industry or goal like SaaS founders, agency owners, or real estate investors. Include monthly calls, Slack community, and exclusive resources. Target committed professionals.',
    color: 'from-purple-600 to-indigo-600',
    difficulty: 'intermediate',
    timeToLaunch: '21 days',
    revenuePotential: '$5K-30K/month',
    tags: ['mastermind', 'community', 'high-ticket', 'peer-group']
  },

  // API SERVICE Templates
  {
    id: 'api-1',
    title: 'Data Validation API',
    description: 'Email, phone, and address validation service',
    icon: Database,
    category: 'Developer Tools',
    archetype: 'api_service',
    input: 'Build a developer API for validating email addresses, phone numbers, and physical addresses. Include real-time verification, bulk validation, and webhook notifications. Target SaaS companies and form builders.',
    color: 'from-cyan-500 to-blue-500',
    difficulty: 'advanced',
    timeToLaunch: '45 days',
    revenuePotential: '$5K-25K MRR',
    tags: ['api', 'validation', 'developer', 'saas']
  },
  {
    id: 'api-2',
    title: 'Image Processing API',
    description: 'Resize, optimize, and transform images at scale',
    icon: Image,
    category: 'Media Tools',
    archetype: 'api_service',
    input: 'Create an API for image processing including resizing, optimization, format conversion, and AI enhancement. Target e-commerce platforms, CMS systems, and apps with image-heavy content.',
    color: 'from-pink-400 to-rose-400',
    difficulty: 'advanced',
    timeToLaunch: '60 days',
    revenuePotential: '$3K-20K MRR',
    tags: ['api', 'images', 'processing', 'media']
  },
];

import { Mail, Image } from 'lucide-react';

interface ExpandedTemplateGalleryProps {
  onSelectTemplate: (template: Template) => void;
  onClose: () => void;
}

export function ExpandedTemplateGallery({ onSelectTemplate, onClose }: ExpandedTemplateGalleryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArchetype, setSelectedArchetype] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const filteredTemplates = useMemo(() => {
    return TEMPLATES.filter(template => {
      const matchesSearch = 
        template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesArchetype = selectedArchetype === 'all' || template.archetype === selectedArchetype;
      const matchesDifficulty = selectedDifficulty === 'all' || template.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesArchetype && matchesDifficulty;
    });
  }, [searchQuery, selectedArchetype, selectedDifficulty]);

  const archetypeCount = useMemo(() => {
    const counts: Record<string, number> = {};
    TEMPLATES.forEach(t => {
      counts[t.archetype] = (counts[t.archetype] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-y-auto">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Template Gallery</h1>
              <p className="text-sm text-muted-foreground">
                {TEMPLATES.length}+ proven business templates across 12 archetypes
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4 mb-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search templates by keyword, category, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Archetype Filter */}
          <div className="flex flex-wrap gap-2">
            {ARCHETYPES.map(archetype => {
              const Icon = archetype.icon;
              const count = archetype.id === 'all' 
                ? TEMPLATES.length 
                : archetypeCount[archetype.id] || 0;
              
              return (
                <button
                  key={archetype.id}
                  onClick={() => setSelectedArchetype(archetype.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                    selectedArchetype === archetype.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{archetype.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {count}
                  </Badge>
                </button>
              );
            })}
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Difficulty:</span>
            {['all', 'beginner', 'intermediate', 'advanced'].map(diff => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1 rounded-full text-xs transition-all ${
                  selectedDifficulty === diff
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {diff === 'all' ? 'All' : diff.charAt(0).toUpperCase() + diff.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {filteredTemplates.length} of {TEMPLATES.length} templates
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map(template => {
            const Icon = template.icon;
            const archetype = ARCHETYPES.find(a => a.id === template.archetype);
            
            return (
              <Card
                key={template.id}
                className="group cursor-pointer transition-all hover:shadow-lg hover:border-primary/50"
                onClick={() => onSelectTemplate(template)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className={`p-2.5 rounded-lg bg-gradient-to-br ${template.color}`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex gap-1">
                      <Badge variant="secondary" className="text-xs">
                        {template.timeToLaunch}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-lg mt-3 group-hover:text-primary transition-colors">
                    {template.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Archetype & Difficulty */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {archetype && (
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${archetype.color} text-white border-0`}
                        >
                          {archetype.name}
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {template.difficulty}
                      </Badge>
                    </div>

                    {/* Revenue Potential */}
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-muted-foreground">Potential:</span>
                      <span className="font-medium text-green-600">
                        {template.revenuePotential}
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {template.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <Lightbulb className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">No templates found</p>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export type { Template };
export { TEMPLATES, ARCHETYPES };
