-- Add summary, action_plan, entities columns to documents table
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS summary TEXT;
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS action_plan TEXT;
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS entities JSONB;
