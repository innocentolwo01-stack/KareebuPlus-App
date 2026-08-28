-- KareebuPlus-Codex — starter database schema
-- Paste into a new Supabase project's SQL editor to stand up the core tables.

create extension if not exists postgis;

-- PROFILES (extends Supabase auth.users — one row per person, any role)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  phone text unique not null,
  role text not null check (role in ('customer', 'merchant_staff', 'driver', 'admin')),
  created_at timestamptz not null default now()
);

-- DRIVERS
create table public.drivers (
  id uuid primary key references public.profiles(id) on delete cascade,
  vehicle_type text not null check (vehicle_type in ('car', 'moto', 'bicycle', 'van')),
  verification_status text not null default 'pending' check (verification_status in ('pending','approved','rejected')),
  current_location geography(Point, 4326),
  availability text not null default 'offline' check (availability in ('offline','available','busy')),
  rating numeric(2,1) not null default 5.0,
  updated_at timestamptz not null default now()
);

-- MERCHANTS
create table public.merchants (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id),
  name text not null,
  category text not null,
  location geography(Point, 4326),
  status text not null default 'closed' check (status in ('open','closed','paused')),
  application_status text not null default 'pending' check (application_status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);

-- CATEGORIES (self-referencing for subcategories)
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  parent_category_id uuid references public.categories(id),
  sort_order int not null default 0
);

-- PRODUCTS
create table public.products (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references public.merchants(id) on delete cascade,
  category_id uuid references public.categories(id),
  name text not null,
  price numeric(12,2) not null,
  available boolean not null default true,
  created_at timestamptz not null default now()
);

-- SERVICE TYPES (ride, quick_commerce, grocery, ... — the extensibility point)
create table public.service_types (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  needs_merchant boolean not null default false,
  needs_items boolean not null default false,
  dispatch_trigger text not null default 'immediate' check (dispatch_trigger in ('immediate','on_ready')),
  allowed_vehicle_types text[] not null default '{}'
);

-- REQUESTS (the unifying order-or-trip record)
create table public.requests (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id),
  service_type_id uuid not null references public.service_types(id),
  merchant_id uuid references public.merchants(id),
  driver_id uuid references public.drivers(id),
  status text not null default 'requested'
    check (status in ('requested','accepted_by_merchant','ready','matched','picked_up','in_transit','completed','cancelled')),
  origin geography(Point, 4326),
  destination geography(Point, 4326) not null,
  price numeric(12,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- REQUEST ITEMS (line items — used for commerce types, absent for rides)
create table public.request_items (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.requests(id) on delete cascade,
  product_id uuid not null references public.products(id),
  quantity int not null check (quantity > 0)
);

-- PAYMENTS
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.requests(id) on delete cascade,
  total numeric(12,2) not null,
  driver_payout numeric(12,2) not null default 0,
  merchant_payout numeric(12,2) not null default 0,
  platform_fee numeric(12,2) not null default 0,
  status text not null default 'held' check (status in ('held','paid_out','refunded')),
  held_at timestamptz default now(),
  paid_out_at timestamptz
);

-- PROMOTIONS
create table public.promotions (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('percent','flat')),
  value numeric(12,2) not null,
  scope text not null check (scope in ('site','category','merchant','product')),
  scope_id uuid,
  start_date timestamptz not null,
  end_date timestamptz not null,
  status text not null default 'active' check (status in ('active','expired','disabled'))
);

-- BANNERS
create table public.banners (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  link_target text,
  placement text not null default 'home',
  start_date timestamptz not null,
  end_date timestamptz not null,
  status text not null default 'active' check (status in ('active','expired','disabled'))
);

-- PRODUCT IMPORT JOBS (CSV bulk upload tracking)
create table public.product_import_jobs (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references public.merchants(id) on delete cascade,
  file_name text not null,
  status text not null default 'processing' check (status in ('processing','completed','failed')),
  rows_total int default 0,
  rows_succeeded int default 0,
  rows_failed int default 0,
  error_log jsonb,
  created_at timestamptz not null default now()
);

-- MERCHANT PRINTERS (the in-store print bridge device)
create table public.merchant_printers (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references public.merchants(id) on delete cascade,
  connection_type text not null default 'lan' check (connection_type in ('lan','bluetooth','usb')),
  last_seen_at timestamptz
);

-- Geo indexes — what makes "find nearby drivers within radius" fast
create index drivers_location_idx on public.drivers using gist (current_location);
create index merchants_location_idx on public.merchants using gist (location);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.drivers enable row level security;
alter table public.merchants enable row level security;
alter table public.requests enable row level security;
alter table public.payments enable row level security;
alter table public.products enable row level security;

-- Starter policies — extend as each app's screens get built.
-- Admin tooling should use the Supabase service role (server-side only,
-- e.g. from an Edge Function) rather than per-table "admin sees everything"
-- policies — simpler and keeps the service key off any client.

create policy "users see own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "customers see own requests"
  on public.requests for select
  using (auth.uid() = customer_id);

create policy "customers create own requests"
  on public.requests for insert
  with check (auth.uid() = customer_id);

create policy "drivers see assigned requests"
  on public.requests for select
  using (auth.uid() = driver_id);

create policy "merchants see own store requests"
  on public.requests for select
  using (auth.uid() in (select owner_id from public.merchants where id = merchant_id));

create policy "merchants manage own products"
  on public.products for all
  using (auth.uid() in (select owner_id from public.merchants where id = merchant_id));

-- Nearby-drivers search used by the dispatch-request edge function.
-- Called with an expanding radius until it returns at least one candidate.
create or replace function public.find_nearby_drivers(
  search_point geography,
  allowed_types text[],
  radius_meters int
)
returns table (id uuid, distance_meters double precision)
language sql
stable
as $$
  select d.id, st_distance(d.current_location, search_point) as distance_meters
  from public.drivers d
  where d.availability = 'available'
    and d.vehicle_type = any(allowed_types)
    and st_dwithin(d.current_location, search_point, radius_meters)
  order by distance_meters asc
  limit 10;
$$;
