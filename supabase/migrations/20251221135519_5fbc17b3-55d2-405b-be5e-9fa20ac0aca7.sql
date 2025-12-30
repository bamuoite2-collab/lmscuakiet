-- Add status column to quiz_attempts for grading workflow
ALTER TABLE public.quiz_attempts 
ADD COLUMN status text NOT NULL DEFAULT 'completed';

-- Add essay_scores column to store individual essay question scores
ALTER TABLE public.quiz_attempts 
ADD COLUMN essay_scores jsonb DEFAULT '[]'::jsonb;

-- Add essay_feedback column to store teacher feedback for essays
ALTER TABLE public.quiz_attempts 
ADD COLUMN essay_feedback jsonb DEFAULT '[]'::jsonb;

-- Add graded_by column to track who graded the essay
ALTER TABLE public.quiz_attempts 
ADD COLUMN graded_by uuid REFERENCES auth.users(id);

-- Add graded_at column to track when grading was completed
ALTER TABLE public.quiz_attempts 
ADD COLUMN graded_at timestamp with time zone;

-- Create index for efficient querying of pending grades
CREATE INDEX idx_quiz_attempts_status ON public.quiz_attempts(status);

-- Add comment for documentation
COMMENT ON COLUMN public.quiz_attempts.status IS 'Status: pending_grade (has ungraded essays), completed (fully graded)';
COMMENT ON COLUMN public.quiz_attempts.essay_scores IS 'Array of {question_id, score, max_score} for essay questions';
COMMENT ON COLUMN public.quiz_attempts.essay_feedback IS 'Array of {question_id, feedback} for teacher comments on essays';