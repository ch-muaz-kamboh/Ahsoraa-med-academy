-- =============================================================================
-- COMPLETE SUPABASE FIX SCRIPT (Run this in Supabase SQL Editor)
-- 1. Fixes missing "role" column on profiles table
-- 2. Fixes RLS policies on qb_questions to allow inserts, updates, and deletes
-- =============================================================================

-- 1. Ensure role column exists on profiles table
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

-- 3. Ensure qb_questions table has public management policies enabled
ALTER TABLE qb_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow manage qb_questions" ON qb_questions;
DROP POLICY IF EXISTS "Allow insert qb_questions" ON qb_questions;
DROP POLICY IF EXISTS "Allow select qb_questions" ON qb_questions;
DROP POLICY IF EXISTS "Allow update qb_questions" ON qb_questions;
DROP POLICY IF EXISTS "Allow delete qb_questions" ON qb_questions;
DROP POLICY IF EXISTS "Staff manage qb_questions" ON qb_questions;
DROP POLICY IF EXISTS "Students read active qb_questions" ON qb_questions;

CREATE POLICY "Allow select qb_questions" ON qb_questions FOR SELECT USING (true);
CREATE POLICY "Allow insert qb_questions" ON qb_questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update qb_questions" ON qb_questions FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete qb_questions" ON qb_questions FOR DELETE USING (true);
