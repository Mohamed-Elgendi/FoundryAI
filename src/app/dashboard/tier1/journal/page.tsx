'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Sun, Moon, TrendingUp, Calendar, Save } from 'lucide-react';

const MORNING_PROMPTS = [
  "What am I grateful for today?",
  "What would make today great?",
  "What is my main focus for today?",
  "How do I want to feel today?",
];

const EVENING_PROMPTS = [
  "What went well today?",
  "What did I learn today?",
  "What am I proud of?",
  "How can I improve tomorrow?",
];

export default function JournalPage() {
  const [entries, setEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [entryType, setEntryType] = useState('morning');
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('foundryai_journal_entries');
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  const saveEntry = () => {
    if (!currentEntry.trim()) {
      toast({ title: 'Please write something', variant: 'destructive' });
      return;
    }
    const entry = {
      id: Date.now(),
      text: currentEntry,
      prompt: selectedPrompt,
      type: entryType,
      date: new Date().toISOString(),
    };
    const updated = [entry, ...entries];
    setEntries(updated);
    localStorage.setItem('foundryai_journal_entries', JSON.stringify(updated));
    setCurrentEntry('');
    setSelectedPrompt('');
    toast({ title: 'Entry saved!', description: 'Your reflection has been recorded' });
  };

  const prompts = entryType === 'morning' ? MORNING_PROMPTS : EVENING_PROMPTS;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Affirmation & Journaling</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Morning and evening rituals for mind-body-soul alignment</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-orange-200 dark:border-orange-800">
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><BookOpen className="w-4 h-4 text-orange-500"/>Entries</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{entries.length}</div><p className="text-xs text-slate-500">Total journal entries</p></CardContent>
        </Card>
        <Card className="border-yellow-200 dark:border-yellow-800">
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Sun className="w-4 h-4 text-yellow-500"/>Morning</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{entries.filter(e => e.type === 'morning').length}</div><p className="text-xs text-slate-500">Morning entries</p></CardContent>
        </Card>
        <Card className="border-indigo-200 dark:border-indigo-800">
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Moon className="w-4 h-4 text-indigo-500"/>Evening</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{entries.filter(e => e.type === 'evening').length}</div><p className="text-xs text-slate-500">Evening entries</p></CardContent>
        </Card>
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Calendar className="w-4 h-4 text-green-500"/>Streak</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{entries.length > 0 ? Math.ceil(entries.length / 2) : 0}</div><p className="text-xs text-slate-500">Day streak</p></CardContent>
        </Card>
      </div>

      <div className="flex gap-2">
        <Button onClick={() => setEntryType('morning')} variant={entryType === 'morning' ? 'default' : 'outline'} className="flex-1"><Sun className="w-4 h-4 mr-2"/>Morning Entry</Button>
        <Button onClick={() => setEntryType('evening')} variant={entryType === 'evening' ? 'default' : 'outline'} className="flex-1"><Moon className="w-4 h-4 mr-2"/>Evening Entry</Button>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2">{entryType === 'morning' ? <Sun className="w-5 h-5 text-yellow-500"/> : <Moon className="w-5 h-5 text-indigo-500"/>} {entryType === 'morning' ? 'Morning' : 'Evening'} Reflection</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {prompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => { setSelectedPrompt(prompt); setCurrentEntry(prompt + '\n\n'); }}
                className={`text-sm px-3 py-1.5 rounded-full border transition-all ${selectedPrompt === prompt ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-400'}`}
              >
                {prompt}
              </button>
            ))}
          </div>
          <Textarea placeholder="Write your thoughts here..." value={currentEntry} onChange={(e) => setCurrentEntry(e.target.value)} className="min-h-[200px]" />
          <Button onClick={saveEntry} className="w-full bg-gradient-to-r from-orange-500 to-pink-500"><Save className="w-4 h-4 mr-2"/>Save Entry</Button>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2"><BookOpen className="w-5 h-5 text-orange-500"/>Recent Entries</h3>
        {entries.length === 0 ? (
          <Card className="border-dashed border-2 border-slate-200 dark:border-slate-700">
            <CardContent className="p-8 text-center"><p className="text-slate-500">No entries yet. Start your journaling practice above!</p></CardContent>
          </Card>
        ) : (
          entries.slice(0, 10).map((entry) => (
            <Card key={entry.id} className={`${entry.type === 'morning' ? 'border-yellow-100 dark:border-yellow-900' : 'border-indigo-100 dark:border-indigo-900'}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  {entry.type === 'morning' ? <Sun className="w-4 h-4 text-yellow-500"/> : <Moon className="w-4 h-4 text-indigo-500"/>}
                  <span className="text-xs text-slate-400">{new Date(entry.date).toLocaleString()}</span>
                </div>
                <p className="text-slate-900 dark:text-white whitespace-pre-wrap">{entry.text}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
