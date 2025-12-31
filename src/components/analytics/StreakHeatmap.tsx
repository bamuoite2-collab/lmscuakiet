import { useAnalytics } from '@/hooks/useAnalytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Flame } from 'lucide-react';
import { motion } from 'framer-motion';

export function StreakHeatmap() {
    const { streakData, isLoading } = useAnalytics();

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-32 w-full" />
                </CardContent>
            </Card>
        );
    }

    // Get last 365 days
    const today = new Date();
    const days: Array<{ date: Date; intensity: number; minutes: number }> = [];

    for (let i = 364; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        const dayData = streakData?.find(d => d.date === dateStr);
        days.push({
            date,
            intensity: dayData?.intensity || 0,
            minutes: dayData?.study_minutes || 0
        });
    }

    // Group by weeks
    const weeks: typeof days[] = [];
    for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7));
    }

    const getColor = (intensity: number) => {
        const colors = [
            'bg-muted',              // 0 - no activity
            'bg-emerald-200 dark:bg-emerald-900',  // 1 - < 15 min
            'bg-emerald-400 dark:bg-emerald-700',  // 2 - < 30 min  
            'bg-emerald-600 dark:bg-emerald-500',  // 3 - < 60 min
            'bg-emerald-800 dark:bg-emerald-300'   // 4 - >= 60 min
        ];
        return colors[intensity] || colors[0];
    };

    const monthLabels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
    const dayLabels = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-orange-500" />
                    Lịch Học Tập 365 Ngày
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <div className="inline-flex gap-1" style={{ minWidth: '800px' }}>
                        {/* Day labels */}
                        <div className="flex flex-col gap-1 justify-around text-xs text-muted-foreground pr-2">
                            {dayLabels.map(day => (
                                <div key={day} className="h-3 flex items-center">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Heatmap grid */}
                        <div className="flex gap-1">
                            {weeks.map((week, weekIndex) => (
                                <div key={weekIndex} className="flex flex-col gap-1">
                                    {/* Month label */}
                                    {weekIndex % 4 === 0 && week[0] && (
                                        <div className="text-xs text-muted-foreground h-4">
                                            {monthLabels[week[0].date.getMonth()]}
                                        </div>
                                    )}
                                    {weekIndex % 4 !== 0 && <div className="h-4" />}

                                    {/* Days */}
                                    {week.map((day, dayIndex) => (
                                        <motion.div
                                            key={`${weekIndex}-${dayIndex}`}
                                            className={`w-3 h-3 rounded-sm ${getColor(day.intensity)} cursor-pointer transition-all hover:ring-2 hover:ring-blue-500`}
                                            whileHover={{ scale: 1.5 }}
                                            title={`${day.date.toLocaleDateString('vi-VN')}\n${day.minutes} phút học`}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                        <span>Ít</span>
                        {[0, 1, 2, 3, 4].map(intensity => (
                            <div
                                key={intensity}
                                className={`w-3 h-3 rounded-sm ${getColor(intensity)}`}
                            />
                        ))}
                        <span>Nhiều</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
