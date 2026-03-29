'use client';

import { useState } from 'react';
import { FoundryAIOutput } from '@/types';
import { ChevronDown, ChevronUp, Lightbulb, Users, Search, Wrench, Code, ListTodo, DollarSign, TrendingUp, Target, AlertCircle } from 'lucide-react';

interface PlanOutputProps {
  output: FoundryAIOutput;
  onReset?: () => void;
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

export function PlanOutput({ output, onReset }: PlanOutputProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{output.toolIdea}</h2>
          <p className="text-slate-600 mt-1">{output.targetUser}</p>
        </div>
        {onReset && (
          <button
            onClick={onReset}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Generate New Plan
          </button>
        )}
      </div>

      {/* Problem Statement */}
      <CollapsibleSection title="Problem & Solution" icon={<Lightbulb className="w-5 h-5" />}>
        <p className="text-slate-700 leading-relaxed">{output.problemStatement}</p>
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
