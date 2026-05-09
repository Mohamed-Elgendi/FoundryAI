/**
 * Layer 4: Logic - Business Rules
 */

export interface BusinessRule {
  id: string;
  name: string;
  condition: (data: unknown) => boolean;
  action: (data: unknown) => unknown;
}

export const defaultRules: BusinessRule[] = [
  {
    id: 'validate-user',
    name: 'Validate User',
    condition: (data) => !!data,
    action: (data) => data
  }
];

export function applyRules(data: unknown, rules: BusinessRule[]): unknown {
  return rules.reduce((result, rule) => {
    if (rule.condition(result)) {
      return rule.action(result);
    }
    return result;
  }, data);
}
