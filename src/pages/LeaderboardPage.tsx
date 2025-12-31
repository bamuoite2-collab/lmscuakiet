import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, Medal, Award, Zap, Flame, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LeaderboardEntry {
    user_id: string;
    full_name: string | null;
    avatar_url: string | null;
    total_xp: number;
    current_level: number;
    current_streak: number;
    total_lessons_completed: number;
}

export default function LeaderboardPage() {
    const { user } = useAuth();

    // Fetch leaderboard data
    const { data: leaderboard, isLoading } = useQuery<LeaderboardEntry[]>({
        queryKey: ['leaderboard'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('student_gamification')
                .select(`
          user_id,
          total_xp,
          current_level,
          current_streak,
          total_lessons_completed,
          profiles!inner(full_name, avatar_url)
        `)
                .order('total_xp', { ascending: false })
                .limit(50);

            if (error) throw error;

            return (data || []).map((entry: any) => ({
                user_id: entry.user_id,
                full_name: entry.profiles?.full_name || 'Học sinh',
                avatar_url: entry.profiles?.avatar_url,
                total_xp: entry.total_xp,
                current_level: entry.current_level,
                current_streak: entry.current_streak,
                total_lessons_completed: entry.total_lessons_completed
            }));
        },
        staleTime: 1000 * 60 // 1 minute
    });

    const getRankIcon = (rank: number) => {
        if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
        if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
        if (rank === 3) return <Award className="h-6 w-6 text-amber-600" />;
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    };

    const getRankBg = (rank: number, isCurrentUser: boolean) => {
        if (isCurrentUser) return 'bg-blue-50 dark:bg-blue-950 border-blue-500';
        if (rank === 1) return 'bg-yellow-50 dark:bg-yellow-950 border-yellow-500';
        if (rank === 2) return 'bg-gray-50 dark:bg-gray-900 border-gray-400';
        if (rank === 3) return 'bg-amber-50 dark:bg-amber-950 border-amber-600';
        return 'bg-muted/30 border-border';
    };

    const currentUserRank = leaderboard?.findIndex(entry => entry.user_id === user?.id) ?? -1;
    const currentUserEntry = leaderboard?.[currentUserRank];

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 space-y-6">
                <Skeleton className="h-12 w-64" />
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map(i => (
                        <Skeleton key={i} className="h-20 w-full" />
                    ))}
                </div>
            </div>
        );
    }

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

                <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
                    <Trophy className="h-10 w-10 text-yellow-500" />
                    Bảng Xếp Hạng
                </h1>
                <p className="text-muted-foreground text-lg">
                    Top học sinh xuất sắc nhất
                </p>
            </div>

            {/* Current User Rank */}
            {currentUserEntry && (
                <Card className="border-2 border-primary">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Vị trí của bạn</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                {getRankIcon(currentUserRank + 1)}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold">{currentUserEntry.full_name}</h3>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                    <span className="flex items-center gap-1">
                                        <Zap className="h-3 w-3" />
                                        {currentUserEntry.total_xp} XP
                                    </span>
                                    <span>Cấp {currentUserEntry.current_level}</span>
                                    <span className="flex items-center gap-1">
                                        <Flame className="h-3 w-3" />
                                        {currentUserEntry.current_streak} ngày
                                    </span>
                                </div>
                            </div>
                            <Badge variant="outline" className="shrink-0">
                                #{currentUserRank + 1}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Leaderboard Tabs */}
            <Tabs defaultValue="xp" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="xp">
                        <Zap className="h-4 w-4 mr-2" />
                        XP
                    </TabsTrigger>
                    <TabsTrigger value="streak">
                        <Flame className="h-4 w-4 mr-2" />
                        Streak
                    </TabsTrigger>
                    <TabsTrigger value="lessons">
                        <Trophy className="h-4 w-4 mr-2" />
                        Bài học
                    </TabsTrigger>
                </TabsList>

                {/* XP Leaderboard */}
                <TabsContent value="xp" className="space-y-3">
                    {leaderboard?.map((entry, index) => {
                        const isCurrentUser = entry.user_id === user?.id;
                        const rank = index + 1;

                        return (
                            <Card
                                key={entry.user_id}
                                className={`transition-all border-2 ${getRankBg(rank, isCurrentUser)} ${isCurrentUser ? 'scale-[1.02]' : ''
                                    }`}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-4">
                                        {/* Rank */}
                                        <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center shrink-0">
                                            {getRankIcon(rank)}
                                        </div>

                                        {/* User Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold truncate flex items-center gap-2">
                                                {entry.full_name}
                                                {isCurrentUser && (
                                                    <Badge variant="secondary" className="text-xs">Bạn</Badge>
                                                )}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                Cấp {entry.current_level} • {entry.total_lessons_completed} bài học
                                            </p>
                                        </div>

                                        {/* XP */}
                                        <div className="text-right shrink-0">
                                            <div className="flex items-center gap-1 text-lg font-bold text-primary">
                                                <Zap className="h-5 w-5" />
                                                {entry.total_xp.toLocaleString()}
                                            </div>
                                            <p className="text-xs text-muted-foreground">XP</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </TabsContent>

                {/* Streak Leaderboard */}
                <TabsContent value="streak" className="space-y-3">
                    {[...(leaderboard || [])].sort((a, b) => b.current_streak - a.current_streak).map((entry, index) => {
                        const isCurrentUser = entry.user_id === user?.id;
                        const rank = index + 1;

                        return (
                            <Card key={entry.user_id} className={`border-2 ${getRankBg(rank, isCurrentUser)}`}>
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center shrink-0">
                                            {getRankIcon(rank)}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold">{entry.full_name}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {entry.total_xp.toLocaleString()} XP
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-1 text-lg font-bold text-orange-500">
                                                <Flame className="h-5 w-5" />
                                                {entry.current_streak}
                                            </div>
                                            <p className="text-xs text-muted-foreground">ngày</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </TabsContent>

                {/* Lessons Leaderboard */}
                <TabsContent value="lessons" className="space-y-3">
                    {[...(leaderboard || [])].sort((a, b) => b.total_lessons_completed - a.total_lessons_completed).map((entry, index) => {
                        const isCurrentUser = entry.user_id === user?.id;
                        const rank = index + 1;

                        return (
                            <Card key={entry.user_id} className={`border-2 ${getRankBg(rank, isCurrentUser)}`}>
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center shrink-0">
                                            {getRankIcon(rank)}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold">{entry.full_name}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Cấp {entry.current_level} • {entry.total_xp.toLocaleString()} XP
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-1 text-lg font-bold text-emerald-600">
                                                <Trophy className="h-5 w-5" />
                                                {entry.total_lessons_completed}
                                            </div>
                                            <p className="text-xs text-muted-foreground">bài học</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </TabsContent>
            </Tabs>

            {/* Empty State */}
            {(!leaderboard || leaderboard.length === 0) && (
                <Card>
                    <CardContent className="p-12 text-center">
                        <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-xl font-semibold mb-2">Chưa có dữ liệu</h3>
                        <p className="text-muted-foreground">
                            Hãy hoàn thành bài học để xuất hiện trên bảng xếp hạng!
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
