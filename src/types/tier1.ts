/**
 * Tier 1 Core Foundation Layer - Type Definitions
 * All types for the 8 foundation systems
 */

// ============================================
// 1. BELIEF ARCHITECTURE TYPES
// ============================================

export interface BeliefScore {
  id: string;
  userId: string;
  overallScore: number;
  level: 1 | 2 | 3 | 4 | 5;
  microProofCount: number;
  patternRecognitionCount: number;
  capabilityEvidenceCount: number;
  identityMilestones: number;
  legendaryMoments: number;
  createdAt: string;
  updatedAt: string;
}

export interface BeliefEvidence {
  id: string;
  userId: string;
  evidenceType: 'micro_proof' | 'pattern' | 'capability' | 'identity' | 'legendary';
  description: string;
  impactScore: number;
  relatedBelief?: string;
  dateRecorded: string;
  createdAt: string;
}

// ============================================
// 2. SUCCESS MINDSET FORGE TYPES
// ============================================

export type MindsetPillarName =
  | 'abundance_consciousness'
  | 'growth_mindset'
  | 'resilience'
  | 'possibility_expansion'
  | 'owner_mentality'
  | 'long_term_vision'
  | 'limitless_potential';

export interface MindsetPillar {
  id: string;
  userId: string;
  pillarName: MindsetPillarName;
  currentScore: number;
  targetScore: number;
  practiceStreak: number;
  lastPracticed?: string;
  insights: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MindsetExercise {
  id: string;
  userId: string;
  pillarName: string;
  exerciseType: string;
  content: string;
  completionStatus: 'started' | 'completed' | 'skipped';
  reflection?: string;
  completedAt?: string;
  createdAt: string;
}

// ============================================
// 3. CONFIDENCE CORE TYPES
// ============================================

export interface ConfidenceQuotient {
  id: string;
  userId: string;
  overallCq: number;
  technicalCq: number;
  salesCq: number;
  strategyCq: number;
  creativeCq: number;
  communicationCq: number;
  leadershipCq: number;
  lastAssessment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConfidenceEvidence {
  id: string;
  userId: string;
  layer: 1 | 2 | 3 | 4 | 5;
  evidenceType: 'micro_win' | 'daily_victory' | 'weekly_breakthrough' | 'monthly_transformation' | 'legendary_proof';
  description: string;
  domain?: 'technical' | 'sales' | 'strategy' | 'creative' | 'communication' | 'leadership' | 'general';
  impactRating?: number;
  dateRecorded: string;
  createdAt: string;
}

// ============================================
// 4. AFFIRMATION & JOURNALING TYPES
// ============================================

export type JournalEntryType = 'morning_ritual' | 'evening_ritual' | 'midday_check' | 'spontaneous';
export type MoodType = 'energized' | 'peaceful' | 'anxious' | 'grateful' | 'focused' | 'tired' | 'excited' | 'reflective';

export interface JournalEntry {
  id: string;
  userId: string;
  entryType: JournalEntryType;
  content: string;
  mood?: MoodType;
  gratitudeItems: string[];
  affirmationsUsed: string[];
  mindAlignmentScore?: number;
  bodyAlignmentScore?: number;
  soulAlignmentScore?: number;
  entryDate: string;
  createdAt: string;
}

export interface Affirmation {
  id: string;
  userId: string;
  affirmationText: string;
  category: 'capability' | 'abundance' | 'resilience' | 'success' | 'purpose' | 'identity' | 'growth';
  isProofBased: boolean;
  evidenceReference?: string;
  usageCount: number;
  lastUsed?: string;
  isActive: boolean;
  createdAt: string;
}

export interface JournalStreak {
  id: string;
  userId: string;
  currentStreak: number;
  longestStreak: number;
  totalEntries: number;
  morningCompletions: number;
  eveningCompletions: number;
  lastEntryDate?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// 5. DISTRACTIONS KILLER TYPES
// ============================================

export interface DigitalFortressSettings {
  id: string;
  userId: string;
  layer1DigitalEnabled: boolean;
  blockedApps: string[];
  blockedWebsites: string[];
  notificationSilenced: boolean;
  layer2PhysicalEnabled: boolean;
  workspaceSetupNotes?: string;
  sensoryPreferences: Record<string, unknown>;
  layer3CognitiveEnabled: boolean;
  singleTaskMode: boolean;
  intentionStatement?: string;
  layer4SocialEnabled: boolean;
  statusMessage?: string;
  autoResponderEnabled: boolean;
  layer5InternalEnabled: boolean;
  urgeSurfingActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FocusSession {
  id: string;
  userId: string;
  sessionType: 'deep_work' | 'pomodoro' | 'flow_state' | 'planning';
  durationMinutes: number;
  startedAt: string;
  endedAt?: string;
  interruptionsCount: number;
  distractionsBlocked: number;
  focusScore?: number;
  layersActive: number;
  notes?: string;
  createdAt: string;
}

export interface FocusScore {
  id: string;
  userId: string;
  currentScore: number;
  averageScore: number;
  bestScore: number;
  totalSessions: number;
  totalFocusMinutes: number;
  currentStreak: number;
  longestStreak: number;
  vulnerabilitiesDetected: number;
  attemptsBlockedToday: number;
  lastSessionAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// 6. BRAIN DUMP SYSTEM TYPES
// ============================================

export interface BrainDump {
  id: string;
  userId: string;
  rawContent: string;
  durationSeconds?: number;
  wordCount?: number;
  cognitiveLoadBefore?: number;
  cognitiveLoadAfter?: number;
  dumpDate: string;
  createdAt: string;
}

export type BrainDumpItemCategory = 'urgent' | 'scheduled' | 'idea' | 'trash' | 'delegate' | 'release' | 'reference';

export interface BrainDumpItem {
  id: string;
  userId: string;
  dumpId: string;
  itemContent: string;
  category: BrainDumpItemCategory;
  priority: 'high' | 'medium' | 'low';
  isActionable: boolean;
  scheduledDate?: string;
  aiSuggestedAction?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CognitiveLoadReading {
  id: string;
  userId: string;
  loadPercentage: number;
  source: 'brain_dump' | 'assessment' | 'ai_analysis';
  factors: string[];
  readingDate: string;
}

// ============================================
// 7. EMOTION CONTROLLER TYPES
// ============================================

export type EmotionalState =
  | 'anxious'
  | 'discouraged'
  | 'overwhelmed'
  | 'bored'
  | 'frustrated'
  | 'procrastinating'
  | 'fatigued'
  | 'focused'
  | 'flow'
  | 'excited'
  | 'confident'
  | 'peaceful'
  | 'grateful';

export type TargetEmotionalState = 'focused' | 'flow' | 'confident' | 'peaceful';

export interface EmotionCheckin {
  id: string;
  userId: string;
  currentState: EmotionalState;
  intensity: number;
  triggerIdentified?: string;
  targetState?: TargetEmotionalState;
  transitionStrategyUsed?: string;
  wasSuccessful?: boolean;
  notes?: string;
  checkinDate: string;
}

export interface FlowSession {
  id: string;
  userId: string;
  startedAt: string;
  endedAt?: string;
  durationMinutes?: number;
  entryMethod: '2_minute_ritual' | 'transition_protocol' | 'direct_entry';
  depthScore?: number;
  interruptions: number;
  workType?: string;
  satisfactionScore?: number;
  createdAt: string;
}

export interface EmotionPattern {
  id: string;
  userId: string;
  patternType: 'trigger_response' | 'time_of_day' | 'work_type' | 'energy_cycle';
  description: string;
  frequencyCount: number;
  successRate: number;
  insights: Record<string, unknown>;
  firstObserved: string;
  lastObserved: string;
}

// ============================================
// 8. MOMENTUM BUILDER TYPES
// ============================================

export type MomentumDimensionName =
  | 'financial'
  | 'social'
  | 'physical'
  | 'mental_emotional'
  | 'educational'
  | 'professional'
  | 'spiritual_meaning';

export interface MomentumDimension {
  id: string;
  userId: string;
  dimensionName: MomentumDimensionName;
  currentStage: 1 | 2 | 3 | 4 | 5;
  currentScore: number;
  momentumVelocity: number;
  lastWeeklyTarget?: number;
  lastWeeklyActual?: number;
  streakWeeks: number;
  totalMilestones: number;
  createdAt: string;
  updatedAt: string;
}

export interface MomentumActivity {
  id: string;
  userId: string;
  dimensionName: string;
  activityType: string;
  description: string;
  impactScore: number;
  activityDate: string;
  createdAt: string;
}

export interface MomentumFlywheel {
  id: string;
  userId: string;
  overallMomentumScore: number;
  flywheelSpeed: number;
  compoundGrowthRate: number;
  dimensionsInSync: number;
  lastMomentumCheck?: string;
  nextMilestonePrediction?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// API REQUEST/RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface ListResponse<T> {
  items: T[];
  total: number;
  page?: number;
  pageSize?: number;
}
