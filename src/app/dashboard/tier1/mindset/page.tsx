'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Target, CheckCircle, Circle, TrendingUp, Brain } from 'lucide-react';

const PILLARS = [
  { id: 'vision', name: 'Vision Clarity', description: 'Define and visualize your goals' },
  { id: 'resilience', name: 'Resilience', description: 'Build mental toughness' },
  { id: 'growth', name: 'Growth Mindset', description: 'Embrace continuous learning' },
  { id: 'focus', name: 'Deep Focus', description: 'Maintain concentration' },
];

export default function MindsetPage() {
  const [pillars, setPillars] = useState(PILLARS.map(p => ({ ...p, completed: false, streak: 0 })));
  const [reflection, setReflection] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('foundryai_mindset_pillars');
    const savedReflection = localStorage.getItem('foundryai_mindset_reflection');
    if (saved) setPillars(JSON.parse(saved));
    if (savedReflection) setReflection(savedReflection);
  }, []);

  const togglePillar = (id: string) => {
    const updated = pillars.map(p => p.id === id ? { ...p, completed: !p.completed, streak: p.completed ? p.streak : p.streak + 1 } : p);
    setPillars(updated);
    localStorage.setItem('foundryai_mindset_pillars', JSON.stringify(updated));
    const found = updated.find(p => p.id === id);
    toast({ title: found?.completed ? 'Pillar Completed!' : 'Pillar Reset', description: 'Keep building your mindset!' });
  };

  const completedCount = pillars.filter(p => p.completed).length;
  const progress = (completedCount / pillars.length) * 100;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Mindset Forge</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Forge a success mindset through daily practice</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-emerald-200 dark:border-emerald-800">
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Brain className="w-4 h-4 text-emerald-500"/>Active Pillars</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{pillars.length}</div><p className="text-xs text-slate-500">Core mindset areas</p></CardContent>
        </Card>
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><CheckCircle className="w-4 h-4 text-blue-500"/>Completed</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{completedCount}</div><p className="text-xs text-slate-500">Pillars done today</p></CardContent>
        </Card>
        <Card className="border-violet-200 dark:border-violet-800">
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="w-4 h-4 text-violet-500"/>Progress</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{Math.round(progress)}%</div><Progress value={progress} className="mt-2"/></CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {pillars.map((pillar) => (
          <Card key={pillar.id} className={`cursor-pointer transition-all ${pillar.completed ? 'border-green-200 bg-green-50/50' : 'border-slate-200'}`} onClick={() => togglePillar(pillar.id)}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${pillar.completed ? 'bg-green-500' : 'bg-slate-200'}`}>
                {pillar.completed ? <CheckCircle className="w-5 h-5 text-white"/> : <Circle className="w-5 h-5 text-slate-500"/>}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{pillar.name}</h3>
                <p className="text-sm text-slate-500">{pillar.description}</p>
                {pillar.streak > 0 && <span className="text-xs text-violet-600">{pillar.streak} day streak</span>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Target className="w-5 h-5 text-violet-500"/>Daily Reflection</CardTitle></CardHeader>
        <CardContent>
          <Textarea placeholder="What did you learn today? How did you grow?" value={reflection} onChange={(e) => setReflection(e.target.value)} className="min-h-[120px]"/>
          <Button className="mt-4 w-full" onClick={() => { localStorage.setItem('foundryai_mindset_reflection', reflection); toast({ title: 'Reflection Saved!' }); }}>Save Reflection</Button>
        </CardContent>
      </Card>
    </div>
  );
}
