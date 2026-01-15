-- 1. Extend Order Status Logic
-- The column 'status' is ALREADY of type 'order_status_type' based on the error.
-- So we just need to add values to that specific enum type.

DO $$
BEGIN
    -- Check if 'order_status_type' exists (it should, based on error)
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status_type') THEN
        ALTER TYPE order_status_type ADD VALUE IF NOT EXISTS 'packed' AFTER 'paid';
        ALTER TYPE order_status_type ADD VALUE IF NOT EXISTS 'returned' AFTER 'delivered';
        ALTER TYPE order_status_type ADD VALUE IF NOT EXISTS 'refunded' AFTER 'returned';
    
    -- Fallback: If for some reason it's 'order_status' (older naming?)
    ELSIF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
        ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'packed' AFTER 'paid';
        ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'returned' AFTER 'delivered';
        ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'refunded' AFTER 'returned';
        
    ELSE
        -- If neither exists, create 'order_status_type' and convert column
        CREATE TYPE order_status_type AS ENUM ('pending', 'paid', 'packed', 'shipped', 'delivered', 'returned', 'refunded', 'cancelled');
        -- Cast to text first to avoid type mismatch if it was something else unique
        ALTER TABLE orders ALTER COLUMN status TYPE order_status_type USING status::text::order_status_type;
        ALTER TABLE orders ALTER COLUMN status SET DEFAULT 'pending'::order_status_type;
    END IF;
END $$;

-- 2. Add Fulfillment Columns to Orders
alter table orders 
  add column if not exists tracking_number text,
  add column if not exists courier_name text,
  add column if not exists notes text; -- Admin internal notes

-- 3. Create Returns Table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'return_status_type') THEN
        CREATE TYPE return_status_type AS ENUM ('requested', 'approved', 'rejected', 'received', 'refunded');
    END IF;
END $$;

create table if not exists returns (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references orders(id) not null,
  user_id uuid references auth.users(id), -- Optional, as guest orders might exist, but good to link if possible
  reason text not null,
  status return_status_type not null default 'requested',
  admin_notes text,
  refund_amount numeric,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS for Returns
alter table returns enable row level security;

-- Admins can do everything on returns
create policy "Admins can manage all returns"
  on returns
  for all
  using (
    exists (
      select 1 from admin_roles ar
      where ar.user_id = auth.uid()
      and ar.role in ('super_admin', 'admin', 'operations', 'support_agent')
    )
  );

-- Users can view their own returns
create policy "Users can view own returns"
  on returns
  for select
  using ( auth.uid() = user_id );

-- Users can create returns (if we allow self-service later)
create policy "Users can create returns"
  on returns
  for insert
  with check ( auth.uid() = user_id );
