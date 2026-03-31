/**
 * Layer 4: Logic - Workflows
 */

export interface WorkflowStep {
  id: string;
  name: string;
  execute: () => Promise<unknown>;
}

export interface Workflow {
  id: string;
  name: string;
  steps: WorkflowStep[];
}

export async function executeWorkflow(workflow: Workflow): Promise<unknown[]> {
  const results: unknown[] = [];
  
  for (const step of workflow.steps) {
    const result = await step.execute();
    results.push(result);
  }
  
  return results;
}

export function createWorkflow(name: string, steps: WorkflowStep[]): Workflow {
  return {
    id: crypto.randomUUID(),
    name,
    steps
  };
}
