export type UserLevel = 'thcs' | 'thpt';

export interface Course {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  category: string | null;
  difficulty: string | null;
  is_published: boolean | null;
  is_premium: boolean | null;
  created_at: string;
  updated_at: string;
}

import type { LessonContent } from './lesson';
import type { Json } from '@/integrations/supabase/types';

export type LessonType = 'quick' | 'practice';

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  content: string | null;
  video_url: string | null;
  pdf_url: string | null;
  simulation_url: string | null;
  order_index: number | null;
  is_published: boolean | null;
  // New structured content fields
  lesson_type: string | null;
  education_level: string | null;
  structured_content: Json | null;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
}

// Helper function to safely cast structured_content
export function getStructuredContent(lesson: Lesson): LessonContent | null {
  if (!lesson.structured_content) return null;
  const content = lesson.structured_content as unknown as LessonContent;
  if (content && typeof content === 'object' && 'type' in content) {
    return content;
  }
  return null;
}

export interface SimulationInteraction {
  id: string;
  user_id: string;
  lesson_id: string;
  first_opened_at: string;
  total_time_seconds: number;
  interaction_count: number;
  last_opened_at: string;
}

export interface Quiz {
  id: string;
  lesson_id: string;
  title: string;
  time_limit_minutes: number | null;
  created_at: string;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question: string;
  question_type: 'multiple_choice' | 'true_false' | 'essay';
  options: string[];
  correct_answer: number;
  explanation?: string | null;
  image_url?: string | null;
  order_index: number | null;
  created_at: string;
}

// Public version without answers (for students)
export interface QuizQuestionPublic {
  id: string;
  quiz_id: string;
  question: string;
  question_type: 'multiple_choice' | 'true_false' | 'essay';
  options: string[];
  image_url?: string | null;
  order_index: number | null;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  user_level: UserLevel | null;
  is_premium_user: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface StudentProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean | null;
  completed_at: string | null;
  created_at: string;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  quiz_id: string;
  score: number;
  total_questions: number;
  time_taken_seconds: number | null;
  user_answers: Record<string, number | null> | null;
  completed_at: string;
}

export interface LessonComment {
  id: string;
  lesson_id: string;
  user_id: string;
  content: string;
  parent_id: string | null;
  is_answered: boolean;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}
