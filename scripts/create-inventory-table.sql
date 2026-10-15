-- ============================================================
-- Belesu · Hard Copy Books Inventory Table & Audit Log Migration
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- 1. Create hard_copy_inventory table
CREATE TABLE IF NOT EXISTS hard_copy_inventory (
  book_id             TEXT PRIMARY KEY,
  sku                 TEXT UNIQUE NOT NULL,
  title               TEXT NOT NULL,
  series              TEXT NOT NULL,
  grade_class         INTEGER NOT NULL,
  stock_quantity      INTEGER NOT NULL DEFAULT 50,
  low_stock_threshold INTEGER NOT NULL DEFAULT 10,
  is_in_stock         BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create inventory_logs table
CREATE TABLE IF NOT EXISTS inventory_logs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id         TEXT NOT NULL REFERENCES hard_copy_inventory(book_id) ON DELETE CASCADE,
  change_amount   INTEGER NOT NULL,
  remaining_stock INTEGER NOT NULL,
  reason          TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indices
CREATE INDEX IF NOT EXISTS idx_hard_copy_inventory_sku ON hard_copy_inventory(sku);
CREATE INDEX IF NOT EXISTS idx_inventory_logs_book_id ON inventory_logs(book_id);
CREATE INDEX IF NOT EXISTS idx_inventory_logs_created_at ON inventory_logs(created_at DESC);

-- Enable RLS
ALTER TABLE hard_copy_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;

-- Auto-update updated_at trigger for hard_copy_inventory
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_hard_copy_inventory_updated_at') THEN
    CREATE TRIGGER trg_hard_copy_inventory_updated_at
      BEFORE UPDATE ON hard_copy_inventory
      FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
  END IF;
END $$;

-- 3. Compatibility VIEW for physical_inventory so legacy queries work seamlessly
CREATE OR REPLACE VIEW physical_inventory AS 
SELECT * FROM hard_copy_inventory;

-- 4. Seed Initial Inventory for the 10 Hard Copy guidebooks (Classes 1–5)
INSERT INTO hard_copy_inventory (book_id, sku, title, series, grade_class, stock_quantity, low_stock_threshold, is_in_stock)
VALUES
  ('15926', 'SK1', 'Savi Kannada English Translated Innovative Guidebook Class 1', 'Savi', 1, 45, 10, true),
  ('15849', 'SK2', 'Savi Kannada English Translated Innovative Guidebook Class 2', 'Savi', 2, 60, 10, true),
  ('16142', 'SK3', 'Savi Kannada English Translated Innovative Guidebook Class 3', 'Savi', 3, 50, 10, true),
  ('16351', 'SK4', 'Savi Kannada English Translated Innovative Guidebook Class 4', 'Savi', 4, 38, 10, true),
  ('19570', 'KK1', 'Kali Kannada English Translated Innovative Guidebook Class 1', 'Kali', 1, 40, 10, true),
  ('19577', 'KK2', 'Kali Kannada English Translated Innovative Guidebook Class 2', 'Kali', 2, 30, 10, true),
  ('19571', 'KK3', 'Kali Kannada English Translated Innovative Guidebook Class 3', 'Kali', 3, 25, 10, true),
  ('19757', 'KK4', 'Kali Kannada English Translated Innovative Guidebook Class 4', 'Kali', 4, 35, 10, true),
  ('17548', 'SR5', 'Siri Kannada English Translated Guidebook Class 5', 'Siri', 5, 50, 10, true),
  ('20049', 'TL5', 'Tili Kannada English Translated Innovative Guidebook Class 5', 'Tili', 5, 42, 10, true)
ON CONFLICT (book_id) DO UPDATE SET
  title = EXCLUDED.title,
  sku = EXCLUDED.sku,
  series = EXCLUDED.series,
  grade_class = EXCLUDED.grade_class;

-- Initial log entry for baseline stock
INSERT INTO inventory_logs (book_id, change_amount, remaining_stock, reason)
SELECT book_id, stock_quantity, stock_quantity, 'Initial Baseline Stock'
FROM hard_copy_inventory
WHERE NOT EXISTS (
  SELECT 1 FROM inventory_logs WHERE inventory_logs.book_id = hard_copy_inventory.book_id
);
