'use client';

import * as React from 'react';
import { Search, Filter, Download, Upload, Eye, EyeOff, Star, Clock, TrendingUp, Users, DollarSign, Code, Zap, Globe, Lock, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui';
import { Card } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Input } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui';
import { Separator } from '@/components/ui';
import { ScrollArea } from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import type { TemplateGalleryIntegration } from './types';

interface Template {
  id: string;
  name: string;
  description: string;
  category: 'business-plan' | 'landing-page' | 'saas' | 'ecommerce' | 'content' | 'automation' | 'marketing' | 'technical';
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimatedTime: string;
  price: string;
  rating: number;
  downloads: number;
  createdAt: Date;
  updatedAt: Date;
  author: string;
  isPremium: boolean;
  isPublic: boolean;
  preview?: string;
  components: string[];
  features: string[];
  requirements: string[];
}

interface TemplateGalleryProps {
  integration: TemplateGalleryIntegration;
  onTemplateSelect?: (template: Template) => void;
  onTemplateUse?: (templateId: string) => void;
  onTemplateDownload?: (templateId: string) => void;
  onTemplateFavorite?: (templateId: string) => void;
  className?: string;
}

export function TemplateGallery({ 
  integration, 
  onTemplateSelect, 
  onTemplateUse, 
  onTemplateDownload, 
  onTemplateFavorite, 
  className 
}: TemplateGalleryProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = React.useState<string>('all');
  const [sortBy, setSortBy] = React.useState<'newest' | 'popular' | 'rating' | 'downloads'>('newest');
  const [favorites, setFavorites] = React.useState<string[]>([]);
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

  // Mock templates data
  const [templates, setTemplates] = React.useState<Template[]>([
    {
      id: '1',
      name: 'AI-Powered SaaS Business Plan',
      description: 'Complete business plan template for AI-powered SaaS companies with market analysis, competitive landscape, and financial projections.',
      category: 'business-plan',
      tags: ['SaaS', 'AI', 'Business Plan', 'Market Analysis'],
      difficulty: 'intermediate',
      estimatedTime: '2-3 weeks',
      price: 'Free',
      rating: 4.8,
      downloads: 1250,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-03-10'),
      author: 'FoundryAI Team',
      isPremium: false,
      isPublic: true,
      components: ['Executive Summary', 'Market Analysis', 'Financial Projections', 'Implementation Timeline'],
      features: ['AI-powered insights', 'Real-time market data', 'Competitive analysis', 'Financial modeling'],
      requirements: ['Basic business knowledge', 'Market research access']
    },
    {
      id: '2',
      name: 'E-commerce Store Launch Kit',
      description: 'Complete e-commerce business template including product sourcing, marketing strategy, and operational setup.',
      category: 'ecommerce',
      tags: ['E-commerce', 'Store', 'Marketing', 'Operations'],
      difficulty: 'beginner',
      estimatedTime: '1-2 weeks',
      price: 'Free',
      rating: 4.6,
      downloads: 890,
      createdAt: new Date('2024-02-20'),
      updatedAt: new Date('2024-04-05'),
      author: 'FoundryAI Team',
      isPremium: false,
      isPublic: true,
      components: ['Product Strategy', 'Marketing Plan', 'Operations Guide', 'Financial Setup'],
      features: ['Product sourcing guide', 'Marketing templates', 'Operations checklist', 'Financial projections'],
      requirements: ['Basic e-commerce knowledge', 'Product idea']
    },
    {
      id: '3',
      name: 'Digital Agency Business Model',
      description: 'Comprehensive template for digital marketing agencies including service offerings, pricing, and client acquisition.',
      category: 'business-plan',
      tags: ['Agency', 'Digital Marketing', 'Services', 'Pricing'],
      difficulty: 'intermediate',
      estimatedTime: '2-4 weeks',
      price: 'Premium',
      rating: 4.9,
      downloads: 2100,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-03-15'),
      author: 'Expert Templates',
      isPremium: true,
      isPublic: true,
      components: ['Service Catalog', 'Pricing Strategy', 'Client Acquisition', 'Operations Manual'],
      features: ['Service packages', 'Pricing calculator', 'Lead generation templates', 'Client onboarding'],
      requirements: ['Agency experience', 'Marketing knowledge']
    },
    {
      id: '4',
      name: 'Content Creation Automation',
      description: 'Automated content creation system for blogs, social media, and marketing materials.',
      category: 'automation',
      tags: ['Content', 'Automation', 'Marketing', 'AI'],
      difficulty: 'advanced',
      estimatedTime: '3-5 weeks',
      price: 'Premium',
      rating: 4.7,
      downloads: 1560,
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-04-20'),
      author: 'Automation Pro',
      isPremium: true,
      isPublic: true,
      components: ['Content Calendar', 'Automation Workflows', 'Analytics Dashboard', 'Template Library'],
      features: ['AI-powered content generation', 'Automated scheduling', 'Performance tracking', 'Multi-platform support'],
      requirements: ['Technical knowledge', 'Content marketing experience']
    },
    {
      id: '5',
      name: 'Landing Page Conversion Kit',
      description: 'High-converting landing page templates with A/B testing and optimization strategies.',
      category: 'landing-page',
      tags: ['Landing Page', 'Conversion', 'A/B Testing', 'Optimization'],
      difficulty: 'beginner',
      estimatedTime: '1 week',
      price: 'Free',
      rating: 4.5,
      downloads: 3200,
      createdAt: new Date('2024-02-15'),
      updatedAt: new Date('2024-03-25'),
      author: 'FoundryAI Team',
      isPremium: false,
      isPublic: true,
      components: ['Landing Page', 'Optimization Guide', 'A/B Testing Setup', 'Analytics Integration'],
      features: ['Conversion-focused design', 'A/B testing templates', 'Analytics integration', 'Mobile optimization'],
      requirements: ['Basic web knowledge', 'Marketing understanding']
    }
  ]);

  const categories = [
    { value: 'all', label: 'All Categories', icon: Globe },
    { value: 'business-plan', label: 'Business Plans', icon: DollarSign },
    { value: 'landing-page', label: 'Landing Pages', icon: Code },
    { value: 'saas', label: 'SaaS', icon: Zap },
    { value: 'ecommerce', label: 'E-commerce', icon: Users },
    { value: 'content', label: 'Content', icon: Eye },
    { value: 'automation', label: 'Automation', icon: TrendingUp },
    { value: 'marketing', label: 'Marketing', icon: TrendingUp },
    { value: 'technical', label: 'Technical', icon: Code }
  ];

  const difficulties = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' }
  ];

  const filteredTemplates = React.useMemo(() => {
    let filtered = templates;

    // Filter by search
    if (searchTerm) {
      filtered = filtered.filter(template => 
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(template => template.difficulty === selectedDifficulty);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'popular':
          return b.downloads - a.downloads;
        case 'rating':
          return b.rating - a.rating;
        case 'downloads':
          return b.downloads - a.downloads;
        default:
          return 0;
      }
    });

    return filtered;
  }, [templates, searchTerm, selectedCategory, selectedDifficulty, sortBy]);

  const handleTemplateSelect = (template: Template) => {
    onTemplateSelect?.(template);
  };

  const handleTemplateUse = (templateId: string) => {
    onTemplateUse?.(templateId);
  };

  const handleTemplateDownload = (templateId: string) => {
    onTemplateDownload?.(templateId);
  };

  const handleToggleFavorite = (templateId: string) => {
    setFavorites(prev => 
      prev.includes(templateId) 
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
    onTemplateFavorite?.(templateId);
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(c => c.value === category);
    return categoryData?.icon || Globe;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100 dark:bg-green-900';
      case 'intermediate': return 'text-blue-600 bg-blue-100 dark:bg-blue-900';
      case 'advanced': return 'text-orange-600 bg-orange-100 dark:bg-orange-900';
      case 'expert': return 'text-red-600 bg-red-100 dark:bg-red-900';
      default: return 'text-slate-600 bg-slate-100 dark:bg-slate-900';
    }
  };

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Template Gallery</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {integration.connected ? (
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Connected • {integration.templateCount} templates
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <X className="h-4 w-4 text-red-500" />
                Disconnected
              </span>
            )}
          </div>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Upload Template
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Search & Filter</h3>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value)}>
                  <SelectTrigger>
                    {categories.find(c => c.value === selectedCategory)?.label || 'All Categories'}
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center gap-2">
                          {React.createElement(category.icon, { className: "h-4 w-4" })}
                          {category.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select value={selectedDifficulty} onValueChange={(value) => setSelectedDifficulty(value)}>
                  <SelectTrigger>
                    {difficulties.find(d => d.value === selectedDifficulty)?.label || 'All Levels'}
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map((difficulty) => (
                      <SelectItem key={difficulty.value} value={difficulty.value}>
                        {difficulty.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">Sort by:</span>
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                  <SelectTrigger>
                    {sortBy === 'newest' ? 'Newest' : sortBy === 'popular' ? 'Most Popular' : sortBy === 'rating' ? 'Highest Rated' : 'Most Downloaded'}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="downloads">Most Downloaded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  Grid View
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  List View
                </Button>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Template Grid/List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {filteredTemplates.map((template) => (
          <Card 
            key={template.id} 
            className="cursor-pointer transition-all hover:shadow-lg"
            onClick={() => handleTemplateSelect(template)}
          >
            <Card.Header className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{template.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{template.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  {template.isPremium && (
                    <Badge variant="default" className="text-xs">
                      <Lock className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(template.id);
                    }}
                  >
                    <Star className={`h-4 w-4 ${favorites.includes(template.id) ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                  </Button>
                </div>
              </div>
            </Card.Header>
            
            <Card.Content>
              <div className="space-y-3">
                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {template.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Rating:</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium text-slate-900 dark:text-white ml-1">{template.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Downloads:</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">{template.downloads.toLocaleString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Time:</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">{template.estimatedTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Level:</span>
                    <Badge className={`text-xs ${getDifficultyColor(template.difficulty)}`}>
                      {template.difficulty}
                    </Badge>
                  </div>
                </div>
              </div>

                {/* Features */}
                <div>
                  <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">Features</h4>
                  <div className="space-y-1">
                    {template.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-slate-600 dark:text-slate-400">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400">by {template.author}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(template.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTemplateDownload(template.id);
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTemplateUse(template.id);
                    }}
                  >
                    Use Template
                  </Button>
                </div>
              </div>
            </Card.Footer>
          </Card>
        ))}
      </div>
    </div>
  );
}
