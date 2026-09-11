-- =============================================================================
-- FIX FOR: column "role" does not exist IN SUPABASE
-- Run this query in Supabase Dashboard → SQL Editor → New Query → Run
-- =============================================================================

-- 1. Ensure role enum or text column exists on profiles table
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles ADD COLUMN role TEXT NOT NULL DEFAULT 'student';
  END IF;
END $$;

-- 2. Update is_staff() helper to be safe against schema mismatches
CREATE OR REPLACE FUNCTION is_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin', 'counsellor', 'admissions_officer',
                   'visa_officer', 'finance', 'faculty', 'content_editor')
  );
EXCEPTION WHEN OTHERS THEN
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
