-- Notifications Table
create table if not exists notifications (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id), -- Nullable for broadcast
  title text not null,
  message text not null,
  type text default 'info', -- info, order_update, promo
  is_read boolean default false,
  metadata jsonb -- for linking to orders etc
);

-- RLS
alter table notifications enable row level security;

-- Policies

-- Drop existing policies to ensure idempotency
drop policy if exists "Users can view their notifications" on notifications;
drop policy if exists "Admins can manage notifications" on notifications;

-- Users can view their own notifications or broadcast notifications (user_id is null)
create policy "Users can view their notifications"
  on notifications for select
  using ( auth.uid() = user_id or user_id is null );

-- Admins can view/create all
create policy "Admins can manage notifications"
  on notifications for all
  using ( 
    exists (
      select 1 from admin_roles 
      where user_id = auth.uid() 
      and role in ('super_admin', 'support_agent')
    )
  );

-- Service Role Bypass (implicit but good to document intent or if we use restricted client)
