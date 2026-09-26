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


-- Complete directory migration: keep Supabase in sync with the full seed directory.
insert into categories (name, slug, icon) values
  ('غذا و نوشیدنی', 'food', '🍽️'),
  ('خرید و فروشگاه', 'shopping', '🛍️'),
  ('مد و پوشاک', 'fashion', '👗'),
  ('زیبایی و مراقبت', 'beauty', '💄'),
  ('سلامت و درمان', 'health', '🩺'),
  ('آموزش و مهارت', 'education', '🎓'),
  ('خانه و دکوراسیون', 'home', '🛋️'),
  ('خودرو و حمل‌ونقل', 'automotive', '🚗'),
  ('سفر و اقامت', 'travel', '✈️'),
  ('ورزش و تفریح', 'sport', '🏃'),
  ('هنر و فرهنگ', 'culture', '🎨'),
  ('خدمات فنی', 'technical', '🔧'),
  ('کسب‌وکار و بازاریابی', 'business', '📣'),
  ('فناوری', 'technology', '💻'),
  ('مالی و حسابداری', 'finance', '💳'),
  ('حقوقی', 'legal', '⚖️'),
  ('املاک و ساختمان', 'real-estate', '🏠'),
  ('مراسم و رویداد', 'events', '🎉'),
  ('کودک و خانواده', 'family', '🧸'),
  ('حیوانات خانگی', 'pets', '🐾'),
  ('کشاورزی و دامپروری', 'agriculture', '🌱'),
  ('صنعت و تولید', 'industry', '🏭'),
  ('رسانه و چاپ', 'media', '📰'),
  ('نظافت و خدمات منزل', 'cleaning', '✨'),
  ('مهاجرت و ویزا', 'immigration', '🌍'),
  ('کاریابی و منابع انسانی', 'jobs-hr', '👥'),
  ('باربری و لجستیک', 'logistics', '📦'),
  ('عمده‌فروشی و بازرگانی', 'wholesale', '🏪'),
  ('خدمات دولتی و اداری', 'government', '🏛️'),
  ('امنیت و حفاظتی', 'security', '🛡️'),
  ('اجتماعی و مذهبی', 'social-religious', '🤝'),
  ('محیط‌زیست و بازیافت', 'environment', '♻️'),
  ('عروس و داماد', 'bridal', '💍'),
  ('تجهیزات پزشکی', 'medical-equipment', '⚕️'),
  ('بانک و پرداخت', 'banking', '🏦'),
  ('ترجمه و زبان', 'translation', '🗣️'),
  ('دفاتر کار و خدمات سازمانی', 'office-services', '🏢'),
  ('خدمات شهری و عمومی', 'public-services', '🚌'),
  ('انرژی و تأسیسات حیاتی', 'utilities', '⚡'),
  ('تامین و توزیع', 'supply', '🚚'),
  ('فروشگاه‌های آنلاین', 'online-shops', '🛒')
on conflict (slug) do update set name = excluded.name, icon = excluded.icon;

insert into subcategories (category_id, name, slug)
select c.id, 'کافه', 'cafe' from categories c
where c.slug = 'food'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'cafe');
insert into subcategories (category_id, name, slug)
select c.id, 'رستوران', 'restaurant' from categories c
where c.slug = 'food'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'restaurant');
insert into subcategories (category_id, name, slug)
select c.id, 'فست‌فود', 'fast-food' from categories c
where c.slug = 'food'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'fast-food');
insert into subcategories (category_id, name, slug)
select c.id, 'ساندویچی', 'sandwich' from categories c
where c.slug = 'food'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'sandwich');
insert into subcategories (category_id, name, slug)
select c.id, 'بیکری و شیرینی', 'bakery' from categories c
where c.slug = 'food'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'bakery');
insert into subcategories (category_id, name, slug)
select c.id, 'کترینگ', 'catering' from categories c
where c.slug = 'food'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'catering');
insert into subcategories (category_id, name, slug)
select c.id, 'آبمیوه و بستنی', 'juice-icecream' from categories c
where c.slug = 'food'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'juice-icecream');
insert into subcategories (category_id, name, slug)
select c.id, 'غذای سنتی', 'traditional-food' from categories c
where c.slug = 'food'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'traditional-food');
insert into subcategories (category_id, name, slug)
select c.id, 'پیتزا', 'pizza' from categories c
where c.slug = 'food'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'pizza');
insert into subcategories (category_id, name, slug)
select c.id, 'رستوران ملل', 'international-food' from categories c
where c.slug = 'food'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'international-food');
insert into subcategories (category_id, name, slug)
select c.id, 'قنادی', 'confectionery' from categories c
where c.slug = 'food'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'confectionery');
insert into subcategories (category_id, name, slug)
select c.id, 'سوپرمارکت', 'supermarket' from categories c
where c.slug = 'shopping'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'supermarket');
insert into subcategories (category_id, name, slug)
select c.id, 'فروشگاه زنجیره‌ای', 'chain-store' from categories c
where c.slug = 'shopping'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'chain-store');
insert into subcategories (category_id, name, slug)
select c.id, 'طلافروشی و جواهر', 'gold-jewelry' from categories c
where c.slug = 'shopping'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'gold-jewelry');
insert into subcategories (category_id, name, slug)
select c.id, 'لوازم خانگی', 'home-appliances' from categories c
where c.slug = 'shopping'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'home-appliances');
insert into subcategories (category_id, name, slug)
select c.id, 'لوازم آرایشی', 'cosmetics' from categories c
where c.slug = 'shopping'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'cosmetics');
insert into subcategories (category_id, name, slug)
select c.id, 'کتاب‌فروشی', 'bookstore' from categories c
where c.slug = 'shopping'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'bookstore');
insert into subcategories (category_id, name, slug)
select c.id, 'لوازم تحریر', 'stationery' from categories c
where c.slug = 'shopping'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'stationery');
insert into subcategories (category_id, name, slug)
select c.id, 'هدیه و کادو', 'gift' from categories c
where c.slug = 'shopping'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'gift');
insert into subcategories (category_id, name, slug)
select c.id, 'گل‌فروشی', 'flower-shop' from categories c
where c.slug = 'shopping'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'flower-shop');
insert into subcategories (category_id, name, slug)
select c.id, 'فروشگاه کودک', 'baby-store' from categories c
where c.slug = 'shopping'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'baby-store');
insert into subcategories (category_id, name, slug)
select c.id, 'لوازم ورزشی', 'sports-store' from categories c
where c.slug = 'shopping'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'sports-store');
insert into subcategories (category_id, name, slug)
select c.id, 'فروشگاه ساز و آلات موسیقی', 'music-store' from categories c
where c.slug = 'shopping'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'music-store');
insert into subcategories (category_id, name, slug)
select c.id, 'لباس زنانه', 'womens-clothing' from categories c
where c.slug = 'fashion'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'womens-clothing');
insert into subcategories (category_id, name, slug)
select c.id, 'لباس مردانه', 'mens-clothing' from categories c
where c.slug = 'fashion'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'mens-clothing');
insert into subcategories (category_id, name, slug)
select c.id, 'لباس کودک', 'kids-clothing' from categories c
where c.slug = 'fashion'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'kids-clothing');
insert into subcategories (category_id, name, slug)
select c.id, 'کیف و کفش', 'bags-shoes' from categories c
where c.slug = 'fashion'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'bags-shoes');
insert into subcategories (category_id, name, slug)
select c.id, 'پارچه', 'fabric' from categories c
where c.slug = 'fashion'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'fabric');
insert into subcategories (category_id, name, slug)
select c.id, 'خیاطی', 'tailoring' from categories c
where c.slug = 'fashion'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'tailoring');
insert into subcategories (category_id, name, slug)
select c.id, 'مزون عروس', 'bridal-boutique' from categories c
where c.slug = 'fashion'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'bridal-boutique');
insert into subcategories (category_id, name, slug)
select c.id, 'شال و روسری', 'scarves' from categories c
where c.slug = 'fashion'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'scarves');
insert into subcategories (category_id, name, slug)
select c.id, 'لباس زیر', 'underwear' from categories c
where c.slug = 'fashion'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'underwear');
insert into subcategories (category_id, name, slug)
select c.id, 'بوتیک', 'boutique' from categories c
where c.slug = 'fashion'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'boutique');
insert into subcategories (category_id, name, slug)
select c.id, 'لباس ورزشی', 'sportswear' from categories c
where c.slug = 'fashion'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'sportswear');
insert into subcategories (category_id, name, slug)
select c.id, 'آرایشگاه زنانه', 'womens-salon' from categories c
where c.slug = 'beauty'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'womens-salon');
insert into subcategories (category_id, name, slug)
select c.id, 'آرایشگاه مردانه', 'mens-salon' from categories c
where c.slug = 'beauty'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'mens-salon');
insert into subcategories (category_id, name, slug)
select c.id, 'میکاپ آرتیست', 'makeup-artist' from categories c
where c.slug = 'beauty'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'makeup-artist');
insert into subcategories (category_id, name, slug)
select c.id, 'کراتین مو', 'hair-keratin' from categories c
where c.slug = 'beauty'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'hair-keratin');
insert into subcategories (category_id, name, slug)
select c.id, 'متخصص رنگ مو', 'hair-color' from categories c
where c.slug = 'beauty'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'hair-color');
insert into subcategories (category_id, name, slug)
select c.id, 'ناخن‌کار', 'nail-salon' from categories c
where c.slug = 'beauty'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'nail-salon');
insert into subcategories (category_id, name, slug)
select c.id, 'مژه و ابرو', 'lashes-brows' from categories c
where c.slug = 'beauty'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'lashes-brows');
insert into subcategories (category_id, name, slug)
select c.id, 'پاکسازی پوست', 'skin-care' from categories c
where c.slug = 'beauty'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'skin-care');
insert into subcategories (category_id, name, slug)
select c.id, 'اسپا و ماساژ', 'spa-massage' from categories c
where c.slug = 'beauty'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'spa-massage');
insert into subcategories (category_id, name, slug)
select c.id, 'آرایش عروس', 'bridal-makeup' from categories c
where c.slug = 'beauty'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'bridal-makeup');
insert into subcategories (category_id, name, slug)
select c.id, 'لیزر و زیبایی', 'laser-beauty' from categories c
where c.slug = 'beauty'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'laser-beauty');
insert into subcategories (category_id, name, slug)
select c.id, 'پزشک عمومی', 'general-doctor' from categories c
where c.slug = 'health'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'general-doctor');
insert into subcategories (category_id, name, slug)
select c.id, 'پزشک متخصص', 'specialist-doctor' from categories c
where c.slug = 'health'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'specialist-doctor');
insert into subcategories (category_id, name, slug)
select c.id, 'دندان‌پزشکی', 'dentistry' from categories c
where c.slug = 'health'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'dentistry');
insert into subcategories (category_id, name, slug)
select c.id, 'داروخانه', 'pharmacy' from categories c
where c.slug = 'health'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'pharmacy');
insert into subcategories (category_id, name, slug)
select c.id, 'آزمایشگاه', 'laboratory' from categories c
where c.slug = 'health'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'laboratory');
insert into subcategories (category_id, name, slug)
select c.id, 'فیزیوتراپی', 'physiotherapy' from categories c
where c.slug = 'health'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'physiotherapy');
insert into subcategories (category_id, name, slug)
select c.id, 'روان‌شناسی', 'psychology' from categories c
where c.slug = 'health'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'psychology');
insert into subcategories (category_id, name, slug)
select c.id, 'تغذیه و رژیم', 'nutrition' from categories c
where c.slug = 'health'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'nutrition');
insert into subcategories (category_id, name, slug)
select c.id, 'چشم‌پزشکی', 'ophthalmology' from categories c
where c.slug = 'health'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'ophthalmology');
insert into subcategories (category_id, name, slug)
select c.id, 'مامایی', 'midwifery' from categories c
where c.slug = 'health'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'midwifery');
insert into subcategories (category_id, name, slug)
select c.id, 'گفتاردرمانی', 'speech-therapy' from categories c
where c.slug = 'health'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'speech-therapy');
insert into subcategories (category_id, name, slug)
select c.id, 'پرستاری در منزل', 'home-nursing' from categories c
where c.slug = 'health'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'home-nursing');
insert into subcategories (category_id, name, slug)
select c.id, 'آموزش زبان', 'language' from categories c
where c.slug = 'education'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'language');
insert into subcategories (category_id, name, slug)
select c.id, 'کنکور و تقویتی', 'exam-prep' from categories c
where c.slug = 'education'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'exam-prep');
insert into subcategories (category_id, name, slug)
select c.id, 'معلم خصوصی', 'private-teacher' from categories c
where c.slug = 'education'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'private-teacher');
insert into subcategories (category_id, name, slug)
select c.id, 'معلم ابتدایی', 'elementary-teacher' from categories c
where c.slug = 'education'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'elementary-teacher');
insert into subcategories (category_id, name, slug)
select c.id, 'تدریس دانشگاهی', 'university-tutor' from categories c
where c.slug = 'education'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'university-tutor');
insert into subcategories (category_id, name, slug)
select c.id, 'موسیقی', 'music-class' from categories c
where c.slug = 'education'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'music-class');
insert into subcategories (category_id, name, slug)
select c.id, 'هنر', 'art-class' from categories c
where c.slug = 'education'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'art-class');
insert into subcategories (category_id, name, slug)
select c.id, 'برنامه‌نویسی', 'coding' from categories c
where c.slug = 'education'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'coding');
insert into subcategories (category_id, name, slug)
select c.id, 'مهارت‌های شغلی', 'career-skills' from categories c
where c.slug = 'education'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'career-skills');
insert into subcategories (category_id, name, slug)
select c.id, 'آموزش رانندگی', 'driving-school' from categories c
where c.slug = 'education'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'driving-school');
insert into subcategories (category_id, name, slug)
select c.id, 'مهدکودک', 'kindergarten' from categories c
where c.slug = 'education'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'kindergarten');
insert into subcategories (category_id, name, slug)
select c.id, 'آموزش آنلاین', 'online-course' from categories c
where c.slug = 'education'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'online-course');
insert into subcategories (category_id, name, slug)
select c.id, 'مبلمان', 'furniture' from categories c
where c.slug = 'home'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'furniture');
insert into subcategories (category_id, name, slug)
select c.id, 'دکوراسیون داخلی', 'interior-design' from categories c
where c.slug = 'home'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'interior-design');
insert into subcategories (category_id, name, slug)
select c.id, 'لوازم خانگی', 'home-appliances' from categories c
where c.slug = 'home'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'home-appliances');
insert into subcategories (category_id, name, slug)
select c.id, 'دکور و اکسسوری', 'decor' from categories c
where c.slug = 'home'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'decor');
insert into subcategories (category_id, name, slug)
select c.id, 'کابینت', 'cabinetry' from categories c
where c.slug = 'home'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'cabinetry');
insert into subcategories (category_id, name, slug)
select c.id, 'گل و گیاه', 'plants' from categories c
where c.slug = 'home'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'plants');
insert into subcategories (category_id, name, slug)
select c.id, 'پرده', 'curtains' from categories c
where c.slug = 'home'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'curtains');
insert into subcategories (category_id, name, slug)
select c.id, 'فرش و موکت', 'carpet' from categories c
where c.slug = 'home'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'carpet');
insert into subcategories (category_id, name, slug)
select c.id, 'نورپردازی', 'lighting' from categories c
where c.slug = 'home'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'lighting');
insert into subcategories (category_id, name, slug)
select c.id, 'تشک و کالای خواب', 'mattress' from categories c
where c.slug = 'home'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'mattress');
insert into subcategories (category_id, name, slug)
select c.id, 'آشپزخانه', 'kitchen' from categories c
where c.slug = 'home'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'kitchen');
insert into subcategories (category_id, name, slug)
select c.id, 'تعمیر خودرو', 'car-repair' from categories c
where c.slug = 'automotive'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'car-repair');
insert into subcategories (category_id, name, slug)
select c.id, 'کارواش', 'car-wash' from categories c
where c.slug = 'automotive'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'car-wash');
insert into subcategories (category_id, name, slug)
select c.id, 'لاستیک و رینگ', 'tires' from categories c
where c.slug = 'automotive'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'tires');
insert into subcategories (category_id, name, slug)
select c.id, 'قطعات خودرو', 'auto-parts' from categories c
where c.slug = 'automotive'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'auto-parts');
insert into subcategories (category_id, name, slug)
select c.id, 'کرایه خودرو', 'car-rental' from categories c
where c.slug = 'automotive'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'car-rental');
insert into subcategories (category_id, name, slug)
select c.id, 'موتورسیکلت', 'motorcycle' from categories c
where c.slug = 'automotive'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'motorcycle');
insert into subcategories (category_id, name, slug)
select c.id, 'باطری‌سازی', 'battery' from categories c
where c.slug = 'automotive'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'battery');
insert into subcategories (category_id, name, slug)
select c.id, 'نقاشی خودرو', 'auto-paint' from categories c
where c.slug = 'automotive'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'auto-paint');
insert into subcategories (category_id, name, slug)
select c.id, 'آموزش رانندگی', 'driving-school' from categories c
where c.slug = 'automotive'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'driving-school');
insert into subcategories (category_id, name, slug)
select c.id, 'معاینه فنی', 'technical-inspection' from categories c
where c.slug = 'automotive'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'technical-inspection');
insert into subcategories (category_id, name, slug)
select c.id, 'یدک‌کش', 'tow-truck' from categories c
where c.slug = 'automotive'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'tow-truck');
insert into subcategories (category_id, name, slug)
select c.id, 'مکانیک سیار', 'mobile-mechanic' from categories c
where c.slug = 'automotive'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'mobile-mechanic');
insert into subcategories (category_id, name, slug)
select c.id, 'هتل', 'hotel' from categories c
where c.slug = 'travel'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'hotel');
insert into subcategories (category_id, name, slug)
select c.id, 'اقامتگاه بوم‌گردی', 'eco-lodge' from categories c
where c.slug = 'travel'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'eco-lodge');
insert into subcategories (category_id, name, slug)
select c.id, 'آژانس مسافرتی', 'travel-agency' from categories c
where c.slug = 'travel'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'travel-agency');
insert into subcategories (category_id, name, slug)
select c.id, 'تور', 'tour' from categories c
where c.slug = 'travel'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'tour');
insert into subcategories (category_id, name, slug)
select c.id, 'بلیط', 'tickets' from categories c
where c.slug = 'travel'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'tickets');
insert into subcategories (category_id, name, slug)
select c.id, 'راهنمای گردشگری', 'tour-guide' from categories c
where c.slug = 'travel'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'tour-guide');
insert into subcategories (category_id, name, slug)
select c.id, 'رزرو اقامت', 'accommodation' from categories c
where c.slug = 'travel'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'accommodation');
insert into subcategories (category_id, name, slug)
select c.id, 'کمپینگ', 'camping' from categories c
where c.slug = 'travel'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'camping');
insert into subcategories (category_id, name, slug)
select c.id, 'ویلا و سوئیت', 'villa-rental' from categories c
where c.slug = 'travel'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'villa-rental');
insert into subcategories (category_id, name, slug)
select c.id, 'ترانسفر فرودگاهی', 'airport-transfer' from categories c
where c.slug = 'travel'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'airport-transfer');
insert into subcategories (category_id, name, slug)
select c.id, 'باشگاه بدنسازی', 'gym' from categories c
where c.slug = 'sport'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'gym');
insert into subcategories (category_id, name, slug)
select c.id, 'سوارکاری', 'equestrian' from categories c
where c.slug = 'sport'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'equestrian');
insert into subcategories (category_id, name, slug)
select c.id, 'فوتبال', 'football' from categories c
where c.slug = 'sport'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'football');
insert into subcategories (category_id, name, slug)
select c.id, 'یوگا', 'yoga' from categories c
where c.slug = 'sport'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'yoga');
insert into subcategories (category_id, name, slug)
select c.id, 'شنا', 'swimming' from categories c
where c.slug = 'sport'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'swimming');
insert into subcategories (category_id, name, slug)
select c.id, 'لوازم کوهنوردی', 'mountaineering' from categories c
where c.slug = 'sport'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'mountaineering');
insert into subcategories (category_id, name, slug)
select c.id, 'رزمی', 'martial-arts' from categories c
where c.slug = 'sport'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'martial-arts');
insert into subcategories (category_id, name, slug)
select c.id, 'تنیس', 'tennis' from categories c
where c.slug = 'sport'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'tennis');
insert into subcategories (category_id, name, slug)
select c.id, 'دوچرخه‌سواری', 'cycling' from categories c
where c.slug = 'sport'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'cycling');
insert into subcategories (category_id, name, slug)
select c.id, 'ورزش بانوان', 'women-sport' from categories c
where c.slug = 'sport'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'women-sport');
insert into subcategories (category_id, name, slug)
select c.id, 'بولینگ و بیلیارد', 'bowling-billiards' from categories c
where c.slug = 'sport'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'bowling-billiards');
insert into subcategories (category_id, name, slug)
select c.id, 'گالری', 'gallery' from categories c
where c.slug = 'culture'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'gallery');
insert into subcategories (category_id, name, slug)
select c.id, 'عکاسی', 'photography' from categories c
where c.slug = 'culture'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'photography');
insert into subcategories (category_id, name, slug)
select c.id, 'سینما و تئاتر', 'cinema-theater' from categories c
where c.slug = 'culture'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'cinema-theater');
insert into subcategories (category_id, name, slug)
select c.id, 'کتاب و نشر', 'publishing' from categories c
where c.slug = 'culture'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'publishing');
insert into subcategories (category_id, name, slug)
select c.id, 'صنایع‌دستی', 'handicraft' from categories c
where c.slug = 'culture'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'handicraft');
insert into subcategories (category_id, name, slug)
select c.id, 'موسیقی', 'music' from categories c
where c.slug = 'culture'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'music');
insert into subcategories (category_id, name, slug)
select c.id, 'نقاشی', 'painting' from categories c
where c.slug = 'culture'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'painting');
insert into subcategories (category_id, name, slug)
select c.id, 'مجسمه‌سازی', 'sculpture' from categories c
where c.slug = 'culture'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'sculpture');
insert into subcategories (category_id, name, slug)
select c.id, 'آموزشگاه هنر', 'art-school' from categories c
where c.slug = 'culture'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'art-school');
insert into subcategories (category_id, name, slug)
select c.id, 'تأسیسات', 'installations' from categories c
where c.slug = 'technical'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'installations');
insert into subcategories (category_id, name, slug)
select c.id, 'برق‌کاری', 'electrician' from categories c
where c.slug = 'technical'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'electrician');
insert into subcategories (category_id, name, slug)
select c.id, 'لوله‌کشی', 'plumbing' from categories c
where c.slug = 'technical'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'plumbing');
insert into subcategories (category_id, name, slug)
select c.id, 'نجاری', 'carpentry' from categories c
where c.slug = 'technical'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'carpentry');
insert into subcategories (category_id, name, slug)
select c.id, 'تعمیرات لوازم', 'appliance-repair' from categories c
where c.slug = 'technical'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'appliance-repair');
insert into subcategories (category_id, name, slug)
select c.id, 'قفل و کلید', 'locksmith' from categories c
where c.slug = 'technical'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'locksmith');
insert into subcategories (category_id, name, slug)
select c.id, 'جوشکاری', 'welding' from categories c
where c.slug = 'technical'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'welding');
insert into subcategories (category_id, name, slug)
select c.id, 'تعمیر کولر', 'air-conditioning' from categories c
where c.slug = 'technical'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'air-conditioning');
insert into subcategories (category_id, name, slug)
select c.id, 'شیشه‌بری', 'glasswork' from categories c
where c.slug = 'technical'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'glasswork');
insert into subcategories (category_id, name, slug)
select c.id, 'نقاشی ساختمان', 'building-painting' from categories c
where c.slug = 'technical'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'building-painting');
insert into subcategories (category_id, name, slug)
select c.id, 'نصب آسانسور', 'elevator-installation' from categories c
where c.slug = 'technical'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'elevator-installation');
insert into subcategories (category_id, name, slug)
select c.id, 'دیجیتال مارکتینگ', 'digital-marketing' from categories c
where c.slug = 'business'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'digital-marketing');
insert into subcategories (category_id, name, slug)
select c.id, 'مدیریت اینستاگرام', 'instagram-management' from categories c
where c.slug = 'business'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'instagram-management');
insert into subcategories (category_id, name, slug)
select c.id, 'تولید محتوا', 'content-production' from categories c
where c.slug = 'business'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'content-production');
insert into subcategories (category_id, name, slug)
select c.id, 'سئو', 'seo' from categories c
where c.slug = 'business'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'seo');
insert into subcategories (category_id, name, slug)
select c.id, 'برندسازی', 'branding' from categories c
where c.slug = 'business'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'branding');
insert into subcategories (category_id, name, slug)
select c.id, 'طراحی سایت', 'web-design' from categories c
where c.slug = 'business'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'web-design');
insert into subcategories (category_id, name, slug)
select c.id, 'تبلیغات', 'advertising' from categories c
where c.slug = 'business'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'advertising');
insert into subcategories (category_id, name, slug)
select c.id, 'مشاوره کسب‌وکار', 'business-consulting' from categories c
where c.slug = 'business'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'business-consulting');
insert into subcategories (category_id, name, slug)
select c.id, 'ادمین شبکه‌های اجتماعی', 'social-media-manager' from categories c
where c.slug = 'business'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'social-media-manager');
insert into subcategories (category_id, name, slug)
select c.id, 'طراحی گرافیک', 'graphic-design' from categories c
where c.slug = 'business'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'graphic-design');
insert into subcategories (category_id, name, slug)
select c.id, 'بازاریابی تلفنی', 'telemarketing' from categories c
where c.slug = 'business'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'telemarketing');
insert into subcategories (category_id, name, slug)
select c.id, 'روابط عمومی', 'public-relations' from categories c
where c.slug = 'business'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'public-relations');
insert into subcategories (category_id, name, slug)
select c.id, 'فروشگاه موبایل', 'mobile-store' from categories c
where c.slug = 'technology'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'mobile-store');
insert into subcategories (category_id, name, slug)
select c.id, 'تعمیرات موبایل', 'mobile-repair' from categories c
where c.slug = 'technology'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'mobile-repair');
insert into subcategories (category_id, name, slug)
select c.id, 'خدمات کامپیوتری', 'computer-services' from categories c
where c.slug = 'technology'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'computer-services');
insert into subcategories (category_id, name, slug)
select c.id, 'نرم‌افزار', 'software' from categories c
where c.slug = 'technology'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'software');
insert into subcategories (category_id, name, slug)
select c.id, 'امنیت شبکه', 'cybersecurity' from categories c
where c.slug = 'technology'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'cybersecurity');
insert into subcategories (category_id, name, slug)
select c.id, 'هوش مصنوعی', 'ai' from categories c
where c.slug = 'technology'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'ai');
insert into subcategories (category_id, name, slug)
select c.id, 'فروشگاه لوازم جانبی', 'accessories' from categories c
where c.slug = 'technology'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'accessories');
insert into subcategories (category_id, name, slug)
select c.id, 'دوربین مداربسته', 'cctv' from categories c
where c.slug = 'technology'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'cctv');
insert into subcategories (category_id, name, slug)
select c.id, 'گیمینگ', 'gaming' from categories c
where c.slug = 'technology'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'gaming');
insert into subcategories (category_id, name, slug)
select c.id, 'طراحی اپلیکیشن', 'app-development' from categories c
where c.slug = 'technology'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'app-development');
insert into subcategories (category_id, name, slug)
select c.id, 'خدمات ابری', 'cloud-services' from categories c
where c.slug = 'technology'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'cloud-services');
insert into subcategories (category_id, name, slug)
select c.id, 'حسابداری', 'accounting' from categories c
where c.slug = 'finance'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'accounting');
insert into subcategories (category_id, name, slug)
select c.id, 'حسابرسی', 'audit' from categories c
where c.slug = 'finance'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'audit');
insert into subcategories (category_id, name, slug)
select c.id, 'بیمه', 'insurance' from categories c
where c.slug = 'finance'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'insurance');
insert into subcategories (category_id, name, slug)
select c.id, 'وام و اعتبار', 'credit' from categories c
where c.slug = 'finance'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'credit');
insert into subcategories (category_id, name, slug)
select c.id, 'مشاوره مالی', 'financial-advice' from categories c
where c.slug = 'finance'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'financial-advice');
insert into subcategories (category_id, name, slug)
select c.id, 'صرافی', 'exchange' from categories c
where c.slug = 'finance'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'exchange');
insert into subcategories (category_id, name, slug)
select c.id, 'خدمات مالیاتی', 'tax' from categories c
where c.slug = 'finance'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'tax');
insert into subcategories (category_id, name, slug)
select c.id, 'کارگزاری', 'brokerage' from categories c
where c.slug = 'finance'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'brokerage');
insert into subcategories (category_id, name, slug)
select c.id, 'مشاوره سرمایه‌گذاری', 'investment' from categories c
where c.slug = 'finance'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'investment');
insert into subcategories (category_id, name, slug)
select c.id, 'اظهارنامه مالیاتی', 'tax-return' from categories c
where c.slug = 'finance'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'tax-return');
insert into subcategories (category_id, name, slug)
select c.id, 'وکیل', 'lawyer' from categories c
where c.slug = 'legal'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'lawyer');
insert into subcategories (category_id, name, slug)
select c.id, 'دفتر اسناد رسمی', 'notary' from categories c
where c.slug = 'legal'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'notary');
insert into subcategories (category_id, name, slug)
select c.id, 'مشاوره حقوقی', 'legal-consulting' from categories c
where c.slug = 'legal'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'legal-consulting');
insert into subcategories (category_id, name, slug)
select c.id, 'ثبت شرکت', 'company-registration' from categories c
where c.slug = 'legal'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'company-registration');
insert into subcategories (category_id, name, slug)
select c.id, 'داوری', 'arbitration' from categories c
where c.slug = 'legal'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'arbitration');
insert into subcategories (category_id, name, slug)
select c.id, 'مهاجرت', 'immigration' from categories c
where c.slug = 'legal'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'immigration');
insert into subcategories (category_id, name, slug)
select c.id, 'ثبت اختراع', 'patent' from categories c
where c.slug = 'legal'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'patent');
insert into subcategories (category_id, name, slug)
select c.id, 'امور خانواده', 'family-law' from categories c
where c.slug = 'legal'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'family-law');
insert into subcategories (category_id, name, slug)
select c.id, 'وکیل ملکی', 'property-law' from categories c
where c.slug = 'legal'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'property-law');
insert into subcategories (category_id, name, slug)
select c.id, 'وکیل کیفری', 'criminal-law' from categories c
where c.slug = 'legal'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'criminal-law');
insert into subcategories (category_id, name, slug)
select c.id, 'مشاور املاک', 'real-estate-agency' from categories c
where c.slug = 'real-estate'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'real-estate-agency');
insert into subcategories (category_id, name, slug)
select c.id, 'معماری', 'architecture' from categories c
where c.slug = 'real-estate'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'architecture');
insert into subcategories (category_id, name, slug)
select c.id, 'ساخت‌وساز', 'construction' from categories c
where c.slug = 'real-estate'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'construction');
insert into subcategories (category_id, name, slug)
select c.id, 'دکوراسیون', 'renovation' from categories c
where c.slug = 'real-estate'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'renovation');
insert into subcategories (category_id, name, slug)
select c.id, 'مصالح ساختمانی', 'building-materials' from categories c
where c.slug = 'real-estate'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'building-materials');
insert into subcategories (category_id, name, slug)
select c.id, 'تأسیسات ساختمان', 'building-installations' from categories c
where c.slug = 'real-estate'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'building-installations');
insert into subcategories (category_id, name, slug)
select c.id, 'اجاره ملک', 'property-rental' from categories c
where c.slug = 'real-estate'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'property-rental');
insert into subcategories (category_id, name, slug)
select c.id, 'ارزیابی ملک', 'property-valuation' from categories c
where c.slug = 'real-estate'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'property-valuation');
insert into subcategories (category_id, name, slug)
select c.id, 'پیمانکاری', 'contracting' from categories c
where c.slug = 'real-estate'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'contracting');
insert into subcategories (category_id, name, slug)
select c.id, 'مدیریت ساختمان', 'building-management' from categories c
where c.slug = 'real-estate'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'building-management');
insert into subcategories (category_id, name, slug)
select c.id, 'تشریفات', 'ceremony' from categories c
where c.slug = 'events'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'ceremony');
insert into subcategories (category_id, name, slug)
select c.id, 'تالار', 'hall' from categories c
where c.slug = 'events'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'hall');
insert into subcategories (category_id, name, slug)
select c.id, 'برگزاری نمایشگاه', 'exhibition' from categories c
where c.slug = 'events'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'exhibition');
insert into subcategories (category_id, name, slug)
select c.id, 'گل‌آرایی', 'floristry' from categories c
where c.slug = 'events'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'floristry');
insert into subcategories (category_id, name, slug)
select c.id, 'موسیقی مراسم', 'event-music' from categories c
where c.slug = 'events'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'event-music');
insert into subcategories (category_id, name, slug)
select c.id, 'عکاسی مراسم', 'event-photography' from categories c
where c.slug = 'events'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'event-photography');
insert into subcategories (category_id, name, slug)
select c.id, 'کیک و دسر مراسم', 'event-cake' from categories c
where c.slug = 'events'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'event-cake');
insert into subcategories (category_id, name, slug)
select c.id, 'اجاره تجهیزات', 'event-rental' from categories c
where c.slug = 'events'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'event-rental');
insert into subcategories (category_id, name, slug)
select c.id, 'مجری و گوینده', 'event-host' from categories c
where c.slug = 'events'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'event-host');
insert into subcategories (category_id, name, slug)
select c.id, 'مهدکودک', 'kindergarten' from categories c
where c.slug = 'family'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'kindergarten');
insert into subcategories (category_id, name, slug)
select c.id, 'اسباب‌بازی', 'toys' from categories c
where c.slug = 'family'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'toys');
insert into subcategories (category_id, name, slug)
select c.id, 'مشاوره خانواده', 'family-consulting' from categories c
where c.slug = 'family'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'family-consulting');
insert into subcategories (category_id, name, slug)
select c.id, 'لباس کودک', 'kids-fashion' from categories c
where c.slug = 'family'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'kids-fashion');
insert into subcategories (category_id, name, slug)
select c.id, 'کلاس کودک', 'kids-class' from categories c
where c.slug = 'family'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'kids-class');
insert into subcategories (category_id, name, slug)
select c.id, 'پرستاری کودک', 'childcare' from categories c
where c.slug = 'family'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'childcare');
insert into subcategories (category_id, name, slug)
select c.id, 'سیسمونی', 'baby-essentials' from categories c
where c.slug = 'family'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'baby-essentials');
insert into subcategories (category_id, name, slug)
select c.id, 'خدمات مادر و کودک', 'mother-baby' from categories c
where c.slug = 'family'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'mother-baby');
insert into subcategories (category_id, name, slug)
select c.id, 'مشاوره ازدواج', 'marriage-consulting' from categories c
where c.slug = 'family'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'marriage-consulting');
insert into subcategories (category_id, name, slug)
select c.id, 'سالمندان', 'elderly-care' from categories c
where c.slug = 'family'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'elderly-care');
insert into subcategories (category_id, name, slug)
select c.id, 'کلینیک حیوانات', 'vet' from categories c
where c.slug = 'pets'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'vet');
insert into subcategories (category_id, name, slug)
select c.id, 'پت‌شاپ', 'pet-shop' from categories c
where c.slug = 'pets'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'pet-shop');
insert into subcategories (category_id, name, slug)
select c.id, 'پانسیون حیوانات', 'pet-boarding' from categories c
where c.slug = 'pets'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'pet-boarding');
insert into subcategories (category_id, name, slug)
select c.id, 'آرایش حیوانات', 'pet-grooming' from categories c
where c.slug = 'pets'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'pet-grooming');
insert into subcategories (category_id, name, slug)
select c.id, 'غذای حیوانات', 'pet-food' from categories c
where c.slug = 'pets'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'pet-food');
insert into subcategories (category_id, name, slug)
select c.id, 'آموزش حیوانات', 'pet-training' from categories c
where c.slug = 'pets'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'pet-training');
insert into subcategories (category_id, name, slug)
select c.id, 'واکسیناسیون حیوانات', 'pet-vaccine' from categories c
where c.slug = 'pets'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'pet-vaccine');
insert into subcategories (category_id, name, slug)
select c.id, 'پرورش حیوانات', 'pet-breeding' from categories c
where c.slug = 'pets'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'pet-breeding');
insert into subcategories (category_id, name, slug)
select c.id, 'خدمات حیوانات خیابانی', 'street-animal-care' from categories c
where c.slug = 'pets'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'street-animal-care');
insert into subcategories (category_id, name, slug)
select c.id, 'نهال و گلخانه', 'nursery' from categories c
where c.slug = 'agriculture'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'nursery');
insert into subcategories (category_id, name, slug)
select c.id, 'ماشین‌آلات کشاورزی', 'farm-machinery' from categories c
where c.slug = 'agriculture'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'farm-machinery');
insert into subcategories (category_id, name, slug)
select c.id, 'محصولات ارگانیک', 'organic' from categories c
where c.slug = 'agriculture'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'organic');
insert into subcategories (category_id, name, slug)
select c.id, 'دام و طیور', 'livestock' from categories c
where c.slug = 'agriculture'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'livestock');
insert into subcategories (category_id, name, slug)
select c.id, 'خدمات باغبانی', 'gardening' from categories c
where c.slug = 'agriculture'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'gardening');
insert into subcategories (category_id, name, slug)
select c.id, 'زنبورداری', 'beekeeping' from categories c
where c.slug = 'agriculture'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'beekeeping');
insert into subcategories (category_id, name, slug)
select c.id, 'بذر و کود', 'seeds-fertilizer' from categories c
where c.slug = 'agriculture'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'seeds-fertilizer');
insert into subcategories (category_id, name, slug)
select c.id, 'فروش محصولات کشاورزی', 'farm-products' from categories c
where c.slug = 'agriculture'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'farm-products');
insert into subcategories (category_id, name, slug)
select c.id, 'دامپزشکی دام', 'farm-vet' from categories c
where c.slug = 'agriculture'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'farm-vet');
insert into subcategories (category_id, name, slug)
select c.id, 'خوراک دام', 'animal-feed' from categories c
where c.slug = 'agriculture'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'animal-feed');
insert into subcategories (category_id, name, slug)
select c.id, 'کارخانه', 'factory' from categories c
where c.slug = 'industry'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'factory');
insert into subcategories (category_id, name, slug)
select c.id, 'قطعات صنعتی', 'industrial-parts' from categories c
where c.slug = 'industry'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'industrial-parts');
insert into subcategories (category_id, name, slug)
select c.id, 'ماشین‌آلات', 'machinery' from categories c
where c.slug = 'industry'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'machinery');
insert into subcategories (category_id, name, slug)
select c.id, 'بسته‌بندی', 'packaging' from categories c
where c.slug = 'industry'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'packaging');
insert into subcategories (category_id, name, slug)
select c.id, 'مواد اولیه', 'raw-materials' from categories c
where c.slug = 'industry'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'raw-materials');
insert into subcategories (category_id, name, slug)
select c.id, 'تولید سفارشی', 'custom-production' from categories c
where c.slug = 'industry'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'custom-production');
insert into subcategories (category_id, name, slug)
select c.id, 'تجهیزات ایمنی', 'safety-equipment' from categories c
where c.slug = 'industry'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'safety-equipment');
insert into subcategories (category_id, name, slug)
select c.id, 'خدمات پیمانکاری', 'industrial-contracting' from categories c
where c.slug = 'industry'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'industrial-contracting');
insert into subcategories (category_id, name, slug)
select c.id, 'تولید مواد غذایی', 'food-manufacturing' from categories c
where c.slug = 'industry'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'food-manufacturing');
insert into subcategories (category_id, name, slug)
select c.id, 'تولید پوشاک', 'garment-manufacturing' from categories c
where c.slug = 'industry'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'garment-manufacturing');
insert into subcategories (category_id, name, slug)
select c.id, 'چاپخانه', 'printing' from categories c
where c.slug = 'media'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'printing');
insert into subcategories (category_id, name, slug)
select c.id, 'طراحی گرافیک', 'graphic-design' from categories c
where c.slug = 'media'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'graphic-design');
insert into subcategories (category_id, name, slug)
select c.id, 'خبرگزاری', 'news-agency' from categories c
where c.slug = 'media'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'news-agency');
insert into subcategories (category_id, name, slug)
select c.id, 'استودیو', 'studio' from categories c
where c.slug = 'media'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'studio');
insert into subcategories (category_id, name, slug)
select c.id, 'تبلیغات محیطی', 'outdoor-ads' from categories c
where c.slug = 'media'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'outdoor-ads');
insert into subcategories (category_id, name, slug)
select c.id, 'ترجمه', 'translation' from categories c
where c.slug = 'media'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'translation');
insert into subcategories (category_id, name, slug)
select c.id, 'تولید ویدئو', 'video-production' from categories c
where c.slug = 'media'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'video-production');
insert into subcategories (category_id, name, slug)
select c.id, 'رسانه دیجیتال', 'digital-media' from categories c
where c.slug = 'media'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'digital-media');
insert into subcategories (category_id, name, slug)
select c.id, 'چاپ سه‌بعدی', '3d-printing' from categories c
where c.slug = 'media'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = '3d-printing');
insert into subcategories (category_id, name, slug)
select c.id, 'نظافت منزل', 'home-cleaning' from categories c
where c.slug = 'cleaning'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'home-cleaning');
insert into subcategories (category_id, name, slug)
select c.id, 'قالیشویی', 'carpet-cleaning' from categories c
where c.slug = 'cleaning'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'carpet-cleaning');
insert into subcategories (category_id, name, slug)
select c.id, 'اسباب‌کشی', 'moving' from categories c
where c.slug = 'cleaning'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'moving');
insert into subcategories (category_id, name, slug)
select c.id, 'خدمات باغبانی', 'home-gardening' from categories c
where c.slug = 'cleaning'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'home-gardening');
insert into subcategories (category_id, name, slug)
select c.id, 'خدمات پرستاری', 'home-care' from categories c
where c.slug = 'cleaning'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'home-care');
insert into subcategories (category_id, name, slug)
select c.id, 'خدمات خشکشویی', 'laundry' from categories c
where c.slug = 'cleaning'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'laundry');
insert into subcategories (category_id, name, slug)
select c.id, 'مبارزه با آفات', 'pest-control' from categories c
where c.slug = 'cleaning'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'pest-control');
insert into subcategories (category_id, name, slug)
select c.id, 'تعمیرات منزل', 'home-maintenance' from categories c
where c.slug = 'cleaning'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'home-maintenance');
insert into subcategories (category_id, name, slug)
select c.id, 'خدمات اتو', 'ironing' from categories c
where c.slug = 'cleaning'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'ironing');
insert into subcategories (category_id, name, slug)
select c.id, 'شست‌وشوی مبل', 'upholstery-cleaning' from categories c
where c.slug = 'cleaning'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'upholstery-cleaning');
insert into subcategories (category_id, name, slug)
select c.id, 'مشاوره مهاجرت', 'immigration-consulting' from categories c
where c.slug = 'immigration'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'immigration-consulting');
insert into subcategories (category_id, name, slug)
select c.id, 'مهاجرت تحصیلی', 'study-abroad' from categories c
where c.slug = 'immigration'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'study-abroad');
insert into subcategories (category_id, name, slug)
select c.id, 'ویزای کاری', 'work-visa' from categories c
where c.slug = 'immigration'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'work-visa');
insert into subcategories (category_id, name, slug)
select c.id, 'ویزای توریستی', 'tourist-visa' from categories c
where c.slug = 'immigration'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'tourist-visa');
insert into subcategories (category_id, name, slug)
select c.id, 'اقامت و سرمایه‌گذاری', 'residency-investment' from categories c
where c.slug = 'immigration'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'residency-investment');
insert into subcategories (category_id, name, slug)
select c.id, 'ثبت شرکت در خارج', 'foreign-company' from categories c
where c.slug = 'immigration'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'foreign-company');
insert into subcategories (category_id, name, slug)
select c.id, 'پذیرش دانشگاه', 'university-admission' from categories c
where c.slug = 'immigration'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'university-admission');
insert into subcategories (category_id, name, slug)
select c.id, 'خدمات سفارت', 'embassy-services' from categories c
where c.slug = 'immigration'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'embassy-services');
insert into subcategories (category_id, name, slug)
select c.id, 'ترجمه مدارک مهاجرتی', 'immigration-translation' from categories c
where c.slug = 'immigration'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'immigration-translation');
insert into subcategories (category_id, name, slug)
select c.id, 'آزمون آیلتس و PTE', 'ielts-pte' from categories c
where c.slug = 'immigration'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'ielts-pte');
insert into subcategories (category_id, name, slug)
select c.id, 'شهروندی و تابعیت', 'citizenship' from categories c
where c.slug = 'immigration'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'citizenship');
insert into subcategories (category_id, name, slug)
select c.id, 'کاریابی', 'job-agency' from categories c
where c.slug = 'jobs-hr'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'job-agency');
insert into subcategories (category_id, name, slug)
select c.id, 'استخدام و جذب نیرو', 'recruitment' from categories c
where c.slug = 'jobs-hr'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'recruitment');
insert into subcategories (category_id, name, slug)
select c.id, 'مشاوره منابع انسانی', 'hr-consulting' from categories c
where c.slug = 'jobs-hr'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'hr-consulting');
insert into subcategories (category_id, name, slug)
select c.id, 'هد‌هانتینگ', 'headhunting' from categories c
where c.slug = 'jobs-hr'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'headhunting');
insert into subcategories (category_id, name, slug)
select c.id, 'مشاوره شغلی', 'career-coaching' from categories c
where c.slug = 'jobs-hr'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'career-coaching');
insert into subcategories (category_id, name, slug)
select c.id, 'رزومه و CV', 'resume-writing' from categories c
where c.slug = 'jobs-hr'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'resume-writing');
insert into subcategories (category_id, name, slug)
select c.id, 'آزمون استخدامی', 'employment-exam' from categories c
where c.slug = 'jobs-hr'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'employment-exam');
insert into subcategories (category_id, name, slug)
select c.id, 'نیروی خدماتی', 'staffing' from categories c
where c.slug = 'jobs-hr'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'staffing');
insert into subcategories (category_id, name, slug)
select c.id, 'حقوق و دستمزد', 'payroll' from categories c
where c.slug = 'jobs-hr'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'payroll');
insert into subcategories (category_id, name, slug)
select c.id, 'کارآموزی', 'internship' from categories c
where c.slug = 'jobs-hr'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'internship');
insert into subcategories (category_id, name, slug)
select c.id, 'آموزش سازمانی', 'corporate-training' from categories c
where c.slug = 'jobs-hr'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'corporate-training');
insert into subcategories (category_id, name, slug)
select c.id, 'باربری شهری', 'city-cargo' from categories c
where c.slug = 'logistics'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'city-cargo');
insert into subcategories (category_id, name, slug)
select c.id, 'پیک موتوری', 'motorcycle-delivery' from categories c
where c.slug = 'logistics'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'motorcycle-delivery');
insert into subcategories (category_id, name, slug)
select c.id, 'پیک وانت و کامیون', 'truck-delivery' from categories c
where c.slug = 'logistics'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'truck-delivery');
insert into subcategories (category_id, name, slug)
select c.id, 'اسباب‌کشی', 'moving-service' from categories c
where c.slug = 'logistics'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'moving-service');
insert into subcategories (category_id, name, slug)
select c.id, 'انبارداری', 'warehousing' from categories c
where c.slug = 'logistics'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'warehousing');
insert into subcategories (category_id, name, slug)
select c.id, 'بسته‌بندی', 'packing' from categories c
where c.slug = 'logistics'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'packing');
insert into subcategories (category_id, name, slug)
select c.id, 'حمل‌ونقل بین‌المللی', 'international-shipping' from categories c
where c.slug = 'logistics'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'international-shipping');
insert into subcategories (category_id, name, slug)
select c.id, 'ترخیص کالا', 'customs-clearance' from categories c
where c.slug = 'logistics'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'customs-clearance');
insert into subcategories (category_id, name, slug)
select c.id, 'نمایندگی پست', 'postal-agency' from categories c
where c.slug = 'logistics'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'postal-agency');
insert into subcategories (category_id, name, slug)
select c.id, 'حمل اثاثیه', 'furniture-moving' from categories c
where c.slug = 'logistics'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'furniture-moving');
insert into subcategories (category_id, name, slug)
select c.id, 'اجاره کامیون', 'truck-rental' from categories c
where c.slug = 'logistics'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'truck-rental');
insert into subcategories (category_id, name, slug)
select c.id, 'عمده‌فروشی مواد غذایی', 'food-wholesale' from categories c
where c.slug = 'wholesale'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'food-wholesale');
insert into subcategories (category_id, name, slug)
select c.id, 'عمده‌فروشی پوشاک', 'fashion-wholesale' from categories c
where c.slug = 'wholesale'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'fashion-wholesale');
insert into subcategories (category_id, name, slug)
select c.id, 'عمده‌فروشی لوازم خانگی', 'appliance-wholesale' from categories c
where c.slug = 'wholesale'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'appliance-wholesale');
insert into subcategories (category_id, name, slug)
select c.id, 'عمده‌فروشی موبایل', 'mobile-wholesale' from categories c
where c.slug = 'wholesale'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'mobile-wholesale');
insert into subcategories (category_id, name, slug)
select c.id, 'بازرگانی و واردات', 'import-trade' from categories c
where c.slug = 'wholesale'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'import-trade');
insert into subcategories (category_id, name, slug)
select c.id, 'صادرات', 'export-trade' from categories c
where c.slug = 'wholesale'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'export-trade');
insert into subcategories (category_id, name, slug)
select c.id, 'پخش و توزیع', 'distribution' from categories c
where c.slug = 'wholesale'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'distribution');
insert into subcategories (category_id, name, slug)
select c.id, 'تامین کالا', 'procurement' from categories c
where c.slug = 'wholesale'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'procurement');
insert into subcategories (category_id, name, slug)
select c.id, 'نمایندگی برند', 'brand-distribution' from categories c
where c.slug = 'wholesale'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'brand-distribution');
insert into subcategories (category_id, name, slug)
select c.id, 'بازار عمده‌فروشان', 'wholesale-market' from categories c
where c.slug = 'wholesale'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'wholesale-market');
insert into subcategories (category_id, name, slug)
select c.id, 'دفتر پیشخوان دولت', 'government-counter' from categories c
where c.slug = 'government'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'government-counter');
insert into subcategories (category_id, name, slug)
select c.id, 'خدمات الکترونیک قضایی', 'judicial-services' from categories c
where c.slug = 'government'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'judicial-services');
insert into subcategories (category_id, name, slug)
select c.id, 'پلیس +۱۰', 'police-services' from categories c
where c.slug = 'government'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'police-services');
insert into subcategories (category_id, name, slug)
select c.id, 'خدمات مالیاتی', 'government-tax' from categories c
where c.slug = 'government'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'government-tax');
insert into subcategories (category_id, name, slug)
select c.id, 'خدمات شهرداری', 'municipal-services' from categories c
where c.slug = 'government'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'municipal-services');
insert into subcategories (category_id, name, slug)
select c.id, 'ثبت احوال و شناسنامه', 'civil-registry' from categories c
where c.slug = 'government'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'civil-registry');
insert into subcategories (category_id, name, slug)
select c.id, 'خدمات گذرنامه', 'passport-services' from categories c
where c.slug = 'government'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'passport-services');
insert into subcategories (category_id, name, slug)
select c.id, 'دفتر خدمات بیمه', 'insurance-office' from categories c
where c.slug = 'government'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'insurance-office');
insert into subcategories (category_id, name, slug)
select c.id, 'خدمات پستی', 'postal-services' from categories c
where c.slug = 'government'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'postal-services');
insert into subcategories (category_id, name, slug)
select c.id, 'دفتر خدمات خودرو', 'vehicle-services' from categories c
where c.slug = 'government'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'vehicle-services');
insert into subcategories (category_id, name, slug)
select c.id, 'نگهبانی', 'guarding' from categories c
where c.slug = 'security'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'guarding');
insert into subcategories (category_id, name, slug)
select c.id, 'شرکت حفاظتی', 'security-company' from categories c
where c.slug = 'security'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'security-company');
insert into subcategories (category_id, name, slug)
select c.id, 'دوربین مداربسته', 'cctv-installation' from categories c
where c.slug = 'security'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'cctv-installation');
insert into subcategories (category_id, name, slug)
select c.id, 'دزدگیر و اعلام سرقت', 'alarm-systems' from categories c
where c.slug = 'security'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'alarm-systems');
insert into subcategories (category_id, name, slug)
select c.id, 'کنترل تردد', 'access-control' from categories c
where c.slug = 'security'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'access-control');
insert into subcategories (category_id, name, slug)
select c.id, 'گاوصندوق و قفل', 'safe-lock' from categories c
where c.slug = 'security'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'safe-lock');
insert into subcategories (category_id, name, slug)
select c.id, 'ایمنی و آتش‌نشانی', 'fire-safety' from categories c
where c.slug = 'security'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'fire-safety');
insert into subcategories (category_id, name, slug)
select c.id, 'اسکورت و بادیگارد', 'bodyguard' from categories c
where c.slug = 'security'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'bodyguard');
insert into subcategories (category_id, name, slug)
select c.id, 'حفاظت فیزیکی', 'physical-security' from categories c
where c.slug = 'security'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'physical-security');
insert into subcategories (category_id, name, slug)
select c.id, 'مشاوره امنیت', 'security-consulting' from categories c
where c.slug = 'security'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'security-consulting');
insert into subcategories (category_id, name, slug)
select c.id, 'مسجد و حسینیه', 'mosque' from categories c
where c.slug = 'social-religious'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'mosque');
insert into subcategories (category_id, name, slug)
select c.id, 'مراسم مذهبی', 'religious-ceremony' from categories c
where c.slug = 'social-religious'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'religious-ceremony');
insert into subcategories (category_id, name, slug)
select c.id, 'مدرسه علوم دینی', 'religious-school' from categories c
where c.slug = 'social-religious'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'religious-school');
insert into subcategories (category_id, name, slug)
select c.id, 'خیریه', 'charity' from categories c
where c.slug = 'social-religious'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'charity');
insert into subcategories (category_id, name, slug)
select c.id, 'موسسه نیکوکاری', 'nonprofit' from categories c
where c.slug = 'social-religious'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'nonprofit');
insert into subcategories (category_id, name, slug)
select c.id, 'وقف و امور خیریه', 'endowment' from categories c
where c.slug = 'social-religious'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'endowment');
insert into subcategories (category_id, name, slug)
select c.id, 'کلاس قرآن', 'quran-class' from categories c
where c.slug = 'social-religious'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'quran-class');
insert into subcategories (category_id, name, slug)
select c.id, 'خدمات کفن و دفن', 'funeral-services' from categories c
where c.slug = 'social-religious'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'funeral-services');
insert into subcategories (category_id, name, slug)
select c.id, 'آرامستان', 'cemetery' from categories c
where c.slug = 'social-religious'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'cemetery');
insert into subcategories (category_id, name, slug)
select c.id, 'بازیافت', 'recycling' from categories c
where c.slug = 'environment'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'recycling');
insert into subcategories (category_id, name, slug)
select c.id, 'خرید ضایعات', 'scrap' from categories c
where c.slug = 'environment'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'scrap');
insert into subcategories (category_id, name, slug)
select c.id, 'جمع‌آوری پسماند', 'waste-collection' from categories c
where c.slug = 'environment'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'waste-collection');
insert into subcategories (category_id, name, slug)
select c.id, 'تصفیه آب و فاضلاب', 'water-treatment' from categories c
where c.slug = 'environment'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'water-treatment');
insert into subcategories (category_id, name, slug)
select c.id, 'مشاوره محیط‌زیست', 'environment-consulting' from categories c
where c.slug = 'environment'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'environment-consulting');
insert into subcategories (category_id, name, slug)
select c.id, 'انرژی خورشیدی', 'solar-energy' from categories c
where c.slug = 'environment'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'solar-energy');
insert into subcategories (category_id, name, slug)
select c.id, 'فضای سبز', 'landscaping' from categories c
where c.slug = 'environment'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'landscaping');
insert into subcategories (category_id, name, slug)
select c.id, 'سم‌پاشی محیطی', 'environmental-pest-control' from categories c
where c.slug = 'environment'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'environmental-pest-control');
insert into subcategories (category_id, name, slug)
select c.id, 'پاکسازی صنعتی', 'industrial-cleaning' from categories c
where c.slug = 'environment'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'industrial-cleaning');
insert into subcategories (category_id, name, slug)
select c.id, 'لباس عروس', 'wedding-dress' from categories c
where c.slug = 'bridal'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'wedding-dress');
insert into subcategories (category_id, name, slug)
select c.id, 'کت‌وشلوار داماد', 'groom-suit' from categories c
where c.slug = 'bridal'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'groom-suit');
insert into subcategories (category_id, name, slug)
select c.id, 'مزون', 'bridal-boutique' from categories c
where c.slug = 'bridal'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'bridal-boutique');
insert into subcategories (category_id, name, slug)
select c.id, 'آرایش عروس', 'bridal-beauty' from categories c
where c.slug = 'bridal'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'bridal-beauty');
insert into subcategories (category_id, name, slug)
select c.id, 'آتلیه عروس', 'bridal-studio' from categories c
where c.slug = 'bridal'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'bridal-studio');
insert into subcategories (category_id, name, slug)
select c.id, 'دسته‌گل عروس', 'bridal-bouquet' from categories c
where c.slug = 'bridal'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'bridal-bouquet');
insert into subcategories (category_id, name, slug)
select c.id, 'کارت عروسی', 'wedding-invitation' from categories c
where c.slug = 'bridal'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'wedding-invitation');
insert into subcategories (category_id, name, slug)
select c.id, 'ماشین عروس', 'wedding-car' from categories c
where c.slug = 'bridal'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'wedding-car');
insert into subcategories (category_id, name, slug)
select c.id, 'کیک عروسی', 'wedding-cake' from categories c
where c.slug = 'bridal'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'wedding-cake');
insert into subcategories (category_id, name, slug)
select c.id, 'اجاره تجهیزات عروسی', 'wedding-rental' from categories c
where c.slug = 'bridal'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'wedding-rental');
insert into subcategories (category_id, name, slug)
select c.id, 'تجهیزات پزشکی', 'medical-devices' from categories c
where c.slug = 'medical-equipment'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'medical-devices');
insert into subcategories (category_id, name, slug)
select c.id, 'تجهیزات دندان‌پزشکی', 'dental-equipment' from categories c
where c.slug = 'medical-equipment'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'dental-equipment');
insert into subcategories (category_id, name, slug)
select c.id, 'عینک و اپتیک', 'optical' from categories c
where c.slug = 'medical-equipment'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'optical');
insert into subcategories (category_id, name, slug)
select c.id, 'سمعک', 'hearing-aid' from categories c
where c.slug = 'medical-equipment'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'hearing-aid');
insert into subcategories (category_id, name, slug)
select c.id, 'ارتوپدی فنی', 'orthopedic' from categories c
where c.slug = 'medical-equipment'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'orthopedic');
insert into subcategories (category_id, name, slug)
select c.id, 'ویلچر و تجهیزات توانبخشی', 'rehab-equipment' from categories c
where c.slug = 'medical-equipment'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'rehab-equipment');
insert into subcategories (category_id, name, slug)
select c.id, 'ملزومات مصرفی پزشکی', 'medical-consumables' from categories c
where c.slug = 'medical-equipment'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'medical-consumables');
insert into subcategories (category_id, name, slug)
select c.id, 'مکمل و ویتامین', 'supplements' from categories c
where c.slug = 'medical-equipment'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'supplements');
insert into subcategories (category_id, name, slug)
select c.id, 'اکسیژن و تجهیزات تنفسی', 'oxygen-equipment' from categories c
where c.slug = 'medical-equipment'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'oxygen-equipment');
insert into subcategories (category_id, name, slug)
select c.id, 'اجاره تجهیزات پزشکی', 'medical-rental' from categories c
where c.slug = 'medical-equipment'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'medical-rental');
insert into subcategories (category_id, name, slug)
select c.id, 'شعبه بانک', 'bank-branch' from categories c
where c.slug = 'banking'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'bank-branch');
insert into subcategories (category_id, name, slug)
select c.id, 'دستگاه خودپرداز', 'atm' from categories c
where c.slug = 'banking'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'atm');
insert into subcategories (category_id, name, slug)
select c.id, 'درگاه و کارتخوان', 'payment-terminal' from categories c
where c.slug = 'banking'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'payment-terminal');
insert into subcategories (category_id, name, slug)
select c.id, 'انتقال وجه', 'money-transfer' from categories c
where c.slug = 'banking'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'money-transfer');
insert into subcategories (category_id, name, slug)
select c.id, 'مشاوره وام', 'loan-consulting' from categories c
where c.slug = 'banking'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'loan-consulting');
insert into subcategories (category_id, name, slug)
select c.id, 'سرمایه‌گذاری', 'investment-services' from categories c
where c.slug = 'banking'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'investment-services');
insert into subcategories (category_id, name, slug)
select c.id, 'بورس و کارگزاری', 'stock-brokerage' from categories c
where c.slug = 'banking'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'stock-brokerage');
insert into subcategories (category_id, name, slug)
select c.id, 'پرداخت بین‌المللی', 'international-payment' from categories c
where c.slug = 'banking'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'international-payment');
insert into subcategories (category_id, name, slug)
select c.id, 'فین‌تک', 'fintech' from categories c
where c.slug = 'banking'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'fintech');
insert into subcategories (category_id, name, slug)
select c.id, 'ارز دیجیتال', 'digital-currency' from categories c
where c.slug = 'banking'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'digital-currency');
insert into subcategories (category_id, name, slug)
select c.id, 'ترجمه رسمی', 'official-translation' from categories c
where c.slug = 'translation'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'official-translation');
insert into subcategories (category_id, name, slug)
select c.id, 'ترجمه تخصصی', 'specialized-translation' from categories c
where c.slug = 'translation'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'specialized-translation');
insert into subcategories (category_id, name, slug)
select c.id, 'مترجم شفاهی', 'interpreter' from categories c
where c.slug = 'translation'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'interpreter');
insert into subcategories (category_id, name, slug)
select c.id, 'ترجمه همزمان', 'simultaneous-translation' from categories c
where c.slug = 'translation'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'simultaneous-translation');
insert into subcategories (category_id, name, slug)
select c.id, 'ترجمه مدارک', 'document-translation' from categories c
where c.slug = 'translation'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'document-translation');
insert into subcategories (category_id, name, slug)
select c.id, 'ویراستاری', 'editing' from categories c
where c.slug = 'translation'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'editing');
insert into subcategories (category_id, name, slug)
select c.id, 'زبان اشاره', 'sign-language' from categories c
where c.slug = 'translation'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'sign-language');
insert into subcategories (category_id, name, slug)
select c.id, 'زیرنویس و دوبله', 'subtitling' from categories c
where c.slug = 'translation'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'subtitling');
insert into subcategories (category_id, name, slug)
select c.id, 'بومی‌سازی محتوا', 'localization' from categories c
where c.slug = 'translation'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'localization');
insert into subcategories (category_id, name, slug)
select c.id, 'دفتر کار اشتراکی', 'coworking' from categories c
where c.slug = 'office-services'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'coworking');
insert into subcategories (category_id, name, slug)
select c.id, 'اجاره اتاق جلسه', 'meeting-room' from categories c
where c.slug = 'office-services'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'meeting-room');
insert into subcategories (category_id, name, slug)
select c.id, 'مرکز کسب‌وکار', 'business-center' from categories c
where c.slug = 'office-services'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'business-center');
insert into subcategories (category_id, name, slug)
select c.id, 'دفتر مجازی', 'virtual-office' from categories c
where c.slug = 'office-services'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'virtual-office');
insert into subcategories (category_id, name, slug)
select c.id, 'خدمات منشی', 'secretarial' from categories c
where c.slug = 'office-services'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'secretarial');
insert into subcategories (category_id, name, slug)
select c.id, 'اجاره سالن همایش', 'conference-hall' from categories c
where c.slug = 'office-services'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'conference-hall');
insert into subcategories (category_id, name, slug)
select c.id, 'مرکز تماس', 'call-center' from categories c
where c.slug = 'office-services'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'call-center');
insert into subcategories (category_id, name, slug)
select c.id, 'خدمات منابع اداری', 'office-admin' from categories c
where c.slug = 'office-services'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'office-admin');
insert into subcategories (category_id, name, slug)
select c.id, 'تاکسی تلفنی', 'phone-taxi' from categories c
where c.slug = 'public-services'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'phone-taxi');
insert into subcategories (category_id, name, slug)
select c.id, 'تاکسی اینترنتی', 'online-taxi' from categories c
where c.slug = 'public-services'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'online-taxi');
insert into subcategories (category_id, name, slug)
select c.id, 'سرویس مدارس', 'school-transport' from categories c
where c.slug = 'public-services'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'school-transport');
insert into subcategories (category_id, name, slug)
select c.id, 'ترانسفر فرودگاه', 'airport-transfer' from categories c
where c.slug = 'public-services'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'airport-transfer');
insert into subcategories (category_id, name, slug)
select c.id, 'اتوبوس و مینی‌بوس', 'bus-rental' from categories c
where c.slug = 'public-services'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'bus-rental');
insert into subcategories (category_id, name, slug)
select c.id, 'اجاره موتور', 'motorcycle-rental' from categories c
where c.slug = 'public-services'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'motorcycle-rental');
insert into subcategories (category_id, name, slug)
select c.id, 'خدمات حمل شهری', 'urban-transport' from categories c
where c.slug = 'public-services'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'urban-transport');
insert into subcategories (category_id, name, slug)
select c.id, 'پارکینگ', 'parking' from categories c
where c.slug = 'public-services'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'parking');
insert into subcategories (category_id, name, slug)
select c.id, 'برق اضطراری و ژنراتور', 'generator' from categories c
where c.slug = 'utilities'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'generator');
insert into subcategories (category_id, name, slug)
select c.id, 'پنل خورشیدی', 'solar-panels' from categories c
where c.slug = 'utilities'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'solar-panels');
insert into subcategories (category_id, name, slug)
select c.id, 'تأسیسات گاز', 'gas-installation' from categories c
where c.slug = 'utilities'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'gas-installation');
insert into subcategories (category_id, name, slug)
select c.id, 'پمپ و موتور آب', 'water-pump' from categories c
where c.slug = 'utilities'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'water-pump');
insert into subcategories (category_id, name, slug)
select c.id, 'تأسیسات حرارتی', 'heating' from categories c
where c.slug = 'utilities'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'heating');
insert into subcategories (category_id, name, slug)
select c.id, 'تأسیسات سرمایشی', 'cooling' from categories c
where c.slug = 'utilities'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'cooling');
insert into subcategories (category_id, name, slug)
select c.id, 'شارژر خودرو برقی', 'ev-charger' from categories c
where c.slug = 'utilities'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'ev-charger');
insert into subcategories (category_id, name, slug)
select c.id, 'فروش سوخت و گاز', 'fuel-services' from categories c
where c.slug = 'utilities'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'fuel-services');
insert into subcategories (category_id, name, slug)
select c.id, 'تامین مواد اولیه', 'raw-material-supply' from categories c
where c.slug = 'supply'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'raw-material-supply');
insert into subcategories (category_id, name, slug)
select c.id, 'تامین تجهیزات صنعتی', 'industrial-supply' from categories c
where c.slug = 'supply'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'industrial-supply');
insert into subcategories (category_id, name, slug)
select c.id, 'نمایندگی فروش', 'sales-agency' from categories c
where c.slug = 'supply'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'sales-agency');
insert into subcategories (category_id, name, slug)
select c.id, 'نمایندگی خدمات', 'service-agency' from categories c
where c.slug = 'supply'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'service-agency');
insert into subcategories (category_id, name, slug)
select c.id, 'توزیع‌کننده محلی', 'local-distributor' from categories c
where c.slug = 'supply'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'local-distributor');
insert into subcategories (category_id, name, slug)
select c.id, 'لجستیک زنجیره تامین', 'supply-chain' from categories c
where c.slug = 'supply'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'supply-chain');
insert into subcategories (category_id, name, slug)
select c.id, 'خرید سازمانی', 'corporate-procurement' from categories c
where c.slug = 'supply'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'corporate-procurement');
insert into subcategories (category_id, name, slug)
select c.id, 'تامین کالای وارداتی', 'imported-goods' from categories c
where c.slug = 'supply'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'imported-goods');
insert into subcategories (category_id, name, slug)
select c.id, 'فروشگاه اینترنتی عمومی', 'general-online-store' from categories c
where c.slug = 'online-shops'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'general-online-store');
insert into subcategories (category_id, name, slug)
select c.id, 'فروشگاه اینستاگرامی', 'instagram-shop' from categories c
where c.slug = 'online-shops'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'instagram-shop');
insert into subcategories (category_id, name, slug)
select c.id, 'آنلاین‌شاپ پوشاک', 'online-fashion' from categories c
where c.slug = 'online-shops'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'online-fashion');
insert into subcategories (category_id, name, slug)
select c.id, 'آنلاین‌شاپ لوازم آرایشی', 'online-cosmetics' from categories c
where c.slug = 'online-shops'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'online-cosmetics');
insert into subcategories (category_id, name, slug)
select c.id, 'آنلاین‌شاپ طلا و جواهر', 'online-gold-jewelry' from categories c
where c.slug = 'online-shops'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'online-gold-jewelry');
insert into subcategories (category_id, name, slug)
select c.id, 'آنلاین‌شاپ لوازم خانگی', 'online-home-appliances' from categories c
where c.slug = 'online-shops'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'online-home-appliances');
insert into subcategories (category_id, name, slug)
select c.id, 'آنلاین‌شاپ موبایل و دیجیتال', 'online-electronics' from categories c
where c.slug = 'online-shops'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'online-electronics');
insert into subcategories (category_id, name, slug)
select c.id, 'آنلاین‌شاپ مواد غذایی', 'online-grocery' from categories c
where c.slug = 'online-shops'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'online-grocery');
insert into subcategories (category_id, name, slug)
select c.id, 'آنلاین‌شاپ صنایع‌دستی', 'online-handicraft' from categories c
where c.slug = 'online-shops'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'online-handicraft');
insert into subcategories (category_id, name, slug)
select c.id, 'فروش محصولات دیجیتال', 'digital-products-store' from categories c
where c.slug = 'online-shops'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'digital-products-store');
insert into subcategories (category_id, name, slug)
select c.id, 'فروشگاه B2B', 'b2b-online-store' from categories c
where c.slug = 'online-shops'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'b2b-online-store');
insert into subcategories (category_id, name, slug)
select c.id, 'فروشگاه محلی آنلاین', 'local-online-store' from categories c
where c.slug = 'online-shops'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'local-online-store');
insert into subcategories (category_id, name, slug)
select c.id, 'فروشگاه کودک آنلاین', 'online-baby-store' from categories c
where c.slug = 'online-shops'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'online-baby-store');
insert into subcategories (category_id, name, slug)
select c.id, 'فروشگاه ورزشی آنلاین', 'online-sports-store' from categories c
where c.slug = 'online-shops'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'online-sports-store');
insert into subcategories (category_id, name, slug)
select c.id, 'کتاب‌فروشی آنلاین', 'online-bookstore' from categories c
where c.slug = 'online-shops'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'online-bookstore');
insert into subcategories (category_id, name, slug)
select c.id, 'فروشگاه هدیه آنلاین', 'online-gift-store' from categories c
where c.slug = 'online-shops'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'online-gift-store');
insert into subcategories (category_id, name, slug)
select c.id, 'فروشگاه پیش‌فروش و سفارشی', 'preorder-store' from categories c
where c.slug = 'online-shops'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'preorder-store');
insert into subcategories (category_id, name, slug)
select c.id, 'مارکت‌پلیس و فروشنده آنلاین', 'marketplace-seller' from categories c
where c.slug = 'online-shops'
  and not exists (select 1 from subcategories s where s.category_id = c.id and s.slug = 'marketplace-seller');
