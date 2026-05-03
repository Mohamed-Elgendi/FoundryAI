'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, TrendingUp, Clock, Award, Plus } from 'lucide-react';

export default function LearningPage() {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('foundryai_courses');
    if (saved) setCourses(JSON.parse(saved));
  }, []);

  const addCourse = () => {
    if (!newCourse.trim()) { toast({ title: 'Enter course name', variant: 'destructive' }); return; }
    const course = { id: Date.now(), name: newCourse, progress: 0, hours: 0 };
    const updated = [course, ...courses];
    setCourses(updated);
    localStorage.setItem('foundryai_courses', JSON.stringify(updated));
    setNewCourse('');
    toast({ title: 'Course added!' });
  };

  const updateProgress = (id, delta) => {
    const updated = courses.map(c => c.id === id ? { ...c, progress: Math.min(100, Math.max(0, c.progress + delta)) } : c);
    setCourses(updated);
    localStorage.setItem('foundryai_courses', JSON.stringify(updated));
  };

  const totalHours = courses.reduce((sum, c) => sum + c.hours, 0);
  const completed = courses.filter(c => c.progress === 100).length;

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold text-slate-900 dark:text-white">Learning Center</h1><p className="text-slate-600 dark:text-slate-400 mt-1">Track your courses and skill development</p></div>
      
      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><BookOpen className="w-4 h-4 text-blue-500"/>Courses</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{courses.length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Award className="w-4 h-4 text-green-500"/>Completed</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{completed}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Clock className="w-4 h-4 text-orange-500"/>Hours</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{totalHours}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="w-4 h-4 text-violet-500"/>Avg Progress</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{courses.length ? Math.round(courses.reduce((a, b) => a + b.progress, 0) / courses.length) : 0}%</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="w-5 h-5"/>Add Course</CardTitle></CardHeader>
        <CardContent className="flex gap-2">
          <Input placeholder="Course name" value={newCourse} onChange={(e) => setNewCourse(e.target.value)} />
          <Button onClick={addCourse}>Add</Button>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {courses.map((course) => (
          <Card key={course.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">{course.name}</h3>
                <span className="text-sm font-bold">{course.progress}%</span>
              </div>
              <Progress value={course.progress} className="mb-3" />
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => updateProgress(course.id, -10)}>-10%</Button>
                <Button size="sm" variant="outline" onClick={() => updateProgress(course.id, 10)}>+10%</Button>
                {course.progress === 100 && <span className="ml-auto text-green-600 flex items-center gap-1"><Award className="w-4 h-4"/>Completed!</span>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
