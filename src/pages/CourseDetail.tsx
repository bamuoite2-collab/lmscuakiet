import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, PlayCircle, BookOpen, Clock, BarChart, Lock, Zap, GraduationCap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Course, Lesson } from '@/types/database';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';

const difficultyLabels: Record<string, string> = {
  beginner: 'Cơ bản',
  intermediate: 'Trung cấp',
  advanced: 'Nâng cao',
};

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .eq('is_published', true)
        .single();
      
      if (error) throw error;
      return data as Course;
    },
    enabled: !!courseId,
  });

  const { data: lessons } = useQuery({
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

  const difficultyColors: Record<string, string> = {
    beginner: 'bg-chemical/10 text-chemical border-chemical/20',
    intermediate: 'bg-lab-500/10 text-lab-600 border-lab-500/20',
    advanced: 'bg-primary/10 text-primary border-primary/20',
  };

  if (courseLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-muted rounded w-32" />
              <div className="h-12 bg-muted rounded w-3/4" />
              <div className="h-6 bg-muted rounded w-1/2" />
              <div className="aspect-video bg-muted rounded-2xl" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center py-16">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              Không tìm thấy Khóa học
            </h1>
            <p className="text-muted-foreground mb-6">
              Khóa học bạn đang tìm không tồn tại hoặc đã bị xóa.
            </p>
            <Button asChild>
              <Link to="/courses">Duyệt Khóa học</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Button asChild variant="ghost" size="sm" className="mb-6">
            <Link to="/courses">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại Khóa học
            </Link>
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Course Header */}
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {course.category && (
                    <Badge variant="secondary">{course.category}</Badge>
                  )}
                  {course.difficulty && (
                    <Badge variant="outline" className={difficultyColors[course.difficulty] || ''}>
                      {difficultyLabels[course.difficulty] || course.difficulty}
                    </Badge>
                  )}
                </div>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {course.title}
                </h1>
                {course.description && (
                  <p className="text-lg text-muted-foreground">
                    {course.description}
                  </p>
                )}
              </div>

              {/* Course Thumbnail */}
              {course.thumbnail_url && (
                <div className="aspect-video rounded-2xl overflow-hidden bg-muted">
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Lessons List */}
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                  Danh sách Bài học
                </h2>
                {lessons && lessons.length > 0 ? (
                  <div className="space-y-3">
                    {lessons.map((lesson, index) => (
                      <Link
                        key={lesson.id}
                        to={user ? `/courses/${courseId}/lessons/${lesson.id}` : '/auth'}
                        className="group block"
                      >
                        <div className="flex items-center gap-4 p-4 rounded-xl border bg-card hover:border-primary/50 hover:shadow-md transition-all">
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary font-semibold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                                {lesson.title}
                              </h3>
                              {/* Lesson Type Badge */}
                              {lesson.lesson_type === 'quick' && (
                                <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200 text-xs gap-1">
                                  <Zap className="h-3 w-3" />
                                  Quick
                                </Badge>
                              )}
                              {lesson.lesson_type === 'practice' && (
                                <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200 text-xs gap-1">
                                  <GraduationCap className="h-3 w-3" />
                                  Practice
                                </Badge>
                              )}
                              {/* Education Level Badge */}
                              {lesson.education_level && (
                                <Badge variant="outline" className="text-xs uppercase">
                                  {lesson.education_level}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              {lesson.video_url && (
                                <span className="flex items-center gap-1">
                                  <PlayCircle className="h-3 w-3" />
                                  Video
                                </span>
                              )}
                              {lesson.pdf_url && (
                                <span className="flex items-center gap-1">
                                  <BookOpen className="h-3 w-3" />
                                  PDF
                                </span>
                              )}
                              {lesson.structured_content && (
                                <span className="flex items-center gap-1 text-primary">
                                  <BookOpen className="h-3 w-3" />
                                  Nội dung cấu trúc
                                </span>
                              )}
                            </div>
                          </div>
                          {!user && (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-muted/50 rounded-2xl">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Chưa có bài học nào.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-card rounded-xl border p-6 sticky top-24">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                  Tổng quan Khóa học
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{lessons?.length || 0} bài học</span>
                  </div>
                  {course.difficulty && (
                    <div className="flex items-center gap-3 text-sm">
                      <BarChart className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Trình độ {difficultyLabels[course.difficulty] || course.difficulty}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-border mt-6 pt-6">
                  {user ? (
                    lessons && lessons.length > 0 ? (
                      <Button asChild className="w-full" size="lg">
                        <Link to={`/courses/${courseId}/lessons/${lessons[0].id}`}>
                          <PlayCircle className="h-4 w-4 mr-2" />
                          Bắt đầu học
                        </Link>
                      </Button>
                    ) : (
                      <Button disabled className="w-full" size="lg">
                        Sắp ra mắt
                      </Button>
                    )
                  ) : (
                    <Button asChild className="w-full" size="lg">
                      <Link to="/auth?mode=signup">
                        <Lock className="h-4 w-4 mr-2" />
                        Đăng ký để truy cập
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}