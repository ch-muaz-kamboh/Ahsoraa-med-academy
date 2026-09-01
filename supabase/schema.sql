-- =============================================================================
-- AHSORA MEDS ACADEMY - COMPLETE PRODUCTION SUPABASE POSTGRESQL SCHEMA
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search on names/titles

-- =============================================================================
-- SECTION 1: ENUMS (match src/types/index.ts exactly)
-- =============================================================================

-- 1. ENUMS & DOMAINS
CREATE TYPE user_role AS ENUM (
  'visitor',
  'lead',
  'student',
  'parent',
  'faculty',
  'counsellor',
  'admissions_officer',
  'visa_officer',
  'finance',
  'content_editor',
  'admin',
  'super_admin'
);

CREATE TYPE lead_stage AS ENUM (
  'new',
  'contacted',
  'qualified',
  'counselling_booked',
  'counselling_completed',
  'proposal_sent',
  'payment_pending',
  'converted',
  'onboarding',
  'closed_lost'
);

CREATE TYPE lead_priority AS ENUM ('hot', 'warm', 'cold');

CREATE TYPE test_difficulty AS ENUM ('easy', 'medium', 'hard', 'expert');

CREATE TYPE attempt_status AS ENUM ('in_progress', 'completed', 'timed_out', 'abandoned');

CREATE TYPE doubt_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');

CREATE TYPE application_status AS ENUM (
  'profile_review',
  'shortlisting',
  'documents_pending',
  'eligibility_check',
  'application_prepared',
  'submitted',
  'under_university_review',
  'conditional_offer',
  'unconditional_offer',
  'rejected',
  'enrolled',
  'visa_stage'
);

CREATE TYPE document_category AS ENUM (
  'identity_passport',
  'academic_certificate',
  'transcript',
  'attestation_legalization',
  'language_certificate',
  'application_form',
  'university_correspondence',
  'scholarship_document',
  'financial_document',
  'visa_document',
  'travel_document',
  'other'
);

CREATE TYPE document_status AS ENUM (
  'requested',
  'uploaded',
  'under_review',
  'revision_requested',
  'resubmitted',
  'approved',
  'submitted_to_university',
  'archived'
);

CREATE TYPE visa_status AS ENUM (
  'checklist_pending',
  'documents_collecting',
  'documents_verified',
  'appointment_booked',
  'interview_prep',
  'submitted',
  'embassy_processing',
  'additional_info_requested',
  'approved',
  'refused',
  'appealed'
);

CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');

-- =============================================================================
-- SECTION 2: UTILITY FUNCTIONS & TRIGGERS
-- =============================================================================

-- Auto-update updated_at on any table that has the column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Auto-create a profile row when a new user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'New'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'User'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Helper: check if current user is staff
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

-- Helper: check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- SECTION 3: TABLES
-- =============================================================================

-- 2. USER PROFILES (Unified Identity with Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'student',
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  avatar_url TEXT,
  country TEXT DEFAULT 'United States',
  city TEXT,
  target_exam TEXT,
  target_country TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3. CRM & LEADS
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_code TEXT UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT,
  city TEXT,
  academic_background TEXT,
  target_exam TEXT,
  target_country TEXT,
  budget_range TEXT,
  source TEXT DEFAULT 'website_direct',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  assigned_counsellor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  stage lead_stage NOT NULL DEFAULT 'new',
  priority lead_priority NOT NULL DEFAULT 'warm',
  lead_score INTEGER DEFAULT 50,
  next_followup_at TIMESTAMPTZ,
  notes TEXT,
  converted_student_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lead_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  activity_type TEXT NOT NULL,
  title TEXT NOT NULL,
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PRODUCTS & CENTRALIZED PRICING
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  image_url TEXT,
  badge TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_prices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  currency TEXT NOT NULL DEFAULT 'USD',
  price NUMERIC(10, 2) NOT NULL,
  compare_price NUMERIC(10, 2),
  duration_days INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. ORDERS & PAYMENTS
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  price_id UUID NOT NULL REFERENCES product_prices(id),
  subtotal NUMERIC(10, 2) NOT NULL,
  discount NUMERIC(10, 2) DEFAULT 0,
  tax NUMERIC(10, 2) DEFAULT 0,
  total NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status payment_status NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  gateway_transaction_id TEXT,
  invoice_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. COURSES & LMS
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  target_exam TEXT,
  summary TEXT,
  overview TEXT,
  thumbnail_url TEXT,
  duration_hours INTEGER DEFAULT 0,
  total_lectures INTEGER DEFAULT 0,
  total_tests INTEGER DEFAULT 0,
  total_resources INTEGER DEFAULT 0,
  rating NUMERIC(3, 2) DEFAULT 4.9,
  students_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS course_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  duration_minutes INTEGER DEFAULT 15,
  video_url TEXT,
  content_markdown TEXT,
  attachments JSONB DEFAULT '[]'::jsonb,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_preview_allowed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id),
  progress_percent INTEGER DEFAULT 0,
  completed_lessons INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMPTZ,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, course_id)
);

CREATE TABLE IF NOT EXISTS lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT FALSE,
  last_watched_second INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  UNIQUE(student_id, lesson_id)
);

-- 7. TEST & ASSESSMENT ENGINE
CREATE TABLE IF NOT EXISTS tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  subject TEXT,
  difficulty test_difficulty NOT NULL DEFAULT 'medium',
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  total_questions INTEGER NOT NULL DEFAULT 30,
  total_marks NUMERIC(6, 2) NOT NULL DEFAULT 120,
  positive_mark NUMERIC(4, 2) NOT NULL DEFAULT 4,
  negative_mark NUMERIC(4, 2) NOT NULL DEFAULT 1,
  passing_percentage NUMERIC(4, 2) NOT NULL DEFAULT 50,
  instructions TEXT,
  is_public_sample BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_id UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_image_url TEXT,
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  difficulty test_difficulty NOT NULL DEFAULT 'medium',
  options JSONB NOT NULL, -- [{"id": "A", "text": "Option A"}, ...]
  correct_option TEXT NOT NULL, -- "A", "B", "C", "D"
  explanation TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS test_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_id UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status attempt_status NOT NULL DEFAULT 'in_progress',
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  time_spent_seconds INTEGER DEFAULT 0,
  total_score NUMERIC(6, 2) DEFAULT 0,
  percentage NUMERIC(5, 2) DEFAULT 0,
  total_attempted INTEGER DEFAULT 0,
  total_correct INTEGER DEFAULT 0,
  total_incorrect INTEGER DEFAULT 0,
  total_unanswered INTEGER DEFAULT 0,
  accuracy_rate NUMERIC(5, 2) DEFAULT 0,
  percentile NUMERIC(5, 2) DEFAULT 0,
  subject_breakdown JSONB DEFAULT '{}'::jsonb,
  topic_breakdown JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS test_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id UUID NOT NULL REFERENCES test_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  selected_option TEXT,
  is_correct BOOLEAN,
  is_marked_review BOOLEAN DEFAULT FALSE,
  marks_awarded NUMERIC(4, 2) DEFAULT 0,
  time_spent_seconds INTEGER DEFAULT 0,
  answered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(attempt_id, question_id)
);

-- 8. MENTORSHIP & DOUBTS
CREATE TABLE IF NOT EXISTS mentors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  specialization TEXT NOT NULL,
  qualifications TEXT NOT NULL,
  experience_years INTEGER DEFAULT 5,
  bio TEXT,
  avatar_url TEXT,
  rating NUMERIC(3, 2) DEFAULT 4.9,
  total_sessions INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT TRUE,
  hourly_rate NUMERIC(10, 2) DEFAULT 50,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mentor_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 45,
  topic TEXT NOT NULL,
  notes TEXT,
  meeting_link TEXT,
  status TEXT DEFAULT 'confirmed', -- confirmed, completed, cancelled, rescheduled
  rating INTEGER,
  feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS doubt_threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  assigned_mentor_id UUID REFERENCES mentors(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  title TEXT NOT NULL,
  question_text TEXT NOT NULL,
  attachment_url TEXT,
  status doubt_status NOT NULL DEFAULT 'open',
  resolution_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. UNIVERSITIES & ADMISSIONS INTELLIGENCE
CREATE TABLE IF NOT EXISTS universities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  ranking_world INTEGER,
  ranking_national INTEGER,
  tuition_fee_annual NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  duration_years NUMERIC(3, 1) DEFAULT 6.0,
  language_of_instruction TEXT DEFAULT 'English',
  intake_months TEXT[] DEFAULT ARRAY['September'],
  admission_rate_percent INTEGER DEFAULT 45,
  overview TEXT,
  eligibility_criteria TEXT,
  required_documents TEXT[],
  image_url TEXT,
  official_website_url TEXT,
  last_verified_at DATE DEFAULT CURRENT_DATE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scholarships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  university_id UUID REFERENCES universities(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  country TEXT NOT NULL,
  coverage_amount TEXT NOT NULL,
  coverage_type TEXT NOT NULL, -- 'Full Tuition', 'Partial', 'Living Stipend'
  eligibility_summary TEXT NOT NULL,
  deadline DATE NOT NULL,
  required_documents TEXT[],
  application_link TEXT,
  last_verified_at DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. ADMISSIONS APPLICATIONS & SECURE DOCUMENTS
CREATE TABLE IF NOT EXISTS application_cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_number TEXT UNIQUE NOT NULL,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  assigned_counsellor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  assigned_admissions_officer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  target_country TEXT NOT NULL,
  target_intake TEXT NOT NULL,
  current_stage application_status NOT NULL DEFAULT 'shortlisting',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES application_cases(id) ON DELETE CASCADE,
  university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  program_name TEXT NOT NULL DEFAULT 'MBBS / Doctor of Medicine',
  status application_status NOT NULL DEFAULT 'shortlisting',
  submission_deadline DATE,
  submitted_at TIMESTAMPTZ,
  decision_date DATE,
  offer_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  case_id UUID REFERENCES application_cases(id) ON DELETE SET NULL,
  category document_category NOT NULL,
  title TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  status document_status NOT NULL DEFAULT 'uploaded',
  rejection_reason TEXT,
  reviewer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. VISA CASE MANAGEMENT
CREATE TABLE IF NOT EXISTS visa_cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  destination_country TEXT NOT NULL,
  visa_type TEXT NOT NULL DEFAULT 'Student Visa (Subclass / Category)',
  assigned_visa_officer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status visa_status NOT NULL DEFAULT 'checklist_pending',
  embassy_location TEXT,
  appointment_date TIMESTAMPTZ,
  submission_date DATE,
  decision_date DATE,
  decision_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- SECTION 13: INDEXES FOR HIGH QUERY PERFORMANCE
-- =============================================================================

-- Leads
CREATE INDEX IF NOT EXISTS idx_leads_stage           ON leads(stage);
CREATE INDEX IF NOT EXISTS idx_leads_priority        ON leads(priority);
CREATE INDEX IF NOT EXISTS idx_leads_counsellor      ON leads(assigned_counsellor_id);
CREATE INDEX IF NOT EXISTS idx_leads_email           ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at      ON leads(created_at DESC);
-- Courses & LMS
CREATE INDEX IF NOT EXISTS idx_enrollments_student   ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course    ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_student ON lesson_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_courses_slug          ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_lessons_module        ON lessons(module_id);
-- Tests
CREATE INDEX IF NOT EXISTS idx_test_attempts_student ON test_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_test_attempts_test    ON test_attempts(test_id);
CREATE INDEX IF NOT EXISTS idx_test_answers_attempt  ON test_answers(attempt_id);
CREATE INDEX IF NOT EXISTS idx_questions_test        ON questions(test_id);
-- Documents & Cases
CREATE INDEX IF NOT EXISTS idx_documents_student     ON documents(student_id);
CREATE INDEX IF NOT EXISTS idx_documents_case        ON documents(case_id);
CREATE INDEX IF NOT EXISTS idx_documents_status      ON documents(status);
CREATE INDEX IF NOT EXISTS idx_applications_case     ON applications(case_id);
CREATE INDEX IF NOT EXISTS idx_application_cases_student ON application_cases(student_id);
-- Visa & Doubts
CREATE INDEX IF NOT EXISTS idx_visa_cases_student    ON visa_cases(student_id);
CREATE INDEX IF NOT EXISTS idx_doubt_threads_student ON doubt_threads(student_id);
CREATE INDEX IF NOT EXISTS idx_doubt_threads_status  ON doubt_threads(status);
-- Audit
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity     ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- =============================================================================
-- SECTION 14: ROW LEVEL SECURITY (RLS)
-- =============================================================================

ALTER TABLE profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads             ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities   ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders            ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments       ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress   ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_attempts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_answers      ENABLE ROW LEVEL SECURITY;
ALTER TABLE doubt_threads     ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents         ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications      ENABLE ROW LEVEL SECURITY;
ALTER TABLE visa_cases        ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_sessions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs        ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Users can view own profile"     ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"   ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Staff can view all profiles"    ON profiles FOR SELECT USING (is_staff());
CREATE POLICY "Admins can update any profile"  ON profiles FOR UPDATE USING (is_admin());

-- LEADS
CREATE POLICY "Staff can view all leads"       ON leads FOR SELECT USING (is_staff());
CREATE POLICY "Staff can insert leads"         ON leads FOR INSERT WITH CHECK (is_staff());
CREATE POLICY "Staff can update leads"         ON leads FOR UPDATE USING (is_staff());
CREATE POLICY "Admins can delete leads"        ON leads FOR DELETE USING (is_admin());

-- LEAD ACTIVITIES
CREATE POLICY "Staff can view lead activities"    ON lead_activities FOR SELECT USING (is_staff());
CREATE POLICY "Staff can insert lead activities"  ON lead_activities FOR INSERT WITH CHECK (is_staff());

-- ORDERS
CREATE POLICY "Students can view own orders"   ON orders FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Staff can view all orders"      ON orders FOR SELECT USING (is_staff());
CREATE POLICY "Staff can insert orders"        ON orders FOR INSERT WITH CHECK (is_staff());
CREATE POLICY "Admins can update orders"       ON orders FOR UPDATE USING (is_admin());

-- ENROLLMENTS
CREATE POLICY "Students can view own enrollments" ON enrollments FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Staff can view all enrollments"    ON enrollments FOR SELECT USING (is_staff());
CREATE POLICY "Staff can insert enrollments"      ON enrollments FOR INSERT WITH CHECK (is_staff());

-- LESSON PROGRESS
CREATE POLICY "Students can view own progress"   ON lesson_progress FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can upsert own progress" ON lesson_progress FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Students can update own progress" ON lesson_progress FOR UPDATE USING (auth.uid() = student_id);

-- TEST ATTEMPTS
CREATE POLICY "Students can view own attempts"   ON test_attempts FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can create own attempts" ON test_attempts FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Students can update own attempts" ON test_attempts FOR UPDATE USING (auth.uid() = student_id);
CREATE POLICY "Staff can view all attempts"      ON test_attempts FOR SELECT USING (is_staff());

-- TEST ANSWERS
CREATE POLICY "Students can manage own answers"  ON test_answers FOR ALL USING (
  EXISTS (SELECT 1 FROM test_attempts WHERE id = test_answers.attempt_id AND student_id = auth.uid())
);
CREATE POLICY "Staff can view all answers"       ON test_answers FOR SELECT USING (is_staff());

-- DOUBT THREADS
CREATE POLICY "Students can view own doubts"    ON doubt_threads FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can create doubts"      ON doubt_threads FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Staff can view all doubts"       ON doubt_threads FOR SELECT USING (is_staff());
CREATE POLICY "Staff can update doubt threads"  ON doubt_threads FOR UPDATE USING (is_staff());

-- DOCUMENTS
CREATE POLICY "Students can view own documents"  ON documents FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can upload documents"    ON documents FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Staff can view all documents"     ON documents FOR SELECT USING (is_staff());
CREATE POLICY "Staff can review documents"       ON documents FOR UPDATE USING (is_staff());

-- APPLICATION CASES
CREATE POLICY "Students can view own cases"      ON application_cases FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Staff can manage all cases"       ON application_cases FOR ALL USING (is_staff());

-- APPLICATIONS
CREATE POLICY "Students can view own applications" ON applications FOR SELECT USING (
  EXISTS (SELECT 1 FROM application_cases WHERE id = applications.case_id AND student_id = auth.uid())
);
CREATE POLICY "Staff can manage all applications" ON applications FOR ALL USING (is_staff());

-- VISA CASES
CREATE POLICY "Students can view own visa cases" ON visa_cases FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Staff can manage all visa cases"  ON visa_cases FOR ALL USING (is_staff());

-- MENTOR SESSIONS
CREATE POLICY "Students can view own sessions"   ON mentor_sessions FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Staff can view all sessions"      ON mentor_sessions FOR SELECT USING (is_staff());
CREATE POLICY "Staff can manage sessions"        ON mentor_sessions FOR INSERT WITH CHECK (is_staff());

-- AUDIT LOGS
CREATE POLICY "Admins can view audit logs"       ON audit_logs FOR SELECT USING (is_admin());
CREATE POLICY "System can insert audit logs"     ON audit_logs FOR INSERT WITH CHECK (TRUE);

-- =============================================================================
-- SECTION 15: STORAGE BUCKETS
-- Run in: Supabase Dashboard → SQL Editor
-- =============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'student-documents',
    'student-documents',
    FALSE,        -- Private: requires signed URLs
    52428800,     -- 50 MB max
    ARRAY['application/pdf','image/jpeg','image/png','image/webp',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  ),
  (
    'avatars',
    'avatars',
    TRUE,         -- Public: avatar URLs accessible to anyone
    5242880,      -- 5 MB max
    ARRAY['image/jpeg','image/png','image/webp','image/gif']
  ),
  (
    'course-assets',
    'course-assets',
    TRUE,         -- Public: thumbnails & preview images
    20971520,     -- 20 MB max
    ARRAY['image/jpeg','image/png','image/webp','video/mp4','video/webm']
  )
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: student-documents
CREATE POLICY "Students can upload own docs storage"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'student-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Students can view own docs storage"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'student-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Staff can view all student docs storage"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'student-documents' AND is_staff());

-- Storage RLS: avatars
CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Storage RLS: course-assets
CREATE POLICY "Anyone can view course assets"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'course-assets');

CREATE POLICY "Staff can upload course assets"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'course-assets' AND is_staff());

-- =============================================================================
-- SECTION 16: SEED DATA (Sample records for development & testing)
-- =============================================================================

-- Sample University
INSERT INTO universities (
  name, slug, country, city, ranking_world, ranking_national,
  tuition_fee_annual, currency, duration_years, language_of_instruction,
  intake_months, admission_rate_percent, overview, is_featured, programs
) VALUES (
  'University of Warsaw Medical Faculty',
  'university-of-warsaw-medical',
  'Poland', 'Warsaw',
  401, 1, 10000.00, 'USD', 6.0, 'English',
  ARRAY['October'], 65,
  'One of Europe''s premier medical institutions with over 200 years of history, offering a world-class MBBS program taught entirely in English.',
  TRUE,
  ARRAY['MBBS / Doctor of Medicine', 'Dentistry', 'Pharmacy']
) ON CONFLICT (slug) DO NOTHING;

-- Sample Scholarship
INSERT INTO scholarships (
  title, country, university_name, coverage_amount, coverage_type,
  eligibility_summary, deadline, last_verified_at
) VALUES (
  'Polish Government Scholarship for International Medical Students',
  'Poland', 'University of Warsaw',
  '$8,000/year', 'Partial',
  'Open to students with minimum 80% in Biology and Chemistry. IELTS 6.5+ required. Financial need considered.',
  (CURRENT_DATE + INTERVAL '6 months')::DATE,
  CURRENT_DATE
);

-- Sample Course
INSERT INTO courses (
  slug, title, category, target_exam, summary,
  thumbnail_url, duration_hours, total_lectures, total_tests,
  rating, students_count, price, compare_price, is_featured, badge, is_published
) VALUES (
  'usmle-step1-complete-prep-2026',
  'USMLE Step 1 Complete Prep 2026',
  'Medical Licensing', 'USMLE Step 1',
  'Comprehensive USMLE Step 1 preparation covering all high-yield basic science topics with 1,500+ practice questions, video lectures, and performance analytics.',
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
  120, 240, 18, 4.9, 1847, 299.00, 499.00, TRUE, 'Bestseller', TRUE
) ON CONFLICT (slug) DO NOTHING;

-- Sample Test (public/free sample)
INSERT INTO tests (
  title, slug, category, subject, difficulty,
  duration_minutes, total_questions, total_marks, positive_mark, negative_mark,
  passing_percentage, instructions, is_public_sample, is_published
) VALUES (
  'USMLE Step 1 - Biology & Physiology Sample',
  'usmle-step1-bio-physio-sample',
  'USMLE Step 1', 'Biology & Physiology', 'medium',
  30, 10, 40, 4, 1, 50,
  'This is a free sample test. Each correct answer awards +4 marks; incorrect answers deduct -1 mark. Unanswered questions score 0.',
  TRUE, TRUE
) ON CONFLICT (slug) DO NOTHING;
