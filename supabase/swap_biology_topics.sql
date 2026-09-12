-- Run this script ONLY if you have already imported the questions 
-- and the topics/chapters are currently backward in your database
-- (i.e. 'Genetics' is under Chapter instead of Topic)

UPDATE qb_questions
SET 
  topic = chapter,
  chapter = topic
WHERE subject = 'Biology' AND chapter IN (
  'Genetics, Heredity & Molecular Biology',
  'Biochemistry, Biological Molecules & Bioenergetics',
  'Cell Biology',
  'Human Anatomy, Physiology & Homeostasis',
  'Evolution, Variation & Biotechnology'
);
