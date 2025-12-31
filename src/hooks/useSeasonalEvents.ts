import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface SeasonalEvent {
    id: string;
    name: string;
    description: string;
    event_type: 'tet' | 'summer' | 'backtoschool' | 'holiday' | 'custom';
    start_date: string;
    end_date: string;
    is_active: boolean;
    theme_config: any;
    bonus_xp_multiplier: number;
    icon: string;
    banner_image?: string;
}

export interface EventQuest {
    quest_id: string;
    quest_title: string;
    quest_description: string;
    quest_icon: string;
    quest_type: string;
    target_value: number;
    current_progress: number;
    xp_reward: number;
    difficulty: string;
    completed: boolean;
    completed_at?: string;
}

export function useSeasonalEvents() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    // Get active events
    const { data: activeEvents, isLoading: loadingEvents } = useQuery<SeasonalEvent[]>({
        queryKey: ['seasonal-events', 'active'],
        queryFn: async () => {
            const { data, error } = await supabase.rpc('get_active_events');
            if (error) throw error;
            return (data || []) as SeasonalEvent[];
        },
        staleTime: 1000 * 60 * 5 // 5 minutes
    });

    // Get user's progress for an event
    const getUserEventProgress = (eventId: string) => {
        return useQuery<EventQuest[]>({
            queryKey: ['event-progress', user?.id, eventId],
            queryFn: async () => {
                if (!user) return [];

                const { data, error } = await supabase.rpc('get_user_event_progress', {
                    p_user_id: user.id,
                    p_event_id: eventId
                });

                if (error) throw error;
                return (data || []) as EventQuest[];
            },
            enabled: !!user && !!eventId,
            staleTime: 1000 * 30 // 30 seconds
        });
    };

    // Get event leaderboard
    const getEventLeaderboard = (eventId: string) => {
        return useQuery({
            queryKey: ['event-leaderboard', eventId],
            queryFn: async () => {
                const { data, error } = await supabase.rpc('get_event_leaderboard', {
                    p_event_id: eventId,
                    p_limit: 50
                });

                if (error) throw error;
                return data || [];
            },
            enabled: !!eventId,
            staleTime: 1000 * 60 // 1 minute
        });
    };

    // Complete event quest
    const completeQuestMutation = useMutation({
        mutationFn: async (questId: string) => {
            if (!user) throw new Error('Not authenticated');

            const { data, error } = await supabase.rpc('complete_event_quest', {
                p_user_id: user.id,
                p_quest_id: questId
            });

            if (error) throw error;
            return data;
        },
        onSuccess: (data, questId) => {
            // Invalidate queries
            queryClient.invalidateQueries({ queryKey: ['event-progress'] });
            queryClient.invalidateQueries({ queryKey: ['event-leaderboard'] });
            queryClient.invalidateQueries({ queryKey: ['gamification'] });
        }
    });

    return {
        activeEvents,
        loadingEvents,
        getUserEventProgress,
        getEventLeaderboard,
        completeQuest: completeQuestMutation.mutate,
        isCompletingQuest: completeQuestMutation.isPending
    };
}
