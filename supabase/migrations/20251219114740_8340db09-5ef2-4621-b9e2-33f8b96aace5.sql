-- Add admin SELECT policies for monitoring and management

-- 1. Admins can view all quiz attempts for monitoring
CREATE POLICY "Admins can view all quiz attempts"
ON public.quiz_attempts
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. Admins can update quiz attempts
CREATE POLICY "Admins can update quiz attempts"
ON public.quiz_attempts
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. Admins can delete quiz attempts
CREATE POLICY "Admins can delete quiz attempts"
ON public.quiz_attempts
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- 4. Admins can view all student progress
CREATE POLICY "Admins can view all student progress"
ON public.student_progress
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- 5. Admins can delete student progress (for resets)
CREATE POLICY "Admins can delete student progress"
ON public.student_progress
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- 6. Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));