-- Beeroon (بیرون) — Supabase schema
-- Run this once in the Supabase SQL editor (Project → SQL Editor → New query).

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
  whatsapp text,
  hours text,
  price_tier int check (price_tier in (1,2,3)),
  is_supporter boolean not null default false,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);

-- Seed data
insert into cities (id, name, slug, active) values ('mashhad', 'مشهد', 'mashhad', true);

insert into categories (name, slug, icon) values
  ('ورزشی', 'sport', '🏇'),
  ('خوراکی', 'food', '🍽️'),
  ('صنایع‌دستی', 'handicraft', '🧶'),
  ('خدمات فنی', 'services', '🛠️');

insert into subcategories (category_id, name, slug)
  select id, 'سوارکاری', 'equestrian' from categories where slug = 'sport';
insert into subcategories (category_id, name, slug)
  select id, 'لوازم کوهنوردی', 'mountaineering' from categories where slug = 'sport';
insert into subcategories (category_id, name, slug)
  select id, 'کافه', 'cafe' from categories where slug = 'food';
insert into subcategories (category_id, name, slug)
  select id, 'فرش‌دستباف', 'handmade-rug' from categories where slug = 'handicraft';

-- Row Level Security
alter table cities enable row level security;
alter table categories enable row level security;
alter table subcategories enable row level security;
alter table businesses enable row level security;

-- Anyone can read cities/categories/subcategories, and approved businesses.
create policy "public read cities" on cities for select using (true);
create policy "public read categories" on categories for select using (true);
create policy "public read subcategories" on subcategories for select using (true);
create policy "public read approved businesses" on businesses
  for select using (status = 'approved');

-- Anonymous visitors can only submit a business as 'pending' (real moderation happens in admin panel).
create policy "public insert pending business" on businesses
  for insert to anon with check (status = 'pending');

-- Only a logged-in admin (any authenticated user — create one admin login in
-- Supabase Auth → Users) can read every business, insert with any status, update, or delete.
create policy "admin read all businesses" on businesses
  for select to authenticated using (true);
create policy "admin insert businesses" on businesses
  for insert to authenticated with check (true);
create policy "admin update businesses" on businesses
  for update to authenticated using (true);
create policy "admin delete businesses" on businesses
  for delete to authenticated using (true);
