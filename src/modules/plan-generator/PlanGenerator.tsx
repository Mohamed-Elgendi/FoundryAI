'use client';

import { PlanInput } from './components/PlanInput';
import { PlanOutput } from './components/PlanOutput';
import { usePlanGenerator } from './hooks/usePlanGenerator';
import { PlanGeneratorProps } from './types';

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

  // Set initial input if provided
  if (initialInput && !input && !output) {
    setInput(initialInput);
  }

  const handleGenerate = async (inputText: string) => {
    const result = await generatePlan(inputText, provider);
    if (result) {
      onPlanGenerated?.(result);
    } else if (error) {
      onError?.(error);
    }
  };

  const handleReset = () => {
    reset();
  };

  // Show output if we have it
  if (output) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <PlanOutput 
          output={output} 
          onReset={handleReset}
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

// Re-export types, hooks, and components for external use
export { usePlanGenerator } from './hooks/usePlanGenerator';
export { PlanOutput } from './components/PlanOutput';
export type { PlanGeneratorProps, PlanContext, PlanGeneratorState } from './types';
