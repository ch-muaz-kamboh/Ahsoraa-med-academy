-- =============================================================================
-- AHSORA MEDS ACADEMY - CMS & DYNAMIC DATA SUPABASE SCHEMA
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- =============================================================================

-- 1. NEWS & BLOG POSTS TABLE
CREATE TABLE IF NOT EXISTS public.news_posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  author TEXT NOT NULL DEFAULT 'Ahsora Team',
  date TEXT NOT NULL,
  read_time TEXT NOT NULL DEFAULT '5 min read',
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. RESOURCE DOCUMENTS TABLE (Document Vault)
CREATE TABLE IF NOT EXISTS public.resource_documents (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  format TEXT NOT NULL DEFAULT 'PDF',
  file_url TEXT NOT NULL,
  file_size TEXT NOT NULL DEFAULT '2.0 MB',
  downloads_count INT DEFAULT 0,
  date_added TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. HOMEPAGE TICKER / MOVING STRIP TABLE
CREATE TABLE IF NOT EXISTS public.ticker_items (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  icon TEXT DEFAULT '✨',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. DYNAMIC COURSE PRICING & DISCOUNTS TABLE
CREATE TABLE IF NOT EXISTS public.package_prices (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  numeric_price NUMERIC NOT NULL,
  original_price TEXT,
  numeric_original_price NUMERIC,
  discount_badge TEXT,
  is_discount_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY (RLS) & ALLOW PUBLIC ACCESS FOR DEMO
ALTER TABLE public.news_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticker_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on news_posts" ON public.news_posts FOR SELECT USING (true);
CREATE POLICY "Allow public write access on news_posts" ON public.news_posts FOR ALL USING (true);

CREATE POLICY "Allow public read access on resource_documents" ON public.resource_documents FOR SELECT USING (true);
CREATE POLICY "Allow public write access on resource_documents" ON public.resource_documents FOR ALL USING (true);

CREATE POLICY "Allow public read access on ticker_items" ON public.ticker_items FOR SELECT USING (true);
CREATE POLICY "Allow public write access on ticker_items" ON public.ticker_items FOR ALL USING (true);

CREATE POLICY "Allow public read access on package_prices" ON public.package_prices FOR SELECT USING (true);
CREATE POLICY "Allow public write access on package_prices" ON public.package_prices FOR ALL USING (true);

-- SEED INITIAL PACKAGE PRICING IF EMPTY
INSERT INTO public.package_prices (id, name, price, numeric_price, original_price, numeric_original_price, discount_badge, is_discount_active)
VALUES 
  ('ascend', 'IMAT Ascend', '€299', 299, '€399', 399, '25% OFF', true),
  ('mastery', 'IMAT Mastery', '€499', 499, '€649', 649, '23% OFF', true),
  ('elite', 'MedPath Elite', '€799', 799, '€999', 999, '20% OFF', true)
ON CONFLICT (id) DO NOTHING;
