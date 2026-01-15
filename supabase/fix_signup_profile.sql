-- Fix Profile Name and Signup Flow

-- 1. Ensure profiles table has a full_name column
do $$ 
begin
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'full_name') then
        alter table public.profiles add column full_name text;
    end if;
end $$;

-- 2. Update handle_new_user to capture full_name from metadata
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role, full_name)
  values (
    new.id, 
    new.email, 
    'customer',
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

-- 3. Run a backfill for existing users (optional, best effort)
-- update public.profiles p
-- set full_name = (select raw_user_meta_data->>'full_name' from auth.users where id = p.id)
-- where full_name is null;
