/**
 * Workflow Engine Tests
 *
 * Tests for createWorkflow, executeWorkflow.
 */

import {
  createWorkflow,
  executeWorkflow,
  getWorkflowEngine,
} from "@/lib/workflow-engine";

describe("Workflow Engine", () => {
  beforeEach(() => {
    const engine = getWorkflowEngine();
    // Register a test workflow
    (engine as any).workflows = new Map();
  });

  it("executes steps in order", async () => {
    createWorkflow({
      id: "test-workflow",
      name: "Test",
      description: "Test workflow",
      steps: [
        {
          id: "step1",
          name: "Step 1",
          execute: async () => "result1",
          maxRetries: 1,
          retryDelayMs: 10,
        },
        {
          id: "step2",
          name: "Step 2",
          execute: async () => "result2",
          maxRetries: 1,
          retryDelayMs: 10,
        },
      ],
    });

    const result = await executeWorkflow("test-workflow", {});
    expect(result.status).toBe("completed");
    expect(result.steps[0].status).toBe("completed");
    expect(result.steps[1].status).toBe("completed");
  });

  it("failed step stops workflow", async () => {
    createWorkflow({
      id: "failing-workflow",
      name: "Failing",
      description: "Workflow that fails",
      steps: [
        {
          id: "step1",
          name: "Step 1",
          execute: async () => {
            throw new Error("Step 1 failed");
          },
          maxRetries: 1,
          retryDelayMs: 10,
        },
        {
          id: "step2",
          name: "Step 2",
          execute: async () => "should not run",
          maxRetries: 1,
          retryDelayMs: 10,
        },
      ],
    });

    const result = await executeWorkflow("failing-workflow", {});
    expect(result.status).toBe("failed");
    expect(result.steps[0].status).toBe("failed");
    expect(result.steps[1].status).toBe("pending");
  });

  it("condition can skip steps", async () => {
    createWorkflow({
      id: "conditional-workflow",
      name: "Conditional",
      description: "Workflow with conditions",
      steps: [
        {
          id: "step1",
          name: "Step 1",
          execute: async () => "ran",
          maxRetries: 1,
          retryDelayMs: 10,
        },
        {
          id: "step2",
          name: "Step 2",
          execute: async () => "should not run",
          condition: () => false,
          maxRetries: 1,
          retryDelayMs: 10,
        },
      ],
    });

    const result = await executeWorkflow("conditional-workflow", {});
    expect(result.status).toBe("completed");
    expect(result.steps[0].status).toBe("completed");
    expect(result.steps[1].status).toBe("skipped");
  });
});
