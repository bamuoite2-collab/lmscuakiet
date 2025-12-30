# URGENT: Database Migration Required

## Action Needed
Please run the following migration file to add gamification features:

**Migration File:** `supabase/migrations/20251230142200_gamification_phase1.sql`

## What This Migration Does
Creates 6 new tables for THCS gamification system:
- `student_gamification` - XP, levels, streaks
- `xp_transactions` - XP audit log
- `achievements` - Badge definitions (8 pre-seeded)
- `student_achievements` - Student unlocks
- `daily_quests` - Quest templates (5 pre-seeded)
- `student_daily_quests` - Quest progress

Also creates 4 PostgreSQL functions:
- `award_xp()` - Award XP to students
- `update_streak()` - Track learning streaks
- `check_achievements()` - Auto-unlock badges
- `create_gamification_profile()` - Auto-create on signup

## Why Migration Failed
The migration file exists but hasn't been applied to the database yet. The app is throwing errors:
- "Error awarding XP: Object"
- "Error checking achievements: Object"

This is because the tables and functions don't exist in the database.

## How to Fix
Run the migration file in Supabase SQL editor OR configure Lovable to auto-run migrations from the `supabase/migrations/` folder.

## Verification
After running, these queries should work:
```sql
SELECT * FROM student_gamification LIMIT 1;
SELECT * FROM achievements;
SELECT award_xp(auth.uid(), 10, 'test', NULL, 'Test');
```

## Priority
**CRITICAL** - The gamification features are fully implemented in code but cannot function without the database schema.

---
Created: 2025-12-30
Status: PENDING
