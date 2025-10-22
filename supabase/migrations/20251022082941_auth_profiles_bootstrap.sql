-- --- bootstrap: table -------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key
    references auth.users(id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Optional: index for lookups by email
do $$ begin
  if not exists (
    select 1 from pg_indexes
    where schemaname = 'public' and indexname = 'profiles_email_idx'
  ) then
    create index profiles_email_idx on public.profiles (email);
  end if;
end $$;

-- --- keep updated_at fresh --------------------------------------------------
create or replace function public.set_current_timestamp_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_current_timestamp_updated_at();

-- --- on new auth.users -> insert profile -----------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.email)
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- --- keep email in sync on auth.users email change --------------------------
create or replace function public.sync_email_on_user_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
     set email = new.email,
         updated_at = now()
   where id = new.id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_updated on auth.users;
create trigger on_auth_user_updated
after update of email on auth.users
for each row execute function public.sync_email_on_user_update();

-- --- RLS: lock it down ------------------------------------------------------
alter table public.profiles enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename  = 'profiles'
      and policyname = 'profiles_select_self'
  ) then
    create policy profiles_select_self on public.profiles
      for select using (auth.uid() = id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename  = 'profiles'
      and policyname = 'profiles_update_self'
  ) then
    create policy profiles_update_self on public.profiles
      for update using (auth.uid() = id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename  = 'profiles'
      and policyname = 'profiles_insert_self'
  ) then
    create policy profiles_insert_self on public.profiles
      for insert with check (auth.uid() = id);
  end if;
end $$;

