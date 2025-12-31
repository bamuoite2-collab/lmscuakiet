import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface DailyQuest {
    id: string;
    code: string;
    title: string;
    description: string;
    icon: string;
    quest_type: string;
    target_value: number;
    xp_reward: number;
    difficulty: 'easy' | 'medium' | 'hard';
    is_active?: boolean;
    weight?: number;
    created_at?: string;
}

export interface StudentDailyQuest {
    id: string;
    daily_quest_id: string;
    current_progress: number;
    target_value: number;
    is_completed: boolean;
    completed_at?: string;
    user_id?: string;
    assigned_date?: string;
}

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
            
            // Cast the difficulty field to the expected type
            return (data || []).map(quest => ({
                ...quest,
                difficulty: quest.difficulty as 'easy' | 'medium' | 'hard'
            }));
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
            return (data || []) as StudentDailyQuest[];
        },
        enabled: !!user,
    });

    return {
        quests,
        studentQuests,
        isLoading: isLoadingQuests || isLoadingStudentQuests,
    };
}
