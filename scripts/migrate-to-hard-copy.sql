-- ============================================================
-- Belesu · Migration: Rename Physical to Hard Copy Books
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- 1. Create or Rename Inventory Table to hard_copy_inventory
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'physical_inventory')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'hard_copy_inventory') THEN
    ALTER TABLE physical_inventory RENAME TO hard_copy_inventory;
    RAISE NOTICE 'Renamed physical_inventory to hard_copy_inventory';
  END IF;
END $$;

-- If hard_copy_inventory table doesn't exist yet, create it
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

-- Index on SKU
CREATE INDEX IF NOT EXISTS idx_hard_copy_inventory_sku ON hard_copy_inventory(sku);

-- Enable Row Level Security
ALTER TABLE hard_copy_inventory ENABLE ROW LEVEL SECURITY;

-- Auto-update updated_at trigger for hard_copy_inventory
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_hard_copy_inventory_updated_at') THEN
    CREATE TRIGGER trg_hard_copy_inventory_updated_at
      BEFORE UPDATE ON hard_copy_inventory
      FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
  END IF;
END $$;

-- 2. Create or verify inventory_logs table
CREATE TABLE IF NOT EXISTS inventory_logs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id         TEXT NOT NULL REFERENCES hard_copy_inventory(book_id) ON DELETE CASCADE,
  change_amount   INTEGER NOT NULL,
  remaining_stock INTEGER NOT NULL,
  reason          TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_logs_book_id ON inventory_logs(book_id);
CREATE INDEX IF NOT EXISTS idx_inventory_logs_created_at ON inventory_logs(created_at DESC);
ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;

-- 3. Create backward-compatible VIEW for physical_inventory so legacy queries continue working
CREATE OR REPLACE VIEW physical_inventory AS 
SELECT * FROM hard_copy_inventory;

-- 4. Update orders table: Add has_hard_copy_books column
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'has_hard_copy_books') THEN
    ALTER TABLE orders ADD COLUMN has_hard_copy_books BOOLEAN NOT NULL DEFAULT FALSE;
  END IF;
END $$;

-- Sync existing orders
UPDATE orders 
SET has_hard_copy_books = has_physical_books 
WHERE has_physical_books IS NOT NULL;

-- 5. Trigger to automatically keep has_hard_copy_books and has_physical_books in sync
CREATE OR REPLACE FUNCTION sync_order_format_flags()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.has_hard_copy_books IS NOT NULL THEN
    NEW.has_physical_books := NEW.has_hard_copy_books;
  ELSIF NEW.has_physical_books IS NOT NULL THEN
    NEW.has_hard_copy_books := NEW.has_physical_books;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_order_format_flags ON orders;
CREATE TRIGGER trg_sync_order_format_flags
  BEFORE INSERT OR UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION sync_order_format_flags();

-- 6. Update order_items: change default item_type to 'hard_copy' and update existing records
UPDATE order_items 
SET item_type = 'hard_copy' 
WHERE item_type = 'physical';

ALTER TABLE order_items 
ALTER COLUMN item_type SET DEFAULT 'hard_copy';

-- 7. Seed Initial Inventory for all 10 Classes 1–5 Hard Copy Guidebooks
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

-- 8. Seed baseline audit log entry if not already logged
INSERT INTO inventory_logs (book_id, change_amount, remaining_stock, reason)
SELECT book_id, stock_quantity, stock_quantity, 'Initial Baseline Stock'
FROM hard_copy_inventory
WHERE NOT EXISTS (
  SELECT 1 FROM inventory_logs WHERE inventory_logs.book_id = hard_copy_inventory.book_id
);
