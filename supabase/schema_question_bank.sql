-- =============================================================================
-- QUESTION BANK MIGRATION
-- Run this AFTER the main schema.sql
-- All MCQs have exactly 5 options: A, B, C, D, E
-- =============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
  CREATE TYPE qb_difficulty AS ENUM ('easy', 'medium', 'hard');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS qb_questions (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject          TEXT NOT NULL,
  topic            TEXT NOT NULL DEFAULT '',
  difficulty       qb_difficulty NOT NULL DEFAULT 'medium',
  question_text    TEXT NOT NULL,
  question_image_url TEXT,
  option_a         TEXT NOT NULL,
  option_b         TEXT NOT NULL,
  option_c         TEXT NOT NULL,
  option_d         TEXT NOT NULL,
  option_e         TEXT NOT NULL,
  correct_option   CHAR(1) NOT NULL CHECK (correct_option IN ('A','B','C','D','E')),
  explanation      TEXT,
  source_reference TEXT,
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  created_by       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION qb_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS trg_qb_questions_updated_at ON qb_questions;
CREATE TRIGGER trg_qb_questions_updated_at
  BEFORE UPDATE ON qb_questions FOR EACH ROW EXECUTE FUNCTION qb_set_updated_at();

CREATE TABLE IF NOT EXISTS practice_sessions (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id          UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title               TEXT NOT NULL DEFAULT 'Practice Test',
  subject_filter      TEXT,
  topic_filter        TEXT,
  difficulty_filter   qb_difficulty,
  question_count      INTEGER NOT NULL DEFAULT 20,
  time_limit_minutes  INTEGER NOT NULL DEFAULT 30,
  status              TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','in_progress','submitted')),
  started_at          TIMESTAMPTZ,
  submitted_at        TIMESTAMPTZ,
  time_spent_seconds  INTEGER DEFAULT 0,
  total_score         NUMERIC(6,2) DEFAULT 0,
  percentage          NUMERIC(5,2) DEFAULT 0,
  total_correct       INTEGER DEFAULT 0,
  total_incorrect     INTEGER DEFAULT 0,
  total_unanswered    INTEGER DEFAULT 0,
  accuracy_rate       NUMERIC(5,2) DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS practice_session_questions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id  UUID NOT NULL REFERENCES practice_sessions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES qb_questions(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL DEFAULT 0,
  UNIQUE (session_id, question_id)
);

CREATE TABLE IF NOT EXISTS practice_answers (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id         UUID NOT NULL REFERENCES practice_sessions(id) ON DELETE CASCADE,
  question_id        UUID NOT NULL REFERENCES qb_questions(id) ON DELETE CASCADE,
  selected_option    CHAR(1) CHECK (selected_option IN ('A','B','C','D','E')),
  is_correct         BOOLEAN,
  is_marked_review   BOOLEAN DEFAULT FALSE,
  time_spent_seconds INTEGER DEFAULT 0,
  answered_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (session_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_qb_subject            ON qb_questions(subject);
CREATE INDEX IF NOT EXISTS idx_qb_topic              ON qb_questions(topic);
CREATE INDEX IF NOT EXISTS idx_qb_difficulty         ON qb_questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_qb_subject_topic      ON qb_questions(subject, topic);
CREATE INDEX IF NOT EXISTS idx_qb_subject_difficulty ON qb_questions(subject, difficulty);
CREATE INDEX IF NOT EXISTS idx_qb_active             ON qb_questions(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_qb_created_at         ON qb_questions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ps_student            ON practice_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_ps_student_status     ON practice_sessions(student_id, status);
CREATE INDEX IF NOT EXISTS idx_psq_session           ON practice_session_questions(session_id);
CREATE INDEX IF NOT EXISTS idx_pa_session            ON practice_answers(session_id);
CREATE INDEX IF NOT EXISTS idx_pa_session_question   ON practice_answers(session_id, question_id);

ALTER TABLE qb_questions               ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_sessions          ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_session_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_answers           ENABLE ROW LEVEL SECURITY;

-- Helper: check if current user is staff (defined here for self-contained migration)
CREATE OR REPLACE FUNCTION is_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin', 'counsellor', 'admissions_officer',
                   'visa_officer', 'finance', 'faculty', 'content_editor')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── Test Sessions (Live Mock Broadcasts) ──────────────────────────────────
CREATE TABLE IF NOT EXISTS test_sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id     TEXT NOT NULL,
  test_title  TEXT NOT NULL,
  is_live     BOOLEAN NOT NULL DEFAULT TRUE,
  started_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at    TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE test_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff can manage test sessions" ON test_sessions;
DROP POLICY IF EXISTS "Anyone can view live test sessions" ON test_sessions;
DROP POLICY IF EXISTS "Allow manage test sessions" ON test_sessions;
DROP POLICY IF EXISTS "Allow public read of test sessions" ON test_sessions;

CREATE POLICY "Allow public read of test sessions"
  ON test_sessions FOR SELECT
  USING (true);

CREATE POLICY "Allow manage test sessions"
  ON test_sessions FOR ALL
  USING (true)
  WITH CHECK (true);

-- ─── Question Bank & Practice Policies ──────────────────────────────────────
DROP POLICY IF EXISTS "Staff manage qb_questions" ON qb_questions;
DROP POLICY IF EXISTS "Students read active qb_questions" ON qb_questions;
DROP POLICY IF EXISTS "Allow manage qb_questions" ON qb_questions;
DROP POLICY IF EXISTS "Allow read qb_questions" ON qb_questions;

CREATE POLICY "Allow read qb_questions" ON qb_questions FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Allow manage qb_questions" ON qb_questions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Students manage own practice sessions"
  ON practice_sessions FOR ALL USING (auth.uid() = student_id) WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Staff view all practice sessions"   ON practice_sessions FOR SELECT USING (is_staff());
CREATE POLICY "Students read own session questions"
  ON practice_session_questions FOR SELECT
  USING (EXISTS (SELECT 1 FROM practice_sessions WHERE id = practice_session_questions.session_id AND student_id = auth.uid()));
CREATE POLICY "System insert session questions"
  ON practice_session_questions FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM practice_sessions WHERE id = practice_session_questions.session_id AND student_id = auth.uid()));
CREATE POLICY "Students manage own practice answers"
  ON practice_answers FOR ALL
  USING (EXISTS (SELECT 1 FROM practice_sessions WHERE id = practice_answers.session_id AND student_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM practice_sessions WHERE id = practice_answers.session_id AND student_id = auth.uid()));
CREATE POLICY "Staff view all practice answers"    ON practice_answers FOR SELECT USING (is_staff());


CREATE OR REPLACE FUNCTION get_random_question_ids(
  p_count INTEGER, p_subject TEXT DEFAULT NULL, p_topic TEXT DEFAULT NULL, p_difficulty TEXT DEFAULT NULL
) RETURNS TABLE(question_id UUID) LANGUAGE sql STABLE AS $$
  SELECT id FROM qb_questions
  WHERE is_active = TRUE
    AND (p_subject    IS NULL OR subject        = p_subject)
    AND (p_topic      IS NULL OR topic          = p_topic)
    AND (p_difficulty IS NULL OR difficulty::TEXT = p_difficulty)
  ORDER BY random() LIMIT p_count;
$$;

CREATE OR REPLACE VIEW qb_subjects_topics AS
SELECT DISTINCT subject, topic FROM qb_questions WHERE is_active = TRUE ORDER BY subject, topic;
