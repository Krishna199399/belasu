-- ==============================================================================
-- Migration: Create parent_reviews table with admin approval workflow
-- Execute in Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.parent_reviews (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_name    TEXT NOT NULL,
  location       TEXT DEFAULT 'Karnataka',
  child_grade    TEXT DEFAULT 'Class 4 Parent',
  rating         INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  review_text    TEXT NOT NULL,
  book_title     TEXT,
  is_approved    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_parent_reviews_approved ON public.parent_reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_parent_reviews_created  ON public.parent_reviews(created_at DESC);

-- Enable RLS
ALTER TABLE public.parent_reviews ENABLE ROW LEVEL SECURITY;

-- Public can read ONLY approved reviews
CREATE POLICY "Public can view approved reviews"
  ON public.parent_reviews
  FOR SELECT
  USING (is_approved = TRUE);

-- Anyone can submit a review (defaults to is_approved = FALSE)
CREATE POLICY "Public can insert reviews"
  ON public.parent_reviews
  FOR INSERT
  WITH CHECK (is_approved = FALSE);

-- Service role has full access (for Admin API routes)
CREATE POLICY "Service role full access on parent_reviews"
  ON public.parent_reviews
  FOR ALL
  TO service_role
  USING (TRUE)
  WITH CHECK (TRUE);

