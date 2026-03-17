create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  onboarding_done boolean not null default false,
  backup_state jsonb,
  last_backup_at timestamptz,
  active_device_id text,
  active_session_token text,
  active_device_label text,
  last_seen_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.profiles
  add column if not exists email text not null default '',
  add column if not exists onboarding_done boolean not null default false,
  add column if not exists backup_state jsonb,
  add column if not exists last_backup_at timestamptz,
  add column if not exists active_device_id text,
  add column if not exists active_session_token text,
  add column if not exists active_device_label text,
  add column if not exists last_seen_at timestamptz,
  add column if not exists created_at timestamptz not null default timezone('utc', now()),
  add column if not exists updated_at timestamptz not null default timezone('utc', now());

alter table public.profiles enable row level security;

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists profiles_handle_updated_at on public.profiles;

create trigger profiles_handle_updated_at
before update on public.profiles
for each row
execute procedure public.handle_updated_at();

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check ((select auth.uid()) = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create index if not exists profiles_last_seen_at_idx
on public.profiles (last_seen_at desc);
