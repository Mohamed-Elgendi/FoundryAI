// ============================================
// FoundryAI - Workflow Engine
// Layer 4: Logic Layer
// Multi-step process orchestration
// ============================================

export interface WorkflowStep {
  id: string;
  name: string;
  description?: string;
  execute: (context: WorkflowContext) => Promise<WorkflowStepResult>;
  onSkip?: (context: WorkflowContext) => Promise<void>;
  onError?: (context: WorkflowContext, error: Error) => Promise<WorkflowStepResult>;
  canSkip?: boolean;
  dependsOn?: string[]; // step IDs this step depends on
}

export interface WorkflowStepResult {
  success: boolean;
  data?: Record<string, any>;
  error?: string;
  shouldStop?: boolean; // If true, stop the workflow
  shouldSkipNext?: boolean; // If true, skip next step
}

export interface WorkflowContext {
  userId: string;
  workflowId: string;
  stepNumber: number;
  totalSteps: number;
  data: Map<string, Record<string, any>>; // Data from previous steps
  metadata: Record<string, any>;
  [key: string]: any;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  steps: WorkflowStep[];
}

export interface WorkflowExecutionResult {
  workflowId: string;
  success: boolean;
  completedSteps: string[];
  skippedSteps: string[];
  failedStep?: string;
  error?: string;
  stepResults: Record<string, WorkflowStepResult>;
  totalDurationMs: number;
}

export class WorkflowEngine {
  private workflows: Map<string, Workflow> = new Map();
  private static instance: WorkflowEngine;

  static getInstance(): WorkflowEngine {
    if (!WorkflowEngine.instance) {
      WorkflowEngine.instance = new WorkflowEngine();
    }
    return WorkflowEngine.instance;
  }

  register(workflow: Workflow): void {
    this.workflows.set(workflow.id, workflow);
  }

  unregister(workflowId: string): void {
    this.workflows.delete(workflowId);
  }

  async execute(
    workflowId: string,
    options: {
      userId: string;
      metadata?: Record<string, any>;
      signal?: AbortSignal;
    }
  ): Promise<WorkflowExecutionResult> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      return {
        workflowId,
        success: false,
        completedSteps: [],
        skippedSteps: [],
        error: `Workflow '${workflowId}' not found`,
        stepResults: {},
        totalDurationMs: 0,
      };
    }

    const startTime = Date.now();
    const stepResults: Record<string, WorkflowStepResult> = {};
    const completedSteps: string[] = [];
    const skippedSteps: string[] = [];

    for (let i = 0; i < workflow.steps.length; i++) {
      const step = workflow.steps[i];

      // Check abort
      if (options.signal?.aborted) {
        return {
          workflowId,
          success: false,
          completedSteps,
          skippedSteps,
          error: "Workflow aborted",
          stepResults,
          totalDurationMs: Date.now() - startTime,
        };
      }

      // Check dependencies
      const unmetDeps = step.dependsOn?.filter((dep) => !completedSteps.includes(dep)) || [];
      if (unmetDeps.length > 0) {
        skippedSteps.push(step.id);
        continue;
      }

      const context: WorkflowContext = {
        userId: options.userId,
        workflowId,
        stepNumber: i + 1,
        totalSteps: workflow.steps.length,
        data: new Map(Object.entries(stepResults).map(([k, v]) => [k, v.data || {}])),
        metadata: options.metadata || {},
      };

      try {
        const result = await step.execute(context);
        stepResults[step.id] = result;

        if (result.success) {
          completedSteps.push(step.id);
        } else {
          // Try error handler
          if (step.onError) {
            const errorResult = await step.onError(context, new Error(result.error));
            stepResults[step.id] = errorResult;
            if (errorResult.success) {
              completedSteps.push(step.id);
              continue;
            }
          }
          return {
            workflowId,
            success: false,
            completedSteps,
            skippedSteps,
            failedStep: step.id,
            error: result.error,
            stepResults,
            totalDurationMs: Date.now() - startTime,
          };
        }

        if (result.shouldStop) {
          break;
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        if (step.onError) {
          const errorResult = await step.onError(context, error);
          stepResults[step.id] = errorResult;
          if (errorResult.success) {
            completedSteps.push(step.id);
            continue;
          }
        }
        return {
          workflowId,
          success: false,
          completedSteps,
          skippedSteps,
          failedStep: step.id,
          error: error.message,
          stepResults,
          totalDurationMs: Date.now() - startTime,
        };
      }
    }

    return {
      workflowId,
      success: true,
      completedSteps,
      skippedSteps,
      stepResults,
      totalDurationMs: Date.now() - startTime,
    };
  }

  getWorkflows(): string[] {
    return Array.from(this.workflows.keys());
  }

  clear(): void {
    this.workflows.clear();
  }
}

export const workflowEngine = WorkflowEngine.getInstance();

// ============================================
// Core Workflows
// ============================================

export const coreWorkflows: Workflow[] = [
  {
    id: "onboarding",
    name: "New User Onboarding",
    description: "Complete onboarding flow for new users",
    steps: [
      {
        id: "create_profile",
        name: "Create Profile",
        canSkip: false,
        execute: async (ctx) => ({
          success: true,
          data: { profileCreated: true },
        }),
      },
      {
        id: "initial_assessment",
        name: "Initial Self-Assessment",
        canSkip: true,
        execute: async (ctx) => ({
          success: true,
          data: { assessmentComplete: true },
        }),
      },
      {
        id: "brain_dump_intro",
        name: "First Brain Dump",
        canSkip: true,
        execute: async (ctx) => ({
          success: true,
          data: { brainDumpDone: true },
        }),
      },
      {
        id: "archetype_match",
        name: "Archetype Matching",
        canSkip: true,
        dependsOn: ["brain_dump_intro"],
        execute: async (ctx) => ({
          success: true,
          data: { archetypeMatched: true },
        }),
      },
      {
        id: "first_project",
        name: "First Project Setup",
        canSkip: true,
        dependsOn: ["archetype_match"],
        execute: async (ctx) => ({
          success: true,
          data: { projectCreated: true },
        }),
      },
    ],
  },
  {
    id: "idea_to_project",
    name: "Idea to Project Pipeline",
    description: "Extract idea from brain dump, validate, and create project",
    steps: [
      {
        id: "extract_ideas",
        name: "AI Idea Extraction",
        canSkip: false,
        execute: async (ctx) => ({
          success: true,
          data: { ideasExtracted: true },
        }),
      },
      {
        id: "validate_ideas",
        name: "Opportunity Validation",
        canSkip: false,
        dependsOn: ["extract_ideas"],
        execute: async (ctx) => ({
          success: true,
          data: { validationComplete: true },
        }),
      },
      {
        id: "create_project",
        name: "Create Project",
        canSkip: true,
        dependsOn: ["validate_ideas"],
        execute: async (ctx) => ({
          success: true,
          data: { projectId: "generated" },
        }),
      },
    ],
  },
  {
    id: "daily_checkin",
    name: "Daily Check-In Protocol",
    description: "Morning daily check-in flow",
    steps: [
      {
        id: "check_previous",
        name: "Check Previous Day",
        canSkip: false,
        execute: async (ctx) => ({
          success: true,
          data: { previousDayReviewed: true },
        }),
      },
      {
        id: "mood_check",
        name: "Mood & Energy Check",
        canSkip: true,
        execute: async (ctx) => ({
          success: true,
          data: { moodRecorded: true },
        }),
      },
      {
        id: "goal_review",
        name: "Review Goals",
        canSkip: true,
        execute: async (ctx) => ({
          success: true,
          data: { goalsReviewed: true },
        }),
      },
      {
        id: "intention_set",
        name: "Set Daily Intention",
        canSkip: true,
        execute: async (ctx) => ({
          success: true,
          data: { intentionSet: true },
        }),
      },
      {
        id: "update_streak",
        name: "Update Streak",
        canSkip: false,
        execute: async (ctx) => ({
          success: true,
          data: { streakUpdated: true },
        }),
      },
    ],
  },
];

// Register core workflows
for (const workflow of coreWorkflows) {
  workflowEngine.register(workflow);
}
