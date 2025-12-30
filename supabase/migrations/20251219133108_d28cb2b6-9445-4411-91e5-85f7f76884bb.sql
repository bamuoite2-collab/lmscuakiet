-- Add time_limit_minutes column to quizzes table
ALTER TABLE public.quizzes 
ADD COLUMN IF NOT EXISTS time_limit_minutes integer DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.quizzes.time_limit_minutes IS 'Time limit for the quiz in minutes. NULL or 0 means no time limit.';