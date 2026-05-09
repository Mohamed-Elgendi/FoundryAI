'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Rocket, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Target,
  TrendingUp,
  Zap,
  ArrowRight,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface LaunchDay {
  day: number;
  title: string;
  description: string;
  tasks: LaunchTask[];
  focus: string;
  estimatedTime: string;
}

interface LaunchTask {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  aiAssistAvailable: boolean;
}

const LAUNCH_PROTOCOL: LaunchDay[] = [
  {
    day: 1,
    title: 'Opportunity Validation',
    description: 'Validate your opportunity with the 5-dimension scoring system',
    focus: 'Research & Analysis',
    estimatedTime: '2-3 hours',
    tasks: [
      { id: '1-1', title: 'Score opportunity on all 5 dimensions', completed: false, priority: 'high', aiAssistAvailable: true },
      { id: '1-2', title: 'Identify ideal customer profile', completed: false, priority: 'high', aiAssistAvailable: true },
      { id: '1-3', title: 'Validate market demand with 3 sources', completed: false, priority: 'high', aiAssistAvailable: true },
      { id: '1-4', title: 'Check competition landscape', completed: false, priority: 'medium', aiAssistAvailable: true },
    ]
  },
  {
    day: 2,
    title: 'Foundation Setup',
    description: 'Set up your technical and business foundation',
    focus: 'Infrastructure',
    estimatedTime: '3-4 hours',
    tasks: [
      { id: '2-1', title: 'Register domain name', completed: false, priority: 'high', aiAssistAvailable: false },
      { id: '2-2', title: 'Set up hosting/deployment', completed: false, priority: 'high', aiAssistAvailable: true },
      { id: '2-3', title: 'Create basic landing page', completed: false, priority: 'high', aiAssistAvailable: true },
      { id: '2-4', title: 'Set up analytics', completed: false, priority: 'medium', aiAssistAvailable: true },
    ]
  },
  {
    day: 3,
    title: 'Core MVP Build',
    description: 'Build the minimum viable product',
    focus: 'Development',
    estimatedTime: '4-6 hours',
    tasks: [
      { id: '3-1', title: 'Define core features (max 3)', completed: false, priority: 'high', aiAssistAvailable: true },
      { id: '3-2', title: 'Build essential functionality', completed: false, priority: 'high', aiAssistAvailable: true },
      { id: '3-3', title: 'Add payment integration', completed: false, priority: 'high', aiAssistAvailable: true },
      { id: '3-4', title: 'Basic error handling', completed: false, priority: 'medium', aiAssistAvailable: true },
    ]
  },
  {
    day: 4,
    title: 'Content & Copy',
    description: 'Create compelling copy and content',
    focus: 'Marketing',
    estimatedTime: '3-4 hours',
    tasks: [
      { id: '4-1', title: 'Write hero section copy', completed: false, priority: 'high', aiAssistAvailable: true },
      { id: '4-2', title: 'Create 3 benefit statements', completed: false, priority: 'high', aiAssistAvailable: true },
      { id: '4-3', title: 'Write FAQ section', completed: false, priority: 'medium', aiAssistAvailable: true },
      { id: '4-4', title: 'Set up email sequences', completed: false, priority: 'medium', aiAssistAvailable: true },
    ]
  },
  {
    day: 5,
    title: 'Soft Launch',
    description: 'Launch to your inner circle for feedback',
    focus: 'Validation',
    estimatedTime: '2-3 hours',
    tasks: [
      { id: '5-1', title: 'Share with 5 trusted contacts', completed: false, priority: 'high', aiAssistAvailable: false },
      { id: '5-2', title: 'Collect and document feedback', completed: false, priority: 'high', aiAssistAvailable: true },
      { id: '5-3', title: 'Fix critical issues', completed: false, priority: 'high', aiAssistAvailable: true },
      { id: '5-4', title: 'Prepare public launch materials', completed: false, priority: 'medium', aiAssistAvailable: true },
    ]
  },
  {
    day: 6,
    title: 'Public Launch',
    description: 'Go live to the world',
    focus: 'Launch',
    estimatedTime: '3-4 hours',
    tasks: [
      { id: '6-1', title: 'Post on social channels', completed: false, priority: 'high', aiAssistAvailable: true },
      { id: '6-2', title: 'Submit to relevant directories', completed: false, priority: 'medium', aiAssistAvailable: true },
      { id: '6-3', title: 'Reach out to 10 prospects', completed: false, priority: 'high', aiAssistAvailable: true },
      { id: '6-4', title: 'Enable all tracking', completed: false, priority: 'medium', aiAssistAvailable: true },
    ]
  },
  {
    day: 7,
    title: 'First Revenue Focus',
    description: 'Focus on getting first paying customers',
    focus: 'Sales',
    estimatedTime: '4-6 hours',
    tasks: [
      { id: '7-1', title: 'DM 20 potential customers', completed: false, priority: 'high', aiAssistAvailable: true },
      { id: '7-2', title: 'Offer intro discount', completed: false, priority: 'high', aiAssistAvailable: true },
      { id: '7-3', title: 'Follow up with interested leads', completed: false, priority: 'high', aiAssistAvailable: true },
      { id: '7-4', title: 'Document objections', completed: false, priority: 'medium', aiAssistAvailable: true },
    ]
  },
  {
    day: 8,
    title: 'Product Polish',
    description: 'Improve based on initial feedback',
    focus: 'Improvement',
    estimatedTime: '3-4 hours',
    tasks: [
      { id: '8-1', title: 'Fix top 3 user complaints', completed: false, priority: 'high', aiAssistAvailable: true },
      { id: '8-2', title: 'Add requested features (max 2)', completed: false, priority: 'medium', aiAssistAvailable: true },
      { id: '8-3', title: 'Improve onboarding flow', completed: false, priority: 'high', aiAssistAvailable: true },
      { id: '8-4', title: 'Update documentation', completed: false, priority: 'low', aiAssistAvailable: true },
    ]
  },
  {
    day: 9,
    title: 'Marketing Amplification',
    description: 'Scale your marketing efforts',
    focus: 'Growth',
    estimatedTime: '3-4 hours',
    tasks: [
      { id: '9-1', title: 'Create 3 pieces of content', completed: false, priority: 'high', aiAssistAvailable: true },
      { id: '9-2', title: 'Set up retargeting ads', completed: false, priority: 'medium', aiAssistAvailable: true },
      { id: '9-3', title: 'Reach out to micro-influencers', completed: false, priority: 'medium', aiAssistAvailable: true },
      { id: '9-4', title: 'Join 3 relevant communities', completed: false, priority: 'medium', aiAssistAvailable: true },
    ]
  },
  {
    day: 10,
    title: 'Partnership Push',
    description: 'Find strategic partners',
    focus: 'Partnerships',
    estimatedTime: '2-3 hours',
    tasks: [
      { id: '10-1', title: 'Identify 10 potential partners', completed: false, priority: 'high', aiAssistAvailable: true },
      { id: '10-2', title: 'Send 5 partnership proposals', completed: false, priority: 'high', aiAssistAvailable: true },
      { id: '10-3', title: 'Set up affiliate program', completed: false, priority: 'medium', aiAssistAvailable: true },
      { id: '10-4', title: 'Create partner resources', completed: false, priority: 'low', aiAssistAvailable: true },
    ]
  },
  {
    day: 11,
    title: 'Revenue Optimization',
    description: 'Optimize pricing and conversion',
    focus: 'Revenue',
    estimatedTime: '2-3 hours',
    tasks: [
      { id: '11-1', title: 'Analyze conversion funnel', completed: false, priority: 'high', aiAssistAvailable: true },
      { id: '11-2', title: 'A/B test pricing page', completed: false, priority: 'medium', aiAssistAvailable: true },
      { id: '11-3', title: 'Add upsells/cross-sells', completed: false, priority: 'medium', aiAssistAvailable: true },
      { id: '11-4', title: 'Implement exit intent', completed: false, priority: 'low', aiAssistAvailable: true },
    ]
  },
  {
    day: 12,
    title: 'Retention Systems',
    description: 'Build systems to keep customers',
    focus: 'Retention',
    estimatedTime: '3-4 hours',
    tasks: [
      { id: '12-1', title: 'Set up email onboarding sequence', completed: false, priority: 'high', aiAssistAvailable: true },
      { id: '12-2', title: 'Create help documentation', completed: false, priority: 'high', aiAssistAvailable: true },
      { id: '12-3', title: 'Add in-app guidance', completed: false, priority: 'medium', aiAssistAvailable: true },
      { id: '12-4', title: 'Set up feedback loops', completed: false, priority: 'medium', aiAssistAvailable: true },
    ]
  },
  {
    day: 13,
    title: 'Scale Preparation',
    description: 'Prepare infrastructure for growth',
    focus: 'Scaling',
    estimatedTime: '2-3 hours',
    tasks: [
      { id: '13-1', title: 'Performance optimization', completed: false, priority: 'high', aiAssistAvailable: true },
      { id: '13-2', title: 'Set up monitoring/alerts', completed: false, priority: 'high', aiAssistAvailable: true },
      { id: '13-3', title: 'Document key processes', completed: false, priority: 'medium', aiAssistAvailable: true },
      { id: '13-4', title: 'Plan hiring needs', completed: false, priority: 'low', aiAssistAvailable: true },
    ]
  },
  {
    day: 14,
    title: 'Review & Plan',
    description: 'Review progress and plan next phase',
    focus: 'Strategy',
    estimatedTime: '2 hours',
    tasks: [
      { id: '14-1', title: 'Analyze 14-day metrics', completed: false, priority: 'high', aiAssistAvailable: true },
      { id: '14-2', title: 'Document lessons learned', completed: false, priority: 'high', aiAssistAvailable: true },
      { id: '14-3', title: 'Set 30-day goals', completed: false, priority: 'high', aiAssistAvailable: true },
      { id: '14-4', title: 'Celebrate wins!', completed: false, priority: 'high', aiAssistAvailable: false },
    ]
  },
];

export function FourteenDayLaunchProtocol() {
  const [currentDay, setCurrentDay] = useState(1);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

  const toggleTask = (taskId: string) => {
    setCompletedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const getProgress = () => {
    const totalTasks = LAUNCH_PROTOCOL.reduce((acc, day) => acc + day.tasks.length, 0);
    return Math.round((completedTasks.size / totalTasks) * 100);
  };

  const getDayProgress = (day: LaunchDay) => {
    const completed = day.tasks.filter(t => completedTasks.has(t.id)).length;
    return Math.round((completed / day.tasks.length) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Rocket className="w-6 h-6 text-purple-600" />
            14-Day Launch Protocol
          </h2>
          <p className="text-muted-foreground">
            From idea to revenue in 14 days
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Overall Progress</p>
          <p className="text-3xl font-bold text-purple-600">{getProgress()}%</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress value={getProgress()} className="h-3" />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Day 1</span>
          <span>Day 14</span>
        </div>
      </div>

      {/* Day Timeline */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {LAUNCH_PROTOCOL.map((day) => {
          const progress = getDayProgress(day);
          const isActive = currentDay === day.day;
          const isCompleted = progress === 100;

          return (
            <button
              key={day.day}
              onClick={() => {
                setCurrentDay(day.day);
                setExpandedDay(day.day);
              }}
              className={`flex-shrink-0 p-3 rounded-lg border-2 text-left transition-all ${
                isActive
                  ? 'border-purple-500 bg-purple-50'
                  : isCompleted
                    ? 'border-green-500 bg-green-50'
                    : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-400" />
                )}
                <span className={`text-sm font-medium ${isActive ? 'text-purple-900' : ''}`}>
                  Day {day.day}
                </span>
              </div>
              <p className="text-xs text-muted-foreground w-24 truncate">{day.title}</p>
              <Progress value={progress} className="h-1 mt-2" />
            </button>
          );
        })}
      </div>

      {/* Current Day Detail */}
      {expandedDay && (
        <Card className="border-purple-200">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-purple-100 text-purple-800">
                    Day {LAUNCH_PROTOCOL[expandedDay - 1].day}
                  </Badge>
                  <Badge variant="outline">
                    <Clock className="w-3 h-3 mr-1" />
                    {LAUNCH_PROTOCOL[expandedDay - 1].estimatedTime}
                  </Badge>
                </div>
                <CardTitle className="text-xl">
                  {LAUNCH_PROTOCOL[expandedDay - 1].title}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {LAUNCH_PROTOCOL[expandedDay - 1].description}
                </p>
              </div>
              <div className="text-right">
                <Badge className="bg-blue-100 text-blue-800">
                  <Target className="w-3 h-3 mr-1" />
                  {LAUNCH_PROTOCOL[expandedDay - 1].focus}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                Today's Tasks
              </h4>

              <div className="space-y-2">
                {LAUNCH_PROTOCOL[expandedDay - 1].tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      completedTasks.has(task.id)
                        ? 'border-green-200 bg-green-50'
                        : 'border-slate-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="mt-0.5"
                      >
                        {completedTasks.has(task.id) ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-400" />
                        )}
                      </button>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${completedTasks.has(task.id) ? 'line-through text-slate-500' : ''}`}>
                            {task.title}
                          </span>
                          {task.aiAssistAvailable && (
                            <Badge variant="secondary" className="text-xs">
                              <Sparkles className="w-3 h-3 mr-1" />
                              AI Assist
                            </Badge>
                          )}
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-xs mt-1 ${
                            task.priority === 'high'
                              ? 'border-red-200 text-red-700'
                              : task.priority === 'medium'
                                ? 'border-yellow-200 text-yellow-700'
                                : 'border-slate-200 text-slate-600'
                          }`}
                        >
                          {task.priority} priority
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setExpandedDay(Math.max(1, expandedDay - 1))}
                disabled={expandedDay === 1}
              >
                Previous Day
              </Button>
              <Button
                onClick={() => setExpandedDay(Math.min(14, expandedDay + 1))}
                disabled={expandedDay === 14}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                Next Day
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips Card */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-purple-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-purple-900">Launch Protocol Tips</h4>
              <ul className="text-sm text-purple-800 mt-2 space-y-1">
                <li>• Complete high-priority tasks first</li>
                <li>• Use AI Assist for faster completion</li>
                <li>• Don't skip days - momentum compounds</li>
                <li>• Document learnings as you go</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default FourteenDayLaunchProtocol;
