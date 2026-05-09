'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { brainDumpService } from '@/layer-3-data/services/tier1-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Timer, Brain, Sparkles, Archive, Calendar, Trash2, Send, X } from 'lucide-react';

interface BrainDump {
  id: string;
  raw_content: string;
  categorization: {
    urgent: string[];
    scheduled: string[];
    ideas: string[];
    trash: string[];
    delegate: string[];
    release: string[];
  };
  cognitive_load_before: number;
  cognitive_load_after: number | null;
  created_at: string;
}

interface CognitiveLoadReading {
  load_percentage: number;
  load_source: string;
}

const BrainDumpSystem: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<'ritual' | 'dump' | 'categorize' | 'complete'>('ritual');
  const [dumpContent, setDumpContent] = useState('');
  const [cognitiveLoad, setCognitiveLoad] = useState<number>(70);
  const [categorizedItems, setCategorizedItems] = useState<BrainDump['categorization'] | null>(null);
  const [isCategorizing, setIsCategorizing] = useState(false);
  const [recentDumps, setRecentDumps] = useState<BrainDump[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timerSeconds, setTimerSeconds] = useState(180); // 3 minutes default
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Load data on mount using service layer
  useEffect(() => {
    loadBrainDumpData();
  }, []);

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const loadBrainDumpData = async () => {
    try {
      setIsLoading(true);
      const data = await brainDumpService.getBrainDumpData();
      
      if (data.cognitiveLoad) {
        setCognitiveLoad(data.cognitiveLoad.load_percentage || 70);
      }
      
      // Convert API response to component format
      const formattedDumps: BrainDump[] = (data.dumps || []).map(dump => ({
        id: dump.id,
        raw_content: dump.rawContent,
        categorization: data.items?.[dump.id] ? {
          urgent: data.items[dump.id].filter((i: {category: string}) => i.category === 'urgent').map((i: {itemContent: string}) => i.itemContent),
          scheduled: data.items[dump.id].filter((i: {category: string}) => i.category === 'scheduled').map((i: {itemContent: string}) => i.itemContent),
          ideas: data.items[dump.id].filter((i: {category: string}) => i.category === 'idea').map((i: {itemContent: string}) => i.itemContent),
          trash: data.items[dump.id].filter((i: {category: string}) => i.category === 'trash').map((i: {itemContent: string}) => i.itemContent),
          delegate: data.items[dump.id].filter((i: {category: string}) => i.category === 'delegate').map((i: {itemContent: string}) => i.itemContent),
          release: data.items[dump.id].filter((i: {category: string}) => i.category === 'release').map((i: {itemContent: string}) => i.itemContent),
        } : { urgent: [], scheduled: [], ideas: [], trash: [], delegate: [], release: [] },
        cognitive_load_before: dump.cognitiveLoadBefore || 70,
        cognitive_load_after: dump.cognitiveLoadAfter,
        created_at: dump.createdAt,
      }));
      
      setRecentDumps(formattedDumps);
    } catch (error) {
      console.error('Error loading brain dump data:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const startBrainDump = () => {
    setCurrentStep('dump');
    setIsTimerRunning(true);
    setTimerSeconds(180); // Reset to 3 minutes
  };

  const handleAICategorization = async () => {
    if (!dumpContent.trim()) return;

    setIsCategorizing(true);
    
    try {
      // Use the new API endpoint for categorization
      const response = await fetch('/api/tier1/brain-dump', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'categorize',
          content: dumpContent 
        }),
      });

      if (!response.ok) throw new Error('Categorization failed');

      const result = await response.json();
      
      // Map API categories to component categories
      const categorization: BrainDump['categorization'] = {
        urgent: result.categories?.urgent || [],
        scheduled: result.categories?.scheduled || [],
        ideas: result.categories?.idea || result.categories?.ideas || [],
        trash: result.categories?.trash || [],
        delegate: result.categories?.delegate || [],
        release: result.categories?.release || [],
      };
      
      setCategorizedItems(categorization);
      setCurrentStep('categorize');
    } catch (error) {
      console.error('Categorization error:', error);
      // Fallback categorization - split by lines
      const lines = dumpContent.split('\n').filter(line => line.trim());
      setCategorizedItems({
        urgent: [],
        scheduled: [],
        ideas: lines,
        trash: [],
        delegate: [],
        release: [],
      });
      setCurrentStep('categorize');
    } finally {
      setIsCategorizing(false);
    }
  };

  const saveBrainDump = async () => {
    try {
      const loadAfter = Math.max(10, cognitiveLoad - 30);
      
      // Convert component categories to API format
      const categorizedItemsApi = [
        ...(categorizedItems?.urgent || []).map((content: string) => ({ content, category: 'urgent', priority: 'high' })),
        ...(categorizedItems?.scheduled || []).map((content: string) => ({ content, category: 'scheduled', priority: 'medium' })),
        ...(categorizedItems?.ideas || []).map((content: string) => ({ content, category: 'idea', priority: 'low' })),
        ...(categorizedItems?.trash || []).map((content: string) => ({ content, category: 'trash', priority: 'low' })),
        ...(categorizedItems?.delegate || []).map((content: string) => ({ content, category: 'delegate', priority: 'medium' })),
        ...(categorizedItems?.release || []).map((content: string) => ({ content, category: 'release', priority: 'low' })),
      ];

      await brainDumpService.createDump({
        rawContent: dumpContent,
        durationSeconds: 180 - timerSeconds,
        cognitiveLoadBefore: cognitiveLoad,
        cognitiveLoadAfter: loadAfter,
        cognitiveFactors: ['brain_dump_session'],
        categorizedItems: categorizedItemsApi,
      });

      setCognitiveLoad(loadAfter);
      setCurrentStep('complete');
      loadBrainDumpData(); // Refresh the list
    } catch (error) {
      console.error('Save error:', error);
      // Show error to user
      alert('Failed to save brain dump. Please try again.');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCognitiveLoadColor = (load: number) => {
    if (load >= 80) return 'bg-red-500';
    if (load >= 60) return 'bg-yellow-500';
    if (load >= 40) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getCognitiveLoadLabel = (load: number) => {
    if (load >= 80) return 'Critical';
    if (load >= 60) return 'Heavy';
    if (load >= 40) return 'Moderate';
    return 'Optimal';
  };

  // Mini Brain Dump Button (always visible)
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 shadow-lg bg-purple-600 hover:bg-purple-700"
        >
          <Brain className="w-6 h-6" />
        </Button>
        {cognitiveLoad > 60 && (
          <Badge className="absolute -top-2 -right-2 bg-red-500 animate-pulse">
            {cognitiveLoad}%
          </Badge>
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-600" />
            <CardTitle>Brain Dump System</CardTitle>
          </div>
          <div className="flex items-center gap-4">
            {/* Cognitive Load Monitor */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Mental RAM:</span>
              <div className="w-24">
                <Progress value={cognitiveLoad} className={getCognitiveLoadColor(cognitiveLoad)} />
              </div>
              <Badge variant={cognitiveLoad > 60 ? 'destructive' : 'default'}>
                {getCognitiveLoadLabel(cognitiveLoad)}
              </Badge>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Step 1: Pre-Session Ritual */}
          {currentStep === 'ritual' && (
            <div className="space-y-4">
              <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900 dark:text-purple-100">
                  Pre-Session Brain Dump Ritual (3 minutes)
                </h3>
                <p className="text-sm text-purple-700 dark:text-purple-300 mt-2">
                  Clear your mental RAM before deep work. Transfer all thoughts, worries, tasks, 
                  and ideas from your mind to this space.
                </p>
              </div>

              {recentDumps.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Recent Dumps</h4>
                  <div className="space-y-2">
                    {recentDumps.slice(0, 3).map((dump) => (
                      <div key={dump.id} className="text-sm p-2 bg-muted rounded">
                        <div className="flex justify-between">
                          <span className="truncate flex-1">{dump.raw_content.slice(0, 50)}...</span>
                          <span className="text-muted-foreground text-xs">
                            {new Date(dump.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            Before: {dump.cognitive_load_before}%
                          </Badge>
                          {dump.cognitive_load_after && (
                            <Badge variant="outline" className="text-xs text-green-600">
                              After: {dump.cognitive_load_after}%
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button onClick={startBrainDump} className="w-full bg-purple-600 hover:bg-purple-700">
                <Brain className="w-4 h-4 mr-2" />
                Start Brain Dump Session
              </Button>
            </div>
          )}

          {/* Step 2: Stream of Consciousness Capture */}
          {currentStep === 'dump' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-muted p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Timer className={`w-5 h-5 ${isTimerRunning ? 'text-green-500' : 'text-muted-foreground'}`} />
                  <span className={`font-mono text-xl ${timerSeconds < 30 ? 'text-red-500' : ''}`}>
                    {formatTime(timerSeconds)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                  >
                    {isTimerRunning ? 'Pause' : 'Resume'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsTimerRunning(false);
                      setTimerSeconds(180);
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Dump everything in your mind. No filtering, no organizing. Just let it flow...
              </p>

              <Textarea
                value={dumpContent}
                onChange={(e) => setDumpContent(e.target.value)}
                placeholder="Write everything that's on your mind... tasks, worries, ideas, reminders, anything cluttering your thoughts..."
                className="min-h-[200px] font-mono text-sm"
                autoFocus
              />

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep('ritual')}>
                  Back
                </Button>
                <Button
                  onClick={handleAICategorization}
                  disabled={!dumpContent.trim() || isCategorizing}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isCategorizing ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                      AI Categorizing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      AI Categorize
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: AI Categorization Review */}
          {currentStep === 'categorize' && categorizedItems && (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                <h3 className="font-semibold text-green-900 dark:text-green-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  AI Categorization Complete
                </h3>
              </div>

              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {categorizedItems.urgent.length > 0 && (
                  <div className="border-l-4 border-red-500 pl-3">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <Badge variant="destructive">URGENT</Badge>
                      <span className="text-muted-foreground text-xs">Do today</span>
                    </h4>
                    <ul className="mt-1 space-y-1">
                      {categorizedItems.urgent.map((item, i) => (
                        <li key={i} className="text-sm">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {categorizedItems.scheduled.length > 0 && (
                  <div className="border-l-4 border-blue-500 pl-3">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <Badge variant="default">SCHEDULED</Badge>
                      <span className="text-muted-foreground text-xs">Calendar items</span>
                    </h4>
                    <ul className="mt-1 space-y-1">
                      {categorizedItems.scheduled.map((item, i) => (
                        <li key={i} className="text-sm flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {categorizedItems.ideas.length > 0 && (
                  <div className="border-l-4 border-yellow-500 pl-3">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <Badge variant="outline" className="bg-yellow-100">IDEAS</Badge>
                      <span className="text-muted-foreground text-xs">Save for later</span>
                    </h4>
                    <ul className="mt-1 space-y-1">
                      {categorizedItems.ideas.map((item, i) => (
                        <li key={i} className="text-sm">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {categorizedItems.delegate.length > 0 && (
                  <div className="border-l-4 border-purple-500 pl-3">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <Badge variant="outline" className="bg-purple-100">DELEGATE</Badge>
                      <span className="text-muted-foreground text-xs">Hand off</span>
                    </h4>
                    <ul className="mt-1 space-y-1">
                      {categorizedItems.delegate.map((item, i) => (
                        <li key={i} className="text-sm">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {categorizedItems.release.length > 0 && (
                  <div className="border-l-4 border-green-500 pl-3">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <Badge variant="outline" className="bg-green-100">RELEASE</Badge>
                      <span className="text-muted-foreground text-xs">Let go</span>
                    </h4>
                    <ul className="mt-1 space-y-1">
                      {categorizedItems.release.map((item, i) => (
                        <li key={i} className="text-sm text-muted-foreground">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {categorizedItems.trash.length > 0 && (
                  <div className="border-l-4 border-gray-400 pl-3">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <Badge variant="outline" className="bg-gray-100">
                        <Trash2 className="w-3 h-3 mr-1" />
                        TRASH
                      </Badge>
                    </h4>
                    <ul className="mt-1 space-y-1">
                      {categorizedItems.trash.map((item, i) => (
                        <li key={i} className="text-sm text-muted-foreground line-through">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-4 border-t">
                <Button variant="outline" onClick={() => setCurrentStep('dump')}>
                  Edit Raw
                </Button>
                <Button onClick={saveBrainDump} className="bg-green-600 hover:bg-green-700">
                  <Archive className="w-4 h-4 mr-2" />
                  Save & Clear Mind
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Completion */}
          {currentStep === 'complete' && (
            <div className="text-center space-y-4 py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Brain className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold">Mental RAM Cleared!</h3>
              <p className="text-muted-foreground">
                Your cognitive load decreased from {cognitiveLoad + 30}% to {cognitiveLoad}%
              </p>
              <p className="text-sm text-muted-foreground">
                You're now ready for deep, focused work.
              </p>
              <Button onClick={() => {
                setIsOpen(false);
                setCurrentStep('ritual');
                setDumpContent('');
                setCategorizedItems(null);
              }} className="bg-purple-600 hover:bg-purple-700">
                Start Deep Work Session
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BrainDumpSystem;
