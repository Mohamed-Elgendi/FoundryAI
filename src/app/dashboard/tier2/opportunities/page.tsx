'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Radar, Target, CheckCircle, TrendingUp } from 'lucide-react';

const ARCHETYPES = [
  { id: 'productized', name: 'Productized Service', demand: 85, competition: 45 },
  { id: 'content', name: 'Content Creator', demand: 90, competition: 80 },
  { id: 'saas', name: 'Micro SaaS', demand: 75, competition: 60 },
  { id: 'digital', name: 'Digital Product', demand: 80, competition: 55 },
  { id: 'agency', name: 'Micro Agency', demand: 70, competition: 70 },
];

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('foundryai_opportunities');
    if (saved) setOpportunities(JSON.parse(saved));
  }, []);

  const trackOpportunity = (arch: any) => {
    const opp = { id: Date.now(), archetype: arch, trackedAt: new Date().toISOString() };
    const updated = [opp, ...opportunities];
    setOpportunities(updated);
    localStorage.setItem('foundryai_opportunities', JSON.stringify(updated));
    toast({ title: `${arch.name} tracked!` });
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold text-slate-900 dark:text-white">Opportunity Radar</h1><p className="text-slate-600 dark:text-slate-400 mt-1">AI-powered market intelligence for 12 business archetypes</p></div>
      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Radar className="w-4 h-4 text-blue-500"/>Tracked</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{opportunities.length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500"/>High Demand</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{ARCHETYPES.filter(a => a.demand >= 80).length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="w-4 h-4 text-violet-500"/>Avg Demand</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{Math.round(ARCHETYPES.reduce((a,b) => a + b.demand, 0) / ARCHETYPES.length)}%</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Target className="w-4 h-4 text-orange-500"/>Archetypes</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{ARCHETYPES.length}</div></CardContent></Card>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ARCHETYPES.map((arch) => (
          <Card key={arch.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <h3 className="font-semibold">{arch.name}</h3>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-sm"><span>Demand</span><span className={arch.demand >= 80 ? 'text-green-600' : 'text-slate-500'}>{arch.demand}%</span></div>
                <div className="flex justify-between text-sm"><span>Competition</span><span>{arch.competition}%</span></div>
              </div>
              <Button onClick={() => trackOpportunity(arch)} size="sm" className="w-full mt-3">Track</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
