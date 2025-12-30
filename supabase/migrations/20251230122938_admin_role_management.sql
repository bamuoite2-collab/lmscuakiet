-- ================================================
-- SECURITY ENHANCEMENT: Admin Role Management
-- Author: Security Improvement - Admin Role Assignment
-- Date: 2025-12-30
-- Purpose: Add secure mechanism for promoting users to admin role
-- ================================================

-- 1. Add RLS policy to prevent unauthorized role assignments
-- This prevents users from directly inserting admin roles for themselves
CREATE POLICY "Only admins can insert user roles"
ON public.user_roles FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add comment to document the policy
COMMENT ON POLICY "Only admins can insert user roles" ON public.user_roles IS
  'Security policy: Only existing administrators can assign roles to users. This prevents privilege escalation attacks.';

-- 2. Create function to safely promote users to admin
-- This function can only be called by existing admins
CREATE OR REPLACE FUNCTION public.promote_to_admin(_user_email TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id UUID;
  _caller_is_admin BOOLEAN;
BEGIN
  -- Verify caller is an admin
  SELECT public.has_role(auth.uid(), 'admin') INTO _caller_is_admin;
  
  IF NOT _caller_is_admin THEN
    RAISE EXCEPTION 'Permission denied: Only administrators can promote users to admin role';
  END IF;
  
  -- Get user ID from email
  SELECT id INTO _user_id 
  FROM auth.users 
  WHERE email = _user_email;
  
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'User not found: No user exists with email %', _user_email;
  END IF;
  
  -- Insert admin role (ON CONFLICT prevents duplicates)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RAISE NOTICE 'User % has been promoted to admin', _user_email;
END;
$$;

-- Add function comment for documentation
COMMENT ON FUNCTION public.promote_to_admin(TEXT) IS
  'Safely promotes a user to admin role. Only callable by existing admins. Usage: SELECT promote_to_admin(''user@example.com'');';

-- 3. Create helper function to check if any admins exist (useful for first-time setup)
CREATE OR REPLACE FUNCTION public.has_any_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE role = 'admin'
  );
$$;

COMMENT ON FUNCTION public.has_any_admin() IS
  'Returns true if at least one admin user exists in the system. Useful for initial setup checks.';

-- ================================================
-- VERIFICATION QUERIES (commented out - uncomment to test)
-- ================================================

-- Check all policies on user_roles table
-- SELECT 
--   policyname, 
--   cmd, 
--   roles,
--   qual,
--   with_check
-- FROM pg_policies 
-- WHERE tablename = 'user_roles'
-- ORDER BY cmd, policyname;

-- Check if any admins exist
-- SELECT public.has_any_admin();

-- List all admin users
-- SELECT u.email, u.created_at
-- FROM auth.users u
-- JOIN user_roles ur ON u.id = ur.user_id
-- WHERE ur.role = 'admin'
-- ORDER BY u.created_at;

-- ================================================
-- SETUP INSTRUCTIONS FOR FIRST ADMIN
-- ================================================
-- Since this policy prevents non-admins from creating admin roles,
-- you need to manually create the FIRST admin user.
--
-- Run this SQL query ONCE to create your first admin:
--
-- INSERT INTO public.user_roles (user_id, role)
-- SELECT id, 'admin'::app_role
-- FROM auth.users
-- WHERE email = 'your-admin-email@example.com'
-- ON CONFLICT (user_id, role) DO NOTHING;
--
-- After the first admin is created, use the promote_to_admin function:
-- SELECT public.promote_to_admin('new-admin@example.com');
-- ================================================
