'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  GraduationCap, 
  Trophy, 
  Clock, 
  CheckCircle2, 
  Circle,
  ChevronRight,
  Play,
  Lock,
  Award,
  TrendingUp,
  Brain,
  Target
} from 'lucide-react';

interface LearningPath {
  id: string;
  pathName: string;
  description: string;
  category: string;
  totalModules: number;
  completedModules: number;
  progressPercentage: number;
  status: string;
  estimatedHoursTotal: number;
  hoursSpent: number;
  priority: number;
}

interface Module {
  id: string;
  moduleNumber: number;
  title: string;
  description: string;
  isCompleted: boolean;
  contentType: string;
  timeSpentMinutes: number;
}

export default function LearningPathManager() {
  const [activeTab, setActiveTab] = useState('active');
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLearningPaths();
  }, []);

  const loadLearningPaths = async () => {
    try {
      setIsLoading(true);
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setLearningPaths([
        {
          id: '1',
          pathName: 'SaaS Founder Fundamentals',
          description: 'Learn to build and launch your first SaaS product from $0',
          category: 'technical',
          totalModules: 12,
          completedModules: 5,
          progressPercentage: 42,
          status: 'in_progress',
          estimatedHoursTotal: 24,
          hoursSpent: 10.5,
          priority: 9,
        },
        {
          id: '2',
          pathName: 'AI Agency Blueprint',
          description: 'Build a 6-figure AI automation agency',
          category: 'business',
          totalModules: 8,
          completedModules: 2,
          progressPercentage: 25,
          status: 'in_progress',
          estimatedHoursTotal: 16,
          hoursSpent: 4,
          priority: 8,
        },
        {
          id: '3',
          pathName: 'Content Creator Mastery',
          description: 'Grow a faceless YouTube empire',
          category: 'marketing',
          totalModules: 15,
          completedModules: 0,
          progressPercentage: 0,
          status: 'not_started',
          estimatedHoursTotal: 30,
          hoursSpent: 0,
          priority: 7,
        },
      ]);
    } catch (error) {
      console.error('Error loading learning paths:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectPath = async (path: LearningPath) => {
    setSelectedPath(path);
    // Load modules for selected path
    const mockModules: Module[] = Array.from({ length: path.totalModules }, (_, i) => ({
      id: `mod-${i + 1}`,
      moduleNumber: i + 1,
      title: `Module ${i + 1}: ${getModuleTitle(path.category, i)}`,
      description: 'Learn key concepts and apply them in practice exercises.',
      isCompleted: i < path.completedModules,
      contentType: i % 3 === 0 ? 'video' : i % 3 === 1 ? 'interactive' : 'quiz',
      timeSpentMinutes: i < path.completedModules ? 45 : 0,
    }));
    setModules(mockModules);
  };

  const getModuleTitle = (category: string, index: number) => {
    const titles: Record<string, string[]> = {
      technical: ['Setting Up Your Stack', 'Building Your MVP', 'User Authentication', 'Database Design', 'API Development', 'Frontend Basics', 'Deployment Strategy', 'Testing & QA', 'Performance Optimization', 'Security Essentials', 'Scaling Architecture', 'Maintenance & Monitoring'],
      business: ['Finding Your Niche', 'Client Acquisition', 'Pricing Strategies', 'Service Delivery', 'Team Building', 'Operations Management', 'Growth Tactics', 'Scaling to 6 Figures'],
      marketing: ['Channel Selection', 'Content Strategy', 'Video Production', 'SEO Optimization', 'Audience Building', 'Monetization Methods', 'Analytics & Tracking', 'Scaling Content Output'],
    };
    return titles[category]?.[index] || `Key Concept ${index + 1}`;
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ElementType> = {
      technical: Brain,
      business: TrendingUp,
      marketing: Target,
    };
    return icons[category] || BookOpen;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      technical: 'bg-blue-100 text-blue-700',
      business: 'bg-emerald-100 text-emerald-700',
      marketing: 'bg-purple-100 text-purple-700',
    };
    return colors[category] || 'bg-slate-100 text-slate-700';
  };

  const getContentTypeIcon = (type: string) => {
    const icons: Record<string, React.ElementType> = {
      video: Play,
      interactive: Brain,
      quiz: Award,
    };
    return icons[type] || BookOpen;
  };

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
          <GraduationCap className="w-8 h-8 text-violet-600" />
          Learning Path Manager
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Structured learning paths for each business archetype. Master the skills you need to succeed.
        </p>
      </div>

      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-violet-50 to-purple-50">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-violet-600">{learningPaths.length}</div>
              <div className="text-sm text-slate-600">Active Paths</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-violet-600">
                {Math.round(learningPaths.reduce((acc, p) => acc + p.progressPercentage, 0) / learningPaths.length)}%
              </div>
              <div className="text-sm text-slate-600">Avg Progress</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-violet-600">
                {learningPaths.reduce((acc, p) => acc + p.hoursSpent, 0).toFixed(1)}h
              </div>
              <div className="text-sm text-slate-600">Time Invested</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-violet-600">
                {learningPaths.reduce((acc, p) => acc + p.completedModules, 0)}
              </div>
              <div className="text-sm text-slate-600">Modules Done</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active Paths</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {!selectedPath ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {learningPaths
                .filter(p => p.status === 'in_progress')
                .map((path) => {
                  const Icon = getCategoryIcon(path.category);
                  const colorClass = getCategoryColor(path.category);
                  
                  return (
                    <Card 
                      key={path.id}
                      className="cursor-pointer hover:shadow-lg transition-all"
                      onClick={() => selectPath(path)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className={`p-2 rounded-lg ${colorClass}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <Badge className={colorClass}>
                            {path.category}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg mt-3">{path.pathName}</CardTitle>
                        <CardDescription>{path.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Progress</span>
                            <span className="font-medium">{path.progressPercentage}%</span>
                          </div>
                          <Progress value={path.progressPercentage} className="h-2" />
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            {path.completedModules}/{path.totalModules} modules
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {path.hoursSpent}h spent
                          </div>
                        </div>

                        <Button className="w-full">
                          <ChevronRight className="w-4 h-4 mr-2" />
                          Continue Learning
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedPath(null)}>
                      ← Back
                    </Button>
                    <div>
                      <CardTitle>{selectedPath.pathName}</CardTitle>
                      <CardDescription>{selectedPath.description}</CardDescription>
                    </div>
                  </div>
                  <Badge className={getCategoryColor(selectedPath.category)}>
                    {selectedPath.progressPercentage}% Complete
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {modules.map((module) => {
                    const ContentIcon = getContentTypeIcon(module.contentType);
                    
                    return (
                      <div 
                        key={module.id}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          module.isCompleted ? 'bg-emerald-50 border-emerald-200' : 'bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            module.isCompleted ? 'bg-emerald-100' : 'bg-slate-100'
                          }`}>
                            {module.isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            ) : (
                              <ContentIcon className="w-5 h-5 text-slate-600" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{module.title}</div>
                            <div className="text-sm text-slate-600">
                              {module.contentType} • {module.isCompleted ? `${module.timeSpentMinutes} min completed` : 'Not started'}
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant={module.isCompleted ? "outline" : "default"}
                          size="sm"
                          disabled={module.isCompleted}
                        >
                          {module.isCompleted ? 'Completed' : 'Start'}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardContent className="p-8 text-center">
              <Trophy className="w-12 h-12 mx-auto mb-4 text-amber-500" />
              <h3 className="text-lg font-semibold mb-2">No Completed Paths Yet</h3>
              <p className="text-slate-600">Keep learning! Your completed paths will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="available">
          <Card>
            <CardContent className="p-8 text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-violet-500" />
              <h3 className="text-lg font-semibold mb-2">All Learning Paths</h3>
              <p className="text-slate-600">Browse all available learning paths across all business archetypes.</p>
              <Button className="mt-4">Browse Library</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
