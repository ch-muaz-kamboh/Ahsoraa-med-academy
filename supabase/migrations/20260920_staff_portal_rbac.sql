-- Migration: 20260920_staff_portal_rbac.sql
-- Description: Staff Portal Schema, RBAC Roles, Taxonomy, IMAT Mock Snapshots & Audit Logs

-- 1. Enum for Account Types and Staff Roles
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

-- 2. Profiles Table (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    display_name TEXT,
    account_type account_type_enum NOT NULL DEFAULT 'student',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Staff Roles Table
CREATE TABLE IF NOT EXISTS public.staff_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role staff_role_enum NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- 4. Staff Subject & Cohort Scoping Assignments
CREATE TABLE IF NOT EXISTS public.staff_subject_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(staff_id, subject)
);

CREATE TABLE IF NOT EXISTS public.staff_cohort_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    cohort_name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(staff_id, cohort_name)
);

-- 5. Audit Logs Table
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

-- 6. Versioned IMAT Mock Configuration Snapshots
CREATE TABLE IF NOT EXISTS public.imat_mock_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_label TEXT NOT NULL,
    questions_count INT NOT NULL DEFAULT 60,
    duration_minutes INT NOT NULL DEFAULT 100,
    scoring_correct NUMERIC(3,1) NOT NULL DEFAULT 1.5,
    scoring_incorrect NUMERIC(3,1) NOT NULL DEFAULT -0.4,
    scoring_blank NUMERIC(3,1) NOT NULL DEFAULT 0.0,
    max_score NUMERIC(5,1) NOT NULL DEFAULT 90.0,
    question_ids JSONB NOT NULL, -- Array of snapshot question objects
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Add Status & Creator fields to Question Bank & Materials if existing
ALTER TABLE IF EXISTS public.qb_questions
    ADD COLUMN IF NOT EXISTS publishing_status item_status_enum DEFAULT 'published',
    ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.profiles(id),
    ADD COLUMN IF NOT EXISTS major_category TEXT;

-- 8. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_subject_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_cohort_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 9. RLS Policies
-- Profiles: Users can read their own profile, staff/admin can read profiles
CREATE POLICY "Users view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Staff view all profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.account_type IN ('staff', 'admin')
        )
    );

-- Audit logs: readable by super_admin only
CREATE POLICY "Super Admins view audit logs" ON public.audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.staff_roles sr 
            WHERE sr.user_id = auth.uid() AND sr.role = 'super_admin'
        )
    );
