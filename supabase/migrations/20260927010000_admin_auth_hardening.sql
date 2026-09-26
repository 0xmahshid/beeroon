-- Admin authentication hardening.
-- Only users whose Supabase Auth app_metadata contains {"role":"admin"}
-- may read or mutate moderation data.
create or replace function public.is_admin()
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

drop policy if exists "admin read all businesses" on public.businesses;
drop policy if exists "admin insert businesses" on public.businesses;
drop policy if exists "admin update businesses" on public.businesses;
drop policy if exists "admin delete businesses" on public.businesses;

create policy "admin read all businesses" on public.businesses
  for select to authenticated using (public.is_admin());
create policy "admin insert businesses" on public.businesses
  for insert to authenticated with check (public.is_admin());
create policy "admin update businesses" on public.businesses
  for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "admin delete businesses" on public.businesses
  for delete to authenticated using (public.is_admin());

drop policy if exists "admin read online shop details" on public.online_shop_details;
drop policy if exists "admin insert online shop details" on public.online_shop_details;
drop policy if exists "admin update online shop details" on public.online_shop_details;
drop policy if exists "admin delete online shop details" on public.online_shop_details;

create policy "admin read online shop details" on public.online_shop_details
  for select to authenticated using (public.is_admin());
create policy "admin insert online shop details" on public.online_shop_details
  for insert to authenticated with check (public.is_admin());
create policy "admin update online shop details" on public.online_shop_details
  for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "admin delete online shop details" on public.online_shop_details
  for delete to authenticated using (public.is_admin());
