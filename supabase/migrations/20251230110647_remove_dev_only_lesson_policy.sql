-- ================================================
-- SECURITY FIX: Remove dev-only lesson insert policy
-- Author: Security Audit - RLS Policy Review
-- Date: 2025-12-30
-- Issue: Dev-only policy allows any authenticated user to insert lessons
-- Fix: Drop the unsafe policy, rely on existing admin-only policy
-- ================================================

-- Drop the unsafe dev-only policy that bypasses admin checks
DROP POLICY IF EXISTS "DEV ONLY - Authenticated users can insert lessons" ON public.lessons;

-- Add audit comment to track security fix
COMMENT ON TABLE public.lessons IS 
  'Lessons table with RLS enabled. Only admins can INSERT/UPDATE/DELETE. Published lessons are visible to all. Security audit: 2025-12-30 - Removed dev-only insert policy.';

-- Verification query (commented out - uncomment to verify after migration)
-- SELECT 
--   policyname, 
--   cmd, 
--   roles,
--   with_check
-- FROM pg_policies 
-- WHERE tablename = 'lessons'
-- ORDER BY cmd, policyname;

-- Expected policies after this migration:
-- SELECT: "Anyone can view published lessons" (public)
-- SELECT: "Admins can view all lessons" (admins only)
-- INSERT: "Admins can insert lessons" (admins only) ✓
-- UPDATE: "Admins can update lessons" (admins only)
-- DELETE: "Admins can delete lessons" (admins only)
