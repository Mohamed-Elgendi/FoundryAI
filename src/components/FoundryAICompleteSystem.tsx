'use client';

import React from 'react';
import { Tier1FoundationPanel } from '@/components/tier1';
import { IdeaExtractionEngine } from '@/components/tier2';
import { WorkflowEngine, ToolRecommender } from '@/components/tier3';

/**
 * FoundryAI Complete Tier System Integration
 * 
 * This component integrates all 6 tiers of the FoundryAI ecosystem:
 * - Tier 1: Core Foundation (Always Active)
 * - Tier 2: Opportunity Intelligence
 * - Tier 3: Build & Execution
 * - Tier 4: Personal Development (placeholder)
 * - Tier 5: Training & Education (placeholder)
 * - Tier 6: Monetization & Growth (placeholder)
 */

interface FoundryAICompleteSystemProps {
  // Tier visibility flags
  showTier1?: boolean;
  showTier2?: boolean;
  showTier3?: boolean;
  showFloatingButtons?: boolean;
}

export function FoundryAICompleteSystem({
  showTier1 = true,
  showTier2 = true,
  showTier3 = true,
  showFloatingButtons = true,
}: FoundryAICompleteSystemProps) {
  return (
    <>
      {/* Tier 1: Core Foundation - Always Active Layer */}
      {showTier1 && (
        <div className="tier-1-foundation">
          <Tier1FoundationPanel />
        </div>
      )}

      {/* Tier 2: Opportunity Intelligence */}
      {showTier2 && showFloatingButtons && (
        <div className="tier-2-opportunity">
          <IdeaExtractionEngine />
        </div>
      )}

      {/* Tier 3: Build & Execution */}
      {showTier3 && showFloatingButtons && (
        <div className="tier-3-execution">
          <WorkflowEngine />
          <ToolRecommender />
        </div>
      )}
    </>
  );
}

// Export individual tier systems for flexible composition
export { Tier1FoundationPanel } from '@/components/tier1';
export { IdeaExtractionEngine, ExpandedTemplateGallery } from '@/components/tier2';
export { WorkflowEngine, ToolRecommender } from '@/components/tier3';

// Export all tier components
export * from '@/components/tier1';
export * from '@/components/tier2';
export * from '@/components/tier3';
