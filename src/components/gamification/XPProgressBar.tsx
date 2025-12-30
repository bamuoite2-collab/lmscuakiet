import { Progress } from '@/components/ui/progress';
import { Star, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface XPProgressBarProps {
    currentXP: number;
    xpToNextLevel: number;
    currentLevel: number;
    showAnimation?: boolean;
    className?: string;
}

export function XPProgressBar({
    currentXP,
    xpToNextLevel,
    currentLevel,
    showAnimation = false,
    className
}: XPProgressBarProps) {
    const totalXPForLevel = currentXP + xpToNextLevel;
    const progress = totalXPForLevel > 0 ? (currentXP / totalXPForLevel) * 100 : 0;

    return (
        <div className={cn("space-y-2", className)}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                        {showAnimation && (
                            <Sparkles className="h-4 w-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
                        )}
                    </div>
                    <span className="font-semibold text-foreground">
                        Cấp {currentLevel}
                    </span>
                </div>
                <span className="text-sm text-muted-foreground">
                    {currentXP.toLocaleString()} / {totalXPForLevel.toLocaleString()} XP
                </span>
            </div>
            <Progress
                value={progress}
                className={cn(
                    "h-3",
                    showAnimation && "transition-all duration-700 ease-out"
                )}
            />
            {xpToNextLevel === 0 && (
                <p className="text-xs text-center text-muted-foreground animate-bounce">
                    🎉 Cấp độ tối đa!
                </p>
            )}
        </div>
    );
}
