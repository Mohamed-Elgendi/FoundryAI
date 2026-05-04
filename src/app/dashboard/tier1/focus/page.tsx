'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Shield, Clock, Zap, Target, CheckCircle, Play, Square } from 'lucide-react';

const DEFENSE_LAYERS = [
  { id: 'notifications', name: 'Notifications Off', description: 'Silence all non-essential notifications', duration: 5 },
  { id: 'phone', name: 'Phone Away', description: 'Put phone in another room', duration: 10 },
  { id: 'browser', name: 'Block Distractions', description: 'Close social media tabs', duration: 15 },
  { id: 'environment', name: 'Environment Setup', description: 'Clean workspace, good lighting', duration: 20 },
  { id: 'intent', name: 'Set Intent', description: 'Define clear goal for this session', duration: 25 },
];

export default function FocusPage() {
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const [completedLayers, setCompletedLayers] = useState<string[]>([]);
  const [sessionTime, setSessionTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('foundryai_focus_layers');
    if (saved) setCompletedLayers(JSON.parse(saved));
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => setSessionTime(t => t + 1), 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isRunning]);

  const toggleLayer = (layerId: string) => {
    const updated = completedLayers.includes(layerId)
      ? completedLayers.filter(id => id !== layerId)
      : [...completedLayers, layerId];
    setCompletedLayers(updated);
    localStorage.setItem('foundryai_focus_layers', JSON.stringify(updated));
    toast({ title: completedLayers.includes(layerId) ? 'Layer undone' : 'Layer activated!' });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (completedLayers.length / DEFENSE_LAYERS.length) * 100;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Distractions Killer</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">5-layer defense system for deep focus</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Shield className="w-4 h-4 text-red-500"/>Active</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{completedLayers.length}</div><p className="text-xs text-slate-500">Defense layers</p></CardContent>
        </Card>
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Clock className="w-4 h-4 text-blue-500"/>Session</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{formatTime(sessionTime)}</div><p className="text-xs text-slate-500">Current focus time</p></CardContent>
        </Card>
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Zap className="w-4 h-4 text-green-500"/>Status</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{isRunning ? 'Focusing' : 'Paused'}</div><p className="text-xs text-slate-500">Session state</p></CardContent>
        </Card>
        <Card className="border-violet-200 dark:border-violet-800">
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Target className="w-4 h-4 text-violet-500"/>Protection</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{Math.round(progress)}%</div><Progress value={progress} className="mt-2"/></CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 dark:border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Focus Session Timer</h3>
              <p className="text-sm text-slate-500">Start a deep work session</p>
            </div>
            <Button onClick={() => setIsRunning(!isRunning)} className={isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}>
              {isRunning ? <Square className="w-4 h-4 mr-2"/> : <Play className="w-4 h-4 mr-2"/>}
              {isRunning ? 'Stop' : 'Start'} Session
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2"><Shield className="w-5 h-5 text-red-500"/>Defense Layers</h3>
        {DEFENSE_LAYERS.map((layer) => {
          const isCompleted = completedLayers.includes(layer.id);
          return (
            <Card key={layer.id} className={`cursor-pointer transition-all ${isCompleted ? 'border-green-200 bg-green-50/50' : 'border-slate-200'}`} onClick={() => toggleLayer(layer.id)}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCompleted ? 'bg-green-500' : 'bg-slate-200'}`}>
                  {isCompleted ? <CheckCircle className="w-5 h-5 text-white"/> : <Shield className="w-5 h-5 text-slate-500"/>}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{layer.name}</h4>
                  <p className="text-sm text-slate-500">{layer.description}</p>
                </div>
                <span className="text-xs text-slate-400">+{layer.duration} min</span>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
