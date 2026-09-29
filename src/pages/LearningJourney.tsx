import {
  ArrowRight,
  CheckCircle2,
  FileImage,
  FileText,
  GraduationCap,
  Image,
  Lightbulb,
  Presentation,
  Search,
  Users,
  Video,
  Wrench,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Chem1441Subnav } from '@/components/Chem1441Subnav';

const chemistryJourney = [
  {
    step: '01',
    title: 'Tìm và đánh giá tư liệu dạy học',
    icon: Search,
    text: 'Ở những hoạt động đầu, mình tập xác định từ khóa, dùng tìm kiếm nâng cao, ưu tiên nguồn đáng tin cậy, kiểm tra thời điểm công bố và chú ý vấn đề bản quyền.',
    note: 'Khi gặp một tư liệu mới, mình kiểm tra trước xem nội dung có đúng và học sinh sẽ dùng nó vào việc gì.',
  },
  {
    step: '02',
    title: 'Mở rộng cộng đồng học tập',
    icon: Users,
    text: 'Mình tìm hiểu các nhóm giáo viên Hóa học, Khoa học Tự nhiên và một số cộng đồng chuyên môn để có thêm nguồn tham khảo và trao đổi nghề nghiệp.',
    note: 'Ngoài giáo trình, mình tìm được khá nhiều ví dụ thực tế từ các nhóm giáo viên và cộng đồng chuyên môn.',
  },
  {
    step: '03',
    title: 'Chọn công cụ theo việc cần làm',
    icon: Wrench,
    text: 'Mình bắt đầu gom công cụ theo việc cần làm: chụp tài liệu, chỉnh ảnh, thiết kế, dựng video và lưu trữ. Cách này dễ nhớ hơn việc học tên từng phần mềm.',
    note: 'Cách nghĩ này giúp mình đỡ bị cuốn theo việc thử quá nhiều công cụ cùng lúc.',
  },
  {
    step: '04',
    title: 'Biên tập hình ảnh Hóa học',
    icon: Image,
    text: 'Mình thực hành chỉnh sửa và Việt hóa sơ đồ chu trình carbon, kiểm tra lại thuật ngữ, hướng mũi tên và nguồn ảnh trước khi dùng làm học liệu.',
    note: 'Một hình ảnh dạy học cần rõ về nội dung trước khi đẹp về hình thức.',
  },
  {
    step: '05',
    title: 'Thiết kế video cho một nội dung cụ thể',
    icon: Video,
    text: 'Ở phần video, mình làm clip ngắn về pH và đặt nó vào một hoạt động học có câu hỏi, mục tiêu và phần xử lý sau khi xem.',
    note: 'Lúc làm video mình mới để ý rằng phần quan trọng là học sinh sẽ làm gì sau khi xem.',
  },
  {
    step: '06',
    title: 'Thiết kế infographic',
    icon: FileImage,
    text: 'Mình dùng Canva để làm infographic về các yếu tố ảnh hưởng đến tốc độ phản ứng. Khó nhất là bỏ bớt chữ mà vẫn giữ đủ ý cần thiết.',
    note: 'Infographic dễ bị quá tải nếu cố đưa toàn bộ kiến thức lên một trang.',
  },
  {
    step: '07',
    title: 'Nhìn lại sản phẩm sau khi hoàn thành',
    icon: CheckCircle2,
    text: 'Kết thúc HSHT1, mình mở lại từng sản phẩm để xem chỗ nào còn nhiều chữ, chỗ nào thiếu nguồn và sản phẩm đó sẽ được dùng ở bước nào trong bài học.',
    note: 'Nhờ phần phản hồi, mình biết sản phẩm nào còn vướng và lần sau cần sửa chỗ nào.',
  },
  {
    step: '08',
    title: 'Biên soạn văn bản Hóa học',
    icon: FileText,
    text: 'Sang HSHT2, mình thực hành Word với Subscript, Superscript, Equation và AutoCorrect. Mình cũng bắt đầu kiểm tra kỹ hơn cách viết công thức và phương trình.',
    note: 'Với văn bản Hóa học, lỗi nhỏ ở chỉ số, kí hiệu hoặc điều kiện phản ứng cũng làm tài liệu mất tính chính xác.',
  },
  {
    step: '09',
    title: 'Rà soát bài trình chiếu',
    icon: Presentation,
    text: 'Ở bài PowerPoint, mình bắt đầu bằng một slide mẫu khá nhiều chữ. Mình đang bỏ bớt phần trang trí, chia lại nội dung và giảm số màu dùng trên slide.',
    note: 'Một slide dễ đọc thường cần bớt nội dung hơn là thêm hiệu ứng.',
  },
];

const growth = [
  {
    title: 'Ban đầu',
    text: 'Mình đã quen với công nghệ ở góc độ người dùng và người thích tự mày mò, nhưng chưa hệ thống hóa cách chọn công cụ cho một hoạt động dạy học.',
  },
  {
    title: 'Sau HSHT1',
    text: 'Mình chú ý hơn đến nguồn tư liệu, cách biên tập học liệu và việc đặt sản phẩm vào một nhiệm vụ học tập cụ thể.',
  },
  {
    title: 'Đến HSHT2',
    text: 'Mình bắt đầu để ý kỹ hơn đến chuẩn trình bày: công thức, phương trình, font, bố cục văn bản và slide.',
  },
  {
    title: 'Tiếp theo',
    text: 'Mình muốn tiếp tục hoàn thiện các phần mô phỏng, kiểm tra đánh giá và thiết kế bài dạy trong những hồ sơ sau.',
  },
];

export default function LearningJourney() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Chem1441Subnav />

      <main>
        <section className="py-16 md:py-24 border-b relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-16 left-12 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute top-24 right-0 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
          </div>

          <div className="container mx-auto px-6 relative">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full border bg-primary/10 px-4 py-2 text-sm font-semibold text-primary mb-6">
                <GraduationCap className="h-4 w-4" />
                Hành trình trong CHEM1441
              </div>
              <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-tight mb-6">
                Mình đã học và thay đổi cách làm học liệu như thế nào?
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Trang này chỉ ghi lại quá trình học trong CHEM1441. Sản phẩm hoàn chỉnh được tách sang Portfolio,
                còn từng hồ sơ học tập giữ phần minh chứng và phản hồi chi tiết.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="max-w-3xl mx-auto mb-12 text-center">
                <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-3">
                  Learning timeline
                </p>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Những bước mình đã đi qua
                </h2>
              </div>

              <div className="relative">
                <div className="absolute left-[23px] md:left-[27px] top-4 bottom-4 w-px bg-border" />
                <div className="space-y-6">
                  {chemistryJourney.map((item) => {
                    const Icon = item.icon;
                    return (
                      <article key={item.step} className="relative pl-16 md:pl-20">
                        <div className="absolute left-0 top-1 h-12 w-12 md:h-14 md:w-14 rounded-2xl border bg-background shadow-sm flex items-center justify-center text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="rounded-2xl border bg-card p-6 md:p-8">
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Bước {item.step}</span>
                            <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                            <span className="text-xs text-muted-foreground">CHEM1441</span>
                          </div>
                          <h3 className="font-display text-2xl font-bold text-foreground mb-3">{item.title}</h3>
                          <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                          <div className="mt-5 rounded-xl border bg-background p-4 flex gap-3">
                            <Lightbulb className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <p className="text-sm text-muted-foreground leading-relaxed">{item.note}</p>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-card border-y">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="max-w-3xl mx-auto mb-10 text-center">
                <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-3">
                  Nhìn lại
                </p>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                  So với lúc bắt đầu, mình đã sửa cách làm ở đâu?
                </h2>
              </div>

              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
                {growth.map((item, index) => (
                  <article key={item.title} className="rounded-2xl border bg-background p-6">
                    <div className="text-4xl font-display font-bold text-primary/25 mb-4">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <h3 className="font-display text-xl font-bold text-foreground mb-3">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto rounded-3xl border bg-card p-7 md:p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-2">
                  Sản phẩm
                </p>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
                  Xem những gì mình đã làm trong học phần
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Portfolio tập hợp sản phẩm theo dạng gallery. Nếu cần xem phần giải thích, công cụ sử dụng
                  và phản hồi chi tiết, mỗi sản phẩm sẽ dẫn về hồ sơ học tập tương ứng.
                </p>
              </div>
              <Button asChild>
                <Link to="/chem1441/portfolio">
                  Mở Portfolio
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
