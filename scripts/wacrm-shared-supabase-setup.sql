-- ============================================================
-- Belesu × WACRM: Shared Supabase Database Setup
-- 
-- Option A: Single Supabase Project with Isolated Schemas
-- Run this in your Supabase Dashboard:
-- https://supabase.com/dashboard/project/duoyukgcdchnzyqtsbzo/sql/new
-- ============================================================

-- ── 1. Create Dedicated Schema for WhatsApp CRM ──────────────
CREATE SCHEMA IF NOT EXISTS wacrm;

-- ── 2. Configure PostgREST & Supabase Permissions ────────────
GRANT USAGE ON SCHEMA wacrm TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA wacrm TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA wacrm TO postgres, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA wacrm TO postgres, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA wacrm GRANT ALL ON TABLES TO postgres, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA wacrm GRANT ALL ON SEQUENCES TO postgres, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA wacrm GRANT ALL ON ROUTINES TO postgres, service_role;

-- ── 3. Cross-Schema Automatic Contact Sync Trigger ───────────
-- Automatically syncs every new or updated customer from
-- public.users directly into wacrm.contacts.
-- If wacrm.contacts does not exist yet (before WACRM migrations),
-- this function safely exits without failing user registration.

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
    -- Never block Belesu user registration if CRM sync encounters an issue
    RAISE WARNING 'WACRM contact sync notice: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger cleanly
DROP TRIGGER IF EXISTS trg_sync_belesu_user_to_crm ON public.users;

CREATE TRIGGER trg_sync_belesu_user_to_crm
AFTER INSERT OR UPDATE OF name, email ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.sync_belesu_user_to_crm();
