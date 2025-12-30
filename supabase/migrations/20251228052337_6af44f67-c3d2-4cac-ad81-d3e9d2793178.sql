-- Add new columns to lessons table for structured content support
-- All columns are nullable or have defaults to maintain backward compatibility

-- Lesson type: 'quick' (THCS) or 'practice' (THPT)
ALTER TABLE public.lessons 
ADD COLUMN IF NOT EXISTS lesson_type TEXT NULL;

-- Education level: 'thcs' or 'thpt'
ALTER TABLE public.lessons 
ADD COLUMN IF NOT EXISTS education_level TEXT NULL;

-- Structured content as JSONB for new lesson format
ALTER TABLE public.lessons 
ADD COLUMN IF NOT EXISTS structured_content JSONB NULL;

-- Premium flag for monetization
ALTER TABLE public.lessons 
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN NOT NULL DEFAULT false;

-- Add index for filtering by lesson type and education level
CREATE INDEX IF NOT EXISTS idx_lessons_lesson_type ON public.lessons(lesson_type);
CREATE INDEX IF NOT EXISTS idx_lessons_education_level ON public.lessons(education_level);
CREATE INDEX IF NOT EXISTS idx_lessons_is_premium ON public.lessons(is_premium);

-- Add comments for documentation
COMMENT ON COLUMN public.lessons.lesson_type IS 'Type of lesson: quick (THCS) or practice (THPT)';
COMMENT ON COLUMN public.lessons.education_level IS 'Target education level: thcs or thpt';
COMMENT ON COLUMN public.lessons.structured_content IS 'JSON content following QuickLessonContent or PracticeLessonContent schema';
COMMENT ON COLUMN public.lessons.is_premium IS 'Whether this lesson requires premium access';