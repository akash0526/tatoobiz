-- =============================================
-- TATTOO BIZ BUTWAL — ADMIN CONTROLS MIGRATION
-- Run once in: Supabase Dashboard -> SQL Editor (after supabase-schema.sql)
--
-- What this adds:
--   1. admin_users   — allowlist of Supabase Auth users allowed to manage the site
--   2. is_admin()    — helper used by RLS policies and the server-side API guard
--   3. site_settings — key/value store for every editable piece of site copy,
--                      contact details, social links and stats
--   4. Tightened RLS — only allowlisted admins can write; signing up does NOT
--                      grant admin rights anymore.
-- =============================================

-- -----------------------------------------------
-- 1. Admin allowlist
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- An admin may read the allowlist (so the app can see its own row).
-- No INSERT/UPDATE/DELETE policies: admins are managed from the SQL editor only.
DROP POLICY IF EXISTS "Admins read admin list" ON admin_users;
CREATE POLICY "Admins read admin list" ON admin_users FOR SELECT
  USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid());
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- -----------------------------------------------
-- 2. Site settings (editable from /admin/dashboard/settings)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read settings" ON site_settings;
CREATE POLICY "Public can read settings" ON site_settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins manage settings" ON site_settings;
CREATE POLICY "Admins manage settings" ON site_settings FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Default values (the app falls back to these in lib/settings.ts too)
INSERT INTO site_settings (key, value) VALUES
  ('studio', '{
    "name": "Tattoo Biz Butwal",
    "tagline": "Where Art Meets Skin — Sacred Stories Inked for Eternity",
    "location": "B.P. Chowk, Butwal, Nepal",
    "phone": "071-590044",
    "whatsappDisplay": "+977 9857089950",
    "whatsappNumber": "9779857089950",
    "email": "tattoobizbutwal@gmail.com",
    "founded": 2016
  }'::jsonb),
  ('social', '{
    "instagram": "@tattoobizbutwal",
    "facebook": "/tattoobizbutwal",
    "tiktok": "@tattoobizbutwal"
  }'::jsonb),
  ('stats', '{
    "years": "8+",
    "clients": "500+",
    "googleRating": 4.5,
    "artists": 3
  }'::jsonb),
  ('home', '{
    "aboutText": "Since 2016, Tattoo Biz has been the premier destination for sacred, meaningful tattoos in Nepal. We specialize in Hindu mythology, mandalas, and fine line work — creating timeless art on skin.",
    "aboutBadgeTitle": "NEPAL TATTOO CONVENTION",
    "aboutBadgeSubtitle": "Featured Artist"
  }'::jsonb),
  ('about', '{
    "paragraph1": "Tattoo Biz Butwal was founded in 2016 by Bijay with a simple vision: to create a space where sacred art and personal expression meet on the skin.",
    "paragraph2": "What started as a small studio in B.P. Chowk has grown into one of Nepal’s most respected tattoo destinations — known for its dedication to hygiene, artistry, and respect for traditional and spiritual iconography."
  }'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- -----------------------------------------------
-- 3. Replace the "any logged-in user" policies with admin-only policies
-- -----------------------------------------------
DROP POLICY IF EXISTS "Auth users manage gallery" ON gallery_items;
DROP POLICY IF EXISTS "Auth users manage artists" ON artists;
DROP POLICY IF EXISTS "Auth users manage services" ON services;
DROP POLICY IF EXISTS "Auth users manage bookings" ON bookings;
DROP POLICY IF EXISTS "Auth users manage testimonials" ON testimonials;

DROP POLICY IF EXISTS "Admins manage gallery" ON gallery_items;
CREATE POLICY "Admins manage gallery" ON gallery_items FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins manage artists" ON artists;
CREATE POLICY "Admins manage artists" ON artists FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins manage services" ON services;
CREATE POLICY "Admins manage services" ON services FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins manage bookings" ON bookings;
CREATE POLICY "Admins manage bookings" ON bookings FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins manage testimonials" ON testimonials;
CREATE POLICY "Admins manage testimonials" ON testimonials FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Admins also need to see unapproved testimonials and inactive artists/services
DROP POLICY IF EXISTS "Admins view all testimonials" ON testimonials;
CREATE POLICY "Admins view all testimonials" ON testimonials FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins view all artists" ON artists;
CREATE POLICY "Admins view all artists" ON artists FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins view all services" ON services;
CREATE POLICY "Admins view all services" ON services FOR SELECT
  USING (public.is_admin());

-- -----------------------------------------------
-- 4. Make your admin account (run AFTER creating the user in Supabase Auth)
-- -----------------------------------------------
-- Replace the email with the owner's login email, then run:
--
-- INSERT INTO admin_users (user_id, email)
-- SELECT id, email FROM auth.users WHERE email = 'owner@example.com'
-- ON CONFLICT (user_id) DO NOTHING;
