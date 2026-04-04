'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  Target, 
  Zap, 
  Brain,
  Coffee,
  Moon,
  Sun,
  TrendingUp,
  Calendar,
  Timer,
  Focus,
  BarChart3
} from 'lucide-react';

interface ChronotypeData {
  chronotype: string;
  peakCognitiveStart: string;
  peakCognitiveEnd: string;
  peakCreativeStart: string;
  peakCreativeEnd: string;
  optimalBedtime: string;
  optimalWakeTime: string;
}

interface TimeAllocation {
  deepWork: number;
  shallowWork: number;
  meetings: number;
  learning: number;
  restRecovery: number;
}

interface ProductivitySession {
  id: string;
  type: string;
  duration: number;
  focusScore: number;
  completed: boolean;
  startedAt: string;
}

export default function ProductivityOptimizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [chronotype, setChronotype] = useState<ChronotypeData | null>(null);
  const [timeAllocation, setTimeAllocation] = useState<TimeAllocation | null>(null);
  const [recentSessions, setRecentSessions] = useState<ProductivitySession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(25);

  useEffect(() => {
    loadProductivityData();
  }, []);

  const loadProductivityData = async () => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setChronotype({
        chronotype: 'Bear',
        peakCognitiveStart: '10:00',
        peakCognitiveEnd: '14:00',
        peakCreativeStart: '16:00',
        peakCreativeEnd: '19:00',
        optimalBedtime: '23:00',
        optimalWakeTime: '07:00'
      });

      setTimeAllocation({
        deepWork: 40,
        shallowWork: 25,
        meetings: 15,
        learning: 10,
        restRecovery: 10
      });

      setRecentSessions([
        { id: '1', type: 'Deep Work', duration: 90, focusScore: 85, completed: true, startedAt: '2024-01-20T10:00:00' },
        { id: '2', type: 'Learning', duration: 45, focusScore: 72, completed: true, startedAt: '2024-01-20T14:00:00' },
        { id: '3', type: 'Meeting', duration: 30, focusScore: 60, completed: true, startedAt: '2024-01-20T15:00:00' },
      ]);
    } catch (error) {
      console.error('Error loading productivity data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getChronotypeIcon = (type: string) => {
    const icons: Record<string, React.ElementType> = {
      'Lion': Sun,
      'Bear': Brain,
      'Wolf': Moon,
      'Dolphin': Coffee
    };
    return icons[type] || Clock;
  };

  const getAllocationColor = (type: string) => {
    const colors: Record<string, string> = {
      deepWork: 'bg-violet-500',
      shallowWork: 'bg-blue-400',
      meetings: 'bg-amber-400',
      learning: 'bg-emerald-400',
      restRecovery: 'bg-rose-400'
    };
    return colors[type] || 'bg-slate-400';
  };

  const startFocusTimer = () => {
    setIsTimerRunning(true);
  };

  const stopFocusTimer = () => {
    setIsTimerRunning(false);
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
          <Zap className="w-8 h-8 text-violet-600" />
          Productivity Optimizer
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Optimize your work patterns based on your chronotype, track deep work sessions, 
          and manage your time allocation for peak performance.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="chronotype">Chronotype</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="timer">Focus Timer</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-violet-100 rounded-lg">
                    <Clock className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">6.5h</div>
                    <div className="text-sm text-slate-600">Deep Work Today</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Target className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">82%</div>
                    <div className="text-sm text-slate-600">Avg Focus Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">4</div>
                    <div className="text-sm text-slate-600">Sessions Today</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Brain className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">Bear</div>
                    <div className="text-sm text-slate-600">Your Chronotype</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Time Allocation */}
          {timeAllocation && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-violet-600" />
                  Time Allocation
                </CardTitle>
                <CardDescription>Ideal distribution of your work time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(timeAllocation).map(([type, percentage]) => (
                    <div key={type} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize">{type.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="font-medium">{percentage}%</span>
                      </div>
                      <Progress 
                        value={percentage} 
                        className={`h-2 ${getAllocationColor(type)}`} 
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-violet-600" />
                Recent Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentSessions.map((session) => (
                  <div 
                    key={session.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-slate-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        session.type === 'Deep Work' ? 'bg-violet-100' : 
                        session.type === 'Learning' ? 'bg-emerald-100' : 'bg-amber-100'
                      }`}>
                        {session.type === 'Deep Work' ? <Focus className="w-5 h-5 text-violet-600" /> :
                         session.type === 'Learning' ? <Brain className="w-5 h-5 text-emerald-600" /> :
                         <Coffee className="w-5 h-5 text-amber-600" />}
                      </div>
                      <div>
                        <div className="font-semibold">{session.type}</div>
                        <div className="text-sm text-slate-600">{session.duration} minutes</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={session.focusScore >= 80 ? 'bg-emerald-100 text-emerald-800' : 
                                       session.focusScore >= 60 ? 'bg-amber-100 text-amber-800' : 
                                       'bg-rose-100 text-rose-800'}>
                        {session.focusScore}% Focus
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chronotype" className="space-y-4">
          {chronotype && (
            <>
              <Card className="bg-gradient-to-r from-violet-50 to-purple-50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {(() => {
                        const Icon = getChronotypeIcon(chronotype.chronotype);
                        return (
                          <div className="p-3 bg-violet-100 rounded-lg">
                            <Icon className="w-6 h-6 text-violet-700" />
                          </div>
                        );
                      })()}
                      <div>
                        <CardTitle>Your Chronotype: {chronotype.chronotype}</CardTitle>
                        <CardDescription>Optimize your schedule based on your biological clock</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-violet-600" />
                      Peak Cognitive Hours
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-4">
                      <div className="text-4xl font-bold text-violet-600">
                        {chronotype.peakCognitiveStart} - {chronotype.peakCognitiveEnd}
                      </div>
                      <p className="text-slate-600 mt-2">
                        Best for: Deep work, complex problem-solving, strategic planning
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-600" />
                      Peak Creative Hours
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-4">
                      <div className="text-4xl font-bold text-amber-600">
                        {chronotype.peakCreativeStart} - {chronotype.peakCreativeEnd}
                      </div>
                      <p className="text-slate-600 mt-2">
                        Best for: Brainstorming, content creation, design work
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Moon className="w-5 h-5 text-indigo-600" />
                      Optimal Sleep Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Bedtime</span>
                        <span className="text-xl font-bold">{chronotype.optimalBedtime}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Wake Time</span>
                        <span className="text-xl font-bold">{chronotype.optimalWakeTime}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-emerald-600" />
                      Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5" />
                        Schedule deep work during peak cognitive hours
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5" />
                        Reserve meetings for non-peak hours
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5" />
                        Use creative hours for innovation tasks
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5" />
                        Maintain consistent sleep schedule
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Session History</CardTitle>
              <CardDescription>Track your productivity patterns over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-slate-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Detailed session analytics coming soon</p>
                <p className="text-sm">Track your focus trends, interruption patterns, and optimal work blocks</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timer" className="space-y-4">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Timer className="w-6 h-6 text-violet-600" />
                Focus Timer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Timer Display */}
              <div className="py-8">
                <div className="text-6xl font-bold text-slate-900">
                  {String(Math.floor(timerMinutes / 60)).padStart(2, '0')}:
                  {String(timerMinutes % 60).padStart(2, '0')}
                </div>
                <p className="text-slate-600 mt-2">
                  {isTimerRunning ? 'Stay focused...' : 'Ready to start'}
                </p>
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4">
                <Button 
                  size="lg"
                  className="bg-violet-600 hover:bg-violet-700 px-8"
                  onClick={isTimerRunning ? stopFocusTimer : startFocusTimer}
                >
                  {isTimerRunning ? 'Stop' : 'Start Focus'}
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => setTimerMinutes(25)}
                >
                  25 min
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => setTimerMinutes(50)}
                >
                  50 min
                </Button>
              </div>

              {/* Session Type */}
              <div className="flex justify-center gap-2 pt-4">
                <Badge variant="outline" className="cursor-pointer">Deep Work</Badge>
                <Badge variant="outline" className="cursor-pointer">Learning</Badge>
                <Badge variant="outline" className="cursor-pointer">Creative</Badge>
                <Badge variant="outline" className="cursor-pointer">Planning</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
