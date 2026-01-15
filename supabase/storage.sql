
-- Create Storage Bucket for Blog Images
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

-- Policy: Public Read Access (Scoped to blog-images)
create policy "Public Access blog-images"
  on storage.objects for select
  using ( bucket_id = 'blog-images' );

-- Policy: Admin Upload Access (Scoped to blog-images)
create policy "Admin Upload Access blog-images"
  on storage.objects for insert
  with check (
    bucket_id = 'blog-images' 
    and auth.role() = 'authenticated'
    and (select role from public.profiles where id = auth.uid()) = 'admin'
  );

-- Policy: Admin Update/Delete Access (Scoped to blog-images)
create policy "Admin Update Access blog-images"
  on storage.objects for update
  using (
    bucket_id = 'blog-images' 
    and auth.role() = 'authenticated'
    and (select role from public.profiles where id = auth.uid()) = 'admin'
  );

create policy "Admin Delete Access blog-images"
  on storage.objects for delete
  using (
    bucket_id = 'blog-images' 
    and auth.role() = 'authenticated'
    and (select role from public.profiles where id = auth.uid()) = 'admin'
  );
