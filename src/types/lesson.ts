// Education levels matching database enum
export type EducationLevel = 'thcs' | 'thpt';

// Lesson types based on education level
export type LessonType = 'quick' | 'practice';

// Quick quiz question for THCS lessons
export interface QuickQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

// Example item for quick lessons
export interface LessonExample {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
}

// Content structure for THCS quick lessons
export interface QuickLessonContent {
  type: 'quick';
  summary: string;
  examples: LessonExample[];
  quickQuiz: QuickQuizQuestion[]; // 3-5 questions recommended
}

// Difficulty levels for practice exercises
export type ExerciseDifficulty = 'easy' | 'medium' | 'hard';

// Exercise item for THPT practice lessons
export interface PracticeExercise {
  id: string;
  question: string;
  options?: string[];
  correctAnswer: string | number;
  difficulty: ExerciseDifficulty;
  explanation?: string;
  imageUrl?: string;
  points?: number;
}

// Essay prompt for AI grading (premium feature ready)
export interface EssayPrompt {
  id: string;
  prompt: string;
  guidelines?: string;
  maxWords?: number;
  rubric?: string[];
  isPremium?: boolean;
}

// Content structure for THPT practice lessons
export interface PracticeLessonContent {
  type: 'practice';
  theory: string;
  exercises: PracticeExercise[];
  essayPrompt?: EssayPrompt; // Optional AI grading feature
}

// Union type for lesson content
export type LessonContent = QuickLessonContent | PracticeLessonContent;

// Base lesson metadata (aligns with existing lessons table)
export interface LessonMetadata {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  subject?: string;
  grade?: number; // 6-12
  chapter?: string;
  orderIndex: number;
  isPublished: boolean;
  isPremium?: boolean;
  videoUrl?: string;
  pdfUrl?: string;
  simulationUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Full typed lesson combining metadata and content
export interface TypedLesson extends LessonMetadata {
  educationLevel: EducationLevel;
  lessonType: LessonType;
  structuredContent?: LessonContent;
}

// Type guard for quick lesson content
export function isQuickLessonContent(content: LessonContent): content is QuickLessonContent {
  return content.type === 'quick';
}

// Type guard for practice lesson content
export function isPracticeLessonContent(content: LessonContent): content is PracticeLessonContent {
  return content.type === 'practice';
}

// Helper to determine lesson type from education level
export function getDefaultLessonType(level: EducationLevel): LessonType {
  return level === 'thcs' ? 'quick' : 'practice';
}

// Factory for creating empty quick lesson content
export function createEmptyQuickContent(): QuickLessonContent {
  return {
    type: 'quick',
    summary: '',
    examples: [],
    quickQuiz: [],
  };
}

// Factory for creating empty practice lesson content
export function createEmptyPracticeContent(): PracticeLessonContent {
  return {
    type: 'practice',
    theory: '',
    exercises: [],
  };
}
