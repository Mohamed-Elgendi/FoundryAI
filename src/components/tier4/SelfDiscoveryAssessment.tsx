'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, Sparkles, Target, Lightbulb, TrendingUp, ChevronRight, CheckCircle2, RotateCcw } from 'lucide-react';

interface Assessment {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  completed: boolean;
  score?: number;
  color: string;
}

interface DNAProfile {
  primary: string;
  secondary: string;
  builder: number;
  opportunist: number;
  specialist: number;
  innovator: number;
}

export default function SelfDiscoveryAssessment() {
  const [activeAssessment, setActiveAssessment] = useState<string | null>(null);
  const [dnaProfile, setDnaProfile] = useState<DNAProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const assessments: Assessment[] = [
    {
      id: 'entrepreneurial-dna',
      name: 'Entrepreneurial DNA',
      description: 'Discover your natural entrepreneurial archetype: Builder, Opportunist, Specialist, or Innovator',
      icon: Brain,
      completed: false,
      color: 'violet'
    },
    {
      id: 'cognitive-advantages',
      name: 'Cognitive Advantages',
      description: 'Identify your 7 core cognitive strengths and how to leverage them',
      icon: Lightbulb,
      completed: false,
      color: 'amber'
    },
    {
      id: 'passion-evidence',
      name: 'Passion Evidence Collector',
      description: 'Find what truly drives you through evidence-based passion discovery',
      icon: Sparkles,
      completed: false,
      color: 'rose'
    },
    {
      id: 'business-fit',
      name: 'Business Archetype Fit',
      description: 'Match your profile to the optimal business archetypes from the 12 available',
      icon: Target,
      completed: false,
      color: 'emerald'
    }
  ];

  useEffect(() => {
    loadSelfDiscoveryData();
  }, []);

  const loadSelfDiscoveryData = async () => {
    try {
      setIsLoading(true);
      // Simulated API call - replace with actual service
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for demonstration
      setDnaProfile({
        primary: 'Builder',
        secondary: 'Innovator',
        builder: 85,
        opportunist: 60,
        specialist: 45,
        innovator: 75
      });
    } catch (error) {
      console.error('Error loading self-discovery data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string; progress: string }> = {
      violet: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', progress: 'bg-violet-600' },
      amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', progress: 'bg-amber-600' },
      rose: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', progress: 'bg-rose-600' },
      emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', progress: 'bg-emerald-600' },
    };
    return colors[color] || colors.violet;
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
          <Brain className="w-8 h-8 text-violet-600" />
          Self-Discovery System
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Scientific assessments to discover your entrepreneurial DNA, cognitive advantages, 
          and optimal business archetype fit.
        </p>
      </div>

      {/* DNA Profile Summary (if available) */}
      {dnaProfile && (
        <Card className="bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-violet-700" />
                </div>
                <div>
                  <CardTitle className="text-lg">Your Entrepreneurial DNA</CardTitle>
                  <CardDescription>Primary: {dnaProfile.primary} • Secondary: {dnaProfile.secondary}</CardDescription>
                </div>
              </div>
              <Badge className="bg-violet-100 text-violet-800">Profile Complete</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Builder</span>
                  <span className="font-medium">{dnaProfile.builder}%</span>
                </div>
                <Progress value={dnaProfile.builder} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Opportunist</span>
                  <span className="font-medium">{dnaProfile.opportunist}%</span>
                </div>
                <Progress value={dnaProfile.opportunist} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Specialist</span>
                  <span className="font-medium">{dnaProfile.specialist}%</span>
                </div>
                <Progress value={dnaProfile.specialist} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Innovator</span>
                  <span className="font-medium">{dnaProfile.innovator}%</span>
                </div>
                <Progress value={dnaProfile.innovator} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assessment Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {assessments.map((assessment) => {
          const colors = getColorClasses(assessment.color);
          const Icon = assessment.icon;
          
          return (
            <Card 
              key={assessment.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                activeAssessment === assessment.id ? `ring-2 ring-${assessment.color}-500 ${colors.bg}` : ''
              }`}
              onClick={() => setActiveAssessment(activeAssessment === assessment.id ? null : assessment.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-lg ${colors.bg}`}>
                    <Icon className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  {assessment.completed && (
                    <Badge className="bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Complete
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg mt-3">{assessment.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-slate-600">{assessment.description}</p>
                
                {assessment.score && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Assessment Score</span>
                      <span className="font-medium">{assessment.score}%</span>
                    </div>
                    <Progress value={assessment.score} className={`h-2 ${colors.progress}`} />
                  </div>
                )}

                <div className="pt-3">
                  <Button 
                    className={`w-full ${assessment.completed ? 'bg-slate-600 hover:bg-slate-700' : `bg-${assessment.color}-600 hover:bg-${assessment.color}-700`}`}
                    variant={assessment.completed ? 'outline' : 'default'}
                  >
                    {assessment.completed ? (
                      <>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Retake Assessment
                      </>
                    ) : (
                      <>
                        <ChevronRight className="w-4 h-4 mr-2" />
                        Start Assessment
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Assessment Detail Modal */}
      {activeAssessment && (
        <Card className="border-2 border-violet-200">
          <CardHeader>
            <CardTitle>Assessment Details</CardTitle>
            <CardDescription>
              {assessments.find(a => a.id === activeAssessment)?.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              This assessment will take approximately 10-15 minutes to complete. 
              Answer honestly based on your natural tendencies, not what you think you should be.
            </p>
            <div className="mt-4 flex gap-2">
              <Button 
                className="flex-1 bg-violet-600 hover:bg-violet-700"
                onClick={() => alert('Assessment would start here - integrate with actual assessment flow')}
              >
                Begin Assessment
              </Button>
              <Button 
                variant="outline"
                onClick={() => setActiveAssessment(null)}
              >
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
