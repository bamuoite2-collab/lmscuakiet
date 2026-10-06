import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, FileText, Images, Presentation, ClipboardCheck } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Chem1441Subnav } from '@/components/Chem1441Subnav';

const portfolios = [
  {
    href: '/chem1441/hsht1',
    title: 'Hồ sơ học tập 1',
    subtitle: 'Tìm kiếm, lưu trữ và hiệu chỉnh tư liệu',
    description:
      'Các sản phẩm thực hành về hình ảnh, video và infographic; kèm cách ứng dụng vào dạy học Hóa học.',
    icon: Images,
    status: 'Đã có nội dung',
  },
  {
    href: '/chem1441/hsht2',
    title: 'Hồ sơ học tập 2',
    subtitle: 'Biên soạn văn bản và bài trình chiếu',
    description:
      'Các bài thực hành Word, Equation, AutoCorrect, ChemFormatter, mô hình 2D–3D và PowerPoint; kèm ghi chú về những lỗi đã gặp khi làm.',
    icon: FileText,
    status: 'Đang hoàn thiện',
  },
  {
    href: '/chem1441/hsht3',
    title: 'Hồ sơ học tập 3',
    subtitle: 'Mô phỏng và kiểm tra đánh giá',
    description:
      'Đã dựng khung HSHT3 theo hướng dẫn học phần, có ba nhiệm vụ thực hành với Yenka, MolView và MOPAC; phần kiểm tra đánh giá sẽ bổ sung sau HĐ24–26.',
    icon: Presentation,
    status: 'Đang thực hiện',
  },
  {
    href: '/chem1441/hsht4',
    title: 'Hồ sơ học tập 4',
    subtitle: 'Tổng hợp và vận dụng ICT trong dạy học',
    description:
      'Phần này sẽ được bổ sung khi học tới HSHT4.',
    icon: ClipboardCheck,
    status: 'Sẽ bổ sung',
  },
];

export default function Chem1441Overview() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Chem1441Subnav />

      <main>
        <section className="py-16 md:py-24 border-b bg-card">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-semibold text-primary mb-6">
                <BookOpen className="h-4 w-4" />
                CHEM1441 · Ứng dụng ICT trong dạy học Hóa học
              </div>
              <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-tight mb-6">
                Hồ sơ học tập CHEM1441
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">
                Đây là trang mục lục của CHEM1441. Em tách từng hồ sơ ra riêng để khi cần có thể mở thẳng
                vào bài thực hành, file minh chứng và phần ghi chú của hồ sơ đó.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {portfolios.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.href} className="rounded-3xl border bg-card p-7 md:p-8 shadow-sm card-hover">
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="rounded-full border bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                        {item.status}
                      </span>
                    </div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-2">{item.title}</p>
                    <h2 className="font-display text-2xl font-bold text-foreground mb-3">{item.subtitle}</h2>
                    <p className="text-muted-foreground leading-relaxed mb-6">{item.description}</p>
                    <Button asChild variant="outline">
                      <Link to={item.href}>
                        Mở hồ sơ
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
