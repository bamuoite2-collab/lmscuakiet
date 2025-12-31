import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface Achievement {
    id: string;
    code: string;
    title: string;
    description: string;
    icon: string;
    category: string;
    xp_reward: number;
    is_active: boolean;
    order_index?: number;
    criteria?: Record<string, unknown>;
    created_at?: string;
}

export interface StudentAchievement {
    id?: string;
    achievement_id: string;
    unlocked_at: string;
    user_id?: string;
    notified?: boolean;
}

interface CheckAchievementsResult {
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

export function useAchievements() {
    const { user } = useAuth();

    // Fetch all achievements
    const { data: achievements = [], isLoading: isLoadingAchievements } = useQuery<Achievement[]>({
        queryKey: ['achievements'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('achievements')
                .select('*')
                .eq('is_active', true)
                .order('order_index');

            if (error) throw error;
            return (data || []) as Achievement[];
        },
    });

    // Fetch student's unlocked achievements
    const { data: studentAchievements = [], isLoading: isLoadingStudentAchievements } = useQuery<StudentAchievement[]>({
        queryKey: ['student-achievements', user?.id],
        queryFn: async () => {
            if (!user) return [];

            const { data, error } = await supabase
                .from('student_achievements')
                .select('achievement_id, unlocked_at')
                .eq('user_id', user.id)
                .order('unlocked_at', { ascending: false });

            if (error) throw error;
            return (data || []) as StudentAchievement[];
        },
        enabled: !!user,
    });

    // Check for new achievements
    const checkAchievements = async (): Promise<CheckAchievementsResult | null> => {
        if (!user) return null;

        try {
            const { data, error } = await supabase.rpc('check_achievements', {
                _user_id: user.id,
            });

            if (error) throw error;
            return data as unknown as CheckAchievementsResult;
        } catch (error) {
            console.error('Error checking achievements:', error);
            return null;
        }
    };

    return {
        achievements,
        studentAchievements,
        isLoading: isLoadingAchievements || isLoadingStudentAchievements,
        checkAchievements,
    };
}
