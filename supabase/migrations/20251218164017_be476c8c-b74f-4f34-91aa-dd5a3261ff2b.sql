-- Add explanation field to quiz_questions for LaTeX support
ALTER TABLE public.quiz_questions 
ADD COLUMN IF NOT EXISTS explanation text;

-- Add comment to clarify content field usage
COMMENT ON COLUMN public.lessons.content IS 'Markdown content with LaTeX support';
COMMENT ON COLUMN public.quiz_questions.explanation IS 'Detailed explanation with LaTeX support';
COMMENT ON COLUMN public.quiz_questions.question IS 'Question text with LaTeX support';