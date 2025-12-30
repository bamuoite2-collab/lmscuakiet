-- Create lesson_comments table for Q&A discussions
CREATE TABLE public.lesson_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES public.lesson_comments(id) ON DELETE CASCADE,
  is_answered BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.lesson_comments ENABLE ROW LEVEL SECURITY;

-- Anyone can view comments on published lessons
CREATE POLICY "Anyone can view comments on published lessons"
ON public.lesson_comments
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.lessons
    WHERE lessons.id = lesson_comments.lesson_id
    AND lessons.is_published = true
  )
);

-- Authenticated users can create comments
CREATE POLICY "Authenticated users can create comments"
ON public.lesson_comments
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own comments
CREATE POLICY "Users can update their own comments"
ON public.lesson_comments
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "Users can delete their own comments"
ON public.lesson_comments
FOR DELETE
USING (auth.uid() = user_id);

-- Admins can view all comments
CREATE POLICY "Admins can view all comments"
ON public.lesson_comments
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can manage all comments
CREATE POLICY "Admins can manage all comments"
ON public.lesson_comments
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_lesson_comments_updated_at
BEFORE UPDATE ON public.lesson_comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_lesson_comments_lesson_id ON public.lesson_comments(lesson_id);
CREATE INDEX idx_lesson_comments_parent_id ON public.lesson_comments(parent_id);
CREATE INDEX idx_lesson_comments_user_id ON public.lesson_comments(user_id);