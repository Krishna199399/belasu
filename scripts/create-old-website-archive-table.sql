-- ============================================================
-- Dedicated Historical Archive Table for Old Website Orders
-- Table: public.old_website_orders_archive
-- Run in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/sjqccpysjxkmnfttoqgf/sql/new
-- ============================================================

CREATE TABLE IF NOT EXISTS public.old_website_orders_archive (
  id                     BIGSERIAL PRIMARY KEY,
  order_number           TEXT NOT NULL,
  order_status           TEXT,
  order_date             TIMESTAMPTZ,
  first_name             TEXT,
  last_name              TEXT,
  customer_name          TEXT,
  address                TEXT,
  city                   TEXT,
  state                  TEXT,
  postcode               TEXT,
  email                  TEXT,
  phone                  TEXT,
  clean_phone            TEXT,
  payment_method         TEXT,
  order_subtotal_amount  NUMERIC(10,2) DEFAULT 0,
  shipping_method        TEXT,
  order_shipping_amount  NUMERIC(10,2) DEFAULT 0,
  order_refund_amount    NUMERIC(10,2) DEFAULT 0,
  order_total_amount     NUMERIC(10,2) DEFAULT 0,
  order_total_tax_amount NUMERIC(10,2) DEFAULT 0,
  sku                    TEXT,
  item_number            INTEGER,
  item_name              TEXT,
  quantity               INTEGER DEFAULT 1,
  item_cost              NUMERIC(10,2) DEFAULT 0,
  imported_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_archive_order_num ON public.old_website_orders_archive(order_number);
CREATE INDEX IF NOT EXISTS idx_archive_clean_phone ON public.old_website_orders_archive(clean_phone);
CREATE INDEX IF NOT EXISTS idx_archive_sku ON public.old_website_orders_archive(sku);
