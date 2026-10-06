import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, FlaskConical, GraduationCap } from 'lucide-react';
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
              Học liệu Hóa học & Vật lý
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 animate-slide-up leading-tight">
              {' '}Hóa học và Vật lý{' '}
              <span className="text-gradient">{' '}</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up leading-relaxed" style={{
            animationDelay: '0.1s'
          }}>
              Website này gom bài giảng, video và bài kiểm tra để tiện học và ôn lại.
              Công thức được hiển thị trực tiếp trên trang, ví dụ{' '}
              <span className="inline-block mx-1"><KaTeXRenderer content="E = mc^2" /></span> và{' '}
              <span className="inline-block mx-1"><KaTeXRenderer content="H_2O" /></span>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center animate-slide-up" style={{
            animationDelay: '0.2s'
          }}>
              <Button asChild variant="hero" size="xl">
                <Link to="/courses">
                  Xem khóa học
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


          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 md:py-32 bg-card border-y">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">
                Mình đang xây gì trên website này?
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed text-base">
                Đây là nơi mình thử nghiệm các bài học và công cụ học tập cho Hóa học, Vật lý.
                Một số phần dùng cho việc học của mình, một số phần được làm để thử cách trình bày nội dung trên web.
              </p>
              <p className="text-muted-foreground mb-10 leading-relaxed text-base">
                Mình ưu tiên nội dung ngắn, có ví dụ và có chỗ để người học tự kiểm tra lại.
                Các mục vẫn đang được bổ sung nên có phần đã hoàn thiện, có phần mới ở dạng thử nghiệm.
              </p>
              <Button asChild variant="outline">
                <Link to="/chem1441">
                  Xem hồ sơ CHEM1441
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-hero rounded-2xl shadow-xl flex items-center justify-center">
                <FlaskConical className="h-32 w-32 text-primary-foreground/80 animate-float" />
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
              Khóa học
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Các khóa học đang có trên hệ thống. Nội dung sẽ được bổ sung dần.
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
            Muốn xem các bài đang có?
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Bạn có thể tạo tài khoản để lưu tiến độ và làm các bài kiểm tra trên website.
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