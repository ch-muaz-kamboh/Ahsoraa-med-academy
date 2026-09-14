-- =============================================================================
-- PORTAL REAL-TIME DATABASE SCHEMA & MIGRATION
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)
-- Enables multi-device sync for Schedules, Video Lectures, Library, Test Questions & Mistakes
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Portal Schedules Table
CREATE TABLE IF NOT EXISTS portal_schedules (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  instructor TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  meeting_url TEXT,
  location TEXT,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed')),
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Portal Recorded Lectures Table
CREATE TABLE IF NOT EXISTS portal_lectures (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  topic TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  pdf_attachment_url TEXT,
  description TEXT,
  instructor TEXT,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Portal Digital Library Table
CREATE TABLE IF NOT EXISTS portal_library (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Book', 'PDF Notes', 'Formula Sheet', 'Past Paper', 'Other')),
  subject TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size_bytes BIGINT DEFAULT 0,
  pages_count INTEGER DEFAULT 0,
  author_or_source TEXT,
  description TEXT,
  download_count INTEGER DEFAULT 0,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. CBT Mock Test Custom Questions Table
CREATE TABLE IF NOT EXISTS cbt_test_questions (
  id TEXT PRIMARY KEY,
  test_id TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  subject TEXT NOT NULL,
  topic TEXT DEFAULT '',
  difficulty TEXT NOT NULL DEFAULT 'medium',
  question_text TEXT NOT NULL,
  question_image_url TEXT,
  options JSONB NOT NULL DEFAULT '[]'::jsonb,
  correct_option CHAR(1) NOT NULL,
  explanation TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Student Mistakes Notebook Table
CREATE TABLE IF NOT EXISTS portal_mistakes (
  id TEXT PRIMARY KEY,
  student_id TEXT,
  question_id TEXT NOT NULL,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]'::jsonb,
  correct_option CHAR(1) NOT NULL,
  selected_option CHAR(1) NOT NULL,
  explanation TEXT,
  source TEXT NOT NULL,
  test_title TEXT,
  subject TEXT NOT NULL,
  topic TEXT DEFAULT '',
  failed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_resolved BOOLEAN NOT NULL DEFAULT FALSE
);

-- Enable Row Level Security (RLS) & Public Access Policies for Demo / Live Access
ALTER TABLE portal_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_lectures ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE cbt_test_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_mistakes ENABLE ROW LEVEL SECURITY;

-- Allow public read/write access policies (for anon and authenticated users)
CREATE POLICY "Allow public read portal_schedules" ON portal_schedules FOR SELECT USING (true);
CREATE POLICY "Allow public insert portal_schedules" ON portal_schedules FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update portal_schedules" ON portal_schedules FOR UPDATE USING (true);
CREATE POLICY "Allow public delete portal_schedules" ON portal_schedules FOR DELETE USING (true);

CREATE POLICY "Allow public read portal_lectures" ON portal_lectures FOR SELECT USING (true);
CREATE POLICY "Allow public insert portal_lectures" ON portal_lectures FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update portal_lectures" ON portal_lectures FOR UPDATE USING (true);
CREATE POLICY "Allow public delete portal_lectures" ON portal_lectures FOR DELETE USING (true);

CREATE POLICY "Allow public read portal_library" ON portal_library FOR SELECT USING (true);
CREATE POLICY "Allow public insert portal_library" ON portal_library FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update portal_library" ON portal_library FOR UPDATE USING (true);
CREATE POLICY "Allow public delete portal_library" ON portal_library FOR DELETE USING (true);

CREATE POLICY "Allow public read cbt_test_questions" ON cbt_test_questions FOR SELECT USING (true);
CREATE POLICY "Allow public insert cbt_test_questions" ON cbt_test_questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update cbt_test_questions" ON cbt_test_questions FOR UPDATE USING (true);
CREATE POLICY "Allow public delete cbt_test_questions" ON cbt_test_questions FOR DELETE USING (true);

CREATE POLICY "Allow public read portal_mistakes" ON portal_mistakes FOR SELECT USING (true);
CREATE POLICY "Allow public insert portal_mistakes" ON portal_mistakes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update portal_mistakes" ON portal_mistakes FOR UPDATE USING (true);
CREATE POLICY "Allow public delete portal_mistakes" ON portal_mistakes FOR DELETE USING (true);
