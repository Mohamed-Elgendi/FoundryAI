'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Smile, Frown, Meh, Zap, TrendingUp, Calendar, Heart } from 'lucide-react';

const EMOTIONS = [
  { id: 'excited', name: 'Excited', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
  { id: 'happy', name: 'Happy', icon: Smile, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
  { id: 'neutral', name: 'Neutral', icon: Meh, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { id: 'sad', name: 'Sad', icon: Frown, color: 'text-slate-500', bg: 'bg-slate-50 dark:bg-slate-900/20' },
  { id: 'stressed', name: 'Stressed', icon: Zap, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
];

export default function EmotionPage() {
  const [checkIns, setCheckIns] = useState<any[]>([]);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [note, setNote] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('foundryai_emotion_checkins');
    if (saved) setCheckIns(JSON.parse(saved));
  }, []);

  const recordEmotion = (emotionId: string) => {
    const checkIn = {
      id: Date.now(),
      emotion: emotionId,
      note: note,
      timestamp: new Date().toISOString(),
    };
    const updated = [checkIn, ...checkIns].slice(0, 30);
    setCheckIns(updated);
    localStorage.setItem('foundryai_emotion_checkins', JSON.stringify(updated));
    setNote('');
    setSelectedEmotion(null);
    toast({ title: 'Emotion recorded', description: 'Tracking your emotional journey' });
  };

  const getEmotionStats = () => {
    const stats: Record<string, number> = {};
    checkIns.forEach((c: any) => { stats[c.emotion] = (stats[c.emotion] || 0) + 1; });
    return stats;
  };

  const getDominantEmotion = () => {
    const stats = getEmotionStats();
    return Object.entries(stats).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  };

  const stats = getEmotionStats();
  const dominant = getDominantEmotion();
  const dominantEmotion = EMOTIONS.find(e => e.id === dominant);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Emotion Controller</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Track and navigate your emotional states</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-purple-200 dark:border-purple-800">
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Heart className="w-4 h-4 text-purple-500"/>Check-ins</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{checkIns.length}</div><p className="text-xs text-slate-500">Total recorded</p></CardContent>
        </Card>
        <Card className="border-pink-200 dark:border-pink-800">
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="w-4 h-4 text-pink-500"/>Dominant</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{dominantEmotion?.name || 'N/A'}</div><p className="text-xs text-slate-500">Most frequent</p></CardContent>
        </Card>
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-500"/>Today</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{checkIns.filter(c => new Date(c.timestamp).toDateString() === new Date().toDateString()).length}</div><p className="text-xs text-slate-500">Check-ins today</p></CardContent>
        </Card>
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Smile className="w-4 h-4 text-green-500"/>Positive</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{((stats.happy || 0) + (stats.excited || 0))}</div><p className="text-xs text-slate-500">Positive states</p></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Heart className="w-5 h-5 text-purple-500"/>How are you feeling?</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-3">
            {EMOTIONS.map((emotion) => {
              const Icon = emotion.icon;
              const count = stats[emotion.id] || 0;
              return (
                <button
                  key={emotion.id}
                  onClick={() => recordEmotion(emotion.id)}
                  className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${emotion.bg} border-transparent hover:border-current`}
                >
                  <Icon className={`w-8 h-8 mx-auto mb-2 ${emotion.color}`} />
                  <p className="text-sm font-medium">{emotion.name}</p>
                  <p className="text-xs text-slate-500">{count} times</p>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Recent Check-ins</h3>
        {checkIns.length === 0 ? (
          <Card className="border-dashed border-2 border-slate-200 dark:border-slate-700">
            <CardContent className="p-8 text-center"><p className="text-slate-500">No emotions recorded yet. How are you feeling now?</p></CardContent>
          </Card>
        ) : (
          checkIns.slice(0, 10).map((checkIn) => {
            const emotion = EMOTIONS.find(e => e.id === checkIn.emotion);
            const Icon = emotion?.icon || Meh;
            return (
              <Card key={checkIn.id} className={`${emotion?.bg || 'bg-slate-50'}`}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center">
                    <Icon className={`w-5 h-5 ${emotion?.color || 'text-slate-500'}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{emotion?.name || 'Unknown'}</p>
                    {checkIn.note && <p className="text-sm text-slate-500">{checkIn.note}</p>}
                    <p className="text-xs text-slate-400">{new Date(checkIn.timestamp).toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
