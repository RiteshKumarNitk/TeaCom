-- 1. Create Categories Table
-- Replacing simple text column with proper entity for better management (images, descriptions)
create table categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- RLS
alter table categories enable row level security;
create policy "Public categories viewable" on categories for select using (true);
create policy "Admins manage categories" on categories for all using (
  exists (select 1 from admin_roles where user_id = auth.uid() and role in ('super_admin', 'admin', 'content_manager'))
);

-- 2. Create Collections Table (for Featured, Seasonal, etc.)
create table collections (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  type text default 'standard', -- 'seasonal', 'featured', 'sale'
  is_active boolean default true,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz default now()
);

-- RLS
alter table collections enable row level security;
create policy "Public collections viewable" on collections for select using (true);
create policy "Admins manage collections" on collections for all using (
  exists (select 1 from admin_roles where user_id = auth.uid() and role in ('super_admin', 'admin', 'content_manager'))
);

-- 3. Product Collections (Many-to-Many)
create table product_collections (
  product_id uuid references products(id) on delete cascade,
  collection_id uuid references collections(id) on delete cascade,
  primary key (product_id, collection_id)
);

-- RLS
alter table product_collections enable row level security;
create policy "Public product_collections viewable" on product_collections for select using (true);
create policy "Admins manage product_collections" on product_collections for all using (
  exists (select 1 from admin_roles where user_id = auth.uid() and role in ('super_admin', 'admin', 'content_manager'))
);

-- 4. Low Stock View
-- Helper view to easily query low stock items across all variants
create or replace view low_stock_alerts as
select 
  pv.id as variant_id,
  pv.name as variant_name,
  pv.sku,
  pv.stock,
  p.id as product_id,
  p.name as product_name,
  p.slug as product_slug
from product_variants pv
join products p on pv.product_id = p.id
where pv.stock < 10; -- Threshold could be configurable in platform_settings later
