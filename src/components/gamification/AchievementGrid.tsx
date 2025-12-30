import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Achievement {
    id: string;
    code: string;
    title: string;
    description: string;
    icon: string;
    category: string;
    xp_reward: number;
    is_active: boolean;
}

export interface StudentAchievement {
    achievement_id: string;
    unlocked_at: string;
}

interface AchievementBadgeProps {
    achievement: Achievement;
    isUnlocked: boolean;
    unlockedAt?: string;
    showXP?: boolean;
}

function AchievementBadge({
    achievement,
    isUnlocked,
    unlockedAt,
    showXP = true
}: AchievementBadgeProps) {
    return (
        <div className={cn(
            "relative group p-4 rounded-lg border-2 transition-all",
            isUnlocked
                ? "bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30 hover:border-yellow-500/50"
                : "bg-muted/30 border-border opacity-60 hover:opacity-80"
        )}>
            {/* Lock icon for locked achievements */}
            {!isUnlocked && (
                <div className="absolute top-2 right-2">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                </div>
            )}

            {/* Check icon for unlocked */}
            {isUnlocked && (
                <div className="absolute top-2 right-2">
                    <Check className="h-4 w-4 text-green-500" />
                </div>
            )}

            {/* Achievement Icon */}
            <div className="text-4xl mb-2 text-center">
                {achievement.icon}
            </div>

            {/* Achievement Title */}
            <h4 className="font-semibold text-sm text-center mb-1">
                {achievement.title}
            </h4>

            {/* Description */}
            <p className="text-xs text-muted-foreground text-center mb-2">
                {achievement.description}
            </p>

            {/* XP Reward */}
            {showXP && achievement.xp_reward > 0 && (
                <div className="flex items-center justify-center gap-1 text-xs">
                    <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                        +{achievement.xp_reward} XP
                    </span>
                </div>
            )}

            {/* Unlock date */}
            {isUnlocked && unlockedAt && (
                <div className="text-xs text-muted-foreground text-center mt-2 pt-2 border-t">
                    {new Date(unlockedAt).toLocaleDateString('vi-VN')}
                </div>
            )}
        </div>
    );
}

interface AchievementGridProps {
    achievements: Achievement[];
    studentAchievements: StudentAchievement[];
    category?: string;
}

export function AchievementGrid({
    achievements,
    studentAchievements,
    category
}: AchievementGridProps) {
    const filteredAchievements = category
        ? achievements.filter(a => a.category === category)
        : achievements;

    const unlockedIds = new Set(studentAchievements.map(sa => sa.achievement_id));

    const unlockedCount = filteredAchievements.filter(a =>
        unlockedIds.has(a.id)
    ).length;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        🏆 Huy Hiệu
                        {category && (
                            <Badge variant="secondary" className="ml-2">
                                {category === 'learning' && 'Học Tập'}
                                {category === 'streak' && 'Chuỗi Ngày'}
                                {category === 'mastery' && 'Thành Thạo'}
                                {category === 'social' && 'Xã Hội'}
                            </Badge>
                        )}
                    </CardTitle>
                    <Badge variant="outline">
                        {unlockedCount} / {filteredAchievements.length}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredAchievements.map(achievement => {
                        const studentAchievement = studentAchievements.find(
                            sa => sa.achievement_id === achievement.id
                        );

                        return (
                            <AchievementBadge
                                key={achievement.id}
                                achievement={achievement}
                                isUnlocked={!!studentAchievement}
                                unlockedAt={studentAchievement?.unlocked_at}
                            />
                        );
                    })}
                </div>

                {filteredAchievements.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                        Chưa có huy hiệu nào
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
