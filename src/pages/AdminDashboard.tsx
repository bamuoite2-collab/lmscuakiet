import { useState, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, Edit, Trash2, Eye, EyeOff, HelpCircle, Upload, 
  BookOpen, Users, GraduationCap, LayoutDashboard, FileText,
  Image as ImageIcon, MessageSquare, ClipboardCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Course, Lesson, Profile } from '@/types/database';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { QuizManager } from '@/components/admin/QuizManager';
import { LatexPreviewInput } from '@/components/admin/LatexPreviewInput';
import { MultiPdfUpload } from '@/components/admin/MultiPdfUpload';
import { AdminQAManager } from '@/components/admin/AdminQAManager';
import { StructuredContentEditor } from '@/components/admin/StructuredContentEditor';
import { cn } from '@/lib/utils';

export default function AdminDashboard() {
  const { user, isAdmin, loading } = useAuth();
  const queryClient = useQueryClient();
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedLessonForQuiz, setSelectedLessonForQuiz] = useState<Lesson | null>(null);
  const [courseDialog, setCourseDialog] = useState(false);
  const [lessonDialog, setLessonDialog] = useState(false);
  const [quizDialog, setQuizDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  // Stats queries
  const { data: courses } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: async () => {
      const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data as Course[];
    },
    enabled: isAdmin,
  });

  // Unanswered comments count
  const { data: unansweredCount } = useQuery({
    queryKey: ['unanswered-comments-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('lesson_comments')
        .select('*', { count: 'exact', head: true })
        .is('parent_id', null)
        .eq('is_answered', false);
      if (error) throw error;
      return count || 0;
    },
    enabled: isAdmin,
  });

  // Pending grades count
  const { data: pendingGradesCount } = useQuery({
    queryKey: ['pending-grades-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('quiz_attempts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending_grade');
      if (error) throw error;
      return count || 0;
    },
    enabled: isAdmin,
  });

  const { data: allLessons } = useQuery({
    queryKey: ['admin-all-lessons'],
    queryFn: async () => {
      const { data, error } = await supabase.from('lessons').select('id');
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  const { data: students } = useQuery({
    queryKey: ['admin-students'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data as Profile[];
    },
    enabled: isAdmin,
  });

  const { data: lessons } = useQuery({
    queryKey: ['admin-lessons', selectedCourse],
    queryFn: async () => {
      const { data, error } = await supabase.from('lessons').select('*').eq('course_id', selectedCourse!).order('order_index');
      if (error) throw error;
      return data as Lesson[];
    },
    enabled: !!selectedCourse,
  });

  const saveCourse = useMutation({
    mutationFn: async (course: Partial<Course>) => {
      if (editingCourse) {
        const { error } = await supabase.from('courses').update(course).eq('id', editingCourse.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('courses').insert(course as { title: string });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      setCourseDialog(false);
      setEditingCourse(null);
      toast.success(editingCourse ? 'Đã cập nhật khóa học!' : 'Đã tạo khóa học!');
    },
    onError: () => toast.error('Không thể lưu khóa học'),
  });

  const deleteCourse = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      toast.success('Đã xóa khóa học!');
    },
  });

  const saveLesson = useMutation({
    mutationFn: async (lesson: Partial<Lesson>) => {
      if (editingLesson) {
        const { error } = await supabase.from('lessons').update(lesson).eq('id', editingLesson.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('lessons').insert({ ...lesson, course_id: selectedCourse! } as { title: string; course_id: string });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-lessons'] });
      queryClient.invalidateQueries({ queryKey: ['admin-all-lessons'] });
      setLessonDialog(false);
      setEditingLesson(null);
      toast.success(editingLesson ? 'Đã cập nhật bài học!' : 'Đã tạo bài học!');
    },
  });

  const deleteLesson = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('lessons').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-lessons'] });
      queryClient.invalidateQueries({ queryKey: ['admin-all-lessons'] });
      toast.success('Đã xóa bài học!');
    },
  });

  const togglePublish = useMutation({
    mutationFn: async ({ table, id, published }: { table: 'courses' | 'lessons'; id: string; published: boolean }) => {
      const { error } = await supabase.from(table).update({ is_published: published }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      queryClient.invalidateQueries({ queryKey: ['admin-lessons'] });
    },
  });

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center">Đang tải...</div>;
  if (!user || !isAdmin) return <Navigate to="/" replace />;

  const stats = [
    { label: 'Tổng khóa học', value: courses?.length || 0, icon: BookOpen, color: 'text-primary' },
    { label: 'Tổng bài học', value: allLessons?.length || 0, icon: FileText, color: 'text-chemical' },
    { label: 'Học sinh đăng ký', value: students?.length || 0, icon: Users, color: 'text-amber-500' },
    { label: 'Bài cần chấm', value: pendingGradesCount || 0, icon: ClipboardCheck, color: 'text-orange-500', highlight: (pendingGradesCount || 0) > 0, link: '/admin/grading' },
    { label: 'Câu hỏi chờ trả lời', value: unansweredCount || 0, icon: HelpCircle, color: 'text-destructive', highlight: (unansweredCount || 0) > 0 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-primary/10">
              <LayoutDashboard className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">Trang Quản Trị</h1>
              <p className="text-muted-foreground">Quản lý nội dung khóa học và học sinh</p>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {stats.map((stat) => {
              const content = (
                <div className={cn(
                  "bg-card rounded-xl border p-6 flex items-center gap-4 transition-colors",
                  stat.highlight && "border-destructive/50 bg-destructive/5",
                  stat.link && "hover:border-primary/50 cursor-pointer"
                )}>
                  <div className={cn("p-3 rounded-xl bg-muted relative", stat.color)}>
                    <stat.icon className="h-6 w-6" />
                    {stat.highlight && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full animate-pulse" />
                    )}
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              );

              return stat.link ? (
                <Link key={stat.label} to={stat.link}>
                  {content}
                </Link>
              ) : (
                <div key={stat.label}>{content}</div>
              );
            })}
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="courses" className="space-y-6">
            <TabsList className="bg-muted/50 p-1 w-full overflow-x-auto flex justify-start">
              <TabsTrigger value="courses" className="gap-2 whitespace-nowrap">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Khóa học</span>
              </TabsTrigger>
              <TabsTrigger value="lessons" className="gap-2 whitespace-nowrap">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Bài học</span>
              </TabsTrigger>
              <TabsTrigger value="quizzes" className="gap-2 whitespace-nowrap">
                <HelpCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Quiz</span>
              </TabsTrigger>
              <TabsTrigger value="qa" className="gap-2 relative whitespace-nowrap">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Hỏi đáp</span>
                {(unansweredCount || 0) > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                    {unansweredCount}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="students" className="gap-2 whitespace-nowrap">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Học sinh</span>
              </TabsTrigger>
            </TabsList>

            {/* Courses Tab */}
            <TabsContent value="courses">
              <div className="bg-card rounded-xl border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-xl font-semibold">Quản lý Khóa học</h2>
                  <Dialog open={courseDialog} onOpenChange={setCourseDialog}>
                    <DialogTrigger asChild>
                      <Button onClick={() => setEditingCourse(null)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Tạo Khóa học mới
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader><DialogTitle>{editingCourse ? 'Chỉnh sửa' : 'Tạo'} Khóa học</DialogTitle></DialogHeader>
                      <CourseForm course={editingCourse} onSave={(data) => saveCourse.mutate(data)} />
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Desktop view */}
                <div className="hidden md:grid gap-4">
                  {courses?.map((course) => (
                    <div key={course.id} className="flex items-center gap-4 p-4 rounded-lg border hover:border-primary/50 transition-colors">
                      {course.thumbnail_url ? (
                        <img src={course.thumbnail_url} alt={course.title} className="w-20 h-14 rounded-lg object-cover" />
                      ) : (
                        <div className="w-20 h-14 rounded-lg bg-muted flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{course.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">{course.description || 'Chưa có mô tả'}</p>
                        <div className="flex gap-2 mt-1">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{course.category}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{course.difficulty}</span>
                        </div>
                      </div>
                      {/* Publish Switch */}
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`publish-course-${course.id}`} className="text-xs text-muted-foreground">
                          {course.is_published ? 'Đã xuất bản' : 'Nháp'}
                        </Label>
                        <Switch
                          id={`publish-course-${course.id}`}
                          checked={course.is_published ?? false}
                          onCheckedChange={(checked) => togglePublish.mutate({ table: 'courses', id: course.id, published: checked })}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="ghost" onClick={() => { setEditingCourse(course); setCourseDialog(true); }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => deleteCourse.mutate(course.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mobile card view */}
                <div className="md:hidden grid gap-4">
                  {courses?.map((course) => (
                    <div key={course.id} className="p-4 rounded-xl border hover:border-primary/50 transition-colors space-y-3">
                      <div className="flex gap-3">
                        {course.thumbnail_url ? (
                          <img src={course.thumbnail_url} alt={course.title} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center shrink-0">
                            <ImageIcon className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground truncate">{course.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{course.description || 'Chưa có mô tả'}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{course.category}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{course.difficulty}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-2">
                          <Switch
                            id={`publish-course-mobile-${course.id}`}
                            checked={course.is_published ?? false}
                            onCheckedChange={(checked) => togglePublish.mutate({ table: 'courses', id: course.id, published: checked })}
                          />
                          <Label htmlFor={`publish-course-mobile-${course.id}`} className="text-xs text-muted-foreground">
                            {course.is_published ? 'Đã xuất bản' : 'Nháp'}
                          </Label>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setEditingCourse(course); setCourseDialog(true); }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => deleteCourse.mutate(course.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {!courses?.length && (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Chưa có khóa học nào</p>
                    <Button className="mt-4" onClick={() => { setEditingCourse(null); setCourseDialog(true); }}>
                      <Plus className="h-4 w-4 mr-2" />Tạo khóa học đầu tiên
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Lessons Tab */}
            <TabsContent value="lessons">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Course Selector */}
                <div className="bg-card rounded-xl border p-6">
                  <h3 className="font-semibold mb-4">Chọn khóa học</h3>
                  <div className="space-y-2">
                    {courses?.map((course) => (
                      <button
                        key={course.id}
                        onClick={() => setSelectedCourse(course.id)}
                        className={cn(
                          "w-full text-left p-3 rounded-lg border transition-colors",
                          selectedCourse === course.id
                            ? "border-primary bg-primary/5"
                            : "hover:border-muted-foreground/30"
                        )}
                      >
                        <p className="font-medium text-sm">{course.title}</p>
                        <p className="text-xs text-muted-foreground">{course.category}</p>
                      </button>
                    ))}
                    {!courses?.length && <p className="text-sm text-muted-foreground">Chưa có khóa học</p>}
                  </div>
                </div>

                {/* Lessons List */}
                <div className="lg:col-span-2 bg-card rounded-xl border p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold">Danh sách bài học</h3>
                    {selectedCourse && (
                      <Dialog open={lessonDialog} onOpenChange={setLessonDialog}>
                        <DialogTrigger asChild>
                          <Button size="sm" onClick={() => setEditingLesson(null)}>
                            <Plus className="h-4 w-4 mr-2" />Thêm bài học
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader><DialogTitle>{editingLesson ? 'Chỉnh sửa' : 'Tạo'} Bài học</DialogTitle></DialogHeader>
                          <LessonForm lesson={editingLesson} onSave={(data) => saveLesson.mutate(data)} />
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>

                  {selectedCourse ? (
                    <div className="space-y-3">
                      {lessons?.map((lesson, index) => (
                        <div key={lesson.id} className="p-4 rounded-lg border">
                          {/* Desktop layout */}
                          <div className="hidden sm:flex items-center gap-4">
                            <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-medium text-sm shrink-0">
                              {index + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium truncate">{lesson.title}</h4>
                              <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                                {lesson.video_url && <span className="flex items-center gap-1">📹 Video</span>}
                                {lesson.pdf_url && <span className="flex items-center gap-1">📄 PDF</span>}
                                {lesson.content && <span className="flex items-center gap-1">📝 Nội dung</span>}
                                {lesson.simulation_url && <span className="flex items-center gap-1">🧪 Thí nghiệm</span>}
                              </div>
                            </div>
                            {/* Publish Switch */}
                            <div className="flex items-center gap-2">
                              <Label htmlFor={`publish-${lesson.id}`} className="text-xs text-muted-foreground">
                                {lesson.is_published ? 'Đã xuất bản' : 'Nháp'}
                              </Label>
                              <Switch
                                id={`publish-${lesson.id}`}
                                checked={lesson.is_published ?? false}
                                onCheckedChange={(checked) => togglePublish.mutate({ table: 'lessons', id: lesson.id, published: checked })}
                              />
                            </div>
                            <div className="flex items-center gap-1">
                              <Button size="icon" variant="ghost" onClick={() => { setSelectedLessonForQuiz(lesson); setQuizDialog(true); }} title="Quản lý Quiz">
                                <HelpCircle className="h-4 w-4 text-primary" />
                              </Button>
                              <Button size="icon" variant="ghost" onClick={() => { setEditingLesson(lesson); setLessonDialog(true); }}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost" onClick={() => deleteLesson.mutate(lesson.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                          
                          {/* Mobile layout */}
                          <div className="sm:hidden space-y-3">
                            <div className="flex items-start gap-3">
                              <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-medium text-sm shrink-0">
                                {index + 1}
                              </span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm">{lesson.title}</h4>
                                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-1">
                                  {lesson.video_url && <span>📹</span>}
                                  {lesson.pdf_url && <span>📄</span>}
                                  {lesson.content && <span>📝</span>}
                                  {lesson.simulation_url && <span>🧪</span>}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t">
                              <div className="flex items-center gap-2">
                                <Switch
                                  id={`publish-mobile-${lesson.id}`}
                                  checked={lesson.is_published ?? false}
                                  onCheckedChange={(checked) => togglePublish.mutate({ table: 'lessons', id: lesson.id, published: checked })}
                                />
                                <Label htmlFor={`publish-mobile-${lesson.id}`} className="text-xs text-muted-foreground">
                                  {lesson.is_published ? 'Đã xuất bản' : 'Nháp'}
                                </Label>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setSelectedLessonForQuiz(lesson); setQuizDialog(true); }} title="Quản lý Quiz">
                                  <HelpCircle className="h-4 w-4 text-primary" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setEditingLesson(lesson); setLessonDialog(true); }}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => deleteLesson.mutate(lesson.id)}>
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {!lessons?.length && (
                        <div className="text-center py-8">
                          <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                          <p className="text-muted-foreground">Chưa có bài học nào</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Chọn một khóa học để quản lý bài học</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Quizzes Tab */}
            <TabsContent value="quizzes">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Course & Lesson Selector */}
                <div className="space-y-4">
                  <div className="bg-card rounded-xl border p-6">
                    <h3 className="font-semibold mb-4">1. Chọn khóa học</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {courses?.map((course) => (
                        <button
                          key={course.id}
                          onClick={() => { setSelectedCourse(course.id); setSelectedLessonForQuiz(null); }}
                          className={cn(
                            "w-full text-left p-3 rounded-lg border transition-colors text-sm",
                            selectedCourse === course.id ? "border-primary bg-primary/5" : "hover:border-muted-foreground/30"
                          )}
                        >
                          {course.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedCourse && (
                    <div className="bg-card rounded-xl border p-6">
                      <h3 className="font-semibold mb-4">2. Chọn bài học</h3>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {lessons?.map((lesson) => (
                          <button
                            key={lesson.id}
                            onClick={() => setSelectedLessonForQuiz(lesson)}
                            className={cn(
                              "w-full text-left p-3 rounded-lg border transition-colors text-sm",
                              selectedLessonForQuiz?.id === lesson.id ? "border-primary bg-primary/5" : "hover:border-muted-foreground/30"
                            )}
                          >
                            {lesson.title}
                          </button>
                        ))}
                        {!lessons?.length && <p className="text-sm text-muted-foreground">Chưa có bài học</p>}
                      </div>
                    </div>
                  )}
                </div>

                {/* Quiz Manager */}
                <div className="lg:col-span-2 bg-card rounded-xl border p-6">
                  {selectedLessonForQuiz ? (
                    <QuizManager lessonId={selectedLessonForQuiz.id} lessonTitle={selectedLessonForQuiz.title} />
                  ) : (
                    <div className="text-center py-16">
                      <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Chọn một bài học để quản lý Quiz</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Q&A Tab */}
            <TabsContent value="qa">
              <div className="bg-card rounded-xl border p-6">
                <AdminQAManager />
              </div>
            </TabsContent>

            {/* Students Tab */}
            <TabsContent value="students">
              <div className="bg-card rounded-xl border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-xl font-semibold">Danh sách Học sinh</h2>
                  <p className="text-sm text-muted-foreground">{students?.length || 0} học sinh đã đăng ký</p>
                </div>

                {/* Desktop table view */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Họ tên</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Avatar</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Ngày đăng ký</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students?.map((student) => (
                        <tr key={student.id} className="border-b last:border-0 hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <span className="font-medium">{student.full_name || 'Chưa cập nhật'}</span>
                          </td>
                          <td className="py-3 px-4">
                            {student.avatar_url ? (
                              <img src={student.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <Users className="h-4 w-4 text-primary" />
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {new Date(student.created_at).toLocaleDateString('vi-VN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile card view */}
                <div className="md:hidden grid gap-3">
                  {students?.map((student) => (
                    <div key={student.id} className="p-4 rounded-xl border bg-muted/30 flex items-center gap-4">
                      {student.avatar_url ? (
                        <img src={student.avatar_url} alt="" className="w-12 h-12 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {student.full_name || 'Chưa cập nhật'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Đăng ký: {new Date(student.created_at).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {!students?.length && (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Chưa có học sinh nào đăng ký</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Quiz Dialog (for quick access from lessons) */}
          <Dialog open={quizDialog} onOpenChange={setQuizDialog}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Quản lý Quiz - {selectedLessonForQuiz?.title}</DialogTitle>
              </DialogHeader>
              {selectedLessonForQuiz && (
                <QuizManager lessonId={selectedLessonForQuiz.id} lessonTitle={selectedLessonForQuiz.title} />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
}

function CourseForm({ course, onSave }: { course: Course | null; onSave: (data: Partial<Course>) => void }) {
  const [title, setTitle] = useState(course?.title || '');
  const [description, setDescription] = useState(course?.description || '');
  const [category, setCategory] = useState(course?.category || 'Hóa học');
  const [difficulty, setDifficulty] = useState(course?.difficulty || 'beginner');
  const [thumbnailUrl, setThumbnailUrl] = useState(course?.thumbnail_url || '');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh');
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('course-thumbnails')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('course-thumbnails')
        .getPublicUrl(fileName);

      setThumbnailUrl(publicUrl);
      toast.success('Tải ảnh thành công!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Không thể tải ảnh lên');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave({ title, description, category, difficulty, thumbnail_url: thumbnailUrl || null }); }} className="space-y-4">
      <div>
        <Label>Tiêu đề khóa học *</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="VD: Hóa học lớp 10 cơ bản" required />
      </div>
      
      <div>
        <Label>Mô tả</Label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Mô tả ngắn gọn về khóa học..." rows={3} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Danh mục</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Hóa học">Hóa học</SelectItem>
              <SelectItem value="Vật lý">Vật lý</SelectItem>
              <SelectItem value="Sinh học">Sinh học</SelectItem>
              <SelectItem value="Toán học">Toán học</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Độ khó</Label>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Cơ bản</SelectItem>
              <SelectItem value="intermediate">Trung cấp</SelectItem>
              <SelectItem value="advanced">Nâng cao</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Ảnh đại diện</Label>
        <div className="mt-2 space-y-3">
          {thumbnailUrl && (
            <img src={thumbnailUrl} alt="Thumbnail" className="w-full h-32 object-cover rounded-lg" />
          )}
          <div className="flex gap-2">
            <Input 
              value={thumbnailUrl} 
              onChange={(e) => setThumbnailUrl(e.target.value)} 
              placeholder="Nhập URL ảnh hoặc tải lên..." 
              className="flex-1"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? 'Đang tải...' : 'Tải lên'}
            </Button>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full">
        {course ? 'Cập nhật khóa học' : 'Tạo khóa học'}
      </Button>
    </form>
  );
}

function LessonForm({ lesson, onSave }: { lesson: Lesson | null; onSave: (data: Partial<Lesson>) => void }) {
  const [title, setTitle] = useState(lesson?.title || '');
  const [content, setContent] = useState(lesson?.content || '');
  const [videoUrl, setVideoUrl] = useState(lesson?.video_url || '');
  const [simulationUrl, setSimulationUrl] = useState(lesson?.simulation_url || '');
  const [orderIndex, setOrderIndex] = useState(lesson?.order_index || 0);
  
  // Structured content state
  const [educationLevel, setEducationLevel] = useState<'thcs' | 'thpt'>(
    (lesson?.education_level as 'thcs' | 'thpt') || 'thcs'
  );
  const [lessonType, setLessonType] = useState<'quick' | 'practice'>(
    (lesson?.lesson_type as 'quick' | 'practice') || 'quick'
  );
  const [structuredContent, setStructuredContent] = useState<any>(
    lesson?.structured_content || null
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ 
      title, 
      content: content || null, 
      video_url: videoUrl || null, 
      simulation_url: simulationUrl || null, 
      order_index: orderIndex,
      education_level: educationLevel,
      lesson_type: lessonType,
      structured_content: structuredContent
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Tiêu đề bài học *</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="VD: Bài 1: Cấu tạo nguyên tử" required />
      </div>

      <LatexPreviewInput
        label="Nội dung bài giảng Legacy (Markdown + LaTeX)"
        value={content}
        onChange={setContent}
        placeholder="Nhập nội dung bài học...&#10;&#10;Sử dụng $...$ cho công thức inline: $H_2O$&#10;Sử dụng $$...$$ cho công thức block:&#10;$$CH_4 + 2O_2 \rightarrow CO_2 + 2H_2O$$"
        rows={6}
      />

      {/* Structured Content Editor */}
      <StructuredContentEditor
        educationLevel={educationLevel}
        lessonType={lessonType}
        initialContent={structuredContent}
        onContentChange={setStructuredContent}
        onLevelChange={setEducationLevel}
        onTypeChange={setLessonType}
      />

      <div>
        <Label>Link YouTube</Label>
        <Input 
          value={videoUrl} 
          onChange={(e) => setVideoUrl(e.target.value)} 
          placeholder="https://www.youtube.com/watch?v=..." 
        />
      </div>

      <div>
        <Label>🧪 Link Thí nghiệm ảo (PhET, Chemix, etc.)</Label>
        <Input 
          value={simulationUrl} 
          onChange={(e) => setSimulationUrl(e.target.value)} 
          placeholder="https://phet.colorado.edu/sims/html/... hoặc Chemix link" 
        />
        <p className="text-xs text-muted-foreground mt-1">
          Dán link từ PhET Interactive Simulations, Chemix hoặc các trang thí nghiệm tương tác khác
        </p>
      </div>

      <div>
        <Label>Tài liệu PDF (tối đa 10 file)</Label>
        {lesson ? (
          <div className="mt-2">
            <MultiPdfUpload entityId={lesson.id} entityType="lesson" maxFiles={10} />
          </div>
        ) : (
          <p className="text-xs text-muted-foreground mt-2">
            Lưu bài học trước để có thể tải lên nhiều file PDF
          </p>
        )}
      </div>

      <div>
        <Label>Thứ tự hiển thị</Label>
        <Input type="number" value={orderIndex} onChange={(e) => setOrderIndex(parseInt(e.target.value) || 0)} min={0} />
      </div>

      <Button type="submit" className="w-full">
        {lesson ? 'Cập nhật bài học' : 'Tạo bài học'}
      </Button>
    </form>
  );
}
