-- Ensure business Neshan map links can be stored on existing Supabase projects.
-- Safe to run repeatedly and does not modify existing link values.
ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS neshan text;
