/**
 * Feature Gate
 * 
 * Provides a simple feature flag system for toggling features
 * based on environment variables and user plan.
 */

import { FEATURES, STRIPE_PLANS } from "./constants";

export type FeatureName = keyof typeof FEATURES;
export type PlanName = keyof typeof STRIPE_PLANS;

interface FeatureContext {
  plan?: PlanName;
}

/**
 * Check if a feature is enabled globally
 */
export function isFeatureEnabled(feature: FeatureName): boolean {
  return !!FEATURES[feature];
}

/**
 * Check if a feature is enabled for a specific plan
 */
export function isFeatureEnabledForPlan(
  feature: FeatureName,
  plan: PlanName
): boolean {
  if (!isFeatureEnabled(feature)) return false;

  // Plan-specific restrictions
  const enterpriseOnly: FeatureName[] = ["teamCollaboration", "liveSessions"];
  const proOrEnterprise: FeatureName[] = ["certificates", "aiCurriculumBuilder"];

  if (enterpriseOnly.includes(feature) && plan !== "enterprise") return false;
  if (proOrEnterprise.includes(feature) && plan === "free") return false;

  return true;
}

/**
 * Feature gate hook
 */
export function useFeatureGate(context: FeatureContext = {}) {
  const canAccess = (feature: FeatureName): boolean => {
    if (!isFeatureEnabled(feature)) return false;
    if (context.plan) {
      return isFeatureEnabledForPlan(feature, context.plan);
    }
    return true;
  };

  return { canAccess };
}
