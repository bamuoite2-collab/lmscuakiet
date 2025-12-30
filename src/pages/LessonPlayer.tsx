import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle, Menu, X, HelpCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Lesson, Quiz, QuizQuestionPublic, getStructuredContent } from '@/types/database';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { YouTubeEmbed } from '@/components/YouTubeEmbed';
import { ContentWithLatex } from '@/components/KaTeXRenderer';
import { QuizPlayer } from '@/components/QuizPlayer';
import { PdfViewer, QuizPdfViewer } from '@/components/PdfViewer';
import { StudentQuizHistory } from '@/components/StudentQuizHistory';
import { SimulationEmbed } from '@/components/SimulationEmbed';
import { LessonComments } from '@/components/LessonComments';
import { LessonRenderer } from '@/components/lesson/LessonRenderer';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { TypedLesson } from '@/types/lesson';

export default function LessonPlayerPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);

  const { data: lesson, isLoading: lessonLoading } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single();
      
      if (error) throw error;
      return data as Lesson;
    },
    enabled: !!lessonId,
  });

  const { data: allLessons } = useQuery({
    queryKey: ['course-lessons', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .eq('is_published', true)
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      return data as Lesson[];
    },
    enabled: !!courseId,
  });

  const { data: quiz } = useQuery({
    queryKey: ['lesson-quiz', lessonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('lesson_id', lessonId)
        .maybeSingle();
      
      if (error) throw error;
      return data as Quiz | null;
    },
    enabled: !!lessonId,
  });

  const { data: quizQuestions } = useQuery({
    queryKey: ['quiz-questions', quiz?.id],
    queryFn: async () => {
      // Use secure view that doesn't expose correct_answer or explanation
      const { data, error } = await supabase
        .from('public_quiz_questions')
        .select('*')
        .eq('quiz_id', quiz!.id)
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      return (data || []).map((q) => ({
        ...q,
        options: q.options as string[]
      })) as QuizQuestionPublic[];
    },
    enabled: !!quiz?.id,
  });

  const { data: progress } = useQuery({
    queryKey: ['lesson-progress', lessonId, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student_progress')
        .select('*')
        .eq('lesson_id', lessonId)
        .eq('user_id', user!.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!lessonId && !!user?.id,
  });

  const markCompleteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('student_progress')
        .upsert({
          user_id: user!.id,
          lesson_id: lessonId!,
          completed: true,
          completed_at: new Date().toISOString(),
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lesson-progress', lessonId] });
      toast.success('Đã đánh dấu hoàn thành bài học!');
    },
  });

  // Quiz attempts are now saved server-side in the validate-quiz edge function
  // This ensures students cannot manipulate their scores

  const currentIndex = allLessons?.findIndex(l => l.id === lessonId) ?? -1;
  const prevLesson = currentIndex > 0 ? allLessons?.[currentIndex - 1] : null;
  const nextLesson = allLessons && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user) return null;

  if (lessonLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-muted rounded w-1/3" />
              <div className="aspect-video bg-muted rounded-xl" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center py-16">
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              Không tìm thấy Bài học
            </h1>
            <Button asChild>
              <Link to={`/courses/${courseId}`}>Quay lại Khóa học</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16 flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed lg:relative left-0 top-16 h-[calc(100vh-4rem)] bg-card border-r z-40 transition-all duration-300",
            sidebarOpen ? "w-80" : "w-0 lg:w-0"
          )}
        >
          <div className={cn("h-full overflow-hidden", sidebarOpen ? "w-80" : "w-0")}>
            <div className="p-4 border-b flex items-center justify-between">
              <Link
                to={`/courses/${courseId}`}
                className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Quay lại Khóa học
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1 rounded hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="overflow-y-auto h-[calc(100%-60px)] p-4">
              <h3 className="font-semibold text-foreground mb-4">Danh sách Bài học</h3>
              <div className="space-y-2">
                {allLessons?.map((l, index) => (
                  <Link
                    key={l.id}
                    to={`/courses/${courseId}/lessons/${l.id}`}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg transition-colors",
                      l.id === lessonId
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    )}
                  >
                    <span className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                      l.id === lessonId ? "bg-primary-foreground text-primary" : "bg-muted text-muted-foreground"
                    )}>
                      {index + 1}
                    </span>
                    <span className="text-sm truncate">{l.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Toggle Button */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed left-4 top-20 z-50 p-2 bg-card border rounded-lg shadow-md hover:bg-muted transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        {/* Main Content */}
        <main className={cn("flex-1 min-h-[calc(100vh-4rem)]", sidebarOpen && "lg:ml-0")}>
          <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Lesson Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <span>Bài {currentIndex + 1} / {allLessons?.length}</span>
                {progress?.completed && (
                  <span className="flex items-center gap-1 text-chemical">
                    <CheckCircle className="h-4 w-4" />
                    Đã hoàn thành
                  </span>
                )}
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                {lesson.title}
              </h1>
            </div>

            {/* Video */}
            {lesson.video_url && (
              <div className="mb-8">
                <YouTubeEmbed url={lesson.video_url} title={lesson.title} />
              </div>
            )}

            {/* Structured Content (new lesson format) */}
            {(() => {
              const structuredContent = getStructuredContent(lesson);
              if (structuredContent) {
                const typedLesson: TypedLesson = {
                  id: lesson.id,
                  courseId: lesson.course_id,
                  title: lesson.title,
                  orderIndex: lesson.order_index ?? 0,
                  isPublished: lesson.is_published ?? false,
                  isPremium: lesson.is_premium,
                  videoUrl: lesson.video_url ?? undefined,
                  pdfUrl: lesson.pdf_url ?? undefined,
                  simulationUrl: lesson.simulation_url ?? undefined,
                  createdAt: lesson.created_at,
                  updatedAt: lesson.updated_at,
                  educationLevel: (lesson.education_level as 'thcs' | 'thpt') || 'thcs',
                  lessonType: (lesson.lesson_type as 'quick' | 'practice') || 'quick',
                  structuredContent: structuredContent,
                };
                return (
                  <div className="mb-8">
                    <LessonRenderer lesson={typedLesson} />
                  </div>
                );
              }
              return null;
            })()}

            {/* Legacy Content (backward compatibility) */}
            {lesson.content && (
              <div className="prose prose-lg max-w-none mb-8">
                <ContentWithLatex content={lesson.content} className="text-foreground leading-relaxed" />
              </div>
            )}

            {/* PDF Viewer - supports multiple files and inline viewing */}
            <div className="mb-8">
              <PdfViewer lessonId={lessonId!} legacyPdfUrl={lesson.pdf_url} />
            </div>

            {/* Simulation Lab */}
            {lesson.simulation_url && (
              <div className="mb-8">
                <SimulationEmbed 
                  simulationUrl={lesson.simulation_url} 
                  lessonId={lessonId!}
                  title={lesson.title}
                />
              </div>
            )}

            {/* Quiz Section */}
            {quiz && quizQuestions && quizQuestions.length > 0 && (
              <div className="mb-8 border rounded-xl p-6 bg-card">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <HelpCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-foreground">{quiz.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {quizQuestions.length} câu hỏi
                        {quiz.time_limit_minutes && quiz.time_limit_minutes > 0 && (
                          <span className="ml-2">• {quiz.time_limit_minutes} phút</span>
                        )}
                      </p>
                    </div>
                  </div>
                  {!showQuiz && (
                    <Button onClick={() => setShowQuiz(true)}>
                      Làm bài kiểm tra
                    </Button>
                  )}
                </div>
                
                {/* Quiz PDF files */}
                <QuizPdfViewer quizId={quiz.id} />
                
                {showQuiz && (
                  <QuizPlayer
                    quizId={quiz.id}
                    questions={quizQuestions}
                    timeLimitMinutes={quiz.time_limit_minutes}
                    onComplete={(score, total) => {
                      // Quiz attempt is saved server-side in validate-quiz edge function
                      toast.success(`Hoàn thành bài kiểm tra! Điểm: ${score}/${total}`);
                    }}
                  />
                )}
              </div>
            )}

            {/* Quiz History */}
            {user && (
              <div className="mb-8">
                <StudentQuizHistory lessonId={lessonId!} />
              </div>
            )}

            {/* Q&A Discussion Section */}
            <div className="mb-8">
              <LessonComments lessonId={lessonId!} />
            </div>

            {/* Mark Complete */}
            {!progress?.completed && (
              <div className="mb-8">
                <Button
                  onClick={() => markCompleteMutation.mutate()}
                  variant="accent"
                  size="lg"
                  disabled={markCompleteMutation.isPending}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Đánh dấu Hoàn thành
                </Button>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t">
              {prevLesson ? (
                <Button asChild variant="outline">
                  <Link to={`/courses/${courseId}/lessons/${prevLesson.id}`}>
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Bài trước
                  </Link>
                </Button>
              ) : (
                <div />
              )}
              {nextLesson ? (
                <Button asChild>
                  <Link to={`/courses/${courseId}/lessons/${nextLesson.id}`}>
                    Bài tiếp theo
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              ) : (
                <Button asChild variant="accent">
                  <Link to={`/courses/${courseId}`}>
                    Hoàn thành Khóa học
                    <CheckCircle className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}