'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Award, TrendingUp, Target, Zap, Plus } from 'lucide-react';

const SKILL_CATEGORIES = ['Technical', 'Business', 'Creative', 'Leadership', 'Marketing'];

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ name: '', category: 'Technical', level: 1 });
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('foundryai_skills');
    if (saved) setSkills(JSON.parse(saved));
  }, []);

  const addSkill = () => {
    if (!newSkill.name.trim()) { toast({ title: 'Enter skill name', variant: 'destructive' }); return; }
    const skill = { id: Date.now(), ...newSkill, xp: newSkill.level * 100 };
    const updated = [skill, ...skills];
    setSkills(updated);
    localStorage.setItem('foundryai_skills', JSON.stringify(updated));
    setNewSkill({ name: '', category: 'Technical', level: 1 });
    toast({ title: 'Skill added!' });
  };

  const levelUp = (id) => {
    const updated = skills.map(s => s.id === id ? { ...s, level: Math.min(10, s.level + 1), xp: s.xp + 100 } : s);
    setSkills(updated);
    localStorage.setItem('foundryai_skills', JSON.stringify(updated));
    toast({ title: 'Level up!' });
  };

  const avgLevel = skills.length ? (skills.reduce((a, b) => a + b.level, 0) / skills.length).toFixed(1) : 0;
  const totalXp = skills.reduce((sum, s) => sum + s.xp, 0);

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold text-slate-900 dark:text-white">Skill Matrix</h1><p className="text-slate-600 dark:text-slate-400 mt-1">Track skills across all domains</p></div>
      
      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Award className="w-4 h-4 text-yellow-500"/>Skills</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{skills.length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-500"/>Avg Level</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{avgLevel}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Zap className="w-4 h-4 text-orange-500"/>Total XP</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{totalXp}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Target className="w-4 h-4 text-green-500"/>Mastery</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{skills.filter(s => s.level >= 8).length}</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="w-5 h-5"/>Add Skill</CardTitle></CardHeader>
        <CardContent className="flex gap-2">
          <Input placeholder="Skill name" value={newSkill.name} onChange={(e) => setNewSkill({...newSkill, name: e.target.value})} />
          <select value={newSkill.category} onChange={(e) => setNewSkill({...newSkill, category: e.target.value})} className="rounded-md border px-3">
            {SKILL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <Button onClick={addSkill}>Add</Button>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {skills.map((skill) => (
          <Card key={skill.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <div><h3 className="font-semibold">{skill.name}</h3><p className="text-xs text-slate-500">{skill.category}</p></div>
                <span className="text-sm font-bold">Lvl {skill.level}</span>
              </div>
              <Progress value={(skill.level / 10) * 100} className="mb-2" />
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">{skill.xp} XP</span>
                <Button size="sm" onClick={() => levelUp(skill.id)}>Level Up</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
