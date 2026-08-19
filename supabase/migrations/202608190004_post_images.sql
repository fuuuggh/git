-- Administrator-managed images for blog cover and article body.
-- Files are public only after they are uploaded by an administrator; uploads
-- use unguessable post UUID paths and are never available to anonymous writers.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'post-images',
  'post-images',
  true,
  6291456,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']::text[]
)
on conflict (id) do nothing;

create policy "public reads post images"
  on storage.objects for select
  using (bucket_id = 'post-images');

create policy "admins upload post images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'post-images' and public.is_admin());

create policy "admins update post images"
  on storage.objects for update to authenticated
  using (bucket_id = 'post-images' and public.is_admin())
  with check (bucket_id = 'post-images' and public.is_admin());

create policy "admins delete post images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'post-images' and public.is_admin());
