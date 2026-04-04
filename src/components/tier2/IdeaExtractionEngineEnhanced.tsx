'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  Lightbulb, 
  Sparkles, 
  ArrowRight,
  Target,
  Zap,
  Brain,
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExtractedIdea {
  id: string;
  originalIdea: string;
  refinedConcept: string;
  archetype: string;
  archetypeFitScore: number;
  marketPotential: 'low' | 'medium' | 'high' | 'excellent';
  timeToMvp: string;
  estimatedRevenue: string;
  requiredSkills: string[];
  nextSteps: string[];
  confidenceScore: number;
}

export default function IdeaExtractionEngineEnhanced() {
  const [vagueIdea, setVagueIdea] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedIdeas, setExtractedIdeas] = useState<ExtractedIdea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<ExtractedIdea | null>(null);
  const [extractionStep, setExtractionStep] = useState(0);

  const extractIdeas = async () => {
    if (!vagueIdea.trim()) return;
    
    setIsExtracting(true);
    setExtractionStep(1);
    
    // Simulate AI extraction process
    await new Promise(resolve => setTimeout(resolve, 1500));
    setExtractionStep(2);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setExtractionStep(3);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockIdeas: ExtractedIdea[] = [
      {
        id: '1',
        originalIdea: vagueIdea,
        refinedConcept: 'AI-powered content generation platform for small business marketing',
        archetype: 'AI Agency',
        archetypeFitScore: 92,
        marketPotential: 'excellent',
        timeToMvp: '2-3 weeks',
        estimatedRevenue: '$5K-15K/month',
        requiredSkills: ['AI Prompt Engineering', 'Marketing', 'Sales'],
        nextSteps: [
          'Validate demand with 5 potential customers',
          'Create sample AI-generated content portfolio',
          'Set up simple landing page',
          'Price service packages'
        ],
        confidenceScore: 88,
      },
      {
        id: '2',
        originalIdea: vagueIdea,
        refinedConcept: 'SaaS tool for automating social media content creation and scheduling',
        archetype: 'Micro-SaaS',
        archetypeFitScore: 85,
        marketPotential: 'high',
        timeToMvp: '4-6 weeks',
        estimatedRevenue: '$2K-8K MRR',
        requiredSkills: ['Full-Stack Development', 'API Integration', 'UX Design'],
        nextSteps: [
          'Define core features (content gen + scheduler)',
          'Build MVP with 1 social platform integration',
          'Beta test with 10 users',
          'Launch on Product Hunt'
        ],
        confidenceScore: 82,
      },
      {
        id: '3',
        originalIdea: vagueIdea,
        refinedConcept: 'Educational YouTube channel + digital course on AI business applications',
        archetype: 'Content Creator',
        archetypeFitScore: 78,
        marketPotential: 'high',
        timeToMvp: '6-8 weeks',
        estimatedRevenue: '$1K-5K/month',
        requiredSkills: ['Video Production', 'Teaching', 'Content Strategy'],
        nextSteps: [
          'Plan 10-video content series',
          'Create channel branding',
          'Record first 3 videos',
          'Build email list'
        ],
        confidenceScore: 75,
      },
    ];
    
    setExtractedIdeas(mockIdeas);
    setIsExtracting(false);
    setExtractionStep(0);
  };

  const getPotentialColor = (potential: string) => {
    const colors: Record<string, string> = {
      low: 'bg-slate-100 text-slate-700',
      medium: 'bg-amber-100 text-amber-700',
      high: 'bg-blue-100 text-blue-700',
      excellent: 'bg-emerald-100 text-emerald-700',
    };
    return colors[potential] || 'bg-slate-100';
  };

  const reset = () => {
    setVagueIdea('');
    setExtractedIdeas([]);
    setSelectedIdea(null);
  };

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
          <Lightbulb className="w-8 h-8 text-violet-600" />
          Idea Extraction Engine
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Transform vague ideas into concrete, validated business opportunities. AI analyzes your concept and matches it to optimal archetypes.
        </p>
      </div>

      {/* Input Section */}
      {extractedIdeas.length === 0 && !isExtracting && (
        <Card className="border-2 border-dashed border-violet-200">
          <CardContent className="p-8">
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 rounded-full text-sm text-violet-700 mb-4">
                  <Sparkles className="w-4 h-4" />
                  AI-Powered Idea Refinement
                </div>
                <p className="text-slate-600">
                  Describe your vague business idea. Be as brief or detailed as you want - our AI will extract the core concept and find the best path forward.
                </p>
              </div>
              
              <Textarea
                placeholder="Example: I want to help small businesses with AI but I'm not sure how..."
                value={vagueIdea}
                onChange={(e) => setVagueIdea(e.target.value)}
                className="min-h-[150px] text-lg"
              />
              
              <div className="flex gap-3 justify-center">
                <Button 
                  size="lg" 
                  onClick={extractIdeas}
                  disabled={!vagueIdea.trim()}
                  className="px-8"
                >
                  <Brain className="w-5 h-5 mr-2" />
                  Extract & Refine
                </Button>
              </div>
              
              <div className="text-center text-sm text-slate-500">
                Press Enter or click Extract to analyze your idea
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Extraction Progress */}
      {isExtracting && (
        <Card className="border-violet-200">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="animate-spin w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full" />
              </div>
              
              <div className="space-y-2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={extractionStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-lg font-medium text-violet-700"
                  >
                    {extractionStep === 1 && 'Analyzing your idea...'}
                    {extractionStep === 2 && 'Matching to business archetypes...'}
                    {extractionStep === 3 && 'Generating actionable concepts...'}
                  </motion.div>
                </AnimatePresence>
              </div>
              
              <Progress value={extractionStep * 33} className="h-2 w-64 mx-auto" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {extractedIdeas.length > 0 && !selectedIdea && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Extracted Opportunities</h2>
              <p className="text-slate-600">AI found {extractedIdeas.length} potential paths for your idea</p>
            </div>
            <Button variant="outline" onClick={reset}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Start Over
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {extractedIdeas.map((idea, index) => (
              <motion.div
                key={idea.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-all h-full"
                  onClick={() => setSelectedIdea(idea)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <Badge className={getPotentialColor(idea.marketPotential)}>
                        {idea.marketPotential} potential
                      </Badge>
                      <div className="text-2xl font-bold text-violet-600">
                        {idea.confidenceScore}%
                      </div>
                    </div>
                    <CardTitle className="text-lg mt-3 leading-tight">
                      {idea.refinedConcept}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <Target className="w-4 h-4" />
                      {idea.archetype}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        {idea.timeToMvp}
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-slate-400" />
                        {idea.estimatedRevenue}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t">
                      <span className="text-sm text-slate-600">
                        Archetype fit: {idea.archetypeFitScore}%
                      </span>
                      <Button size="sm" variant="ghost">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Idea Detail */}
      {selectedIdea && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="border-2 border-violet-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getPotentialColor(selectedIdea.marketPotential)}>
                      {selectedIdea.marketPotential} potential
                    </Badge>
                    <Badge variant="outline">{selectedIdea.archetype}</Badge>
                  </div>
                  <CardTitle className="text-2xl">{selectedIdea.refinedConcept}</CardTitle>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-violet-600">
                    {selectedIdea.confidenceScore}%
                  </div>
                  <div className="text-sm text-slate-600">AI Confidence</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg text-center">
                  <Target className="w-5 h-5 mx-auto mb-2 text-violet-600" />
                  <div className="font-bold">{selectedIdea.archetypeFitScore}%</div>
                  <div className="text-xs text-slate-600">Archetype Fit</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg text-center">
                  <Clock className="w-5 h-5 mx-auto mb-2 text-blue-600" />
                  <div className="font-bold">{selectedIdea.timeToMvp}</div>
                  <div className="text-xs text-slate-600">Time to MVP</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg text-center">
                  <DollarSign className="w-5 h-5 mx-auto mb-2 text-emerald-600" />
                  <div className="font-bold">{selectedIdea.estimatedRevenue}</div>
                  <div className="text-xs text-slate-600">Revenue Potential</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg text-center">
                  <TrendingUp className="w-5 h-5 mx-auto mb-2 text-amber-600" />
                  <div className="font-bold capitalize">{selectedIdea.marketPotential}</div>
                  <div className="text-xs text-slate-600">Market Potential</div>
                </div>
              </div>

              {/* Required Skills */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  Required Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedIdea.requiredSkills.map((skill) => (
                    <Badge key={skill} variant="outline" className="px-3 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Next Steps */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  Recommended Next Steps
                </h3>
                <div className="space-y-2">
                  {selectedIdea.nextSteps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                      <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 text-sm font-medium shrink-0">
                        {index + 1}
                      </div>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button className="flex-1" size="lg">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Build This Opportunity
                </Button>
                <Button variant="outline" size="lg" onClick={() => setSelectedIdea(null)}>
                  Back to Results
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
