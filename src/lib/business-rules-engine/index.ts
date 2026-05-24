/**
 * Business Rules Engine - Index
 * 
 * Re-exports all public APIs from the business rules engine.
 */

export type {
  ValidationRule,
  ValidationResult,
  RuleSetResult,
  RuleSeverity,
  GuideValidationInput,
  CurriculumItem,
  AssignmentValidationInput,
  EnrollmentValidationInput,
} from "./engine";

export {
  executeRule,
  validateRule,
  executeRules,
  validateGuide,
  validateCurriculum,
  validateAssignment,
  validateEnrollment,
  validateAll,
  registerRule,
  unregisterRule,
  getRule,
  durationToMinutes,
  GUIDE_RULES,
  ASSIGNMENT_RULES,
  ENROLLMENT_RULES,
} from "./engine";
