-- Create a "public" table for products
create table products (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  slug text unique not null,
  name text not null,
  description text,
  images text[] default '{}',
  category text,
  tags text[] default '{}',
  benefits text[] default '{}',
  ingredients text[] default '{}',
  is_bestseller boolean default false,
  is_new boolean default false,
  metadata jsonb default '{}'
);

-- Enable RLS
alter table products enable row level security;

-- Policies
create policy "Public products are viewable by everyone."
  on products for select
  using ( true );

create policy "Admins can insert products."
  on products for insert
  with check ( auth.role() = 'service_role' ); -- Simplification for now, usually checks admin table

-- Product Variants (e.g., 100g, 250g)
create table product_variants (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references products(id) on delete cascade not null,
  name text not null, -- e.g. "100g"
  sku text,
  stock integer default 0,
  metadata jsonb default '{}'
);

alter table product_variants enable row level security;

create policy "Public variants are viewable by everyone."
  on product_variants for select
  using ( true );

-- Product Prices (Multi-currency support)
create table product_prices (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references products(id) on delete cascade not null,
  variant_id uuid references product_variants(id) on delete cascade, -- Nullable if it's a base price
  currency text not null check (currency in ('INR', 'SAR')),
  amount numeric not null,
  compare_at_amount numeric, -- For discounts
  unique(product_id, variant_id, currency) -- Ensure one price per currency per item
);

alter table product_prices enable row level security;

create policy "Public prices are viewable by everyone."
  on product_prices for select
  using ( true );

-- Seed Data Helper (Optional, just to show how to insert)
-- insert into products (name, slug, ...) values ...;
