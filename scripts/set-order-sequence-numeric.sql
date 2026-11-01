-- ============================================================
-- Configure Pure Numeric Order Numbers Starting at 23401
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/sjqccpysjxkmnfttoqgf/sql/new
-- ============================================================

-- 1. Redefine generate_order_number() to return pure numeric string without 'BLS-'
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT
LANGUAGE sql
AS $$
  SELECT nextval('public.order_number_seq')::TEXT;
$$;

-- 2. Restart sequence at 23401 (so the next real order is 23401)
ALTER SEQUENCE public.order_number_seq RESTART WITH 23401;

-- 3. Verify next number
SELECT public.generate_order_number();

