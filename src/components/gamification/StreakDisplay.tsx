import { Flame, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakDisplayProps {
    streak: number;
    longestStreak: number;
    className?: string;
    compact?: boolean;
}

export function StreakDisplay({
    streak,
    longestStreak,
    className,
    compact = false
}: StreakDisplayProps) {
    const isActive = streak > 0;
    const isOnFire = streak >= 7;

    if (compact) {
        return (
            <div className={cn("flex items-center gap-2", className)}>
                <Flame className={cn(
                    "h-5 w-5",
                    isActive ? "text-orange-500" : "text-muted-foreground/50"
                )} />
                <span className={cn(
                    "font-bold",
                    isActive ? "text-foreground" : "text-muted-foreground"
                )}>
                    {streak}
                </span>
            </div>
        );
    }

    return (
        <div className={cn(
            "relative flex items-center gap-4 p-4 rounded-xl border overflow-hidden",
            isActive
                ? "bg-gradient-to-r from-orange-500/10 via-red-500/10 to-yellow-500/10 border-orange-500/30"
                : "bg-muted/50 border-border",
            className
        )}>
            {/* Background effect for long streaks */}
            {isOnFire && (
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 animate-pulse" />
            )}

            <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-background/50 border border-border/50">
                {isOnFire ? (
                    <Zap className="h-7 w-7 text-orange-500 fill-orange-500 animate-pulse" />
                ) : (
                    <Flame className={cn(
                        "h-7 w-7",
                        isActive ? "text-orange-500" : "text-muted-foreground/50"
                    )} />
                )}
            </div>

            <div className="relative flex-1">
                <div className="flex items-baseline gap-2">
                    <span className="font-display text-2xl font-bold text-foreground">
                        {streak}
                    </span>
                    <span className="text-sm text-muted-foreground">
                        {streak === 0
                            ? "ngày học liên tiếp"
                            : streak === 1
                                ? "ngày"
                                : "ngày liên tiếp"}
                    </span>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                    Kỷ lục cá nhân: {longestStreak} ngày
                </div>

                {/* Motivational messages */}
                {isActive && (
                    <div className="text-xs font-medium mt-1">
                        {streak >= 30 && (
                            <span className="text-purple-600 dark:text-purple-400">
                                💎 Huyền thoại! Tiếp tục phát huy!
                            </span>
                        )}
                        {streak >= 14 && streak < 30 && (
                            <span className="text-blue-600 dark:text-blue-400">
                                🌟 Tuyệt vời! Gần đạt mốc 30 ngày!
                            </span>
                        )}
                        {streak >= 7 && streak < 14 && (
                            <span className="text-orange-600 dark:text-orange-400">
                                🔥 Đang bùng cháy! Đừng dừng lại!
                            </span>
                        )}
                        {streak >= 3 && streak < 7 && (
                            <span className="text-green-600 dark:text-green-400">
                                ✨ Tốt lắm! Tiếp tục phát huy!
                            </span>
                        )}
                        {streak < 3 && (
                            <span className="text-blue-600 dark:text-blue-400">
                                💪 Khởi đầu tốt! Duy trì nhé!
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
