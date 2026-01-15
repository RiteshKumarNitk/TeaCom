-- Fix Infinite Recursion and Admin Access

-- 1. Create a helper function to get the current user's admin role securely.
-- This function is SECURITY DEFINER, meaning it runs with the privileges of the creator (postgres/superadmin),
-- bypassing RLS on the admin_roles table, thus breaking the recursion loop.
create or replace function public.get_my_admin_role()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  user_role text;
begin
  select role::text into user_role
  from admin_roles
  where user_id = auth.uid();
  return user_role;
end;
$$;

-- 2. Drop existing recursive policies on admin_roles
drop policy if exists "Super Admins can do everything on admin_roles" on admin_roles;
drop policy if exists "Admins can view roles" on admin_roles;

-- 3. Create new optimized policies for admin_roles
create policy "Super Admins can do everything on admin_roles"
  on admin_roles
  for all
  using (
    get_my_admin_role() = 'super_admin'
  );

create policy "Admins can view roles"
  on admin_roles
  for select
  using (
    get_my_admin_role() in ('super_admin', 'admin')
  );

-- 4. Fix Orders Access for Admins
drop policy if exists "Admins can view all orders" on orders;
create policy "Admins can view all orders"
  on orders
  for select
  using (
    get_my_admin_role() in ('super_admin', 'admin', 'operations', 'support_agent')
  );

drop policy if exists "Admins can manage orders" on orders;
create policy "Admins can manage orders"
  on orders
  for update
  using (
    get_my_admin_role() in ('super_admin', 'admin', 'operations')
  );


-- 5. Fix Order Items Access for Admins
drop policy if exists "Admins can view all order items" on order_items;
create policy "Admins can view all order items"
  on order_items
  for select
  using (
    get_my_admin_role() in ('super_admin', 'admin', 'operations', 'support_agent')
  );

-- 6. Fix Audit Logs Access
drop policy if exists "Admins can view audit logs" on audit_logs;
create policy "Admins can view audit logs"
  on audit_logs
  for select
  using (
    get_my_admin_role() in ('super_admin', 'admin')
  );
  
-- 7. Fix Inventory Access (if needed - usually implicit via admin_roles fix, but good to be explicit if table exists)
-- inventory table uses: EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid() ...)
-- This is already FIXED because the SELECT on admin_roles now uses the non-recursive function? 
-- NO, the SELECT on admin_roles checks admin_roles policies provided we didn't use `bypassrls`.
-- But wait, my new admin_roles policies uses get_my_admin_role() which IS security definer.
-- So: Inventory access -> Select admin_roles -> admin_roles RLS -> get_my_admin_role() -> Select admin_roles (bypassed).
-- So Inventory is implicitly fixed.
