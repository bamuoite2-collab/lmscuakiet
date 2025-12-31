import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useDailyQuests } from '@/hooks/useDailyQuests';
import { Skeleton } from '@/components/ui/skeleton';
import { Target, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

export function DailyQuestsWidget() {
    const { quests, studentQuests, isLoading } = useDailyQuests();

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-40 shimmer" />
                </CardHeader>
                <CardContent className="space-y-3">
                    <Skeleton className="h-20 w-full shimmer" />
                    <Skeleton className="h-20 w-full shimmer" />
                    <Skeleton className="h-20 w-full shimmer" />
                </CardContent>
            </Card>
        );
    }

    const todayQuests = quests.map(quest => {
        const studentQuest = studentQuests?.find(sq => sq.daily_quest_id === quest.id);
        return {
            id: studentQuest?.id || quest.id,
            daily_quest_id: quest.id,
            daily_quests: quest,
            current_progress: studentQuest?.current_progress || 0,
            target_value: studentQuest?.target_value || quest.target_value,
            is_completed: studentQuest?.is_completed || false,
            completed_at: studentQuest?.completed_at
        };
    });

    const completedCount = todayQuests?.filter(q => q.is_completed).length || 0;
    const totalCount = todayQuests?.length || 0;
    const completionRate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    const getDifficultyColor = (difficulty: string) => {
        const colors: Record<string, string> = {
            easy: 'bg-green-500',
            medium: 'bg-yellow-500',
            hard: 'bg-red-500'
        };
        return colors[difficulty] || 'bg-gray-500';
    };

    const getDifficultyLabel = (difficulty: string) => {
        const labels: Record<string, string> = {
            easy: 'Dễ',
            medium: 'Trung bình',
            hard: 'Khó'
        };
        return labels[difficulty] || difficulty;
    };

    return (
        <Card className="overflow-hidden">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        >
                            <Target className="h-5 w-5 text-blue-500" />
                        </motion.div>
                        Nhiệm vụ hôm nay
                    </CardTitle>
                    <Badge variant="outline" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        {completedCount}/{totalCount}
                    </Badge>
                </div>
                {totalCount > 0 && (
                    <div className="mt-2">
                        <Progress value={completionRate} className="h-2 progress-animated" />
                    </div>
                )}
            </CardHeader>

            <CardContent className="space-y-3">
                <AnimatePresence mode="popLayout">
                    {!todayQuests || todayQuests.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center py-8 text-muted-foreground"
                        >
                            <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Không có nhiệm vụ hôm nay</p>
                            <p className="text-xs mt-1">Hoàn thành bài học để nhận nhiệm vụ mới!</p>
                        </motion.div>
                    ) : (
                        todayQuests.map((quest: any, index: number) => {
                            const progressPercent = quest.target_value > 0
                                ? Math.min((quest.current_progress / quest.target_value) * 100, 100)
                                : 0;

                            return (
                                <motion.div
                                    key={quest.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`group relative p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-lg ${quest.is_completed
                                            ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-500 shadow-green-500/20'
                                            : 'bg-muted/50 border-border hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-950/50'
                                        }`}
                                >
                                    {/* Completion sparkles */}
                                    {quest.is_completed && (
                                        <>
                                            {[...Array(3)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    className="absolute"
                                                    style={{
                                                        left: `${20 + i * 30}%`,
                                                        top: `${10 + (i % 2) * 70}%`
                                                    }}
                                                    animate={{
                                                        opacity: [0, 1, 0],
                                                        scale: [0, 1.5, 0],
                                                        rotate: 360
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        delay: i * 0.3
                                                    }}
                                                >
                                                    <Sparkles className="h-3 w-3 text-green-500" />
                                                </motion.div>
                                            ))}
                                        </>
                                    )}

                                    <div className="flex items-start gap-3 relative z-10">
                                        {/* Icon */}
                                        <motion.div
                                            className="text-3xl shrink-0"
                                            animate={quest.is_completed ? {
                                                scale: [1, 1.2, 1],
                                                rotate: [0, 10, -10, 0]
                                            } : {}}
                                            transition={{ duration: 0.5 }}
                                        >
                                            {quest.is_completed ? '✅' : quest.daily_quests?.icon || '🎯'}
                                        </motion.div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-semibold text-sm">
                                                    {quest.daily_quests?.title || 'Quest'}
                                                </h4>
                                                <span className={`px-2 py-0.5 rounded-full text-xs text-white ${getDifficultyColor(quest.daily_quests?.difficulty || 'easy')}`}>
                                                    {getDifficultyLabel(quest.daily_quests?.difficulty || 'easy')}
                                                </span>
                                            </div>

                                            <p className="text-xs text-muted-foreground mb-2">
                                                {quest.daily_quests?.description}
                                            </p>

                                            {/* Progress */}
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-muted-foreground">
                                                        Tiến độ: {quest.current_progress}/{quest.target_value}
                                                    </span>
                                                    <motion.span
                                                        className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1"
                                                        whileHover={{ scale: 1.1 }}
                                                    >
                                                        <Sparkles className="h-3 w-3" />
                                                        +{quest.daily_quests?.xp_reward || 0} XP
                                                    </motion.span>
                                                </div>
                                                <div className="relative">
                                                    <Progress value={progressPercent} className="h-1.5" />
                                                    {progressPercent > 0 && progressPercent < 100 && (
                                                        <motion.div
                                                            className="absolute top-0 left-0 h-full bg-white/30 rounded-full"
                                                            style={{ width: `${progressPercent}%` }}
                                                            animate={{ opacity: [0.3, 0.7, 0.3] }}
                                                            transition={{ duration: 1.5, repeat: Infinity }}
                                                        />
                                                    )}
                                                </div>
                                            </div>

                                            {/* Completed badge */}
                                            <AnimatePresence>
                                                {quest.is_completed && (
                                                    <motion.p
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center gap-1 font-semibold"
                                                    >
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            transition={{ type: 'spring', bounce: 0.5 }}
                                                        >
                                                            <CheckCircle2 className="h-3 w-3" />
                                                        </motion.div>
                                                        Đã hoàn thành!
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>

                                    {/* Hover glow effect */}
                                    {!quest.is_completed && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/10 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none" />
                                    )}
                                </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
}
