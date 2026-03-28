'use client';

import { useState, useEffect } from 'react';
import { FoundryAIOutput, RefinementState } from '@/types';
import { IdeaInput } from './IdeaInput';
import { OutputDisplay } from './OutputDisplay';
import { LoadingState } from './LoadingState';
import { RefinementLoadingState } from './RefinementLoadingState';
import { TemplateGallery } from './TemplateGallery';
import { Confetti } from '@/components/ui/confetti';
import { AlertCircle, History } from 'lucide-react';

interface SavedPlan {
  id: string;
  userInput: string;
  output: FoundryAIOutput;
  refinementState: RefinementState;
  createdAt: string;
}

export function FoundryAI() {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [output, setOutput] = useState<FoundryAIOutput | null>(null);
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState<{message: string; isRateLimit?: boolean; suggestedAction?: string} | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [refinementState, setRefinementState] = useState<RefinementState>({
    iterationCount: 0,
    isRefining: false,
    previousRefinements: [],
    originalInput: '',
  });

  // Load saved plans on mount
  useEffect(() => {
    const saved = localStorage.getItem('foundryai-plans');
    if (saved) {
      try {
        setSavedPlans(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved plans:', e);
      }
    }
  }, []);

  // Save plans whenever they change
  useEffect(() => {
    if (savedPlans.length > 0) {
      localStorage.setItem('foundryai-plans', JSON.stringify(savedPlans));
    }
  }, [savedPlans]);

  // Auto-save draft
  useEffect(() => {
    const savedDraft = localStorage.getItem('foundryai-draft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        if (draft.userInput && !userInput) {
          setUserInput(draft.userInput);
        }
      } catch (e) {
        console.error('Failed to load draft:', e);
      }
    }
  }, []);

  const saveToHistory = (input: string, newOutput: FoundryAIOutput, state: RefinementState) => {
    const plan: SavedPlan = {
      id: Date.now().toString(),
      userInput: input,
      output: newOutput,
      refinementState: state,
      createdAt: new Date().toISOString(),
    };
    setSavedPlans(prev => [plan, ...prev].slice(0, 10)); // Keep last 10 plans
  };

  const loadPlan = (plan: SavedPlan) => {
    setUserInput(plan.userInput);
    setOutput(plan.output);
    setRefinementState(plan.refinementState);
    setShowHistory(false);
  };

  const deletePlan = (id: string) => {
    setSavedPlans(prev => prev.filter(p => p.id !== id));
  };

  const handleGenerate = async (input: string) => {
    setIsLoading(true);
    setError(null);
    setUserInput(input);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput: input }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorData = data;
        setError({
          message: errorData.error || 'Failed to generate plan',
          isRateLimit: errorData.rateLimitError,
          suggestedAction: errorData.suggestedAction || errorData.hint,
        });
        throw new Error(errorData.error);
      }

      setOutput(data.output);
      setRefinementState({
        iterationCount: 0,
        isRefining: false,
        previousRefinements: [],
        originalInput: input,
      });
      
      // Trigger confetti celebration
      setShowConfetti(true);
      
      // Save to history
      saveToHistory(input, data.output, {
        iterationCount: 0,
        isRefining: false,
        previousRefinements: [],
        originalInput: input,
      });
      
      // Clear draft
      localStorage.removeItem('foundryai-draft');
    } catch (err) {
      if (!error) {
        setError({ message: err instanceof Error ? err.message : 'An error occurred' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = async (isHelpful: boolean) => {
    if (!output) return;

    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput,
          output,
          isHelpful,
        }),
      });
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    }
  };

  const handleRefine = async () => {
    if (!output || !userInput) return;

    setIsRefining(true);
    setRefinementState(prev => ({ ...prev, isRefining: true }));

    try {
      const nextIteration = refinementState.iterationCount + 1;
      
      const response = await fetch('/api/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalInput: userInput,
          currentOutput: output,
          iterationCount: nextIteration,
          previousRefinements: refinementState.previousRefinements,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorData = data;
        setError({
          message: errorData.error || 'Failed to refine output',
          isRateLimit: errorData.rateLimitError,
          suggestedAction: errorData.suggestedAction || errorData.hint,
        });
        throw new Error(errorData.error);
      }

      const refinedOutput: FoundryAIOutput = {
        ...data.output,
        refinementMetadata: {
          iterationCount: nextIteration,
          lastRefinedAt: new Date().toISOString(),
          refinementFocus: getRefinementFocusAreas(nextIteration),
        },
      };

      setOutput(refinedOutput);
      setRefinementState(prev => ({
        ...prev,
        iterationCount: nextIteration,
        isRefining: false,
        previousRefinements: [...prev.previousRefinements, getIterationDescription(nextIteration)],
      }));
    } catch (err) {
      if (!error) {
        setError({ message: err instanceof Error ? err.message : 'Refinement failed' });
      }
      setRefinementState(prev => ({ ...prev, isRefining: false }));
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      {/* History Toggle */}
      {savedPlans.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <History className="w-4 h-4" />
            {showHistory ? 'Hide History' : `View History (${savedPlans.length})`}
          </button>
        </div>
      )}
      
      {/* History Panel */}
      {showHistory && savedPlans.length > 0 && (
        <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
          <h3 className="font-semibold mb-3">Recent Plans</h3>
          <div className="space-y-2">
            {savedPlans.map((plan) => (
              <div
                key={plan.id}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-border/50 hover:border-primary/50 transition-colors"
              >
                <button
                  onClick={() => loadPlan(plan)}
                  className="flex-1 text-left"
                >
                  <p className="font-medium text-sm truncate">{plan.output.toolIdea}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(plan.createdAt).toLocaleDateString()} • 
                    {plan.refinementState.iterationCount} refinements
                  </p>
                </button>
                <button
                  onClick={() => deletePlan(plan.id)}
                  className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <IdeaInput onGenerate={handleGenerate} isLoading={isLoading} />
      
      {/* Template Gallery */}
      {!output && !isLoading && (
        <TemplateGallery onSelect={handleGenerate} isLoading={isLoading} />
      )}
      
      {isLoading && <LoadingState />}
      
      {isRefining && (
        <RefinementLoadingState 
          iteration={refinementState.iterationCount + 1} 
        />
      )}
      
      {error && (
        <div className={`p-4 border rounded-lg ${error.isRateLimit ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-red-50 border-red-200 text-red-700'}`}>
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
            <div className="space-y-2">
              <p className="font-medium">{error.message}</p>
              {error.suggestedAction && (
                <p className="text-sm opacity-90">{error.suggestedAction}</p>
              )}
              {error.isRateLimit && (
                <div className="text-sm mt-2 p-2 bg-white/50 rounded">
                  <strong>Options:</strong>
                  <ul className="list-disc ml-4 mt-1 space-y-1">
                    <li>Wait for rate limit reset (usually 1 hour)</li>
                    <li>Switch to OpenRouter in your .env.local file</li>
                    <li>Check your Groq dashboard for usage: https://console.groq.com</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {output && !isLoading && !isRefining && (
        <OutputDisplay 
          output={output} 
          onFeedback={handleFeedback}
          onRefine={handleRefine}
          refinementState={refinementState}
        />
      )}
    </div>
  );
}

function getIterationDescription(iteration: number): string {
  const descriptions = [
    "Expanded all sections with 2-3x more detail, specific examples, and implementation notes",
    "Deepened technical architecture with database schemas, API endpoints, and component hierarchies",
    "Enhanced user experience with detailed user flows, wireframe descriptions, and interaction patterns",
    "Strengthened monetization with pricing psychology, cohort analysis, and growth hacking tactics",
    "Masterclass level detail with competitive moats, technical debt management, and scaling strategies",
  ];
  return descriptions[Math.min(iteration - 1, 4)] || `Advanced refinement iteration ${iteration}`;
}

function getRefinementFocusAreas(iteration: number): string[] {
  const focusAreas = [
    ["Detail expansion", "Specific examples", "Implementation notes"],
    ["Technical architecture", "Database schemas", "API design"],
    ["User experience", "User flows", "Interaction patterns"],
    ["Monetization strategy", "Pricing psychology", "Growth tactics"],
    ["Competitive moats", "Technical debt", "Scaling strategies"],
  ];
  return focusAreas[Math.min(iteration - 1, 4)] || ["Comprehensive enhancement"];
}
