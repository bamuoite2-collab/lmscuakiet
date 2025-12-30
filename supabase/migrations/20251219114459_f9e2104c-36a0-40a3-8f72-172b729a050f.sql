-- 1. Fix Quiz Questions: Allow students to view questions WITHOUT correct_answer
-- Create a database function to return sanitized quiz questions for students
CREATE OR REPLACE FUNCTION public.get_quiz_questions_for_student(p_quiz_id uuid)
RETURNS TABLE (
  id uuid,
  quiz_id uuid,
  question text,
  options jsonb,
  order_index integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    q.id,
    q.quiz_id,
    q.question,
    q.options,
    q.order_index
  FROM quiz_questions q
  INNER JOIN quizzes qz ON qz.id = q.quiz_id
  INNER JOIN lessons l ON l.id = qz.lesson_id
  WHERE q.quiz_id = p_quiz_id
    AND l.is_published = true
  ORDER BY q.order_index;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_quiz_questions_for_student(uuid) TO authenticated;

-- 2. Fix Profiles: Add INSERT policy for users to create their own profile
CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 3. Fix User Roles: Add admin policies for managing roles
CREATE POLICY "Admins can insert user roles"
ON public.user_roles
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update user roles"
ON public.user_roles
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete user roles"
ON public.user_roles
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));