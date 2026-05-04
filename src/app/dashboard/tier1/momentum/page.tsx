'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Zap, TrendingUp, Target, CheckCircle } from 'lucide-react';

const DIMENSIONS = [
  { id: 'clarity', name: 'Clarity', description: 'Clear vision' },
  { id: 'energy', name: 'Energy', description: 'Physical vitality' },
  { id: 'courage', name: 'Courage', description: 'Bold action' },
  { id: 'productivity', name: 'Productivity', description: 'Efficient execution' },
  { id: 'influence', name: 'Influence', description: 'Relationships' },
  { id: 'learning', name: 'Learning', description: 'Growth' },
  { id: 'wealth', name: 'Wealth', description: 'Abundance' },
];

export default function MomentumPage() {
  const [scores, setScores] = useState<Record<string, number>>({});
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('foundryai_momentum');
    if (saved) setScores(JSON.parse(saved));
  }, []);

  const adjustScore = (id: string, delta: number) => {
    const newScores = { ...scores, [id]: Math.max(0, Math.min(10, (scores[id] || 5) + delta)) };
    setScores(newScores);
    localStorage.setItem('foundryai_momentum', JSON.stringify(newScores));
    toast({ title: `${id} updated: ${newScores[id]}/10` });
  };

  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const max = DIMENSIONS.length * 10;
  const progress = (total / max) * 100;

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold text-slate-900 dark:text-white">Momentum Builder</h1><p className="text-slate-600 dark:text-slate-400 mt-1">7-dimension flywheel</p></div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Zap className="w-4 h-4 text-orange-500"/>Score</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{total}/{max}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-500"/>Avg</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{(total / DIMENSIONS.length).toFixed(1)}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500"/>Tracked</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{Object.keys(scores).length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Target className="w-4 h-4 text-violet-500"/>Progress</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{Math.round(progress)}%</div><Progress value={progress} className="mt-2"/></CardContent></Card>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DIMENSIONS.map((dim) => {
          const score = scores[dim.id] || 5;
          return (
            <Card key={dim.id}>
              <CardContent className="p-4">
                <h4 className="font-semibold">{dim.name}</h4>
                <p className="text-xs text-slate-500 mb-3">{dim.description}</p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => adjustScore(dim.id, -1)}>-</Button>
                  <Progress value={(score / 10) * 100} className="flex-1 h-2" />
                  <span className="text-sm w-8 text-center">{score}</span>
                  <Button variant="outline" size="sm" onClick={() => adjustScore(dim.id, 1)}>+</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
