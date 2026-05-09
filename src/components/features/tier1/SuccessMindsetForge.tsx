'use client';

import { useState, useEffect } from 'react';
import { mindsetService } from '@/layer-3-data/services/tier1-service';
import { 
  Sparkles, 
  TrendingUp, 
  Shield, 
  Lightbulb, 
  Target, 
  Eye, 
  Infinity,
  ChevronRight,
  CheckCircle2,
  Circle,
  RotateCcw,
  Brain,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

interface Pillar {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  dailyPractice: string;
  completed: boolean;
  streak: number;
}

interface WeekData {
  week: number;
  title: string;
  description: string;
  tasks: string[];
  completed: boolean;
}

export default function SuccessMindsetForge() {
  const [activeTab, setActiveTab] = useState<'pillars' | 'pathway'>('pillars');
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [reflection, setReflection] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [pillarsData, setPillarsData] = useState<Pillar[]>([]);

  useEffect(() => {
    loadMindsetData();
  }, []);

  const loadMindsetData = async () => {
    try {
      setIsLoading(true);
      const data = await mindsetService.getMindsetData();
      
      // Map API data to local pillar structure
      const mappedPillars = pillars.map(p => {
        const apiPillar = data.pillars?.find((ap: {pillarName: string}) => 
          ap.pillarName.toLowerCase().includes(p.id.toLowerCase())
        );
        return {
          ...p,
          completed: apiPillar?.exercisesLogged > 0 || false,
          streak: apiPillar?.streakDays || 0
        };
      });
      
      setPillarsData(mappedPillars);
      if (data.progress?.currentWeek) {
        setCurrentWeek(data.progress.currentWeek);
      }
    } catch (error) {
      console.error('Error loading mindset data:', error);
      // Fallback to static data
      setPillarsData(pillars);
    } finally {
      setIsLoading(false);
    }
  };

  const markPillarComplete = async (pillarId: string) => {
    if (!reflection.trim()) return;
    
    try {
      const pillar = pillars.find(p => p.id === pillarId);
      if (!pillar) return;
      
      await mindsetService.logExercise({
        pillarName: pillar.name,
        exerciseType: 'daily_practice',
        content: reflection,
        completionStatus: 'completed',
        reflection: reflection
      });
      
      setReflection('');
      setSelectedPillar(null);
      loadMindsetData();
    } catch (error) {
      console.error('Error logging exercise:', error);
    }
  };

  const pillars: Pillar[] = [
    {
      id: 'abundance',
      name: 'Abundance Consciousness',
      description: 'Transform scarcity thinking into abundance mindset. Money is energy, not enemy.',
      icon: Sparkles,
      color: 'amber',
      dailyPractice: 'Identify 3 abundant resources available right now',
      completed: false,
      streak: 0
    },
    {
      id: 'growth',
      name: 'Growth Mindset Mastery',
      description: 'Rewire fixed mindset to growth. "Failure is data, not identity."',
      icon: TrendingUp,
      color: 'emerald',
      dailyPractice: 'Document one "not yet" transformed into "now capable"',
      completed: false,
      streak: 0
    },
    {
      id: 'resilience',
      name: 'Resilience Under Pressure',
      description: 'Shift stress to challenge perception. Build bounce-back protocols.',
      icon: Shield,
      color: 'blue',
      dailyPractice: 'Resilience score tracking + improvement strategies',
      completed: false,
      streak: 0
    },
    {
      id: 'possibility',
      name: 'Possibility Expansion',
      description: 'Dissolve limiting beliefs. One impossible thing made possible daily.',
      icon: Lightbulb,
      color: 'violet',
      dailyPractice: 'Write one "impossible" thing that became possible',
      completed: false,
      streak: 0
    },
    {
      id: 'owner',
      name: 'Owner Mentality',
      description: 'Victim → Creator identity shift. Extreme ownership practices.',
      icon: Target,
      color: 'orange',
      dailyPractice: '"I am 100% responsible for..." completion',
      completed: false,
      streak: 0
    },
    {
      id: 'vision',
      name: 'Long-Term Visioning',
      description: 'Delayed gratification training. Legacy-building perspective.',
      icon: Eye,
      color: 'cyan',
      dailyPractice: '5-minute future-self visualization + guidance',
      completed: false,
      streak: 0
    },
    {
      id: 'limitless',
      name: 'Limitless Potential',
      description: 'Ceiling removal exercises. Infinite growth pattern installation.',
      icon: Infinity,
      color: 'rose',
      dailyPractice: 'One action that expands your sense of what\'s possible',
      completed: false,
      streak: 0
    }
  ];

  const weeks: WeekData[] = [
    {
      week: 1,
      title: 'Mindset Foundation',
      description: 'Identify limiting beliefs and install empowering replacements',
      tasks: [
        'Identify 3 limiting beliefs currently active',
        'Install 3 empowering replacement beliefs',
        'Practice daily thought-arrest and replacement',
        'Collect evidence: Small wins that prove new mindset'
      ],
      completed: currentWeek > 1
    },
    {
      week: 2,
      title: 'Pattern Recognition',
      description: 'AI analysis of thought patterns and trigger identification',
      tasks: [
        'AI analysis of thought patterns (daily journal)',
        'Trigger identification: What situations activate limits?',
        'Response protocol development',
        'Practice: Catch and correct 5+ limiting thoughts/day'
      ],
      completed: currentWeek > 2
    },
    {
      week: 3,
      title: 'Neural Pathway Installation',
      description: 'Intensive immersion in success psychology content',
      tasks: [
        'Intensive immersion: Success psychology content',
        'Peer group upgrade: Connect with growth-minded founders',
        'Environmental design: Remove scarcity cues',
        'Practice: New mindset is default 80%+ of time'
      ],
      completed: currentWeek > 3
    },
    {
      week: 4,
      title: 'Identity Integration',
      description: 'Crystallize "I am" statements and align behavior',
      tasks: [
        '"I am" statement crystallization',
        'External behavior alignment with internal shift',
        'Automated mindset maintenance system activation',
        'Evidence: Others notice your transformation'
      ],
      completed: currentWeek > 4
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string; badge: string }> = {
      amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-800' },
      emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-800' },
      blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-800' },
      violet: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', badge: 'bg-violet-100 text-violet-800' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-800' },
      cyan: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', badge: 'bg-cyan-100 text-cyan-800' },
      rose: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', badge: 'bg-rose-100 text-rose-800' },
    };
    return colors[color] || colors.emerald;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
          <Brain className="w-8 h-8 text-violet-600" />
          Success Mindset Forge
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Transform your psychology, transform your life. Master the 7 pillars of success mindset 
          through the 4-week Infinite Growth Protocol.
        </p>
      </div>

      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-100 rounded-lg">
                <Zap className="w-5 h-5 text-violet-700" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Current Progress</h3>
                <p className="text-sm text-slate-600">Week {currentWeek} of 4 • Infinite Growth Pathway</p>
              </div>
            </div>
            <Badge className="bg-violet-100 text-violet-800">
              {Math.round(((currentWeek - 1) / 4) * 100)}% Complete
            </Badge>
          </div>
          <Progress value={((currentWeek - 1) / 4) * 100} className="h-2" />
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="flex gap-2 justify-center">
        <Button
          variant={activeTab === 'pillars' ? 'default' : 'outline'}
          onClick={() => setActiveTab('pillars')}
          className={activeTab === 'pillars' ? 'bg-violet-600' : ''}
        >
          7 Success Pillars
        </Button>
        <Button
          variant={activeTab === 'pathway' ? 'default' : 'outline'}
          onClick={() => setActiveTab('pathway')}
          className={activeTab === 'pathway' ? 'bg-violet-600' : ''}
        >
          4-Week Pathway
        </Button>
      </div>

      {/* Pillars View */}
      {activeTab === 'pillars' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <div className="col-span-full text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-muted-foreground">Loading mindset data...</p>
            </div>
          ) : (pillarsData.length > 0 ? pillarsData : pillars).map((pillar) => {
            const colors = getColorClasses(pillar.color);
            const Icon = pillar.icon;
            
            return (
              <Card 
                key={pillar.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedPillar === pillar.id ? `ring-2 ring-violet-500 ${colors.bg}` : ''
                }`}
                onClick={() => setSelectedPillar(selectedPillar === pillar.id ? null : pillar.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className={`p-2 rounded-lg ${colors.bg}`}>
                      <Icon className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    {pillar.streak > 0 && (
                      <Badge variant="outline" className="text-xs">
                        🔥 {pillar.streak} day streak
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg mt-3">{pillar.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-slate-600">{pillar.description}</p>
                  
                  <div className={`p-3 rounded-lg border ${colors.bg} ${colors.border}`}>
                    <p className="text-xs font-medium text-slate-500 mb-1">DAILY PRACTICE</p>
                    <p className={`text-sm ${colors.text}`}>{pillar.dailyPractice}</p>
                  </div>

                  {selectedPillar === pillar.id && (
                    <div className="pt-3 space-y-3 border-t">
                      <Textarea
                        placeholder={`Reflect on today's ${pillar.name.toLowerCase()} practice...`}
                        value={reflection}
                        onChange={(e) => setReflection(e.target.value)}
                        className="min-h-[80px]"
                      />
                      <Button 
                        className="w-full bg-violet-600 hover:bg-violet-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          markPillarComplete(pillar.id);
                        }}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Mark Complete
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pathway View */}
      {activeTab === 'pathway' && (
        <div className="space-y-4">
          {weeks.map((week) => (
            <Card 
              key={week.week}
              className={`${week.completed ? 'bg-slate-50' : week.week === currentWeek ? 'ring-2 ring-violet-500' : ''}`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${week.completed ? 'bg-emerald-100' : week.week === currentWeek ? 'bg-violet-100' : 'bg-slate-100'}`}>
                      {week.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Circle className={`w-5 h-5 ${week.week === currentWeek ? 'text-violet-600' : 'text-slate-400'}`} />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">Week {week.week}: {week.title}</CardTitle>
                      <p className="text-sm text-slate-600">{week.description}</p>
                    </div>
                  </div>
                  {week.week === currentWeek && (
                    <Badge className="bg-violet-100 text-violet-800">Current Week</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {week.tasks.map((task, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <ChevronRight className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                      <span className={week.completed ? 'text-slate-500 line-through' : 'text-slate-700'}>
                        {task}
                      </span>
                    </li>
                  ))}
                </ul>
                {week.week === currentWeek && (
                  <div className="mt-4 flex gap-2">
                    <Button 
                      className="flex-1 bg-violet-600 hover:bg-violet-700"
                      onClick={() => setCurrentWeek(currentWeek + 1)}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Complete Week {week.week}
                    </Button>
                    {currentWeek > 1 && (
                      <Button 
                        variant="outline"
                        onClick={() => setCurrentWeek(currentWeek - 1)}
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
