-- Fix lesson_files RLS policy to only allow viewing files for published lessons
DROP POLICY IF EXISTS "Anyone can view lesson files" ON public.lesson_files;

-- Users can only view files for published lessons
CREATE POLICY "Users can view files for published lessons"
  ON public.lesson_files FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.lessons
      WHERE lessons.id = lesson_files.lesson_id
      AND lessons.is_published = true
    )
  );

-- Admins can view all lesson files (including drafts)
CREATE POLICY "Admins can view all lesson files"
  ON public.lesson_files FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));