-- ================================================
-- SECURITY FIX: Prevent direct access to quiz answers
-- Issue: Students can query quiz_questions table directly and see correct_answer
-- Fix: Restrict base table to admins only, force use of filtered view
-- ================================================

-- Drop overly permissive SELECT policies on quiz_questions base table
DROP POLICY IF EXISTS "Authenticated users can read quiz questions" ON quiz_questions;
DROP POLICY IF EXISTS "Anyone can view quiz questions" ON quiz_questions;

-- Create restrictive policy: Only admins can view quiz_questions base table
CREATE POLICY "Only admins can view quiz questions with answers"
ON quiz_questions FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
);

-- Students must use public_quiz_questions view which excludes:
-- - correct_answer
-- - explanation
-- (View already exists with proper filtering)

-- Verify view has proper access
GRANT SELECT ON public_quiz_questions TO authenticated;
GRANT SELECT ON public_quiz_questions TO anon;

-- Add security comments for audit trail
COMMENT ON TABLE quiz_questions IS 
  'Quiz questions with answers and explanations. Students must use public_quiz_questions view. Direct access restricted to admins only. Security audit: 2025-12-30';

COMMENT ON VIEW public_quiz_questions IS
  'Filtered view of quiz questions for students. Excludes correct_answer and explanation columns. Safe for public access.';

-- Verification query (commented out - uncomment to verify after migration)
-- As student (should return 0 rows):
-- SELECT correct_answer FROM quiz_questions WHERE quiz_id = 'test-id';
-- 
-- As student via view (should work):
-- SELECT * FROM public_quiz_questions WHERE quiz_id = 'test-id';
