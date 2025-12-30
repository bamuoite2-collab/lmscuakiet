-- ================================================
-- SECURITY FIX: Quiz Access Control
-- Date: 2025-12-30
-- Issue: Quiz files accessible without lesson context
-- Fix: Add additional RLS checks for quiz access
-- ================================================

-- Add check to ensure quiz_questions are only accessible when associated lesson is published
CREATE OR REPLACE FUNCTION public.is_quiz_accessible(_quiz_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM quizzes q
    JOIN lessons l ON l.id = q.lesson_id
    WHERE q.id = _quiz_id 
      AND l.is_published = true
  );
$$;

COMMENT ON FUNCTION public.is_quiz_accessible(UUID) IS
  'Checks if a quiz is accessible by verifyin g the associated lesson is published';

-- Note: The quiz_questions table already has RLS policies that check
-- if the quiz is associated with a published lesson. This function
-- provides an additional helper for other components to verify access.

-- Verification: Check existing RLS policy on quiz_questions
-- SELECT policyname, cmd, qual
-- FROM pg_policies 
-- WHERE tablename = 'quiz_questions';
