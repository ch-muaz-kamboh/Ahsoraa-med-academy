-- =============================================================================
-- AHSORA MEDS ACADEMY - ALL PENDING MIGRATIONS
-- Copy and paste this into: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. CMS & Package Availability Columns (Migration 20261102_cms_add_columns.sql)
-- -----------------------------------------------------------------------------
ALTER TABLE public.package_prices 
ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS disabled_notice TEXT;

ALTER TABLE public.site_content 
ADD COLUMN IF NOT EXISTS sale_offer_config JSONB,
ADD COLUMN IF NOT EXISTS imat_ticker_config JSONB;

-- Ensure RLS policies allow public read/write for dynamic CMS features
DO $$ BEGIN
  DROP POLICY IF EXISTS "Allow public write on package_prices" ON public.package_prices;
  CREATE POLICY "Allow public write on package_prices" ON public.package_prices FOR ALL USING (true);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Allow public write on site_content" ON public.site_content;
  CREATE POLICY "Allow public write on site_content" ON public.site_content FOR ALL USING (true);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- -----------------------------------------------------------------------------
-- 2. Staff Portal RBAC & Mock Snapshots (Migration 20260920_staff_portal_rbac.sql)
-- -----------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE account_type_enum AS ENUM ('student', 'staff', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE staff_role_enum AS ENUM ('super_admin', 'academic_admin', 'teacher', 'admissions_staff');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE item_status_enum AS ENUM ('draft', 'in_review', 'published', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Staff Roles Table
CREATE TABLE IF NOT EXISTS public.staff_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role staff_role_enum NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- Staff Subject Assignments
CREATE TABLE IF NOT EXISTS public.staff_subject_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(staff_id, subject)
);

-- Staff Cohort Assignments
CREATE TABLE IF NOT EXISTS public.staff_cohort_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    cohort_name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(staff_id, cohort_name)
);

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target_entity TEXT NOT NULL,
    target_id TEXT,
    old_values JSONB,
    new_values JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Versioned IMAT Mock Configuration Snapshots
CREATE TABLE IF NOT EXISTS public.imat_mock_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_label TEXT NOT NULL,
    questions_count INT NOT NULL DEFAULT 60,
    duration_minutes INT NOT NULL DEFAULT 100,
    scoring_correct NUMERIC(3,1) NOT NULL DEFAULT 1.5,
    scoring_incorrect NUMERIC(3,1) NOT NULL DEFAULT -0.4,
    scoring_blank NUMERIC(3,1) NOT NULL DEFAULT 0.0,
    max_score NUMERIC(5,1) NOT NULL DEFAULT 90.0,
    question_ids JSONB NOT NULL,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add Status & Creator fields to Question Bank
ALTER TABLE IF EXISTS public.qb_questions
    ADD COLUMN IF NOT EXISTS publishing_status item_status_enum DEFAULT 'published',
    ADD COLUMN IF NOT EXISTS major_category TEXT;

-- Enable RLS & Policies
ALTER TABLE public.staff_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_subject_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_cohort_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.imat_mock_snapshots ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Public read staff_roles" ON public.staff_roles FOR SELECT USING (true);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Public read staff_subject_assignments" ON public.staff_subject_assignments FOR SELECT USING (true);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Public read staff_cohort_assignments" ON public.staff_cohort_assignments FOR SELECT USING (true);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Public read imat_mock_snapshots" ON public.imat_mock_snapshots FOR SELECT USING (true);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
