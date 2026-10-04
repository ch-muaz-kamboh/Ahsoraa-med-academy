-- Create the free_mock_questions table for public free CBT mock
CREATE TABLE IF NOT EXISTS public.free_mock_questions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    text TEXT NOT NULL,
    options JSONB NOT NULL, -- Array of 5 string options
    correct_option TEXT NOT NULL,
    explanation TEXT,
    subject TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.free_mock_questions ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone (since it's a public mock test)
CREATE POLICY "Allow public read access to free_mock_questions"
    ON public.free_mock_questions
    FOR SELECT
    USING (true);

-- Allow all operations for authenticated users (admins adding questions)
CREATE POLICY "Allow authenticated full access to free_mock_questions"
    ON public.free_mock_questions
    FOR ALL
    USING (auth.role() = 'authenticated');
