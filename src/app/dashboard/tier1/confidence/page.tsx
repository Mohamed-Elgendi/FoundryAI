'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Trophy, TrendingUp, Target, Plus, Star, Calendar } from 'lucide-react';
import { useAuth } from '@/layer-1-security/auth';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const CONFIDENCE_LEVELS = [
  { level: 1, name: 'Awareness', minScore: 0, maxScore: 25 },
  { level: 2, name: 'Building', minScore: 25, maxScore: 50 },
  { level: 3, name: 'Growing', minScore: 50, maxScore: 75 },
  { level: 4, name: 'Strong', minScore: 75, maxScore: 90 },
  { level: 5, name: 'Unshakeable', minScore: 90, maxScore: 100 },
];

export default function ConfidencePage() {
  const { user } = useAuth();
  if (!user) return null;

  const [wins, setWins] = useState([]);
  const [newWin, setNewWin] = useState('');
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('foundryai_confidence_wins');
    const savedScore = localStorage.getItem('foundryai_confidence_score');
    const savedStreak = localStorage.getItem('foundryai_confidence_streak');
    if (saved) setWins(JSON.parse(saved));
    if (savedScore) setConfidenceScore(parseInt(savedScore));
    if (savedStreak) setStreak(parseInt(savedStreak));
  }, []);

  const addWin = () => {
    if (!newWin.trim()) {
      toast({ title: 'Please enter a win', variant: 'destructive' });
      return;
    }
    const win = {
      id: Date.now(),
      text: newWin,
      date: new Date().toISOString(),
      impact: 5,
    };
    const updated = [win, ...wins];
    setWins(updated);
    const newScore = Math.min(100, confidenceScore + 5);
    setConfidenceScore(newScore);
    localStorage.setItem('foundryai_confidence_wins', JSON.stringify(updated));
    localStorage.setItem('foundryai_confidence_score', newScore.toString());
    setNewWin('');
    toast({ title: 'Win recorded!', description: '+5 confidence points' });
  };

  const getCurrentLevel = () => {
    return CONFIDENCE_LEVELS.find(l => confidenceScore >= l.minScore && confidenceScore < l.maxScore) || CONFIDENCE_LEVELS[4];
  };

  const progress = ((confidenceScore - getCurrentLevel().minScore) / (getCurrentLevel().maxScore - getCurrentLevel().minScore)) * 100;

  return (
    <DashboardShell user={user}>
      <div className="space-y-6">
        <Link href="/dashboard/tier1">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Tier 1
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Confidence Core</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Build unshakeable confidence through evidence stacking</p>
        </div>
        <ConfidenceCore />
      </div>
    </DashboardShell>
  );
}
