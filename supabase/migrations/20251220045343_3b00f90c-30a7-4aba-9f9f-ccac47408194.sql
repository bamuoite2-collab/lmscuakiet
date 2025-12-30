-- Drop and recreate the view with SECURITY INVOKER (default, safer)
DROP VIEW IF EXISTS public.public_quiz_questions;

CREATE VIEW public.public_quiz_questions 
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
FROM public.quiz_questions qq
INNER JOIN public.quizzes q ON q.id = qq.quiz_id
INNER JOIN public.lessons l ON l.id = q.lesson_id
WHERE l.is_published = true;

-- Grant SELECT permission to authenticated users on the view
GRANT SELECT ON public.public_quiz_questions TO authenticated;
GRANT SELECT ON public.public_quiz_questions TO anon;