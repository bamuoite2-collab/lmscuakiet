import { ArrowRight, BookOpen, FlaskConical, GraduationCap, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';

export default function AboutMe() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        <section className="pt-28 pb-14 md:pt-36 md:pb-20 border-b relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-16 left-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute top-20 right-0 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
          </div>

          <div className="container mx-auto px-6 relative">
            <div className="max-w-4xl mx-auto grid md:grid-cols-[180px_1fr] gap-8 md:gap-12 items-center">
              <div className="mx-auto md:mx-0 h-36 w-36 md:h-44 md:w-44 rounded-3xl border bg-card shadow-md flex items-center justify-center">
                <span className="font-display text-4xl md:text-5xl font-bold text-primary">HTK</span>
              </div>

              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 rounded-full border bg-primary/10 px-4 py-2 text-sm font-semibold text-primary mb-5">
                  <Sparkles className="h-4 w-4" />
                  Giới thiệu bản thân
                </div>

                <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-tight mb-4">
                  Hồ Tuấn Kiệt
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                  Sinh viên sư phạm Hóa học, quan tâm đến việc kết hợp công nghệ, học liệu trực quan
                  và các hoạt động học tập để giúp kiến thức Hóa học trở nên dễ tiếp cận hơn.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-5">
              <article className="rounded-2xl border bg-card p-6">
                <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <h2 className="font-display text-xl font-bold text-foreground mb-3">Định hướng học tập</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Phát triển năng lực thiết kế và tổ chức dạy học Hóa học theo hướng trực quan,
                  tích cực và có sự hỗ trợ phù hợp của ICT.
                </p>
              </article>

              <article className="rounded-2xl border bg-card p-6">
                <div className="h-11 w-11 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-5">
                  <FlaskConical className="h-5 w-5" />
                </div>
                <h2 className="font-display text-xl font-bold text-foreground mb-3">Mối quan tâm</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Thiết kế học liệu Hóa học, video và hình ảnh trực quan, ứng dụng công nghệ
                  trong hoạt động học và xây dựng tài nguyên số cho người học.
                </p>
              </article>

              <article className="rounded-2xl border bg-card p-6">
                <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h2 className="font-display text-xl font-bold text-foreground mb-3">Website này</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Là nơi lưu trữ các học liệu, sản phẩm học tập và những thử nghiệm của em
                  trong quá trình học tập và thực hành dạy học Hóa học.
                </p>
              </article>
            </div>

            <div className="max-w-5xl mx-auto mt-8 rounded-2xl border bg-card p-7 md:p-9 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-2">
                  Sản phẩm nổi bật
                </p>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  Hồ sơ học tập CHEM1441
                </h2>
                <p className="text-muted-foreground mt-2">
                  Tổng hợp các sản phẩm thực hành về hình ảnh, video và infographic trong dạy học Hóa học.
                </p>
              </div>

              <Button asChild>
                <Link to="/chem1441">
                  Xem hồ sơ ICT
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
