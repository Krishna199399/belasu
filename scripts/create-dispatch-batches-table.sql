-- Migration: Create dispatch_batches table for Belesu Packing & Dispatch System
-- Allows tracking, archiving, and re-downloading Word (.docx) label sheets.

CREATE TABLE IF NOT EXISTS dispatch_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_name TEXT NOT NULL,                     -- e.g. "Order Id-15-Nov-26-23472-23476.docx"
  start_order_number TEXT NOT NULL,             -- e.g. "23472"
  end_order_number TEXT NOT NULL,               -- e.g. "23476"
  order_count INTEGER NOT NULL DEFAULT 0,
  order_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  order_numbers JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_by_phone TEXT,
  created_by_name TEXT,
  status TEXT NOT NULL DEFAULT 'printed',        -- 'printed' | 'packed' | 'dispatched'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for speedy chronological sorting of batches
CREATE INDEX IF NOT EXISTS idx_dispatch_batches_created_at ON dispatch_batches(created_at DESC);

-- Optional columns on orders to track print & dispatch status
ALTER TABLE orders ADD COLUMN IF NOT EXISTS is_printed BOOLEAN DEFAULT FALSE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS printed_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS dispatch_batch_name TEXT;
