-- Beeroon (بیرون) — Supabase schema
create extension if not exists "uuid-ossp";

create table cities (
  id text primary key,
  name text not null,
  slug text unique not null,
  active boolean not null default true
);

create table categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  icon text
);

create table subcategories (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references categories(id) on delete cascade,
  name text not null,
  slug text not null
);

create table businesses (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  city_id text references cities(id) default 'mashhad',
  business_type text not null default 'physical' check (business_type in ('physical','online_shop')),
  category_id uuid references categories(id),
  subcategory_id uuid references subcategories(id),
  address text,
  lat double precision,
  lng double precision,
  phone text,
  instagram text,
  telegram text,
  bale text,
  whatsapp text,
  neshan text,
  hours text,
  price_tier int check (price_tier in (1,2,3)),
  is_supporter boolean not null default false,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);

-- Run these two statements separately on an existing Supabase project.
alter table businesses add column if not exists bale text;
alter table businesses add column if not exists neshan text;

insert into cities (id, name, slug, active) values
  ('mashhad', 'مشهد', 'mashhad', true),
  ('tehran', 'تهران', 'tehran', true),
  ('karaj', 'کرج', 'karaj', true),
  ('isfahan', 'اصفهان', 'isfahan', true),
  ('shiraz', 'شیراز', 'shiraz', true),
  ('tabriz', 'تبریز', 'tabriz', true),
  ('ahvaz', 'اهواز', 'ahvaz', true),
  ('qom', 'قم', 'qom', true),
  ('kermanshah', 'کرمانشاه', 'kermanshah', true),
  ('urmia', 'ارومیه', 'urmia', true),
  ('rasht', 'رشت', 'rasht', true),
  ('zahedan', 'زاهدان', 'zahedan', true),
  ('kerman', 'کرمان', 'kerman', true),
  ('yazd', 'یزد', 'yazd', true),
  ('ardabil', 'اردبیل', 'ardabil', true),
  ('bandar-abbas', 'بندرعباس', 'bandar-abbas', true),
  ('arak', 'اراک', 'arak', true),
  ('zanjan', 'زنجان', 'zanjan', true),
  ('sanandaj', 'سنندج', 'sanandaj', true),
  ('khorramabad', 'خرم‌آباد', 'khorramabad', true),
  ('sari', 'ساری', 'sari', true),
  ('gorgan', 'گرگان', 'gorgan', true),
  ('qazvin', 'قزوین', 'qazvin', true),
  ('bojnurd', 'بجنورد', 'bojnurd', true),
  ('birjand', 'بیرجند', 'birjand', true),
  ('ilam', 'ایلام', 'ilam', true),
  ('bushehr', 'بوشهر', 'bushehr', true),
  ('yasuj', 'یاسوج', 'yasuj', true),
  ('shahrekord', 'شهرکرد', 'shahrekord', true),
  ('semnan', 'سمنان', 'semnan', true)
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  active = excluded.active;

insert into categories (name, slug, icon) values
  ('غذا و نوشیدنی', 'food', '🍽️'),
  ('خرید و فروشگاه', 'shopping', '🛍️'),
  ('مد و پوشاک', 'fashion', '👗'),
  ('زیبایی', 'beauty', '✂️'),
  ('سلامت و درمان', 'health', '⚕️'),
  ('آموزش', 'education', '🎓'),
  ('خانه و دکوراسیون', 'home', '⌂'),
  ('خودرو و حمل‌ونقل', 'automotive', '🚗'),
  ('سفر و اقامت', 'travel', '✈️'),
  ('ورزش', 'sport', '🏃'),
  ('هنر و فرهنگ', 'culture', '🎨'),
  ('خدمات فنی', 'technical', '🔧'),
  ('کسب‌وکار و بازاریابی', 'business', '◈'),
  ('فناوری', 'technology', '⌘'),
  ('مالی و حسابداری', 'finance', '₿'),
  ('حقوقی', 'legal', '§'),
  ('املاک و ساختمان', 'real-estate', '⌂'),
  ('مراسم و رویداد', 'events', '✦'),
  ('کودک و خانواده', 'family', '♡'),
  ('حیوانات خانگی', 'pets', '♧'),
  ('کشاورزی', 'agriculture', '♧'),
  ('صنعت و تولید', 'industry', '▦'),
  ('رسانه و چاپ', 'media', '▤'),
  ('نظافت و خدمات منزل', 'cleaning', '✧')
on conflict (slug) do nothing;

insert into subcategories (category_id, name, slug)
select id, 'کافه', 'cafe' from categories where slug = 'food'
on conflict do nothing;
insert into subcategories (category_id, name, slug)
select id, 'رستوران', 'restaurant' from categories where slug = 'food'
on conflict do nothing;
insert into subcategories (category_id, name, slug)
select id, 'دیجیتال مارکتینگ', 'digital-marketing' from categories where slug = 'business'
on conflict do nothing;
insert into subcategories (category_id, name, slug)
select id, 'طراحی سایت', 'web-design' from categories where slug = 'business'
on conflict do nothing;
insert into subcategories (category_id, name, slug)
select id, 'تعمیرات موبایل', 'mobile-repair' from categories where slug = 'technology'
on conflict do nothing;
insert into subcategories (category_id, name, slug)
select id, 'پزشک', 'doctor' from categories where slug = 'health'
on conflict do nothing;

alter table cities enable row level security;
alter table categories enable row level security;
alter table subcategories enable row level security;
alter table businesses enable row level security;

create policy "public read cities" on cities for select using (true);
create policy "public read categories" on categories for select using (true);
create policy "public read subcategories" on subcategories for select using (true);
create policy "public read approved businesses" on businesses for select using (status = 'approved');
create policy "public insert pending business" on businesses for insert to public with check (status = 'pending');
create policy "admin read all businesses" on businesses for select to authenticated using (true);
create policy "admin insert businesses" on businesses for insert to authenticated with check (true);
create policy "admin update businesses" on businesses for update to authenticated using (true);
create policy "admin delete businesses" on businesses for delete to authenticated using (true);

-- Online-shop registrations stay separate from physical-business fields.
alter table businesses add column if not exists business_type text;
update businesses set business_type = 'physical' where business_type is null;
alter table businesses alter column business_type set default 'physical';
alter table businesses alter column business_type set not null;
do $$
begin
  alter table businesses add constraint businesses_business_type_check check (business_type in ('physical','online_shop'));
exception when duplicate_object then null;
end $$;

create table if not exists online_shop_details (
  business_id uuid primary key references businesses(id) on delete cascade,
  website_url text,
  sales_type text not null check (sales_type in ('retail','wholesale','both')),
  shipping_area text not null,
  shipping_methods text[] not null default '{}',
  payment_methods text[] not null default '{}',
  specialty_category text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists businesses_business_type_idx on businesses(business_type);
create index if not exists online_shop_details_sales_type_idx on online_shop_details(sales_type);

alter table online_shop_details enable row level security;
drop policy if exists "public read approved online shop details" on online_shop_details;
create policy "public read approved online shop details" on online_shop_details
  for select using (exists (
    select 1 from businesses
    where businesses.id = online_shop_details.business_id
      and businesses.status = 'approved'
  ));
drop policy if exists "admin read online shop details" on online_shop_details;
create policy "admin read online shop details" on online_shop_details
  for select to authenticated using (true);
drop policy if exists "admin insert online shop details" on online_shop_details;
create policy "admin insert online shop details" on online_shop_details
  for insert to authenticated with check (true);
drop policy if exists "admin update online shop details" on online_shop_details;
create policy "admin update online shop details" on online_shop_details
  for update to authenticated using (true);
drop policy if exists "admin delete online shop details" on online_shop_details;
create policy "admin delete online shop details" on online_shop_details
  for delete to authenticated using (true);

drop policy if exists "public insert pending business" on businesses;
create policy "public insert pending business" on businesses
  for insert to public with check (status = 'pending' and business_type = 'physical');

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
  p_specialty_category text
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_business_id uuid;
begin
  if coalesce(array_length(p_shipping_methods, 1), 0) = 0 then
    raise exception 'حداقل یک روش ارسال را انتخاب کنید';
  end if;
  if coalesce(array_length(p_payment_methods, 1), 0) = 0 then
    raise exception 'حداقل یک روش پرداخت را انتخاب کنید';
  end if;

  insert into businesses (name, city_id, phone, instagram, business_type, status)
  values (
    nullif(trim(p_name), ''),
    coalesce(nullif(trim(p_city_id), ''), 'mashhad'),
    nullif(trim(p_phone), ''),
    nullif(trim(p_instagram), ''),
    'online_shop',
    'pending'
  )
  returning id into v_business_id;

  insert into online_shop_details (
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

grant execute on function public.submit_online_shop(text, text, text, text, text, text, text, text[], text[], text) to anon, authenticated;
