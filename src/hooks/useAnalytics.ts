import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface WeeklyStats {
    total_study_minutes: number;
    total_lessons: number;
    total_quizzes: number;
    total_xp: number;
    total_stars: number;
    accuracy: number;
    days_active: number;
    avg_study_minutes: number;
}

export interface SubjectPerformance {
    subject: string;
    lessons_completed: number;
    avg_stars: number;
    accuracy: number;
    total_time_minutes: number;
}

export interface StreakDay {
    date: string;
    study_minutes: number;
    lessons_completed: number;
    intensity: number; // 0-4
}

export function useAnalytics() {
    const { user } = useAuth();

    // Get weekly stats
    const { data: weeklyStats, isLoading: loadingWeekly } = useQuery<WeeklyStats>({
        queryKey: ['analytics', 'weekly', user?.id],
        queryFn: async () => {
            if (!user) return null;

            const weekStart = new Date();
            weekStart.setDate(weekStart.getDate() - 7);

            const { data, error } = await supabase
                .rpc('calculate_weekly_stats', {
                    p_user_id: user.id,
                    p_week_start: weekStart.toISOString().split('T')[0]
                });

            if (error) throw error;
            return data as WeeklyStats;
        },
        enabled: !!user,
        staleTime: 1000 * 60 * 5 // 5 minutes
    });

    // Get monthly stats
    const { data: monthlyStats, isLoading: loadingMonthly } = useQuery<WeeklyStats>({
        queryKey: ['analytics', 'monthly', user?.id],
        queryFn: async () => {
            if (!user) return null;

            const monthStart = new Date();
            monthStart.setDate(monthStart.getDate() - 30);

            const { data, error } = await supabase
                .rpc('calculate_weekly_stats', {
                    p_user_id: user.id,
                    p_week_start: monthStart.toISOString().split('T')[0]
                });

            if (error) throw error;
            return data as WeeklyStats;
        },
        enabled: !!user,
        staleTime: 1000 * 60 * 5
    });

    // Get subject performance
    const { data: subjectPerformance, isLoading: loadingSubjects } = useQuery<SubjectPerformance[]>({
        queryKey: ['analytics', 'subjects', user?.id],
        queryFn: async () => {
            if (!user) return [];

            const { data, error } = await supabase
                .rpc('get_subject_performance', {
                    p_user_id: user.id
                });

            if (error) throw error;
            return (data || []) as SubjectPerformance[];
        },
        enabled: !!user,
        staleTime: 1000 * 60 * 10 // 10 minutes
    });

    // Get streak heatmap data
    const { data: streakData, isLoading: loadingStreak } = useQuery<StreakDay[]>({
        queryKey: ['analytics', 'streak', user?.id],
        queryFn: async () => {
            if (!user) return [];

            const { data, error } = await supabase
                .rpc('get_streak_heatmap', {
                    p_user_id: user.id
                });

            if (error) throw error;
            return (data || []) as StreakDay[];
        },
        enabled: !!user,
        staleTime: 1000 * 60 * 30 // 30 minutes
    });

    // Get daily analytics for chart
    const { data: dailyAnalytics, isLoading: loadingDaily } = useQuery({
        queryKey: ['analytics', 'daily', user?.id],
        queryFn: async () => {
            if (!user) return [];

            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const { data, error } = await supabase
                .from('daily_analytics')
                .select('*')
                .eq('user_id', user.id)
                .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
                .order('date', { ascending: true });

            if (error) throw error;
            return data || [];
        },
        enabled: !!user,
        staleTime: 1000 * 60 * 5
    });

    return {
        weeklyStats,
        monthlyStats,
        subjectPerformance,
        streakData,
        dailyAnalytics,
        isLoading: loadingWeekly || loadingMonthly || loadingSubjects || loadingStreak || loadingDaily
    };
}
