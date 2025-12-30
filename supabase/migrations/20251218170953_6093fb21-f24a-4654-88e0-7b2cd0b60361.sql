-- Create a view that excludes correct_answer and explanation for students
CREATE OR REPLACE VIEW public.quiz_questions_public AS
SELECT 
  id,
  quiz_id,
  question,
  options,
  order_index,
  created_at
FROM public.quiz_questions;

-- Grant access to the view
GRANT SELECT ON public.quiz_questions_public TO anon, authenticated;

-- Drop existing policies on quiz_questions
DROP POLICY IF EXISTS "Anyone can view quiz questions" ON public.quiz_questions;

-- Create new policy: Only admins can view full quiz_questions table (with answers)
CREATE POLICY "Only admins can view quiz questions with answers"
ON public.quiz_questions
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));