'use client';

import { useState } from 'react';
import { PlanInput } from './components/PlanInput';
import { PlanOutput } from './components/PlanOutput';
import { usePlanGenerator } from './hooks/usePlanGenerator';
import { PlanGeneratorProps } from './types';
import { FoundryAIOutput } from '@/types';

export function PlanGenerator({ 
  initialInput, 
  context,
  onPlanGenerated,
  onError 
}: PlanGeneratorProps) {
  const { 
    input, 
    output, 
    isGenerating, 
    error, 
    provider,
    setInput,
    setProvider,
    generatePlan,
    reset 
  } = usePlanGenerator(context);

  const [isRefining, setIsRefining] = useState(false);
  const [refinementCount, setRefinementCount] = useState(0);

  // Set initial input if provided
  if (initialInput && !input && !output) {
    setInput(initialInput);
  }

  const handleGenerate = async (inputText: string) => {
    const result = await generatePlan(inputText, provider);
    if (result) {
      setRefinementCount(0); // Reset refinement count for new plan
      onPlanGenerated?.(result);
    } else if (error) {
      onError?.(error);
    }
  };

  const handleReset = () => {
    reset();
    setRefinementCount(0);
  };

  const handleRefine = async () => {
    if (!output || !input) return;

    setIsRefining(true);

    try {
      const nextIteration = refinementCount + 1;
      
      const response = await fetch('/api/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalInput: input,
          currentOutput: output,
          iterationCount: nextIteration,
          previousRefinements: [],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to refine output');
      }

      const refinedOutput: FoundryAIOutput = {
        ...data.output,
        refinementMetadata: {
          iterationCount: nextIteration,
          lastRefinedAt: new Date().toISOString(),
          refinementFocus: getRefinementFocusAreas(nextIteration),
        },
      };

      setRefinementCount(nextIteration);
      onPlanGenerated?.(refinedOutput);
    } catch (err) {
      onError?.(err instanceof Error ? err.message : 'Refinement failed');
    } finally {
      setIsRefining(false);
    }
  };

  // Show output if we have it
  if (output) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <PlanOutput 
          output={output} 
          onReset={handleReset}
          onRefine={handleRefine}
          isRefining={isRefining}
          refinementCount={refinementCount}
        />
      </div>
    );
  }

  // Show input form
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {context.source === 'radar' ? 'Generate Business Plan' : 'Plan Your Business Idea'}
        </h2>
        <p className="text-slate-600">
          {context.source === 'radar' 
            ? 'Create a comprehensive business plan based on this validated opportunity.'
            : 'Describe your business idea and we\'ll generate a complete actionable plan.'
          }
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <PlanInput
        initialValue={input || initialInput}
        provider={provider}
        isGenerating={isGenerating}
        onProviderChange={setProvider}
        onGenerate={handleGenerate}
        placeholder={context.source === 'radar' 
          ? "Review and refine the opportunity details before generating..."
          : "Describe your business idea: what problem are you solving, who is it for, and what makes it unique?"
        }
      />
    </div>
  );
}

function getRefinementFocusAreas(iteration: number): string[] {
  const focusAreas = [
    ['Expanded detail', 'Specific examples', 'Implementation notes'],
    ['Technical depth', 'Database schemas', 'API endpoints'],
    ['UX enhancement', 'User flows', 'Interaction patterns'],
    ['Monetization', 'Pricing psychology', 'Growth tactics'],
    ['Masterclass level', 'Competitive moats', 'Scaling strategies'],
  ];
  return focusAreas[Math.min(iteration - 1, 4)] || ['Comprehensive enhancement'];
}

// Re-export types, hooks, and components for external use
export { usePlanGenerator } from './hooks/usePlanGenerator';
export { PlanOutput } from './components/PlanOutput';
export type { PlanGeneratorProps, PlanContext, PlanGeneratorState } from './types';
