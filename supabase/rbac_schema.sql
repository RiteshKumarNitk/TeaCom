-- Create ENUM for admin roles
create type admin_role_type as enum ('super_admin', 'admin', 'operations', 'content_manager', 'support_agent');

-- Create admin_roles table
create table admin_roles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null unique,
  role admin_role_type not null default 'support_agent',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS: Enable RLS
alter table admin_roles enable row level security;

-- RLS Policy: Super Admin can manage all roles
create policy "Super Admins can do everything on admin_roles"
  on admin_roles
  for all
  using (
    exists (
      select 1 from admin_roles ar
      where ar.user_id = auth.uid()
      and ar.role = 'super_admin'
    )
  );

-- RLS Policy: Admins can view roles (to see who is what)
create policy "Admins can view roles"
  on admin_roles
  for select
  using (
    exists (
      select 1 from admin_roles ar
      where ar.user_id = auth.uid()
      and ar.role in ('super_admin', 'admin')
    )
  );

-- Helper function to check if user has permission (simplified for now)
-- We can add a specialized function later if needed.
