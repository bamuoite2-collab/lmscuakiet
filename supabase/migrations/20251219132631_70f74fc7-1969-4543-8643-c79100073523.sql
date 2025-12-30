-- Add time_taken_seconds column to quiz_attempts table
ALTER TABLE public.quiz_attempts 
ADD COLUMN IF NOT EXISTS time_taken_seconds integer;

-- Add comment for documentation
COMMENT ON COLUMN public.quiz_attempts.time_taken_seconds IS 'Time taken to complete the quiz in seconds';
