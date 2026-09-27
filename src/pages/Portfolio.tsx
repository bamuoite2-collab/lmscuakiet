import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, FolderOpen, Route, UserRound } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Chem1441Subnav } from '@/components/Chem1441Subnav';

const sections = [
  {
    href: '/chem1441/gioi-thieu',
    title: 'Giới thiệu',
    description: 'Thông tin cá nhân, định hướng học tập và mối quan tâm trong dạy học Hóa học.',
    icon: UserRound,
  },
  {
    href: '/chem1441/hanh-trinh',
    title: 'Hành trình học tập',
    description: 'Các mốc học tập, trải nghiệm và những nội dung em đã thực hiện trong quá trình học.',
    icon: Route,
  },
  {
    href: '/chem1441/portfolio',
    title: 'CHEM1441',
    description: 'Hệ thống hồ sơ học tập của học phần Ứng dụng ICT trong dạy học Hóa học.',
    icon: FolderOpen,
  },
  {
    href: '/courses',
    title: 'Sản phẩm LMS Hóa học',
    description: 'Không gian học tập số với bài học, câu hỏi, công cụ Hóa học và các chức năng hỗ trợ người học.',
    icon: BookOpen,
  },
];

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Chem1441Subnav />

      <main>
        <section className="py-16 md:py-24 border-b bg-card">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary mb-4">
                Portfolio
              </p>
              <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-tight mb-6">
                Hồ sơ học tập và sản phẩm cá nhân
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">
                Nơi tổng hợp các sản phẩm, hồ sơ học tập và quá trình thực hành của em.
                Các nội dung của CHEM1441 được giữ thành một khu vực riêng để dễ theo dõi theo từng hồ sơ.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {sections.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.href} className="rounded-3xl border bg-card p-7 md:p-8 shadow-sm card-hover">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h2 className="font-display text-2xl font-bold text-foreground mb-3">{item.title}</h2>
                    <p className="text-muted-foreground leading-relaxed mb-6">{item.description}</p>
                    <Button asChild variant="outline">
                      <Link to={item.href}>
                        Xem nội dung
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
