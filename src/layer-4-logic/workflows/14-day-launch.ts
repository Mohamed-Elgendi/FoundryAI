// ==========================================
// FOUNDRYAI 14-DAY LAUNCH PROTOCOL
// Workflow Engine & State Management
// ==========================================

export interface DayStep {
  day: number;
  title: string;
  description: string;
  tasks: string[];
  milestone: string;
  estimatedHours: number;
  aiPrompt: string;
  resources: string[];
  checkInQuestions: string[];
}

export interface WorkflowState {
  userId: string;
  selectedOpportunityId: string | null;
  currentDay: number;
  totalDays: number;
  startedAt: string | null;
  completedAt: string | null;
  isActive: boolean;
  progress: {
    day: number;
    completedTasks: string[];
    notes: string;
    checkInCompleted: boolean;
    aiGuidance: string | null;
  }[];
  brainDumps: BrainDump[];
  momentumScore: number;
  streakDays: number;
}

export interface BrainDump {
  id: string;
  content: string;
  category: 'idea' | 'task' | 'resource' | 'concern' | 'win';
  createdAt: string;
  processed: boolean;
  aiSummary: string | null;
}

// ==========================================
// 14-DAY PROTOCOL DEFINITION
// ==========================================

export const FOURTEEN_DAY_PROTOCOL: DayStep[] = [
  {
    day: 1,
    title: "Foundation & Validation",
    description: "Validate your opportunity and define your unique angle",
    tasks: [
      "Review your selected opportunity dossier",
      "Identify your unique value proposition",
      "Define your target customer persona",
      "Validate demand with 3 potential customers"
    ],
    milestone: "Validation Complete",
    estimatedHours: 3,
    aiPrompt: "Help me refine my value proposition for {opportunity}. My target is {persona}. What angles should I test?",
    resources: ["Value Proposition Canvas", "Customer Interview Script"],
    checkInQuestions: ["Did you complete 3 customer interviews?", "What's your strongest value prop angle?"]
  },
  {
    day: 2,
    title: "Market Research Deep Dive",
    description: "Research competitors and market gaps",
    tasks: [
      "Analyze top 5 competitors",
      "Identify pricing benchmarks",
      "Document feature gaps",
      "Create competitor matrix"
    ],
    milestone: "Research Complete",
    estimatedHours: 4,
    aiPrompt: "Analyze these competitors: {competitors}. What gaps can I exploit? What should my pricing be?",
    resources: ["Competitor Analysis Template", "Pricing Calculator"],
    checkInQuestions: ["What are your top 3 competitor weaknesses?", "What's your planned price point?"]
  },
  {
    day: 3,
    title: "MVP Scope Definition",
    description: "Define the minimum viable product",
    tasks: [
      "List all possible features",
      "Prioritize by impact vs effort",
      "Define MUST-HAVE vs NICE-TO-HAVE",
      "Create MVP feature list (max 5 features)"
    ],
    milestone: "MVP Scoped",
    estimatedHours: 2,
    aiPrompt: "I want to build {product}. My users need {jobs}. What 3-5 features should my MVP include?",
    resources: ["Feature Prioritization Matrix", "MVP Checklist"],
    checkInQuestions: ["What's your #1 must-have feature?", "Can you launch without feature X?"]
  },
  {
    day: 4,
    title: "Tech Stack Selection",
    description: "Choose your tools and platform",
    tasks: [
      "Select frontend framework",
      "Choose database/backend",
      "Identify necessary integrations",
      "Set up development environment"
    ],
    milestone: "Stack Selected",
    estimatedHours: 3,
    aiPrompt: "For a {type} MVP with {features}, what's the fastest tech stack? I'm comfortable with {skills}.",
    resources: ["Tech Stack Decision Matrix", "Boilerplate Templates"],
    checkInQuestions: ["What's your frontend choice?", "Database decision made?"]
  },
  {
    day: 5,
    title: "Prototype & Wireframes",
    description: "Create visual designs and user flows",
    tasks: [
      "Sketch main user flows",
      "Create low-fidelity wireframes",
      "Design key screens (3-5 max)",
      "Get feedback from 2 potential users"
    ],
    milestone: "Design Complete",
    estimatedHours: 4,
    aiPrompt: "Design a {type} interface for {users}. Key actions: {actions}. Keep it minimal and functional.",
    resources: ["Wireframe Kit", "User Flow Template"],
    checkInQuestions: ["Did you get user feedback?", "What's the biggest UX risk?"]
  },
  {
    day: 6,
    title: "Project Setup & Infrastructure",
    description: "Initialize your codebase and deployment",
    tasks: [
      "Initialize repository",
      "Set up hosting/deployment",
      "Configure CI/CD if needed",
      "Deploy 'Hello World'"
    ],
    milestone: "Infrastructure Ready",
    estimatedHours: 3,
    aiPrompt: "Set up a {stack} project with deployment to {platform}. Include auth and database setup.",
    resources: ["Deployment Checklist", "Environment Setup Guide"],
    checkInQuestions: ["Is your app deployed?", "Can you push updates automatically?"]
  },
  {
    day: 7,
    title: "Core Feature Development - Part 1",
    description: "Build your #1 must-have feature",
    tasks: [
      "Set up data models",
      "Build main UI components",
      "Implement core functionality",
      "Test the feature works"
    ],
    milestone: "Feature 1 Complete",
    estimatedHours: 6,
    aiPrompt: "Help me build {feature} with {tech}. I need: {requirements}. Show me the code structure.",
    resources: ["Component Library", "API Integration Patterns"],
    checkInQuestions: ["Is feature 1 functional?", "What blockers did you hit?"]
  },
  {
    day: 8,
    title: "Core Feature Development - Part 2",
    description: "Build feature #2 or enhance #1",
    tasks: [
      "Implement second feature",
      "Add user authentication if needed",
      "Create user settings/profile",
      "Test both features together"
    ],
    milestone: "Feature 2 Complete",
    estimatedHours: 6,
    aiPrompt: "Now add {feature2} that works with {feature1}. Handle edge cases and errors gracefully.",
    resources: ["Auth Integration Guide", "State Management Patterns"],
    checkInQuestions: ["Feature 2 working?", "How's the UX flow between features?"]
  },
  {
    day: 9,
    title: "Integration & Polish",
    description: "Connect everything and add finishing touches",
    tasks: [
      "Integrate all features",
      "Add error handling",
      "Implement loading states",
      "Add basic analytics"
    ],
    milestone: "Integration Complete",
    estimatedHours: 5,
    aiPrompt: "Polish this {product}: add error handling, loading states, and analytics. Make it production-ready.",
    resources: ["Error Handling Best Practices", "Analytics Setup"],
    checkInQuestions: ["Are all features connected?", "What's the error handling like?"]
  },
  {
    day: 10,
    title: "Content & Copy",
    description: "Write all necessary content",
    tasks: [
      "Write landing page copy",
      "Create onboarding messages",
      "Write help/tooltip text",
      "Create terms/privacy (template)"
    ],
    milestone: "Content Complete",
    estimatedHours: 4,
    aiPrompt: "Write landing page copy for {product} targeting {audience}. Focus on benefits, not features.",
    resources: ["Copywriting Formula", "Landing Page Template"],
    checkInQuestions: ["Is your landing page copy done?", "Does it speak to customer pain points?"]
  },
  {
    day: 11,
    title: "Testing & QA",
    description: "Test everything thoroughly",
    tasks: [
      "Test all user flows",
      "Fix critical bugs",
      "Test on mobile",
      "Get 2 beta testers"
    ],
    milestone: "QA Passed",
    estimatedHours: 4,
    aiPrompt: "Create a test plan for {product}. What are the critical user flows? What could break?",
    resources: ["QA Checklist", "Bug Report Template"],
    checkInQuestions: ["Did you find major bugs?", "Have beta testers signed up?"]
  },
  {
    day: 12,
    title: "Launch Preparation",
    description: "Prepare for public launch",
    tasks: [
      "Set up payment processing if needed",
      "Configure email notifications",
      "Create launch checklist",
      "Prepare announcement posts"
    ],
    milestone: "Launch Ready",
    estimatedHours: 3,
    aiPrompt: "Help me prepare a launch checklist for {product}. What am I forgetting?",
    resources: ["Launch Checklist", "Marketing Assets"],
    checkInQuestions: ["Is payment setup complete?", "Where will you announce?"]
  },
  {
    day: 13,
    title: "Soft Launch",
    description: "Launch to limited audience",
    tasks: [
      "Deploy to production",
      "Share with beta list",
      "Monitor for issues",
      "Collect initial feedback"
    ],
    milestone: "Soft Launch Complete",
    estimatedHours: 3,
    aiPrompt: "It's launch day! Help me write announcement posts for Twitter, LinkedIn, and Product Hunt.",
    resources: ["Launch Announcement Templates", "Analytics Dashboard"],
    checkInQuestions: ["Is it live?", "How many users signed up?"]
  },
  {
    day: 14,
    title: "Iterate & Optimize",
    description: "First day of continuous improvement",
    tasks: [
      "Review analytics and feedback",
      "Prioritize first improvements",
      "Plan next 30 days",
      "Celebrate your launch!"
    ],
    milestone: "LAUNCHED! 🎉",
    estimatedHours: 2,
    aiPrompt: "Help me analyze launch feedback and plan my next 30 days of improvements for {product}.",
    resources: ["Feedback Analysis Template", "30-Day Roadmap"],
    checkInQuestions: ["What was your biggest win?", "What's your #1 improvement priority?"]
  }
];

// ==========================================
// WORKFLOW ENGINE
// ==========================================

export class WorkflowEngine {
  private state: WorkflowState;
  private listeners: Set<(state: WorkflowState) => void> = new Set();

  constructor(userId: string, opportunityId?: string) {
    this.state = {
      userId,
      selectedOpportunityId: opportunityId || null,
      currentDay: 0,
      totalDays: 14,
      startedAt: null,
      completedAt: null,
      isActive: false,
      progress: [],
      brainDumps: [],
      momentumScore: 0,
      streakDays: 0
    };
  }

  // Start the 14-day protocol
  start(): void {
    this.state = {
      ...this.state,
      isActive: true,
      currentDay: 1,
      startedAt: new Date().toISOString(),
      progress: [this.createDayProgress(1)]
    };
    this.notifyListeners();
  }

  // Get current day step
  getCurrentStep(): DayStep | null {
    if (!this.state.isActive || this.state.currentDay === 0) return null;
    return FOURTEEN_DAY_PROTOCOL[this.state.currentDay - 1] || null;
  }

  // Get all steps
  getAllSteps(): DayStep[] {
    return FOURTEEN_DAY_PROTOCOL;
  }

  // Complete a task
  completeTask(day: number, task: string): void {
    const dayProgress = this.state.progress.find(p => p.day === day);
    if (dayProgress && !dayProgress.completedTasks.includes(task)) {
      dayProgress.completedTasks.push(task);
      this.calculateMomentum();
      this.notifyListeners();
    }
  }

  // Complete check-in for a day
  completeCheckIn(day: number, notes: string, aiGuidance: string): void {
    const dayProgress = this.state.progress.find(p => p.day === day);
    if (dayProgress) {
      dayProgress.checkInCompleted = true;
      dayProgress.notes = notes;
      dayProgress.aiGuidance = aiGuidance;
      
      // Move to next day if not last
      if (day < 14) {
        this.state.currentDay = day + 1;
        this.state.progress.push(this.createDayProgress(day + 1));
        this.state.streakDays++;
      } else {
        this.state.completedAt = new Date().toISOString();
        this.state.isActive = false;
      }
      
      this.calculateMomentum();
      this.notifyListeners();
    }
  }

  // Add brain dump
  addBrainDump(content: string, category: BrainDump['category']): BrainDump {
    const dump: BrainDump = {
      id: crypto.randomUUID(),
      content,
      category,
      createdAt: new Date().toISOString(),
      processed: false,
      aiSummary: null
    };
    this.state.brainDumps.push(dump);
    this.notifyListeners();
    return dump;
  }

  // Get progress percentage
  getProgress(): number {
    const completedTasks = this.state.progress.reduce(
      (sum, day) => sum + day.completedTasks.length, 0
    );
    const totalTasks = FOURTEEN_DAY_PROTOCOL.reduce(
      (sum, step) => sum + step.tasks.length, 0
    );
    return Math.round((completedTasks / totalTasks) * 100);
  }

  // Get current state
  getState(): WorkflowState {
    return { ...this.state };
  }

  // Subscribe to changes
  subscribe(listener: (state: WorkflowState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Calculate momentum score (0-100)
  private calculateMomentum(): void {
    const checkInsCompleted = this.state.progress.filter(p => p.checkInCompleted).length;
    const tasksCompleted = this.state.progress.reduce(
      (sum, p) => sum + p.completedTasks.length, 0
    );
    const streakBonus = Math.min(this.state.streakDays * 2, 20);
    
    this.state.momentumScore = Math.min(
      Math.round((checkInsCompleted * 5) + (tasksCompleted * 2) + streakBonus),
      100
    );
  }

  private createDayProgress(day: number) {
    return {
      day,
      completedTasks: [],
      notes: '',
      checkInCompleted: false,
      aiGuidance: null
    };
  }

  private notifyListeners(): void {
    const state = this.getState();
    this.listeners.forEach(listener => listener(state));
  }
}

// ==========================================
// CATEGORIES FOR BRAIN DUMP
// ==========================================

export const BRAIN_DUMP_CATEGORIES = [
  { value: 'idea', label: '💡 Idea', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'task', label: '✅ Task', color: 'bg-blue-100 text-blue-700' },
  { value: 'resource', label: '📚 Resource', color: 'bg-green-100 text-green-700' },
  { value: 'concern', label: '⚠️ Concern', color: 'bg-red-100 text-red-700' },
  { value: 'win', label: '🎉 Win', color: 'bg-purple-100 text-purple-700' }
] as const;

// ==========================================
// AI PROMPTS FOR BUILD ASSISTANT
// ==========================================

export const BUILD_ASSISTANT_PROMPTS = {
  dailyCheckIn: (day: number, progress: string, blockers: string) => `
You are a startup launch coach. Today is Day ${day} of the 14-Day Launch Protocol.

User's progress so far: ${progress}
Current blockers: ${blockers}

Provide:
1. Encouragement based on their progress
2. Specific advice for today's tasks
3. Suggested priority (what to focus on first)
4. Time estimate and tips to stay on track
5. One motivational insight

Keep it concise, actionable, and motivating.`,

  troubleshoot: (problem: string, context: string) => `
You're a technical advisor helping with a startup MVP.

Problem: ${problem}
Context: ${context}

Provide:
1. Quick diagnosis (likely cause)
2. 2-3 specific solutions to try
3. Code example if relevant
4. Resources for deeper learning

Be practical and get them unstuck fast.`,

  codeGeneration: (feature: string, tech: string, requirements: string) => `
Generate production-ready code for: ${feature}

Tech stack: ${tech}
Requirements: ${requirements}

Provide:
1. Complete, working code
2. Comments explaining key parts
3. Error handling
4. Best practices used

Focus on simplicity and functionality over perfection.`,

  resourceRecommendation: (topic: string, level: string) => `
Recommend 3 specific resources for learning: ${topic}

User's level: ${level}

For each resource:
1. Name and link
2. Why it's good for their level
3. Specific sections to focus on
4. Time to complete

Prioritize practical, action-oriented resources.`
};

// ==========================================
// HOOK FOR REACT
// ==========================================

import { useState, useEffect, useCallback } from 'react';

export function useWorkflow(userId: string, opportunityId?: string) {
  const [engine] = useState(() => new WorkflowEngine(userId, opportunityId));
  const [state, setState] = useState<WorkflowState>(engine.getState());

  useEffect(() => {
    return engine.subscribe(setState);
  }, [engine]);

  const start = useCallback(() => engine.start(), [engine]);
  const completeTask = useCallback((day: number, task: string) => 
    engine.completeTask(day, task), [engine]);
  const completeCheckIn = useCallback((day: number, notes: string, aiGuidance: string) => 
    engine.completeCheckIn(day, notes, aiGuidance), [engine]);
  const addBrainDump = useCallback((content: string, category: BrainDump['category']) => 
    engine.addBrainDump(content, category), [engine]);

  return {
    state,
    currentStep: engine.getCurrentStep(),
    allSteps: engine.getAllSteps(),
    progress: engine.getProgress(),
    start,
    completeTask,
    completeCheckIn,
    addBrainDump
  };
}
