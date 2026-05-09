'use client';

import React, { useState, useEffect } from 'react';
import { emotionService } from '@/layer-3-data/services/tier1-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Wind, 
  Frown, 
  Meh, 
  Smile, 
  Zap, 
  ArrowRight,
  Brain,
  Activity,
  Flame,
  Clock,
  CheckCircle
} from 'lucide-react';

interface EmotionState {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  transitions: { target: string; strategy: string; duration: number }[];
}

const EMOTION_STATES: EmotionState[] = [
  {
    id: 'anxious',
    name: 'Anxious/Worried',
    icon: <Wind className="w-5 h-5" />,
    color: 'bg-orange-100 text-orange-700 border-orange-300',
    description: 'Racing thoughts, tension, unease',
    transitions: [
      { target: 'focused', strategy: 'Brain Dump + Smallest Next Step', duration: 120 },
      { target: 'calm', strategy: 'Box Breathing (4-4-4-4)', duration: 180 },
    ],
  },
  {
    id: 'discouraged',
    name: 'Discouraged',
    icon: <Frown className="w-5 h-5" />,
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    description: 'Low motivation, defeat, pessimism',
    transitions: [
      { target: 'confident', strategy: 'Evidence Review + Past Wins', duration: 180 },
      { target: 'engaged', strategy: 'Micro-Win Achievement', duration: 300 },
    ],
  },
  {
    id: 'overwhelmed',
    name: 'Overwhelmed',
    icon: <Activity className="w-5 h-5" />,
    color: 'bg-red-100 text-red-700 border-red-300',
    description: 'Too much to handle, scattered',
    transitions: [
      { target: 'focused', strategy: 'Single-Task Selection', duration: 60 },
      { target: 'calm', strategy: 'Brain Dump Protocol', duration: 300 },
    ],
  },
  {
    id: 'bored',
    name: 'Bored/Apathetic',
    icon: <Meh className="w-5 h-5" />,
    color: 'bg-gray-100 text-gray-700 border-gray-300',
    description: 'Disengaged, restless, seeking novelty',
    transitions: [
      { target: 'engaged', strategy: 'Challenge Upgrade', duration: 120 },
      { target: 'flow', strategy: 'Add Complexity to Task', duration: 300 },
    ],
  },
  {
    id: 'frustrated',
    name: 'Frustrated/Stuck',
    icon: <Flame className="w-5 h-5" />,
    color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    description: 'Blocked, irritated, wanting to quit',
    transitions: [
      { target: 'solution-focused', strategy: '5-Minute Break + Perspective Shift', duration: 300 },
      { target: 'engaged', strategy: 'Switch to Different Task', duration: 60 },
    ],
  },
  {
    id: 'procrastinating',
    name: 'Procrastinating',
    icon: <Clock className="w-5 h-5" />,
    color: 'bg-purple-100 text-purple-700 border-purple-300',
    description: 'Avoiding, delaying, resisting',
    transitions: [
      { target: 'momentum', strategy: '2-Minute Micro-Action', duration: 120 },
      { target: 'engaged', strategy: 'Temptation Bundling', duration: 300 },
    ],
  },
  {
    id: 'fatigued',
    name: 'Fatigued/Tired',
    icon: <Brain className="w-5 h-5" />,
    color: 'bg-slate-100 text-slate-700 border-slate-300',
    description: 'Low energy, foggy, depleted',
    transitions: [
      { target: 'energized', strategy: 'Energy Audit + Strategic Rest', duration: 600 },
      { target: 'sustainable', strategy: '20-Minute Power Nap', duration: 1200 },
    ],
  },
  {
    id: 'neutral',
    name: 'Neutral',
    icon: <Meh className="w-5 h-5" />,
    color: 'bg-gray-50 text-gray-600 border-gray-200',
    description: 'Steady, baseline, ready',
    transitions: [
      { target: 'engaged', strategy: 'Interest Activation', duration: 180 },
      { target: 'flow', strategy: 'Flow Trigger Sequence', duration: 300 },
    ],
  },
  {
    id: 'engaged',
    name: 'Engaged',
    icon: <Smile className="w-5 h-5" />,
    color: 'bg-green-100 text-green-700 border-green-300',
    description: 'Interested, involved, present',
    transitions: [
      { target: 'flow', strategy: 'Deepen Challenge + Remove Distractions', duration: 300 },
    ],
  },
  {
    id: 'flow',
    name: 'Flow State',
    icon: <Zap className="w-5 h-5" />,
    color: 'bg-indigo-100 text-indigo-700 border-indigo-300',
    description: 'Deep focus, timeless, peak performance',
    transitions: [],
  },
];

const EmotionController: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentState, setCurrentState] = useState<string>('neutral');
  const [selectedTransition, setSelectedTransition] = useState<EmotionState['transitions'][0] | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [flowSessions, setFlowSessions] = useState(0);
  const [totalTransitions, setTotalTransitions] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [newCheckin, setNewCheckin] = useState<{
    currentState: string;
    intensity: number;
    notes: string;
  } | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTransitioning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTransitioning) {
      completeTransition();
    }
    return () => clearInterval(interval);
  }, [isTransitioning, timerSeconds]);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      const data = await emotionService.getEmotionData();
      setFlowSessions(data.stats?.flowSessionsCount || 0);
      setTotalTransitions(data.checkins?.filter((c: {wasSuccessful: boolean}) => c.wasSuccessful).length || 0);
    } catch (error) {
      console.error('Error loading emotion stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startTransition = async (transition: EmotionState['transitions'][0]) => {
    setSelectedTransition(transition);
    setTimerSeconds(transition.duration);
    setIsTransitioning(true);

    // Record check-in
    try {
      await emotionService.createCheckin({
        currentState: currentState as any,
        intensity: 5,
        targetState: transition.target as any,
        transitionStrategyUsed: transition.strategy,
        wasSuccessful: false,
      });
    } catch (error) {
      console.error('Error recording checkin:', error);
    }
  };

  const completeTransition = async () => {
    setCurrentState(selectedTransition?.target || 'neutral');
    setIsTransitioning(false);
    setSelectedTransition(null);

    // Record successful transition
    try {
      await emotionService.createCheckin({
        currentState: selectedTransition?.target as any,
        intensity: 7,
        wasSuccessful: true,
        notes: `Transitioned using ${selectedTransition?.strategy}`,
      });
    } catch (error) {
      console.error('Error recording transition:', error);
    }

    loadStats();
  };

  const enterFlowState = async () => {
    try {
      await emotionService.startFlowSession({
        entryMethod: '2_minute_ritual',
        workType: 'Deep work session',
      });
      setCurrentState('flow');
      loadStats();
    } catch (error) {
      console.error('Error entering flow:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentEmotion = () => EMOTION_STATES.find(e => e.id === currentState);

  // Mini button (always visible)
  if (!isOpen) {
    const emotion = getCurrentEmotion();
    return (
      <div className="fixed bottom-40 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className={`rounded-full w-14 h-14 shadow-lg transition-all ${
            currentState === 'flow' 
              ? 'bg-indigo-600 hover:bg-indigo-700 animate-pulse' 
              : emotion?.color.includes('red') || emotion?.color.includes('orange')
                ? 'bg-orange-500 hover:bg-orange-600'
                : 'bg-cyan-600 hover:bg-cyan-700'
          }`}
        >
          {emotion?.icon || <Smile className="w-6 h-6" />}
        </Button>
        {currentState !== 'flow' && currentState !== 'neutral' && (
          <Badge className="absolute -top-2 -right-2 bg-orange-500">
            Action
          </Badge>
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <Wind className="w-6 h-6 text-cyan-600" />
            <CardTitle>Emotion Controller - State Navigation</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Flow Sessions Today</div>
              <div className="font-bold text-indigo-600">{flowSessions}</div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <CheckCircle className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Current State Display */}
          <div className="flex items-center justify-center py-4">
            <div className={`p-4 rounded-xl border-2 ${getCurrentEmotion()?.color || 'bg-gray-100'}`}>
              <div className="flex items-center gap-3">
                {getCurrentEmotion()?.icon}
                <div>
                  <div className="font-semibold">{getCurrentEmotion()?.name}</div>
                  <div className="text-xs opacity-75">{getCurrentEmotion()?.description}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Flow State Special UI */}
          {currentState === 'flow' ? (
            <div className="bg-indigo-50 dark:bg-indigo-950 p-4 rounded-lg text-center space-y-3">
              <Zap className="w-12 h-12 text-indigo-600 mx-auto" />
              <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-100">
                You Are In Flow State
              </h3>
              <p className="text-indigo-700 dark:text-indigo-300">
                Protect this state. Distractions are your enemy right now.
              </p>
              <Button
                onClick={() => setCurrentState('neutral')}
                variant="outline"
                className="mt-4"
              >
                Exit Flow State
              </Button>
            </div>
          ) : isTransitioning ? (
            /* Active Transition UI */
            <div className="bg-cyan-50 dark:bg-cyan-950 p-6 rounded-lg text-center space-y-4">
              <div className="text-4xl font-mono font-bold text-cyan-600">
                {formatTime(timerSeconds)}
              </div>
              <div className="space-y-2">
                <p className="font-medium">Transition Strategy: {selectedTransition?.strategy}</p>
                <p className="text-sm text-muted-foreground">
                  Moving from {getCurrentEmotion()?.name} to {selectedTransition?.target}
                </p>
              </div>
              <Progress 
                value={(1 - timerSeconds / (selectedTransition?.duration || 1)) * 100} 
                className="w-full" 
              />
              <div className="flex gap-2 justify-center">
                <Button variant="outline" onClick={() => setIsTransitioning(false)}>
                  Cancel
                </Button>
                <Button onClick={completeTransition} className="bg-cyan-600 hover:bg-cyan-700">
                  Complete Now
                </Button>
              </div>
            </div>
          ) : (
            /* State Selection UI */
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Select your current emotional state to see transition pathways to productive flow
              </p>

              <div className="grid grid-cols-2 gap-2">
                {EMOTION_STATES.filter(e => e.id !== 'flow').map((emotion) => (
                  <button
                    key={emotion.id}
                    onClick={() => setCurrentState(emotion.id)}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      currentState === emotion.id
                        ? emotion.color
                        : 'border-gray-200 hover:border-gray-300 bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {emotion.icon}
                      <span className="font-medium text-sm">{emotion.name}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Transition Options */}
              {getCurrentEmotion() && getCurrentEmotion()!.transitions.length > 0 && (
                <div className="space-y-2 pt-4 border-t">
                  <h4 className="font-medium">Transition Pathways to Productivity:</h4>
                  <div className="space-y-2">
                    {getCurrentEmotion()!.transitions.map((transition, idx) => (
                      <button
                        key={idx}
                        onClick={() => startTransition(transition)}
                        className="w-full p-3 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950 dark:to-blue-950 
                                   border border-cyan-200 dark:border-cyan-800 rounded-lg 
                                   hover:shadow-md transition-all text-left"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm">{transition.strategy}</div>
                            <div className="text-xs text-muted-foreground">
                              Target: {transition.target} • {Math.round(transition.duration / 60)} min
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-cyan-600" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Flow Entry */}
              <div className="pt-4 border-t">
                <Button
                  onClick={enterFlowState}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Enter Flow State (2-Min Ritual)
                </Button>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 pt-4 border-t">
            <div className="bg-muted p-3 rounded text-center">
              <div className="text-2xl font-bold text-indigo-600">{flowSessions}</div>
              <div className="text-xs text-muted-foreground">Flow Sessions Today</div>
            </div>
            <div className="bg-muted p-3 rounded text-center">
              <div className="text-2xl font-bold text-cyan-600">{totalTransitions}</div>
              <div className="text-xs text-muted-foreground">Successful Transitions</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmotionController;
