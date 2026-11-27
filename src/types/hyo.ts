export type SupportLevel = 1 | 2 | 3;

export type WritingStep = 1 | 2 | 3 | 4 | 5;

export type HintLevel = 1 | 2 | 3;

export type AppScreen = 'start' | 'writing' | 'records' | 'teacher';

export interface HyoTopic {
  id: string;
  title: string;
  subtitle: string;
  koreanSubtitle: string;
  sampleParagraph: string;
}

export interface PlanAnswers {
  who: string;
  what: string;
  when: string;
  feeling: string;
}

export interface CoachFeedback {
  praise: string;
  fix: string;
  question: string;
  highlightedPhrase: string;
  hintLevel: HintLevel;
  patternExample?: string;
  koreanHelp: string;
  isFallback?: boolean;
  fallbackNotice?: string;
}

export interface RewriteEvaluation {
  fixed: boolean;
  recommendedNextLevel: SupportLevel;
  levelChange: 'up' | 'same' | 'down';
  encouragement: string;
}

export interface WritingRecord {
  id: string;
  studentName: string;
  studentEmail: string;
  date: string;
  topicId: string;
  topicTitle: string;
  supportLevel: SupportLevel;
  nextRecommendedLevel: SupportLevel;
  hintsUsed: number;
  maxHintLevel: HintLevel;
  firstDraft: string;
  finalText: string;
  whatIChanged: string;
}

export interface UserSession {
  name: string;
  email: string;
  isTeacher: boolean;
}
