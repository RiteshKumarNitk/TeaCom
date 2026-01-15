
-- Notifications Table
create table public.notifications (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  message text not null,
  link text,
  type text default 'info', -- info, success, warning, error
  user_id uuid references auth.users(id), -- NULL for broadcast
  is_read boolean default false,
  created_at timestamp with time zone default now()
);

-- RLS
alter table public.notifications enable row level security;

-- Admin: Full Access
create policy "Admins can manage notifications"
  on public.notifications for all
  using ( 
    auth.uid() in (select id from public.profiles where role = 'admin') 
  );

-- Users: Read Own + Broadcasts
create policy "Users can read own notifications"
  on public.notifications for select
  using ( 
    auth.uid() = user_id 
    or user_id is null 
  );

-- Users: Update Own (Mark as Read)
create policy "Users can update own notifications"
  on public.notifications for update
  using ( auth.uid() = user_id )
  with check ( auth.uid() = user_id );
