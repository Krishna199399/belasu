-- ============================================================
-- Belesu · Digital Books Table Migration
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

CREATE TABLE IF NOT EXISTS digital_books (
  id                    TEXT PRIMARY KEY,
  slug                  TEXT UNIQUE NOT NULL,
  title                 TEXT NOT NULL,
  sku                   TEXT UNIQUE NOT NULL,
  subject               TEXT NOT NULL,
  grade_class           INTEGER NOT NULL,
  price                 NUMERIC(10,2) NOT NULL DEFAULT 199,
  original_price        NUMERIC(10,2),
  cover_image           TEXT NOT NULL,
  total_pages           INTEGER NOT NULL DEFAULT 50,
  is_free_preview_pages INTEGER NOT NULL DEFAULT 5,
  description           TEXT NOT NULL DEFAULT '',
  author                TEXT NOT NULL DEFAULT 'Belesu Academic Team',
  language              TEXT NOT NULL DEFAULT 'Kannada with English Translations',
  badge                 TEXT,
  rating                NUMERIC(3,1) NOT NULL DEFAULT 5.0,
  review_count          INTEGER NOT NULL DEFAULT 0,
  features              JSONB NOT NULL DEFAULT '[]'::jsonb,
  table_of_contents     JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active             BOOLEAN NOT NULL DEFAULT TRUE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_digital_books_grade   ON digital_books(grade_class);
CREATE INDEX IF NOT EXISTS idx_digital_books_subject ON digital_books(subject);
CREATE INDEX IF NOT EXISTS idx_digital_books_slug    ON digital_books(slug);
CREATE INDEX IF NOT EXISTS idx_digital_books_active  ON digital_books(is_active);

-- Enable RLS
ALTER TABLE digital_books ENABLE ROW LEVEL SECURITY;

-- Auto-update updated_at trigger
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_digital_books_updated_at') THEN
    CREATE TRIGGER trg_digital_books_updated_at
      BEFORE UPDATE ON digital_books
      FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
  END IF;
END $$;
