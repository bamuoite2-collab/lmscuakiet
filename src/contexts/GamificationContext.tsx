import React, { createContext, useContext, useCallback, ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { gamificationUtils, AwardXPResult, StreakResult, AchievementResult } from '@/lib/gamification-utils';
import { Database } from '@/integrations/supabase/types';

type StudentGamification = Database['public']['Tables']['student_gamification']['Row'];

interface GamificationContextType {
    stats: StudentGamification | null;
    isLoading: boolean;
    error: Error | null;
    awardLessonXP: (lessonId: string, stars: number, isFirstCompletion: boolean) => Promise<AwardXPResult>;
    awardQuizXP: (quizId: string, score: number, totalQuestions: number) => Promise<AwardXPResult>;
    updateStreak: () => Promise<StreakResult>;
    checkAchievements: () => Promise<AchievementResult>;
    completeLessonWithGamification: (lessonId: string, stars: number, isFirstCompletion: boolean) => Promise<{
        xpResult: AwardXPResult;
        streakResult: StreakResult;
        achievementResult: AchievementResult;
    }>;
    refreshStats: () => Promise<void>;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export function GamificationProvider({ children }: { children: ReactNode }) {
    const queryClient = useQueryClient();

    // Fetch gamification stats
    const { data: stats, isLoading, error } = useQuery({
        queryKey: ['gamification-stats'],
        queryFn: () => gamificationUtils.getStats(),
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1
    });

    // Refresh stats function
    const refreshStats = useCallback(async () => {
        await queryClient.invalidateQueries({ queryKey: ['gamification-stats'] });
    }, [queryClient]);

    // Award lesson XP with auto-refresh
    const awardLessonXP = useCallback(async (
        lessonId: string,
        stars: number,
        isFirstCompletion: boolean
    ) => {
        const result = await gamificationUtils.awardLessonXP(lessonId, stars, isFirstCompletion);
        await refreshStats();
        return result;
    }, [refreshStats]);

    // Award quiz XP with auto-refresh
    const awardQuizXP = useCallback(async (
        quizId: string,
        score: number,
        totalQuestions: number
    ) => {
        const result = await gamificationUtils.awardQuizXP(quizId, score, totalQuestions);
        await refreshStats();
        return result;
    }, [refreshStats]);

    // Update streak with auto-refresh
    const updateStreak = useCallback(async () => {
        const result = await gamificationUtils.updateDailyStreak();
        await refreshStats();
        return result;
    }, [refreshStats]);

    // Check achievements with auto-refresh
    const checkAchievements = useCallback(async () => {
        const result = await gamificationUtils.checkAndUnlockAchievements();
        await refreshStats();
        return result;
    }, [refreshStats]);

    // Complete lesson with full gamification flow
    const completeLessonWithGamification = useCallback(async (
        lessonId: string,
        stars: number,
        isFirstCompletion: boolean
    ) => {
        const result = await gamificationUtils.completeLessonWithGamification(
            lessonId,
            stars,
            isFirstCompletion
        );
        await refreshStats();
        return result;
    }, [refreshStats]);

    const value: GamificationContextType = {
        stats: stats || null,
        isLoading,
        error: error as Error | null,
        awardLessonXP,
        awardQuizXP,
        updateStreak,
        checkAchievements,
        completeLessonWithGamification,
        refreshStats
    };

    return (
        <GamificationContext.Provider value={value}>
            {children}
        </GamificationContext.Provider>
    );
}

// Hook to use gamification context
export function useGamificationContext() {
    const context = useContext(GamificationContext);
    if (context === undefined) {
        throw new Error('useGamificationContext must be used within GamificationProvider');
    }
    return context;
}
