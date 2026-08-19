-- Anonymous submissions may include a link, an external download URL, or one
-- private file for review. Files are never public until an admin approves them.

alter table public.submissions
  add column if not exists resource_type text not null default 'website'
  check (resource_type in ('website', 'open_source', 'download', 'document', 'template', 'asset', 'api', 'service')),
  add column if not exists download_url text,
  add column if not exists attachment_path text,
  add column if not exists attachment_name text,
  add column if not exists attachment_mime_type text,
  add column if not exists attachment_size_bytes bigint
    check (attachment_size_bytes is null or (attachment_size_bytes >= 0 and attachment_size_bytes <= 10485760));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'submission-files',
  'submission-files',
  false,
  10485760,
  array[
    'application/pdf',
    'application/zip',
    'application/x-zip-compressed',
    'text/plain',
    'image/jpeg',
    'image/png',
    'image/webp'
  ]::text[]
)
on conflict (id) do nothing;

create policy "anyone uploads pending resource files"
  on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'submission-files' and name like 'pending/%');

create policy "admins read pending resource files"
  on storage.objects for select to authenticated
  using (bucket_id = 'submission-files' and public.is_admin());

create policy "admins delete pending resource files"
  on storage.objects for delete to authenticated
  using (bucket_id = 'submission-files' and public.is_admin());
