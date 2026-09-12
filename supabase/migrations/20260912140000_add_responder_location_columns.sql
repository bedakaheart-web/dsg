-- Migration: live responder location columns on profiles
-- Deploy with: npx supabase db push
-- (or paste into the Supabase SQL Editor and run once)
--
-- Written by navigator.geolocation watchPosition in the Dispatch view
-- (throttled client-side: only on significant movement / interval).
-- All columns nullable so pre-existing rows are unaffected.

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_lat DOUBLE PRECISION;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_lng DOUBLE PRECISION;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_heading DOUBLE PRECISION;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_speed DOUBLE PRECISION;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location_updated_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_profiles_location_updated
  ON profiles (location_updated_at DESC);

COMMENT ON COLUMN profiles.last_lat IS
  'Last broadcast device latitude from the responder Dispatch view.';
COMMENT ON COLUMN profiles.last_lng IS
  'Last broadcast device longitude from the responder Dispatch view.';
COMMENT ON COLUMN profiles.location_updated_at IS
  'When last_lat/last_lng were last written.';
