-- has_completed_onboarding kolonunu profiles tablosuna ekle
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS has_completed_onboarding BOOLEAN NOT NULL DEFAULT false;
