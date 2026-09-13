-- 20260912_update_subject_limits.sql
-- Adjust the max rows per subject.
-- Biology: 1200 rows
-- All other subjects (including existing Chemistry) : 900 rows

-- Ensure the helper table exists (no‑op if already created)
CREATE TABLE IF NOT EXISTS public.subject_limits (
    subject   text PRIMARY KEY,
    max_rows  integer NOT NULL
);

-- Set Biology limit to 1200
INSERT INTO public.subject_limits (subject, max_rows)
VALUES ('Biology', 1200)
ON CONFLICT (subject) DO UPDATE SET max_rows = EXCLUDED.max_rows;

-- Set a generic limit of 900 for every subject that is NOT Biology.
-- This updates existing rows and inserts missing ones.
UPDATE public.subject_limits
SET max_rows = 900
WHERE subject <> 'Biology';

-- If you have other subjects that are not yet in the table, you can add them manually, e.g.:
-- INSERT INTO public.subject_limits (subject, max_rows) VALUES ('Physics', 900) ON CONFLICT DO NOTHING;
