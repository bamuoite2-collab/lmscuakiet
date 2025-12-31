import { useState, useCallback } from 'react';
import { XPGainAnimation } from '@/components/gamification/XPGainAnimation';
import { LevelUpModal } from '@/components/gamification/LevelUpModal';
import { AchievementUnlockToast } from '@/components/gamification/AchievementUnlockToast';
import { toast } from 'sonner';

interface Achievement {
    id: string;
    code: string;
    title: string;
    icon: string;
    xp_reward: number;
}

export function useGamificationAnimations() {
    const [showXPGain, setShowXPGain] = useState(false);
    const [xpAmount, setXPAmount] = useState(0);
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [newLevel, setNewLevel] = useState(0);

    // Trigger XP gain animation
    const triggerXPGain = useCallback((amount: number) => {
        setXPAmount(amount);
        setShowXPGain(true);
    }, []);

    // Trigger level up modal
    const triggerLevelUp = useCallback((level: number) => {
        setNewLevel(level);
        setShowLevelUp(true);
    }, []);

    // Trigger achievement unlock toast
    const triggerAchievement = useCallback((achievement: Achievement) => {
        toast.custom(() => <AchievementUnlockToast achievement={achievement} />, {
            duration: 5000,
            position: 'top-right'
        });
    }, []);

    // Close handlers
    const handleXPComplete = useCallback(() => {
        setShowXPGain(false);
    }, []);

    const handleLevelUpClose = useCallback(() => {
        setShowLevelUp(false);
    }, []);

    // Render animations
    const AnimationComponents = useCallback(() => (
        <>
            {showXPGain && (
                <XPGainAnimation amount={xpAmount} onComplete={handleXPComplete} />
            )}
            <LevelUpModal
                isOpen={showLevelUp}
                newLevel={newLevel}
                onClose={handleLevelUpClose}
            />
        </>
    ), [showXPGain, xpAmount, showLevelUp, newLevel, handleXPComplete, handleLevelUpClose]);

    return {
        triggerXPGain,
        triggerLevelUp,
        triggerAchievement,
        AnimationComponents
    };
}
