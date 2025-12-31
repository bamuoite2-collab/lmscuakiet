import { supabase } from '@/integrations/supabase/client';

export const GamificationTestUtils = {
    /**
     * Award XP to current user
     */
    async awardXP(amount: number, description: string = 'Manual test') {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase.rpc('award_xp', {
            _user_id: user.id,
            _xp_amount: amount,
            _source_type: 'manual',
            _source_id: null,
            _description: description
        });

        if (error) throw error;
        return data;
    },

    /**
     * Update streak for current user
     */
    async updateStreak() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase.rpc('update_streak', {
            _user_id: user.id
        });

        if (error) throw error;
        return data;
    },

    /**
     * Check achievements for current user
     */
    async checkAchievements() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase.rpc('check_achievements', {
            _user_id: user.id
        });

        if (error) throw error;
        return data;
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

        if (error) throw error;
        return data;
    },

    /**
     * Get XP transaction history
     */
    async getXPHistory(limit: number = 10) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('xp_transactions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data;
    },

    /**
     * Reset gamification data (for testing)
     */
    async resetData() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Update gamification stats
        const { error: updateError } = await supabase
            .from('student_gamification')
            .update({
                total_xp: 0,
                current_level: 1,
                xp_to_next_level: 100,
                current_streak: 0,
                longest_streak: 0,
                total_lessons_completed: 0,
                total_stars_earned: 0,
                total_quizzes_completed: 0
            })
            .eq('user_id', user.id);

        if (updateError) throw updateError;

        // Delete achievements
        const { error: achievementError } = await supabase
            .from('student_achievements')
            .delete()
            .eq('user_id', user.id);

        if (achievementError) throw achievementError;

        return { success: true };
    },

    /**
     * Simulate lesson completion
     */
    async simulateLessonComplete(stars: number = 3) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Award XP
        const xpAmount = stars * 10; // 10 XP per star
        await this.awardXP(xpAmount, `Completed lesson with ${stars} stars`);

        // Get current stats
        const { data: currentStats } = await supabase
            .from('student_gamification')
            .select('total_lessons_completed')
            .eq('user_id', user.id)
            .single();

        // Update lesson count
        const { error } = await supabase
            .from('student_gamification')
            .update({
                total_lessons_completed: (currentStats?.total_lessons_completed || 0) + 1
            })
            .eq('user_id', user.id);

        if (error) throw error;

        // Update streak
        await this.updateStreak();

        // Check achievements
        await this.checkAchievements();

        return { success: true, xp_awarded: xpAmount };
    }
};
