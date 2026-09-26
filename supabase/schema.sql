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

insert into cities (id, name, slug, active)
values ('mashhad', 'مشهد', 'mashhad', true)
on conflict (id) do nothing;

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