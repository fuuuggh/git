-- Resource directory: external links and administrator-managed attachments.
-- Public submissions remain link-only; only admins can upload files.

alter table public.resources
  add column if not exists resource_type text not null default 'website'
  check (resource_type in ('website', 'open_source', 'download', 'document', 'template', 'asset', 'api', 'service'));

create table if not exists public.resource_attachments (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid not null references public.resources(id) on delete cascade,
  storage_path text not null unique,
  file_name text not null,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes >= 0 and size_bytes <= 26214400),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists resource_attachments_resource_idx
  on public.resource_attachments (resource_id, created_at);

alter table public.resource_attachments enable row level security;

create policy "public reads attachments of active resources"
  on public.resource_attachments for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.resources
      where resources.id = resource_attachments.resource_id
        and resources.status = 'active'
    )
  );

create policy "admins manage resource attachments"
  on public.resource_attachments for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'resource-files',
  'resource-files',
  true,
  26214400,
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

create policy "public reads resource files"
  on storage.objects for select
  using (bucket_id = 'resource-files');

create policy "admins upload resource files"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'resource-files' and public.is_admin());

create policy "admins update resource files"
  on storage.objects for update to authenticated
  using (bucket_id = 'resource-files' and public.is_admin())
  with check (bucket_id = 'resource-files' and public.is_admin());

create policy "admins delete resource files"
  on storage.objects for delete to authenticated
  using (bucket_id = 'resource-files' and public.is_admin());
