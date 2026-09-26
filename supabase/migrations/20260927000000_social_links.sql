-- Beeroon: persist all business social links and update online-shop submissions.
-- Safe to run against an existing Supabase database.

alter table public.businesses
  add column if not exists social_links jsonb;

update public.businesses
set social_links = jsonb_strip_nulls(
  coalesce(social_links, '{}'::jsonb) || jsonb_build_object(
    'instagram', nullif(trim(instagram), ''),
    'telegram', nullif(trim(telegram), ''),
    'bale', nullif(trim(bale), ''),
    'whatsapp', nullif(trim(whatsapp), '')
  )
)
where social_links is null
   or instagram is not null
   or telegram is not null
   or bale is not null
   or whatsapp is not null;

alter table public.businesses
  alter column social_links set default '{}'::jsonb,
  alter column social_links set not null;

create index if not exists businesses_social_links_gin_idx
  on public.businesses using gin (social_links);

drop function if exists public.submit_online_shop(text, text, text, text, text, text, text, text[], text[], text);

create or replace function public.submit_online_shop(
  p_name text,
  p_phone text,
  p_instagram text,
  p_city_id text,
  p_website_url text,
  p_sales_type text,
  p_shipping_area text,
  p_shipping_methods text[],
  p_payment_methods text[],
  p_specialty_category text,
  p_social_links jsonb
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_business_id uuid;
  v_social_links jsonb := coalesce(p_social_links, '{}'::jsonb);
begin
  if coalesce(array_length(p_shipping_methods, 1), 0) = 0 then
    raise exception 'حداقل یک روش ارسال را انتخاب کنید';
  end if;
  if coalesce(array_length(p_payment_methods, 1), 0) = 0 then
    raise exception 'حداقل یک روش پرداخت را انتخاب کنید';
  end if;

  insert into public.businesses (
    name, city_id, phone, instagram, telegram, bale, whatsapp,
    social_links, business_type, status
  )
  values (
    nullif(trim(p_name), ''),
    coalesce(nullif(trim(p_city_id), ''), 'mashhad'),
    nullif(trim(p_phone), ''),
    nullif(trim(coalesce(v_social_links->>'instagram', p_instagram)), ''),
    nullif(trim(v_social_links->>'telegram'), ''),
    nullif(trim(v_social_links->>'bale'), ''),
    nullif(trim(v_social_links->>'whatsapp'), ''),
    jsonb_strip_nulls(v_social_links),
    'online_shop',
    'pending'
  )
  returning id into v_business_id;

  insert into public.online_shop_details (
    business_id, website_url, sales_type, shipping_area,
    shipping_methods, payment_methods, specialty_category
  ) values (
    v_business_id,
    nullif(trim(p_website_url), ''),
    p_sales_type,
    nullif(trim(p_shipping_area), ''),
    p_shipping_methods,
    p_payment_methods,
    nullif(trim(p_specialty_category), '')
  );

  return v_business_id;
end;
$$;

grant execute on function public.submit_online_shop(text, text, text, text, text, text, text, text[], text[], text, jsonb)
  to anon, authenticated;

-- Security hardening for public submission access.
drop policy if exists "public read approved businesses" on public.businesses;
create policy "public read approved businesses"
  on public.businesses for select to anon
  using (status = 'approved');

drop policy if exists "public insert pending business" on public.businesses;
create policy "public insert pending business"
  on public.businesses for insert to anon
  with check (status = 'pending' and business_type = 'physical');

drop policy if exists "public read approved online shop details" on public.online_shop_details;
create policy "public read approved online shop details"
  on public.online_shop_details for select to anon
  using (
    exists (
      select 1 from public.businesses
      where businesses.id = online_shop_details.business_id
        and businesses.status = 'approved'
    )
  );

create index if not exists businesses_category_id_idx on public.businesses (category_id);
create index if not exists businesses_city_id_idx on public.businesses (city_id);
create index if not exists businesses_subcategory_id_idx on public.businesses (subcategory_id);
create index if not exists subcategories_category_id_idx on public.subcategories (category_id);

revoke execute on function public.submit_online_shop(text, text, text, text, text, text, text, text[], text[], text, jsonb)
  from public, authenticated;
grant execute on function public.submit_online_shop(text, text, text, text, text, text, text, text[], text[], text, jsonb)
  to anon;

create or replace function public.submit_online_shop(
  p_name text,
  p_phone text,
  p_instagram text,
  p_city_id text,
  p_website_url text,
  p_sales_type text,
  p_shipping_area text,
  p_shipping_methods text[],
  p_payment_methods text[],
  p_specialty_category text,
  p_social_links jsonb
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_business_id uuid;
  v_social_links jsonb;
begin
  v_social_links := jsonb_strip_nulls(jsonb_build_object(
    'instagram', nullif(trim(coalesce(p_social_links->>'instagram', p_instagram, '')), ''),
    'telegram', nullif(trim(coalesce(p_social_links->>'telegram', '')), ''),
    'whatsapp', nullif(trim(coalesce(p_social_links->>'whatsapp', '')), ''),
    'bale', nullif(trim(coalesce(p_social_links->>'bale', '')), ''),
    'eitaa', nullif(trim(coalesce(p_social_links->>'eitaa', '')), ''),
    'rubika', nullif(trim(coalesce(p_social_links->>'rubika', '')), ''),
    'soroush', nullif(trim(coalesce(p_social_links->>'soroush', '')), ''),
    'tiktok', nullif(trim(coalesce(p_social_links->>'tiktok', '')), ''),
    'youtube', nullif(trim(coalesce(p_social_links->>'youtube', '')), ''),
    'linkedin', nullif(trim(coalesce(p_social_links->>'linkedin', '')), ''),
    'facebook', nullif(trim(coalesce(p_social_links->>'facebook', '')), ''),
    'x', nullif(trim(coalesce(p_social_links->>'x', '')), ''),
    'aparat', nullif(trim(coalesce(p_social_links->>'aparat', '')), '')
  ));

  if coalesce(array_length(p_shipping_methods, 1), 0) = 0 then
    raise exception 'حداقل یک روش ارسال را انتخاب کنید';
  end if;
  if coalesce(array_length(p_payment_methods, 1), 0) = 0 then
    raise exception 'حداقل یک روش پرداخت را انتخاب کنید';
  end if;

  insert into public.businesses (
    name, city_id, phone, instagram, telegram, bale, whatsapp,
    social_links, business_type, status
  )
  values (
    nullif(trim(p_name), ''),
    coalesce(nullif(trim(p_city_id), ''), 'mashhad'),
    nullif(trim(p_phone), ''),
    v_social_links->>'instagram',
    v_social_links->>'telegram',
    v_social_links->>'bale',
    v_social_links->>'whatsapp',
    v_social_links,
    'online_shop',
    'pending'
  )
  returning id into v_business_id;

  insert into public.online_shop_details (
    business_id, website_url, sales_type, shipping_area,
    shipping_methods, payment_methods, specialty_category
  ) values (
    v_business_id,
    nullif(trim(p_website_url), ''),
    p_sales_type,
    nullif(trim(p_shipping_area), ''),
    p_shipping_methods,
    p_payment_methods,
    nullif(trim(p_specialty_category), '')
  );

  return v_business_id;
end;
$$;

revoke execute on function public.submit_online_shop(text, text, text, text, text, text, text, text[], text[], text, jsonb)
  from public, authenticated;
grant execute on function public.submit_online_shop(text, text, text, text, text, text, text, text[], text[], text, jsonb)
  to anon;
