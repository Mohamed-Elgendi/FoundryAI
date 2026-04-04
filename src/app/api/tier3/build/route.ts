/**
 * Tier 3 Build & Execution API Routes
 * AI Build Assistant and workflow engine endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerSupabaseClient } from '@/layer-1-security/auth/route-handler';

// ============================================
// AI BUILD ASSISTANT SERVICE
// ============================================

interface BuildTask {
  id: string;
  userId: string;
  projectId: string;
  taskType: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  priority: 'high' | 'medium' | 'low';
  estimatedHours: number;
  actualHours?: number;
  dependencies: string[];
  aiAssistanceUsed: boolean;
  errorLog?: string;
  solutionNotes?: string;
  createdAt: string;
  updatedAt: string;
}

interface BuildProject {
  id: string;
  userId: string;
  name: string;
  description: string;
  archetype: string;
  opportunityId?: string;
  currentStage: 'planning' | 'setup' | 'development' | 'testing' | 'launch' | 'scale';
  progress: number;
  techStack: string[];
  tasks: BuildTask[];
  createdAt: string;
  updatedAt: string;
}

// Mock AI assistance service (would integrate with actual AI providers)
const aiBuildService = {
  async getAssistance(taskType: string, context: Record<string, unknown>): Promise<{
    suggestions: string[];
    codeSnippet?: string;
    resources: string[];
    estimatedTime: string;
  }> {
    // This would call the actual AI service (Groq, OpenRouter, etc.)
    return {
      suggestions: [
        `Break down the ${taskType} into smaller subtasks`,
        'Start with the core functionality first',
        'Test each component before moving on',
      ],
      codeSnippet: '// AI-generated code would appear here',
      resources: [
        'https://docs.example.com/' + taskType,
        'https://github.com/example/' + taskType,
      ],
      estimatedTime: '2-4 hours',
    };
  },

  async resolveError(error: string, context: Record<string, unknown>): Promise<{
    explanation: string;
    solution: string;
    prevention: string;
  }> {
    return {
      explanation: `The error "${error}" typically occurs when...`,
      solution: 'To fix this issue, you should...',
      prevention: 'To prevent this in the future, always...',
    };
  },
};

// ============================================
// API ROUTES
// ============================================

// GET /api/tier3/build - Get user's build projects
export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data: projects, error } = await supabase
      .from('build_projects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Get active tasks for each project
    const projectsWithTasks = await Promise.all(
      (projects || []).map(async (project) => {
        const { data: tasks } = await supabase
          .from('build_tasks')
          .select('*')
          .eq('project_id', project.id)
          .order('created_at', { ascending: false })
          .limit(10);

        return {
          ...project,
          tasks: tasks || [],
        };
      })
    );

    return NextResponse.json({
      projects: projectsWithTasks,
      total: projectsWithTasks.length,
    });
  } catch (error) {
    console.error('Error fetching build projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch build projects' },
      { status: 500 }
    );
  }
}

// POST /api/tier3/build - Create new build project
export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Create project
    const { data: project, error } = await supabase
      .from('build_projects')
      .insert({
        user_id: user.id,
        name: body.name,
        description: body.description,
        archetype: body.archetype,
        opportunity_id: body.opportunityId,
        current_stage: 'planning',
        progress: 0,
        tech_stack: body.techStack || [],
      })
      .select()
      .single();

    if (error) throw error;

    // Create initial tasks based on archetype
    const initialTasks = getInitialTasks(body.archetype);
    const { data: tasks } = await supabase
      .from('build_tasks')
      .insert(
        initialTasks.map((task, index) => ({
          user_id: user.id,
          project_id: project.id,
          task_type: task.type,
          description: task.description,
          status: index === 0 ? 'in_progress' : 'pending',
          priority: task.priority,
          estimated_hours: task.estimatedHours,
          dependencies: task.dependencies,
          ai_assistance_used: false,
        }))
      )
      .select();

    return NextResponse.json({
      project: {
        ...project,
        tasks: tasks || [],
      },
      success: true,
    });
  } catch (error) {
    console.error('Error creating build project:', error);
    return NextResponse.json(
      { error: 'Failed to create build project' },
      { status: 500 }
    );
  }
}

// POST /api/tier3/build/assist - Get AI assistance
export async function POSTAssist(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const assistance = await aiBuildService.getAssistance(body.taskType, body.context);

    // Log AI interaction
    await supabase.from('ai_interactions').insert({
      user_id: user.id,
      interaction_type: 'build_assistance',
      task_type: body.taskType,
      context: body.context,
      response: assistance,
    });

    return NextResponse.json({ assistance, success: true });
  } catch (error) {
    console.error('Error getting AI assistance:', error);
    return NextResponse.json(
      { error: 'Failed to get AI assistance' },
      { status: 500 }
    );
  }
}

// POST /api/tier3/build/resolve-error - Resolve build error
export async function POSTResolveError(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const resolution = await aiBuildService.resolveError(body.error, body.context);

    // Update task with error log if taskId provided
    if (body.taskId) {
      await supabase
        .from('build_tasks')
        .update({
          error_log: body.error,
          solution_notes: resolution.solution,
          status: 'blocked',
        })
        .eq('id', body.taskId);
    }

    return NextResponse.json({ resolution, success: true });
  } catch (error) {
    console.error('Error resolving build error:', error);
    return NextResponse.json(
      { error: 'Failed to resolve error' },
      { status: 500 }
    );
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getInitialTasks(archetype: string): Array<{
  type: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimatedHours: number;
  dependencies: string[];
}> {
  const tasksByArchetype: Record<string, Array<{
    type: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    estimatedHours: number;
    dependencies: string[];
  }>> = {
    saas: [
      { type: 'setup', description: 'Set up project repository and development environment', priority: 'high', estimatedHours: 2, dependencies: [] },
      { type: 'design', description: 'Design database schema and API structure', priority: 'high', estimatedHours: 4, dependencies: ['setup'] },
      { type: 'auth', description: 'Implement authentication system', priority: 'high', estimatedHours: 4, dependencies: ['design'] },
      { type: 'core', description: 'Build core product features', priority: 'high', estimatedHours: 16, dependencies: ['auth'] },
      { type: 'payment', description: 'Integrate payment processing', priority: 'medium', estimatedHours: 4, dependencies: ['core'] },
      { type: 'launch', description: 'Deploy and launch MVP', priority: 'high', estimatedHours: 2, dependencies: ['payment'] },
    ],
    content: [
      { type: 'research', description: 'Research trending topics and keywords', priority: 'high', estimatedHours: 3, dependencies: [] },
      { type: 'setup', description: 'Set up content management system', priority: 'high', estimatedHours: 2, dependencies: ['research'] },
      { type: 'content', description: 'Create initial content batch (10 pieces)', priority: 'high', estimatedHours: 10, dependencies: ['setup'] },
      { type: 'automation', description: 'Set up content automation tools', priority: 'medium', estimatedHours: 4, dependencies: ['content'] },
      { type: 'distribution', description: 'Configure distribution channels', priority: 'medium', estimatedHours: 3, dependencies: ['automation'] },
    ],
    service: [
      { type: 'offer', description: 'Define service offering and pricing', priority: 'high', estimatedHours: 3, dependencies: [] },
      { type: 'portfolio', description: 'Create portfolio pieces', priority: 'high', estimatedHours: 6, dependencies: ['offer'] },
      { type: 'outreach', description: 'Set up client outreach system', priority: 'high', estimatedHours: 4, dependencies: ['portfolio'] },
      { type: 'delivery', description: 'Create service delivery process', priority: 'medium', estimatedHours: 4, dependencies: ['outreach'] },
    ],
    default: [
      { type: 'plan', description: 'Create detailed project plan', priority: 'high', estimatedHours: 2, dependencies: [] },
      { type: 'setup', description: 'Set up development environment', priority: 'high', estimatedHours: 2, dependencies: ['plan'] },
      { type: 'build', description: 'Build core functionality', priority: 'high', estimatedHours: 20, dependencies: ['setup'] },
      { type: 'test', description: 'Test and validate', priority: 'medium', estimatedHours: 4, dependencies: ['build'] },
      { type: 'launch', description: 'Launch to market', priority: 'high', estimatedHours: 2, dependencies: ['test'] },
    ],
  };

  return tasksByArchetype[archetype] || tasksByArchetype.default;
}
