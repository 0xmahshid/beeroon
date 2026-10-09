-- Add Hamedan as a selectable city. Neighborhood-specific records are not needed
-- for city-wide business discovery.
INSERT INTO public.cities (id, name, slug, active)
VALUES ('hamadan', 'همدان', 'hamadan', true)
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name, slug = EXCLUDED.slug, active = EXCLUDED.active;
