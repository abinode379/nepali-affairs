-- Enable UUID generation for PostgreSQL
create extension if not exists pgcrypto;

create table if not exists confessions (
  id uuid primary key default gen_random_uuid(),
  title text,
  story text not null,
  category text,
  status text not null default 'pending',
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

alter table confessions enable row level security;
alter table confessions force row level security;

-- Allow public users to submit new confessions,
-- but only as pending submissions with no featured flag.
create policy public_insert_confessions
  on confessions
  for insert
  with check (
    auth.role() in ('anon', 'authenticated')
    and status = 'pending'
    and featured = false
  );

-- Only admins may update confessions (including approving them).
create policy admin_update_confessions
  on confessions
  for update
  using (
    lower(auth.jwt() ->> 'email') = lower('admin@ideaclickdigital.com')
  )
  with check (
    lower(auth.jwt() ->> 'email') = lower('admin@ideaclickdigital.com')
  );

-- Only admins may delete confessions.
create policy admin_delete_confessions
  on confessions
  for delete
  using (
    lower(auth.jwt() ->> 'email') = lower('admin@ideaclickdigital.com')
  );

-- Everyone may read approved confessions.
create policy public_select_approved_confessions
  on confessions
  for select
  using (
    status = 'approved'
  );

-- Admins may read all confessions.
create policy admin_select_confessions
  on confessions
  for select
  using (
    lower(auth.jwt() ->> 'email') = lower('admin@ideaclickdigital.com')
  );

alter table confessions drop column if exists age;
alter table confessions drop column if exists gender;
