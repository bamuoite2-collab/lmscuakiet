-- Create storage buckets for course thumbnails and lesson PDFs
INSERT INTO storage.buckets (id, name, public) VALUES ('course-thumbnails', 'course-thumbnails', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('lesson-files', 'lesson-files', true);

-- RLS policies for course-thumbnails bucket
CREATE POLICY "Admins can upload course thumbnails"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'course-thumbnails' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update course thumbnails"
ON storage.objects FOR UPDATE
USING (bucket_id = 'course-thumbnails' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete course thumbnails"
ON storage.objects FOR DELETE
USING (bucket_id = 'course-thumbnails' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view course thumbnails"
ON storage.objects FOR SELECT
USING (bucket_id = 'course-thumbnails');

-- RLS policies for lesson-files bucket
CREATE POLICY "Admins can upload lesson files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'lesson-files' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update lesson files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'lesson-files' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete lesson files"
ON storage.objects FOR DELETE
USING (bucket_id = 'lesson-files' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view lesson files"
ON storage.objects FOR SELECT
USING (bucket_id = 'lesson-files');