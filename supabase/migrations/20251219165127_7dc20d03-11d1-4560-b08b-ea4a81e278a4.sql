-- Add is_pinned column to lesson_comments for FAQ feature
ALTER TABLE public.lesson_comments 
ADD COLUMN is_pinned BOOLEAN DEFAULT false;

-- Create index for faster pinned queries
CREATE INDEX idx_lesson_comments_pinned ON public.lesson_comments(lesson_id, is_pinned) WHERE is_pinned = true;