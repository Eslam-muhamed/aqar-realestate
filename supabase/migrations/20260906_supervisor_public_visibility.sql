-- Add show_in_public column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS show_in_public BOOLEAN NOT NULL DEFAULT true;
