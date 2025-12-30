-- ================================================
-- GAMIFICATION PHASE 1: Core Features for THCS
-- Author: LMS Development Team
-- Date: 2025-12-30
-- Purpose: Add XP, Levels, Streaks, Badges, and Daily Quests
-- Target: THCS students (grades 6-9)
-- ================================================

-- ================================================
-- TABLE 1: student_gamification
-- Core gamification stats per student
-- ================================================
CREATE TABLE IF NOT EXISTS student_gamification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  
  -- XP & Level
  total_xp INTEGER DEFAULT 0 NOT NULL CHECK (total_xp >= 0),
  current_level INTEGER DEFAULT 1 NOT NULL CHECK (current_level >= 1),
  xp_to_next_level INTEGER DEFAULT 100 NOT NULL CHECK (xp_to_next_level >= 0),
  
  -- Streak
  current_streak INTEGER DEFAULT 0 NOT NULL CHECK (current_streak >= 0),
  longest_streak INTEGER DEFAULT 0 NOT NULL CHECK (longest_streak >= 0),
  last_activity_date DATE,
  streak_freeze_count INTEGER DEFAULT 0 NOT NULL CHECK (streak_freeze_count >= 0),
  
  -- Stats
  total_lessons_completed INTEGER DEFAULT 0 NOT NULL CHECK (total_lessons_completed >= 0),
  total_stars_earned INTEGER DEFAULT 0 NOT NULL CHECK (total_stars_earned >= 0),
  total_quizzes_completed INTEGER DEFAULT 0 NOT NULL CHECK (total_quizzes_completed >= 0),
  
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Index for fast user lookup
CREATE INDEX IF NOT EXISTS idx_student_gamification_user_id ON student_gamification(user_id);

-- RLS Policies
ALTER TABLE student_gamification ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own gamification"
  ON student_gamification FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Students can update own gamification"
  ON student_gamification FOR UPDATE
  USING (auth.uid() = user_id);

COMMENT ON TABLE student_gamification IS 'Tracks gamification stats for THCS students including XP, levels, and streaks';

-- ================================================
-- TABLE 2: xp_transactions
-- Log of all XP earning activities
-- ================================================
CREATE TABLE IF NOT EXISTS xp_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  xp_amount INTEGER NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('lesson_complete', 'quiz_complete', 'streak_bonus', 'daily_quest', 'achievement', 'manual')),
  source_id UUID,
  description TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_xp_transactions_user_id ON xp_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_transactions_created_at ON xp_transactions(created_at DESC);

-- RLS
ALTER TABLE xp_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own xp transactions"
  ON xp_transactions FOR SELECT
  USING (auth.uid() = user_id);

COMMENT ON TABLE xp_transactions IS 'Audit log of all XP transactions for transparency and debugging';

-- ================================================
-- TABLE 3: achievements
-- Badge/achievement definitions
-- ================================================
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('learning', 'streak', 'mastery', 'social', 'special')),
  
  -- Unlock criteria (JSON)
  criteria JSONB NOT NULL,
  
  xp_reward INTEGER DEFAULT 0 NOT NULL CHECK (xp_reward >= 0),
  order_index INTEGER DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_achievements_category ON achievements(category);
CREATE INDEX IF NOT EXISTS idx_achievements_order ON achievements(order_index);

-- RLS
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active achievements"
  ON achievements FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage achievements"
  ON achievements FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

COMMENT ON TABLE achievements IS 'Achievement/badge definitions with unlock criteria';

-- ================================================
-- TABLE 4: student_achievements
-- Tracks unlocked achievements per student
-- ================================================
CREATE TABLE IF NOT EXISTS student_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE NOT NULL,
  
  unlocked_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  notified BOOLEAN DEFAULT false NOT NULL,
  
  UNIQUE(user_id, achievement_id)
);

CREATE INDEX IF NOT EXISTS idx_student_achievements_user_id ON student_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_student_achievements_unlocked_at ON student_achievements(unlocked_at DESC);

-- RLS
ALTER TABLE student_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own achievements"
  ON student_achievements FOR SELECT
  USING (auth.uid() = user_id);

COMMENT ON TABLE student_achievements IS 'Tracks which achievements each student has unlocked';

-- ================================================
-- TABLE 5: daily_quests
-- Daily quest templates
-- ================================================
CREATE TABLE IF NOT EXISTS daily_quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  
  quest_type TEXT NOT NULL CHECK (quest_type IN ('lesson_count', 'star_count', 'quiz_score', 'quiz_count', 'study_time')),
  target_value INTEGER NOT NULL CHECK (target_value > 0),
  
  xp_reward INTEGER NOT NULL CHECK (xp_reward > 0),
  difficulty TEXT DEFAULT 'easy' NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  
  is_active BOOLEAN DEFAULT true NOT NULL,
  weight INTEGER DEFAULT 1 NOT NULL CHECK (weight > 0),
  
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_daily_quests_active ON daily_quests(is_active) WHERE is_active = true;

-- RLS
ALTER TABLE daily_quests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active quests"
  ON daily_quests FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage quests"
  ON daily_quests FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

COMMENT ON TABLE daily_quests IS 'Quest templates for daily challenge system';

-- ================================================
-- TABLE 6: student_daily_quests
-- Tracks assigned quests and progress
-- ================================================
CREATE TABLE IF NOT EXISTS student_daily_quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  daily_quest_id UUID REFERENCES daily_quests(id) ON DELETE CASCADE NOT NULL,
  
  assigned_date DATE NOT NULL DEFAULT CURRENT_DATE,
  current_progress INTEGER DEFAULT 0 NOT NULL CHECK (current_progress >= 0),
  target_value INTEGER NOT NULL CHECK (target_value > 0),
  is_completed BOOLEAN DEFAULT false NOT NULL,
  completed_at TIMESTAMPTZ,
  
  UNIQUE(user_id, daily_quest_id, assigned_date)
);

CREATE INDEX IF NOT EXISTS idx_student_daily_quests_user_date ON student_daily_quests(user_id, assigned_date);

-- RLS
ALTER TABLE student_daily_quests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own daily quests"
  ON student_daily_quests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Students can update own quest progress"
  ON student_daily_quests FOR UPDATE
  USING (auth.uid() = user_id);

COMMENT ON TABLE student_daily_quests IS 'Tracks daily quest assignments and student progress';

-- ================================================
-- FUNCTION 1: Auto-create gamification profile
-- ================================================
CREATE OR REPLACE FUNCTION create_gamification_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO student_gamification (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Trigger on user creation
DROP TRIGGER IF EXISTS on_user_created_gamification ON auth.users;
CREATE TRIGGER on_user_created_gamification
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_gamification_profile();

COMMENT ON FUNCTION create_gamification_profile() IS 'Automatically creates gamification profile when new user signs up';

-- ================================================
-- FUNCTION 2: Award XP
-- ================================================
CREATE OR REPLACE FUNCTION award_xp(
  _user_id UUID,
  _xp_amount INTEGER,
  _source_type TEXT,
  _source_id UUID DEFAULT NULL,
  _description TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _gamification RECORD;
  _new_total_xp INTEGER;
  _new_level INTEGER;
  _old_level INTEGER;
  _leveled_up BOOLEAN := false;
BEGIN
  -- Validate XP amount
  IF _xp_amount <= 0 THEN
    RAISE EXCEPTION 'XP amount must be positive';
  END IF;
  
  -- Get current gamification data
  SELECT * INTO _gamification
  FROM student_gamification
  WHERE user_id = _user_id
  FOR UPDATE;
  
  IF NOT FOUND THEN
    -- Create profile if not exists
    INSERT INTO student_gamification (user_id)
    VALUES (_user_id)
    RETURNING * INTO _gamification;
  END IF;
  
  _old_level := _gamification.current_level;
  
  -- Calculate new XP
  _new_total_xp := _gamification.total_xp + _xp_amount;
  
  -- Calculate new level using formula: level = floor(sqrt(total_xp / 50)) + 1
  _new_level := FLOOR(SQRT(_new_total_xp / 50.0)) + 1;
  
  IF _new_level > _old_level THEN
    _leveled_up := true;
  END IF;
  
  -- Update gamification profile
  UPDATE student_gamification
  SET 
    total_xp = _new_total_xp,
    current_level = _new_level,
    xp_to_next_level = (POWER(_new_level, 2) * 50) - _new_total_xp,
    updated_at = now()
  WHERE user_id = _user_id;
  
  -- Log transaction
  INSERT INTO xp_transactions (user_id, xp_amount, source_type, source_id, description)
  VALUES (_user_id, _xp_amount, _source_type, _source_id, _description);
  
  -- Return result
  RETURN jsonb_build_object(
    'success', true,
    'xp_awarded', _xp_amount,
    'total_xp', _new_total_xp,
    'old_level', _old_level,
    'new_level', _new_level,
    'leveled_up', _leveled_up
  );
END;
$$;

COMMENT ON FUNCTION award_xp(UUID, INTEGER, TEXT, UUID, TEXT) IS 'Awards XP to student and calculates level progression';

-- ================================================
-- FUNCTION 3: Update Streak
-- ================================================
CREATE OR REPLACE FUNCTION update_streak(_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _gamification RECORD;
  _new_streak INTEGER;
  _streak_bonus_xp INTEGER := 0;
  _today DATE := CURRENT_DATE;
  _yesterday DATE := CURRENT_DATE - INTERVAL '1 day';
  _streak_broken BOOLEAN := false;
BEGIN
  SELECT * INTO _gamification
  FROM student_gamification
  WHERE user_id = _user_id
  FOR UPDATE;
  
  IF NOT FOUND THEN
    -- Create profile if not exists
    INSERT INTO student_gamification (user_id, current_streak, last_activity_date)
    VALUES (_user_id, 1, _today);
    
    RETURN jsonb_build_object(
      'success', true,
      'streak', 1,
      'streak_continued', false,
      'streak_broken', false,
      'streak_bonus_xp', 0
    );
  END IF;
  
  -- Calculate new streak
  IF _gamification.last_activity_date IS NULL THEN
    _new_streak := 1;
  ELSIF _gamification.last_activity_date = _today THEN
    -- Already counted today, no change
    RETURN jsonb_build_object(
      'success', true,
      'streak', _gamification.current_streak,
      'streak_continued', false,
      'streak_broken', false,
      'streak_bonus_xp', 0
    );
  ELSIF _gamification.last_activity_date = _yesterday THEN
    -- Continue streak
    _new_streak := _gamification.current_streak + 1;
    _streak_bonus_xp := 2 * _new_streak; -- Escalating bonus
  ELSE
    -- Streak broken
    _new_streak := 1;
    _streak_broken := true;
  END IF;
  
  -- Update gamification
  UPDATE student_gamification
  SET 
    current_streak = _new_streak,
    longest_streak = GREATEST(longest_streak, _new_streak),
    last_activity_date = _today,
    updated_at = now()
  WHERE user_id = _user_id;
  
  -- Award streak bonus XP if applicable
  IF _streak_bonus_xp > 0 THEN
    PERFORM award_xp(
      _user_id, 
      _streak_bonus_xp, 
      'streak_bonus', 
      NULL, 
      format('Streak chuỗi %s ngày', _new_streak)
    );
  END IF;
  
  RETURN jsonb_build_object(
    'success', true,
    'streak', _new_streak,
    'streak_continued', _new_streak > 1 AND NOT _streak_broken,
    'streak_broken', _streak_broken,
    'streak_bonus_xp', _streak_bonus_xp
  );
END;
$$;

COMMENT ON FUNCTION update_streak(UUID) IS 'Updates student streak based on daily activity';

-- ================================================
-- FUNCTION 4: Check and Award Achievements
-- ================================================
CREATE OR REPLACE FUNCTION check_achievements(_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _achievement RECORD;
  _gamification RECORD;
  _unlocked_achievements JSONB := '[]'::JSONB;
  _criteria_met BOOLEAN;
BEGIN
  -- Get student stats
  SELECT * INTO _gamification
  FROM student_gamification
  WHERE user_id = _user_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Profile not found');
  END IF;
  
  -- Check each achievement
  FOR _achievement IN 
    SELECT a.* FROM achievements a
    WHERE a.is_active = true
    AND NOT EXISTS (
      SELECT 1 FROM student_achievements sa
      WHERE sa.user_id = _user_id AND sa.achievement_id = a.id
    )
  LOOP
    _criteria_met := false;
    
    -- Check criteria based on type
    CASE _achievement.criteria->>'type'
      WHEN 'lesson_count' THEN
        _criteria_met := _gamification.total_lessons_completed >= (_achievement.criteria->>'count')::INTEGER;
      WHEN 'streak_days' THEN
        _criteria_met := _gamification.current_streak >= (_achievement.criteria->>'days')::INTEGER;
      WHEN 'stars_earned' THEN
        _criteria_met := _gamification.total_stars_earned >= (_achievement.criteria->>'count')::INTEGER;
      WHEN 'level_reached' THEN
        _criteria_met := _gamification.current_level >= (_achievement.criteria->>'level')::INTEGER;
      ELSE
        _criteria_met := false;
    END CASE;
    
    -- Unlock achievement if criteria met
    IF _criteria_met THEN
      INSERT INTO student_achievements (user_id, achievement_id)
      VALUES (_user_id, _achievement.id)
      ON CONFLICT DO NOTHING;
      
      -- Award XP reward
      IF _achievement.xp_reward > 0 THEN
        PERFORM award_xp(
          _user_id,
          _achievement.xp_reward,
          'achievement',
          _achievement.id,
          format('Mở khóa: %s', _achievement.title)
        );
      END IF;
      
      -- Add to unlocked list
      _unlocked_achievements := _unlocked_achievements || jsonb_build_object(
        'id', _achievement.id,
        'code', _achievement.code,
        'title', _achievement.title,
        'icon', _achievement.icon,
        'xp_reward', _achievement.xp_reward
      );
    END IF;
  END LOOP;
  
  RETURN jsonb_build_object(
    'success', true,
    'unlocked_count', jsonb_array_length(_unlocked_achievements),
    'achievements', _unlocked_achievements
  );
END;
$$;

COMMENT ON FUNCTION check_achievements(UUID) IS 'Checks and awards achievements based on student progress';

-- ================================================
-- SEED DATA: Sample Achievements
-- ================================================
INSERT INTO achievements (code, title, description, icon, category, criteria, xp_reward, order_index) VALUES
  ('first_lesson', 'Khởi Đầu', 'Hoàn thành bài học đầu tiên', '🎯', 'learning', '{"type": "lesson_count", "count": 1}'::JSONB, 10, 1),
  ('lesson_5', 'Học Sinh Siêng Năng', 'Hoàn thành 5 bài học', '📚', 'learning', '{"type": "lesson_count", "count": 5}'::JSONB, 25, 2),
  ('lesson_10', 'Thần Đồng Nhỏ', 'Hoàn thành 10 bài học', '🌟', 'learning', '{"type": "lesson_count", "count": 10}'::JSONB, 50, 3),
  ('streak_3', 'Kiên Trì', 'Học liên tục 3 ngày', '🔥', 'streak', '{"type": "streak_days", "days": 3}'::JSONB, 15, 4),
  ('streak_7', 'Tuần Hoàn Hảo', 'Học liên tục 7 ngày', '⚡', 'streak', '{"type": "streak_days", "days": 7}'::JSONB, 35, 5),
  ('streak_30', 'Huyền Thoại', 'Học liên tục 30 ngày', '💎', 'streak', '{"type": "streak_days", "days": 30}'::JSONB, 100, 6),
  ('stars_10', 'Thu Thập Sao', 'Đạt 10 ngôi sao', '⭐', 'mastery', '{"type": "stars_earned", "count": 10}'::JSONB, 20, 7),
  ('level_5', 'Cấp 5', 'Đạt cấp độ 5', '🏆', 'mastery', '{"type": "level_reached", "level": 5}'::JSONB, 30, 8)
ON CONFLICT (code) DO NOTHING;

-- ================================================
-- SEED DATA: Sample Daily Quests
-- ================================================
INSERT INTO daily_quests (code, title, description, icon, quest_type, target_value, xp_reward, difficulty, weight) VALUES
  ('complete_3_lessons', 'Học 3 bài', 'Hoàn thành 3 bài học hôm nay', '📖', 'lesson_count', 3, 15, 'easy', 10),
  ('complete_5_lessons', 'Học 5 bài', 'Hoàn thành 5 bài học hôm nay', '📚', 'lesson_count', 5, 30, 'medium', 5),
  ('earn_5_stars', 'Đạt 5 sao', 'Đạt 5 ngôi sao hôm nay', '⭐', 'star_count', 5, 20, 'medium', 8),
  ('earn_10_stars', 'Đạt 10 sao', 'Đạt 10 ngôi sao hôm nay', '🌟', 'star_count', 10, 40, 'hard', 3),
  ('complete_2_quizzes', 'Làm 2 quiz', 'Hoàn thành 2 bài quiz hôm nay', '❓', 'quiz_count', 2, 10, 'easy', 10)
ON CONFLICT (code) DO NOTHING;

-- ================================================
-- VERIFICATION QUERIES
-- ================================================
COMMENT ON SCHEMA public IS 'Gamification Phase 1 migration completed successfully';
