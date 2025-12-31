import { supabase } from '@/integrations/supabase/client';

/**
 * Production gamification utilities
 * For use in actual app (not testing)
 */

export interface AwardXPResult {
    success: boolean;
    xp_awarded: number;
    total_xp: number;
    old_level: number;
    new_level: number;
    leveled_up: boolean;
}

export interface StreakResult {
    success: boolean;
    streak: number;
    streak_continued: boolean;
    streak_broken: boolean;
    streak_bonus_xp: number;
}

export interface AchievementResult {
    success: boolean;
    unlocked_count: number;
    achievements: Array<{
        id: string;
        code: string;
        title: string;
        icon: string;
        xp_reward: number;
    }>;
}

export const gamificationUtils = {
    /**
     * Award XP for completing a lesson
     */
    async awardLessonXP(
        lessonId: string,
        stars: number,
        isFirstCompletion: boolean
    ): Promise<AwardXPResult> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Calculate XP based on stars
        let xpAmount = stars * 10; // 10, 20, or 30 XP based on stars
        if (isFirstCompletion) {
            xpAmount += 15; // Bonus XP for first completion
        }

        const { data, error } = await supabase.rpc('award_xp', {
            _user_id: user.id,
            _xp_amount: xpAmount,
            _source_type: 'lesson_complete',
            _source_id: lessonId,
            _description: `Completed lesson with ${stars} star${stars > 1 ? 's' : ''}${isFirstCompletion ? ' (First time!)' : ''}`
        });

        if (error) throw error;

        // Update lesson count - get current values first
        const { data: currentStats } = await supabase
            .from('student_gamification')
            .select('total_lessons_completed, total_stars_earned')
            .eq('user_id', user.id)
            .single();

        if (currentStats) {
            const { error: updateError } = await supabase
                .from('student_gamification')
                .update({
                    total_lessons_completed: (currentStats.total_lessons_completed || 0) + 1,
                    total_stars_earned: (currentStats.total_stars_earned || 0) + stars
                })
                .eq('user_id', user.id);

            if (updateError) console.error('Failed to update lesson stats:', updateError);
        }

        return data as unknown as AwardXPResult;
    },

    /**
     * Award XP for completing a quiz
     */
    async awardQuizXP(
        quizId: string,
        score: number,
        totalQuestions: number
    ): Promise<AwardXPResult> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Calculate XP based on score percentage
        const percentage = (score / totalQuestions) * 100;
        let xpAmount = 0;

        if (percentage === 100) {
            xpAmount = 50; // Perfect score
        } else if (percentage >= 80) {
            xpAmount = 30; // Good score
        } else if (percentage >= 60) {
            xpAmount = 15; // Pass
        }

        if (xpAmount === 0) {
            // Return early if no XP awarded
            const stats = await this.getStats();
            return {
                success: true,
                xp_awarded: 0,
                total_xp: stats?.total_xp || 0,
                old_level: stats?.current_level || 1,
                new_level: stats?.current_level || 1,
                leveled_up: false
            };
        }

        const { data, error } = await supabase.rpc('award_xp', {
            _user_id: user.id,
            _xp_amount: xpAmount,
            _source_type: 'quiz_complete',
            _source_id: quizId,
            _description: `Quiz score: ${score}/${totalQuestions} (${percentage.toFixed(0)}%)`
        });

        if (error) throw error;

        // Update quiz count
        const { data: currentStats } = await supabase
            .from('student_gamification')
            .select('total_quizzes_completed')
            .eq('user_id', user.id)
            .single();

        if (currentStats) {
            const { error: updateError } = await supabase
                .from('student_gamification')
                .update({
                    total_quizzes_completed: (currentStats.total_quizzes_completed || 0) + 1
                })
                .eq('user_id', user.id);

            if (updateError) console.error('Failed to update quiz stats:', updateError);
        }

        return data as unknown as AwardXPResult;
    },

    /**
     * Update daily streak
     */
    async updateDailyStreak(): Promise<StreakResult> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase.rpc('update_streak', {
            _user_id: user.id
        });

        if (error) throw error;
        return data as unknown as StreakResult;
    },

    /**
     * Check and unlock achievements
     */
    async checkAndUnlockAchievements(): Promise<AchievementResult> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase.rpc('check_achievements', {
            _user_id: user.id
        });

        if (error) throw error;
        return data as unknown as AchievementResult;
    },

    /**
     * Get current gamification stats
     */
    async getStats() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('student_gamification')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (error) {
            // If no stats exist, they'll be created by trigger
            console.warn('No gamification stats found');
            return null;
        }

        return data;
    },

    /**
     * Complete lesson - triggers all gamification logic
     * Call this when a user completes a lesson
     */
    async completeLessonWithGamification(
        lessonId: string,
        stars: number,
        isFirstCompletion: boolean
    ): Promise<{
        xpResult: AwardXPResult;
        streakResult: StreakResult;
        achievementResult: AchievementResult;
    }> {
        // Award XP for lesson
        const xpResult = await this.awardLessonXP(lessonId, stars, isFirstCompletion);

        // Update streak
        const streakResult = await this.updateDailyStreak();

        // Check for achievements
        const achievementResult = await this.checkAndUnlockAchievements();

        return {
            xpResult,
            streakResult,
            achievementResult
        };
    }
};
