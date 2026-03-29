'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, TrendingUp, Clock, Target, Sparkles, ArrowRight, Lightbulb, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FoundryAIOutput } from '@/types';
import { OutputDisplay } from './OutputDisplay';

interface Opportunity {
  id: string;
  title: string;
  market: string;
  niche: string;
  sub_niche: string;
  angle: string;
  problem: string;
  score: number;
  horizon: 'short' | 'mid' | 'long';
  validation_data: any;
  created_at: string;
}

interface OpportunityRadarProps {
  onSelect?: (opportunity: Opportunity, output: FoundryAIOutput) => void;
  limit?: number;
}

export function OpportunityRadar({ onSelect, limit = 5 }: OpportunityRadarProps) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedHorizon, setSelectedHorizon] = useState<'all' | 'short' | 'mid' | 'long'>('all');
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [generatedOutput, setGeneratedOutput] = useState<FoundryAIOutput | null>(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);

  useEffect(() => {
    fetchOpportunities();
  }, [selectedHorizon]);

  async function fetchOpportunities() {
    setLoading(true);
    setError(null);
    
    try {
      const horizonParam = selectedHorizon !== 'all' ? `&horizon=${selectedHorizon}` : '';
      const response = await fetch(`/api/radar/rankings?limit=${limit}${horizonParam}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch opportunities');
      }
      
      const result = await response.json();
      
      if (result.success) {
        setOpportunities(result.opportunities);
      } else {
        throw new Error(result.error || 'Unknown error');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load opportunities');
    } finally {
      setLoading(false);
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50';
    if (score >= 60) return 'text-amber-600 bg-amber-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getHorizonLabel = (horizon: string) => {
    const labels = {
      short: '1-2 months',
      mid: '3-6 months',
      long: '6+ months'
    };
    return labels[horizon as keyof typeof labels] || horizon;
  };

  const getHorizonColor = (horizon: string) => {
    const colors = {
      short: 'bg-emerald-100 text-emerald-700',
      mid: 'bg-amber-100 text-amber-700',
      long: 'bg-blue-100 text-blue-700'
    };
    return colors[horizon as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-6 w-48" />
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="opacity-60">
            <CardHeader>
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <p className="font-medium text-red-900">Failed to load opportunities</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchOpportunities}
                className="mt-3"
              >
                Try Again
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  async function generatePlan(opportunity: Opportunity) {
    console.log('=== GENERATE PLAN STARTED ===', opportunity.id);
    setGeneratingId(opportunity.id);
    setSelectedOpportunity(opportunity);
    setGenerationError(null);
    
    try {
      const validation = opportunity.validation_data || {};
      const scoreBreakdown = validation.score_breakdown || {};
      
      const enrichedPrompt = `Create a comprehensive, detailed business plan with EXTENSIVE information for: ${opportunity.title}

PROBLEM TO SOLVE:
${opportunity.problem}

UNIQUE ANGLE:
${opportunity.angle}

TARGET MARKET:
- Market: ${opportunity.market}
- Niche: ${opportunity.niche}
${opportunity.sub_niche ? `- Sub-niche: ${opportunity.sub_niche}` : ''}

VALIDATION DATA:
- Radar Score: ${opportunity.score}/100
- Market Horizon: ${opportunity.horizon}
${validation.upvotes ? `- Reddit Upvotes: ${validation.upvotes}` : ''}
${validation.comments ? `- Reddit Comments: ${validation.comments}` : ''}
${scoreBreakdown.engagement ? `- Engagement Score: ${scoreBreakdown.engagement}` : ''}
${scoreBreakdown.market_fit ? `- Market Fit Score: ${scoreBreakdown.market_fit}` : ''}

REQUIREMENTS - Create a VERY DETAILED, COMPREHENSIVE business blueprint with:

1. EXTENSIVE Market Research (300+ words):
   - Deep TAM/SAM/SOM analysis with calculations
   - 5-7 key market trends with explanations
   - Detailed competitor analysis (4-5 competitors with full SWOT)
   - Target demographics with personas
   - 6-8 specific user pain points
   - 5-6 market gaps with opportunity sizing

2. COMPREHENSIVE MVP Features (8-12 features):
   - Each feature with detailed description
   - Priority level and estimated development time
   - User benefit explanation

3. DETAILED Tech Stack (8-10 technologies):
   - Frontend, backend, database, AI, hosting, analytics, auth, payments
   - Specific purpose for each tool
   - Cost analysis (free vs paid)

4. STEP-BY-STEP Build Plan (6-8 phases):
   - Detailed tasks for each step
   - Time estimates in hours/days
   - Dependencies and prerequisites

5. EXTENSIVE Monetization Strategy:
   - Multiple revenue streams
   - 3-tier pricing model with justifications
   - Customer acquisition tactics (8-10 strategies)
   - 12-month revenue projections with milestones

Make every section thorough, actionable, and rich with specific details.`;

      console.log('Sending API request with prompt length:', enrichedPrompt.length);

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userInput: enrichedPrompt,
          provider: 'groq'
        }),
      });

      console.log('API response status:', response.status);
      const data = await response.json();
      console.log('API response data:', data);

      if (!response.ok) {
        throw new Error(data.error?.message || `API error: ${response.status}`);
      }

      if (!data.output) {
        throw new Error('No output in response');
      }

      console.log('Setting generated output');
      setGeneratedOutput(data.output);
      // Don't call onSelect - keep output displayed locally in Radar
    } catch (err) {
      console.error('=== GENERATION FAILED ===', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to generate plan';
      setGenerationError(errorMsg);
    } finally {
      setGeneratingId(null);
    }
  }

  const resetView = () => {
    setGeneratedOutput(null);
    setSelectedOpportunity(null);
    setGenerationError(null);
  };

  if (opportunities.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-6 pb-6 text-center">
          <Lightbulb className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="font-medium text-lg">No opportunities yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            The radar is scanning for new ideas. Check back soon!
          </p>
        </CardContent>
      </Card>
    );
  }

  // Show generated output view
  if (generatedOutput && selectedOpportunity) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={resetView}>
              ← Back to Opportunities
            </Button>
            <span className="text-sm text-slate-500">
              Generated plan for: <span className="font-medium text-slate-900">{selectedOpportunity.title}</span>
            </span>
          </div>
          <Badge className={getHorizonColor(selectedOpportunity.horizon)}>
            Score: {Math.round(selectedOpportunity.score)}/100
          </Badge>
        </div>
        
        {/* Simple Output Display */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-violet-50 to-indigo-50 border-b border-slate-200">
            <h3 className="font-bold text-xl text-slate-900">{generatedOutput.toolIdea}</h3>
            <p className="text-slate-600 mt-1">{generatedOutput.problemStatement}</p>
          </div>
          
          <div className="p-4 space-y-4">
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Target User</h4>
              <p className="text-slate-600">{generatedOutput.targetUser}</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Market Opportunity</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="text-lg font-bold text-violet-600">{generatedOutput.marketResearch?.tam || 'N/A'}</div>
                  <div className="text-xs text-slate-500">TAM</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="text-lg font-bold text-violet-600">{generatedOutput.marketResearch?.sam || 'N/A'}</div>
                  <div className="text-xs text-slate-500">SAM</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="text-lg font-bold text-violet-600">{generatedOutput.marketResearch?.som || 'N/A'}</div>
                  <div className="text-xs text-slate-500">SOM</div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">MVP Features</h4>
              <ul className="space-y-1">
                {generatedOutput.mvpFeatures?.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-600">
                    <span className="text-violet-500 mt-1">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Monetization</h4>
              <p className="text-slate-600">{generatedOutput.monetizationStrategy?.model}</p>
              <p className="text-slate-600 mt-1">{generatedOutput.monetizationStrategy?.pricing}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-lg text-slate-900">Trending Opportunities</h2>
            <p className="text-sm text-slate-500">
              AI-curated business ideas ranked by market potential
            </p>
          </div>
        </div>
        
        {/* Horizon Filter */}
        <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
          {(['all', 'short', 'mid', 'long'] as const).map((h) => (
            <button
              key={h}
              onClick={() => setSelectedHorizon(h)}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                selectedHorizon === h
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {h === 'all' ? 'All' : h.charAt(0).toUpperCase() + h.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Generation Error */}
      {generationError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-red-900">Generation Failed</p>
              <p className="text-sm text-red-700 mt-1">{generationError}</p>
            </div>
            <button 
              onClick={() => setGenerationError(null)}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Opportunity Cards */}
      <div className="grid gap-4">
        {opportunities.map((opp, index) => (
          <Card 
            key={opp.id} 
            className={cn(
              "group transition-all duration-300 hover:shadow-lg",
              index === 0 && "border-primary/50 shadow-md"
            )}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {index === 0 && (
                      <Badge variant="default" className="bg-primary/10 text-primary border-0">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Top Pick
                      </Badge>
                    )}
                    <Badge variant="secondary" className={getHorizonColor(opp.horizon)}>
                      <Clock className="w-3 h-3 mr-1" />
                      {getHorizonLabel(opp.horizon)}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight">
                    {opp.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <span className="font-medium text-foreground">{opp.market}</span>
                    <span>•</span>
                    <span>{opp.niche}</span>
                    {opp.sub_niche && opp.sub_niche !== opp.niche && (
                      <>
                        <span>•</span>
                        <span className="text-muted-foreground">{opp.sub_niche}</span>
                      </>
                    )}
                  </CardDescription>
                </div>
                
                {/* Score Badge */}
                <div className={cn(
                  "flex flex-col items-center justify-center w-16 h-16 rounded-xl",
                  getScoreColor(opp.score)
                )}>
                  <span className="text-2xl font-bold">{Math.round(opp.score)}</span>
                  <span className="text-[10px] uppercase tracking-wider font-medium">Score</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pb-3">
              <div className="space-y-3">
                {/* Problem */}
                <div>
                  <p className="text-sm font-medium text-foreground flex items-center gap-1.5 mb-1">
                    <Target className="w-4 h-4 text-red-500" />
                    Problem
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {opp.problem}
                  </p>
                </div>
                
                {/* Angle */}
                <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                  <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">
                    <span className="font-medium">Angle:</span>{' '}
                    <span className="text-muted-foreground">{opp.angle}</span>
                  </p>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="pt-0">
              <Button 
                onClick={() => generatePlan(opp)}
                disabled={generatingId === opp.id}
                className="w-full group/btn"
              >
                {generatingId === opp.id ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Plan...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Plan
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Footer Info */}
      <p className="text-xs text-slate-400 text-center">
        Opportunities are continuously analyzed and ranked by market potential and viability.
        {' '}<button 
          onClick={fetchOpportunities}
          className="underline hover:text-slate-600"
        >
          Refresh Data
        </button>
      </p>
    </div>
  );
}

export type { Opportunity };
