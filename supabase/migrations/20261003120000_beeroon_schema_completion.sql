-- Complete production schema required by the current Beeroon app.
-- Deliberately excludes businesses_seed.sql sample business INSERTs.

ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS image_url text,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS verified_at timestamptz,
  ADD COLUMN IF NOT EXISTS short_description text,
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS website_url text;

CREATE OR REPLACE FUNCTION public.trigger_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_businesses_updated_at ON public.businesses;
CREATE TRIGGER set_businesses_updated_at
  BEFORE UPDATE ON public.businesses
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

ALTER TABLE public.analytics_events
  ADD COLUMN IF NOT EXISTS search_id uuid,
  ADD COLUMN IF NOT EXISTS anonymous_session_id uuid;

ALTER TABLE public.analytics_events
  DROP CONSTRAINT IF EXISTS analytics_events_event_name_check;
ALTER TABLE public.analytics_events
  ADD CONSTRAINT analytics_events_event_name_check
  CHECK (event_name IN (
    'search', 'view_business', 'click_call', 'click_whatsapp',
    'click_directions', 'click_website', 'search_no_results',
    'call', 'directions', 'profile_view', 'whatsapp', 'website'
  ));

CREATE INDEX IF NOT EXISTS analytics_events_search_id_idx
  ON public.analytics_events (search_id) WHERE search_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS analytics_events_anonymous_session_idx
  ON public.analytics_events (anonymous_session_id, created_at DESC)
  WHERE anonymous_session_id IS NOT NULL;

ALTER TABLE public.business_reports
  ADD COLUMN IF NOT EXISTS page_source text;

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin read analytics events" ON public.analytics_events;
CREATE POLICY "admin read analytics events"
  ON public.analytics_events FOR SELECT TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "admin read business reports" ON public.business_reports;
CREATE POLICY "admin read business reports"
  ON public.business_reports FOR SELECT TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "admin update business reports" ON public.business_reports;
CREATE POLICY "admin update business reports"
  ON public.business_reports FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'business-images', 'business-images', true, 5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
SET public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public read business images" ON storage.objects;
CREATE POLICY "Public read business images"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'business-images');

DROP POLICY IF EXISTS "Public upload business images" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload business images" ON storage.objects;
CREATE POLICY "Admin upload business images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'business-images' AND public.is_admin());

DROP POLICY IF EXISTS "Authenticated update business images" ON storage.objects;
DROP POLICY IF EXISTS "Admin update business images" ON storage.objects;
CREATE POLICY "Admin update business images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'business-images' AND public.is_admin())
  WITH CHECK (bucket_id = 'business-images' AND public.is_admin());

DROP POLICY IF EXISTS "Admin delete business images" ON storage.objects;
CREATE POLICY "Admin delete business images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'business-images' AND public.is_admin());
