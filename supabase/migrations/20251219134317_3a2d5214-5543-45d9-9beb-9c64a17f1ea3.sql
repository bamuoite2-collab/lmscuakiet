-- Add user_answers column to store student's answers for review
ALTER TABLE public.quiz_attempts
ADD COLUMN user_answers jsonb DEFAULT NULL;