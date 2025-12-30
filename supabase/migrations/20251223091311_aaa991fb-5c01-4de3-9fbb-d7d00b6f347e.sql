-- ==========================================
-- 1. Drop and recreate public_quiz_questions view with security_invoker
-- ==========================================
DROP VIEW IF EXISTS public_quiz_questions;

CREATE VIEW public_quiz_questions 
WITH (security_invoker = true)
AS
SELECT 
  qq.id,
  qq.quiz_id,
  qq.question,
  qq.question_type,
  qq.options,
  qq.order_index,
  qq.image_url
FROM quiz_questions qq
INNER JOIN quizzes qz ON qz.id = qq.quiz_id
INNER JOIN lessons l ON l.id = qz.lesson_id
WHERE l.is_published = true;

-- Grant SELECT on the view to authenticated and anon users
GRANT SELECT ON public_quiz_questions TO authenticated;
GRANT SELECT ON public_quiz_questions TO anon;

-- ==========================================
-- 2. Ensure quiz_attempts has proper RLS policies
-- Quiz attempts already has RLS enabled, but let's verify and update policies
-- ==========================================

-- Ensure RLS is enabled
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Users can view their own quiz attempts" ON quiz_attempts;
DROP POLICY IF EXISTS "Users can insert their own quiz attempts" ON quiz_attempts;
DROP POLICY IF EXISTS "Admins can view all quiz attempts" ON quiz_attempts;
DROP POLICY IF EXISTS "Admins can update quiz attempts" ON quiz_attempts;
DROP POLICY IF EXISTS "Admins can delete quiz attempts" ON quiz_attempts;

-- Recreate policies with proper conditions
CREATE POLICY "Users can view their own quiz attempts"
ON quiz_attempts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz attempts"
ON quiz_attempts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all quiz attempts"
ON quiz_attempts FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update quiz attempts"
ON quiz_attempts FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete quiz attempts"
ON quiz_attempts FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));