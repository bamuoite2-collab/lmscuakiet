import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface GamificationProfile {
    id: string;
    user_id: string;
    total_xp: number;
    current_level: number;
    xp_to_next_level: number;
    current_streak: number;
    longest_streak: number;
    last_activity_date: string | null;
    streak_freeze_count: number;
    total_lessons_completed: number;
    total_stars_earned: number;
    total_quizzes_completed: number;
    created_at: string;
    updated_at: string;
}

interface AwardXPResult {
    success: boolean;
    xp_awarded: number;
    total_xp: number;
    old_level: number;
    new_level: number;
    leveled_up: boolean;
}

interface UpdateStreakResult {
    success: boolean;
    streak: number;
    streak_continued: boolean;
    streak_broken: boolean;
    streak_bonus_xp: number;
}

export function useGamification() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    // Fetch gamification profile
    const { data: profile, isLoading } = useQuery<GamificationProfile | null>({
        queryKey: ['gamification', user?.id],
        queryFn: async () => {
            if (!user) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('student_gamification')
                .select('*')
                .eq('user_id', user.id)
                .maybeSingle();

            if (error) throw error;

            if (!data) {
                // Create profile if it doesn't exist
                const { data: newProfile, error: createError } = await supabase
                    .from('student_gamification')
                    .insert({ user_id: user.id })
                    .select()
                    .single();

                if (createError) throw createError;
                return newProfile as GamificationProfile;
            }

            return data as GamificationProfile;
        },
        enabled: !!user,
        staleTime: 30000, // 30 seconds
    });

    // Award XP mutation
    const awardXPMutation = useMutation({
        mutationFn: async ({
            xp_amount,
            source_type,
            source_id,
            description,
        }: {
            xp_amount: number;
            source_type: string;
            source_id?: string;
            description?: string;
        }) => {
            if (!user) throw new Error('Not authenticated');

            const { data, error } = await supabase.rpc('award_xp', {
                _user_id: user.id,
                _xp_amount: xp_amount,
                _source_type: source_type,
                _source_id: source_id || null,
                _description: description || null,
            });

            if (error) throw error;
            return data as unknown as AwardXPResult;
        },
        onSuccess: (data) => {
            // Invalidate gamification query to refetch
            queryClient.invalidateQueries({ queryKey: ['gamification', user?.id] });

            // Show XP notification
            if (data?.leveled_up) {
                toast.success(`🎉 Chúc mừng! Bạn đã lên cấp ${data.new_level}!`, {
                    description: `Nhận được +${data.xp_awarded} XP`,
                    duration: 5000,
                });
            } else if (data) {
                toast.success(`+${data.xp_awarded} XP`, {
                    description: `Tổng XP: ${data.total_xp}`,
                });
            }
        },
        onError: (error) => {
            console.error('Error awarding XP:', error);
            toast.error('Có lỗi khi tính XP');
        },
    });

    // Update streak mutation
    const updateStreakMutation = useMutation({
        mutationFn: async () => {
            if (!user) throw new Error('Not authenticated');

            const { data, error } = await supabase.rpc('update_streak', {
                _user_id: user.id,
            });

            if (error) throw error;
            return data as unknown as UpdateStreakResult;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['gamification', user?.id] });

            if (data?.streak_broken) {
                toast.warning('Chuỗi ngày học đã reset', {
                    description: 'Hãy học tiếp để xây dựng chuỗi mới!',
                });
            } else if (data?.streak_continued) {
                toast.success(`🔥 Chuỗi ${data.streak} ngày!`, {
                    description: data.streak_bonus_xp > 0
                        ? `+${data.streak_bonus_xp} XP thưởng`
                        : undefined,
                });
            }
        },
    });

    // Award XP for lesson completion
    const awardLessonXP = (lessonId: string, stars: number, lessonTitle: string) => {
        const baseXP = 10;
        const bonusXP = stars * 5;
        const totalXP = baseXP + bonusXP;

        awardXPMutation.mutate({
            xp_amount: totalXP,
            source_type: 'lesson_complete',
            source_id: lessonId,
            description: `Hoàn thành: ${lessonTitle}`,
        });

        // Also update streak
        updateStreakMutation.mutate();

        // Update stats
        if (profile) {
            supabase
                .from('student_gamification')
                .update({
                    total_lessons_completed: profile.total_lessons_completed + 1,
                    total_stars_earned: profile.total_stars_earned + stars,
                })
                .eq('user_id', user!.id)
                .then(() => {
                    queryClient.invalidateQueries({ queryKey: ['gamification', user?.id] });
                });
        }
    };

    // Award XP for quiz completion
    const awardQuizXP = (quizId: string, score: number, total: number) => {
        const percentage = total > 0 ? (score / total) * 100 : 0;
        let xpAmount = 5; // Base XP

        if (percentage >= 90) xpAmount = 20;
        else if (percentage >= 70) xpAmount = 15;
        else if (percentage >= 50) xpAmount = 10;

        awardXPMutation.mutate({
            xp_amount: xpAmount,
            source_type: 'quiz_complete',
            source_id: quizId,
            description: `Quiz: ${score}/${total} đúng`,
        });

        // Update quiz count
        if (profile) {
            supabase
                .from('student_gamification')
                .update({
                    total_quizzes_completed: profile.total_quizzes_completed + 1,
                })
                .eq('user_id', user!.id)
                .then(() => {
                    queryClient.invalidateQueries({ queryKey: ['gamification', user?.id] });
                });
        }
    };

    return {
        profile,
        isLoading,
        awardXP: awardXPMutation.mutate,
        awardLessonXP,
        awardQuizXP,
        updateStreak: updateStreakMutation.mutate,
        isAwardingXP: awardXPMutation.isPending,
        isUpdatingStreak: updateStreakMutation.isPending,
    };
}
