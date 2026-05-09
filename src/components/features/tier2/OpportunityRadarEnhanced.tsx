'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Radar, 
  TrendingUp, 
  Zap,
  Target,
  Filter,
  Search,
  ArrowRight,
  Sparkles,
  Globe,
  BarChart3,
  Lightbulb,
  Rocket,
  Clock,
  DollarSign,
  Users,
  CheckCircle2
} from 'lucide-react';

interface Opportunity {
  id: string;
  title: string;
  description: string;
  score: number;
  difficulty: 'easy' | 'medium' | 'hard';
  timeToFirstRevenue: string;
  archetype: string;
  category: string;
  marketSize: string;
  competition: 'low' | 'medium' | 'high';
  skills: string[];
  investment: string;
  trending: boolean;
  sources: string[];
}

export default function OpportunityRadarEnhanced() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    difficulty: 'all',
    timeToRevenue: 'all',
    investment: 'all',
  });
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);

  useEffect(() => {
    loadOpportunities();
  }, []);

  const loadOpportunities = async () => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockOpportunities: Opportunity[] = [
        {
          id: '1',
          title: 'AI Content Agency for E-commerce',
          description: 'Provide AI-powered product descriptions, blog posts, and marketing copy for Shopify stores. High demand, recurring revenue model.',
          score: 92,
          difficulty: 'medium',
          timeToFirstRevenue: '7-14 days',
          archetype: 'AI Agency',
          category: 'Services',
          marketSize: '$2.3B',
          competition: 'medium',
          skills: ['Prompt Engineering', 'Copywriting', 'Client Management'],
          investment: '$0-100',
          trending: true,
          sources: ['Google Trends', 'Reddit r/ecommerce', 'Shopify App Store'],
        },
        {
          id: '2',
          title: 'Faceless YouTube Automation',
          description: 'Create automated faceless YouTube channels using AI voice, script generation, and video editing. Multiple niches available.',
          score: 88,
          difficulty: 'easy',
          timeToFirstRevenue: '30-60 days',
          archetype: 'Content Creator',
          category: 'Media',
          marketSize: '$15B',
          competition: 'high',
          skills: ['Video Editing', 'Script Writing', 'SEO'],
          investment: '$0-500',
          trending: true,
          sources: ['YouTube Analytics', 'VidIQ Trends', 'Tubefilter'],
        },
        {
          id: '3',
          title: 'Micro-SaaS for Freelancers',
          description: 'Build a simple tool that solves a specific pain point for freelancers (invoicing, time tracking, client management).',
          score: 85,
          difficulty: 'hard',
          timeToFirstRevenue: '30-90 days',
          archetype: 'SaaS',
          category: 'Software',
          marketSize: '$450B',
          competition: 'medium',
          skills: ['Full-Stack Development', 'Product Design', 'Marketing'],
          investment: '$0-1000',
          trending: false,
          sources: ['GitHub Trends', 'Product Hunt', 'IndieHackers'],
        },
        {
          id: '4',
          title: 'AI Automation Templates',
          description: 'Create and sell pre-built Make/Zapier automation templates for common business workflows.',
          score: 82,
          difficulty: 'easy',
          timeToFirstRevenue: '7-14 days',
          archetype: 'Digital Products',
          category: 'Products',
          marketSize: '$1.2B',
          competition: 'low',
          skills: ['Automation Tools', 'Process Mapping', 'Documentation'],
          investment: '$0',
          trending: true,
          sources: ['Gumroad', 'Make Community', 'Zapier Marketplace'],
        },
        {
          id: '5',
          title: 'Niche Newsletter Business',
          description: 'Build a focused newsletter in an underserved niche. Monetize through sponsorships and premium subscriptions.',
          score: 79,
          difficulty: 'medium',
          timeToFirstRevenue: '60-90 days',
          archetype: 'Content Creator',
          category: 'Media',
          marketSize: '$5B',
          competition: 'low',
          skills: ['Writing', 'Community Building', 'Email Marketing'],
          investment: '$0-200',
          trending: false,
          sources: ['Substack Rankings', 'Sparktoro', 'Twitter Trends'],
        },
        {
          id: '6',
          title: 'AI-Powered Chrome Extensions',
          description: 'Build browser extensions that use AI APIs to enhance productivity (writing assistant, summarizer, etc.).',
          score: 87,
          difficulty: 'medium',
          timeToFirstRevenue: '21-45 days',
          archetype: 'API/Micro-SaaS',
          category: 'Software',
          marketSize: '$800M',
          competition: 'medium',
          skills: ['JavaScript', 'AI Integration', 'UX Design'],
          investment: '$0-300',
          trending: true,
          sources: ['Chrome Web Store', 'GitHub', 'Twitter Developer Community'],
        },
      ];
      
      setOpportunities(mockOpportunities);
    } catch (error) {
      console.error('Error loading opportunities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOpportunities = opportunities.filter(opp => {
    if (searchQuery && !opp.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedFilters.difficulty !== 'all' && opp.difficulty !== selectedFilters.difficulty) return false;
    return true;
  });

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-500';
    if (score >= 80) return 'bg-blue-500';
    if (score >= 70) return 'bg-amber-500';
    return 'bg-slate-400';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      easy: 'bg-emerald-100 text-emerald-700',
      medium: 'bg-amber-100 text-amber-700',
      hard: 'bg-rose-100 text-rose-700',
    };
    return colors[difficulty] || 'bg-slate-100 text-slate-700';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
          <Radar className="w-8 h-8 text-violet-600" />
          Opportunity Radar
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          AI-powered market intelligence scanning 12 business archetypes for validated opportunities.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-violet-600" />
              <span className="text-sm text-slate-600">Opportunities</span>
            </div>
            <div className="text-2xl font-bold">{opportunities.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span className="text-sm text-slate-600">Avg Score</span>
            </div>
            <div className="text-2xl font-bold">
              {Math.round(opportunities.reduce((acc, o) => acc + o.score, 0) / opportunities.length)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="text-sm text-slate-600">Trending</span>
            </div>
            <div className="text-2xl font-bold">
              {opportunities.filter(o => o.trending).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-slate-600">Sources</span>
            </div>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            placeholder="Search opportunities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button>
            <Sparkles className="w-4 h-4 mr-2" />
            AI Match
          </Button>
        </div>
      </div>

      {/* Opportunities Grid */}
      {!selectedOpportunity ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredOpportunities.map((opp) => (
            <Card 
              key={opp.id}
              className="cursor-pointer hover:shadow-lg transition-all"
              onClick={() => setSelectedOpportunity(opp)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={`px-2 py-1 rounded text-sm font-medium ${getDifficultyColor(opp.difficulty)}`}>
                    {opp.difficulty}
                  </div>
                  {opp.trending && (
                    <Badge className="bg-amber-100 text-amber-800">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                </div>
                <div className="mt-2">
                  <div className="text-lg font-semibold leading-tight">{opp.title}</div>
                  <div className="text-sm text-slate-600">{opp.archetype}</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-slate-600 line-clamp-2">{opp.description}</p>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-slate-400" />
                    {opp.timeToFirstRevenue}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-slate-400" />
                    {opp.investment}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${getScoreColor(opp.score)}`}>
                      {opp.score}
                    </div>
                    <span className="text-sm text-slate-600">Opportunity Score</span>
                  </div>
                  <Button size="sm" variant="ghost">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-2 border-violet-200">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getDifficultyColor(selectedOpportunity.difficulty)}>
                    {selectedOpportunity.difficulty}
                  </Badge>
                  <Badge variant="outline">{selectedOpportunity.archetype}</Badge>
                </div>
                <CardTitle className="text-2xl">{selectedOpportunity.title}</CardTitle>
                <CardDescription className="mt-2">{selectedOpportunity.description}</CardDescription>
              </div>
              <div className="text-right">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold ${getScoreColor(selectedOpportunity.score)}`}>
                  {selectedOpportunity.score}
                </div>
                <div className="text-sm text-slate-600 mt-1">Score</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="text-sm text-slate-600 mb-1">Market Size</div>
                <div className="text-xl font-bold">{selectedOpportunity.marketSize}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="text-sm text-slate-600 mb-1">Time to Revenue</div>
                <div className="text-xl font-bold">{selectedOpportunity.timeToFirstRevenue}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="text-sm text-slate-600 mb-1">Investment</div>
                <div className="text-xl font-bold">{selectedOpportunity.investment}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="text-sm text-slate-600 mb-1">Competition</div>
                <div className="text-xl font-bold capitalize">{selectedOpportunity.competition}</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {selectedOpportunity.skills.map((skill) => (
                  <Badge key={skill} variant="outline" className="px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Data Sources</h3>
              <div className="flex flex-wrap gap-2">
                {selectedOpportunity.sources.map((source) => (
                  <div key={source} className="flex items-center gap-1 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    {source}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button className="flex-1" size="lg">
                <Rocket className="w-5 h-5 mr-2" />
                Start This Opportunity
              </Button>
              <Button variant="outline" size="lg" onClick={() => setSelectedOpportunity(null)}>
                Back to List
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
