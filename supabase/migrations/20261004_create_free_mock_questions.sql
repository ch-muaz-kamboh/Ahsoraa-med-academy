-- Drop old table if it exists and recreate with proper schema
DROP TABLE IF EXISTS public.free_mock_questions;

-- Create the free_mock_questions table for public free CBT mock
CREATE TABLE public.free_mock_questions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    question TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    option_e TEXT NOT NULL,
    correct_option TEXT NOT NULL CHECK (correct_option IN ('a', 'b', 'c', 'd', 'e')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.free_mock_questions ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone (public mock test, no login required)
CREATE POLICY "Allow public read access to free_mock_questions"
    ON public.free_mock_questions
    FOR SELECT
    USING (true);

-- Allow all operations for authenticated users (admins adding questions)
CREATE POLICY "Allow authenticated full access to free_mock_questions"
    ON public.free_mock_questions
    FOR ALL
    USING (auth.role() = 'authenticated');
