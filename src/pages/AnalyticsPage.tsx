import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Clock, BookOpen, Target, Zap, Award, TrendingUp,
    Calendar, BarChart3, ArrowLeft, Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { StreakHeatmap } from '@/components/analytics/StreakHeatmap';

export default function AnalyticsPage() {
    const {
        weeklyStats,
        monthlyStats,
        streakData,
        dailyAnalytics,
        isLoading
    } = useAnalytics();

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 space-y-6">
                <Skeleton className="h-12 w-64" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <Skeleton key={i} className="h-32" />
                    ))}
                </div>
                <Skeleton className="h-96" />
            </div>
        );
    }

    const formatTime = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0) {
            return `${hours}h ${mins}m`;
        }
        return `${mins}m`;
    };

    return (
        <div className="container mx-auto px-4 py-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Button variant="ghost" size="sm" asChild className="mb-4">
                        <Link to="/">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Quay lại Dashboard
                        </Link>
                    </Button>

                    <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
                        <BarChart3 className="h-10 w-10 text-blue-500" />
                        Phân Tích Học Tập
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Theo dõi tiến độ và hiệu quả học tập của bạn
                    </p>
                </div>

                <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export
                </Button>
            </div>

            {/* Weekly Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                <TrendingUp className="h-4 w-4 text-green-600" />
                            </div>
                            <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                                {formatTime(weeklyStats?.total_study_minutes || 0)}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">Thời gian học (tuần)</p>
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                                Trung bình {formatTime(Math.round(weeklyStats?.avg_study_minutes || 0))}/ngày
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-emerald-200 dark:border-emerald-800">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">
                                {weeklyStats?.total_lessons || 0}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">Bài học hoàn thành</p>
                            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">
                                {weeklyStats?.days_active || 0} ngày hoạt động
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 border-amber-200 dark:border-amber-800">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <Target className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div className="text-3xl font-bold text-amber-700 dark:text-amber-300">
                                {weeklyStats?.accuracy || 0}%
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">Độ chính xác</p>
                            <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                                {weeklyStats?.total_quizzes || 0} bài quiz
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                                {weeklyStats?.total_xp || 0}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">XP kiếm được</p>
                            <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">
                                {weeklyStats?.total_stars || 0} ⭐ sao
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Monthly Summary */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-yellow-500" />
                        Tổng Kết Tháng
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {!monthlyStats ? (
                        <p className="text-muted-foreground text-center py-8">
                            Chưa có dữ liệu. Hoàn thành bài học để xem phân tích!
                        </p>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-muted/30 rounded-lg">
                                <p className="text-2xl font-bold">{formatTime(monthlyStats.total_study_minutes || 0)}</p>
                                <p className="text-sm text-muted-foreground">Tổng thời gian học</p>
                            </div>
                            <div className="text-center p-4 bg-muted/30 rounded-lg">
                                <p className="text-2xl font-bold">{monthlyStats.total_lessons || 0}</p>
                                <p className="text-sm text-muted-foreground">Bài học hoàn thành</p>
                            </div>
                            <div className="text-center p-4 bg-muted/30 rounded-lg">
                                <p className="text-2xl font-bold">{monthlyStats.total_xp || 0}</p>
                                <p className="text-sm text-muted-foreground">XP kiếm được</p>
                            </div>
                            <div className="text-center p-4 bg-muted/30 rounded-lg">
                                <p className="text-2xl font-bold">{monthlyStats.days_active || 0}</p>
                                <p className="text-sm text-muted-foreground">Ngày hoạt động</p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Streak Heatmap */}
            <StreakHeatmap />

            {/* Insights */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        💡 Gợi Ý Học Tập
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {weeklyStats && (
                        <>
                            {weeklyStats.total_study_minutes < 60 && (
                                <p className="text-sm">
                                    💪 Hãy cố gắng học thêm! Mục tiêu 1 giờ/tuần sẽ giúp bạn tiến bộ nhanh hơn.
                                </p>
                            )}
                            {weeklyStats.accuracy < 70 && (
                                <p className="text-sm">
                                    📖 Độ chính xác còn thấp. Hãy xem lại lý thuyết trước khi làm bài tập.
                                </p>
                            )}
                            {weeklyStats.days_active >= 5 && (
                                <p className="text-sm">
                                    🌟 Tuyệt vời! Bạn đã học {weeklyStats.days_active} ngày trong tuần này!
                                </p>
                            )}
                            {weeklyStats.total_lessons >= 10 && (
                                <p className="text-sm">
                                    🚀 Amazing! {weeklyStats.total_lessons} bài trong tuần - bạn đang rất tích cực!
                                </p>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
