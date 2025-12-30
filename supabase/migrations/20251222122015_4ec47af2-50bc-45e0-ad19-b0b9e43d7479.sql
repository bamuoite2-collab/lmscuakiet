-- Enable RLS on the view (views inherit RLS from underlying tables)
-- We need to grant SELECT on the view to authenticated users
GRANT SELECT ON public_quiz_questions TO authenticated;
GRANT SELECT ON public_quiz_questions TO anon;