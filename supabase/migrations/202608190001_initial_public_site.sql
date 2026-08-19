create extension if not exists "pgcrypto";

do $$
begin
  create type public.app_role as enum ('member', 'admin');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.content_scope as enum ('blog', 'resource');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.resource_pricing as enum ('free', 'freemium', 'open_source');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.resource_status as enum ('active', 'broken', 'archived');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.submission_status as enum ('pending', 'approved', 'rejected');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.broken_report_type as enum ('website_broken', 'download_broken', 'github_broken', 'information_incorrect');
exception when duplicate_object then null;
end $$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  role public.app_role not null default 'member',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_username_length check (username is null or char_length(username) >= 3)
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  scope public.content_scope not null,
  name text not null,
  slug text not null,
  description text,
  icon text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (scope, slug)
);

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete restrict,
  category_id uuid references public.categories(id) on delete set null,
  title text not null,
  slug text not null unique,
  description text not null,
  content jsonb not null default '{}'::jsonb,
  cover_image_url text,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.drafts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  title text not null default 'Untitled',
  slug text not null default 'untitled',
  description text,
  content jsonb not null default '{}'::jsonb,
  image text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.post_tags (
  post_id uuid not null references public.posts(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  comment text not null,
  created_at timestamptz not null default now()
);

create table public.bookmarks (
  id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (id, user_id)
);

create table public.resources (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text not null,
  long_description text,
  logo_url text,
  cover_image_url text,
  website_url text,
  github_url text,
  download_url text,
  pricing public.resource_pricing not null default 'free',
  open_source boolean not null default false,
  platforms text[] not null default '{}',
  license text,
  featured boolean not null default false,
  status public.resource_status not null default 'active',
  last_checked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.resource_tags (
  resource_id uuid not null references public.resources(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  primary key (resource_id, tag_id)
);

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  website_url text,
  github_url text,
  description text not null,
  category_id uuid references public.categories(id) on delete set null,
  submitter_email text,
  status public.submission_status not null default 'pending',
  reviewer_id uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  review_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.broken_reports (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid not null references public.resources(id) on delete cascade,
  report_type public.broken_report_type not null,
  details text,
  reporter_email text,
  resolved_at timestamptz,
  resolved_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index posts_public_listing_idx on public.posts (published, published_at desc);
create index drafts_author_idx on public.drafts (author_id, updated_at desc);
create index resources_public_listing_idx on public.resources (status, featured desc, updated_at desc);
create index resources_category_idx on public.resources (category_id);
create index submissions_status_idx on public.submissions (status, created_at desc);
create index broken_reports_resource_idx on public.broken_reports (resource_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create trigger profiles_set_updated_at before update on public.profiles for each row execute procedure public.set_updated_at();
create trigger categories_set_updated_at before update on public.categories for each row execute procedure public.set_updated_at();
create trigger posts_set_updated_at before update on public.posts for each row execute procedure public.set_updated_at();
create trigger drafts_set_updated_at before update on public.drafts for each row execute procedure public.set_updated_at();
create trigger resources_set_updated_at before update on public.resources for each row execute procedure public.set_updated_at();
create trigger submissions_set_updated_at before update on public.submissions for each row execute procedure public.set_updated_at();
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.posts enable row level security;
alter table public.drafts enable row level security;
alter table public.post_tags enable row level security;
alter table public.comments enable row level security;
alter table public.bookmarks enable row level security;
alter table public.resources enable row level security;
alter table public.resource_tags enable row level security;
alter table public.submissions enable row level security;
alter table public.broken_reports enable row level security;

create policy "profiles are publicly readable" on public.profiles for select using (true);
create policy "users can update their profile" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));
revoke update (role) on public.profiles from anon, authenticated;

create policy "public can read categories" on public.categories for select using (true);
create policy "admins manage categories" on public.categories for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "public can read tags" on public.tags for select using (true);
create policy "admins manage tags" on public.tags for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public reads published posts" on public.posts for select using (published or author_id = auth.uid() or public.is_admin());
create policy "authors create posts" on public.posts for insert to authenticated with check (author_id = auth.uid());
create policy "authors update own posts" on public.posts for update to authenticated using (author_id = auth.uid() or public.is_admin()) with check (author_id = auth.uid() or public.is_admin());
create policy "authors delete own posts" on public.posts for delete to authenticated using (author_id = auth.uid() or public.is_admin());
create policy "authors manage own drafts" on public.drafts for all to authenticated using (author_id = auth.uid() or public.is_admin()) with check (author_id = auth.uid() or public.is_admin());
create policy "public reads post tags" on public.post_tags for select using (true);
create policy "authors manage post tags" on public.post_tags for all to authenticated using (public.is_admin() or exists (select 1 from public.posts where posts.id = post_tags.post_id and posts.author_id = auth.uid())) with check (public.is_admin() or exists (select 1 from public.posts where posts.id = post_tags.post_id and posts.author_id = auth.uid()));
create policy "public reads comments" on public.comments for select using (true);
create policy "users create comments" on public.comments for insert to authenticated with check (user_id = auth.uid());
create policy "users delete own comments" on public.comments for delete to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "users manage own bookmarks" on public.bookmarks for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "public reads active resources" on public.resources for select using (status = 'active' or public.is_admin());
create policy "admins manage resources" on public.resources for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "public reads resource tags" on public.resource_tags for select using (true);
create policy "admins manage resource tags" on public.resource_tags for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "anyone can submit a pending resource" on public.submissions for insert to anon, authenticated with check (status = 'pending');
create policy "admins review submissions" on public.submissions for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "anyone can report a resource problem" on public.broken_reports for insert to anon, authenticated with check (true);
create policy "admins manage broken reports" on public.broken_reports for all to authenticated using (public.is_admin()) with check (public.is_admin());
