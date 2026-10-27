-- =============================================================================
-- Migration: Add SEO Meta Title, Meta Description, URL Slug & FAQ items
-- =============================================================================

-- 1. Add SEO Meta Title, Meta Description, and FAQ items to news_posts table
ALTER TABLE public.news_posts 
  ADD COLUMN IF NOT EXISTS meta_title VARCHAR(60),
  ADD COLUMN IF NOT EXISTS meta_description VARCHAR(160),
  ADD COLUMN IF NOT EXISTS faq_items JSONB DEFAULT '[]'::jsonb;

-- 2. Ensure slug exists, is indexed and unique
CREATE UNIQUE INDEX IF NOT EXISTS idx_news_posts_slug ON public.news_posts (slug);

-- 3. Update existing records with default SEO titles and descriptions if empty
UPDATE public.news_posts
SET 
  meta_title = SUBSTRING(title, 1, 60),
  meta_description = SUBSTRING(excerpt, 1, 160)
WHERE meta_title IS NULL OR meta_description IS NULL;
