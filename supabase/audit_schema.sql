-- Create audit_logs table
create table audit_logs (
  id uuid default gen_random_uuid() primary key,
  actor_id uuid references auth.users(id),
  action text not null, -- e.g., 'product.create', 'order.refund', 'auth.login'
  entity_type text not null, -- 'product', 'order', 'coupon', 'user'
  entity_id uuid not null,
  old_value jsonb, -- For updates, capture what changed
  new_value jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz default now()
);

-- RLS: Enable RLS
alter table audit_logs enable row level security;

-- RLS Policy: Only admins can view logs
create policy "Admins can view audit logs"
  on audit_logs
  for select
  using (
    exists (
      select 1 from admin_roles ar
      where ar.user_id = auth.uid()
      and ar.role in ('super_admin', 'admin') 
    )
  );

-- RLS Policy: Insert is open to authenticated users (server actions will write to it)
-- In a stricter environment, we might use a Postgres function with SECURITY DEFINER
create policy "Authenticated users can insert logs"
  on audit_logs
  for insert
  with check ( auth.role() = 'authenticated' );
