import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, FlaskConical, Atom, Beaker, GraduationCap, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CourseCard } from '@/components/CourseCard';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Course } from '@/types/database';
import { KaTeXRenderer } from '@/components/KaTeXRenderer';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { LevelSelection } from '@/components/LevelSelection';
import { THCSDashboard } from '@/components/dashboard/THCSDashboard';
import { THPTDashboard } from '@/components/dashboard/THPTDashboard';
import { Skeleton } from '@/components/ui/skeleton';

export default function Index() {
  const { user, loading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading, needsLevelSelection, refetch } = useUserProfile();

  const {
    data: courses
  } = useQuery({
    queryKey: ['featured-courses'],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('courses').select('*').eq('is_published', true).limit(3);
      if (error) throw error;
      return data as Course[];
    }
  });

  // Show loading state
  if (authLoading || (user && profileLoading)) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-28 pb-20 container mx-auto px-6">
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-6 w-96 mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  // Show level selection for new users
  if (user && needsLevelSelection) {
    return <LevelSelection userId={user.id} onComplete={refetch} />;
  }

  // Show personalized dashboard for logged-in users
  if (user && profile?.user_level) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16 container mx-auto px-6">
          {profile.user_level === 'thcs' ? (
            <THCSDashboard userId={user.id} userName={profile.full_name || ''} />
          ) : (
            <THPTDashboard userId={user.id} userName={profile.full_name || ''} />
          )}
        </main>
        <Footer />
      </div>
    );
  }

  // Default landing page for guests
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-28 pb-20 md:pt-40 md:pb-32 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-lab-100/30 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-fade-in">
              <FlaskConical className="h-4 w-4" />
              Nền tảng Giáo dục Khoa học Tự nhiên
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 animate-slide-up leading-tight">
              Chinh phục{' '}
              <span className="text-gradient">Tri thức</span>{' '}
              Khoa học
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up leading-relaxed" style={{
            animationDelay: '0.1s'
          }}>
              Hệ thống bài giảng Hóa học và Vật lý chất lượng cao, kết hợp video minh họa trực quan, 
              bài kiểm tra tương tác cùng các công thức khoa học chuẩn xác:{' '}
              <span className="inline-block mx-1"><KaTeXRenderer content="E = mc^2" /></span>,{' '}
              <span className="inline-block mx-1"><KaTeXRenderer content="H_2O" /></span>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center animate-slide-up" style={{
            animationDelay: '0.2s'
          }}>
              <Button asChild variant="hero" size="xl">
                <Link to="/courses">
                  Khám phá Khóa học
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link to="/auth?mode=signup">
                  <GraduationCap className="h-5 w-5" />
                  Đăng ký miễn phí
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-10 mt-20 max-w-lg mx-auto animate-slide-up" style={{
            animationDelay: '0.3s'
          }}>
              <div className="text-center">
                <div className="font-display text-3xl md:text-4xl font-bold text-foreground">15+</div>
                <div className="text-sm text-muted-foreground mt-1">Khóa học</div>
              </div>
              <div className="text-center">
                <div className="font-display text-3xl md:text-4xl font-bold text-foreground">100+</div>
                <div className="text-sm text-muted-foreground mt-1">Bài giảng</div>
              </div>
              <div className="text-center">
                <div className="font-display text-3xl md:text-4xl font-bold text-foreground">500+</div>
                <div className="text-sm text-muted-foreground mt-1">Học viên</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 md:py-32 bg-card border-y">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">
                Đồng hành cùng bạn trên hành trình chinh phục Khoa học
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed text-base">
                Với hơn 15 năm kinh nghiệm giảng dạy Hóa học và Vật lý, 
                tôi cam kết mang đến phương pháp tiếp cận khoa học dễ hiểu, 
                logic và phù hợp với mọi trình độ học viên.
              </p>
              <p className="text-muted-foreground mb-10 leading-relaxed text-base">
                Chương trình học được thiết kế kết hợp giữa lý thuyết nền tảng vững chắc 
                và thực hành ứng dụng thực tiễn, giúp học viên không chỉ thuộc công thức 
                mà còn thấu hiểu bản chất của các hiện tượng khoa học.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-muted">
                  <Atom className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Chuyên gia Khoa học</span>
                </div>
                <div className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-muted">
                  <Beaker className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Thực hành Phòng thí nghiệm</span>
                </div>
                <div className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-muted">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Thạc sĩ KHTN</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-hero rounded-2xl shadow-xl flex items-center justify-center">
                <FlaskConical className="h-32 w-32 text-primary-foreground/80 animate-float" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-card rounded-xl shadow-lg p-5 border">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-lg bg-chemical/10">
                    <Users className="h-5 w-5 text-chemical" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">500+ Học viên</div>
                    <div className="text-xs text-muted-foreground">Tin tưởng và đồng hành</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-5">
              Khóa học Tiêu biểu
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Khởi đầu hành trình học tập với các khóa học được thiết kế bài bản, 
              xây dựng nền tảng kiến thức Hóa học và Vật lý vững chắc.
            </p>
          </div>

          {courses && courses.length > 0 ? <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map(course => <CourseCard key={course.id} course={course} />)}
            </div> : <div className="text-center py-16 bg-muted/50 rounded-2xl">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Khóa học đang được cập nhật</p>
            </div>}

          <div className="text-center mt-14">
            <Button asChild variant="outline" size="lg">
              <Link to="/courses">
                Xem tất cả Khóa học
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-8">
            Sẵn sàng chinh phục Khoa học?
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Gia nhập cộng đồng hàng trăm học viên đã và đang nâng cao kiến thức khoa học 
            thông qua hệ thống bài giảng chất lượng của chúng tôi.
          </p>
          <Button asChild variant="glass" size="xl">
            <Link to="/auth?mode=signup">
              Đăng ký ngay
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}