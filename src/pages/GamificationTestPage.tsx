import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tantml:query/react-query';
import { GamificationTestUtils } from '@/lib/gamification-test-utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Trophy, Flame, Star, Award, RefreshCw, Zap } from 'lucide-react';

export default function GamificationTestPage() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [xpAmount, setXpAmount] = useState(50);

    // Fetch current stats
    const { data: stats, isLoading } = useQuery({
        queryKey: ['gamification-test-stats'],
        queryFn: () => GamificationTestUtils.getStats()
    });

    // Fetch XP history
    const { data: xpHistory } = useQuery({
        queryKey: ['gamification-test-history'],
        queryFn: () => GamificationTestUtils.getXPHistory(5)
    });

    // Award XP mutation
    const awardXPMutation = useMutation({
        mutationFn: (amount: number) => GamificationTestUtils.awardXP(amount, 'Manual test'),
        onSuccess: (data: any) => {
            toast({
                title: 'XP Awarded!',
                description: `+${data.xp_awarded} XP. ${data.leveled_up ? `Level up to ${data.new_level}!` : ''}`
            });
            queryClient.invalidateQueries({ queryKey: ['gamification-test-stats'] });
            queryClient.invalidateQueries({ queryKey: ['gamification-test-history'] });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive'
            });
        }
    });

    // Update streak mutation
    const updateStreakMutation = useMutation({
        mutationFn: () => GamificationTestUtils.updateStreak(),
        onSuccess: (data: any) => {
            toast({
                title: 'Streak Updated!',
                description: `Current streak: ${data.streak} days. ${data.streak_bonus_xp > 0 ? `+${data.streak_bonus_xp} bonus XP` : ''}`
            });
            queryClient.invalidateQueries({ queryKey: ['gamification-test-stats'] });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive'
            });
        }
    });

    // Check achievements mutation
    const checkAchievementsMutation = useMutation({
        mutationFn: () => GamificationTestUtils.checkAchievements(),
        onSuccess: (data: any) => {
            toast({
                title: 'Achievements Checked!',
                description: `${data.unlocked_count} new achievements unlocked!`
            });
            queryClient.invalidateQueries({ queryKey: ['gamification-test-stats'] });
        }
    });

    // Simulate lesson mutation
    const simulateLessonMutation = useMutation({
        mutationFn: (stars: number) => GamificationTestUtils.simulateLessonComplete(stars),
        onSuccess: (data: any) => {
            toast({
                title: 'Lesson Completed!',
                description: `+${data.xp_awarded} XP earned`
            });
            queryClient.invalidateQueries({ queryKey: ['gamification-test-stats'] });
            queryClient.invalidateQueries({ queryKey: ['gamification-test-history'] });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive'
            });
        }
    });

    // Reset data mutation
    const resetMutation = useMutation({
        mutationFn: () => GamificationTestUtils.resetData(),
        onSuccess: () => {
            toast({
                title: 'Data Reset!',
                description: 'All gamification data has been reset'
            });
            queryClient.invalidateQueries({ queryKey: ['gamification-test-stats'] });
            queryClient.invalidateQueries({ queryKey: ['gamification-test-history'] });
        }
    });

    if (isLoading) return <div className="container mx-auto p-6">Loading...</div>;

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2">🧪 Gamification Test Panel</h1>
                <p className="text-muted-foreground">Admin tool to test gamification features</p>
            </div>

            {/* Current Stats */}
            <Card>
                <CardHeader>
                    <CardTitle>Current Stats</CardTitle>
                    <CardDescription>Your gamification profile</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-yellow-500" />
                            <div>
                                <div className="text-2xl font-bold">{stats?.current_level || 0}</div>
                                <div className="text-sm text-muted-foreground">Level</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-blue-500" />
                            <div>
                                <div className="text-2xl font-bold">{stats?.total_xp || 0}</div>
                                <div className="text-sm text-muted-foreground">Total XP</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Flame className="h-5 w-5 text-orange-500" />
                            <div>
                                <div className="text-2xl font-bold">{stats?.current_streak || 0}</div>
                                <div className="text-sm text-muted-foreground">Streak</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Star className="h-5 w-5 text-purple-500" />
                            <div>
                                <div className="text-2xl font-bold">{stats?.total_lessons_completed || 0}</div>
                                <div className="text-sm text-muted-foreground">Lessons</div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                        <div className="text-sm text-muted-foreground">XP to next level:</div>
                        <div className="text-lg font-bold">{stats?.xp_to_next_level || 100} XP</div>
                    </div>
                </CardContent>
            </Card>

            {/* Test Actions */}
            <div className="grid md:grid-cols-2 gap-4">
                {/* Award XP */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="h-5 w-5" />
                            Award XP
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input
                            type="number"
                            value={xpAmount}
                            onChange={(e) => setXpAmount(Number(e.target.value))}
                            placeholder="XP amount"
                        />
                        <Button
                            onClick={() => awardXPMutation.mutate(xpAmount)}
                            disabled={awardXPMutation.isPending}
                            className="w-full"
                        >
                            Award {xpAmount} XP
                        </Button>
                        <div className="flex gap-2">
                            <Button onClick={() => awardXPMutation.mutate(50)} variant="outline" size="sm">+50 XP</Button>
                            <Button onClick={() => awardXPMutation.mutate(100)} variant="outline" size="sm">+100 XP</Button>
                            <Button onClick={() => awardXPMutation.mutate(500)} variant="outline" size="sm">+500 XP</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Streak */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Flame className="h-5 w-5" />
                            Streak System
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button
                            onClick={() => updateStreakMutation.mutate()}
                            disabled={updateStreakMutation.isPending}
                            className="w-full"
                        >
                            Update Streak (Today)
                        </Button>
                        <p className="text-sm text-muted-foreground">
                            Click to mark today as active. Streak will increment if you studied yesterday.
                        </p>
                    </CardContent>
                </Card>

                {/* Achievements */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Award className="h-5 w-5" />
                            Achievements
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={() => checkAchievementsMutation.mutate()}
                            disabled={checkAchievementsMutation.isPending}
                            className="w-full"
                        >
                            Check & Unlock Achievements
                        </Button>
                    </CardContent>
                </Card>

                {/* Simulate Lesson */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Star className="h-5 w-5" />
                            Simulate Lesson
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Button onClick={() => simulateLessonMutation.mutate(1)} variant="outline" className="w-full">
                            ⭐ 1 Star (10 XP)
                        </Button>
                        <Button onClick={() => simulateLessonMutation.mutate(2)} variant="outline" className="w-full">
                            ⭐⭐ 2 Stars (20 XP)
                        </Button>
                        <Button onClick={() => simulateLessonMutation.mutate(3)} variant="outline" className="w-full">
                            ⭐⭐⭐ 3 Stars (30 XP)
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* XP History */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent XP Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    {xpHistory && xpHistory.length > 0 ? (
                        <div className="space-y-2">
                            {xpHistory.map((tx: any) => (
                                <div key={tx.id} className="flex justify-between items-center p-2 bg-muted rounded">
                                    <div>
                                        <div className="font-medium">+{tx.xp_amount} XP</div>
                                        <div className="text-sm text-muted-foreground">{tx.description || tx.source_type}</div>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {new Date(tx.created_at).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No transactions yet</p>
                    )}
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                        <RefreshCw className="h-5 w-5" />
                        Danger Zone
                    </CardTitle>
                    <CardDescription>Reset all gamification data for testing</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button
                        onClick={() => resetMutation.mutate()}
                        disabled={resetMutation.isPending}
                        variant="destructive"
                    >
                        Reset All Data
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
