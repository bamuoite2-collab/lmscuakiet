import { useParams, Link } from 'react-router-dom';
import { useSeasonalEvents } from '@/hooks/useSeasonalEvents';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import {
    ArrowLeft, Calendar, Trophy, Zap, CheckCircle2,
    Lock, Sparkles, Crown, Medal, Award
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function EventDetailsPage() {
    const { eventId } = useParams<{ eventId: string }>();
    const { activeEvents, getUserEventProgress, getEventLeaderboard } = useSeasonalEvents();

    const event = activeEvents?.find(e => e.id === eventId);
    const { data: quests, isLoading: loadingQuests } = getUserEventProgress(eventId || '');
    const { data: leaderboard, isLoading: loadingLeaderboard } = getEventLeaderboard(eventId || '');

    if (!event) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h2 className="text-2xl font-bold mb-2">Sự kiện không tồn tại</h2>
                    <Button asChild className="mt-4">
                        <Link to="/">Quay lại Dashboard</Link>
                    </Button>
                </div>
            </div>
        );
    }

    const theme = event.theme_config || {};
    const primaryColor = theme.primaryColor || '#ff0000';
    const secondaryColor = theme.secondaryColor || '#ffaa00';

    const completedQuests = quests?.filter(q => q.completed).length || 0;
    const totalQuests = quests?.length || 0;
    const completionRate = totalQuests > 0 ? (completedQuests / totalQuests) * 100 : 0;

    const daysRemaining = Math.ceil(
        (new Date(event.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

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
        <div className="container mx-auto px-4 py-8 space-y-6">
            {/* Header */}
            <div>
                <Button variant="ghost" size="sm" asChild className="mb-4">
                    <Link to="/">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Quay lại Dashboard
                    </Link>
                </Button>

                <div className="flex items-center gap-4 mb-4">
                    <div className="text-6xl">{event.icon}</div>
                    <div className="flex-1">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.name}</h1>
                        <p className="text-lg text-muted-foreground">{event.description}</p>
                    </div>
                </div>

                <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Còn {daysRemaining} ngày</span>
                    </div>
                    <div className="flex items-center gap-2" style={{ color: secondaryColor }}>
                        <Zap className="h-4 w-4" />
                        <span className="font-bold">{event.bonus_xp_multiplier}x XP Bonus</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4" />
                        <span>{completedQuests}/{totalQuests} nhiệm vụ</span>
                    </div>
                </div>
            </div>

            {/* Overall Progress */}
            <Card style={{ borderColor: primaryColor, borderWidth: 2 }}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5" style={{ color: primaryColor }} />
                        Tiến Độ Tổng Thể
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="font-semibold">Hoàn thành {completionRate.toFixed(0)}%</span>
                            <span className="text-muted-foreground">{completedQuests}/{totalQuests} nhiệm vụ</span>
                        </div>
                        <Progress value={completionRate} className="h-3" />
                    </div>
                </CardContent>
            </Card>

            {/* Event Quests */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5" style={{ color: secondaryColor }} />
                        Nhiệm Vụ Sự Kiện
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {loadingQuests ? (
                        [...Array(3)].map((_, i) => <Skeleton key={i} className="h-32" />)
                    ) : !quests || quests.length === 0 ? (
                        <p className="text-center py-8 text-muted-foreground">
                            Chưa có nhiệm vụ nào
                        </p>
                    ) : (
                        quests.map((quest, index) => {
                            const progressPercent = quest.target_value > 0
                                ? Math.min((quest.current_progress / quest.target_value) * 100, 100)
                                : 0;

                            return (
                                <motion.div
                                    key={quest.quest_id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`p-4 rounded-lg border-2 transition-all ${quest.completed
                                            ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-500'
                                            : 'bg-muted/30 border-border hover:border-blue-300'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Icon */}
                                        <div className="text-4xl shrink-0">
                                            {quest.completed ? '✅' : quest.quest_icon}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <h3 className="font-bold text-lg">{quest.quest_title}</h3>
                                                <span className={`px-2 py-0.5 rounded-full text-xs text-white ${getDifficultyColor(quest.difficulty)}`}>
                                                    {getDifficultyLabel(quest.difficulty)}
                                                </span>
                                                {quest.completed && (
                                                    <Badge variant="default" className="bg-green-600 gap-1">
                                                        <CheckCircle2 className="h-3 w-3" />
                                                        Hoàn thành
                                                    </Badge>
                                                )}
                                            </div>

                                            <p className="text-sm text-muted-foreground mb-3">
                                                {quest.quest_description}
                                            </p>

                                            {/* Progress */}
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-muted-foreground">
                                                        Tiến độ: {quest.current_progress}/{quest.target_value}
                                                    </span>
                                                    <span className="font-bold flex items-center gap-1" style={{ color: secondaryColor }}>
                                                        <Zap className="h-4 w-4" />
                                                        +{quest.xp_reward} XP
                                                    </span>
                                                </div>
                                                <Progress value={progressPercent} className="h-2" />
                                            </div>

                                            {quest.completed && quest.completed_at && (
                                                <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                                                    Hoàn thành: {new Date(quest.completed_at).toLocaleString('vi-VN')}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </CardContent>
            </Card>

            {/* Leaderboard */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Crown className="h-5 w-5 text-yellow-500" />
                        Bảng Xếp Hạng Sự Kiện
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loadingLeaderboard ? (
                        <div className="space-y-2">
                            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16" />)}
                        </div>
                    ) : !leaderboard || leaderboard.length === 0 ? (
                        <p className="text-center py-8 text-muted-foreground">
                            Chưa có người tham gia
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {leaderboard.map((entry: any, index: number) => {
                                const getRankIcon = () => {
                                    if (entry.rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
                                    if (entry.rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
                                    if (entry.rank === 3) return <Award className="h-5 w-5 text-amber-600" />;
                                    return <span className="text-sm font-bold text-muted-foreground">#{entry.rank}</span>;
                                };

                                return (
                                    <motion.div
                                        key={entry.user_id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={`flex items-center gap-3 p-3 rounded-lg ${entry.rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950 dark:to-amber-950' : 'bg-muted/30'
                                            }`}
                                    >
                                        <div className="w-8 flex items-center justify-center">
                                            {getRankIcon()}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold">{entry.full_name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {entry.quests_completed} nhiệm vụ hoàn thành
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold" style={{ color: secondaryColor }}>
                                                {entry.total_xp} XP
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
