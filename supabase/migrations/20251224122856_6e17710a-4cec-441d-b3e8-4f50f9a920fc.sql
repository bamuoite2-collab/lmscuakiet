-- Add user_level enum type
CREATE TYPE public.user_level AS ENUM ('thcs', 'thpt');

-- Add user_level column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN user_level public.user_level DEFAULT NULL;

-- Add is_premium column to courses table for monetization
ALTER TABLE public.courses 
ADD COLUMN is_premium boolean DEFAULT false;

-- Add subscription_type placeholder for future payment integration
ALTER TABLE public.profiles
ADD COLUMN is_premium_user boolean DEFAULT false;

-- Index for faster filtering by user_level
CREATE INDEX idx_profiles_user_level ON public.profiles(user_level);

-- Index for premium courses
CREATE INDEX idx_courses_is_premium ON public.courses(is_premium);