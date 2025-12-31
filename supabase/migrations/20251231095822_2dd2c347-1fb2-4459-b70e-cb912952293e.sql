-- Seasonal Events System Migration
-- Creates tables and functions for managing seasonal events

-- =====================================================
-- 1. SEASONAL EVENTS TABLE
-- =====================================================
create table if not exists seasonal_events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  event_type text check (event_type in ('tet', 'summer', 'backtoschool', 'holiday', 'custom')),
  start_date timestamptz not null,
  end_date timestamptz not null,
  is_active boolean default false,
  theme_config jsonb default '{}'::jsonb,
  bonus_xp_multiplier numeric default 1.0,
  icon text default '🎉',
  banner_image text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_seasonal_events_active on seasonal_events(is_active, start_date, end_date);
create index if not exists idx_seasonal_events_dates on seasonal_events(start_date, end_date);

-- =====================================================
-- 2. EVENT QUESTS TABLE
-- =====================================================
create table if not exists event_quests (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references seasonal_events(id) on delete cascade not null,
  title text not null,
  description text,
  quest_type text,
  target_value integer not null,
  xp_reward integer default 0,
  bonus_reward jsonb default '{}'::jsonb,
  difficulty text check (difficulty in ('easy', 'medium', 'hard')) default 'medium',
  icon text default '🎯',
  order_index integer default 0,
  created_at timestamptz default now()
);

create index if not exists idx_event_quests_event on event_quests(event_id, order_index);

-- =====================================================
-- 3. USER EVENT PROGRESS TABLE
-- =====================================================
create table if not exists user_event_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  event_id uuid references seasonal_events(id) on delete cascade not null,
  event_quest_id uuid references event_quests(id) on delete cascade,
  current_progress integer default 0,
  target_value integer not null,
  completed boolean default false,
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, event_quest_id)
);

create index if not exists idx_user_event_progress_user on user_event_progress(user_id, event_id);
create index if not exists idx_user_event_progress_quest on user_event_progress(event_quest_id);

-- =====================================================
-- 4. EVENT ACHIEVEMENTS TABLE
-- =====================================================
create table if not exists event_achievements (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references seasonal_events(id) on delete cascade not null,
  code text unique not null,
  title text not null,
  description text,
  icon text default '🏆',
  xp_reward integer default 0,
  criteria jsonb not null,
  created_at timestamptz default now()
);

create index if not exists idx_event_achievements_event on event_achievements(event_id);

-- =====================================================
-- 5. USER EVENT ACHIEVEMENTS TABLE
-- =====================================================
create table if not exists user_event_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  event_achievement_id uuid references event_achievements(id) on delete cascade not null,
  unlocked_at timestamptz default now(),
  unique(user_id, event_achievement_id)
);

create index if not exists idx_user_event_achievements_user on user_event_achievements(user_id);

-- =====================================================
-- 6. RLS POLICIES
-- =====================================================

-- seasonal_events: public read, admin manage
alter table seasonal_events enable row level security;
create policy "Anyone can view events" on seasonal_events for select using (true);
create policy "Only admins can manage events" on seasonal_events for all using (has_role(auth.uid(), 'admin'::app_role));

-- event_quests: public read, admin manage
alter table event_quests enable row level security;
create policy "Anyone can view event quests" on event_quests for select using (true);
create policy "Only admins can manage event quests" on event_quests for all using (has_role(auth.uid(), 'admin'::app_role));

-- user_event_progress: users own data
alter table user_event_progress enable row level security;
create policy "Users can view own event progress" on user_event_progress for select using (auth.uid() = user_id);
create policy "Users can insert own event progress" on user_event_progress for insert with check (auth.uid() = user_id);
create policy "Users can update own event progress" on user_event_progress for update using (auth.uid() = user_id);

-- event_achievements: public read
alter table event_achievements enable row level security;
create policy "Anyone can view event achievements" on event_achievements for select using (true);
create policy "Only admins can manage event achievements" on event_achievements for all using (has_role(auth.uid(), 'admin'::app_role));

-- user_event_achievements: users own data
alter table user_event_achievements enable row level security;
create policy "Users can view own event achievements" on user_event_achievements for select using (auth.uid() = user_id);
create policy "Users can insert own event achievements" on user_event_achievements for insert with check (auth.uid() = user_id);

-- =====================================================
-- 7. RPC FUNCTIONS
-- =====================================================

-- Get currently active events
create or replace function get_active_events()
returns setof seasonal_events
language sql
security definer
set search_path = public
as $$
  select *
  from seasonal_events
  where is_active = true
    and start_date <= now()
    and end_date >= now()
  order by start_date desc;
$$;

-- Get user's event progress
create or replace function get_user_event_progress(p_user_id uuid, p_event_id uuid)
returns table(
  quest_id uuid,
  quest_title text,
  quest_description text,
  quest_icon text,
  quest_type text,
  target_value integer,
  current_progress integer,
  xp_reward integer,
  difficulty text,
  completed boolean,
  completed_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  select
    eq.id as quest_id,
    eq.title as quest_title,
    eq.description as quest_description,
    eq.icon as quest_icon,
    eq.quest_type,
    coalesce(uep.target_value, eq.target_value) as target_value,
    coalesce(uep.current_progress, 0) as current_progress,
    eq.xp_reward,
    eq.difficulty,
    coalesce(uep.completed, false) as completed,
    uep.completed_at
  from event_quests eq
  left join user_event_progress uep on eq.id = uep.event_quest_id and uep.user_id = p_user_id
  where eq.event_id = p_event_id
  order by eq.order_index;
end;
$$;

-- Complete event quest
create or replace function complete_event_quest(
  p_user_id uuid,
  p_quest_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_quest record;
  v_progress record;
begin
  select * into v_quest from event_quests where id = p_quest_id;
  
  if not found then
    return jsonb_build_object('success', false, 'error', 'Quest not found');
  end if;
  
  select * into v_progress
  from user_event_progress
  where user_id = p_user_id and event_quest_id = p_quest_id;
  
  if not found then
    insert into user_event_progress (user_id, event_id, event_quest_id, target_value, current_progress, completed, completed_at)
    values (p_user_id, v_quest.event_id, p_quest_id, v_quest.target_value, v_quest.target_value, true, now())
    returning * into v_progress;
  else
    update user_event_progress
    set current_progress = v_quest.target_value,
        completed = true,
        completed_at = now()
    where id = v_progress.id
    returning * into v_progress;
  end if;
  
  if v_quest.xp_reward > 0 then
    insert into xp_transactions (user_id, xp_amount, source_type, description)
    values (p_user_id, v_quest.xp_reward, 'event_quest', v_quest.title);
  end if;
  
  return jsonb_build_object(
    'success', true,
    'xp_awarded', v_quest.xp_reward,
    'quest_completed', true
  );
end;
$$;

-- Get event leaderboard
create or replace function get_event_leaderboard(p_event_id uuid, p_limit integer default 50)
returns table(
  rank bigint,
  user_id uuid,
  full_name text,
  quests_completed bigint,
  total_xp integer
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  with event_stats as (
    select
      uep.user_id,
      count(*) filter (where uep.completed = true) as quests_completed,
      sum(eq.xp_reward) filter (where uep.completed = true) as total_xp
    from user_event_progress uep
    join event_quests eq on uep.event_quest_id = eq.id
    where uep.event_id = p_event_id
    group by uep.user_id
  )
  select
    row_number() over (order by es.total_xp desc, es.quests_completed desc) as rank,
    es.user_id,
    coalesce(p.full_name, 'Anonymous') as full_name,
    es.quests_completed,
    coalesce(es.total_xp, 0)::integer as total_xp
  from event_stats es
  left join profiles p on es.user_id = p.user_id
  order by es.total_xp desc, es.quests_completed desc
  limit p_limit;
end;
$$;

-- Update event progress
create or replace function update_event_quest_progress(
  p_user_id uuid,
  p_quest_type text,
  p_increment integer default 1
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_quest record;
  v_progress record;
begin
  for v_quest in
    select eq.*
    from event_quests eq
    join seasonal_events se on eq.event_id = se.id
    where se.is_active = true
      and se.start_date <= now()
      and se.end_date >= now()
      and eq.quest_type = p_quest_type
  loop
    select * into v_progress
    from user_event_progress
    where user_id = p_user_id and event_quest_id = v_quest.id;
    
    if found then
      if not v_progress.completed then
        update user_event_progress
        set current_progress = least(current_progress + p_increment, target_value),
            completed = (current_progress + p_increment >= target_value),
            completed_at = case when (current_progress + p_increment >= target_value) then now() else null end,
            updated_at = now()
        where id = v_progress.id;
        
        if (v_progress.current_progress + p_increment >= v_progress.target_value) and v_quest.xp_reward > 0 then
          insert into xp_transactions (user_id, xp_amount, source_type, description)
          values (p_user_id, v_quest.xp_reward, 'event_quest', v_quest.title);
        end if;
      end if;
    else
      insert into user_event_progress (user_id, event_id, event_quest_id, target_value, current_progress, completed, completed_at)
      values (
        p_user_id,
        v_quest.event_id,
        v_quest.id,
        v_quest.target_value,
        least(p_increment, v_quest.target_value),
        p_increment >= v_quest.target_value,
        case when p_increment >= v_quest.target_value then now() else null end
      );
      
      if p_increment >= v_quest.target_value and v_quest.xp_reward > 0 then
        insert into xp_transactions (user_id, xp_amount, source_type, description)
        values (p_user_id, v_quest.xp_reward, 'event_quest', v_quest.title);
      end if;
    end if;
  end loop;
end;
$$;

-- =====================================================
-- 8. SAMPLE DATA - Tết Event
-- =====================================================

-- Insert Tết event
insert into seasonal_events (id, name, description, event_type, start_date, end_date, is_active, theme_config, bonus_xp_multiplier, icon)
values (
  'a0000000-0000-0000-0000-000000000001',
  'Tết Nguyên Đán 2025',
  'Chúc mừng năm mới! Hoàn thành nhiệm vụ đặc biệt để nhận phần thưởng Tết',
  'tet',
  '2025-01-25'::timestamptz,
  '2025-02-05'::timestamptz,
  false,
  '{
    "primaryColor": "#d4af37",
    "secondaryColor": "#ff0000",
    "backgroundColor": "#fff5f5",
    "decoration": "fireworks",
    "themes": ["lanterns", "lucky_money"]
  }'::jsonb,
  1.5,
  '🧧'
);

-- Tết Quests
insert into event_quests (event_id, title, description, quest_type, target_value, xp_reward, difficulty, icon, order_index)
values
  ('a0000000-0000-0000-0000-000000000001', 'Chăm Chỉ Đầu Năm', 'Hoàn thành 10 bài học trong sự kiện Tết', 'complete_lessons', 10, 200, 'medium', '📚', 1),
  ('a0000000-0000-0000-0000-000000000001', 'Streak Đầu Xuân', 'Giữ streak liên tục 7 ngày', 'maintain_streak', 7, 300, 'hard', '🔥', 2),
  ('a0000000-0000-0000-0000-000000000001', 'Thủ Khoa Năm Mới', 'Đạt điểm 90%+ trong 5 bài quiz', 'high_score', 5, 250, 'hard', '🌟', 3),
  ('a0000000-0000-0000-0000-000000000001', 'Tích Cực Học Tập', 'Học ít nhất 2 giờ trong tuần', 'study_time', 120, 150, 'easy', '⏰', 4);

-- Event Achievements
insert into event_achievements (event_id, code, title, description, icon, xp_reward, criteria)
values
  ('a0000000-0000-0000-0000-000000000001', 'tet_2025_complete_all', '🧧 Lì Xì May Mắn', 'Hoàn thành tất cả nhiệm vụ Tết', '🧧', 500, '{"type": "complete_all_quests"}'::jsonb),
  ('a0000000-0000-0000-0000-000000000001', 'tet_2025_top10', '🏮 Đèn Lồng Vàng', 'Lọt top 10 bảng xếp hạng Tết', '🏮', 1000, '{"type": "leaderboard_rank", "max_rank": 10}'::jsonb);