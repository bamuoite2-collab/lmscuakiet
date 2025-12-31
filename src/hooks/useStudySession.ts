import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface StudySession {
    id: string;
    started_at: string;
    ended_at?: string;
    duration_minutes?: number;
    lesson_id?: string;
    activity_type: 'lesson' | 'quiz' | 'practice';
    completed: boolean;
}

export function useStudySession() {
    const { user } = useAuth();
    const [currentSession, setCurrentSession] = useState<string | null>(null);
    const [sessionStart, setSessionStart] = useState<Date | null>(null);

    // Start a new study session
    const startSession = useCallback(async (
        lessonId?: string,
        activityType: 'lesson' | 'quiz' | 'practice' = 'lesson'
    ) => {
        if (!user) return null;

        try {
            const { data, error } = await supabase
                .from('study_sessions')
                .insert({
                    user_id: user.id,
                    lesson_id: lessonId,
                    activity_type: activityType,
                    started_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) throw error;

            setCurrentSession(data.id);
            setSessionStart(new Date());

            return data.id;
        } catch (error) {
            console.error('Error starting session:', error);
            return null;
        }
    }, [user]);

    // End current study session
    const endSession = useCallback(async (
        sessionId?: string,
        completed: boolean = true
    ) => {
        const targetSessionId = sessionId || currentSession;
        if (!targetSessionId || !sessionStart) return;

        try {
            const endTime = new Date();
            const durationMinutes = Math.round(
                (endTime.getTime() - sessionStart.getTime()) / 60000
            );

            const { error } = await supabase
                .from('study_sessions')
                .update({
                    ended_at: endTime.toISOString(),
                    duration_minutes: durationMinutes,
                    completed
                })
                .eq('id', targetSessionId);

            if (error) throw error;

            setCurrentSession(null);
            setSessionStart(null);
        } catch (error) {
            console.error('Error ending session:', error);
        }
    }, [currentSession, sessionStart]);

    // Auto-save session on page unload
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (currentSession) {
                // Use sendBeacon for reliability
                const endTime = new Date();
                const durationMinutes = sessionStart
                    ? Math.round((endTime.getTime() - sessionStart.getTime()) / 60000)
                    : 0;

                navigator.sendBeacon(
                    `${supabase.supabaseUrl}/rest/v1/study_sessions?id=eq.${currentSession}`,
                    JSON.stringify({
                        ended_at: endTime.toISOString(),
                        duration_minutes: durationMinutes,
                        completed: false
                    })
                );
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [currentSession, sessionStart]);

    return {
        startSession,
        endSession,
        currentSessionId: currentSession,
        isTracking: !!currentSession
    };
}
