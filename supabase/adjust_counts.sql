-- Adjust MCQ counts to match desired totals
-- Remove 15 Chemistry questions (197 -> 182)
DELETE FROM qb_questions
WHERE id IN (
  SELECT id FROM qb_questions
  WHERE subject = 'Chemistry'
  ORDER BY created_at ASC
  LIMIT 15
);

-- Remove 1 Biology question (819 -> 818)
DELETE FROM qb_questions
WHERE id IN (
  SELECT id FROM qb_questions
  WHERE subject = 'Biology'
  ORDER BY created_at ASC
  LIMIT 1
);
