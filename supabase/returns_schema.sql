-- Returns Table
create table if not exists returns (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  order_id uuid references orders(id) not null,
  user_id uuid references auth.users(id) not null,
  reason text not null,
  status text not null default 'pending', -- pending, approved, rejected, completed
  refund_amount numeric,
  admin_notes text
);

-- RLS
alter table returns enable row level security;

-- Policies

-- Drop existing policies to ensure idempotency
drop policy if exists "Users can view their own returns" on returns;
drop policy if exists "Users can create return requests" on returns;
drop policy if exists "Admins can view all returns" on returns;
drop policy if exists "Admins can update returns" on returns;

-- Users can view their own returns
create policy "Users can view their own returns"
  on returns for select
  using ( auth.uid() = user_id );

-- Users can create return requests for their own orders
create policy "Users can create return requests"
  on returns for insert
  with check ( auth.uid() = user_id );

-- Admins (via service role or admin_role)
-- Note: Service Role client bypasses RLS, but if using standard client with admin role:
create policy "Admins can view all returns"
  on returns for select
  using ( 
    exists (
      select 1 from admin_roles 
      where user_id = auth.uid() 
      and role in ('super_admin', 'support_agent')
    )
  );

create policy "Admins can update returns"
  on returns for update
  using ( 
    exists (
      select 1 from admin_roles 
      where user_id = auth.uid() 
      and role in ('super_admin', 'support_agent')
    )
  );
