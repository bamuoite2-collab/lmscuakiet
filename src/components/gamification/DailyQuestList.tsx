import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DailyQuest, StudentDailyQuest } from '@/hooks/useDailyQuests';

export type { DailyQuest, StudentDailyQuest };

interface DailyQuestItemProps {
    quest: DailyQuest;
    studentQuest?: StudentDailyQuest;
}

function DailyQuestItem({ quest, studentQuest }: DailyQuestItemProps) {
    const progress = studentQuest
        ? Math.min((studentQuest.current_progress / studentQuest.target_value) * 100, 100)
        : 0;
    const isCompleted = studentQuest?.is_completed || false;

    const difficultyColors = {
        easy: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
        medium: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
        hard: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
    };

    return (
        <div className={cn(
            "relative p-4 rounded-lg border-2 transition-all",
            isCompleted
                ? "bg-green-500/5 border-green-500/30"
                : "bg-card border-border hover:border-primary/50"
        )}>
            <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="text-2xl mt-0.5">
                    {quest.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm">{quest.title}</h4>
                        <Badge
                            variant="outline"
                            className={cn("text-xs", difficultyColors[quest.difficulty])}
                        >
                            {quest.difficulty === 'easy' && 'Dễ'}
                            {quest.difficulty === 'medium' && 'TB'}
                            {quest.difficulty === 'hard' && 'Khó'}
                        </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground mb-3">
                        {quest.description}
                    </p>

                    {/* Progress Bar */}
                    {!isCompleted && studentQuest && (
                        <div className="space-y-1 mb-2">
                            <Progress value={progress} className="h-2" />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>{studentQuest.current_progress} / {studentQuest.target_value}</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                        </div>
                    )}

                    {/* Reward */}
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
                            +{quest.xp_reward} XP
                        </span>

                        {isCompleted ? (
                            <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                                <CheckCircle2 className="h-3 w-3" />
                                <span className="font-medium">Hoàn thành</span>
                            </div>
                        ) : (
                            <Circle className="h-4 w-4 text-muted-foreground/50" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

interface DailyQuestListProps {
    quests: DailyQuest[];
    studentQuests: StudentDailyQuest[];
}

export function DailyQuestList({ quests, studentQuests }: DailyQuestListProps) {
    const completedCount = studentQuests.filter(sq => sq.is_completed).length;
    const totalXP = quests.reduce((sum, q) => {
        const studentQuest = studentQuests.find(sq => sq.daily_quest_id === q.id);
        return sum + (studentQuest?.is_completed ? q.xp_reward : 0);
    }, 0);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        🎯 Nhiệm Vụ Hôm Nay
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline">
                            {completedCount} / {quests.length}
                        </Badge>
                        {totalXP > 0 && (
                            <Badge className="bg-yellow-500 text-yellow-950">
                                +{totalXP} XP
                            </Badge>
                        )}
                    </div>
                </div>
                {quests.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                        Hoàn thành nhiệm vụ để nhận thưởng XP
                    </p>
                )}
            </CardHeader>
            <CardContent className="space-y-3">
                {quests.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                        <p>Chưa có nhiệm vụ nào hôm nay</p>
                        <p className="text-xs mt-2">Quay lại vào ngày mai nhé! 🌟</p>
                    </div>
                ) : (
                    quests.map(quest => {
                        const studentQuest = studentQuests.find(
                            sq => sq.daily_quest_id === quest.id
                        );

                        return (
                            <DailyQuestItem
                                key={quest.id}
                                quest={quest}
                                studentQuest={studentQuest}
                            />
                        );
                    })
                )}
            </CardContent>
        </Card>
    );
}
