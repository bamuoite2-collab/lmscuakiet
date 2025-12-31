-- Progress Analytics Schema Migration
-- Creates tables and functions for tracking student learning analytics

-- =====================================================
-- 1. STUDY SESSIONS TABLE
-- =====================================================
create table if not exists study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  duration_minutes integer,
  lesson_id uuid references lessons(id) on delete set null,
  activity_type text check (activity_type in ('lesson', 'quiz', 'practice')),
  completed boolean default false,
  created_at timestamptz default now()
);

-- Indexes for performance
create index if not exists idx_study_sessions_user_id on study_sessions(user_id);
create index if not exists idx_study_sessions_user_date on study_sessions(user_id, started_at desc);
create index if not exists idx_study_sessions_lesson on study_sessions(lesson_id);

-- RLS Policies
alter table study_sessions enable row level security;

create policy "Users can view own study sessions"
  on study_sessions for select
  using (auth.uid() = user_id);

create policy "Users can create own study sessions"
  on study_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own study sessions"
  on study_sessions for update
  using (auth.uid() = user_id);

-- =====================================================
-- 2. DAILY ANALYTICS TABLE
-- =====================================================
create table if not exists daily_analytics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  date date not null,
  total_study_minutes integer default 0,
  lessons_completed integer default 0,
  quizzes_attempted integer default 0,
  xp_earned integer default 0,
  stars_earned integer default 0,
  correct_answers integer default 0,
  total_answers integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, date)
);

-- Indexes
create index if not exists idx_daily_analytics_user_id on daily_analytics(user_id);
create index if not exists idx_daily_analytics_user_date on daily_analytics(user_id, date desc);

-- RLS Policies
alter table daily_analytics enable row level security;

create policy "Users can view own daily analytics"
  on daily_analytics for select
  using (auth.uid() = user_id);

create policy "Users can insert own daily analytics"
  on daily_analytics for insert
  with check (auth.uid() = user_id);

create policy "Users can update own daily analytics"
  on daily_analytics for update
  using (auth.uid() = user_id);

-- =====================================================
-- 3. RPC FUNCTIONS
-- =====================================================

-- Calculate weekly stats
create or replace function calculate_weekly_stats(
  p_user_id uuid,
  p_week_start date default current_date - interval '7 days'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_stats jsonb;
begin
  select jsonb_build_object(
    'total_study_minutes', coalesce(sum(total_study_minutes), 0),
    'total_lessons', coalesce(sum(lessons_completed), 0),
    'total_quizzes', coalesce(sum(quizzes_attempted), 0),
    'total_xp', coalesce(sum(xp_earned), 0),
    'total_stars', coalesce(sum(stars_earned), 0),
    'accuracy', case 
      when sum(total_answers) > 0 
      then round((sum(correct_answers)::numeric / sum(total_answers) * 100), 1)
      else 0
    end,
    'days_active', count(distinct date),
    'avg_study_minutes', round(coalesce(avg(total_study_minutes), 0), 1)
  ) into v_stats
  from daily_analytics
  where user_id = p_user_id
    and date >= p_week_start
    and date < p_week_start + interval '7 days';
  
  return v_stats;
end;
$$;

-- Get streak data for heatmap (last 365 days)
create or replace function get_streak_heatmap(p_user_id uuid)
returns table(
  date date,
  study_minutes integer,
  lessons_completed integer,
  intensity integer
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  select 
    da.date,
    da.total_study_minutes as study_minutes,
    da.lessons_completed,
    case 
      when da.total_study_minutes = 0 then 0
      when da.total_study_minutes < 15 then 1
      when da.total_study_minutes < 30 then 2
      when da.total_study_minutes < 60 then 3
      else 4
    end as intensity
  from daily_analytics da
  where da.user_id = p_user_id
    and da.date >= current_date - interval '365 days'
  order by da.date desc;
end;
$$;

-- Update daily analytics
create or replace function update_daily_analytics_for_date(
  p_user_id uuid,
  p_date date default current_date
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_study_minutes integer;
  v_lessons integer;
  v_quizzes integer;
  v_xp integer;
begin
  -- Calculate study time
  select coalesce(sum(duration_minutes), 0)
  into v_study_minutes
  from study_sessions
  where user_id = p_user_id
    and date(started_at) = p_date;
  
  -- Calculate lessons completed from student_progress
  select count(*)
  into v_lessons
  from student_progress
  where user_id = p_user_id
    and completed = true
    and date(completed_at) = p_date;
  
  -- Calculate quizzes from quiz_attempts
  select count(*)
  into v_quizzes
  from quiz_attempts
  where user_id = p_user_id
    and date(completed_at) = p_date;
  
  -- Calculate XP from xp_transactions
  select coalesce(sum(xp_amount), 0)
  into v_xp
  from xp_transactions
  where user_id = p_user_id
    and date(created_at) = p_date;
  
  -- Insert or update
  insert into daily_analytics (
    user_id, date, total_study_minutes, lessons_completed,
    quizzes_attempted, xp_earned, updated_at
  ) values (
    p_user_id, p_date, v_study_minutes, v_lessons,
    v_quizzes, v_xp, now()
  )
  on conflict (user_id, date) do update set
    total_study_minutes = excluded.total_study_minutes,
    lessons_completed = excluded.lessons_completed,
    quizzes_attempted = excluded.quizzes_attempted,
    xp_earned = excluded.xp_earned,
    updated_at = now();
end;
$$;

-- =====================================================
-- 4. TRIGGERS
-- =====================================================

-- Auto-update daily analytics when study session ends
create or replace function trigger_update_daily_analytics()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if NEW.ended_at is not null and (OLD.ended_at is null or OLD.ended_at is distinct from NEW.ended_at) then
    perform update_daily_analytics_for_date(NEW.user_id, date(NEW.started_at));
  end if;
  return NEW;
end;
$$;

drop trigger if exists study_session_ended on study_sessions;
create trigger study_session_ended
  after update on study_sessions
  for each row
  execute function trigger_update_daily_analytics();