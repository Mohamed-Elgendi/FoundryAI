'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, TrendingUp, Target, PiggyBank, Plus } from 'lucide-react';

const REVENUE_STREAMS = [
  { id: 'subscriptions', name: 'Subscriptions', color: 'text-violet-500' },
  { id: 'products', name: 'Digital Products', color: 'text-blue-500' },
  { id: 'services', name: 'Services', color: 'text-green-500' },
  { id: 'affiliate', name: 'Affiliate', color: 'text-orange-500' },
  { id: 'other', name: 'Other', color: 'text-slate-500' },
];

export default function RevenuePage() {
  const [income, setIncome] = useState([]);
  const [newEntry, setNewEntry] = useState({ amount: '', source: 'subscriptions' });
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('foundryai_revenue');
    if (saved) setIncome(JSON.parse(saved));
  }, []);

  const addIncome = () => {
    if (!newEntry.amount) { toast({ title: 'Enter amount', variant: 'destructive' }); return; }
    const entry = { id: Date.now(), amount: parseFloat(newEntry.amount), source: newEntry.source, date: new Date().toISOString() };
    const updated = [entry, ...income];
    setIncome(updated);
    localStorage.setItem('foundryai_revenue', JSON.stringify(updated));
    setNewEntry({ amount: '', source: 'subscriptions' });
    toast({ title: `+$${entry.amount} recorded!` });
  };

  const totalRevenue = income.reduce((sum, i) => sum + i.amount, 0);
  const thisMonth = income.filter(i => new Date(i.date).getMonth() === new Date().getMonth()).reduce((sum, i) => sum + i.amount, 0);
  const bySource = {};
  income.forEach(i => { bySource[i.source] = (bySource[i.source] || 0) + i.amount; });

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold text-slate-900 dark:text-white">Revenue Tracker</h1><p className="text-slate-600 dark:text-slate-400 mt-1">Track income across all streams</p></div>
      
      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><DollarSign className="w-4 h-4 text-green-500"/>Total</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-500"/>This Month</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">${thisMonth.toLocaleString()}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Target className="w-4 h-4 text-violet-500"/>Entries</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{income.length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><PiggyBank className="w-4 h-4 text-orange-500"/>Streams</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{Object.keys(bySource).length}</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="w-5 h-5"/>Add Income</CardTitle></CardHeader>
        <CardContent className="flex gap-2">
          <Input type="number" placeholder="Amount" value={newEntry.amount} onChange={(e) => setNewEntry({...newEntry, amount: e.target.value})} className="w-32" />
          <select value={newEntry.source} onChange={(e) => setNewEntry({...newEntry, source: e.target.value})} className="flex-1 rounded-md border px-3">
            {REVENUE_STREAMS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <Button onClick={addIncome}>Add</Button>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>By Source</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {REVENUE_STREAMS.map(stream => (
              <div key={stream.id} className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-800 rounded">
                <span className={stream.color}>{stream.name}</span>
                <span className="font-bold">${bySource[stream.id]?.toLocaleString() || 0}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Recent Entries</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {income.slice(0, 5).map((entry) => (
              <div key={entry.id} className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-800 rounded">
                <span className="text-sm">{REVENUE_STREAMS.find(s => s.id === entry.source)?.name}</span>
                <span className="font-bold text-green-600">+${entry.amount}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
