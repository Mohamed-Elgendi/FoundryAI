'use client';

import React, { useState } from 'react';
import { useIdeaExtraction } from '@/hooks/useRadarAndBuild';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Lightbulb, 
  Sparkles, 
  ArrowRight, 
  RefreshCw,
  Target,
  Clock,
  DollarSign,
  CheckCircle2
} from 'lucide-react';

interface IdeaExtractorProps {
  onClose?: () => void;
  onSelectOpportunity?: (opportunity: ExtractedOpportunity) => void;
}

interface ExtractedOpportunity {
  title: string;
  description: string;
  archetypeFit: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  timeToFirstRevenue: string;
  requiredSkills: string[];
  nextSteps: string[];
}

export function IdeaExtractor({ onClose, onSelectOpportunity }: IdeaExtractorProps) {
  const [vagueIdea, setVagueIdea] = useState('');
  const [skills, setSkills] = useState('');
  const [timeAvailability, setTimeAvailability] = useState<'minimal' | 'moderate' | 'significant'>('moderate');
  const [budget, setBudget] = useState<'zero' | 'small' | 'moderate'>('small');
  const [extractedIdeas, setExtractedIdeas] = useState<ExtractedOpportunity[]>([]);
  const [hasExtracted, setHasExtracted] = useState(false);
  
  const { extract, isLoading, error } = useIdeaExtraction();

  const handleExtract = async () => {
    if (!vagueIdea.trim()) return;

    try {
      const result = await extract({
        vagueIdea,
        skills: skills.split(',').map(s => s.trim()).filter(Boolean),
        interests: [],
        timeAvailability,
        budget,
      });

      setExtractedIdeas(result.opportunities || []);
      setHasExtracted(true);
    } catch (err) {
      console.error('Extraction failed:', err);
    }
  };

  const reset = () => {
    setVagueIdea('');
    setSkills('');
    setHasExtracted(false);
    setExtractedIdeas([]);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-yellow-500" />
            <CardTitle>Idea Extractor</CardTitle>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Transform vague ideas into actionable business opportunities
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {!hasExtracted ? (
          <div className="space-y-4">
            {/* Vague Idea Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">What's your vague idea?</label>
              <Textarea
                placeholder="I want to help people with... I've noticed that... What if there was a way to..."
                value={vagueIdea}
                onChange={(e) => setVagueIdea(e.target.value)}
                className="min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground">
                Don't worry about clarity - that's what extraction is for!
              </p>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Skills (comma separated)</label>
              <input
                type="text"
                placeholder="coding, marketing, design, writing, sales..."
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>

            {/* Constraints */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Time Available</label>
                <div className="flex gap-2">
                  {(['minimal', 'moderate', 'significant'] as const).map((time) => (
                    <Button
                      key={time}
                      variant={timeAvailability === time ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTimeAvailability(time)}
                      className="flex-1 capitalize"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Budget</label>
                <div className="flex gap-2">
                  {(['zero', 'small', 'moderate'] as const).map((b) => (
                    <Button
                      key={b}
                      variant={budget === b ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setBudget(b)}
                      className="flex-1 capitalize"
                    >
                      {b}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
                Extraction failed: {error}
              </div>
            )}

            <Button 
              onClick={handleExtract} 
              disabled={!vagueIdea.trim() || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Extracting Opportunities...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Extract Business Opportunities
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">
                {extractedIdeas.length} Opportunities Extracted
              </h3>
              <Button variant="outline" size="sm" onClick={reset}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Start Over
              </Button>
            </div>

            <div className="space-y-3">
              {extractedIdeas.map((idea, idx) => (
                <ExtractedIdeaCard 
                  key={idx} 
                  idea={idea} 
                  onSelect={() => onSelectOpportunity?.(idea)}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ExtractedIdeaCard({ 
  idea, 
  onSelect 
}: { 
  idea: ExtractedOpportunity; 
  onSelect?: () => void;
}) {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-semibold">{idea.title}</h4>
        <Badge className={getDifficultyColor(idea.difficulty)}>
          {idea.difficulty}
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground mb-3">
        {idea.description}
      </p>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="flex items-center gap-1 text-xs">
          <Clock className="w-3 h-3" />
          <span>{idea.timeToFirstRevenue}</span>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <Target className="w-3 h-3" />
          <span>{idea.archetypeFit.length} archetypes</span>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <DollarSign className="w-3 h-3" />
          <span>Revenue ready</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {idea.requiredSkills.map((skill) => (
          <Badge key={skill} variant="secondary" className="text-xs">
            {skill}
          </Badge>
        ))}
      </div>

      <div className="space-y-1 mb-3">
        <p className="text-xs font-medium text-muted-foreground">Next Steps:</p>
        <ul className="text-xs space-y-1">
          {idea.nextSteps.slice(0, 3).map((step, i) => (
            <li key={i} className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-green-500" />
              {step}
            </li>
          ))}
        </ul>
      </div>

      <Button size="sm" className="w-full" onClick={onSelect}>
        Select This Opportunity
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
}

export default IdeaExtractor;
