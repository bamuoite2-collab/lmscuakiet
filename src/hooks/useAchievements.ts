import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Achievement, StudentAchievement } from '@/components/gamification/AchievementGrid';

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
            return data || [];
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
            return data || [];
        },
        enabled: !!user,
    });

    // Check for new achievements
    const checkAchievements = async () => {
        if (!user) return;

        try {
            const { data, error } = await supabase.rpc('check_achievements', {
                _user_id: user.id,
            });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error checking achievements:', error);
        }
    };

    return {
        achievements,
        studentAchievements,
        isLoading: isLoadingAchievements || isLoadingStudentAchievements,
        checkAchievements,
    };
}
