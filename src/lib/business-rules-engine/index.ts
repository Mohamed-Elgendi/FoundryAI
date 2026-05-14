/**
 * Business Rules Engine - Index
 * 
 * Re-exports all public APIs from the business rules engine.
 */

export {
  // Types
  ValidationRule,
  ValidationResult,
  RuleSetResult,
  RuleSeverity,
  GuideValidationInput,
  CurriculumItem,
  AssignmentValidationInput,
  EnrollmentValidationInput,

  // Core functions
  executeRule,
  validateRule,
  executeRules,
  validateGuide,
  validateCurriculum,
  validateAssignment,
  validateEnrollment,
  validateAll,

  // Registry
  registerRule,
  unregisterRule,
  getRule,

  // Utilities
  durationToMinutes,

  // Default rule sets
  GUIDE_RULES,
  ASSIGNMENT_RULES,
  ENROLLMENT_RULES,
} from "./engine";
