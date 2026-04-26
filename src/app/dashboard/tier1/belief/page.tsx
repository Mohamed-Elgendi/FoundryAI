'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import {
  Brain,
  TrendingUp,
  Plus,
  Trophy,
  Target,
  Sparkles,
  Zap,
} from 'lucide-react';

const BELIEF_LEVELS = [
  { level: 1, name: 'Micro-Proof', timeframe: 'Daily', belief: 'I follow through', requiredScore: 20 },
  { level: 2, name: 'Pattern Recognition', timeframe: 'Weekly', belief: 'I am consistent', requiredScore: 40 },
  { level: 3, name: 'Capability Growth', timeframe: 'Monthly', belief: 'I am capable', requiredScore: 60 },
  { level: 4, name: 'Identity Crystallization', timeframe: 'Quarterly', belief: 'I am an entrepreneur', requiredScore: 80 },
  { level: 5, name: 'Legendary Conviction', timeframe: 'Annually', belief: 'I am inevitable', requiredScore: 95 },
];

const IMPACT_MULTIPLIERS = { small: 1, medium: 2, large: 3 };

export default function BeliefArchitecturePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({ evidenceType: '', description: '', impact: 'small' });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const saved = localStorage.getItem('foundryai_belief_entries');
      if (saved) {
        const data = JSON.parse(saved);
        setEntries(data);
        calculateStats(data);
      }
    } catch (e) { console.error(e); }
  };

  const calculateStats = (data) => {
    let score = 0;
    data.forEach((entry) => { score += entry.score * IMPACT_MULTIPLIERS[entry.impact]; });
    setTotalScore(score);
    const newLevel = BELIEF_LEVELS.find((l) => score < l.requiredScore)?.level || 5;
    setCurrentLevel(newLevel);
  };

  const addEntry = () => {
    if (!newEntry.evidenceType || !newEntry.description) {
      toast({ title: 'Missing Information', description: 'Please fill in all fields.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const entry = {
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        level: currentLevel,
        score: 5,
        evidence_type: newEntry.evidenceType,
        description: newEntry.description,
        impact: newEntry.impact,
      };
      const updated = [entry, ...entries];
      setEntries(updated);
      localStorage.setItem('foundryai_belief_entries', JSON.stringify(updated));
      calculateStats(updated);
      toast({ title: 'Evidence Added', description: `+${5 * IMPACT_MULTIPLIERS[newEntry.impact]} points!` });
      setNewEntry({ evidenceType: '', description: '', impact: 'small' });
      setIsOpen(false);
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to add.', variant: 'destructive' });
    } finally { setLoading(false); }
  };

  const getProgress = () => {
    const current = BELIEF_LEVELS.find((l) => l.level === currentLevel);
    if (!current) return 100;
    const prev = BELIEF_LEVELS.find((l) => l.level === currentLevel - 1)?.requiredScore || 0;
    const range = current.requiredScore - prev;
    const progress = totalScore - prev;
    return Math.min(100, Math.max(0, (progress / range) * 100));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Belief Architecture</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Build unshakeable belief through evidence</p>
        </div>
        <Button onClick={() => setIsOpen(true)} className="bg-gradient-to-r from-blue-600 to-cyan-600">
          <Plus className="w-4 h-4 mr-2" />Add Evidence
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Trophy className="w-4 h-4 text-blue-500"/>Current Level</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">Level {currentLevel}</div><p className="text-xs text-slate-500">{BELIEF_LEVELS.find(l => l.level === currentLevel)?.name}</p></CardContent>
        </Card>
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="w-4 h-4 text-green-500"/>Total Score</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{totalScore}</div><p className="text-xs text-slate-500">Evidence points</p></CardContent>
        </Card>
        <Card className="border-violet-200 dark:border-violet-800">
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Target className="w-4 h-4 text-violet-500"/>Progress</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{Math.round(getProgress())}%</div><Progress value={getProgress()} className="mt-2"/></CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-yellow-500"/>Belief Levels</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {BELIEF_LEVELS.map((level) => {
                const isActive = level.level === currentLevel;
                const isCompleted = level.level < currentLevel;
                return (
                  <div key={level.level} className={`flex items-center gap-3 p-3 rounded-lg border ${isActive ? 'border-blue-500 bg-blue-50/50' : isCompleted ? 'border-green-500 bg-green-50/50' : 'border-slate-200 bg-slate-50/50'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isActive ? 'bg-blue-500' : isCompleted ? 'bg-green-500' : 'bg-slate-300'} text-white font-bold`}>{isCompleted ? <Trophy className="w-4 h-4"/> : level.level}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between"><span className="font-medium">{level.name}</span><span className="text-xs text-slate-500">{level.timeframe}</span></div>
                      <p className="text-xs text-slate-500 italic">&quot;{level.belief}&quot;</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Zap className="w-5 h-5 text-amber-500"/>Evidence Stack</CardTitle></CardHeader>
          <CardContent>
            {entries.length === 0 ? (
              <div className="text-center py-8">
                <Brain className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 mb-4">No evidence yet. Add your first piece!</p>
                <Button onClick={() => setIsOpen(true)} variant="outline"><Plus className="w-4 h-4 mr-2"/>Add Evidence</Button>
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {entries.map((entry) => (
                  <div key={entry.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{entry.evidence_type}</span>
                      <span className="text-sm font-semibold text-violet-600">+{entry.score * IMPACT_MULTIPLIERS[entry.impact]} pts</span>
                    </div>
                    <p className="text-sm text-slate-500">{entry.description}</p>
                    <div className="flex gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded ${entry.impact === 'large' ? 'bg-green-100 text-green-700' : entry.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>{entry.impact}</span>
                      <span className="text-xs text-slate-400">{new Date(entry.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Evidence</DialogTitle><DialogDescription>Record evidence to build belief</DialogDescription></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Evidence Type</Label><Input value={newEntry.evidenceType} onChange={(e) => setNewEntry({...newEntry, evidenceType: e.target.value})} placeholder="e.g., Completed project"/></div>
            <div className="space-y-2"><Label>Description</Label><Textarea value={newEntry.description} onChange={(e) => setNewEntry({...newEntry, description: e.target.value})} placeholder="What did you accomplish?"/></div>
            <div className="space-y-2"><Label>Impact</Label><div className="flex gap-2">{['small','medium','large'].map((i) => <Button key={i} variant={newEntry.impact === i ? 'default' : 'outline'} onClick={() => setNewEntry({...newEntry, impact: i})} className="flex-1">{i}</Button>)}</div></div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={addEntry} disabled={loading}>{loading ? 'Adding...' : 'Add'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
