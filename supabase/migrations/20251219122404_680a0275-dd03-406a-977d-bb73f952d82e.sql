-- Create lesson_files table for multiple PDF files per lesson (max 10)
CREATE TABLE public.lesson_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quiz_files table for PDF files for quizzes
CREATE TABLE public.quiz_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.lesson_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_files ENABLE ROW LEVEL SECURITY;

-- RLS policies for lesson_files (readable by all, writable by admins)
CREATE POLICY "Anyone can view lesson files"
  ON public.lesson_files FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage lesson files"
  ON public.lesson_files FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS policies for quiz_files (readable by authenticated, writable by admins)
CREATE POLICY "Authenticated users can view quiz files"
  ON public.quiz_files FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage quiz files"
  ON public.quiz_files FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create indexes for better performance
CREATE INDEX idx_lesson_files_lesson_id ON public.lesson_files(lesson_id);
CREATE INDEX idx_quiz_files_quiz_id ON public.quiz_files(quiz_id);