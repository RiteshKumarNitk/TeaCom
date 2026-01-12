-- Orders Table
create table orders (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id), -- Nullable for guest checkout
  status text not null default 'pending', -- pending, paid, shipped, delivered, cancelled
  
  -- Customer Info (captured at checkout)
  email text not null,
  phone text,
  shipping_address jsonb not null, -- { line1, city, state, postal_code, country }
  
  -- Payment Info
  currency text not null check (currency in ('INR', 'SAR')),
  total_amount numeric not null,
  payment_method text not null, -- 'cod', 'card', etc.
  payment_status text not null default 'pending'
);

-- RLS for Orders
alter table orders enable row level security;

create policy "Users can view their own orders"
  on orders for select
  using ( auth.uid() = user_id );

create policy "Anyone can create orders (Guest checkout)"
  on orders for insert
  with check ( true ); 
  -- Note: Ideally we'd restrict this more, but for guest checkout w/o auth, public insert is often needed or a service_role function.
  -- For now, allowing public insert for demo.

-- Order Items Table
create table order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references orders(id) on delete cascade not null,
  product_id uuid references products(id) not null,
  variant_id uuid references product_variants(id), -- Nullable if no variant
  
  -- Snapshot of price/name at time of purchase
  quantity integer not null,
  price_amount numeric not null, 
  currency text not null,
  product_name text not null
);

-- RLS for Order Items
alter table order_items enable row level security;

create policy "Users can view their own order items"
  on order_items for select
  using ( 
    exists ( select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid() )
  );

create policy "Anyone can insert order items"
  on order_items for insert
  with check ( true );
