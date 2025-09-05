-- Profiles table: normalize identity column and (re)create policies safely.

-- 0) Create table if missing (minimal)
create table if not exists public.profiles (
  id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 1) Ensure identity column "id" exists.
do $$
declare
  has_id boolean;
  has_user_id boolean;
  pk_name text;
begin
  select exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'profiles' and column_name = 'id'
  ) into has_id;

  select exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'profiles' and column_name = 'user_id'
  ) into has_user_id;

  if not has_id and has_user_id then
    -- Drop existing PK if it’s on user_id
    select conname
    into pk_name
    from pg_constraint
    where conrelid = 'public.profiles'::regclass
      and contype = 'p';

    if pk_name is not null then
      execute format('alter table public.profiles drop constraint %I', pk_name);
    end if;

    -- Rename user_id -> id
    execute 'alter table public.profiles rename column user_id to id';
  elsif not has_id then
    execute 'alter table public.profiles add column id uuid';
  end if;
end$$;

-- 2) Backfill/constraints for id
-- If you previously had user_id, step 1 already moved values into id.
-- Add FK and PK when possible.
do $$
declare
  pk_exists boolean;
  any_null boolean;
begin
  -- Add FK to auth.users(id) if missing
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.profiles'::regclass
      and conname = 'profiles_id_fkey'
  ) then
    -- Only add FK if column id exists
    if exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = 'profiles' and column_name = 'id'
    ) then
      execute 'alter table public.profiles
               add constraint profiles_id_fkey
               foreign key (id) references auth.users(id) on delete cascade';
    end if;
  end if;

  -- Add PK on id if none exists and no NULLs
  select exists (
    select 1 from pg_constraint
    where conrelid = 'public.profiles'::regclass and contype = 'p'
  ) into pk_exists;

  if not pk_exists then
    select exists (select 1 from public.profiles where id is null) into any_null;
    if not any_null then
      execute 'alter table public.profiles add primary key (id)';
    end if;
  end if;
end$$;

-- 3) Ensure remaining columns exist
alter table public.profiles
  add column if not exists username   text,
  add column if not exists full_name  text,
  add column if not exists avatar_url text,
  add column if not exists bio        text,
  add column if not exists languages  text[] default '{}'::text[],
  add column if not exists timezone   text,
  add column if not exists location   text,
  add column if not exists links      jsonb  default '[]'::jsonb,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

-- 4) Case-insensitive unique username
create unique index if not exists profiles_username_lower_key
  on public.profiles (lower(username));

-- 5) updated_at trigger
create or replace function public.set_updated_at() returns trigger
language plpgsql as $fn$
begin
  new.updated_at = now();
  return new;
end
$fn$;

do $$
begin
  if not exists (
    select 1 from pg_trigger
    where tgname = 'profiles_set_updated_at'
  ) then
    create trigger profiles_set_updated_at
      before update on public.profiles
      for each row execute function public.set_updated_at();
  end if;
end$$;

-- 6) Enable RLS
alter table public.profiles enable row level security;

-- 7) Policies — choose correct identity column dynamically (id or user_id)
do $$
declare
  ident_col text;
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'profiles' and column_name = 'id'
  ) then
    ident_col := 'id';
  elsif exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'profiles' and column_name = 'user_id'
  ) then
    ident_col := 'user_id';
  else
    raise exception 'profiles table missing both id and user_id columns';
  end if;

  -- Public read
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'Public read profiles'
  ) then
    execute 'create policy "Public read profiles"
             on public.profiles
             for select
             using (true)';
  end if;

  -- Insert own
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'Insert own profile'
  ) then
    execute format(
      'create policy "Insert own profile"
       on public.profiles
       for insert
       to authenticated
       with check (auth.uid() = %I)', ident_col
    );
  end if;

  -- Update own
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'Update own profile'
  ) then
    execute format(
      'create policy "Update own profile"
       on public.profiles
       for update
       to authenticated
       using (auth.uid() = %I)', ident_col
    );
  end if;
end$$;