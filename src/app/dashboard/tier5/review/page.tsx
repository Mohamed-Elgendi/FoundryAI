'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Calendar, CheckCircle, TrendingUp, Clock, RotateCcw } from 'lucide-react';

const REVIEW_AREAS = [
  { id: 'wins', name: 'Daily Wins', icon: CheckCircle },
  { id: 'challenges', name: 'Challenges', icon: RotateCcw },
  { id: 'learnings', name: 'Learnings', icon: TrendingUp },
  { id: 'tomorrow', name: 'Tomorrow Goals', icon: Clock },
];

export default function ReviewPage() {
  const [reviews, setReviews] = useState([]);
  const [currentReview, setCurrentReview] = useState({ wins: '', challenges: '', learnings: '', tomorrow: '' });
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('foundryai_reviews');
    if (saved) setReviews(JSON.parse(saved));
  }, []);

  const saveReview = () => {
    const review = { id: Date.now(), ...currentReview, date: new Date().toISOString() };
    const updated = [review, ...reviews].slice(0, 30);
    setReviews(updated);
    localStorage.setItem('foundryai_reviews', JSON.stringify(updated));
    setCurrentReview({ wins: '', challenges: '', learnings: '', tomorrow: '' });
    toast({ title: 'Review saved!' });
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold text-slate-900 dark:text-white">Daily Review</h1><p className="text-slate-600 dark:text-slate-400 mt-1">Reflect on your day and plan tomorrow</p></div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-500"/>Reviews</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{reviews.length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500"/>Streak</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{reviews.length > 0 ? Math.ceil(reviews.length / 2) : 0}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="w-4 h-4 text-violet-500"/>Today</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{reviews.filter(r => new Date(r.date).toDateString() === new Date().toDateString()).length > 0 ? 'Done' : 'Pending'}</div></CardContent></Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {REVIEW_AREAS.map((area) => {
          const Icon = area.icon;
          return (
            <Card key={area.id}>
              <CardHeader><CardTitle className="flex items-center gap-2"><Icon className="w-5 h-5"/>{area.name}</CardTitle></CardHeader>
              <CardContent>
                <Textarea placeholder={`Enter your ${area.name.toLowerCase()}...`} value={currentReview[area.id]} onChange={(e) => setCurrentReview({...currentReview, [area.id]: e.target.value})} className="min-h-[100px]" />
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Button onClick={saveReview} className="w-full bg-gradient-to-r from-blue-500 to-violet-500">Save Daily Review</Button>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Recent Reviews</h3>
        {reviews.slice(0, 5).map((review) => (
          <Card key={review.id}>
            <CardContent className="p-4">
              <p className="text-xs text-slate-400 mb-2">{new Date(review.date).toLocaleDateString()}</p>
              {review.wins && <p className="text-sm"><span className="font-medium">Wins:</span> {review.wins}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
