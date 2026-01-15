-- Wishlist Table
create table wishlists (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  product_id uuid references products(id) not null,
  created_at timestamp with time zone default now(),
  unique(user_id, product_id)
);

-- RLS
alter table wishlists enable row level security;

-- Users can view their own
create policy "Users can view their own wishlist"
  on wishlists for select
  using ( auth.uid() = user_id );

-- Users can insert (add)
create policy "Users can add to wishlist"
  on wishlists for insert
  with check ( auth.uid() = user_id );

-- Users can delete (remove)
create policy "Users can remove from wishlist"
  on wishlists for delete
  using ( auth.uid() = user_id );
