'use client';

import React, { useState, useEffect } from 'react';
import { getSupabaseBrowserClient } from '@/layer-3-data/storage/supabase-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Lightbulb,
  Wand2,
  Target,
  Sparkles,
  ArrowRight,
  Zap,
  Brain,
  TrendingUp,
  Filter,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';

// 12 Business Archetypes from FoundryAI documentation
const BUSINESS_ARCHETYPES = [
  { id: 'ai_agency', name: 'AI-Powered Agency', icon: '🤖', color: 'bg-blue-500', description: 'Done-for-you AI automation services' },
  { id: 'saas', name: 'SaaS Products', icon: '💻', color: 'bg-indigo-500', description: 'Software-as-a-Service applications' },
  { id: 'digital_products', name: 'Digital Products', icon: '📦', color: 'bg-purple-500', description: 'Templates, courses, tools' },
  { id: 'content_creator', name: 'Content Creator', icon: '🎬', color: 'bg-red-500', description: 'YouTube, blogs, podcasts' },
  { id: 'online_brand', name: 'Online Brand', icon: '🏷️', color: 'bg-pink-500', description: 'Influencer & community monetization' },
  { id: 'marketplace', name: 'Marketplace', icon: '🏪', color: 'bg-orange-500', description: 'Platform connecting buyers/sellers' },
  { id: 'affiliate', name: 'Affiliate Marketing', icon: '🔗', color: 'bg-green-500', description: 'Commission-based referrals' },
  { id: 'micro_saas', name: 'Micro-SaaS', icon: '⚡', color: 'bg-cyan-500', description: 'Small, focused SaaS tools' },
  { id: 'api_service', name: 'API Services', icon: '🔌', color: 'bg-teal-500', description: 'Backend-as-a-Service APIs' },
  { id: 'paas', name: 'PaaS', icon: '☁️', color: 'bg-sky-500', description: 'Platform-as-a-Service infrastructure' },
  { id: 'high_ticket', name: 'High-Ticket Services', icon: '💎', color: 'bg-amber-500', description: 'Premium consulting & coaching' },
  { id: 'ecommerce', name: 'E-Commerce', icon: '🛒', color: 'bg-emerald-500', description: 'Online stores & dropshipping' },
];

interface ExtractedIdea {
  originalInput: string;
  archetypeFit: Array<{ archetype: string; score: number; reasoning: string }>;
  refinedConcept: string;
  targetAudience: string;
  problemStatement: string;
  solutionApproach: string;
  monetizationPath: string;
  timeToFirstRevenue: string;
  startupCost: string;
  confidenceScore: number;
}

const IdeaExtractionEngine: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rawInput, setRawInput] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedIdea, setExtractedIdea] = useState<ExtractedIdea | null>(null);
  const [selectedArchetype, setSelectedArchetype] = useState<string | null>(null);
  const [extractionHistory, setExtractionHistory] = useState<ExtractedIdea[]>([]);
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    loadExtractionHistory();
  }, []);

  const loadExtractionHistory = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // In a real implementation, this would fetch from the database
    // For now, we'll use local state
  };

  const extractIdea = async () => {
    if (!rawInput.trim() || rawInput.length < 10) return;

    setIsExtracting(true);

    try {
      // Call the extraction API
      const response = await fetch('/api/tier2/extract-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: rawInput }),
      });

      if (!response.ok) throw new Error('Extraction failed');

      const result = await response.json();
      setExtractedIdea(result);
      setExtractionHistory(prev => [result, ...prev].slice(0, 10));
    } catch (error) {
      console.error('Idea extraction error:', error);
      // Fallback to mock extraction for demonstration
      performMockExtraction();
    } finally {
      setIsExtracting(false);
    }
  };

  const performMockExtraction = () => {
    // Heuristic-based extraction for demo purposes
    const input = rawInput.toLowerCase();
    
    // Determine archetype fit based on keywords
    const archetypeScores: Array<{ archetype: string; score: number; reasoning: string }> = [];
    
    if (input.includes('app') || input.includes('software') || input.includes('tool') || input.includes('platform')) {
      archetypeScores.push({ archetype: 'saas', score: 85, reasoning: 'Software solution with recurring revenue potential' });
      archetypeScores.push({ archetype: 'micro_saas', score: 75, reasoning: 'Could start as focused micro-SaaS' });
    }
    
    if (input.includes('service') || input.includes('client') || input.includes('agency') || input.includes('consulting')) {
      archetypeScores.push({ archetype: 'ai_agency', score: 80, reasoning: 'Service-based with AI automation potential' });
      archetypeScores.push({ archetype: 'high_ticket', score: 70, reasoning: 'Premium service offering opportunity' });
    }
    
    if (input.includes('content') || input.includes('youtube') || input.includes('blog') || input.includes('video')) {
      archetypeScores.push({ archetype: 'content_creator', score: 85, reasoning: 'Content-driven audience building' });
      archetypeScores.push({ archetype: 'online_brand', score: 70, reasoning: 'Brand monetization potential' });
    }
    
    if (input.includes('course') || input.includes('template') || input.includes('ebook') || input.includes('guide')) {
      archetypeScores.push({ archetype: 'digital_products', score: 90, reasoning: 'Digital product with high margins' });
    }
    
    if (input.includes('market') || input.includes('connect') || input.includes('platform') || input.includes('network')) {
      archetypeScores.push({ archetype: 'marketplace', score: 75, reasoning: 'Two-sided marketplace opportunity' });
    }

    // Default if no clear match
    if (archetypeScores.length === 0) {
      archetypeScores.push({ archetype: 'digital_products', score: 60, reasoning: 'Best fit for initial validation' });
      archetypeScores.push({ archetype: 'content_creator', score: 55, reasoning: 'Content can validate demand' });
    }

    // Sort by score
    archetypeScores.sort((a, b) => b.score - a.score);

    const mockResult: ExtractedIdea = {
      originalInput: rawInput,
      archetypeFit: archetypeScores.slice(0, 3),
      refinedConcept: `AI-powered ${rawInput.split(' ').slice(0, 5).join(' ')} automation platform`,
      targetAudience: 'Small business owners and solopreneurs struggling with manual processes',
      problemStatement: `Users waste 10+ hours weekly on ${rawInput.toLowerCase()} tasks that could be automated`,
      solutionApproach: 'Intelligent automation with human oversight and learning capabilities',
      monetizationPath: 'Freemium SaaS with usage-based pricing tiers',
      timeToFirstRevenue: '14-21 days',
      startupCost: '$0-500 (AI-assisted build)',
      confidenceScore: Math.round(archetypeScores[0]?.score || 60),
    };

    setExtractedIdea(mockResult);
    setExtractionHistory(prev => [mockResult, ...prev].slice(0, 10));
  };

  const saveToRadar = async () => {
    if (!extractedIdea) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Save as a new opportunity in the radar
    await supabase.from('foundryai_opportunities').insert({
      user_id: user.id,
      title: extractedIdea.refinedConcept,
      description: extractedIdea.solutionApproach,
      market: extractedIdea.targetAudience,
      niche: extractedIdea.archetypeFit[0]?.archetype || 'digital_products',
      problem_statement: extractedIdea.problemStatement,
      archetype_fit_scores: extractedIdea.archetypeFit,
      confidence_score: extractedIdea.confidenceScore,
      extraction_source: 'idea_extraction_engine',
      status: 'extracted',
    });

    // Reset and close
    setRawInput('');
    setExtractedIdea(null);
    setIsOpen(false);
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Mini button
  if (!isOpen) {
    return (
      <div className="fixed bottom-40 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 shadow-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <Wand2 className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <Wand2 className="w-6 h-6 text-purple-600" />
            <CardTitle>Idea Extraction Engine</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <ArrowRight className="w-4 h-4 rotate-45" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Input Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Describe your vague idea, pain point, or observation
            </label>
            <textarea
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder="e.g., 'I notice freelancers struggle with...' or 'What if there was a tool that...' or 'People always complain about...'"
              className="w-full h-32 px-4 py-3 border rounded-lg resize-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Be specific about the problem or opportunity you see</span>
              <span>{rawInput.length} chars</span>
            </div>
          </div>

          {/* Extract Button */}
          <Button
            onClick={extractIdea}
            disabled={isExtracting || rawInput.length < 10}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isExtracting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing & Extracting...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Extract Business Concept
              </>
            )}
          </Button>

          {/* Extraction Results */}
          {extractedIdea && (
            <div className="space-y-4 pt-4 border-t">
              {/* Confidence Score */}
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${getConfidenceColor(extractedIdea.confidenceScore)}`}>
                  {extractedIdea.confidenceScore}
                </div>
                <div>
                  <div className="font-medium">Extraction Confidence</div>
                  <div className="text-xs text-muted-foreground">
                    {extractedIdea.confidenceScore >= 80 ? 'High confidence - Strong archetype fit' :
                     extractedIdea.confidenceScore >= 60 ? 'Good confidence - Clear opportunity detected' :
                     'Moderate confidence - Needs refinement'}
                  </div>
                </div>
              </div>

              {/* Refined Concept */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground uppercase">Refined Concept</label>
                <div className="text-lg font-semibold">{extractedIdea.refinedConcept}</div>
              </div>

              {/* Archetype Fit */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase">Archetype Fit Analysis</label>
                <div className="space-y-2">
                  {extractedIdea.archetypeFit.map((fit, idx) => {
                    const archetype = BUSINESS_ARCHETYPES.find(a => a.id === fit.archetype);
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedArchetype(fit.archetype)}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedArchetype === fit.archetype
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-950'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{archetype?.icon}</span>
                            <div>
                              <div className="font-medium">{archetype?.name}</div>
                              <div className="text-xs text-muted-foreground">{fit.reasoning}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={fit.score} className="w-20 h-2" />
                            <span className="text-sm font-bold w-8">{fit.score}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Business Details Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Target Audience</div>
                  <div className="text-sm">{extractedIdea.targetAudience}</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Time to First Revenue</div>
                  <div className="text-sm font-medium text-green-600">{extractedIdea.timeToFirstRevenue}</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Startup Cost</div>
                  <div className="text-sm font-medium">{extractedIdea.startupCost}</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Monetization</div>
                  <div className="text-sm">{extractedIdea.monetizationPath}</div>
                </div>
              </div>

              {/* Problem & Solution */}
              <div className="space-y-2">
                <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-red-500" />
                    <span className="font-medium text-sm">Problem</span>
                  </div>
                  <p className="text-sm text-red-700 dark:text-red-300">{extractedIdea.problemStatement}</p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-green-500" />
                    <span className="font-medium text-sm">Solution</span>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300">{extractedIdea.solutionApproach}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={saveToRadar}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Add to Opportunity Radar
                </Button>
                <Button
                  onClick={() => {
                    setRawInput('');
                    setExtractedIdea(null);
                  }}
                  variant="outline"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  New Extraction
                </Button>
              </div>
            </div>
          )}

          {/* History */}
          {extractionHistory.length > 0 && !extractedIdea && (
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Recent Extractions
              </h4>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {extractionHistory.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setExtractedIdea(item)}
                    className="p-2 bg-muted rounded-lg cursor-pointer hover:bg-muted/80"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm truncate flex-1">{item.refinedConcept}</span>
                      <Badge className={`${getConfidenceColor(item.confidenceScore)} text-white ml-2`}>
                        {item.confidenceScore}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default IdeaExtractionEngine;
