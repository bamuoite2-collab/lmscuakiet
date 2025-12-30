# Lovable Migration Trigger

This file forces Lovable to detect and run pending migrations.

Migration to run: `20251230142200_gamification_phase1.sql`

## Tables to create:
- student_gamification
- xp_transactions  
- achievements
- student_achievements
- daily_quests
- student_daily_quests

## Functions to create:
- award_xp()
- update_streak()
- check_achievements()

Timestamp: 2025-12-30T15:40:00+07:00
