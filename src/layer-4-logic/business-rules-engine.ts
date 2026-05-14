// ============================================
// FoundryAI - Business Rules Engine
// Layer 4: Logic Layer
// Rule evaluation and enforcement
// ============================================

export interface RuleResult {
  passed: boolean;
  ruleId: string;
  message: string;
  data?: Record<string, any>;
}

export interface BusinessRule {
  id: string;
  name: string;
  description: string;
  priority: number; // lower = higher priority
  evaluate: (context: RuleContext) => Promise<RuleResult> | RuleResult;
}

export interface RuleContext {
  userId: string;
  action: string;
  entityType: string;
  entityId?: string;
  data: Record<string, any>;
  userProfile?: UserProfile;
  membershipTier?: string;
  creditsRemaining?: number;
  [key: string]: any;
}

export interface UserProfile {
  id: string;
  email: string;
  tier: string;
  credits: number;
  level: number;
  xp: number;
  createdAt: Date;
  [key: string]: any;
}

export class BusinessRulesEngine {
  private rules: Map<string, BusinessRule> = new Map();
  private static instance: BusinessRulesEngine;

  static getInstance(): BusinessRulesEngine {
    if (!BusinessRulesEngine.instance) {
      BusinessRulesEngine.instance = new BusinessRulesEngine();
    }
    return BusinessRulesEngine.instance;
  }

  register(rule: BusinessRule): void {
    this.rules.set(rule.id, rule);
  }

  unregister(ruleId: string): void {
    this.rules.delete(ruleId);
  }

  async evaluate(context: RuleContext, ruleIds?: string[]): Promise<RuleResult[]> {
    const rulesToEvaluate = ruleIds
      ? ruleIds.map((id) => this.rules.get(id)).filter(Boolean) as BusinessRule[]
      : Array.from(this.rules.values());

    // Sort by priority
    rulesToEvaluate.sort((a, b) => a.priority - b.priority);

    const results: RuleResult[] = [];
    for (const rule of rulesToEvaluate) {
      try {
        const result = await rule.evaluate(context);
        results.push(result);
      } catch (err) {
        results.push({
          passed: false,
          ruleId: rule.id,
          message: `Rule evaluation error: ${err instanceof Error ? err.message : String(err)}`,
        });
      }
    }
    return results;
  }

  async evaluateAll(context: RuleContext): Promise<{ passed: boolean; results: RuleResult[] }> {
    const results = await this.evaluate(context);
    const allPassed = results.every((r) => r.passed);
    return { passed: allPassed, results };
  }

  async evaluateAny(context: RuleContext): Promise<{ passed: boolean; results: RuleResult[] }> {
    const results = await this.evaluate(context);
    const anyPassed = results.some((r) => r.passed);
    return { passed: anyPassed, results };
  }

  getRules(): BusinessRule[] {
    return Array.from(this.rules.values());
  }

  clear(): void {
    this.rules.clear();
  }
}

export const rulesEngine = BusinessRulesEngine.getInstance();

// ============================================
// Core Business Rules
// ============================================

export const coreRules: BusinessRule[] = [
  {
    id: "auth_required",
    name: "Authentication Required",
    description: "User must be authenticated to perform actions",
    priority: 1,
    evaluate: (ctx) => ({
      passed: !!ctx.userId,
      ruleId: "auth_required",
      message: ctx.userId ? "User authenticated" : "Authentication required",
    }),
  },
  {
    id: "tier_access",
    name: "Tier Access Check",
    description: "User must have the required membership tier",
    priority: 10,
    evaluate: (ctx) => {
      const tierHierarchy: Record<string, number> = {
        free: 0,
        starter: 1,
        pro: 2,
        elite: 3,
        legend: 4,
      };
      const requiredTier = ctx.data.requiredTier || "free";
      const userTier = ctx.membershipTier || "free";

      return {
        passed: tierHierarchy[userTier] >= tierHierarchy[requiredTier],
        ruleId: "tier_access",
        message: `Required tier: ${requiredTier}, user tier: ${userTier}`,
      };
    },
  },
  {
    id: "credits_available",
    name: "Credits Available",
    description: "User must have sufficient credits",
    priority: 20,
    evaluate: (ctx) => {
      const requiredCredits = ctx.data.requiredCredits || 0;
      const available = ctx.creditsRemaining ?? 0;

      return {
        passed: available >= requiredCredits,
        ruleId: "credits_available",
        message: `Required: ${requiredCredits}, Available: ${available}`,
        data: { required: requiredCredits, available },
      };
    },
  },
  {
    id: "daily_rate_limit",
    name: "Daily Rate Limit",
    description: "Prevents exceeding daily usage limits",
    priority: 30,
    evaluate: (ctx) => {
      const dailyLimit = ctx.data.dailyLimit || Infinity;
      const todayUsage = ctx.data.todayUsage || 0;

      return {
        passed: todayUsage < dailyLimit,
        ruleId: "daily_rate_limit",
        message: `Usage: ${todayUsage}/${dailyLimit}`,
      };
    },
  },
  {
    id: "revenue_milestone",
    name: "Revenue Milestone Unlocked",
    description: "Premium features only after revenue milestone",
    priority: 40,
    evaluate: (ctx) => {
      const requiredRevenue = ctx.data.requiredRevenue || 0;
      const userRevenue = ctx.data.userRevenue || 0;

      return {
        passed: userRevenue >= requiredRevenue,
        ruleId: "revenue_milestone",
        message: `Revenue: $${userRevenue}/$${requiredRevenue}`,
      };
    },
  },
  {
    id: "sequential_progression",
    name: "Sequential Progression",
    description: "User must complete prerequisites before accessing new content",
    priority: 50,
    evaluate: (ctx) => {
      const requiredLevel = ctx.data.requiredLevel || 0;
      const userLevel = ctx.userProfile?.level || 0;

      return {
        passed: userLevel >= requiredLevel,
        ruleId: "sequential_progression",
        message: `Required level: ${requiredLevel}, user level: ${userLevel}`,
      };
    },
  },
];

// Register core rules on module load
for (const rule of coreRules) {
  rulesEngine.register(rule);
}
