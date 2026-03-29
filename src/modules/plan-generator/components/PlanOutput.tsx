'use client';

import { useState } from 'react';
import { FoundryAIOutput } from '@/types';
import { ChevronDown, ChevronUp, Users, Search, Wrench, Code, ListTodo, DollarSign, TrendingUp, Target, AlertCircle, Sparkles, Loader2, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlanOutputProps {
  output: FoundryAIOutput;
  onReset?: () => void;
  onRefine?: () => void;
  isRefining?: boolean;
  refinementCount?: number;
}

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

function CollapsibleSection({ title, icon, children, defaultExpanded = true }: SectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center">
            {icon}
          </div>
          <h3 className="font-semibold text-slate-900">{title}</h3>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
      </button>
      {isExpanded && (
        <div className="p-4 border-t border-slate-200">
          {children}
        </div>
      )}
    </div>
  );
}

export function PlanOutput({ output, onReset, onRefine, isRefining, refinementCount = 0 }: PlanOutputProps) {
  const hasBeenRefined = refinementCount > 0;
  return (
    <div className="space-y-4">
      {/* Header - Layer 0: Idea Name & Target Audience */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{output.ideaName || output.toolIdea}</h1>
            <div className="flex items-center gap-3 text-violet-100">
              <Users className="w-5 h-5" />
              <span className="text-lg">{output.targetAudience?.description || output.targetUser}</span>
              {output.targetAudience?.painLevel && (
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-sm font-medium",
                  output.targetAudience.painLevel >= 7 ? "bg-red-500/30 text-red-100" :
                  output.targetAudience.painLevel >= 4 ? "bg-amber-500/30 text-amber-100" :
                  "bg-green-500/30 text-green-100"
                )}>
                  Pain Level: {output.targetAudience.painLevel}/10
                </span>
              )}
            </div>
          </div>
          {onReset && (
            <button
              onClick={onReset}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
            >
              New Plan
            </button>
          )}
        </div>
      </div>

      {/* Layer 0: Problem Statement - Structured */}
      <CollapsibleSection title="Problem Statement" icon={<AlertCircle className="w-5 h-5" />} defaultExpanded={true}>
        <div className="space-y-4">
          {/* Full statement */}
          {output.problemStatement?.fullStatement && (
            <p className="text-lg text-slate-800 font-medium leading-relaxed bg-slate-50 p-4 rounded-lg">
              {output.problemStatement.fullStatement}
            </p>
          )}
          
          {/* Core Problem & Cost */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-red-50 rounded-lg border border-red-100">
              <p className="text-sm font-medium text-red-700 mb-1">Core Problem</p>
              <p className="text-slate-800">{output.problemStatement?.coreProblem || 'Not specified'}</p>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
              <p className="text-sm font-medium text-amber-700 mb-1">Quantified Cost</p>
              <p className="text-slate-800">{output.problemStatement?.quantifiedCost || 'Not specified'}</p>
            </div>
          </div>
          
          {/* Current Alternatives */}
          {output.problemStatement?.alternatives && output.problemStatement.alternatives.length > 0 && (
            <div>
              <p className="font-medium text-slate-900 mb-2">Current Alternatives</p>
              <ul className="space-y-2">
                {output.problemStatement.alternatives.map((alt, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-700">
                    <span className="text-slate-400 mt-1">→</span>
                    {alt}
                  </li>
                ))}
              </ul>
              {output.problemStatement.reasonsTheyFail && output.problemStatement.reasonsTheyFail.length > 0 && (
                <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm font-medium text-slate-700 mb-1">Why they fail:</p>
                  <ul className="space-y-1">
                    {output.problemStatement.reasonsTheyFail.map((reason, i) => (
                      <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                        <span className="text-red-400">×</span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          {/* Solution & Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <p className="text-sm font-medium text-green-700 mb-1">Our Solution</p>
              <p className="text-slate-800">{output.problemStatement?.coreSolution || 'Not specified'}</p>
            </div>
            {output.problemStatement?.keyBenefits && output.problemStatement.keyBenefits.length > 0 && (
              <div className="p-4 bg-violet-50 rounded-lg border border-violet-100">
                <p className="text-sm font-medium text-violet-700 mb-1">Key Benefits</p>
                <ul className="space-y-1">
                  {output.problemStatement.keyBenefits.map((benefit, i) => (
                    <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {/* Negative Consequences */}
          {output.problemStatement?.negativeConsequences && output.problemStatement.negativeConsequences.length > 0 && (
            <div>
              <p className="font-medium text-slate-900 mb-2">What happens if unsolved:</p>
              <ul className="space-y-1">
                {output.problemStatement.negativeConsequences.map((consequence, i) => (
                  <li key={i} className="text-slate-700 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    {consequence}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* Market Research */}
      {output.marketResearch && (
        <CollapsibleSection title="Market Research" icon={<TrendingUp className="w-5 h-5" />}>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500">TAM</p>
                <p className="font-semibold text-slate-900">{output.marketResearch.tam}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500">SAM</p>
                <p className="font-semibold text-slate-900">{output.marketResearch.sam}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500">SOM</p>
                <p className="font-semibold text-slate-900">{output.marketResearch.som}</p>
              </div>
            </div>
            
            <div>
              <p className="font-medium text-slate-900 mb-2">Market Growth</p>
              <p className="text-slate-700">{output.marketResearch.marketGrowthRate}</p>
            </div>

            <div>
              <p className="font-medium text-slate-900 mb-2">Key Trends</p>
              <ul className="space-y-1">
                {output.marketResearch.keyTrends?.map((trend, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-700">
                    <span className="text-violet-500 mt-1">•</span>
                    {trend}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-medium text-slate-900 mb-2">Competitors</p>
              <div className="space-y-3">
                {output.marketResearch.competitorAnalysis?.map((comp, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-slate-900">{comp.name}</p>
                      <span className="text-sm text-slate-500">{comp.marketShare} share</span>
                    </div>
                    <p className="text-sm text-slate-600"><span className="font-medium">Strengths:</span> {comp.strengths}</p>
                    <p className="text-sm text-slate-600"><span className="font-medium">Weaknesses:</span> {comp.weaknesses}</p>
                    <p className="text-sm text-slate-600"><span className="font-medium">Pricing:</span> {comp.pricing}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="font-medium text-slate-900 mb-2">Target Demographics</p>
              <p className="text-slate-700">{output.marketResearch.targetDemographics}</p>
            </div>

            <div>
              <p className="font-medium text-slate-900 mb-2">User Pain Points</p>
              <ul className="space-y-1">
                {output.marketResearch.userPainPoints?.map((pain, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-700">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    {pain}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-medium text-slate-900 mb-2">Market Gaps</p>
              <ul className="space-y-1">
                {output.marketResearch.marketGaps?.map((gap, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-700">
                    <Target className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {gap}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CollapsibleSection>
      )}

      {/* MVP Features */}
      <CollapsibleSection title="MVP Features" icon={<Wrench className="w-5 h-5" />}>
        <ul className="space-y-3">
          {output.mvpFeatures?.map((feature, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-sm font-medium flex-shrink-0">
                {i + 1}
              </span>
              <p className="text-slate-700">{feature}</p>
            </li>
          ))}
        </ul>
      </CollapsibleSection>

      {/* Tech Stack */}
      <CollapsibleSection title="Tech Stack" icon={<Code className="w-5 h-5" />}>
        <div className="grid gap-3">
          {output.techStack?.map((tech, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wide min-w-[80px]">{tech.category}</span>
                  <span className="font-semibold text-slate-900">{tech.tool}</span>
                  {tech.isFree && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Free</span>
                  )}
                </div>
                <p className="text-sm text-slate-600 mt-1">{tech.purpose}</p>
              </div>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      {/* Build Plan */}
      <CollapsibleSection title="Build Plan" icon={<ListTodo className="w-5 h-5" />}>
        <div className="space-y-4">
          {output.buildPlan?.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className="w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-semibold text-sm">
                  {step.step}
                </span>
                {i < (output.buildPlan?.length || 0) - 1 && (
                  <div className="w-0.5 flex-1 bg-slate-200 my-2" />
                )}
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-slate-900">{step.title}</h4>
                  <span className="text-sm text-slate-500">({step.estimatedTime})</span>
                </div>
                <p className="text-slate-700 text-sm mb-2">{step.description}</p>
                {'aiToolAction' in step && step.aiToolAction && (
                  <div className="p-3 bg-violet-50 rounded-lg border border-violet-100">
                    <p className="text-xs font-medium text-violet-700 mb-1">AI Tool Prompt:</p>
                    <p className="text-sm text-violet-900 font-mono">{step.aiToolAction}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      {/* Refinement Status & CTA */}
      {onRefine && (
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                {hasBeenRefined 
                  ? `Refined ${refinementCount} Time${refinementCount !== 1 ? 's' : ''}` 
                  : 'Want a More Detailed Plan?'}
              </h3>
              <p className="text-violet-100 text-sm mt-1">
                {hasBeenRefined 
                  ? 'Each refinement adds more detail, better structure, and actionable insights.'
                  : 'Transform this into a meticulously-crafted, publication-quality blueprint.'}
              </p>
            </div>
            <button
              onClick={onRefine}
              disabled={isRefining}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-violet-600 font-semibold rounded-lg hover:bg-violet-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg whitespace-nowrap"
            >
              {isRefining ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Refining...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  {hasBeenRefined ? `Refine Again (#${refinementCount + 1})` : '✨ Refine Plan'}
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Monetization */}
      {output.monetizationStrategy && (
        <CollapsibleSection title="Monetization Strategy" icon={<DollarSign className="w-5 h-5" />}>
          <div className="space-y-4">
            <div>
              <p className="font-medium text-slate-900 mb-1">Model</p>
              <p className="text-slate-700">{output.monetizationStrategy.model}</p>
            </div>
            <div>
              <p className="font-medium text-slate-900 mb-1">Pricing</p>
              <p className="text-slate-700">{output.monetizationStrategy.pricing}</p>
            </div>
            <div>
              <p className="font-medium text-slate-900 mb-2">First User Tactics</p>
              <ul className="space-y-1">
                {output.monetizationStrategy.firstUserTactics?.map((tactic, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-700">
                    <Users className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
                    {tactic}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-medium text-slate-900 mb-1">Revenue Estimate</p>
              <p className="text-slate-700">{output.monetizationStrategy.revenueEstimate}</p>
            </div>
          </div>
        </CollapsibleSection>
      )}
    </div>
  );
}
