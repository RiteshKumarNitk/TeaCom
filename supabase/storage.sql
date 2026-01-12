-- Storage Bucket for Products
-- Run this in SQL Editor

-- 1. Create the bucket
insert into storage.buckets (id, name, public)
values ('products', 'products', true);

-- 2. Enable RLS
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'products' );

create policy "Admin Upload"
  on storage.objects for insert
  with check ( bucket_id = 'products' and auth.role() = 'authenticated' ); -- Refine if needed to check profiles.role

create policy "Admin Update"
  on storage.objects for update
  using ( bucket_id = 'products' and auth.role() = 'authenticated' );

create policy "Admin Delete"
  on storage.objects for delete
  using ( bucket_id = 'products' and auth.role() = 'authenticated' );
