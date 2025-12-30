import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BookOpen, Trophy, Clock, Target, Award, Star, Flame, Zap, GraduationCap, FlaskConical } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface BadgeInfo {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  earned: boolean;
}

export default function MyProgress() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Fetch total lessons count
  const { data: totalLessons = 0 } = useQuery({
    queryKey: ['total-lessons'],
    queryFn: async () => {
      const { count } = await supabase
        .from('lessons')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true);
      return count || 0;
    },
    enabled: !!user,
  });

  // Fetch completed lessons
  const { data: completedLessons = 0 } = useQuery({
    queryKey: ['completed-lessons', user?.id],
    queryFn: async () => {
      const { count } = await supabase
        .from('student_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user!.id)
        .eq('completed', true);
      return count || 0;
    },
    enabled: !!user,
  });

  // Fetch simulation interactions
  const { data: simulationInteractions = [] } = useQuery({
    queryKey: ['simulation-interactions', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('simulation_interactions')
        .select('*')
        .eq('user_id', user!.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Calculate simulation stats
  const totalSimulationTime = simulationInteractions.reduce((acc, s) => acc + (s.total_time_seconds || 0), 0);
  const simulationCount = simulationInteractions.length;

  // Fetch quiz attempts for stats and chart
  const { data: quizAttempts = [], isLoading: attemptsLoading } = useQuery({
    queryKey: ['my-quiz-attempts', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quiz_attempts')
        .select(`
          id,
          score,
          total_questions,
          time_taken_seconds,
          completed_at,
          quiz:quizzes(title)
        `)
        .eq('user_id', user!.id)
        .order('completed_at', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Calculate statistics
  const averageScore = quizAttempts.length > 0
    ? Math.round(quizAttempts.reduce((acc, a) => acc + (a.score / a.total_questions) * 10, 0) / quizAttempts.length * 10) / 10
    : 0;

  const totalTimeSeconds = quizAttempts.reduce((acc, a) => acc + (a.time_taken_seconds || 0), 0) + totalSimulationTime;
  const totalTimeMinutes = Math.floor(totalTimeSeconds / 60);
  const totalTimeHours = Math.floor(totalTimeMinutes / 60);

  // Prepare chart data
  const chartData = quizAttempts.slice(-10).map((attempt, index) => ({
    name: `Lần ${index + 1}`,
    score: Math.round((attempt.score / attempt.total_questions) * 10 * 10) / 10,
    date: format(new Date(attempt.completed_at), 'dd/MM', { locale: vi }),
  }));

  // Define badges
  const badges: BadgeInfo[] = [
    {
      id: 'first-lesson',
      name: 'Bước Đầu Tiên',
      description: 'Hoàn thành bài học đầu tiên',
      icon: <BookOpen className="h-6 w-6" />,
      color: 'bg-emerald-500',
      earned: completedLessons >= 1,
    },
    {
      id: 'diligent',
      name: 'Người Chăm Chỉ',
      description: 'Hoàn thành 5 bài học',
      icon: <Flame className="h-6 w-6" />,
      color: 'bg-orange-500',
      earned: completedLessons >= 5,
    },
    {
      id: 'scholar',
      name: 'Học Giả',
      description: 'Hoàn thành 10 bài học',
      icon: <GraduationCap className="h-6 w-6" />,
      color: 'bg-blue-500',
      earned: completedLessons >= 10,
    },
    {
      id: 'first-quiz',
      name: 'Thử Thách Đầu Tiên',
      description: 'Hoàn thành bài quiz đầu tiên',
      icon: <Target className="h-6 w-6" />,
      color: 'bg-purple-500',
      earned: quizAttempts.length >= 1,
    },
    {
      id: 'chemist',
      name: 'Nhà Hóa Học Tài Ba',
      description: 'Đạt điểm 10 trong một bài quiz',
      icon: <Star className="h-6 w-6" />,
      color: 'bg-yellow-500',
      earned: quizAttempts.some(a => a.score === a.total_questions),
    },
    {
      id: 'high-achiever',
      name: 'Thành Tích Cao',
      description: 'Điểm trung bình trên 8',
      icon: <Trophy className="h-6 w-6" />,
      color: 'bg-amber-500',
      earned: averageScore >= 8,
    },
    {
      id: 'quiz-master',
      name: 'Bậc Thầy Quiz',
      description: 'Hoàn thành 10 bài quiz',
      icon: <Award className="h-6 w-6" />,
      color: 'bg-pink-500',
      earned: quizAttempts.length >= 10,
    },
    {
      id: 'speedster',
      name: 'Tia Chớp',
      description: 'Hoàn thành quiz trong dưới 2 phút',
      icon: <Zap className="h-6 w-6" />,
      color: 'bg-cyan-500',
      earned: quizAttempts.some(a => (a.time_taken_seconds || 999) < 120),
    },
    {
      id: 'lab-explorer',
      name: 'Nhà Thám Hiểm',
      description: 'Sử dụng 3 phòng thí nghiệm ảo',
      icon: <FlaskConical className="h-6 w-6" />,
      color: 'bg-teal-500',
      earned: simulationCount >= 3,
    },
  ];

  const earnedBadges = badges.filter(b => b.earned);
  const unearnedBadges = badges.filter(b => !b.earned);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <Skeleton className="h-10 w-64 mb-8" />
            <div className="grid gap-6 md:grid-cols-4">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">
              Tiến Độ Học Tập
            </h1>
            <p className="text-muted-foreground">
              Theo dõi hành trình học tập và thành tích của bạn
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="glass">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Bài Học Hoàn Thành
                </CardTitle>
                <BookOpen className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {completedLessons}/{totalLessons}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0}% hoàn thành
                </p>
                <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Điểm Quiz Trung Bình
                </CardTitle>
                <Target className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {averageScore}/10
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Từ {quizAttempts.length} lần làm bài
                </p>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Tổng Thời Gian Học
                </CardTitle>
                <Clock className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {totalTimeHours > 0 ? `${totalTimeHours}h ${totalTimeMinutes % 60}m` : `${totalTimeMinutes}m`}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Quiz + Thí nghiệm ảo
                </p>
                {simulationCount > 0 && (
                  <p className="text-[10px] text-chemical mt-1">
                    🧪 {simulationCount} thí nghiệm đã mở
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Huy Hiệu Đạt Được
                </CardTitle>
                <Trophy className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {earnedBadges.length}/{badges.length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Tiếp tục cố gắng!
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Quiz Score Progress Chart */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Tiến Bộ Điểm Quiz
                </CardTitle>
              </CardHeader>
              <CardContent>
                {attemptsLoading ? (
                  <Skeleton className="h-[300px]" />
                ) : chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="name" 
                        className="text-xs"
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <YAxis 
                        domain={[0, 10]} 
                        className="text-xs"
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                        formatter={(value: number) => [`${value}/10`, 'Điểm']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={3}
                        dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 5 }}
                        activeDot={{ r: 8, fill: 'hsl(var(--primary))' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Chưa có dữ liệu quiz</p>
                      <p className="text-sm">Hoàn thành các bài quiz để xem tiến độ</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Badges Section */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Huy Hiệu Thành Tích
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Earned Badges */}
                {earnedBadges.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-foreground mb-3">
                      Đã đạt được ({earnedBadges.length})
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {earnedBadges.map(badge => (
                        <div 
                          key={badge.id}
                          className="flex flex-col items-center p-3 rounded-xl bg-muted/50 border border-primary/20 hover:scale-105 transition-transform cursor-default"
                        >
                          <div className={`p-3 rounded-full ${badge.color} text-white mb-2 shadow-lg`}>
                            {badge.icon}
                          </div>
                          <span className="text-xs font-medium text-foreground text-center">
                            {badge.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground text-center mt-1">
                            {badge.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Unearned Badges */}
                {unearnedBadges.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">
                      Chưa đạt được ({unearnedBadges.length})
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {unearnedBadges.map(badge => (
                        <div 
                          key={badge.id}
                          className="flex flex-col items-center p-3 rounded-xl bg-muted/30 border border-border opacity-50"
                        >
                          <div className="p-3 rounded-full bg-muted text-muted-foreground mb-2">
                            {badge.icon}
                          </div>
                          <span className="text-xs font-medium text-muted-foreground text-center">
                            {badge.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground/70 text-center mt-1">
                            {badge.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {earnedBadges.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Chưa có huy hiệu nào</p>
                    <p className="text-sm">Hoàn thành bài học và quiz để nhận huy hiệu!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Quiz Attempts */}
          {quizAttempts.length > 0 && (
            <Card className="glass mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Lịch Sử Làm Quiz Gần Đây
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Desktop view - table style */}
                <div className="hidden md:block space-y-3">
                  {quizAttempts.slice(-5).reverse().map((attempt) => (
                    <div 
                      key={attempt.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border"
                    >
                      <div>
                        <p className="font-medium text-foreground">
                          {(attempt.quiz as any)?.title || 'Quiz'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(attempt.completed_at), "dd/MM/yyyy 'lúc' HH:mm", { locale: vi })}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={attempt.score === attempt.total_questions ? 'default' : 'secondary'}>
                          {attempt.score}/{attempt.total_questions}
                        </Badge>
                        {attempt.time_taken_seconds && (
                          <span className="text-sm text-muted-foreground">
                            {Math.floor(attempt.time_taken_seconds / 60)}:{String(attempt.time_taken_seconds % 60).padStart(2, '0')}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mobile view - card style */}
                <div className="md:hidden grid gap-3">
                  {quizAttempts.slice(-5).reverse().map((attempt) => (
                    <div 
                      key={attempt.id}
                      className="p-4 rounded-xl bg-muted/50 border border-border space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-foreground flex-1">
                          {(attempt.quiz as any)?.title || 'Quiz'}
                        </p>
                        <Badge variant={attempt.score === attempt.total_questions ? 'default' : 'secondary'} className="shrink-0">
                          {attempt.score}/{attempt.total_questions}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{format(new Date(attempt.completed_at), "dd/MM/yyyy HH:mm", { locale: vi })}</span>
                        {attempt.time_taken_seconds && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {Math.floor(attempt.time_taken_seconds / 60)}:{String(attempt.time_taken_seconds % 60).padStart(2, '0')}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
