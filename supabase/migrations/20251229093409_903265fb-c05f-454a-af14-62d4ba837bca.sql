-- ================================================
-- DEV-ONLY: Allow authenticated users to insert lessons
-- REMOVE THIS POLICY BEFORE PRODUCTION DEPLOYMENT
-- ================================================

CREATE POLICY "DEV ONLY - Authenticated users can insert lessons"
ON public.lessons
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Add comment to remind this is dev-only
COMMENT ON POLICY "DEV ONLY - Authenticated users can insert lessons" ON public.lessons 
IS 'TEMPORARY: Remove before production. Allows any authenticated user to insert lessons during development.';