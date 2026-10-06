import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Atom,
  Beaker,
  BookOpen,
  ClipboardCheck,
  FlaskConical,
  Gauge,
  Microscope,
  Sigma,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Chem1441Subnav } from '@/components/Chem1441Subnav';

const roles = [
  {
    title: 'Trực quan hóa nội dung khó quan sát',
    text: 'Mô phỏng hỗ trợ biểu diễn cấu trúc, sự biến đổi và hiện tượng mà học sinh khó quan sát trực tiếp bằng mắt thường.',
    icon: Microscope,
  },
  {
    title: 'Cho phép thử nghiệm và so sánh',
    text: 'Người học có thể thay đổi điều kiện, lặp lại thao tác và đối chiếu kết quả để kiểm tra dự đoán của mình.',
    icon: Gauge,
  },
  {
    title: 'Hỗ trợ tổ chức thí nghiệm',
    text: 'Mô phỏng có thể bổ trợ cho thí nghiệm thật khi điều kiện thiết bị, hóa chất hoặc thời gian chưa thuận lợi.',
    icon: FlaskConical,
  },
];

const tools = [
  {
    name: 'Yenka',
    icon: Beaker,
    text: 'Phòng thí nghiệm Hóa học ảo cho phép lựa chọn hóa chất, dụng cụ, thay đổi thông số và tự bố trí hệ thí nghiệm.',
  },
  {
    name: 'MolView',
    icon: Atom,
    text: 'Công cụ trực quan hóa cấu trúc phân tử, hỗ trợ quan sát mô hình 3D và khảo sát các thông số hình học của phân tử.',
  },
  {
    name: 'MOPAC / PM7',
    icon: Sigma,
    text: 'Công cụ tính toán Hóa học lượng tử bán thực nghiệm, dùng để tối ưu cấu trúc và khai thác một số đại lượng tính toán.',
  },
];

export default function Chem1441Hsht3() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Chem1441Subnav />

      <main className="[&_p]:text-left [&_li]:text-left md:[&_p]:text-justify md:[&_li]:text-justify">
        <section className="relative overflow-hidden border-b bg-card py-16 md:py-24">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-0 left-12 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />
          </div>

          <div className="container mx-auto px-6 relative">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-2 text-sm font-semibold text-primary mb-6">
                <BookOpen className="h-4 w-4" />
                CHEM1441 · Hồ sơ học tập 3
              </div>

              <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-tight mb-6">
                Mô phỏng Hóa học và <span className="text-gradient">kiểm tra đánh giá</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">
                Hồ sơ ghi lại việc lựa chọn, sử dụng và đánh giá các công cụ ICT trong mô phỏng Hóa học,
                đồng thời vận dụng sản phẩm thực hành vào một tình huống dạy học cụ thể.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-5">
              <a
                href="#mo-phong"
                className="group rounded-3xl border bg-card p-7 md:p-8 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Đi đến nội dung mô phỏng Hóa học"
              >
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Microscope className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    Câu hỏi 01
                  </span>
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground leading-snug">
                  Làm thế nào để thiết kế và sử dụng mô phỏng hiệu quả trong dạy học môn Hóa học?
                </h2>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  Xem nội dung
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </a>

              <a
                href="#kiem-tra-danh-gia"
                className="group rounded-3xl border bg-card p-7 md:p-8 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Đi đến nội dung kiểm tra đánh giá"
              >
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <ClipboardCheck className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    Câu hỏi 02
                  </span>
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground leading-snug">
                  Làm thế nào để ứng dụng ICT hiệu quả trong kiểm tra đánh giá môn Hóa học?
                </h2>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  Xem nội dung
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </a>
            </div>
          </div>
        </section>

        <nav
          aria-label="Điều hướng nhanh hồ sơ học tập 3"
          className="sticky top-16 z-40 border-y bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85"
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-center gap-2 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {[
                ['#mo-phong', 'Mô phỏng Hóa học'],
                ['#vai-tro', 'Vai trò'],
                ['#cong-cu', 'Công cụ'],
                ['#yenka', 'Minh chứng Yenka'],
                ['#kiem-tra-danh-gia', 'Kiểm tra đánh giá'],
              ].map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  className="shrink-0 rounded-full border bg-card px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </nav>

        <section id="mo-phong" className="scroll-mt-28 py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="max-w-4xl mb-12">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary mb-3">
                  Nội dung phản hồi 01
                </p>
                <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground leading-tight mb-5">
                  Thiết kế và sử dụng mô phỏng trong dạy học Hóa học
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Để mô phỏng có giá trị trong một hoạt động học, công cụ cần được chọn theo mục tiêu bài học,
                  có nhiệm vụ quan sát hoặc xử lí thông tin rõ ràng và tạo cơ hội để học sinh giải thích kết quả
                  thay vì chỉ xem mô phỏng như một hình minh họa.
                </p>
              </div>

              <div id="vai-tro" className="scroll-mt-28">
                <div className="flex items-end justify-between gap-6 mb-6">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-2">Vai trò</p>
                    <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                      Ba giá trị nổi bật của mô phỏng
                    </h3>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-5">
                  {roles.map((item) => {
                    const Icon = item.icon;
                    return (
                      <article key={item.title} className="rounded-2xl border bg-card p-6 shadow-sm">
                        <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h4 className="font-display text-xl font-bold text-foreground mb-3">{item.title}</h4>
                        <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="cong-cu" className="scroll-mt-28 py-16 md:py-24 bg-card border-y">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-2">Công cụ ICT</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
                Các công cụ được lựa chọn
              </h2>
              <p className="text-muted-foreground max-w-3xl leading-relaxed mb-8">
                Ba công cụ phục vụ ba mức độ khai thác khác nhau: thí nghiệm ảo, trực quan hóa cấu trúc
                và tính toán các đại lượng liên quan đến cấu trúc phân tử.
              </p>

              <div className="grid lg:grid-cols-3 gap-5">
                {tools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <article key={tool.name} className="rounded-2xl border bg-background p-6 md:p-7">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-display text-2xl font-bold text-foreground mb-3">{tool.name}</h3>
                      <p className="text-muted-foreground leading-relaxed">{tool.text}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="yenka" className="scroll-mt-28 py-16 md:py-24">
          <div className="container mx-auto px-6">
            <article className="max-w-6xl mx-auto rounded-[2rem] border bg-card overflow-hidden shadow-sm">
              <header className="p-7 md:p-10 border-b">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="max-w-3xl">
                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary mb-3">
                      Minh chứng thực hành · Yenka
                    </p>
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">
                      Điều chế CO₂ và dẫn khí CO₂ vào nước vôi trong
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Hệ thí nghiệm được tự bố trí trên Yenka gồm bình tạo khí, nút cao su, ống dẫn khí và cốc
                      chứa nước vôi trong. Khí CO₂ được tạo ra từ phản ứng giữa calcium carbonate và hydrochloric acid.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm shrink-0">
                    <div className="rounded-xl border bg-background px-4 py-3">
                      <div className="text-xs text-muted-foreground mb-1">Môn / lớp</div>
                      <div className="font-semibold text-foreground">Hóa học 12</div>
                    </div>
                    <div className="rounded-xl border bg-background px-4 py-3">
                      <div className="text-xs text-muted-foreground mb-1">Công cụ</div>
                      <div className="font-semibold text-foreground">Yenka</div>
                    </div>
                  </div>
                </div>
              </header>

              <div className="p-7 md:p-10">
                <div className="grid lg:grid-cols-2 gap-6 mb-10">
                  <figure className="rounded-2xl border bg-background overflow-hidden">
                    <div className="aspect-[16/10] bg-muted/30 flex items-center justify-center overflow-hidden">
                      <img
                        src="/portfolio/hsht3/yenka-co2-before.png"
                        alt="Bố trí thí nghiệm điều chế CO2 trên Yenka trước khi phản ứng"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <figcaption className="border-t px-5 py-4 text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">Hình 1.</span> Bố trí hệ thí nghiệm trước khi phản ứng xảy ra.
                    </figcaption>
                  </figure>

                  <figure className="rounded-2xl border bg-background overflow-hidden">
                    <div className="aspect-[16/10] bg-muted/30 flex items-center justify-center overflow-hidden">
                      <img
                        src="/portfolio/hsht3/yenka-co2-after.png"
                        alt="Kết quả thí nghiệm dẫn CO2 vào nước vôi trong trên Yenka"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <figcaption className="border-t px-5 py-4 text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">Hình 2.</span> Kết quả sau khi dẫn khí CO₂ vào nước vôi trong.
                    </figcaption>
                  </figure>
                </div>

                <div className="grid lg:grid-cols-3 gap-5 mb-10">
                  <div className="rounded-2xl border bg-background p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary mb-3">Bố trí</p>
                    <p className="text-muted-foreground leading-relaxed">
                      Cho CaCO₃ vào bình tam giác, thêm dung dịch HCl và dẫn khí sinh ra qua dung dịch Ca(OH)₂ bằng hệ ống dẫn khí.
                    </p>
                  </div>

                  <div className="rounded-2xl border bg-background p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary mb-3">Hiện tượng</p>
                    <p className="text-muted-foreground leading-relaxed">
                      Phản ứng trong bình tạo khí CO₂. Khi CO₂ đi qua nước vôi trong, xuất hiện calcium carbonate làm dung dịch vẩn đục.
                    </p>
                  </div>

                  <div className="rounded-2xl border bg-background p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary mb-3">Phương trình</p>
                    <div className="space-y-3 text-sm font-medium text-foreground">
                      <p>CaCO₃ + 2HCl → CaCl₂ + CO₂↑ + H₂O</p>
                      <p>CO₂ + Ca(OH)₂ → CaCO₃↓ + H₂O</p>
                    </div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-6">
                  <section className="rounded-2xl border-2 border-primary/15 bg-primary/5 p-6 md:p-7">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary mb-3">
                      Ý tưởng sử dụng trong dạy học
                    </p>
                    <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                      Hóa học 12 · Nguyên tố nhóm IA và nhóm IIA
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Mô phỏng có thể được sử dụng khi học sinh tìm hiểu tương tác của muối carbonate với acid loãng.
                      Giáo viên yêu cầu học sinh dự đoán hiện tượng khi cho CaCO₃ tác dụng với HCl, sau đó quan sát
                      mô phỏng, xác định khí sinh ra bằng nước vôi trong và viết các phương trình hóa học tương ứng.
                    </p>
                    <div className="rounded-xl border bg-background/80 p-4">
                      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                        Yêu cầu cần đạt được khai thác
                      </div>
                      <div className="font-semibold text-foreground">
                        Nêu được tương tác giữa muối carbonate với nước và với acid loãng.
                      </div>
                    </div>
                  </section>

                  <section className="rounded-2xl border bg-background p-6 md:p-7">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary mb-3">
                      Đánh giá công cụ
                    </p>
                    <h3 className="font-display text-2xl font-bold text-foreground mb-4">Yenka</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Yenka phù hợp khi cần tự bố trí một hệ thí nghiệm có nhiều dụng cụ và hóa chất. Với bài này,
                      việc kéo thả dụng cụ giúp quan sát rõ đường đi của khí từ bình phản ứng sang cốc nhận khí.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Điểm cần lưu ý là thư viện hóa chất và dụng cụ khá nhiều, một số bảng thông tin hiển thị dày
                      nên cần sắp xếp lại màn hình trước khi dùng làm học liệu hoặc chụp minh chứng.
                    </p>
                  </section>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section id="kiem-tra-danh-gia" className="scroll-mt-28 py-16 md:py-24 bg-card border-y">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary mb-3">
                Nội dung phản hồi 02
              </p>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground leading-tight mb-8">
                Ứng dụng ICT trong kiểm tra đánh giá môn Hóa học
              </h2>

              <div className="min-h-44 rounded-3xl border bg-background" aria-label="Khu vực nội dung kiểm tra đánh giá" />
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto flex justify-end">
              <Button asChild variant="outline">
                <Link to="/chem1441">
                  Quay về tổng quan CHEM1441
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
