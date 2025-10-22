-- ---------- Safety: helper to auto-bump updated_at ----------
create or replace function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- re-create triggers idempotently
drop trigger if exists trg_projects_updated_at on public.projects;
create trigger trg_projects_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists trg_project_members_updated_at on public.project_members;
create trigger trg_project_members_updated_at
before update on public.project_members
for each row execute function public.set_updated_at();

-- ---------- RLS enable ----------
alter table public.projects enable row level security;
alter table public.project_members enable row level security;

-- (optional but recommended hardening)
-- alter table public.projects force row level security;
-- alter table public.project_members force row level security;

-- ---------- Projects policies ----------
drop policy if exists "read public or own" on public.projects;
create policy "read public or own"
on public.projects
for select
to authenticated, anon
using ( is_public = true OR owner_id = auth.uid() );

drop policy if exists "insert own" on public.projects;
create policy "insert own"
on public.projects
for insert
to authenticated
with check ( owner_id = auth.uid() );

drop policy if exists "update own" on public.projects;
create policy "update own"
on public.projects
for update
to authenticated
using ( owner_id = auth.uid() )
with check ( owner_id = auth.uid() );

drop policy if exists "delete own" on public.projects;
create policy "delete own"
on public.projects
for delete
to authenticated
using ( owner_id = auth.uid() );

-- ---------- Project members policies ----------
drop policy if exists "read members via project" on public.project_members;
create policy "read members via project"
on public.project_members
for select
to authenticated, anon
using (
  exists (
    select 1
    from public.projects p
    where p.id = project_id
      and (p.is_public = true or p.owner_id = auth.uid())
  )
);

drop policy if exists "insert members own project" on public.project_members;
create policy "insert members own project"
on public.project_members
for insert
to authenticated
with check (
  exists (
    select 1
    from public.projects p
    where p.id = project_id and p.owner_id = auth.uid()
  )
);

drop policy if exists "update members own project" on public.project_members;
create policy "update members own project"
on public.project_members
for update
to authenticated
using (
  exists (
    select 1
    from public.projects p
    where p.id = project_id and p.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.projects p
    where p.id = project_id and p.owner_id = auth.uid()
  )
);

drop policy if exists "delete members own project" on public.project_members;
create policy "delete members own project"
on public.project_members
for delete
to authenticated
using (
  exists (
    select 1
    from public.projects p
    where p.id = project_id and p.owner_id = auth.uid()
  )
);
