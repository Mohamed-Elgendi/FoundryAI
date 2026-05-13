'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Brain, Sparkles, Plus, Trash2, Tag, Archive } from 'lucide-react';

export default function BrainDumpPage() {
  const [thoughts, setThoughts] = useState<any[]>([]);
  const [newThought, setNewThought] = useState('');
  const [tags, setTags] = useState('');
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('foundryai_braindump');
    if (saved) setThoughts(JSON.parse(saved));
    setMounted(true);
  }, []);

  const saveThoughts = (updated: any[]) => {
    setThoughts(updated);
    localStorage.setItem('foundryai_braindump', JSON.stringify(updated));
  };

  const addThought = () => {
    if (!newThought.trim()) {
      toast({ title: 'Please enter a thought', variant: 'destructive' });
      return;
    }
    const thought = {
      id: Date.now(),
      text: newThought,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
    };
    saveThoughts([thought, ...thoughts]);
    setNewThought('');
    setTags('');
    toast({ title: 'Thought captured!', description: 'Your idea has been saved' });
  };

  const deleteThought = (id: string) => {
    saveThoughts(thoughts.filter(t => t.id !== id));
    toast({ title: 'Thought deleted' });
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Brain Dump</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Clear your mind and let AI organize your thoughts</p>
        </div>
        <div className="flex gap-2">
          <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{thoughts.length}</span>
            <span className="text-sm text-slate-500 ml-2">thoughts</span>
          </div>
        </div>
      </div>

      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader><CardTitle className="flex items-center gap-2"><Brain className="w-5 h-5 text-blue-500"/>Capture Thought</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Textarea placeholder="What's on your mind? Dump everything here without worrying about organization..." value={newThought} onChange={(e) => setNewThought(e.target.value)} className="min-h-[120px]" />
          <div className="flex gap-2">
            <Input placeholder="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} className="flex-1" />
            <Button onClick={addThought} className="bg-gradient-to-r from-blue-600 to-cyan-600"><Plus className="w-4 h-4 mr-2"/>Add Thought</Button>
          </div>
        </CardContent>
      </Card>

      {thoughts.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-200 dark:border-slate-700">
          <CardContent className="p-8 text-center">
            <Archive className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400">No thoughts yet. Start dumping your ideas above!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {thoughts.map((thought) => (
            <Card key={thought.id} className="group hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <p className="text-slate-900 dark:text-white whitespace-pre-wrap">{thought.text}</p>
                {thought.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {thought.tags.map((tag: string, i: number) => (
                      <span key={i} className="text-xs px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-400 flex items-center gap-1"><Tag className="w-3 h-3"/>{tag}</span>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-400">{new Date(thought.createdAt).toLocaleString()}</span>
                  <Button variant="ghost" size="sm" onClick={() => deleteThought(thought.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4"/></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
