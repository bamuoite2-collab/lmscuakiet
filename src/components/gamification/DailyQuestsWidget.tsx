import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useDailyQuests } from '@/hooks/useDailyQuests';
import { Skeleton } from '@/components/ui/skeleton';
import { Target, CheckCircle2, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function DailyQuestsWidget() {
    const { quests, studentQuests, isLoading } = useDailyQuests();

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent className="space-y-3">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                </CardContent>
            </Card>
        );
    }

    // Join quests with student progress
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
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="h-5 w-5 text-blue-500" />
                        Nhiệm vụ hôm nay
                    </CardTitle>
                    <Badge variant="outline" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        {completedCount}/{totalCount}
                    </Badge>
                </div>
                {totalCount > 0 && (
                    <div className="mt-2">
                        <Progress value={completionRate} className="h-2" />
                    </div>
                )}
            </CardHeader>

            <CardContent className="space-y-3">
                {!todayQuests || todayQuests.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Không có nhiệm vụ hôm nay</p>
                        <p className="text-xs mt-1">Hoàn thành bài học để nhận nhiệm vụ mới!</p>
                    </div>
                ) : (
                    todayQuests.map((quest: any) => {
                        const progressPercent = quest.target_value > 0
                            ? Math.min((quest.current_progress / quest.target_value) * 100, 100)
                            : 0;

                        return (
                            <div
                                key={quest.id}
                                className={`p-4 rounded-lg border-2 transition-all ${quest.is_completed
                                    ? 'bg-green-50 dark:bg-green-950 border-green-500'
                                    : 'bg-muted/50 border-border'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    {/* Icon */}
                                    <div className="text-3xl shrink-0">
                                        {quest.is_completed ? '✅' : quest.daily_quests?.icon || '🎯'}
                                    </div>

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
                                                <span className="font-bold text-blue-600 dark:text-blue-400">
                                                    +{quest.daily_quests?.xp_reward || 0} XP
                                                </span>
                                            </div>
                                            <Progress value={progressPercent} className="h-1.5" />
                                        </div>

                                        {/* Completed badge */}
                                        {quest.is_completed && (
                                            <p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
                                                <CheckCircle2 className="h-3 w-3" />
                                                Đã hoàn thành!
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </CardContent>
        </Card>
    );
}
