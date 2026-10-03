-- =============================================================================
-- MIGRATION: Rename 'General Knowledge' → 'Reading & Acquired Knowledge'
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- Date: 2026-10-03
-- =============================================================================

-- 1. Update existing rows in qb_questions table
UPDATE qb_questions
SET
  subject = 'Reading & Acquired Knowledge',
  source_reference = REPLACE(source_reference, 'General Knowledge', 'Reading & Acquired Knowledge')
WHERE subject = 'General Knowledge';

-- 2. Update existing rows in tests table (if any tests reference this subject)
UPDATE tests
SET subject = 'Reading & Acquired Knowledge'
WHERE subject = 'General Knowledge';

-- 3. Update question_limits table (if it exists and tracks per-subject limits)
UPDATE question_limits
SET subject = 'Reading & Acquired Knowledge'
WHERE subject = 'General Knowledge';

-- 4. Update any doubts that may reference the old subject name
UPDATE doubts
SET subject = 'Reading & Acquired Knowledge'
WHERE subject = 'General Knowledge';

-- Verify: show updated row counts
SELECT subject, COUNT(*) AS total
FROM qb_questions
WHERE subject IN ('General Knowledge', 'Reading & Acquired Knowledge')
GROUP BY subject;
