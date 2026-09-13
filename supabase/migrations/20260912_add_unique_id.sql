-- 2026-09-12 Migration: Remove duplicate MCQs and enforce unique IDs
-- This migration performs two actions:
-- 1. Delete duplicate rows in `qb_questions`, keeping the newest row (by created_at).
-- 2. Add a UNIQUE constraint on the `id` column to prevent future duplicates.

-- Delete duplicates (keep newest based on created_at)
WITH ranked AS (
  SELECT id,
         ROW_NUMBER() OVER (PARTITION BY id ORDER BY created_at DESC) AS rn
  FROM qb_questions
)
DELETE FROM qb_questions
WHERE id IN (SELECT id FROM ranked WHERE rn > 1);

-- Add unique constraint on id
ALTER TABLE qb_questions ADD CONSTRAINT uq_qb_questions_id UNIQUE (id);
