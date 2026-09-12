-- =============================================================================
-- MIGRATION: Add chapter column to qb_questions and practice_sessions
-- Run this in your Supabase SQL editor if you already have the tables created.
-- =============================================================================

-- 1. Add chapter column to qb_questions (if not exists)
ALTER TABLE qb_questions
  ADD COLUMN IF NOT EXISTS chapter TEXT NOT NULL DEFAULT '';

-- 2. Add chapter_filter column to practice_sessions (if not exists)
ALTER TABLE practice_sessions
  ADD COLUMN IF NOT EXISTS chapter_filter TEXT;

-- 3. Add new index for chapter
CREATE INDEX IF NOT EXISTS idx_qb_chapter         ON qb_questions(chapter);
CREATE INDEX IF NOT EXISTS idx_qb_subject_chapter ON qb_questions(subject, chapter);

-- 4. Update the random question picker function to support chapter filtering
CREATE OR REPLACE FUNCTION get_random_question_ids(
  p_count INTEGER,
  p_subject TEXT DEFAULT NULL,
  p_chapter TEXT DEFAULT NULL,
  p_topic TEXT DEFAULT NULL,
  p_difficulty TEXT DEFAULT NULL
) RETURNS TABLE(question_id UUID) LANGUAGE sql STABLE AS $$
  SELECT id FROM qb_questions
  WHERE is_active = TRUE
    AND (p_subject    IS NULL OR subject        = p_subject)
    AND (p_chapter    IS NULL OR chapter        = p_chapter)
    AND (p_topic      IS NULL OR topic          = p_topic)
    AND (p_difficulty IS NULL OR difficulty::TEXT = p_difficulty)
  ORDER BY random() LIMIT p_count;
$$;

-- 5. Update the subjects/topics view to include chapter
DROP VIEW IF EXISTS qb_subjects_topics;

CREATE VIEW qb_subjects_topics AS
SELECT DISTINCT subject, chapter, topic
FROM qb_questions
WHERE is_active = TRUE
ORDER BY subject, chapter, topic;

-- =============================================================================
-- OPTIONAL: Backfill chapter data for any existing 820 Biology questions
-- This maps the old broad topic values to proper chapters.
-- =============================================================================
UPDATE qb_questions
SET chapter = CASE
  WHEN topic ILIKE '%biochem%' OR topic ILIKE '%bioenerg%' OR topic ILIKE '%biological molecule%'
    THEN 'Biochemistry, Biological Molecules & Bioenergetics'
  WHEN topic ILIKE '%evolution%' OR topic ILIKE '%biotechnology%' OR topic ILIKE '%variation%'
    THEN 'Evolution, Variation & Biotechnology'
  WHEN topic ILIKE '%genetics%' OR topic ILIKE '%heredity%' OR topic ILIKE '%molecular biology%'
    OR topic ILIKE '%classical%' OR topic ILIKE '%human genetics%'
    THEN 'Genetics, Heredity & Molecular Biology'
  WHEN topic ILIKE '%anatomy%' OR topic ILIKE '%physiology%' OR topic ILIKE '%homeostasis%'
    OR topic ILIKE '%circulatory%' OR topic ILIKE '%digestive%' OR topic ILIKE '%respiratory%'
    OR topic ILIKE '%musculoskeletal%' OR topic ILIKE '%kidney%' OR topic ILIKE '%nervous%'
    OR topic ILIKE '%immunity%' OR topic ILIKE '%reproduction%'
    THEN 'Human Anatomy, Physiology & Homeostasis'
  WHEN topic ILIKE '%cell%'
    THEN 'Cell Biology'
  ELSE ''
END
WHERE subject = 'Biology' AND (chapter IS NULL OR chapter = '');
