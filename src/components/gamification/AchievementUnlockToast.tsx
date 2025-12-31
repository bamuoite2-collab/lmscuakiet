import { motion } from 'framer-motion';
import { Award, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface Achievement {
    id: string;
    code: string;
    title: string;
    icon: string;
    xp_reward: number;
}

interface AchievementUnlockToastProps {
    achievement: Achievement;
}

export function AchievementUnlockToast({ achievement }: AchievementUnlockToastProps) {
    return (
        <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
            <Card className="p-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0 shadow-2xl max-w-sm">
                <div className="flex items-center gap-3">
                    {/* Icon */}
                    <motion.div
                        animate={{
                            rotate: [0, 10, -10, 0],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 0.5 }}
                        className="text-4xl"
                    >
                        {achievement.icon}
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <Award className="h-4 w-4" />
                            <span className="text-xs font-semibold uppercase tracking-wide opacity-90">
                                Achievement Unlocked!
                            </span>
                        </div>
                        <h4 className="font-bold text-lg">{achievement.title}</h4>
                        {achievement.xp_reward > 0 && (
                            <div className="flex items-center gap-1 mt-1 text-yellow-200">
                                <Sparkles className="h-3 w-3" />
                                <span className="text-sm font-medium">+{achievement.xp_reward} XP</span>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
