-- Create Posts Table
create table if not exists public.posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  excerpt text,
  content text, -- Markdown or HTML
  cover_image text,
  author text default 'Admin',
  is_published boolean default false,
  published_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.posts enable row level security;

-- Policies
create policy "Public posts are viewable by everyone."
  on public.posts for select
  using ( is_published = true );

create policy "Admins can manage all posts."
  on public.posts for all
  using ( 
    auth.uid() in (
      select id from public.profiles where role = 'admin'
    )
  );
