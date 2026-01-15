-- Coupons Table
create table coupons (
  id uuid default gen_random_uuid() primary key,
  code text not null unique,
  description text,
  discount_type text not null check (discount_type in ('percentage', 'fixed')),
  discount_value numeric not null,
  min_order_amount numeric default 0,
  max_discount_amount numeric, -- useful for percentage caps
  starts_at timestamp with time zone default now(),
  expires_at timestamp with time zone,
  usage_limit integer,
  usage_count integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- RLS for Coupons
alter table coupons enable row level security;

-- Admins: Full Access
create policy "Admins can do everything with coupons"
  on coupons for all
  using ( auth.uid() in ( select id from profiles where role = 'admin' ) );

-- Public: Read Only (needed for validation during checkout)
create policy "Anyone can read coupons"
  on coupons for select
  using ( true );

-- Function to increment usage (safe RPC)
create or replace function increment_coupon_usage(coupon_code text)
returns void as $$
begin
  update coupons
  set usage_count = usage_count + 1
  where code = coupon_code;
end;
$$ language plpgsql security definer;
