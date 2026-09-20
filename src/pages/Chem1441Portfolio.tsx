import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileImage,
  FlaskConical,
  Image,
  Lightbulb,
  Palette,
  Upload,
  Video,
  Wrench,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';

const tools = [
  {
    name: 'Snipping Tool / Office Lens',
    description: 'Sao chụp, quét và số hoá hình ảnh hoặc tài liệu phục vụ học tập.',
    icon: FileImage,
  },
  {
    name: 'PicsArt / PowerPoint',
    description: 'Cắt, ghép, chú thích, xoá nền và biên tập hình ảnh minh hoạ.',
    icon: Image,
  },
  {
    name: 'CapCut / PowerPoint',
    description: 'Cắt ghép video, chèn chữ, âm thanh, hiệu ứng và xuất video bài dạy.',
    icon: Video,
  },
  {
    name: 'Canva',
    description: 'Thiết kế infographic và học liệu trực quan, dễ trình bày trên lớp.',
    icon: Palette,
  },
];

const products = [
  {
    title: 'Sản phẩm 1 · Biên tập hình ảnh',
    subtitle: 'Chu trình carbon',
    description:
      'Sơ đồ chu trình carbon được chọn lọc, Việt hoá chú thích, xử lý nền và ghi rõ nguồn.',
    icon: Image,
  },
  {
    title: 'Sản phẩm 2 · Biên tập video',
    subtitle: 'Video dạy học Hóa học',
    description:
      'Video ngắn có cấu trúc rõ ràng, tập trung vào nội dung trọng tâm và sử dụng hình ảnh trực quan.',
    icon: Video,
  },
  {
    title: 'Sản phẩm 3 · Infographic',
    subtitle: 'Đồ hoạ thông tin Hóa học',
    description:
      'Infographic tóm tắt kiến thức theo bố cục trực quan, ưu tiên tính chính xác và dễ tiếp nhận.',
    icon: Palette,
  },
];

const reflectionItems = [
  {
    title: 'Vai trò của phương tiện trực quan',
    content:
      'Hình ảnh và video giúp trực quan hoá các hiện tượng, quy trình và nội dung trừu tượng trong Hóa học; từ đó hỗ trợ học sinh quan sát, liên hệ và ghi nhớ kiến thức.',
    icon: BookOpen,
  },
  {
    title: 'Lựa chọn công cụ phù hợp',
    content:
      'Không cần dùng công cụ mạnh nhất. Hiệu quả phụ thuộc vào việc chọn đúng công cụ cho đúng nhiệm vụ và làm chủ thao tác cần thiết.',
    icon: Wrench,
  },
  {
    title: 'Thiết kế gắn với mục tiêu dạy học',
    content:
      'Sản phẩm trực quan cần phục vụ một mục tiêu sư phạm cụ thể, có nội dung chính xác, bố cục rõ ràng và tránh lạm dụng hiệu ứng.',
    icon: Lightbulb,
  },
];

export default function Chem1441Portfolio() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        <section className="pt-28 pb-16 md:pt-36 md:pb-24 relative overflow-hidden border-b">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute top-24 right-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-6 relative">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <FlaskConical className="h-4 w-4" />
                CHEM1441 · Ứng dụng ICT trong dạy học Hóa học
              </div>

              <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-tight mb-6">
                Hồ sơ học tập <span className="text-gradient">ICT Hóa học</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed mb-8">
                Ghi lại quá trình tìm hiểu, thực hành và phản hồi về việc sử dụng hình ảnh,
                video và các công cụ số trong thiết kế hoạt động dạy học Hóa học.
              </p>

              <div className="flex flex-wrap gap-3">
                <Button asChild variant="hero">
                  <a href="#san-pham">
                    Xem sản phẩm thực hành
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a href="#phan-hoi">Xem phần phản hồi</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto rounded-2xl border bg-card p-7 md:p-10 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-2">
                    Câu hỏi trọng tâm
                  </p>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground leading-snug">
                    Làm thế nào để sử dụng các phương tiện trực quan như video, hình ảnh
                    trong dạy học Hóa học một cách hiệu quả?
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="phan-hoi" className="py-16 md:py-24 bg-card border-y">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mb-12">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-3">
                Phản hồi học tập
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Những nội dung em rút ra
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Phần này được trình bày theo hướng ngắn gọn, tập trung vào vai trò của
                phương tiện trực quan, cách lựa chọn công cụ và nguyên tắc sử dụng hiệu quả.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {reflectionItems.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="rounded-2xl border bg-background p-6 card-hover">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-foreground mb-3">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{item.content}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mb-12">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-3">
                Công cụ đã sử dụng
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Bộ công cụ hỗ trợ học tập và dạy học
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Các công cụ được lựa chọn theo từng nhiệm vụ: sao chụp, chỉnh sửa hình ảnh,
                biên tập video và thiết kế đồ họa thông tin.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <article key={tool.name} className="rounded-2xl border bg-card p-6 card-hover">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-4">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{tool.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{tool.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="san-pham" className="py-16 md:py-24 bg-card border-y">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-12">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-3">
                  Sản phẩm thực hành
                </p>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Khu vực để cập nhật sản phẩm
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Các ô bên dưới đã được chuẩn bị sẵn. Sau khi hoàn thành sản phẩm, chỉ cần
                  thay phần giữ chỗ bằng hình ảnh, video hoặc đường dẫn tương ứng.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Upload className="h-4 w-4" />
                Đang chờ cập nhật sản phẩm
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-7">
              {products.map((product) => {
                const Icon = product.icon;
                return (
                  <article key={product.title} className="rounded-2xl border bg-background overflow-hidden card-hover">
                    <div className="aspect-[16/10] bg-muted/70 flex flex-col items-center justify-center gap-3 border-b">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                        <Icon className="h-7 w-7" />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">
                        Sản phẩm sẽ được cập nhật tại đây
                      </span>
                    </div>
                    <div className="p-6">
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">
                        {product.title}
                      </p>
                      <h3 className="font-display text-xl font-bold text-foreground mb-3">
                        {product.subtitle}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed mb-5">
                        {product.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4" />
                        Chờ hoàn thiện
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-8">
              <article className="rounded-2xl border bg-card p-7 md:p-9">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                  <Lightbulb className="h-5 w-5" />
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  Ý tưởng ứng dụng trong dạy học
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-5">
                  Mỗi sản phẩm sau khi hoàn thiện sẽ được gắn với một tình huống dạy học cụ thể,
                  chẳng hạn dùng sơ đồ để hệ thống hoá kiến thức, video để minh hoạ hiện tượng
                  khó quan sát hoặc infographic để củng cố bài học.
                </p>
                <p className="text-sm text-muted-foreground">
                  Nội dung chi tiết sẽ được cập nhật cùng từng sản phẩm.
                </p>
              </article>

              <article className="rounded-2xl border bg-card p-7 md:p-9">
                <div className="w-11 h-11 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-5">
                  <Wrench className="h-5 w-5" />
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  Đánh giá công cụ và đề xuất
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-5">
                  Sau quá trình thực hành, phần này sẽ ghi lại ưu điểm, hạn chế của từng công cụ,
                  mức độ thuận tiện khi sử dụng và đề xuất cách lựa chọn công cụ phù hợp với
                  mục tiêu, thời gian và điều kiện dạy học.
                </p>
                <p className="text-sm text-muted-foreground">
                  Sẽ bổ sung nhận xét thực tế sau khi hoàn thành sản phẩm.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-gradient-hero text-primary-foreground">
          <div className="container mx-auto px-6 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-5">
              Hồ sơ đang được hoàn thiện
            </h2>
            <p className="max-w-2xl mx-auto text-primary-foreground/80 leading-relaxed mb-8">
              Các sản phẩm thực hành sẽ được cập nhật lần lượt để phản ánh quá trình học tập,
              thử nghiệm công cụ và vận dụng ICT vào dạy học Hóa học.
            </p>
            <Button asChild variant="glass">
              <Link to="/">
                Quay về trang chủ
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
