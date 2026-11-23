-- ============================================================================
-- Belesu Packing & Dispatch System — migration
-- Run once in the Supabase SQL editor. Safe to re-run (idempotent).
--
-- NOTE: `dispatch_batches` already exists in production (created by the earlier
-- scripts/create-dispatch-batches-table.sql attempt) but the `orders` columns were
-- never added. This script brings both up to the required shape.
-- ============================================================================

-- 1. Batch archive: one row per downloaded Word (.docx) dispatch sheet
CREATE TABLE IF NOT EXISTS public.dispatch_batches (
  id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_name         TEXT        NOT NULL,              -- e.g. "Order Id-23-Nov-26-23472-23490 (15 orders).docx"
  start_order_number TEXT        NOT NULL,
  end_order_number   TEXT        NOT NULL,
  order_count        INTEGER     NOT NULL DEFAULT 0,
  order_ids          JSONB       NOT NULL DEFAULT '[]'::jsonb,
  order_numbers      JSONB       NOT NULL DEFAULT '[]'::jsonb,
  created_by_phone   TEXT,
  created_by_name    TEXT,
  status             TEXT        NOT NULL DEFAULT 'printed',
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_at         TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.dispatch_batches ADD COLUMN IF NOT EXISTS total_books INTEGER NOT NULL DEFAULT 0;
-- Orders inside the requested range that were NOT printed, with the reason
-- e.g. [{"orderNumber":"23475","reason":"Cancelled"}]
ALTER TABLE public.dispatch_batches ADD COLUMN IF NOT EXISTS skipped JSONB NOT NULL DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS idx_dispatch_batches_created_at ON public.dispatch_batches(created_at DESC);

-- 2. Print tracking on orders
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS is_printed        BOOLEAN     NOT NULL DEFAULT FALSE;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS printed_at        TIMESTAMPTZ;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS dispatch_batch_id UUID REFERENCES public.dispatch_batches(id) ON DELETE SET NULL;

-- 3. Numeric order sequence. order_number is TEXT, so "100000" < "23472" when compared
--    as text. All range filters and sorting in the dispatch portal use this column instead.
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_seq BIGINT
  GENERATED ALWAYS AS (NULLIF(regexp_replace(order_number, '\D', '', 'g'), '')::BIGINT) STORED;

CREATE INDEX IF NOT EXISTS idx_orders_order_seq ON public.orders(order_seq);
CREATE INDEX IF NOT EXISTS idx_orders_dispatch_queue
  ON public.orders(is_printed, order_seq)
  WHERE has_physical_books = TRUE;

-- 4. Refresh PostgREST schema cache so the API sees the new columns immediately
NOTIFY pgrst, 'reload schema';

-- ============================================================================
-- 5. ONE-TIME BACKFILL (edit, then run separately)
--
-- Every existing order starts as "not printed", so the "To Print" queue would show
-- all historical orders that were already shipped by hand. Set the cutoff to the
-- LAST order number that has already been packed/shipped, then run:
--
-- UPDATE public.orders
--    SET is_printed = TRUE
--  WHERE has_physical_books = TRUE
--    AND is_printed = FALSE
--    AND order_seq <= 23500;          -- <-- change to your last shipped order number
-- ============================================================================
