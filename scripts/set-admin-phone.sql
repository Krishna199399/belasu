-- ============================================================
-- Belesu · Set Admin Mobile Number
-- Run this in your Supabase Pro SQL Editor to make any phone an admin
-- ============================================================

INSERT INTO public.users (phone, name, is_admin)
VALUES ('1234567891', 'Master Admin', true)
ON CONFLICT (phone) DO UPDATE
SET is_admin = true,
    name = COALESCE(NULLIF(public.users.name, ''), 'Master Admin'),
    updated_at = NOW();

-- Verify
SELECT id, phone, name, is_admin FROM public.users WHERE phone = '1234567891';
