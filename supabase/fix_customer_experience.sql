-- Fix Customer Order Experience

-- 1. Ensure Orders are viewable by owners
-- Drop potentially conflicting/recursive policies for users
drop policy if exists "Users can view their own orders" on orders;
create policy "Users can view their own orders"
  on orders for select
  using ( auth.uid() = user_id );

-- 2. Ensure Order Items are viewable by owners
drop policy if exists "Users can view their own order items" on order_items;
create policy "Users can view their own order items"
  on order_items for select
  using ( 
    exists ( select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid() )
  );

-- 3. Ensure Profiles table is robust for updates
-- Add phone column if missing
do $$ 
begin
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'phone') then
        alter table public.profiles add column phone text;
    end if;
end $$;

-- 4. Allow users to update their own profile
drop policy if exists "Users can update own profile" on profiles;
create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );
  
-- 5. Grant permissions (just in case)
grant select, insert, update on orders to authenticated;
grant select, insert on order_items to authenticated;
grant select, update on profiles to authenticated;

-- 6. Fix for Guest Checkout Select (Optional but helpful for debug)
-- We won't open RLS for guests to select, but we ensure 'anon' has Insert rights.
grant insert on orders to anon;
grant insert on order_items to anon;
