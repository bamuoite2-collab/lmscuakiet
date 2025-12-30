-- ========================================
-- DEBUG QUERIES FOR GAMIFICATION
-- ========================================

-- 1. Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'student_gamification',
  'xp_transactions',
  'achievements',
  'student_achievements',
  'daily_quests',
  'student_daily_quests'
);
-- Expected: 6 rows

-- 2. Check if award_xp function exists
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('award_xp', 'update_streak', 'check_achievements');
-- Expected: 3 functions

-- 3. Check your USER ID
SELECT auth.uid() AS your_user_id;

-- 4. Check if your gamification profile exists
SELECT * FROM student_gamification 
WHERE user_id = auth.uid();
-- If empty, profile not created

-- 5. Manually test award_xp
-- REPLACE 'YOUR_USER_ID' with actual UUID from step 3
SELECT award_xp(
  'YOUR_USER_ID'::uuid,
  15::integer,
  'lesson_complete'::text,
  NULL,
  'Debug test'::text
);
-- Should return JSON with success: true

-- 6. Check XP transactions
SELECT * FROM xp_transactions 
WHERE user_id = auth.uid()
ORDER BY created_at DESC
LIMIT 10;

-- 7. Check if trigger on auth.users exists
SELECT trigger_name, event_object_table, action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_user_created_gamification';

-- 8. Manually create profile if missing
INSERT INTO student_gamification (user_id)
VALUES (auth.uid())
ON CONFLICT (user_id) DO NOTHING;

-- 9. Test complete lesson flow
DO $$
DECLARE
  _user_id uuid := auth.uid();
  _lesson_id uuid := gen_random_uuid();
  _result jsonb;
BEGIN
  -- Award XP
  SELECT award_xp(_user_id, 25, 'lesson_complete', _lesson_id, 'Test lesson') INTO _result;
  RAISE NOTICE 'Award XP result: %', _result;
  
  -- Update streak
  SELECT update_streak(_user_id) INTO _result;
  RAISE NOTICE 'Update streak result: %', _result;
  
  -- Check achievements
  SELECT check_achievements(_user_id) INTO _result;
  RAISE NOTICE 'Check achievements result: %', _result;
END $$;

-- 10. View your full gamification state
SELECT 
  sg.*,
  (SELECT COUNT(*) FROM xp_transactions WHERE user_id = sg.user_id) as transaction_count,
  (SELECT COUNT(*) FROM student_achievements WHERE user_id = sg.user_id) as achievement_count
FROM student_gamification sg
WHERE user_id = auth.uid();
