-- Create a table for public profiles
create table profiles (
  id uuid references auth.users(id) on delete cascade not null primary key,
  email text,
  role text not null default 'customer' check (role in ('admin', 'customer')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'customer');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on signup
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Helper to make the first user admin (Run this manually if needed, or update manually)
-- update profiles set role = 'admin' where email = 'your-email@example.com';
