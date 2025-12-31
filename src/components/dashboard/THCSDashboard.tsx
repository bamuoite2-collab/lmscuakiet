import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Flame, Clock, Trophy, ArrowRight, CheckCircle2, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { useGamification } from '@/hooks/useGamification';
import { Zap, Award, Target } from 'lucide-react';
import { DailyQuestsWidget } from '@/components/gamification/DailyQuestsWidget';
import { EventBanner } from '@/components/events/EventBanner';

interface THCSDashboardProps {
  userId: string;
  userName: string;
}

export function THCSDashboard({ userId, userName }: THCSDashboardProps) {
  // Fetch today's recommended lessons (latest incomplete lessons)
  const { data: todayLessons, isLoading: loadingLessons } = useQuery({
    queryKey: ['today-lessons', userId],
    queryFn: async () => {
      // Get completed lesson IDs
      const { data: progress } = await supabase
        .from('student_progress')
        .select('lesson_id')
        .eq('user_id', userId)
        .eq('completed', true);

      const completedIds = progress?.map(p => p.lesson_id) || [];

      // Get first 2 incomplete published lessons
      let query = supabase
        .from('lessons')
        .select(`
          id, title, course_id,
          courses!inner(title, thumbnail_url)
        `)
        .eq('is_published', true)
        .order('order_index', { ascending: true })
        .limit(2);

      if (completedIds.length > 0) {
        query = query.not('id', 'in', `(${completedIds.join(',')})`);
      }

      const { data } = await query;
      return data || [];
    }
  });

  // Gamification stats
  const { profile: gamificationProfile, isLoading: loadingGamification } = useGamification();

  // Weekly progress
  const { data: weeklyProgress } = useQuery({
    queryKey: ['weekly-progress', userId],
    queryFn: async () => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const { data } = await supabase
        .from('student_progress')
        .select('id')
        .eq('user_id', userId)
        .eq('completed', true)
        .gte('completed_at', weekAgo.toISOString());

      return data?.length || 0;
    }
  });

  // Total progress
  const { data: totalProgress } = useQuery({
    queryKey: ['total-progress', userId],
    queryFn: async () => {
      const { count: total } = await supabase
        .from('lessons')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true);

      const { count: completed } = await supabase
        .from('student_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('completed', true);

      return {
        total: total || 0,
        completed: completed || 0,
        percentage: total ? Math.round((completed || 0) / total * 100) : 0
      };
    }
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
          {getGreeting()}, {userName || 'bạn'}! 👋
        </h1>
        <p className="text-muted-foreground">
          Sẵn sàng học 10 phút hôm nay chưa?
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Level Card */}
        <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white border-0">
          <CardContent className="p-4">
            <Trophy className="h-6 w-6 mb-2 opacity-90" />
            <div className="text-2xl font-bold">{gamificationProfile?.current_level || 1}</div>
            <div className="text-sm opacity-90">Cấp độ</div>
          </CardContent>
        </Card>

        {/* XP Card */}
        <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0">
          <CardContent className="p-4">
            <Zap className="h-6 w-6 mb-2 opacity-90" />
            <div className="text-2xl font-bold">{gamificationProfile?.total_xp || 0}</div>
            <div className="text-sm opacity-90">XP tổng</div>
          </CardContent>
        </Card>

        {/* Streak Card */}
        <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0">
          <CardContent className="p-4">
            <Flame className="h-6 w-6 mb-2 opacity-90" />
            <div className="text-2xl font-bold">{gamificationProfile?.current_streak || 0}</div>
            <div className="text-sm opacity-90">ngày streak</div>
          </CardContent>
        </Card>

        {/* Lessons Completed Card */}
        <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0">
          <CardContent className="p-4">
            <BookOpen className="h-6 w-6 mb-2 opacity-90" />
            <div className="text-2xl font-bold">{gamificationProfile?.total_lessons_completed || 0}</div>
            <div className="text-sm opacity-90">bài đã học</div>
          </CardContent>
        </Card>

        {/* Achievements Card */}
        <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0">
          <CardContent className="p-4">
            <Award className="h-6 w-6 mb-2 opacity-90" />
            <div className="text-2xl font-bold">{gamificationProfile?.total_stars_earned || 0}</div>
            <div className="text-sm opacity-90">sao đạt được</div>
          </CardContent>
        </Card>
      </div>

      {/* XP Progress to Next Level */}
      {gamificationProfile && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Tiến độ lên cấp
            </CardTitle>
            <CardDescription>
              Còn {gamificationProfile.xp_to_next_level} XP nữa để đạt cấp {gamificationProfile.current_level + 1}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress
                value={
                  ((gamificationProfile.total_xp - Math.pow(gamificationProfile.current_level - 1, 2) * 50) /
                    (Math.pow(gamificationProfile.current_level, 2) * 50 - Math.pow(gamificationProfile.current_level - 1, 2) * 50)) * 100
                }
                className="h-3"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Cấp {gamificationProfile.current_level}</span>
                <span>Cấp {gamificationProfile.current_level + 1}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Event Banner */}
      <EventBanner />

      {/* Daily Quests */}
      <DailyQuestsWidget />

      {/* Today's Lessons */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Bài học hôm nay
              </CardTitle>
              <CardDescription>Hoàn thành 1-2 bài mỗi ngày để duy trì streak</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/courses">
                Xem tất cả
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {loadingLessons ? (
            <>
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </>
          ) : todayLessons && todayLessons.length > 0 ? (
            todayLessons.map((lesson: any) => (
              <Link
                key={lesson.id}
                to={`/courses/${lesson.course_id}/lessons/${lesson.id}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Play className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground truncate">{lesson.title}</h4>
                  <p className="text-sm text-muted-foreground truncate">
                    {lesson.courses?.title}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            ))
          ) : (
            <div className="text-center py-8">
              <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
              <p className="text-muted-foreground">Tuyệt vời! Bạn đã hoàn thành tất cả bài học.</p>
              <Button asChild className="mt-4">
                <Link to="/courses">Khám phá thêm khóa học</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Progress Bar */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Tiến độ tuần này</CardTitle>
          <CardDescription>Mục tiêu: 7 bài/tuần</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress value={Math.min(((weeklyProgress || 0) / 7) * 100, 100)} className="h-3" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{weeklyProgress || 0}/7 bài</span>
              <span>{Math.min(((weeklyProgress || 0) / 7) * 100, 100).toFixed(0)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Sẵn sàng học chưa?</h3>
          <p className="opacity-90 mb-4">Chỉ cần 10 phút mỗi ngày!</p>
          {todayLessons && todayLessons.length > 0 ? (
            <Button asChild variant="secondary" size="lg">
              <Link to={`/courses/${todayLessons[0].course_id}/lessons/${todayLessons[0].id}`}>
                <Play className="h-5 w-5 mr-2" />
                Học ngay
              </Link>
            </Button>
          ) : (
            <Button asChild variant="secondary" size="lg">
              <Link to="/courses">
                Khám phá khóa học
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}