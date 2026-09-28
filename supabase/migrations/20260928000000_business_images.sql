-- Business card images: a fixed 16:9 presentation with public read access.
alter table public.businesses add column if not exists image_url text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('business-images', 'business-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = true, file_size_limit = 5242880, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read business images" on storage.objects;
create policy "Public read business images" on storage.objects for select to public using (bucket_id = 'business-images');
drop policy if exists "Public upload business images" on storage.objects;
create policy "Public upload business images" on storage.objects for insert to anon, authenticated with check (bucket_id = 'business-images');

drop policy if exists "Authenticated update business images" on storage.objects;
create policy "Authenticated update business images" on storage.objects for update to authenticated using (bucket_id = 'business-images') with check (bucket_id = 'business-images');