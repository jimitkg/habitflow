-- ============================================================
-- HabitFlow — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ── Profiles ────────────────────────────────────────────────
-- One row per auth user. Created automatically on signup.
create table if not exists profiles (
  id        uuid primary key references auth.users(id) on delete cascade,
  email     text,
  role      text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

-- ── Habits ──────────────────────────────────────────────────
create table if not exists habits (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  description text,
  color       text not null default '#6366f1',
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ── Habit Entries (daily check-ins) ─────────────────────────
create table if not exists habit_entries (
  id             uuid primary key default gen_random_uuid(),
  habit_id       uuid not null references habits(id) on delete cascade,
  user_id        uuid not null references auth.users(id) on delete cascade,
  completed_date date not null,
  created_at     timestamptz not null default now(),
  unique (habit_id, completed_date)
);

-- ── Indexes ─────────────────────────────────────────────────
create index if not exists habits_user_id_idx        on habits(user_id);
create index if not exists habit_entries_user_id_idx on habit_entries(user_id);
create index if not exists habit_entries_habit_id_idx on habit_entries(habit_id);
create index if not exists habit_entries_date_idx    on habit_entries(completed_date);

-- ── Row Level Security ───────────────────────────────────────
alter table profiles     enable row level security;
alter table habits       enable row level security;
alter table habit_entries enable row level security;

-- profiles: users can read/update their own row
create policy "profiles: own read"
  on profiles for select
  using (auth.uid() = id);

create policy "profiles: own update"
  on profiles for update
  using (auth.uid() = id);

-- habits: users manage only their own habits
create policy "habits: own all"
  on habits for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- habit_entries: users manage only their own entries
create policy "entries: own all"
  on habit_entries for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── Admin helper function ────────────────────────────────────
-- Lets the app promote a user to admin via service-role key.
-- Usage: select promote_to_admin('user@example.com');
create or replace function promote_to_admin(target_email text)
returns void
language plpgsql
security definer
as $$
begin
  update profiles set role = 'admin'
  where email = target_email;
end;
$$;

-- ── Auto-create profile on signup ────────────────────────────
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into profiles (id, email, role)
  values (new.id, new.email, 'user')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
