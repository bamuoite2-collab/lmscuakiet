import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { DailyQuest, StudentDailyQuest } from '@/components/gamification/DailyQuestList';

export function useDailyQuests() {
    const { user } = useAuth();

    // Fetch today's quests
    const { data: quests = [], isLoading: isLoadingQuests } = useQuery<DailyQuest[]>({
        queryKey: ['daily-quests'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('daily_quests')
                .select('*')
                .eq('is_active', true)
                .limit(3); // Only show 3 quests per day

            if (error) throw error;
            return data || [];
        },
    });

    // Fetch student's quest progress
    const { data: studentQuests = [], isLoading: isLoadingStudentQuests } = useQuery<StudentDailyQuest[]>({
        queryKey: ['student-daily-quests', user?.id, new Date().toISOString().split('T')[0]],
        queryFn: async () => {
            if (!user) return [];

            const today = new Date().toISOString().split('T')[0];

            const { data, error } = await supabase
                .from('student_daily_quests')
                .select('*')
                .eq('user_id', user.id)
                .eq('assigned_date', today);

            if (error) throw error;
            return data || [];
        },
        enabled: !!user,
    });

    return {
        quests,
        studentQuests,
        isLoading: isLoadingQuests || isLoadingStudentQuests,
    };
}
