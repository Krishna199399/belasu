-- ==============================================================================
-- Migration: Create abandoned_carts table for Belesu Bookstore
-- Execute in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/sjqccpysjxkmnfttoqgf/sql/new
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.abandoned_carts (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID REFERENCES public.users(id) ON DELETE SET NULL,
  session_id            TEXT NOT NULL,
  customer_phone        TEXT NOT NULL,
  customer_name         TEXT NOT NULL DEFAULT 'Customer',
  customer_email        TEXT,
  
  -- Cart items array: [{ id, title, price, quantity, productType, coverImage, sku }]
  cart_items            JSONB NOT NULL DEFAULT '[]'::jsonb,
  item_count            INTEGER NOT NULL DEFAULT 1,
  subtotal              NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  shipping_fee          NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  grand_total           NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  
  -- Lifecycle Status: 'active' | 'abandoned' | 'recovered' | 'expired'
  status                TEXT NOT NULL DEFAULT 'abandoned',
  recovery_url          TEXT NOT NULL,
  
  -- Recovery communication tracking
  whatsapp_sent_count   INTEGER NOT NULL DEFAULT 0,
  last_whatsapp_sent_at TIMESTAMPTZ,
  recovered_order_id    UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  
  -- Timestamps
  last_active_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure unique session_id for upserting cart state
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'abandoned_carts_session_id_key'
  ) THEN
    ALTER TABLE public.abandoned_carts ADD CONSTRAINT abandoned_carts_session_id_key UNIQUE (session_id);
  END IF;
END $$;

-- High-performance query indexes
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_phone ON public.abandoned_carts(customer_phone);
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_status ON public.abandoned_carts(status);
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_last_active ON public.abandoned_carts(last_active_at DESC);
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_created ON public.abandoned_carts(created_at DESC);

-- Enable RLS
ALTER TABLE public.abandoned_carts ENABLE ROW LEVEL SECURITY;

-- Allow Service Role full control
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Service role full access on abandoned_carts'
  ) THEN
    CREATE POLICY "Service role full access on abandoned_carts"
      ON public.abandoned_carts
      FOR ALL
      USING (TRUE)
      WITH CHECK (TRUE);
  END IF;
END $$;
