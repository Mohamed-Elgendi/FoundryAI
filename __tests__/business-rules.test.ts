/**
 * Business Rules Engine Tests
 *
 * Tests for validateGuide, validateCurriculum, validateAssignment.
 */

import {
  validateGuide,
  validateCurriculum,
  validateAssignment,
} from "@/lib/business-rules-engine";

describe("Business Rules Engine", () => {
  describe("validateGuide", () => {
    it("should reject empty guide", () => {
      const result = validateGuide({
        title: "",
        description: "",
        subject: "",
        difficulty: "",
        estimatedDuration: "",
        targetAudience: "",
      });
      expect(result.errors).toBeGreaterThan(0);
      expect(result.allPassed).toBe(false);
    });

    it("should accept valid guide", () => {
      const result = validateGuide({
        title: "Test Guide",
        description: "A test guide description for testing purposes",
        subject: "Math",
        difficulty: "beginner",
        estimatedDuration: "2h",
        targetAudience: "students",
        curriculum: [
          {
            title: "Lesson 1",
            content: "Content here",
            duration: "30m",
            type: "lesson",
          },
        ],
      });
      expect(result.errors).toBe(0);
      expect(result.allPassed).toBe(true);
    });

    it("should reject short title", () => {
      const result = validateGuide({
        title: "AB",
        description: "A test guide description for testing purposes",
        subject: "Math",
        difficulty: "beginner",
        estimatedDuration: "2h",
        targetAudience: "students",
        curriculum: [
          {
            title: "Lesson 1",
            content: "Content",
            duration: "30m",
            type: "lesson",
          },
        ],
      });
      expect(result.errors).toBeGreaterThan(0);
    });
  });

  describe("validateCurriculum", () => {
    it("should reject empty curriculum", () => {
      const result = validateCurriculum([]);
      expect(result.errors).toBeGreaterThan(0);
    });

    it("should reject curriculum with circular dependencies", () => {
      const result = validateCurriculum([
        {
          title: "A",
          content: "x",
          duration: "30m",
          type: "lesson",
          prerequisites: ["B"],
        },
        {
          title: "B",
          content: "x",
          duration: "30m",
          type: "lesson",
          prerequisites: ["A"],
        },
      ]);
      expect(result.errors).toBeGreaterThan(0);
    });

    it("should accept valid curriculum", () => {
      const result = validateCurriculum([
        {
          title: "Lesson 1",
          content: "Content",
          duration: "30m",
          type: "lesson",
        },
        {
          title: "Lesson 2",
          content: "Content",
          duration: "45m",
          type: "exercise",
        },
      ]);
      expect(result.errors).toBe(0);
    });

    it("should reject missing title", () => {
      const result = validateCurriculum([
        {
          title: "",
          content: "Content",
          duration: "30m",
          type: "lesson",
        },
      ]);
      expect(result.errors).toBeGreaterThan(0);
    });
  });

  describe("validateAssignment", () => {
    it("should reject empty assignment", () => {
      const result = validateAssignment({
        title: "",
        description: "",
        guideId: "",
        instructions: "",
      });
      expect(result.errors).toBeGreaterThan(0);
    });

    it("should accept valid assignment", () => {
      const futureDate = new Date(Date.now() + 86400000).toISOString();
      const result = validateAssignment({
        title: "Homework 1",
        description: "Complete the exercises",
        guideId: "guide-123",
        instructions: "Do the following tasks...",
        dueDate: futureDate,
        maxScore: 100,
      });
      expect(result.errors).toBe(0);
    });
  });
});
