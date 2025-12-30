-- Add new columns to quiz_questions table for diverse question types
ALTER TABLE public.quiz_questions 
ADD COLUMN IF NOT EXISTS question_type text NOT NULL DEFAULT 'multiple_choice',
ADD COLUMN IF NOT EXISTS image_url text NULL;

-- Add check constraint for valid question types
ALTER TABLE public.quiz_questions 
ADD CONSTRAINT valid_question_type CHECK (question_type IN ('multiple_choice', 'true_false', 'essay'));

-- Add essay_answer column for storing student essay responses in quiz_attempts
-- We'll store essay answers in user_answers jsonb field

-- Enable realtime for lesson_comments to support admin notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.lesson_comments;