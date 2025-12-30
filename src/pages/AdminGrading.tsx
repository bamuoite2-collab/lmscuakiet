import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ContentWithLatex } from '@/components/KaTeXRenderer';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, ArrowLeft, User, FileText, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface EssayScore {
  question_id: string;
  score: number;
  max_score: number;
}

interface EssayFeedback {
  question_id: string;
  feedback: string;
}

export default function AdminGrading() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedAttempt, setSelectedAttempt] = useState<string | null>(null);
  const [essayScores, setEssayScores] = useState<Record<string, number>>({});
  const [essayFeedback, setEssayFeedback] = useState<Record<string, string>>({});

  // Fetch pending grade attempts
  const { data: pendingAttempts, isLoading } = useQuery({
    queryKey: ['pending-grade-attempts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quiz_attempts')
        .select(`
          id, quiz_id, user_id, score, total_questions, completed_at, user_answers, status,
          quizzes (title, lesson_id, lessons (title, course_id, courses (title)))
        `)
        .eq('status', 'pending_grade')
        .order('completed_at', { ascending: false });
      
      if (error) throw error;

      // Fetch student profiles
      const userIds = [...new Set((data || []).map(a => a.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('user_id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p.full_name]) || []);

      return (data || []).map(attempt => ({
        ...attempt,
        studentName: profileMap.get(attempt.user_id) || 'Unknown',
      }));
    },
    enabled: isAdmin,
  });

  // Fetch essay questions for selected attempt
  const { data: attemptDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['attempt-details', selectedAttempt],
    queryFn: async () => {
      if (!selectedAttempt) return null;
      
      const attempt = pendingAttempts?.find(a => a.id === selectedAttempt);
      if (!attempt) return null;

      const { data: questions, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_id', attempt.quiz_id)
        .order('order_index');

      if (error) throw error;

      const essayQuestions = questions?.filter(q => q.question_type === 'essay') || [];
      return { attempt, questions, essayQuestions };
    },
    enabled: !!selectedAttempt,
  });

  // Grade mutation
  const gradeMutation = useMutation({
    mutationFn: async () => {
      if (!attemptDetails) throw new Error('No attempt selected');

      const scores: EssayScore[] = attemptDetails.essayQuestions.map(q => ({
        question_id: q.id,
        score: essayScores[q.id] || 0,
        max_score: 1,
      }));

      const feedback: EssayFeedback[] = attemptDetails.essayQuestions.map(q => ({
        question_id: q.id,
        feedback: essayFeedback[q.id] || '',
      }));

      const { data, error } = await supabase.functions.invoke('grade-essay', {
        body: { attemptId: selectedAttempt, essayScores: scores, essayFeedback: feedback },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Đã lưu điểm thành công!');
      queryClient.invalidateQueries({ queryKey: ['pending-grade-attempts'] });
      setSelectedAttempt(null);
      setEssayScores({});
      setEssayFeedback({});
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error.message}`);
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/admin')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại Admin
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Chấm bài tự luận</h1>
          <p className="text-muted-foreground mt-2">Xem và chấm điểm các câu hỏi tự luận</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !selectedAttempt ? (
          <div className="space-y-4">
            {pendingAttempts?.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle2 className="h-12 w-12 mx-auto text-chemical mb-4" />
                  <p className="text-lg font-medium">Không có bài cần chấm</p>
                  <p className="text-muted-foreground">Tất cả bài thi đã được chấm điểm</p>
                </CardContent>
              </Card>
            ) : (
              pendingAttempts?.map((attempt: any) => (
                <Card key={attempt.id} className="cursor-pointer hover:border-primary transition-colors" onClick={() => setSelectedAttempt(attempt.id)}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{attempt.studentName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span>{attempt.quizzes?.title || 'Quiz'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{format(new Date(attempt.completed_at), 'dd/MM/yyyy HH:mm', { locale: vi })}</span>
                        </div>
                      </div>
                      <Button>Chấm bài</Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        ) : isLoadingDetails ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            <Button variant="outline" onClick={() => setSelectedAttempt(null)}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại danh sách
            </Button>

            <Card>
              <CardHeader>
                <CardTitle>Bài làm của {attemptDetails?.attempt?.studentName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {attemptDetails?.essayQuestions.map((q: any, index: number) => {
                  const userAnswer = attemptDetails?.attempt?.user_answers?.[q.id];
                  return (
                    <div key={q.id} className="border rounded-lg p-6 space-y-4">
                      <h3 className="font-medium">Câu {index + 1}:</h3>
                      <ContentWithLatex content={q.question} />
                      
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm font-medium mb-2">Bài làm:</p>
                        <ContentWithLatex content={userAnswer || 'Không có câu trả lời'} className="whitespace-pre-wrap" />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Điểm (0-1):</label>
                          <Input
                            type="number"
                            min="0"
                            max="1"
                            step="0.25"
                            value={essayScores[q.id] || 0}
                            onChange={(e) => setEssayScores(prev => ({ ...prev, [q.id]: parseFloat(e.target.value) || 0 }))}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Nhận xét:</label>
                          <Textarea
                            value={essayFeedback[q.id] || ''}
                            onChange={(e) => setEssayFeedback(prev => ({ ...prev, [q.id]: e.target.value }))}
                            placeholder="Nhập nhận xét..."
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}

                <Button onClick={() => gradeMutation.mutate()} disabled={gradeMutation.isPending} className="w-full">
                  {gradeMutation.isPending ? 'Đang lưu...' : 'Lưu điểm'}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
