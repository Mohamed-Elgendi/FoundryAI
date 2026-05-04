'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Lightbulb, Plus, CheckCircle } from 'lucide-react';

export default function IdeaExtractionPage() {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('foundryai_ideas');
    if (saved) setIdeas(JSON.parse(saved));
  }, []);

  const addIdea = () => {
    if (!title.trim()) { toast({ title: 'Enter a title', variant: 'destructive' }); return; }
    const idea = { id: Date.now(), title, description: desc, status: 'draft', createdAt: new Date().toISOString() };
    const updated = [idea, ...ideas];
    setIdeas(updated);
    localStorage.setItem('foundryai_ideas', JSON.stringify(updated));
    setTitle(''); setDesc('');
    toast({ title: 'Idea saved!' });
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold text-slate-900 dark:text-white">Idea Extraction</h1><p className="text-slate-600 dark:text-slate-400 mt-1">Transform thoughts into business concepts</p></div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Lightbulb className="w-4 h-4 text-yellow-500"/>Ideas</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{ideas.length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500"/>Validated</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{ideas.filter(i => i.status === 'validated').length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Plus className="w-4 h-4 text-blue-500"/>Draft</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{ideas.filter(i => i.status === 'draft').length}</div></CardContent></Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Capture New Idea</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Idea title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea placeholder="Description..." value={desc} onChange={(e) => setDesc(e.target.value)} />
          <Button onClick={addIdea} className="w-full bg-gradient-to-r from-yellow-500 to-orange-500">Add Idea</Button>
        </CardContent>
      </Card>
      <div className="space-y-3">
        {ideas.map((idea) => (
          <Card key={idea.id} className={idea.status === 'validated' ? 'border-green-200' : 'border-slate-200'}>
            <CardContent className="p-4">
              <h3 className="font-semibold">{idea.title}</h3>
              <p className="text-sm text-slate-500">{idea.description}</p>
              <span className="text-xs text-slate-400">{new Date(idea.createdAt).toLocaleDateString()}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
