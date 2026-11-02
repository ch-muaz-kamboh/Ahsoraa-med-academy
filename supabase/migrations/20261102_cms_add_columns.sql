-- =============================================================================
-- Migration: Add missing CMS columns for package availability and offer configs
-- Run in: Supabase Dashboard -> SQL Editor -> New Query
-- =============================================================================

-- 1. Add course availability and disabled notice columns to package_prices
ALTER TABLE public.package_prices 
ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS disabled_notice TEXT;

-- 2. Add JSONB config columns to site_content
ALTER TABLE public.site_content 
ADD COLUMN IF NOT EXISTS sale_offer_config JSONB,
ADD COLUMN IF NOT EXISTS imat_ticker_config JSONB;

-- 3. Ensure RLS policies allow public write access for admin features
CREATE POLICY "Allow public write on package_prices" ON public.package_prices FOR ALL USING (true);
CREATE POLICY "Allow public write on site_content" ON public.site_content FOR ALL USING (true);
