import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Target, TrendingUp, XCircle, Clock, ArrowRight, FileText, BarChart3, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface THPTDashboardProps {
  userId: string;
  userName: string;
}

export function THPTDashboard({ userId, userName }: THPTDashboardProps) {
  // Fetch quiz attempts with scores
  const { data: quizStats, isLoading: loadingQuizStats } = useQuery({
    queryKey: ['quiz-stats', userId],
    queryFn: async () => {
      const { data } = await supabase
        .from('quiz_attempts')
        .select('score, total_questions, completed_at')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false })
        .limit(20);

      if (!data || data.length === 0) {
        return {
          avgScore: 0,
          totalAttempts: 0,
          totalWrong: 0,
          recentScores: [],
          trend: 0
        };
      }

      const totalScore = data.reduce((acc, d) => acc + d.score, 0);
      const totalQuestions = data.reduce((acc, d) => acc + d.total_questions, 0);
      const totalWrong = totalQuestions - totalScore;
      const avgScore = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;

      // Calculate trend (compare last 5 vs previous 5)
      const recent5 = data.slice(0, 5);
      const previous5 = data.slice(5, 10);

      const recentAvg = recent5.length > 0
        ? recent5.reduce((acc, d) => acc + (d.score / d.total_questions * 100), 0) / recent5.length
        : 0;
      const previousAvg = previous5.length > 0
        ? previous5.reduce((acc, d) => acc + (d.score / d.total_questions * 100), 0) / previous5.length
        : recentAvg;

      const trend = recentAvg - previousAvg;

      return {
        avgScore,
        totalAttempts: data.length,
        totalWrong,
        recentScores: data.slice(0, 5).map(d => ({
          score: Math.round((d.score / d.total_questions) * 100),
          date: d.completed_at
        })),
        trend: Math.round(trend)
      };
    }
  });

  // Fetch available quizzes
  const { data: availableQuizzes, isLoading: loadingQuizzes } = useQuery({
    queryKey: ['available-quizzes', userId],
    queryFn: async () => {
      const { data } = await supabase
        .from('quizzes')
        .select(`
          id, title, time_limit_minutes,
          lessons!inner(id, title, is_published, courses!inner(title))
        `)
        .eq('lessons.is_published', true)
        .limit(5);

      return data || [];
    }
  });

  // Fetch recent attempts for display
  const { data: recentAttempts } = useQuery({
    queryKey: ['recent-attempts', userId],
    queryFn: async () => {
      const { data } = await supabase
        .from('quiz_attempts')
        .select(`
          id, score, total_questions, completed_at,
          quizzes(title)
        `)
        .eq('user_id', userId)
        .order('completed_at', { ascending: false })
        .limit(5);

      return data || [];
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
          {getGreeting()}, {userName || 'bạn'}! 💪
        </h1>
        <p className="text-muted-foreground">
          Luyện đề và cải thiện điểm số mỗi ngày
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-0">
          <CardContent className="p-3 md:p-4">
            <Target className="h-5 w-5 md:h-6 md:w-6 mb-1 md:mb-2 opacity-90" />
            <div className="text-xl md:text-2xl font-bold">{quizStats?.avgScore || 0}%</div>
            <div className="text-xs md:text-sm opacity-90 truncate">điểm TB</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0">
          <CardContent className="p-3 md:p-4">
            <FileText className="h-5 w-5 md:h-6 md:w-6 mb-1 md:mb-2 opacity-90" />
            <div className="text-xl md:text-2xl font-bold">{quizStats?.totalAttempts || 0}</div>
            <div className="text-xs md:text-sm opacity-90 truncate">đề đã làm</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-orange-600 text-white border-0">
          <CardContent className="p-3 md:p-4">
            <XCircle className="h-5 w-5 md:h-6 md:w-6 mb-1 md:mb-2 opacity-90" />
            <div className="text-xl md:text-2xl font-bold">{quizStats?.totalWrong || 0}</div>
            <div className="text-xs md:text-sm opacity-90 truncate">câu sai</div>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br ${(quizStats?.trend || 0) >= 0 ? 'from-green-500 to-emerald-600' : 'from-amber-500 to-orange-600'} text-white border-0`}>
          <CardContent className="p-3 md:p-4">
            <TrendingUp className="h-5 w-5 md:h-6 md:w-6 mb-1 md:mb-2 opacity-90" />
            <div className="text-xl md:text-2xl font-bold">
              {(quizStats?.trend || 0) >= 0 ? '+' : ''}{quizStats?.trend || 0}%
            </div>
            <div className="text-xs md:text-sm opacity-90 truncate">xu hướng</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Quiz Section */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Luyện đề nhanh
              </CardTitle>
              <CardDescription>Chọn đề để luyện tập ngay</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/courses">
                Xem tất cả
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {loadingQuizzes ? (
            <>
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </>
          ) : availableQuizzes && availableQuizzes.length > 0 ? (
            availableQuizzes.map((quiz: any) => (
              <Link
                key={quiz.id}
                to={`/lesson/${quiz.lessons.id}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground truncate">{quiz.title}</h4>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="truncate">{quiz.lessons.courses?.title}</span>
                    {quiz.time_limit_minutes && (
                      <span className="flex items-center gap-1 shrink-0">
                        <Clock className="h-3 w-3" />
                        {quiz.time_limit_minutes} phút
                      </span>
                    )}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            ))
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Chưa có đề thi nào.</p>
              <Button asChild className="mt-4">
                <Link to="/courses">Xem khóa học</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Attempts */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Kết quả gần đây
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentAttempts && recentAttempts.length > 0 ? (
            <div className="space-y-3">
              {recentAttempts.map((attempt: any) => {
                const percentage = Math.round((attempt.score / attempt.total_questions) * 100);
                return (
                  <div key={attempt.id} className="flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium truncate">{attempt.quizzes?.title}</span>
                        <span className={`text-sm font-bold ${percentage >= 80 ? 'text-emerald-600' :
                            percentage >= 60 ? 'text-amber-600' : 'text-red-600'
                          }`}>
                          {percentage}%
                        </span>
                      </div>
                      <Progress
                        value={percentage}
                        className={`h-2 ${percentage >= 80 ? '[&>div]:bg-emerald-500' :
                            percentage >= 60 ? '[&>div]:bg-amber-500' : '[&>div]:bg-red-500'
                          }`}
                      />
                      <div className="text-xs text-muted-foreground mt-1">
                        {attempt.score}/{attempt.total_questions} câu đúng • {new Date(attempt.completed_at).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              Chưa có kết quả nào. Hãy làm đề đầu tiên!
            </div>
          )}
        </CardContent>
      </Card>

      {/* CTA */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-0">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Luyện đề ngay!</h3>
          <p className="opacity-90 mb-4">Cải thiện điểm số mỗi ngày với việc luyện tập đều đặn</p>
          <Button asChild variant="secondary" size="lg">
            <Link to="/courses">
              <Target className="h-5 w-5 mr-2" />
              Làm đề ngay
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}