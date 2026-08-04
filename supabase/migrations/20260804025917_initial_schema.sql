-- profiles: one row per auth user, holds role + display info
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  full_name text,
  role text not null check (role in ('admin', 'jury')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- competitions: each has its own theme/project topic and age group
create table competitions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  theme text,               -- this competition's project topic
  age_group text,           -- e.g. "6-9", "9-12", "13-16" (free text or enum, admin-defined)
  description text,
  status text not null default 'upcoming' check (status in ('upcoming', 'active', 'completed')),
  event_date date,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

-- teams: entered by admin, belong to one competition
create table teams (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid not null references competitions(id) on delete cascade,
  name text not null,
  robot_name text,
  notes text,
  created_at timestamptz not null default now()
);

-- team_members: optional roster (name + age) per team
create table team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams(id) on delete cascade,
  full_name text not null,
  age int
);

-- jury_assignments: which juries can judge which competitions
create table jury_assignments (
  id uuid primary key default gen_random_uuid(),
  jury_id uuid not null references profiles(id) on delete cascade,
  competition_id uuid not null references competitions(id) on delete cascade,
  unique (jury_id, competition_id)
);

-- scoring_criteria: judging rubric, defined per competition (themes differ, so criteria differ)
create table scoring_criteria (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid not null references competitions(id) on delete cascade,
  name text not null,          -- e.g. "Robot Design", "Project Presentation", "Teamwork"
  description text,
  max_score numeric not null default 10,
  weight numeric not null default 1,
  order_index int not null default 0
);

-- scores: one row per jury + team + criterion
create table scores (
  id uuid primary key default gen_random_uuid(),
  jury_id uuid not null references profiles(id) on delete cascade,
  team_id uuid not null references teams(id) on delete cascade,
  criterion_id uuid not null references scoring_criteria(id) on delete cascade,
  score numeric not null,
  comments text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (jury_id, team_id, criterion_id)
);

-- Enable RLS
alter table profiles enable row level security;
alter table competitions enable row level security;
alter table teams enable row level security;
alter table team_members enable row level security;
alter table jury_assignments enable row level security;
alter table scoring_criteria enable row level security;
alter table scores enable row level security;

-- Helper function to check if user is admin
create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role = 'admin' and is_active = true
  );
$$ language sql security definer;

-- profiles
create policy "Admins can manage profiles" on profiles
  for all using (is_admin());

create policy "Users can read own profile" on profiles
  for select using (auth.uid() = id);

-- competitions
create policy "Admins can manage competitions" on competitions
  for all using (is_admin());

create policy "Jury can read assigned competitions" on competitions
  for select using (
    is_admin() or 
    exists (
      select 1 from jury_assignments
      where jury_assignments.competition_id = competitions.id
      and jury_assignments.jury_id = auth.uid()
    )
  );

-- teams
create policy "Admins can manage teams" on teams
  for all using (is_admin());

create policy "Jury can read teams in assigned competitions" on teams
  for select using (
    is_admin() or 
    exists (
      select 1 from jury_assignments
      where jury_assignments.competition_id = teams.competition_id
      and jury_assignments.jury_id = auth.uid()
    )
  );

-- team_members
create policy "Admins can manage team_members" on team_members
  for all using (is_admin());

create policy "Jury can read team members in assigned competitions" on team_members
  for select using (
    is_admin() or 
    exists (
      select 1 from teams
      join jury_assignments on jury_assignments.competition_id = teams.competition_id
      where teams.id = team_members.team_id
      and jury_assignments.jury_id = auth.uid()
    )
  );

-- jury_assignments
create policy "Admins can manage jury_assignments" on jury_assignments
  for all using (is_admin());

create policy "Jury can read own assignments" on jury_assignments
  for select using (jury_id = auth.uid());

-- scoring_criteria
create policy "Admins can manage scoring_criteria" on scoring_criteria
  for all using (is_admin());

create policy "Jury can read criteria for assigned competitions" on scoring_criteria
  for select using (
    is_admin() or 
    exists (
      select 1 from jury_assignments
      where jury_assignments.competition_id = scoring_criteria.competition_id
      and jury_assignments.jury_id = auth.uid()
    )
  );

-- scores
create policy "Admins can manage scores" on scores
  for all using (is_admin());

create policy "Jury can read own scores" on scores
  for select using (jury_id = auth.uid());

create policy "Jury can insert own scores" on scores
  for insert with check (
    jury_id = auth.uid() and
    exists (
      select 1 from teams
      join jury_assignments on jury_assignments.competition_id = teams.competition_id
      where teams.id = scores.team_id
      and jury_assignments.jury_id = auth.uid()
    )
  );

create policy "Jury can update own scores" on scores
  for update using (
    jury_id = auth.uid() and
    exists (
      select 1 from teams
      join jury_assignments on jury_assignments.competition_id = teams.competition_id
      where teams.id = scores.team_id
      and jury_assignments.jury_id = auth.uid()
    )
  );

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, full_name, role)
  values (
    new.id,
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'full_name',
    coalesce(new.raw_user_meta_data->>'role', 'jury')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to automatically create profile
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
