import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAchievements } from '@/hooks/useAchievements';
import { Skeleton } from '@/components/ui/skeleton';
import { Award, Lock, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Achievement } from '@/hooks/useAchievements';

export default function AchievementsPage() {
    const { achievements, studentAchievements, isLoading } = useAchievements();

    const unlockedIds = new Set(studentAchievements?.map(a => a.achievement_id) || []);

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            lessons: 'from-blue-500 to-indigo-600',
            streak: 'from-orange-500 to-red-600',
            level: 'from-purple-500 to-pink-600',
            stars: 'from-amber-500 to-orange-600'
        };
        return colors[category] || 'from-gray-500 to-gray-600';
    };

    const groupedAchievements = achievements?.reduce((acc: any, achievement) => {
        const category = achievement.category;
        if (!acc[category]) acc[category] = [];
        acc[category].push(achievement);
        return acc;
    }, {} as Record<string, typeof achievements>);

    const categoryNames: Record<string, string> = {
        lessons: '📚 Bài Học',
        streak: '🔥 Streak',
        level: '⭐ Cấp Độ',
        stars: '✨ Ngôi Sao'
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 space-y-6">
                <Skeleton className="h-12 w-64" />
                <div className="grid md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <Skeleton key={i} className="h-40" />
                    ))}
                </div>
            </div>
        );
    }

    const totalAchievements = achievements?.length || 0;
    const totalUnlocked = unlockedIds.size;
    const completionPercentage = totalAchievements > 0 ? (totalUnlocked / totalAchievements) * 100 : 0;

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            {/* Header */}
            <div>
                <Button variant="ghost" size="sm" asChild className="mb-4">
                    <Link to="/">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Quay lại Dashboard
                    </Link>
                </Button>

                <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
                    <Award className="h-10 w-10 text-purple-500" />
                    Thành Tích
                </h1>
                <p className="text-muted-foreground text-lg">
                    Khám phá và mở khóa các thành tích khi học tập
                </p>
            </div>

            {/* Overall Progress */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-amber-500" />
                        Tiến Độ Tổng Thể
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">{totalUnlocked} / {totalAchievements}</span>
                        <span className="text-muted-foreground">thành tích đã mở</span>
                    </div>
                    <Progress value={completionPercentage} className="h-3" />
                    <p className="text-sm text-muted-foreground">
                        {totalAchievements - totalUnlocked} thành tích còn lại
                    </p>
                </CardContent>
            </Card>

            {/* Achievements by Category */}
            {groupedAchievements && Object.entries(groupedAchievements).map(([category, categoryAchievements]) => (
                <div key={category} className="space-y-4">
                    <h2 className="text-2xl font-bold">
                        {categoryNames[category] || category}
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(categoryAchievements as Achievement[]).map((achievement) => {
                            const isUnlocked = unlockedIds.has(achievement.id);
                            const unlockedData = studentAchievements?.find(a => a.achievement_id === achievement.id);

                            return (
                                <Card
                                    key={achievement.id}
                                    className={`transition-all ${isUnlocked
                                        ? 'border-2 border-primary shadow-md'
                                        : 'opacity-60 grayscale'
                                        }`}
                                >
                                    <CardContent className="p-6">
                                        {/* Icon */}
                                        <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${getCategoryColor(category)} flex items-center justify-center text-5xl mb-4 mx-auto`}>
                                            {isUnlocked ? achievement.icon : <Lock className="h-10 w-10 text-white" />}
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-xl font-bold text-center mb-2">
                                            {achievement.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-sm text-muted-foreground text-center mb-4">
                                            {achievement.description}
                                        </p>

                                        {/* Reward */}
                                        <div className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400 font-bold">
                                            <Sparkles className="h-4 w-4" />
                                            <span>+{achievement.xp_reward} XP</span>
                                        </div>

                                        {/* Unlocked Date */}
                                        {isUnlocked && unlockedData && (
                                            <div className="mt-4 pt-4 border-t text-center text-xs text-muted-foreground">
                                                Mở khóa: {new Date(unlockedData.unlocked_at).toLocaleDateString('vi-VN')}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            ))}

            {/* Empty State */}
            {(!achievements || achievements.length === 0) && (
                <Card>
                    <CardContent className="p-12 text-center">
                        <Award className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-xl font-semibold mb-2">Chưa có thành tích</h3>
                        <p className="text-muted-foreground">
                            Hoàn thành bài học để mở khóa thành tích đầu tiên của bạn!
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
