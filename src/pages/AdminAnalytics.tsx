import { useState, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, TrendingUp, Award, BarChart3, Clock, BookOpen,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight as ChevronRightIcon
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/Navbar';
import { AdminNotificationBell } from '@/components/admin/AdminNotificationBell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { ContentWithLatex } from '@/components/KaTeXRenderer';
import { QuizPlayer } from '@/components/QuizPlayer';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface StudentStats {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  completedLessons: number;
  totalLessons: number;
  latestQuiz: {
    quizTitle: string;
    score: number;
    totalQuestions: number;
    timeTaken: number | null;
    completedAt: string;
  } | null;
}

export default function AdminAnalytics() {
  const { user, isAdmin, loading } = useAuth();
  const [selectedQuizId, setSelectedQuizId] = useState<string>('');
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);
  const [reviewAttempt, setReviewAttempt] = useState<{
    quizId: string;
    userAnswers: Record<string, number>;
  } | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  // Fetch all profiles with their auth emails
  const { data: profiles } = useQuery({
    queryKey: ['admin-analytics-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  // Fetch all lessons
  const { data: allLessons } = useQuery({
    queryKey: ['admin-analytics-lessons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('id, title, is_published');
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  // Fetch all student progress
  const { data: allProgress } = useQuery({
    queryKey: ['admin-analytics-progress'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student_progress')
        .select('*');
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  // Fetch all quizzes
  const { data: quizzes } = useQuery({
    queryKey: ['admin-analytics-quizzes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*, lessons(title)');
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  // Fetch all quiz attempts
  const { data: allAttempts } = useQuery({
    queryKey: ['admin-analytics-attempts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quiz_attempts')
        .select('*, quizzes(title)');
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  // Calculate student statistics
  const studentStats = useMemo((): StudentStats[] => {
    if (!profiles || !allLessons || !allProgress || !allAttempts) return [];

    const publishedLessons = allLessons.filter(l => l.is_published);
    const totalLessons = publishedLessons.length;

    return profiles.map(profile => {
      // Count completed lessons for this user
      const userProgress = allProgress.filter(p => p.user_id === profile.user_id && p.completed);
      const completedLessons = userProgress.length;

      // Get latest quiz attempt
      const userAttempts = allAttempts
        .filter(a => a.user_id === profile.user_id)
        .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime());
      
      const latestAttempt = userAttempts[0];

      return {
        id: profile.id,
        user_id: profile.user_id,
        full_name: profile.full_name,
        email: profile.user_id, // Will show user_id as fallback
        completedLessons,
        totalLessons,
        latestQuiz: latestAttempt ? {
          quizTitle: (latestAttempt.quizzes as any)?.title || 'Quiz',
          score: latestAttempt.score,
          totalQuestions: latestAttempt.total_questions,
          timeTaken: latestAttempt.time_taken_seconds,
          completedAt: latestAttempt.completed_at,
        } : null,
      };
    });
  }, [profiles, allLessons, allProgress, allAttempts]);

  // Calculate overall statistics
  const overallStats = useMemo(() => {
    const totalStudents = studentStats.length;
    
    // Average completion rate
    const avgCompletionRate = totalStudents > 0
      ? studentStats.reduce((sum, s) => {
          if (s.totalLessons === 0) return sum;
          return sum + (s.completedLessons / s.totalLessons) * 100;
        }, 0) / totalStudents
      : 0;

    // Average quiz score
    const studentsWithQuiz = studentStats.filter(s => s.latestQuiz);
    const avgQuizScore = studentsWithQuiz.length > 0
      ? allAttempts?.reduce((sum, a) => sum + (a.score / a.total_questions) * 100, 0) / (allAttempts?.length || 1)
      : 0;

    return {
      totalStudents,
      avgCompletionRate: Math.round(avgCompletionRate),
      avgQuizScore: Math.round(avgQuizScore),
    };
  }, [studentStats, allAttempts]);

  // Calculate score distribution for selected quiz
  const scoreDistribution = useMemo(() => {
    if (!selectedQuizId || !allAttempts) return [];

    const quizAttempts = allAttempts.filter(a => a.quiz_id === selectedQuizId);
    
    const distribution = {
      '0-4': 0,
      '5-7': 0,
      '8-10': 0,
    };

    quizAttempts.forEach(attempt => {
      const percentage = (attempt.score / attempt.total_questions) * 10;
      if (percentage <= 4) distribution['0-4']++;
      else if (percentage <= 7) distribution['5-7']++;
      else distribution['8-10']++;
    });

    return [
      { range: '0-4 điểm', count: distribution['0-4'], fill: 'hsl(var(--destructive))' },
      { range: '5-7 điểm', count: distribution['5-7'], fill: 'hsl(var(--warning))' },
      { range: '8-10 điểm', count: distribution['8-10'], fill: 'hsl(var(--primary))' },
    ];
  }, [selectedQuizId, allAttempts]);

  // Format time from seconds to mm:ss
  const formatTime = (seconds: number | null) => {
    if (seconds === null) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Đang tải...</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  const chartConfig = {
    count: {
      label: "Số học sinh",
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold text-foreground">
                  Thống kê Lớp học
                </h1>
                <p className="text-muted-foreground">
                  Theo dõi tiến độ và kết quả học tập của học sinh
                </p>
              </div>
            </div>
            <AdminNotificationBell />
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground">
                      {overallStats.totalStudents}
                    </p>
                    <p className="text-sm text-muted-foreground">Tổng số học sinh</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-chemical/10">
                    <TrendingUp className="h-6 w-6 text-chemical" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground">
                      {overallStats.avgCompletionRate}%
                    </p>
                    <p className="text-sm text-muted-foreground">Tỷ lệ hoàn thành TB</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-amber-500/10">
                    <Award className="h-6 w-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground">
                      {overallStats.avgQuizScore}%
                    </p>
                    <p className="text-sm text-muted-foreground">Điểm Quiz trung bình</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Student Table with Pagination */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Danh sách Học sinh
                  </div>
                  <span className="text-sm font-normal text-muted-foreground">
                    {studentStats.length} học sinh
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Học sinh</TableHead>
                        <TableHead className="text-center">Bài học</TableHead>
                        <TableHead className="text-center">Quiz gần nhất</TableHead>
                        <TableHead className="text-center">Thời gian</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentStats
                        .slice((currentPage - 1) * studentsPerPage, currentPage * studentsPerPage)
                        .map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {student.full_name || 'Chưa đặt tên'}
                              </p>
                              <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                                {student.user_id.slice(0, 8)}...
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <BookOpen className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">
                                {student.completedLessons}/{student.totalLessons}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            {student.latestQuiz ? (
                              <div>
                                <p className="font-medium">
                                  {student.latestQuiz.score}/{student.latestQuiz.totalQuestions}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  ({Math.round((student.latestQuiz.score / student.latestQuiz.totalQuestions) * 100)}%)
                                </p>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">--</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {student.latestQuiz ? (
                              <div className="flex items-center justify-center gap-1">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>{formatTime(student.latestQuiz.timeTaken)}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">--</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setExpandedStudentId(
                                expandedStudentId === student.user_id ? null : student.user_id
                              )}
                            >
                              {expandedStudentId === student.user_id ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {studentStats.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">Chưa có học sinh nào</p>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  
                  {/* Pagination Controls */}
                  {studentStats.length > studentsPerPage && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <p className="text-sm text-muted-foreground">
                        Trang {currentPage} / {Math.ceil(studentStats.length / studentsPerPage)}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(p => Math.min(Math.ceil(studentStats.length / studentsPerPage), p + 1))}
                          disabled={currentPage >= Math.ceil(studentStats.length / studentsPerPage)}
                        >
                          <ChevronRightIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Score Distribution Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Phổ điểm Quiz
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedQuizId} onValueChange={setSelectedQuizId}>
                  <SelectTrigger className="mb-4">
                    <SelectValue placeholder="Chọn bài Quiz" />
                  </SelectTrigger>
                  <SelectContent>
                    {quizzes?.map((quiz) => (
                      <SelectItem key={quiz.id} value={quiz.id}>
                        <ContentWithLatex 
                          content={quiz.title} 
                          className="inline"
                        />
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedQuizId && scoreDistribution.length > 0 ? (
                  <ChartContainer config={chartConfig} className="h-[250px]">
                    <BarChart data={scoreDistribution}>
                      <XAxis 
                        dataKey="range" 
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar 
                        dataKey="count" 
                        radius={[4, 4, 0, 0]}
                        name="Số học sinh"
                      >
                        {scoreDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                ) : (
                  <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                    {selectedQuizId ? 'Chưa có dữ liệu' : 'Chọn một bài Quiz để xem phổ điểm'}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Expanded Student Details - Quiz History */}
          {expandedStudentId && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>
                  Lịch sử làm Quiz của học sinh
                </CardTitle>
              </CardHeader>
              <CardContent>
                <StudentQuizDetails 
                  userId={expandedStudentId} 
                  onReview={(quizId, userAnswers) => setReviewAttempt({ quizId, userAnswers })}
                />
              </CardContent>
            </Card>
          )}

          {/* Quiz Review Dialog */}
          <Dialog open={!!reviewAttempt} onOpenChange={() => setReviewAttempt(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Xem lại bài làm</DialogTitle>
              </DialogHeader>
              {reviewAttempt && (
                <QuizPlayer
                  quizId={reviewAttempt.quizId}
                  isReviewing={true}
                  previousAnswers={reviewAttempt.userAnswers}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
}

// Separate component for student quiz details
function StudentQuizDetails({ 
  userId, 
  onReview 
}: { 
  userId: string;
  onReview: (quizId: string, userAnswers: Record<string, number>) => void;
}) {
  const { data: attempts, isLoading } = useQuery({
    queryKey: ['student-quiz-history', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quiz_attempts')
        .select('*, quizzes(title)')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return <div className="text-center py-4">Đang tải...</div>;
  }

  if (!attempts?.length) {
    return <div className="text-center py-4 text-muted-foreground">Học sinh chưa làm quiz nào</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tên Quiz</TableHead>
          <TableHead className="text-center">Điểm</TableHead>
          <TableHead className="text-center">Thời gian</TableHead>
          <TableHead className="text-center">Ngày làm</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {attempts.map((attempt) => (
          <TableRow key={attempt.id}>
            <TableCell>
              <ContentWithLatex 
                content={(attempt.quizzes as any)?.title || 'Quiz'} 
              />
            </TableCell>
            <TableCell className="text-center">
              <span className="font-medium">
                {attempt.score}/{attempt.total_questions}
              </span>
              <span className="text-muted-foreground ml-1">
                ({Math.round((attempt.score / attempt.total_questions) * 100)}%)
              </span>
            </TableCell>
            <TableCell className="text-center">
              {formatTime(attempt.time_taken_seconds)}
            </TableCell>
            <TableCell className="text-center">
              {formatDate(attempt.completed_at)}
            </TableCell>
            <TableCell>
              {attempt.user_answers && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onReview(
                    attempt.quiz_id, 
                    attempt.user_answers as Record<string, number>
                  )}
                >
                  Chi tiết
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
