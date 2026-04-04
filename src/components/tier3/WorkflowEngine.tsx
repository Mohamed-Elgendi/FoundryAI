'use client';

import React, { useState, useEffect } from 'react';
import { getSupabaseBrowserClient } from '@/layer-3-data/storage/supabase-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Rocket,
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  ArrowRight,
  AlertCircle,
  Zap,
  Target,
  TrendingUp,
  ChevronRight,
  ChevronDown,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface WorkflowTask {
  id: string;
  day: number;
  title: string;
  description: string;
  estimatedTime: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  archetype: string;
  dependencies: string[];
  aiPrompt: string;
  deliverables: string[];
}

interface WorkflowInstance {
  id: string;
  projectName: string;
  archetype: string;
  startDate: string;
  currentDay: number;
  totalDays: number;
  status: 'active' | 'paused' | 'completed';
  completionPercentage: number;
  tasks: WorkflowTask[];
}

// 14-Day Launch Protocol for each archetype
const LAUNCH_PROTOCOLS: Record<string, WorkflowTask[]> = {
  saas: [
    { id: 'saas-1', day: 1, title: 'Problem Validation', description: 'Validate the problem with 5 potential customers', estimatedTime: '4 hours', status: 'pending', archetype: 'saas', dependencies: [], aiPrompt: 'Create a customer interview script for validating [PROBLEM]. Include 10 discovery questions.', deliverables: ['Interview script', '5 scheduled calls'] },
    { id: 'saas-2', day: 1, title: 'Competitor Analysis', description: 'Research 3 direct competitors and document their positioning', estimatedTime: '3 hours', status: 'pending', archetype: 'saas', dependencies: [], aiPrompt: 'Analyze competitors [COMPETITOR1], [COMPETITOR2], [COMPETITOR3]. Create comparison matrix of features, pricing, and positioning.', deliverables: ['Competitor matrix', 'Differentiation strategy'] },
    { id: 'saas-3', day: 2, title: 'Solution Design', description: 'Define MVP feature set and user flows', estimatedTime: '5 hours', status: 'pending', archetype: 'saas', dependencies: ['saas-1'], aiPrompt: 'Design MVP feature set for [SOLUTION]. Prioritize must-have vs nice-to-have. Create user flow diagrams.', deliverables: ['Feature list', 'User flows', 'Wireframes'] },
    { id: 'saas-4', day: 3, title: 'Tech Stack Setup', description: 'Initialize project with Next.js, Supabase, and deployment', estimatedTime: '4 hours', status: 'pending', archetype: 'saas', dependencies: ['saas-3'], aiPrompt: 'Generate project setup commands for Next.js 15 + TypeScript + Tailwind + shadcn/ui + Supabase. Include folder structure.', deliverables: ['GitHub repo', 'Local dev environment', 'Staging deploy'] },
    { id: 'saas-5', day: 4, title: 'Database Schema', description: 'Design and implement core database tables', estimatedTime: '5 hours', status: 'pending', archetype: 'saas', dependencies: ['saas-4'], aiPrompt: 'Create Supabase SQL schema for [CORE_ENTITIES]. Include RLS policies, indexes, and TypeScript types.', deliverables: ['SQL migration', 'TypeScript types', 'Test data'] },
    { id: 'saas-6', day: 5, title: 'Authentication', description: 'Implement auth with email and social providers', estimatedTime: '4 hours', status: 'pending', archetype: 'saas', dependencies: ['saas-5'], aiPrompt: 'Build authentication system with Supabase Auth. Include email/password, Google OAuth, and protected routes.', deliverables: ['Login/signup pages', 'Auth context', 'Protected routes'] },
    { id: 'saas-7', day: 6, title: 'Core Feature 1', description: 'Build the primary value-delivering feature', estimatedTime: '8 hours', status: 'pending', archetype: 'saas', dependencies: ['saas-6'], aiPrompt: 'Implement [CORE_FEATURE] with CRUD operations, real-time updates, and optimistic UI.', deliverables: ['Feature working', 'API routes', 'UI components'] },
    { id: 'saas-8', day: 7, title: 'Core Feature 2', description: 'Build secondary critical feature', estimatedTime: '6 hours', status: 'pending', archetype: 'saas', dependencies: ['saas-7'], aiPrompt: 'Build [SECONDARY_FEATURE] integrating with core feature. Include data visualization.', deliverables: ['Feature working', 'Integration tests'] },
    { id: 'saas-9', day: 8, title: 'Landing Page', description: 'Create marketing site with value prop and CTA', estimatedTime: '5 hours', status: 'pending', archetype: 'saas', dependencies: [], aiPrompt: 'Design landing page with hero section, features, testimonials, pricing, and FAQ. Include conversion-optimized copy.', deliverables: ['Landing page', 'Responsive design', 'Analytics setup'] },
    { id: 'saas-10', day: 9, title: 'Payment Integration', description: 'Add Stripe for subscriptions and billing', estimatedTime: '6 hours', status: 'pending', archetype: 'saas', dependencies: ['saas-7'], aiPrompt: 'Integrate Stripe Checkout for subscriptions. Include webhook handling and subscription management.', deliverables: ['Checkout flow', 'Webhook handler', 'Subscription UI'] },
    { id: 'saas-11', day: 10, title: 'Onboarding Flow', description: 'Build user onboarding with progress tracking', estimatedTime: '5 hours', status: 'pending', archetype: 'saas', dependencies: ['saas-7'], aiPrompt: 'Create multi-step onboarding with progress bar, tooltips, and activation milestones.', deliverables: ['Onboarding component', 'Progress tracking', 'Help tooltips'] },
    { id: 'saas-12', day: 11, title: 'Email System', description: 'Set up transactional and marketing emails', estimatedTime: '4 hours', status: 'pending', archetype: 'saas', dependencies: ['saas-10'], aiPrompt: 'Configure Resend for transactional emails. Create welcome sequence, password reset, and notification templates.', deliverables: ['Email templates', 'Send API', 'Welcome sequence'] },
    { id: 'saas-13', day: 12, title: 'Polish & QA', description: 'Fix bugs, add loading states, and test', estimatedTime: '6 hours', status: 'pending', archetype: 'saas', dependencies: ['saas-11'], aiPrompt: 'Add error boundaries, loading skeletons, toast notifications, and empty states. Test all user flows.', deliverables: ['Bug fixes', 'Loading states', 'Error handling'] },
    { id: 'saas-14', day: 13, title: 'Launch Prep', description: 'Prepare launch materials and distribution plan', estimatedTime: '5 hours', status: 'pending', archetype: 'saas', dependencies: ['saas-12'], aiPrompt: 'Create Product Hunt listing, Twitter thread, Reddit posts, and launch checklist. Schedule launch time.', deliverables: ['Launch copy', 'Social posts', 'Schedule'] },
    { id: 'saas-15', day: 14, title: 'LAUNCH DAY', description: 'Execute launch and monitor metrics', estimatedTime: '8 hours', status: 'pending', archetype: 'saas', dependencies: ['saas-14'], aiPrompt: 'Monitor launch metrics, respond to feedback, fix critical bugs, and engage with community. Document learnings.', deliverables: ['Live product', 'Signups tracked', 'Feedback collected'] },
  ],
  
  digital_products: [
    { id: 'dp-1', day: 1, title: 'Market Research', description: 'Validate demand and identify customer pain points', estimatedTime: '4 hours', status: 'pending', archetype: 'digital_products', dependencies: [], aiPrompt: 'Research [NICHE] market. Find 5 communities where target customers hang out. Identify top 10 pain points.', deliverables: ['Research doc', 'Pain point list', 'Community map'] },
    { id: 'dp-2', day: 2, title: 'Product Concept', description: 'Define product scope and unique positioning', estimatedTime: '3 hours', status: 'pending', archetype: 'digital_products', dependencies: ['dp-1'], aiPrompt: 'Define [PRODUCT] scope, format, and deliverables. Create unique positioning vs competitors.', deliverables: ['Product outline', 'Positioning statement', 'Format decision'] },
    { id: 'dp-3', day: 3, title: 'Content Creation - Part 1', description: 'Create first 25% of product content', estimatedTime: '6 hours', status: 'pending', archetype: 'digital_products', dependencies: ['dp-2'], aiPrompt: 'Create [MODULE1] content with actionable steps, examples, and templates. Include video/script.', deliverables: ['Module 1 content', 'Templates', 'Examples'] },
    { id: 'dp-4', day: 4, title: 'Content Creation - Part 2', description: 'Create next 25% of product content', estimatedTime: '6 hours', status: 'pending', archetype: 'digital_products', dependencies: ['dp-3'], aiPrompt: 'Build [MODULE2] with frameworks, worksheets, and implementation guides.', deliverables: ['Module 2 content', 'Frameworks', 'Worksheets'] },
    { id: 'dp-5', day: 5, title: 'Content Creation - Part 3', description: 'Create third section of product', estimatedTime: '6 hours', status: 'pending', archetype: 'digital_products', dependencies: ['dp-4'], aiPrompt: 'Develop [MODULE3] with advanced strategies, case studies, and bonus materials.', deliverables: ['Module 3 content', 'Case studies', 'Bonuses'] },
    { id: 'dp-6', day: 6, title: 'Content Completion', description: 'Finish remaining content and edit', estimatedTime: '6 hours', status: 'pending', archetype: 'digital_products', dependencies: ['dp-5'], aiPrompt: 'Complete [MODULE4], add conclusion, edit all content for clarity and actionability.', deliverables: ['Complete product', 'Edited content', 'Final assets'] },
    { id: 'dp-7', day: 7, title: 'Design & Branding', description: 'Create visual design and brand assets', estimatedTime: '5 hours', status: 'pending', archetype: 'digital_products', dependencies: ['dp-6'], aiPrompt: 'Design product branding, create Canva templates for worksheets, format PDFs professionally.', deliverables: ['Brand kit', 'Designed PDFs', 'Templates'] },
    { id: 'dp-8', day: 8, title: 'Sales Page', description: 'Build high-converting sales page', estimatedTime: '6 hours', status: 'pending', archetype: 'digital_products', dependencies: ['dp-7'], aiPrompt: 'Write sales page with PAS framework, testimonials section, FAQ, and urgency elements. Include mockups.', deliverables: ['Sales page copy', 'Gumroad setup', 'Product mockups'] },
    { id: 'dp-9', day: 9, title: 'Email Sequence', description: 'Create pre-launch and launch email series', estimatedTime: '4 hours', status: 'pending', archetype: 'digital_products', dependencies: ['dp-8'], aiPrompt: 'Write 5-email pre-launch sequence and 3-email launch sequence with storytelling and CTAs.', deliverables: ['Email sequence', 'Subject lines', 'Send schedule'] },
    { id: 'dp-10', day: 10, title: 'Lead Magnet', description: 'Create free lead magnet to build list', estimatedTime: '4 hours', status: 'pending', archetype: 'digital_products', dependencies: ['dp-9'], aiPrompt: 'Create free [LEAD_MAGNET] related to main product. Design opt-in page and delivery email.', deliverables: ['Lead magnet', 'Opt-in page', 'Delivery email'] },
    { id: 'dp-11', day: 11, title: 'Content Marketing', description: 'Create content to drive awareness', estimatedTime: '5 hours', status: 'pending', archetype: 'digital_products', dependencies: ['dp-10'], aiPrompt: 'Write 3 blog posts, create Twitter thread, and design infographic related to product topic.', deliverables: ['Blog posts', 'Social content', 'Infographic'] },
    { id: 'dp-12', day: 12, title: 'Beta Testing', description: 'Get feedback from beta users', estimatedTime: '4 hours', status: 'pending', archetype: 'digital_products', dependencies: ['dp-11'], aiPrompt: 'Recruit 5 beta testers, send product, collect feedback, make improvements.', deliverables: ['Beta feedback', 'Improvements made', 'Testimonials collected'] },
    { id: 'dp-13', day: 13, title: 'Launch Prep', description: 'Prepare all launch materials', estimatedTime: '5 hours', status: 'pending', archetype: 'digital_products', dependencies: ['dp-12'], aiPrompt: 'Create launch checklist, schedule social posts, prepare email sends, set up analytics.', deliverables: ['Launch plan', 'Scheduled posts', 'Analytics setup'] },
    { id: 'dp-14', day: 14, title: 'LAUNCH DAY', description: 'Execute launch and promote', estimatedTime: '6 hours', status: 'pending', archetype: 'digital_products', dependencies: ['dp-13'], aiPrompt: 'Send launch email, post on social, engage with comments, track sales, celebrate wins.', deliverables: ['Live product', 'Sales coming in', 'Launch completed'] },
  ],

  // Default fallback protocol
  default: [
    { id: 'def-1', day: 1, title: 'Idea Validation', description: 'Validate problem and solution with target customers', estimatedTime: '4 hours', status: 'pending', archetype: 'default', dependencies: [], aiPrompt: 'Create validation plan with customer interview questions and landing page MVP.', deliverables: ['Validation plan', 'Interview questions'] },
    { id: 'def-2', day: 2, title: 'Market Research', description: 'Research competitors and market size', estimatedTime: '3 hours', status: 'pending', archetype: 'default', dependencies: ['def-1'], aiPrompt: 'Analyze competitors, calculate TAM/SAM/SOM, identify market trends.', deliverables: ['Competitor analysis', 'Market sizing'] },
    { id: 'def-3', day: 3, title: 'MVP Definition', description: 'Define minimum viable product scope', estimatedTime: '4 hours', status: 'pending', archetype: 'default', dependencies: ['def-2'], aiPrompt: 'Prioritize features, create MVP scope, define success metrics.', deliverables: ['MVP scope', 'Feature priorities', 'Success metrics'] },
    { id: 'def-4', day: 4, title: 'Setup & Foundation', description: 'Set up tools, accounts, and workspace', estimatedTime: '5 hours', status: 'pending', archetype: 'default', dependencies: ['def-3'], aiPrompt: 'Set up development environment, create accounts, establish project structure.', deliverables: ['Dev environment', 'Tool accounts', 'Project repo'] },
    { id: 'def-5', day: 5, title: 'Core Build - Part 1', description: 'Build core functionality first half', estimatedTime: '8 hours', status: 'pending', archetype: 'default', dependencies: ['def-4'], aiPrompt: 'Implement core features with focus on value delivery.', deliverables: ['Core features', 'Working prototype'] },
    { id: 'def-6', day: 6, title: 'Core Build - Part 2', description: 'Build core functionality second half', estimatedTime: '7 hours', status: 'pending', archetype: 'default', dependencies: ['def-5'], aiPrompt: 'Complete core features, add integrations, ensure functionality.', deliverables: ['Complete core', 'Integrations'] },
    { id: 'def-7', day: 7, title: 'Landing Page', description: 'Create marketing site and brand', estimatedTime: '5 hours', status: 'pending', archetype: 'default', dependencies: ['def-6'], aiPrompt: 'Build landing page, create brand identity, write conversion copy.', deliverables: ['Landing page', 'Brand assets', 'Copy'] },
    { id: 'def-8', day: 8, title: 'Monetization', description: 'Add payment and pricing', estimatedTime: '5 hours', status: 'pending', archetype: 'default', dependencies: ['def-7'], aiPrompt: 'Integrate payments, set pricing tiers, configure billing.', deliverables: ['Payment flow', 'Pricing page', 'Billing setup'] },
    { id: 'def-9', day: 9, title: 'User Experience', description: 'Polish UI/UX and add onboarding', estimatedTime: '5 hours', status: 'pending', archetype: 'default', dependencies: ['def-8'], aiPrompt: 'Improve UI, add onboarding flow, implement feedback loops.', deliverables: ['Polished UI', 'Onboarding', 'Feedback system'] },
    { id: 'def-10', day: 10, title: 'Marketing Setup', description: 'Prepare marketing channels', estimatedTime: '5 hours', status: 'pending', archetype: 'default', dependencies: ['def-9'], aiPrompt: 'Set up email marketing, social accounts, content calendar.', deliverables: ['Email setup', 'Social profiles', 'Content plan'] },
    { id: 'def-11', day: 11, title: 'Content Creation', description: 'Create pre-launch content', estimatedTime: '6 hours', status: 'pending', archetype: 'default', dependencies: ['def-10'], aiPrompt: 'Write blog posts, create videos, design graphics for launch.', deliverables: ['Blog posts', 'Videos', 'Graphics'] },
    { id: 'def-12', day: 12, title: 'Testing & QA', description: 'Test everything and fix bugs', estimatedTime: '5 hours', status: 'pending', archetype: 'default', dependencies: ['def-11'], aiPrompt: 'Test all flows, fix bugs, optimize performance, check mobile.', deliverables: ['Tested product', 'Bug fixes', 'Optimization'] },
    { id: 'def-13', day: 13, title: 'Launch Preparation', description: 'Prepare launch materials and plan', estimatedTime: '5 hours', status: 'pending', archetype: 'default', dependencies: ['def-12'], aiPrompt: 'Create launch checklist, prepare announcements, schedule posts.', deliverables: ['Launch checklist', 'Announcements', 'Schedule'] },
    { id: 'def-14', day: 14, title: 'LAUNCH DAY', description: 'Launch and promote', estimatedTime: '8 hours', status: 'pending', archetype: 'default', dependencies: ['def-13'], aiPrompt: 'Execute launch, monitor metrics, engage with users, celebrate.', deliverables: ['Live launch', 'First users', 'Metrics tracked'] },
  ],
};

const WorkflowEngine: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [workflows, setWorkflows] = useState<WorkflowInstance[]>([]);
  const [activeWorkflow, setActiveWorkflow] = useState<WorkflowInstance | null>(null);
  const [selectedArchetype, setSelectedArchetype] = useState('saas');
  const [projectName, setProjectName] = useState('');
  const [expandedDays, setExpandedDays] = useState<number[]>([1]);
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // In a real implementation, this would fetch from database
    // For now, use local state
    const defaultWorkflow: WorkflowInstance = {
      id: 'demo',
      projectName: 'SaaS Launch',
      archetype: 'saas',
      startDate: new Date().toISOString(),
      currentDay: 3,
      totalDays: 14,
      status: 'active',
      completionPercentage: 20,
      tasks: LAUNCH_PROTOCOLS.saas.map(t => ({ ...t, status: t.day <= 2 ? 'completed' : t.day === 3 ? 'in_progress' : 'pending' })),
    };
    setWorkflows([defaultWorkflow]);
  };

  const createWorkflow = () => {
    if (!projectName.trim()) return;

    const protocol = LAUNCH_PROTOCOLS[selectedArchetype] || LAUNCH_PROTOCOLS.default;
    
    const newWorkflow: WorkflowInstance = {
      id: Date.now().toString(),
      projectName,
      archetype: selectedArchetype,
      startDate: new Date().toISOString(),
      currentDay: 1,
      totalDays: 14,
      status: 'active',
      completionPercentage: 0,
      tasks: protocol.map(t => ({ ...t, status: 'pending' })),
    };

    setWorkflows(prev => [...prev, newWorkflow]);
    setActiveWorkflow(newWorkflow);
    setProjectName('');
  };

  const toggleTaskStatus = (workflowId: string, taskId: string) => {
    setWorkflows(prev => prev.map(w => {
      if (w.id !== workflowId) return w;
      
      const updatedTasks = w.tasks.map(t => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          status: t.status === 'completed' ? 'pending' : 'completed' as any
        };
      });

      const completed = updatedTasks.filter(t => t.status === 'completed').length;
      const percentage = Math.round((completed / updatedTasks.length) * 100);
      
      return {
        ...w,
        tasks: updatedTasks,
        completionPercentage: percentage,
        currentDay: Math.ceil((completed / updatedTasks.length) * 14) || 1,
      };
    }));
  };

  const toggleDayExpansion = (day: number) => {
    setExpandedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'in_progress': return <Clock className="w-5 h-5 text-blue-500" />;
      case 'blocked': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <Circle className="w-5 h-5 text-gray-300" />;
    }
  };

  // Mini button
  if (!isOpen) {
    return (
      <div className="fixed bottom-24 left-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 shadow-lg bg-gradient-to-r from-orange-500 to-red-500"
        >
          <Rocket className="w-6 h-6" />
        </Button>
        {workflows.some(w => w.status === 'active') && (
          <Badge className="absolute -top-2 -right-2 bg-green-500">
            Active
          </Badge>
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <Rocket className="w-6 h-6 text-orange-600" />
            <CardTitle>14-Day Launch Protocol</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {activeWorkflow && (
              <Badge variant="outline" className="text-sm">
                Day {activeWorkflow.currentDay} / {activeWorkflow.totalDays}
              </Badge>
            )}
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <Zap className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="overflow-y-auto max-h-[calc(90vh-100px)]">
          {!activeWorkflow ? (
            /* Create New Workflow */
            <div className="space-y-4">
              <div className="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Start New Launch Protocol</h3>
                <p className="text-sm text-muted-foreground">
                  The 14-day launch protocol guides you from idea to live product with daily actionable tasks.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Project Name</label>
                  <Input
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g., Freelance Finance Tracker"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Business Archetype</label>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    {['saas', 'digital_products', 'micro_saas', 'content_creator', 'ai_agency', 'marketplace'].map(arch => (
                      <button
                        key={arch}
                        onClick={() => setSelectedArchetype(arch)}
                        className={`p-2 rounded-lg border text-sm transition-all ${
                          selectedArchetype === arch
                            ? 'border-orange-500 bg-orange-50 dark:bg-orange-950'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {arch.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={createWorkflow}
                  disabled={!projectName.trim()}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  Start 14-Day Launch
                </Button>
              </div>

              {/* Existing Workflows */}
              {workflows.length > 0 && (
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Your Active Launches</h4>
                  <div className="space-y-2">
                    {workflows.map(wf => (
                      <button
                        key={wf.id}
                        onClick={() => setActiveWorkflow(wf)}
                        className="w-full p-3 bg-muted rounded-lg text-left hover:bg-muted/80"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{wf.projectName}</div>
                            <div className="text-xs text-muted-foreground">
                              {wf.archetype} • Day {wf.currentDay}/{wf.totalDays}
                            </div>
                          </div>
                          <div className="w-24">
                            <Progress value={wf.completionPercentage} className="h-2" />
                            <div className="text-xs text-right text-muted-foreground">
                              {wf.completionPercentage}%
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Active Workflow View */
            <div className="space-y-4">
              {/* Progress Header */}
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <div className="font-semibold">{activeWorkflow.projectName}</div>
                  <div className="text-sm text-muted-foreground">
                    {activeWorkflow.archetype} archetype
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{activeWorkflow.completionPercentage}%</div>
                  <div className="text-xs text-muted-foreground">Complete</div>
                </div>
              </div>

              {/* Timeline */}
              <div className="flex gap-1 overflow-x-auto pb-2">
                {Array.from({ length: 14 }, (_, i) => i + 1).map(day => {
                  const dayTasks = activeWorkflow.tasks.filter(t => t.day === day);
                  const completed = dayTasks.filter(t => t.status === 'completed').length;
                  const total = dayTasks.length;
                  const isActive = day === activeWorkflow.currentDay;
                  
                  return (
                    <button
                      key={day}
                      onClick={() => toggleDayExpansion(day)}
                      className={`flex-shrink-0 w-10 h-10 rounded-lg flex flex-col items-center justify-center text-xs transition-all ${
                        completed === total && total > 0
                          ? 'bg-green-500 text-white'
                          : isActive
                            ? 'bg-orange-500 text-white'
                            : 'bg-muted'
                      }`}
                    >
                      <span className="font-bold">{day}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tasks by Day */}
              {Array.from({ length: 14 }, (_, i) => i + 1).map(day => {
                const dayTasks = activeWorkflow.tasks.filter(t => t.day === day);
                const isExpanded = expandedDays.includes(day);
                
                return (
                  <div key={day} className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleDayExpansion(day)}
                      className="w-full p-3 bg-muted/50 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">Day {day}</span>
                        <Badge variant="secondary" className="text-xs">
                          {dayTasks.filter(t => t.status === 'completed').length}/{dayTasks.length} tasks
                        </Badge>
                      </div>
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                    
                    {isExpanded && (
                      <div className="p-3 space-y-2">
                        {dayTasks.map(task => (
                          <div
                            key={task.id}
                            className={`p-3 rounded-lg border transition-all ${
                              task.status === 'completed'
                                ? 'bg-green-50 dark:bg-green-950 border-green-200'
                                : task.status === 'in_progress'
                                  ? 'bg-blue-50 dark:bg-blue-950 border-blue-200'
                                  : 'bg-white dark:bg-gray-900'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <button
                                onClick={() => toggleTaskStatus(activeWorkflow.id, task.id)}
                                className="mt-0.5"
                              >
                                {getStatusIcon(task.status)}
                              </button>
                              <div className="flex-1">
                                <div className="font-medium">{task.title}</div>
                                <div className="text-sm text-muted-foreground">{task.description}</div>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="outline" className="text-xs">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {task.estimatedTime}
                                  </Badge>
                                  {task.aiPrompt && (
                                    <Badge className="text-xs bg-purple-100 text-purple-700">
                                      <Target className="w-3 h-3 mr-1" />
                                      AI Assist
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={() => setActiveWorkflow(null)}
                  variant="outline"
                  className="flex-1"
                >
                  <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                  Back to Workflows
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setActiveWorkflow(null)}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  New Launch
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkflowEngine;
