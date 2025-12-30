import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { History, Clock, Award, Eye, ChevronDown, ChevronUp, CheckCircle2, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ContentWithLatex } from '@/components/KaTeXRenderer';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface QuizAttemptWithQuiz {
  id: string;
  quiz_id: string;
  score: number;
  total_questions: number;
  time_taken_seconds: number | null;
  completed_at: string;
  user_answers: Record<string, number | null> | null;
  quizzes: {
    id: string;
    title: string;
    lesson_id: string;
  };
}

interface QuizQuestionFull {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string | null;
  order_index: number;
}

export function StudentQuizHistory({ lessonId }: { lessonId: string }) {
  const { user } = useAuth();
  const [expandedAttempt, setExpandedAttempt] = useState<string | null>(null);

  // Fetch quiz attempts for this lesson's quizzes
  const { data: attempts, isLoading } = useQuery({
    queryKey: ['quiz-attempts-history', lessonId, user?.id],
    queryFn: async () => {
      // First get quizzes for this lesson
      const { data: quizzes, error: quizzesError } = await supabase
        .from('quizzes')
        .select('id')
        .eq('lesson_id', lessonId);

      if (quizzesError) throw quizzesError;
      if (!quizzes || quizzes.length === 0) return [];

      const quizIds = quizzes.map(q => q.id);

      // Then get attempts for these quizzes
      const { data, error } = await supabase
        .from('quiz_attempts')
        .select(`
          id,
          quiz_id,
          score,
          total_questions,
          time_taken_seconds,
          completed_at,
          user_answers,
          quizzes (
            id,
            title,
            lesson_id
          )
        `)
        .eq('user_id', user!.id)
        .in('quiz_id', quizIds)
        .order('completed_at', { ascending: false });

      if (error) throw error;
      return (data || []) as QuizAttemptWithQuiz[];
    },
    enabled: !!user?.id && !!lessonId,
  });

  // Fetch questions for expanded attempt (admin access via service role not available client-side)
  // We'll need to create a secure function or just show the user's answers
  const { data: questionsForReview } = useQuery({
    queryKey: ['quiz-questions-review', expandedAttempt],
    queryFn: async () => {
      const attempt = attempts?.find(a => a.id === expandedAttempt);
      if (!attempt) return [];

      // Use secure view that doesn't expose correct_answer or explanation
      const { data, error } = await supabase
        .from('public_quiz_questions')
        .select('*')
        .eq('quiz_id', attempt.quiz_id)
        .order('order_index', { ascending: true });

      if (error) throw error;
      return (data || []) as { id: string; question: string; options: string[]; order_index: number }[];
    },
    enabled: !!expandedAttempt && !!attempts,
  });

  const formatTime = (seconds: number | null): string => {
    if (seconds === null) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateStr: string): string => {
    return format(new Date(dateStr), 'dd/MM/yyyy HH:mm');
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-20 bg-muted rounded-lg" />
        <div className="h-20 bg-muted rounded-lg" />
      </div>
    );
  }

  if (!attempts || attempts.length === 0) {
    return null;
  }

  const expandedAttemptData = attempts.find(a => a.id === expandedAttempt);

  return (
    <div className="border rounded-xl bg-card">
      <div className="p-4 border-b flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <History className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-foreground">Lịch sử làm bài</h3>
          <p className="text-sm text-muted-foreground">{attempts.length} lần làm bài</p>
        </div>
      </div>

      <div className="divide-y">
        {attempts.map((attempt) => {
          const percentage = Math.round((attempt.score / attempt.total_questions) * 100);
          const isExpanded = expandedAttempt === attempt.id;

          return (
            <div key={attempt.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm",
                    percentage >= 70 
                      ? "bg-chemical/20 text-chemical" 
                      : "bg-destructive/20 text-destructive"
                  )}>
                    {percentage}%
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{attempt.quizzes.title}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Award className="h-4 w-4" />
                        <ContentWithLatex content={`$${attempt.score}/${attempt.total_questions}$`} />
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatTime(attempt.time_taken_seconds)}
                      </span>
                      <span>{formatDate(attempt.completed_at)}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedAttempt(isExpanded ? null : attempt.id)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Chi tiết
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 ml-1" />
                  ) : (
                    <ChevronDown className="h-4 w-4 ml-1" />
                  )}
                </Button>
              </div>

              {/* Expanded Review */}
              {isExpanded && expandedAttemptData && questionsForReview && (
                <div className="mt-4 pt-4 border-t space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Xem lại các câu hỏi và đáp án đã chọn:
                  </p>
                  {questionsForReview.map((question, index) => {
                    const userAnswer = expandedAttemptData.user_answers?.[question.id];
                    // Note: We don't have access to correct_answer from client-side for security
                    // The UI will show what the user selected
                    
                    return (
                      <div key={question.id} className="bg-muted/50 rounded-lg p-4">
                        <p className="font-medium text-foreground mb-3">
                          <span className="text-muted-foreground mr-2">Câu {index + 1}:</span>
                          <ContentWithLatex content={question.question} />
                        </p>
                        <div className="space-y-2">
                          {question.options.map((option, optIndex) => {
                            const isUserAnswer = userAnswer === optIndex;
                            
                            return (
                              <div
                                key={optIndex}
                                className={cn(
                                  "flex items-center gap-3 p-3 rounded-lg border",
                                  isUserAnswer
                                    ? "border-primary bg-primary/10"
                                    : "border-border bg-background"
                                )}
                              >
                                <span className={cn(
                                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium",
                                  isUserAnswer
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground"
                                )}>
                                  {String.fromCharCode(65 + optIndex)}
                                </span>
                                <ContentWithLatex content={option} className="flex-1 text-sm" />
                                {isUserAnswer && (
                                  <span className="text-xs text-primary font-medium">Đã chọn</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        {userAnswer === null && (
                          <p className="mt-2 text-sm text-muted-foreground italic">
                            Chưa trả lời câu này
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}