-- ==========================================
-- 1. Fix Quiz RLS - Allow read access for security_invoker view
-- ==========================================

-- Drop existing restrictive SELECT policies on quiz_questions
DROP POLICY IF EXISTS "Only admins can view quiz questions with answers" ON quiz_questions;

-- Create new policy allowing authenticated users to read quiz_questions
-- The public_quiz_questions view already filters sensitive data
CREATE POLICY "Authenticated users can read quiz questions"
ON quiz_questions FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM quizzes qz
    INNER JOIN lessons l ON l.id = qz.lesson_id
    WHERE qz.id = quiz_questions.quiz_id
    AND l.is_published = true
  )
);

-- Keep admin full access
-- (Already exists: "Admins can manage quiz questions")

-- ==========================================
-- 2. Fix Quizzes table - ensure proper read access
-- ==========================================

-- The existing policy "Anyone can view quizzes for published lessons" should work
-- But let's ensure it's permissive
DROP POLICY IF EXISTS "Anyone can view quizzes for published lessons" ON quizzes;

CREATE POLICY "Anyone can view quizzes for published lessons"
ON quizzes FOR SELECT
TO authenticated, anon
USING (
  EXISTS (
    SELECT 1 FROM lessons
    WHERE lessons.id = quizzes.lesson_id
    AND lessons.is_published = true
  )
);

-- ==========================================
-- 3. Fix PDF Storage - Make lesson-files bucket public
-- ==========================================

-- Update the bucket to be public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'lesson-files';

-- Drop existing storage policies if any
DROP POLICY IF EXISTS "Public can view lesson files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view lesson files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view lesson files" ON storage.objects;

-- Create policy for public read access to lesson-files bucket
CREATE POLICY "Anyone can view lesson files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'lesson-files');

-- Create policy for authenticated users to upload (for admins)
DROP POLICY IF EXISTS "Admins can upload lesson files" ON storage.objects;
CREATE POLICY "Admins can upload lesson files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'lesson-files' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Create policy for admins to delete files
DROP POLICY IF EXISTS "Admins can delete lesson files" ON storage.objects;
CREATE POLICY "Admins can delete lesson files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'lesson-files' 
  AND has_role(auth.uid(), 'admin'::app_role)
);