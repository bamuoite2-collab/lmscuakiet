import { motion } from 'framer-motion';
import { Award, Sparkles, Zap } from 'lucide-react';
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
            initial={{ x: 400, opacity: 0, scale: 0.8 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: 400, opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        >
            <Card className="relative overflow-hidden p-4 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white border-0 shadow-2xl max-w-sm">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 blur-xl opacity-50" />

                {/* Sparkle particles */}
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                            opacity: [0, 1, 0],
                            scale: [0, 1.5, 0],
                            x: (Math.random() - 0.5) * 100,
                            y: (Math.random() - 0.5) * 100
                        }}
                        transition={{
                            duration: 1.5,
                            delay: i * 0.1,
                            repeat: Infinity,
                            repeatDelay: 2
                        }}
                    >
                        <Sparkles className="h-3 w-3 text-yellow-300" />
                    </motion.div>
                ))}

                <div className="flex items-center gap-3 relative z-10">
                    {/* Icon with animation */}
                    <motion.div
                        animate={{
                            rotate: [0, -10, 10, -10, 0],
                            scale: [1, 1.1, 1, 1.1, 1]
                        }}
                        transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 2 }}
                        className="text-5xl relative"
                    >
                        {achievement.icon}
                        {/* Icon glow */}
                        <div className="absolute inset-0 blur-md opacity-50">{achievement.icon}</div>
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1">
                        <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="flex items-center gap-2 mb-1"
                        >
                            <Award className="h-4 w-4" />
                            <span className="text-xs font-semibold uppercase tracking-wider opacity-90">Thành tích mới!</span>
                        </motion.div>

                        <motion.h4
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg font-bold mb-2"
                        >
                            {achievement.title}
                        </motion.h4>

                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: 'spring' }}
                            className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm"
                        >
                            <Zap className="h-4 w-4 text-yellow-300" />
                            <span className="text-sm font-bold">+{achievement.xp_reward} XP</span>
                        </motion.div>
                    </div>
                </div>

                {/* Shine effect */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                    initial={{ x: '-100%' }}
                    animate={{ x: '200%' }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                />
            </Card>
        </motion.div>
    );
}
