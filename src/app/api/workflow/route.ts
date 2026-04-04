import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseClient } from '@/layer-3-data/storage/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: workflows, error } = await supabase
      .from('launch_workflows')
      .select('*, workflow_tasks(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Calculate completion stats for each workflow
    const workflowsWithStats = workflows?.map(w => ({
      ...w,
      totalTasks: w.workflow_tasks?.length || 0,
      completedTasks: w.workflow_tasks?.filter((t: { completed: boolean }) => t.completed).length || 0,
      completionRate: w.workflow_tasks?.length > 0
        ? Math.round((w.workflow_tasks.filter((t: { completed: boolean }) => t.completed).length / w.workflow_tasks.length) * 100)
        : 0
    })) || [];

    return NextResponse.json({ workflows: workflowsWithStats });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch workflows' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { workflow_name, target_completion_date } = body;

    // Create 14-day launch workflow
    const { data: workflow, error } = await supabase
      .from('launch_workflows')
      .insert({
        user_id: user.id,
        workflow_name,
        current_day: 1,
        overall_progress: 0,
        status: 'active',
        start_date: new Date().toISOString(),
        target_completion_date
      })
      .select()
      .single();

    if (error) throw error;

    // Create default 14-day tasks
    const defaultTasks = [
      { day_number: 1, task_name: 'Validate opportunity and define MVP', estimated_duration_minutes: 120 },
      { day_number: 2, task_name: 'Research target market and competitors', estimated_duration_minutes: 180 },
      { day_number: 3, task_name: 'Define brand identity and messaging', estimated_duration_minutes: 120 },
      { day_number: 4, task_name: 'Set up business infrastructure', estimated_duration_minutes: 180 },
      { day_number: 5, task_name: 'Create landing page copy', estimated_duration_minutes: 150 },
      { day_number: 6, task_name: 'Build minimum viable product', estimated_duration_minutes: 300 },
      { day_number: 7, task_name: 'Test product with 3-5 users', estimated_duration_minutes: 180 },
      { day_number: 8, task_name: 'Iterate based on feedback', estimated_duration_minutes: 240 },
      { day_number: 9, task_name: 'Create content strategy', estimated_duration_minutes: 120 },
      { day_number: 10, task_name: 'Set up marketing channels', estimated_duration_minutes: 180 },
      { day_number: 11, task_name: 'Build waitlist or pre-launch list', estimated_duration_minutes: 120 },
      { day_number: 12, task_name: 'Prepare launch assets', estimated_duration_minutes: 180 },
      { day_number: 13, task_name: 'Final testing and QA', estimated_duration_minutes: 150 },
      { day_number: 14, task_name: 'Launch and announce', estimated_duration_minutes: 120 }
    ];

    const tasksWithWorkflowId = defaultTasks.map(t => ({
      ...t,
      workflow_id: workflow.id,
      completed: false
    }));

    await supabase.from('workflow_tasks').insert(tasksWithWorkflowId);

    return NextResponse.json({ data: workflow });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create workflow' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = createSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { task_id, completed, workflow_id, current_day, overall_progress } = body;

    // Update task completion
    if (task_id) {
      await supabase
        .from('workflow_tasks')
        .update({ completed, completed_at: completed ? new Date().toISOString() : null })
        .eq('id', task_id);
    }

    // Update workflow progress
    if (workflow_id) {
      const { data, error } = await supabase
        .from('launch_workflows')
        .update({ current_day, overall_progress })
        .eq('id', workflow_id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ data });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update workflow' }, { status: 500 });
  }
}
