'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { focusService } from '@/layer-3-data/services/tier1-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Shield, ShieldCheck, ShieldAlert, Smartphone, Monitor, Brain, Users, Heart, Timer, Target, AlertCircle } from 'lucide-react';

interface DefenseLayer {
  id: number;
  name: string;
  type: 'digital' | 'physical' | 'cognitive' | 'social' | 'internal';
  isActive: boolean;
  vulnerabilities: string[];
  defenses: string[];
}

interface FocusSession {
  id: string;
  session_intention: string;
  focus_score: number;
  distractions_blocked: number;
  flow_state_achieved: boolean;
  started_at: string;
}

const DistractionsKiller: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusScore, setFocusScore] = useState(75);
  const [currentSession, setCurrentSession] = useState<FocusSession | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionIntention, setSessionIntention] = useState('');
  const [sessionDuration, setSessionDuration] = useState(25);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60);
  const [isLoading, setIsLoading] = useState(true);
  const [todayStats, setTodayStats] = useState({
    sessionsCompleted: 0,
    totalFocusTime: 0,
    distractionsBlocked: 0,
    flowStatesAchieved: 0,
  });

  const [defenseLayers, setDefenseLayers] = useState<DefenseLayer[]>([
    {
      id: 1,
      name: 'Digital Fortress',
      type: 'digital',
      isActive: true,
      vulnerabilities: ['Social media notifications', 'Email interruptions'],
      defenses: ['App blockers active', 'DND mode enabled', 'Website filters on'],
    },
    {
      id: 2,
      name: 'Physical Sanctuary',
      type: 'physical',
      isActive: true,
      vulnerabilities: [],
      defenses: ['Workspace optimized', 'Phone in another room', 'Noise canceling on'],
    },
    {
      id: 3,
      name: 'Cognitive Protection',
      type: 'cognitive',
      isActive: false,
      vulnerabilities: ['Brain dump needed', 'Multi-tasking tendency'],
      defenses: ['Single-task mode', 'Intention anchored', 'Boundaries set'],
    },
    {
      id: 4,
      name: 'Social Shield',
      type: 'social',
      isActive: false,
      vulnerabilities: ['Colleague interruptions', 'Family requests'],
      defenses: ['Status set: Deep work', 'Auto-responders active', 'Emergency only'],
    },
    {
      id: 5,
      name: 'Internal Defense',
      type: 'internal',
      isActive: false,
      vulnerabilities: ['Urge to check phone', 'Boredom impulse'],
      defenses: ['Urge surfing ready', 'Boredom tolerance', 'Impulse delay active'],
    },
  ]);

  // Load today's stats on mount
  useEffect(() => {
    loadTodayStats();
    loadCurrentSession();
  }, []);

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSessionActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            completeSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSessionActive, timeRemaining]);

  const loadTodayStats = async () => {
    try {
      setIsLoading(true);
      const data = await focusService.getFocusData();
      
      if (data.stats) {
        setTodayStats({
          sessionsCompleted: data.stats.sessionsCompleted || 0,
          totalFocusTime: data.stats.totalFocusTime || 0,
          distractionsBlocked: data.stats.distractionsBlocked || 0,
          flowStatesAchieved: data.stats.flowStatesAchieved || 0,
        });
        setFocusScore(data.score?.currentScore || 75);
      }
    } catch (error) {
      console.error('Error loading focus stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCurrentSession = async () => {
    try {
      const data = await focusService.getFocusData();
      
      if (data.settings?.currentSession) {
        const session = data.settings.currentSession;
        setCurrentSession({
          id: session.id,
          session_intention: session.sessionIntention,
          focus_score: 0,
          distractions_blocked: 0,
          flow_state_achieved: false,
          started_at: session.startedAt
        });
        setIsSessionActive(true);
        setSessionIntention(session.sessionIntention);
        
        // Calculate remaining time
        const elapsed = Math.floor((Date.now() - new Date(session.startedAt).getTime()) / 1000);
        const remaining = Math.max(0, (session.plannedDurationMinutes * 60) - elapsed);
        setTimeRemaining(remaining);
      }
    } catch (error) {
      console.error('Error loading current session:', error);
    }
  };

  const startFocusSession = async () => {
    if (!sessionIntention.trim()) return;

    // Activate all defense layers
    const updatedLayers = defenseLayers.map(l => ({ ...l, isActive: true }));
    setDefenseLayers(updatedLayers);

    try {
      await focusService.startSession({
        sessionIntention: sessionIntention,
        plannedDurationMinutes: sessionDuration,
        defenseLayersActive: updatedLayers.map(l => l.id),
        cognitiveLoadBefore: 50
      });

      setIsSessionActive(true);
      setTimeRemaining(sessionDuration * 60);
      loadTodayStats();
    } catch (error) {
      console.error('Session start error:', error);
    }
  };

  const completeSession = async () => {
    if (!currentSession) return;

    try {
      await focusService.endSession(currentSession.id, {
        actualDurationMinutes: Math.floor((Date.now() - new Date(currentSession.started_at).getTime()) / 60000),
        distractionsBlocked: todayStats.distractionsBlocked,
        flowStateAchieved: todayStats.distractionsBlocked > 5
      });

      setIsSessionActive(false);
      setCurrentSession(null);
      setSessionIntention('');
      loadTodayStats();
    } catch (error) {
      console.error('Session complete error:', error);
    }
  };

  const logDistraction = async (type: 'digital' | 'physical' | 'cognitive' | 'social' | 'internal', blocked: boolean) => {
    // Note: Distraction logging would need a separate API endpoint
    // For now, just update local stats
    if (blocked) {
      setTodayStats(prev => ({
        ...prev,
        distractionsBlocked: prev.distractionsBlocked + 1,
      }));
    }
  };

  const toggleDefenseLayer = (layerId: number) => {
    setDefenseLayers(prev =>
      prev.map(layer =>
        layer.id === layerId ? { ...layer, isActive: !layer.isActive } : layer
      )
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 70) return 'bg-blue-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Fortress';
    if (score >= 70) return 'Protected';
    if (score >= 50) return 'Vulnerable';
    return 'Exposed';
  };

  const getLayerIcon = (type: string) => {
    switch (type) {
      case 'digital': return <Monitor className="w-4 h-4" />;
      case 'physical': return <Smartphone className="w-4 h-4" />;
      case 'cognitive': return <Brain className="w-4 h-4" />;
      case 'social': return <Users className="w-4 h-4" />;
      case 'internal': return <Heart className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  // Mini focus button (always visible when not expanded)
  if (!isOpen) {
    return (
      <div className="fixed bottom-24 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className={`rounded-full w-14 h-14 shadow-lg transition-all ${
            isSessionActive ? 'bg-green-600 hover:bg-green-700 animate-pulse' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSessionActive ? (
            <Timer className="w-6 h-6" />
          ) : (
            <Shield className="w-6 h-6" />
          )}
        </Button>
        {focusScore < 70 && (
          <Badge className="absolute -top-2 -right-2 bg-yellow-500">
            {focusScore}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" />
            <CardTitle>Distractions Killer - 5-Layer Defense</CardTitle>
          </div>
          <div className="flex items-center gap-4">
            {/* Focus Score */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Focus Score:</span>
              <div className="w-24">
                <Progress value={focusScore} className={getScoreColor(focusScore)} />
              </div>
              <Badge variant={focusScore >= 70 ? 'default' : 'destructive'}>
                {getScoreLabel(focusScore)}
              </Badge>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <AlertCircle className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Active Session Display */}
          {isSessionActive && currentSession ? (
            <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-green-900 dark:text-green-100">
                    Deep Work in Progress
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    {currentSession.session_intention}
                  </p>
                </div>
                <div className="text-4xl font-mono font-bold text-green-600">
                  {formatTime(timeRemaining)}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => logDistraction('internal', true)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Blocked Distraction +1
                </Button>
                <Button
                  onClick={completeSession}
                  variant="default"
                  size="sm"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Complete Session
                </Button>
              </div>
            </div>
          ) : (
            /* New Session Form */
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={sessionIntention}
                  onChange={(e) => setSessionIntention(e.target.value)}
                  placeholder="What is your intention for this focus session?"
                  className="flex-1 px-3 py-2 border rounded-md text-sm"
                />
                <select
                  value={sessionDuration}
                  onChange={(e) => setSessionDuration(parseInt(e.target.value))}
                  className="px-3 py-2 border rounded-md text-sm"
                >
                  <option value={15}>15 min</option>
                  <option value={25}>25 min</option>
                  <option value={45}>45 min</option>
                  <option value={60}>60 min</option>
                  <option value={90}>90 min</option>
                </select>
              </div>
              <Button
                onClick={startFocusSession}
                disabled={!sessionIntention.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Target className="w-4 h-4 mr-2" />
                Activate Defense Fortress & Start Session
              </Button>
            </div>
          )}

          {/* Today's Stats */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-muted p-3 rounded text-center">
              <div className="text-2xl font-bold">{todayStats.sessionsCompleted}</div>
              <div className="text-xs text-muted-foreground">Sessions</div>
            </div>
            <div className="bg-muted p-3 rounded text-center">
              <div className="text-2xl font-bold">{todayStats.totalFocusTime}</div>
              <div className="text-xs text-muted-foreground">Minutes</div>
            </div>
            <div className="bg-muted p-3 rounded text-center">
              <div className="text-2xl font-bold text-green-600">{todayStats.distractionsBlocked}</div>
              <div className="text-xs text-muted-foreground">Blocked</div>
            </div>
            <div className="bg-muted p-3 rounded text-center">
              <div className="text-2xl font-bold text-purple-600">{todayStats.flowStatesAchieved}</div>
              <div className="text-xs text-muted-foreground">Flow States</div>
            </div>
          </div>

          {/* 5-Layer Defense System */}
          <div className="space-y-3">
            <h3 className="font-semibold">5-Layer Defense Fortress</h3>
            
            {defenseLayers.map((layer) => (
              <div
                key={layer.id}
                className={`p-3 rounded-lg border-2 transition-all ${
                  layer.isActive
                    ? 'border-green-500 bg-green-50 dark:bg-green-950'
                    : 'border-gray-200 bg-muted'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      layer.isActive ? 'bg-green-200 text-green-700' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {layer.isActive ? <ShieldCheck className="w-4 h-4" /> : getLayerIcon(layer.type)}
                    </div>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        Layer {layer.id}: {layer.name}
                        {layer.isActive && (
                          <Badge variant="outline" className="text-xs bg-green-100 text-green-700">
                            Active
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {layer.defenses.slice(0, 2).join(' • ')}
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={layer.isActive}
                    onCheckedChange={() => toggleDefenseLayer(layer.id)}
                  />
                </div>

                {layer.vulnerabilities.length > 0 && !layer.isActive && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-amber-600">
                    <ShieldAlert className="w-3 h-3" />
                    <span>Vulnerabilities: {layer.vulnerabilities.join(', ')}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => logDistraction('digital', true)}
              className="text-sm"
            >
              <Monitor className="w-4 h-4 mr-2" />
              Blocked Digital Distraction
            </Button>
            <Button
              variant="outline"
              onClick={() => logDistraction('social', true)}
              className="text-sm"
            >
              <Users className="w-4 h-4 mr-2" />
              Blocked Social Interruption
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DistractionsKiller;
