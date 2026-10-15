-- ============================================================
-- Belesu · Full Database Reset Script
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- WARNING: This permanently deletes ALL data.
-- ============================================================

-- ── Step 1: Drop everything in dependency order ──────────────
DROP TABLE IF EXISTS inventory_logs     CASCADE;
DROP TABLE IF EXISTS physical_inventory CASCADE;
DROP TABLE IF EXISTS read_progress      CASCADE;
DROP TABLE IF EXISTS digital_books       CASCADE;
DROP TABLE IF EXISTS digital_orders     CASCADE;  -- legacy table, not recreated
DROP TABLE IF EXISTS order_items        CASCADE;
DROP TABLE IF EXISTS orders             CASCADE;
DROP TABLE IF EXISTS addresses          CASCADE;
DROP TABLE IF EXISTS otps               CASCADE;
DROP TABLE IF EXISTS users              CASCADE;

DROP FUNCTION IF EXISTS generate_order_number() CASCADE;
DROP SEQUENCE  IF EXISTS order_number_seq       CASCADE;

-- ── Step 2: Enable UUID extension ────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Step 3: users ─────────────────────────────────────────────
CREATE TABLE users (
  id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone           TEXT        UNIQUE NOT NULL,
  name            TEXT        NOT NULL DEFAULT '',
  email           TEXT,
  -- JSONB blob: { "physical": ["prodId",...], "digital": ["bookId",...] }
  purchased_books JSONB       NOT NULL DEFAULT '{"physical":[],"digital":[]}'::jsonb,
  is_admin        BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_phone ON users(phone);

-- ── Step 4: otps ──────────────────────────────────────────────
CREATE TABLE otps (
  id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone      TEXT        UNIQUE NOT NULL,
  otp_code   TEXT        NOT NULL,
  name       TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_otps_phone ON otps(phone);

-- ── Step 5: addresses ─────────────────────────────────────────
CREATE TABLE addresses (
  id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  first_name   TEXT        NOT NULL,
  last_name    TEXT        NOT NULL,
  address1     TEXT        NOT NULL,
  address2     TEXT,
  city         TEXT        NOT NULL,
  state        TEXT        NOT NULL,
  postcode     TEXT        NOT NULL,
  phone        TEXT        NOT NULL,
  email        TEXT,
  label        TEXT,
  is_default   BOOLEAN     NOT NULL DEFAULT FALSE,
  latitude     NUMERIC(10,7),
  longitude    NUMERIC(10,7),
  usage_count  INTEGER     NOT NULL DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_addresses_user_id ON addresses(user_id);

-- ── Step 6: Order number sequence + function ──────────────────
CREATE SEQUENCE order_number_seq START 10001 INCREMENT 1 NO CYCLE;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT
LANGUAGE sql
AS $$
  SELECT 'BLS-' || LPAD(nextval('order_number_seq')::TEXT, 5, '0');
$$;

-- ── Step 7: orders ────────────────────────────────────────────
CREATE TABLE orders (
  id                     UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number           TEXT        UNIQUE NOT NULL,
  user_id                UUID        NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  order_status           TEXT        NOT NULL DEFAULT 'Pending',
  order_date             TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  billing_first_name     TEXT        NOT NULL,
  billing_last_name      TEXT        NOT NULL DEFAULT '',
  billing_address1       TEXT        NOT NULL,
  billing_address2       TEXT,
  billing_city           TEXT        NOT NULL,
  billing_state          TEXT        NOT NULL,
  billing_postcode       TEXT        NOT NULL,
  billing_phone          TEXT        NOT NULL,
  billing_email          TEXT,

  shipping_address_id    UUID        REFERENCES addresses(id) ON DELETE SET NULL,
  shipping_first_name    TEXT,
  shipping_last_name     TEXT,
  shipping_address1      TEXT,
  shipping_address2      TEXT,
  shipping_city          TEXT,
  shipping_state         TEXT,
  shipping_postcode      TEXT,
  shipping_phone         TEXT,
  shipping_method        TEXT,

  payment_method         TEXT        NOT NULL DEFAULT 'Online',
  payment_status         TEXT        NOT NULL DEFAULT 'Pending',

  razorpay_order_id      TEXT,
  razorpay_payment_id    TEXT,

  order_subtotal_amount  NUMERIC(10,2) NOT NULL DEFAULT 0,
  order_shipping_amount  NUMERIC(10,2) NOT NULL DEFAULT 0,
  order_total_tax_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  order_refund_amount    NUMERIC(10,2) NOT NULL DEFAULT 0,
  order_total_amount     NUMERIC(10,2) NOT NULL DEFAULT 0,

  has_hard_copy_books    BOOLEAN     NOT NULL DEFAULT FALSE,
  has_physical_books     BOOLEAN     NOT NULL DEFAULT FALSE,
  has_digital_books      BOOLEAN     NOT NULL DEFAULT FALSE,

  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_user_id      ON orders(user_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_status       ON orders(order_status);

-- ── Step 8: order_items ───────────────────────────────────────
CREATE TABLE order_items (
  id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id   UUID        NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  item_sku   TEXT,
  item_name  TEXT        NOT NULL,
  item_type  TEXT        NOT NULL DEFAULT 'hard_copy',
  quantity   INTEGER     NOT NULL DEFAULT 1,
  item_cost  NUMERIC(10,2) NOT NULL DEFAULT 0,
  item_total NUMERIC(10,2) NOT NULL DEFAULT 0,
  product_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- ── Step 9: read_progress ────────────────────────────────────
CREATE TABLE read_progress (
  id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  book_id    TEXT        NOT NULL,
  last_page  INTEGER     NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, book_id)
);

CREATE INDEX idx_read_progress_user_book ON read_progress(user_id, book_id);

-- ── Step 10: digital_books ───────────────────────────────────
CREATE TABLE digital_books (
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

CREATE INDEX idx_digital_books_grade   ON digital_books(grade_class);
CREATE INDEX idx_digital_books_subject ON digital_books(subject);
CREATE INDEX idx_digital_books_slug    ON digital_books(slug);

-- ── Step 11: hard_copy_inventory ──────────────────────────────
CREATE TABLE hard_copy_inventory (
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

CREATE INDEX idx_hard_copy_inventory_sku ON hard_copy_inventory(sku);

-- ── Step 12: inventory_logs ──────────────────────────────────
CREATE TABLE inventory_logs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id         TEXT NOT NULL REFERENCES hard_copy_inventory(book_id) ON DELETE CASCADE,
  change_amount   INTEGER NOT NULL,
  remaining_stock INTEGER NOT NULL,
  reason          TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_inventory_logs_book_id ON inventory_logs(book_id);
CREATE INDEX idx_inventory_logs_created_at ON inventory_logs(created_at DESC);

-- Backward-compatible VIEW for physical_inventory so legacy queries continue working
CREATE OR REPLACE VIEW physical_inventory AS 
SELECT * FROM hard_copy_inventory;

-- ── Step 13: Auto-update updated_at triggers ──────────────────
CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE TRIGGER trg_addresses_updated_at
  BEFORE UPDATE ON addresses
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE TRIGGER trg_digital_books_updated_at
  BEFORE UPDATE ON digital_books
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE TRIGGER trg_hard_copy_inventory_updated_at
  BEFORE UPDATE ON hard_copy_inventory
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- Auto-sync trigger for orders has_hard_copy_books and has_physical_books
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

CREATE TRIGGER trg_sync_order_format_flags
  BEFORE INSERT OR UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION sync_order_format_flags();

-- ── Step 14: Enable Row-Level Security on all tables ──────────
ALTER TABLE users              ENABLE ROW LEVEL SECURITY;
ALTER TABLE otps               ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses          ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders             ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items        ENABLE ROW LEVEL SECURITY;
ALTER TABLE read_progress      ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_books      ENABLE ROW LEVEL SECURITY;
ALTER TABLE hard_copy_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_logs     ENABLE ROW LEVEL SECURITY;

-- NOTE: Your Next.js API routes use the SERVICE ROLE key which
-- bypasses RLS entirely — so the app will work without extra policies.

-- ── Step 15: Seed Initial Inventory for hard copy books ───────
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
ON CONFLICT (book_id) DO NOTHING;

INSERT INTO inventory_logs (book_id, change_amount, remaining_stock, reason)
SELECT book_id, stock_quantity, stock_quantity, 'Initial Baseline Stock'
FROM hard_copy_inventory;

-- ── Done! ─────────────────────────────────────────────────────
-- Tables: users, otps, addresses, orders, order_items, read_progress, digital_books, hard_copy_inventory, inventory_logs
-- Views: physical_inventory (backward-compatibility alias)
-- Functions: generate_order_number(), touch_updated_at(), sync_order_format_flags()
