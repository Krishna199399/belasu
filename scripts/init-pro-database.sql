-- ============================================================
-- Belesu × WACRM · Master Pro Supabase Initialization Script
-- Project: sjqccpysjxkmnfttoqgf (Supabase Pro)
-- 
-- Run this in your Supabase Pro Dashboard:
-- https://supabase.com/dashboard/project/sjqccpysjxkmnfttoqgf/sql/new
--
-- This script sets up:
-- 1. All Belesu e-commerce tables, views, sequences, triggers, & seed data (public schema)
-- 2. Dedicated WACRM schema (wacrm schema)
-- 3. Cross-schema real-time contact sync trigger (public.users -> wacrm.contacts)
-- ============================================================

-- ── PART 1: EXTENSIONS ───────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── PART 2: BELASU E-COMMERCE TABLES (public schema) ─────────

-- 1. users
CREATE TABLE IF NOT EXISTS public.users (
  id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone           TEXT        UNIQUE NOT NULL,
  name            TEXT        NOT NULL DEFAULT '',
  email           TEXT,
  purchased_books JSONB       NOT NULL DEFAULT '{"physical":[],"digital":[]}'::jsonb,
  is_admin        BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_phone ON public.users(phone);

-- 2. otps
CREATE TABLE IF NOT EXISTS public.otps (
  id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone      TEXT        UNIQUE NOT NULL,
  otp_code   TEXT        NOT NULL,
  name       TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_otps_phone ON public.otps(phone);

-- 3. addresses
CREATE TABLE IF NOT EXISTS public.addresses (
  id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
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

CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON public.addresses(user_id);

-- 4. Order sequence & generator
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 10001 INCREMENT 1 NO CYCLE;

CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT
LANGUAGE sql
AS $$
  SELECT 'BLS-' || LPAD(nextval('order_number_seq')::TEXT, 5, '0');
$$;

-- 5. orders
CREATE TABLE IF NOT EXISTS public.orders (
  id                     UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number           TEXT        UNIQUE NOT NULL,
  user_id                UUID        NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
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

  shipping_address_id    UUID        REFERENCES public.addresses(id) ON DELETE SET NULL,
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

CREATE INDEX IF NOT EXISTS idx_orders_user_id      ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status       ON public.orders(order_status);

-- 6. order_items
CREATE TABLE IF NOT EXISTS public.order_items (
  id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id   UUID        NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  item_sku   TEXT,
  item_name  TEXT        NOT NULL,
  item_type  TEXT        NOT NULL DEFAULT 'hard_copy',
  quantity   INTEGER     NOT NULL DEFAULT 1,
  item_cost  NUMERIC(10,2) NOT NULL DEFAULT 0,
  item_total NUMERIC(10,2) NOT NULL DEFAULT 0,
  product_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- 7. read_progress
CREATE TABLE IF NOT EXISTS public.read_progress (
  id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  book_id    TEXT        NOT NULL,
  last_page  INTEGER     NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, book_id)
);

CREATE INDEX IF NOT EXISTS idx_read_progress_user_book ON public.read_progress(user_id, book_id);

-- 8. digital_books
CREATE TABLE IF NOT EXISTS public.digital_books (
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

CREATE INDEX IF NOT EXISTS idx_digital_books_grade   ON public.digital_books(grade_class);
CREATE INDEX IF NOT EXISTS idx_digital_books_subject ON public.digital_books(subject);
CREATE INDEX IF NOT EXISTS idx_digital_books_slug    ON public.digital_books(slug);

-- 9. hard_copy_inventory
CREATE TABLE IF NOT EXISTS public.hard_copy_inventory (
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

CREATE INDEX IF NOT EXISTS idx_hard_copy_inventory_sku ON public.hard_copy_inventory(sku);

-- 10. inventory_logs
CREATE TABLE IF NOT EXISTS public.inventory_logs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id         TEXT NOT NULL REFERENCES public.hard_copy_inventory(book_id) ON DELETE CASCADE,
  change_amount   INTEGER NOT NULL,
  remaining_stock INTEGER NOT NULL,
  reason          TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_logs_book_id ON public.inventory_logs(book_id);
CREATE INDEX IF NOT EXISTS idx_inventory_logs_created_at ON public.inventory_logs(created_at DESC);

-- Backward-compatible VIEW for physical_inventory
CREATE OR REPLACE VIEW public.physical_inventory AS 
SELECT * FROM public.hard_copy_inventory;

-- 11. Helper Triggers & Touch Functions
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_users_updated_at ON public.users;
CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS trg_addresses_updated_at ON public.addresses;
CREATE TRIGGER trg_addresses_updated_at
  BEFORE UPDATE ON public.addresses
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS trg_orders_updated_at ON public.orders;
CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE OR REPLACE FUNCTION public.sync_order_format_flags()
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

DROP TRIGGER IF EXISTS trg_sync_order_format_flags ON public.orders;
CREATE TRIGGER trg_sync_order_format_flags
  BEFORE INSERT OR UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.sync_order_format_flags();

-- 12. Enable Row-Level Security
ALTER TABLE public.users              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otps               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.read_progress      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_books      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hard_copy_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_logs     ENABLE ROW LEVEL SECURITY;

-- 13. Seed Baseline Inventory
INSERT INTO public.hard_copy_inventory (book_id, sku, title, series, grade_class, stock_quantity, low_stock_threshold, is_in_stock)
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

INSERT INTO public.inventory_logs (book_id, change_amount, remaining_stock, reason)
SELECT book_id, stock_quantity, stock_quantity, 'Initial Baseline Stock'
FROM public.hard_copy_inventory
ON CONFLICT DO NOTHING;


-- ── PART 3: WACRM SCHEMA & CROSS-SCHEMA SYNC TRIGGER ─────────

-- 1. Create Dedicated Schema for WhatsApp CRM
CREATE SCHEMA IF NOT EXISTS wacrm;

-- 2. Configure PostgREST & Supabase Permissions
GRANT USAGE ON SCHEMA wacrm TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA wacrm TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA wacrm TO postgres, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA wacrm TO postgres, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA wacrm GRANT ALL ON TABLES TO postgres, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA wacrm GRANT ALL ON SEQUENCES TO postgres, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA wacrm GRANT ALL ON ROUTINES TO postgres, service_role;

-- 3. Cross-Schema Contact Sync Trigger
CREATE OR REPLACE FUNCTION public.sync_belesu_user_to_crm()
RETURNS TRIGGER AS $$
DECLARE
  v_table_exists BOOLEAN;
  v_phone_formatted TEXT;
BEGIN
  -- Verify if wacrm.contacts table exists
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'wacrm' AND table_name = 'contacts'
  ) INTO v_table_exists;

  IF NOT v_table_exists THEN
    RETURN NEW;
  END IF;

  -- Normalize phone to +91XXXXXXXXXX
  IF NEW.phone ~ '^\+91' THEN
    v_phone_formatted := NEW.phone;
  ELSIF NEW.phone ~ '^91\d{10}$' THEN
    v_phone_formatted := '+' || NEW.phone;
  ELSE
    v_phone_formatted := '+91' || regexp_replace(NEW.phone, '\D', '', 'g');
  END IF;

  -- Upsert customer contact into WACRM
  EXECUTE '
    INSERT INTO wacrm.contacts (phone, name, email, created_at, updated_at)
    VALUES ($1, $2, $3, NOW(), NOW())
    ON CONFLICT (phone) DO UPDATE
    SET name = COALESCE(NULLIF(EXCLUDED.name, ''''), wacrm.contacts.name),
        email = COALESCE(EXCLUDED.email, wacrm.contacts.email),
        updated_at = NOW();
  ' USING v_phone_formatted, COALESCE(NULLIF(NEW.name, ''), 'Customer'), NEW.email;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_sync_belesu_user_to_crm ON public.users;

CREATE TRIGGER trg_sync_belesu_user_to_crm
AFTER INSERT OR UPDATE OF name, email ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.sync_belesu_user_to_crm();
