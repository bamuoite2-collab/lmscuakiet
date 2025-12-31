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
            const { data, error } = await supabase
                .from('seasonal_events')
                .select('*')
                .eq('is_active', true)
                .lte('start_date', new Date().toISOString())
                .gte('end_date', new Date().toISOString())
                .order('start_date', { ascending: false });
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

                // Fetch quests with user progress
                const { data: quests, error: questsError } = await supabase
                    .from('event_quests')
                    .select('*')
                    .eq('event_id', eventId)
                    .order('order_index');

                if (questsError) throw questsError;

                const { data: progress, error: progressError } = await supabase
                    .from('user_event_progress')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('event_id', eventId);

                if (progressError) throw progressError;

                // Map quests with progress
                return (quests || []).map(quest => {
                    const userProgress = progress?.find(p => p.event_quest_id === quest.id);
                    return {
                        quest_id: quest.id,
                        quest_title: quest.title,
                        quest_description: quest.description || '',
                        quest_icon: quest.icon,
                        quest_type: quest.quest_type || '',
                        target_value: quest.target_value,
                        current_progress: userProgress?.current_progress || 0,
                        xp_reward: quest.xp_reward || 0,
                        difficulty: quest.difficulty || 'medium',
                        completed: userProgress?.completed || false,
                        completed_at: userProgress?.completed_at || undefined
                    } as EventQuest;
                });
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
                // Fetch user progress and aggregate
                const { data, error } = await supabase
                    .from('user_event_progress')
                    .select(`
                        user_id,
                        completed,
                        event_quests!inner(xp_reward)
                    `)
                    .eq('event_id', eventId)
                    .eq('completed', true);

                if (error) throw error;

                // Aggregate by user
                const userStats: Record<string, { quests_completed: number; total_xp: number }> = {};
                (data || []).forEach((entry: any) => {
                    if (!userStats[entry.user_id]) {
                        userStats[entry.user_id] = { quests_completed: 0, total_xp: 0 };
                    }
                    userStats[entry.user_id].quests_completed += 1;
                    userStats[entry.user_id].total_xp += entry.event_quests?.xp_reward || 0;
                });

                // Get user names
                const userIds = Object.keys(userStats);
                if (userIds.length === 0) return [];

                const { data: profiles } = await supabase
                    .from('profiles')
                    .select('user_id, full_name')
                    .in('user_id', userIds);

                // Build leaderboard
                const leaderboard = userIds
                    .map(userId => ({
                        user_id: userId,
                        full_name: profiles?.find(p => p.user_id === userId)?.full_name || 'Anonymous',
                        quests_completed: userStats[userId].quests_completed,
                        total_xp: userStats[userId].total_xp
                    }))
                    .sort((a, b) => b.total_xp - a.total_xp || b.quests_completed - a.quests_completed)
                    .slice(0, 50)
                    .map((entry, index) => ({ ...entry, rank: index + 1 }));

                return leaderboard;
            },
            enabled: !!eventId,
            staleTime: 1000 * 60 // 1 minute
        });
    };

    // Complete event quest
    const completeQuestMutation = useMutation({
        mutationFn: async (questId: string) => {
            if (!user) throw new Error('Not authenticated');

            // Get quest info
            const { data: quest, error: questError } = await supabase
                .from('event_quests')
                .select('*, seasonal_events!inner(id)')
                .eq('id', questId)
                .single();

            if (questError) throw questError;

            // Upsert progress as completed
            const { error: progressError } = await supabase
                .from('user_event_progress')
                .upsert({
                    user_id: user.id,
                    event_id: quest.event_id,
                    event_quest_id: questId,
                    target_value: quest.target_value,
                    current_progress: quest.target_value,
                    completed: true,
                    completed_at: new Date().toISOString()
                }, {
                    onConflict: 'user_id,event_quest_id'
                });

            if (progressError) throw progressError;

            return { success: true, xp_awarded: quest.xp_reward };
        },
        onSuccess: () => {
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
