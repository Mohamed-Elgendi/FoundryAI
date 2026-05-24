/**
 * Business Rules Engine
 * 
 * Validates and enforces business rules for guides, curriculums, assignments,
 * enrollments, and user actions. Pluggable rule system with support for
 * custom validation logic.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type RuleSeverity = "error" | "warning" | "info";

export interface ValidationRule<T = any> {
  /** Unique identifier for this rule */
  id: string;
  /** Human-readable description */
  description: string;
  /** Severity level */
  severity: RuleSeverity;
  /** Category for grouping */
  category: string;
  /** Validation function */
  validate: (input: T) => ValidationResult;
}

export interface ValidationResult {
  /** Whether validation passed */
  valid: boolean;
  /** Error/warning message if invalid */
  message?: string;
  /** Rule ID that produced this result */
  ruleId: string;
  /** Severity of the result */
  severity: RuleSeverity;
  /** Additional context */
  context?: Record<string, unknown>;
}

export interface RuleSetResult {
  /** All validation results */
  results: ValidationResult[];
  /** Whether all rules passed */
  allPassed: boolean;
  /** Whether all error-severity rules passed */
  errorsPassed: boolean;
  /** Count of errors, warnings, info */
  errors: number;
  warnings: number;
  infos: number;
}

export interface GuideValidationInput {
  title: string;
  description: string;
  subject: string;
  difficulty: string;
  estimatedDuration: string;
  targetAudience: string;
  curriculum?: CurriculumItem[];
}

export interface CurriculumItem {
  title: string;
  content: string;
  duration: string;
  type: "lesson" | "exercise" | "quiz" | "project";
  prerequisites?: string[];
}

export interface AssignmentValidationInput {
  title: string;
  description: string;
  guideId: string;
  dueDate?: string;
  maxScore?: number;
  instructions: string;
  attachments?: Array<{ name: string; size: number; type: string }>;
}

export interface EnrollmentValidationInput {
  guideId: string;
  userId: string;
  courseId?: string;
}

// ─── Error Messages ──────────────────────────────────────────────────────────

const ERRORS = {
  guide: {
    title_empty: "Guide title is required",
    title_too_short: "Guide title must be at least 3 characters",
    title_too_long: "Guide title must be at most 200 characters",
    description_empty: "Guide description is required",
    description_too_short: "Guide description must be at least 20 characters",
    subject_empty: "Subject is required",
    invalid_difficulty: "Difficulty must be: beginner, intermediate, advanced, or expert",
    invalid_duration: "Invalid duration format (e.g., 2h, 30m, 1d)",
    curriculum_empty: "Guide must have at least one curriculum item",
    curriculum_item_invalid: "Each curriculum item must have title, content, duration, and type",
  },
  curriculum: {
    empty: "Curriculum cannot be empty",
    item_missing_title: "Each lesson must have a title",
    item_missing_content: "Each lesson must have content",
    item_missing_duration: "Each lesson must have a duration",
    item_invalid_type: "Lesson type must be: lesson, exercise, quiz, or project",
    prerequisites_missing: "Prerequisite '{{id}}' not found in curriculum",
    circular_dependency: "Circular dependency detected in curriculum prerequisites",
  },
  assignment: {
    title_empty: "Assignment title is required",
    description_empty: "Assignment description is required",
    guide_id_empty: "Guide ID is required",
    due_date_invalid: "Due date must be in the future",
    max_score_invalid: "Max score must be a positive number",
    instructions_empty: "Instructions are required",
    attachment_too_large: "Attachment '{{name}}' exceeds maximum size (10MB)",
    attachment_invalid_type: "Attachment '{{name}}' has invalid file type",
    too_many_attachments: "Maximum 5 attachments allowed",
  },
  enrollment: {
    guide_id_empty: "Guide ID is required",
    user_id_empty: "User ID is required",
    already_enrolled: "User is already enrolled in this guide",
    guide_not_found: "Guide not found",
    guide_not_public: "Guide is not public",
  },
} as const;

// ─── Duration Validator ──────────────────────────────────────────────────────

const DURATION_REGEX = /^(\d+)([smhd])$/;

function isValidDuration(duration: string): boolean {
  return DURATION_REGEX.test(duration);
}

// ─── Duration to minutes ─────────────────────────────────────────────────────

export function durationToMinutes(duration: string): number | null {
  const match = duration.match(DURATION_REGEX);
  if (!match) return null;

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case "s": return value / 60;
    case "m": return value;
    case "h": return value * 60;
    case "d": return value * 60 * 60;
    default: return null;
  }
}

// ─── Circular Dependency Detection ───────────────────────────────────────────

function hasCircularDependencies(items: CurriculumItem[]): boolean {
  const idMap = new Map(items.map((item, i) => [i, item.prerequisites || []]));
  const visited = new Set<number>();
  const recStack = new Set<number>();

  function dfs(node: number): boolean {
    visited.add(node);
    recStack.add(node);

    for (const dep of idMap.get(node) || []) {
      const depIndex = items.findIndex((item) => item.title === dep);
      if (depIndex === -1) continue;

      if (!visited.has(depIndex)) {
        if (dfs(depIndex)) return true;
      } else if (recStack.has(depIndex)) {
        return true;
      }
    }

    recStack.delete(node);
    return false;
  }

  for (let i = 0; i < items.length; i++) {
    if (!visited.has(i)) {
      if (dfs(i)) return true;
    }
  }
  return false;
}

// ─── Rule Set ────────────────────────────────────────────────────────────────

export const GUIDE_RULES: ValidationRule<GuideValidationInput>[] = [
  {
    id: "guide.title_required",
    description: "Guide title must not be empty",
    severity: "error",
    category: "guide",
    validate: (input) => ({
      valid: !!(input.title && input.title.trim().length > 0),
      message: ERRORS.guide.title_empty,
      ruleId: "guide.title_required",
      severity: "error",
    }),
  },
  {
    id: "guide.title_length",
    description: "Guide title must be between 3 and 200 characters",
    severity: "error",
    category: "guide",
    validate: (input) => {
      const len = input.title?.trim().length || 0;
      if (len < 3)
        return { valid: false, message: ERRORS.guide.title_too_short, ruleId: "guide.title_length", severity: "error" };
      if (len > 200)
        return { valid: false, message: ERRORS.guide.title_too_long, ruleId: "guide.title_length", severity: "error" };
      return { valid: true, ruleId: "guide.title_length", severity: "error" };
    },
  },
  {
    id: "guide.description_required",
    description: "Guide description must not be empty",
    severity: "error",
    category: "guide",
    validate: (input) => ({
      valid: !!(input.description && input.description.trim().length > 0),
      message: ERRORS.guide.description_empty,
      ruleId: "guide.description_required",
      severity: "error",
    }),
  },
  {
    id: "guide.description_length",
    description: "Guide description must be at least 20 characters",
    severity: "error",
    category: "guide",
    validate: (input) => ({
      valid: (input.description?.trim().length || 0) >= 20,
      message: ERRORS.guide.description_too_short,
      ruleId: "guide.description_length",
      severity: "error",
    }),
  },
  {
    id: "guide.subject_required",
    description: "Guide subject must not be empty",
    severity: "error",
    category: "guide",
    validate: (input) => ({
      valid: !!(input.subject && input.subject.trim().length > 0),
      message: ERRORS.guide.subject_empty,
      ruleId: "guide.subject_required",
      severity: "error",
    }),
  },
  {
    id: "guide.valid_difficulty",
    description: "Difficulty must be a valid level",
    severity: "error",
    category: "guide",
    validate: (input) => {
      const valid = ["beginner", "intermediate", "advanced", "expert"];
      return {
        valid: valid.includes(input.difficulty),
        message: ERRORS.guide.invalid_difficulty,
        ruleId: "guide.valid_difficulty",
        severity: "error",
      };
    },
  },
  {
    id: "guide.valid_duration",
    description: "Duration must be a valid format (e.g., 2h, 30m, 1d)",
    severity: "warning",
    category: "guide",
    validate: (input) => ({
      valid: isValidDuration(input.estimatedDuration),
      message: ERRORS.guide.invalid_duration,
      ruleId: "guide.valid_duration",
      severity: "warning",
    }),
  },
  {
    id: "guide.curriculum_not_empty",
    description: "Guide must have at least one curriculum item",
    severity: "error",
    category: "guide",
    validate: (input) => ({
      valid: (input.curriculum?.length ?? 0) > 0,
      message: ERRORS.guide.curriculum_empty,
      ruleId: "guide.curriculum_not_empty",
      severity: "error",
    }),
  },
];

export const ASSIGNMENT_RULES: ValidationRule<AssignmentValidationInput>[] = [
  {
    id: "assignment.title_required",
    description: "Assignment title is required",
    severity: "error",
    category: "assignment",
    validate: (input) => ({
      valid: !!(input.title && input.title.trim().length > 0),
      message: ERRORS.assignment.title_empty,
      ruleId: "assignment.title_required",
      severity: "error",
    }),
  },
  {
    id: "assignment.description_required",
    description: "Assignment description is required",
    severity: "error",
    category: "assignment",
    validate: (input) => ({
      valid: !!(input.description && input.description.trim().length > 0),
      message: ERRORS.assignment.description_empty,
      ruleId: "assignment.description_required",
      severity: "error",
    }),
  },
  {
    id: "assignment.guide_id_required",
    description: "Assignment must be linked to a guide",
    severity: "error",
    category: "assignment",
    validate: (input) => ({
      valid: !!(input.guideId && input.guideId.trim().length > 0),
      message: ERRORS.assignment.guide_id_empty,
      ruleId: "assignment.guide_id_required",
      severity: "error",
    }),
  },
  {
    id: "assignment.instructions_required",
    description: "Assignment instructions are required",
    severity: "error",
    category: "assignment",
    validate: (input) => ({
      valid: !!(input.instructions && input.instructions.trim().length > 0),
      message: ERRORS.assignment.instructions_empty,
      ruleId: "assignment.instructions_required",
      severity: "error",
    }),
  },
  {
    id: "assignment.due_date_valid",
    description: "Due date must be in the future",
    severity: "error",
    category: "assignment",
    validate: (input) => {
      if (!input.dueDate) return { valid: true, ruleId: "assignment.due_date_valid", severity: "error" };
      const due = new Date(input.dueDate);
      const now = new Date();
      return {
        valid: due > now,
        message: ERRORS.assignment.due_date_invalid,
        ruleId: "assignment.due_date_valid",
        severity: "error",
      };
    },
  },
  {
    id: "assignment.max_score_valid",
    description: "Max score must be a positive number",
    severity: "error",
    category: "assignment",
    validate: (input) => {
      if (input.maxScore === undefined) return { valid: true, ruleId: "assignment.max_score_valid", severity: "error" };
      return {
        valid: typeof input.maxScore === "number" && input.maxScore > 0,
        message: ERRORS.assignment.max_score_invalid,
        ruleId: "assignment.max_score_valid",
        severity: "error",
      };
    },
  },
  {
    id: "assignment.attachments_valid",
    description: "Attachments must be valid",
    severity: "error",
    category: "assignment",
    validate: (input) => {
      if (!input.attachments || input.attachments.length === 0) {
        return { valid: true, ruleId: "assignment.attachments_valid", severity: "error" };
      }
      if (input.attachments.length > 5) {
        return {
          valid: false,
          message: ERRORS.assignment.too_many_attachments,
          ruleId: "assignment.attachments_valid",
          severity: "error",
        };
      }
      for (const att of input.attachments) {
        if (att.size > 10 * 1024 * 1024) {
          return {
            valid: false,
            message: ERRORS.assignment.attachment_too_large.replace("{{name}}", att.name),
            ruleId: "assignment.attachments_valid",
            severity: "error",
          };
        }
      }
      return { valid: true, ruleId: "assignment.attachments_valid", severity: "error" };
    },
  },
];

export const ENROLLMENT_RULES: ValidationRule<EnrollmentValidationInput>[] = [
  {
    id: "enrollment.guide_id_required",
    description: "Guide ID is required",
    severity: "error",
    category: "enrollment",
    validate: (input) => ({
      valid: !!(input.guideId && input.guideId.trim().length > 0),
      message: ERRORS.enrollment.guide_id_empty,
      ruleId: "enrollment.guide_id_required",
      severity: "error",
    }),
  },
  {
    id: "enrollment.user_id_required",
    description: "User ID is required",
    severity: "error",
    category: "enrollment",
    validate: (input) => ({
      valid: !!(input.userId && input.userId.trim().length > 0),
      message: ERRORS.enrollment.user_id_empty,
      ruleId: "enrollment.user_id_required",
      severity: "error",
    }),
  },
];

// ─── Rule Registry ───────────────────────────────────────────────────────────

const ruleRegistry = new Map<string, ValidationRule<any>>();

/** Register a custom validation rule */
export function registerRule<T = any>(rule: ValidationRule<T>): void {
  ruleRegistry.set(rule.id, rule);
}

/** Unregister a validation rule */
export function unregisterRule(ruleId: string): void {
  ruleRegistry.delete(ruleId);
}

/** Get a registered rule by ID */
export function getRule(ruleId: string): ValidationRule<any> | undefined {
  return ruleRegistry.get(ruleId);
}

// ─── Core Execution ──────────────────────────────────────────────────────────

/**
 * Execute a single validation rule against input data
 */
export function executeRule<T = any>(
  rule: ValidationRule<T>,
  input: T
): ValidationResult {
  try {
    return rule.validate(input);
  } catch (error) {
    return {
      valid: false,
      message: `Rule execution failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      ruleId: rule.id,
      severity: rule.severity,
    };
  }
}

/**
 * Validate a single rule against input
 */
export function validateRule<T = any>(
  ruleId: string,
  input: T,
  rules: ValidationRule<T>[] = []
): ValidationResult | undefined {
  const rule = rules.find((r) => r.id === ruleId) || ruleRegistry.get(ruleId);
  if (!rule) return undefined;
  return executeRule(rule, input);
}

/**
 * Execute a set of rules against input data
 */
export function executeRules<T = any>(
  rules: ValidationRule<T>[],
  input: T
): RuleSetResult {
  const results = rules.map((rule) => executeRule(rule, input));
  const errors = results.filter((r) => !r.valid && r.severity === "error").length;
  const warnings = results.filter((r) => !r.valid && r.severity === "warning").length;
  const infos = results.filter((r) => !r.valid && r.severity === "info").length;

  return {
    results,
    allPassed: results.every((r) => r.valid),
    errorsPassed: errors === 0,
    errors,
    warnings,
    infos,
  };
}

// ─── Convenience Validators ──────────────────────────────────────────────────

/**
 * Validate guide data
 */
export function validateGuide(input: GuideValidationInput): RuleSetResult {
  return executeRules(GUIDE_RULES, input);
}

/**
 * Validate curriculum data
 */
export function validateCurriculum(
  items: CurriculumItem[]
): RuleSetResult {
  const results: ValidationResult[] = [];

  if (items.length === 0) {
    results.push({
      valid: false,
      message: ERRORS.curriculum.empty,
      ruleId: "curriculum.not_empty",
      severity: "error",
    });
    return { results, allPassed: false, errorsPassed: false, errors: 1, warnings: 0, infos: 0 };
  }

  const titleSet = new Set<string>();

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    if (!item.title?.trim()) {
      results.push({
        valid: false,
        message: ERRORS.curriculum.item_missing_title,
        ruleId: "curriculum.item_has_title",
        severity: "error",
      });
    } else {
      if (titleSet.has(item.title)) {
        results.push({
          valid: false,
          message: `Duplicate curriculum item title: "${item.title}"`,
          ruleId: "curriculum.unique_titles",
          severity: "error",
        });
      }
      titleSet.add(item.title);
    }

    if (!item.content?.trim()) {
      results.push({
        valid: false,
        message: ERRORS.curriculum.item_missing_content,
        ruleId: "curriculum.item_has_content",
        severity: "error",
      });
    }

    if (!item.duration || !isValidDuration(item.duration)) {
      results.push({
        valid: false,
        message: ERRORS.curriculum.item_missing_duration,
        ruleId: "curriculum.item_has_duration",
        severity: "error",
      });
    }

    const validTypes = ["lesson", "exercise", "quiz", "project"];
    if (!validTypes.includes(item.type)) {
      results.push({
        valid: false,
        message: ERRORS.curriculum.item_invalid_type,
        ruleId: "curriculum.item_valid_type",
        severity: "error",
      });
    }

    if (item.prerequisites) {
      for (const prereq of item.prerequisites) {
        if (!items.some((other) => other.title === prereq)) {
          results.push({
            valid: false,
            message: ERRORS.curriculum.prerequisites_missing.replace("{{id}}", prereq),
            ruleId: "curriculum.prerequisite_exists",
            severity: "error",
            context: { prerequisite: prereq },
          });
        }
      }
    }
  }

  if (hasCircularDependencies(items)) {
    results.push({
      valid: false,
      message: ERRORS.curriculum.circular_dependency,
      ruleId: "curriculum.no_circular_deps",
      severity: "error",
    });
  }

  const errors = results.filter((r) => r.severity === "error").length;
  const warnings = results.filter((r) => r.severity === "warning").length;
  const infos = results.filter((r) => r.severity === "info").length;

  return {
    results,
    allPassed: errors === 0,
    errorsPassed: errors === 0,
    errors,
    warnings,
    infos,
  };
}

/**
 * Validate assignment data
 */
export function validateAssignment(input: AssignmentValidationInput): RuleSetResult {
  return executeRules(ASSIGNMENT_RULES, input);
}

/**
 * Validate enrollment data
 */
export function validateEnrollment(input: EnrollmentValidationInput): RuleSetResult {
  return executeRules(ENROLLMENT_RULES, input);
}

// ─── Aggregate Validation ────────────────────────────────────────────────────

/**
 * Run multiple rule sets and aggregate results
 */
export function validateAll(ruleSets: RuleSetResult[]): RuleSetResult {
  const allResults = ruleSets.flatMap((s) => s.results);
  const errors = allResults.filter((r) => !r.valid && r.severity === "error").length;
  const warnings = allResults.filter((r) => !r.valid && r.severity === "warning").length;
  const infos = allResults.filter((r) => !r.valid && r.severity === "info").length;

  return {
    results: allResults,
    allPassed: errors === 0,
    errorsPassed: errors === 0,
    errors,
    warnings,
    infos,
  };
}
