-- Add simulation_url column to lessons table
ALTER TABLE public.lessons 
ADD COLUMN simulation_url text DEFAULT NULL;

-- Create table to track simulation interactions
CREATE TABLE public.simulation_interactions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  first_opened_at timestamp with time zone NOT NULL DEFAULT now(),
  total_time_seconds integer DEFAULT 0,
  interaction_count integer DEFAULT 1,
  last_opened_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Enable RLS
ALTER TABLE public.simulation_interactions ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own simulation interactions"
ON public.simulation_interactions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own simulation interactions"
ON public.simulation_interactions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own simulation interactions"
ON public.simulation_interactions
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all simulation interactions"
ON public.simulation_interactions
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));