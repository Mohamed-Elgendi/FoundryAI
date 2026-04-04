'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Award, 
  Star, 
  TrendingUp, 
  Brain,
  Zap,
  Target,
  Wrench,
  Palette,
  Megaphone,
  Users,
  PenTool,
  ChevronRight,
  Plus,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  proficiencyLevel: number;
  yearsExperience: number;
  isTargetSkill: boolean;
  isCoreCompetency: boolean;
  projectsCompleted: number;
}

interface SkillCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  skills: Skill[];
}

export default function SkillMatrix() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const mockCategories: SkillCategory[] = [
        {
          id: '1',
          name: 'Technical Skills',
          icon: Brain,
          color: 'blue',
          skills: [
            { id: 't1', name: 'React/Next.js', description: 'Frontend framework mastery', category: 'technical', proficiencyLevel: 75, yearsExperience: 2.5, isTargetSkill: false, isCoreCompetency: true, projectsCompleted: 8 },
            { id: 't2', name: 'Node.js', description: 'Backend development', category: 'technical', proficiencyLevel: 60, yearsExperience: 2, isTargetSkill: true, isCoreCompetency: false, projectsCompleted: 5 },
            { id: 't3', name: 'AI Integration', description: 'LLM APIs and prompt engineering', category: 'technical', proficiencyLevel: 45, yearsExperience: 0.5, isTargetSkill: true, isCoreCompetency: false, projectsCompleted: 2 },
            { id: 't4', name: 'Database Design', description: 'SQL and NoSQL databases', category: 'technical', proficiencyLevel: 70, yearsExperience: 2, isTargetSkill: false, isCoreCompetency: true, projectsCompleted: 6 },
          ],
        },
        {
          id: '2',
          name: 'Business Skills',
          icon: TrendingUp,
          color: 'emerald',
          skills: [
            { id: 'b1', name: 'Product Strategy', description: 'Roadmap and feature prioritization', category: 'business', proficiencyLevel: 55, yearsExperience: 1.5, isTargetSkill: true, isCoreCompetency: false, projectsCompleted: 3 },
            { id: 'b2', name: 'Market Analysis', description: 'Competitive research and positioning', category: 'business', proficiencyLevel: 40, yearsExperience: 1, isTargetSkill: true, isCoreCompetency: false, projectsCompleted: 2 },
          ],
        },
        {
          id: '3',
          name: 'Marketing',
          icon: Megaphone,
          color: 'purple',
          skills: [
            { id: 'm1', name: 'Content Creation', description: 'Writing and media production', category: 'marketing', proficiencyLevel: 65, yearsExperience: 2, isTargetSkill: false, isCoreCompetency: true, projectsCompleted: 12 },
            { id: 'm2', name: 'SEO', description: 'Search engine optimization', category: 'marketing', proficiencyLevel: 50, yearsExperience: 1, isTargetSkill: true, isCoreCompetency: false, projectsCompleted: 4 },
          ],
        },
        {
          id: '4',
          name: 'Design',
          icon: Palette,
          color: 'pink',
          skills: [
            { id: 'd1', name: 'UI Design', description: 'Interface and visual design', category: 'design', proficiencyLevel: 70, yearsExperience: 2, isTargetSkill: false, isCoreCompetency: true, projectsCompleted: 10 },
            { id: 'd2', name: 'UX Research', description: 'User research and testing', category: 'design', proficiencyLevel: 55, yearsExperience: 1.5, isTargetSkill: true, isCoreCompetency: false, projectsCompleted: 5 },
          ],
        },
      ];
      
      setCategories(mockCategories);
    } catch (error) {
      console.error('Error loading skills:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getProficiencyColor = (level: number) => {
    if (level >= 80) return 'bg-emerald-500';
    if (level >= 60) return 'bg-blue-500';
    if (level >= 40) return 'bg-amber-500';
    return 'bg-slate-400';
  };

  const getProficiencyLabel = (level: number) => {
    if (level >= 80) return 'Expert';
    if (level >= 60) return 'Advanced';
    if (level >= 40) return 'Intermediate';
    return 'Beginner';
  };

  const filteredCategories = categories.map(cat => ({
    ...cat,
    skills: cat.skills.filter(skill => 
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(cat => cat.skills.length > 0);

  const totalSkills = categories.reduce((acc, cat) => acc + cat.skills.length, 0);
  const averageProficiency = categories.reduce((acc, cat) => 
    acc + cat.skills.reduce((skillAcc, skill) => skillAcc + skill.proficiencyLevel, 0), 0
  ) / totalSkills || 0;

  const targetSkills = categories.reduce((acc, cat) => 
    acc + cat.skills.filter(s => s.isTargetSkill).length, 0
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
          <Target className="w-8 h-8 text-violet-600" />
          Skill Matrix
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Track your skills across all domains. Identify gaps, set targets, and build your expertise.
        </p>
      </div>

      {/* Stats Overview */}
      <Card className="bg-gradient-to-r from-violet-50 to-purple-50">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-violet-600">{totalSkills}</div>
              <div className="text-sm text-slate-600">Total Skills</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-violet-600">{Math.round(averageProficiency)}%</div>
              <div className="text-sm text-slate-600">Avg Proficiency</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-violet-600">{targetSkills}</div>
              <div className="text-sm text-slate-600">Target Skills</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-violet-600">
                {categories.reduce((acc, cat) => acc + cat.skills.filter(s => s.isCoreCompetency).length, 0)}
              </div>
              <div className="text-sm text-slate-600">Core Competencies</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input
          placeholder="Search skills..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Skill Categories */}
      <div className="grid gap-6">
        {filteredCategories.map((category) => {
          const Icon = category.icon;
          const avgProficiency = category.skills.reduce((acc, s) => acc + s.proficiencyLevel, 0) / category.skills.length;
          
          return (
            <Card key={category.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-${category.color}-100`}>
                      <Icon className={`w-5 h-5 text-${category.color}-600`} />
                    </div>
                    <div>
                      <CardTitle>{category.name}</CardTitle>
                      <CardDescription>
                        {category.skills.length} skills • {Math.round(avgProficiency)}% avg proficiency
                      </CardDescription>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Skill
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {category.skills.map((skill) => (
                    <div 
                      key={skill.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-slate-50 cursor-pointer"
                      onClick={() => setSelectedSkill(skill)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12">
                          <Progress value={skill.proficiencyLevel} className={`h-2 ${getProficiencyColor(skill.proficiencyLevel)}`} />
                        </div>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {skill.name}
                            {skill.isCoreCompetency && (
                              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                            )}
                            {skill.isTargetSkill && (
                              <Target className="w-4 h-4 text-violet-500" />
                            )}
                          </div>
                          <div className="text-sm text-slate-600">{skill.description}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getProficiencyColor(skill.proficiencyLevel).replace('bg-', 'bg-opacity-20 text-')}>
                          {getProficiencyLabel(skill.proficiencyLevel)}
                        </Badge>
                        <div className="text-xs text-slate-500 mt-1">
                          {skill.projectsCompleted} projects
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Skill Detail Modal */}
      {selectedSkill && (
        <Card className="border-2 border-violet-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{selectedSkill.name}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setSelectedSkill(null)}>
                ✕
              </Button>
            </div>
            <CardDescription>{selectedSkill.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-slate-600">Proficiency</div>
                <div className="text-2xl font-bold">{selectedSkill.proficiencyLevel}%</div>
                <Progress value={selectedSkill.proficiencyLevel} className="h-2" />
              </div>
              <div className="space-y-1">
                <div className="text-sm text-slate-600">Experience</div>
                <div className="text-2xl font-bold">{selectedSkill.yearsExperience} years</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1">Update Progress</Button>
              <Button variant="outline">Find Learning Resources</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
