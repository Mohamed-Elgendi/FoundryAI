// AI Curriculum Engine Types - ACTUAL IMPLEMENTATION
// Beast Mode - Production Ready

export interface UserLearningProfile {
  id: string;
  userId: string;
  archetype: string;
  currentSkills: Skill[];
  targetSkills: Skill[];
  learningStyle: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
  timeAvailability: number; // hours per week
  goals: LearningGoal[];
  preferences: LearningPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  progress: number; // 0-100
}

export interface LearningGoal {
  id: string;
  title: string;
  description: string;
  deadline?: Date;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

export interface LearningPreferences {
  preferredContentTypes: ('video' | 'article' | 'interactive' | 'project')[];
  sessionDuration: number; // preferred minutes per session
  preferredTimes: ('morning' | 'afternoon' | 'evening')[];
  difficultyPreference: 'easy' | 'balanced' | 'challenging';
}

export interface Curriculum {
  id: string;
  userId: string;
  title: string;
  description: string;
  modules: CurriculumModule[];
  estimatedDuration: number; // total hours
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  aiGenerated: boolean;
  status: 'draft' | 'active' | 'completed' | 'archived';
  progress: number; // 0-100
  createdAt: Date;
  updatedAt: Date;
}

export interface CurriculumModule {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  order: number;
  estimatedDuration: number;
  completed: boolean;
  skillsCovered: string[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  contentType: 'video' | 'article' | 'interactive' | 'quiz' | 'project';
  content: LessonContent;
  duration: number; // minutes
  resources: Resource[];
  completed: boolean;
  order: number;
}

export interface LessonContent {
  videoUrl?: string;
  articleContent?: string;
  interactiveData?: InteractiveData;
  quizQuestions?: QuizQuestion[];
  projectInstructions?: string;
}

export interface InteractiveData {
  type: 'simulation' | 'exercise' | 'walkthrough';
  data: Record<string, any>;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Resource {
  id: string;
  title: string;
  type: 'link' | 'file' | 'tool' | 'template';
  url?: string;
  description: string;
}

export interface Assessment {
  id: string;
  userId: string;
  curriculumId: string;
  moduleId?: string;
  type: 'pre' | 'mid' | 'post' | 'practice';
  questions: AssessmentQuestion[];
  score?: number;
  maxScore: number;
  completedAt?: Date;
  createdAt: Date;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'open_ended' | 'code' | 'project';
  options?: string[];
  rubric?: string;
  userAnswer?: string;
  score?: number;
  feedback?: string;
}

export interface LearningProgress {
  id: string;
  userId: string;
  curriculumId: string;
  moduleId?: string;
  lessonId?: string;
  action: 'started' | 'completed' | 'reviewed' | 'assessed';
  timeSpent: number; // minutes
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface AIRecommendation {
  id: string;
  userId: string;
  type: 'next_lesson' | 'skill_gap' | 'resource' | 'career_path';
  title: string;
  description: string;
  relevance: number; // 0-100
  actionUrl?: string;
  dismissed: boolean;
  createdAt: Date;
}

// Certificate Types
export interface Certificate {
  id: string;
  userId: string;
  curriculumId: string;
  templateId: string;
  title: string;
  description: string;
  skills: string[];
  issueDate: Date;
  expiryDate?: Date;
  verificationCode: string;
  blockchainHash?: string;
  status: 'active' | 'expired' | 'revoked';
}

export interface CertificateTemplate {
  id: string;
  name: string;
  description: string;
  design: CertificateDesign;
  requirements: CertificateRequirements;
  active: boolean;
}

export interface CertificateDesign {
  backgroundImage?: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string;
  fontFamily: string;
}

export interface CertificateRequirements {
  minScore: number;
  requiredModules: string[];
  timeSpent: number; // minimum minutes
  assessments: string[];
}
