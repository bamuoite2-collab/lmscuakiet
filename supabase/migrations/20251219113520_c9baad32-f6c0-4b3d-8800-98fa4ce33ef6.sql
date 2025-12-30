-- Make lesson-files bucket private (requires authentication)
UPDATE storage.buckets 
SET public = false 
WHERE id = 'lesson-files';

-- Remove the public access policy for lesson-files
DROP POLICY IF EXISTS "Anyone can view lesson files" ON storage.objects;

-- Create new policy: Only authenticated users can view lesson files
CREATE POLICY "Authenticated users can view lesson files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'lesson-files' 
  AND auth.role() = 'authenticated'
);

-- Keep admin policies intact (they should already exist)
-- Ensure admins can upload/update/delete
DROP POLICY IF EXISTS "Admins can upload lesson files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update lesson files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete lesson files" ON storage.objects;

CREATE POLICY "Admins can upload lesson files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'lesson-files' 
  AND has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update lesson files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'lesson-files' 
  AND has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete lesson files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'lesson-files' 
  AND has_role(auth.uid(), 'admin')
);