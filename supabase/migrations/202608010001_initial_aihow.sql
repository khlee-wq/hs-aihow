create extension if not exists pgcrypto;

create type public.user_role as enum ('student', 'expert');
create type public.rule_status as enum ('draft', 'review', 'approved');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 80),
  role public.user_role not null default 'student',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.question_rules (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 4 and 120),
  school text not null check (char_length(school) between 2 and 80),
  category text not null check (char_length(category) between 2 and 60),
  status public.rule_status not null default 'draft',
  examples integer not null default 0 check (examples between 0 and 999),
  created_by uuid default auth.uid() references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles(id) on delete set null,
  entity_type text not null,
  entity_id uuid not null,
  action text not null check (action in ('create', 'update', 'delete', 'approve')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name, role)
  values (new.id, coalesce(nullif(new.raw_user_meta_data ->> 'display_name', ''), split_part(new.email, '@', 1)), 'student');
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger question_rules_updated_at before update on public.question_rules for each row execute function public.set_updated_at();

create or replace function public.is_expert()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.profiles where id = (select auth.uid()) and role = 'expert');
$$;

alter table public.profiles enable row level security;
alter table public.question_rules enable row level security;
alter table public.audit_logs enable row level security;

create policy "profiles read own" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "profiles update own" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "experts read question rules" on public.question_rules for select to authenticated using ((select public.is_expert()));
create policy "experts insert question rules" on public.question_rules for insert to authenticated with check ((select public.is_expert()) and created_by = (select auth.uid()));
create policy "experts update question rules" on public.question_rules for update to authenticated using ((select public.is_expert())) with check ((select public.is_expert()));
create policy "experts delete question rules" on public.question_rules for delete to authenticated using ((select public.is_expert()));
create policy "experts read audit logs" on public.audit_logs for select to authenticated using ((select public.is_expert()));

revoke all on table public.profiles from anon, authenticated;
grant select on table public.profiles to authenticated;
grant update (display_name) on table public.profiles to authenticated;

revoke all on table public.question_rules from anon, authenticated;
grant select, delete on table public.question_rules to authenticated;
grant insert (title, school, category, status, examples) on table public.question_rules to authenticated;
grant update (title, school, category, status, examples) on table public.question_rules to authenticated;

create index question_rules_school_status_idx on public.question_rules (school, status);
create index question_rules_updated_at_idx on public.question_rules (updated_at desc);
create index audit_logs_entity_idx on public.audit_logs (entity_type, entity_id, created_at desc);

revoke all on table public.audit_logs from anon, authenticated;
grant select on table public.audit_logs to authenticated;
