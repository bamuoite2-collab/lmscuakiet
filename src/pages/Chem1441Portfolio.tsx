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
import { Chem1441Subnav } from '@/components/Chem1441Subnav';

const tools = [
  {
    name: 'Canva',
    description:
      'Thiết kế infographic, khung hình video và học liệu trực quan; hỗ trợ bố cục, văn bản, hình ảnh và các thành phần đồ họa theo một phong cách thống nhất.',
    icon: Palette,
  },
  {
    name: 'CapCut',
    description:
      'Biên tập video theo timeline; cắt ghép cảnh, điều chỉnh thời lượng, chèn chữ, phụ đề, âm thanh, hiệu ứng chuyển cảnh và xuất video.',
    icon: Video,
  },
  {
    name: 'PicsArt',
    description:
      'Biên tập hình ảnh nâng cao như cắt ghép, chèn chữ, điều chỉnh hình, xóa hoặc thay đổi một số chi tiết để tạo học liệu minh họa.',
    icon: Image,
  },
  {
    name: 'Office Lens',
    description:
      'Sao chụp và số hóa tài liệu, hỗ trợ căn chỉnh vùng chụp để tạo hình ảnh rõ ràng trước khi đưa vào học liệu dạy học.',
    icon: FileImage,
  },
  {
    name: 'PowerPoint',
    description:
      'Chỉnh sửa và chú thích hình ảnh, sắp xếp đối tượng trên slide, tạo chuyển động cơ bản và có thể xuất bài trình chiếu thành video.',
    icon: BookOpen,
  },
];




const reflectionItems = [
  {
    title: '1. Trực quan hóa kiến thức khó hình dung',
    content:
      'Với phản ứng, quy trình hay mô hình vi mô, hình ảnh và video cho học sinh một đối tượng cụ thể để quan sát. Điều này hữu ích ở những nội dung khó hình dung nếu chỉ mô tả bằng lời.',
    icon: BookOpen,
  },
  {
    title: '2. Hỗ trợ tiếp thu và tạo hứng thú học tập',
    content:
      'Hình ảnh dễ thu hút sự chú ý, nhưng chỉ chiếu lên thì chưa đủ. Em thấy chúng hữu ích hơn khi đi kèm một câu hỏi hoặc yêu cầu học sinh chỉ ra chi tiết trên hình.',
    icon: Lightbulb,
  },
  {
    title: '3. Kết nối thực tiễn và hỗ trợ tình huống khó thực hiện',
    content:
      'Video phù hợp với những thí nghiệm khó thực hiện trực tiếp hoặc cần nhiều thời gian. Hình ảnh về sản xuất và ứng dụng cũng giúp đưa nội dung Hóa học về gần các tình huống thực tế hơn.',
    icon: Video,
  },
];

export default function Chem1441Portfolio() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Chem1441Subnav />

      <main className="[&_p]:text-left [&_li]:text-left md:[&_p]:text-justify md:[&_li]:text-justify">
        <section className="py-16 md:py-24 relative overflow-hidden border-b">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute top-24 right-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-6 relative">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/10 text-primary text-sm font-semibold mb-6 dark:border-white/15 dark:bg-white/10 dark:text-white">
                <FlaskConical className="h-4 w-4" />
                Hồ sơ học tập 1 · CHEM1441
              </div>

              <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-tight mb-6">
                Tìm kiếm, lưu trữ và <span className="text-gradient">hiệu chỉnh tư liệu</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed mb-8">
                Hồ sơ tập hợp các sản phẩm thực hành về hình ảnh, video và infographic, kèm phần phản hồi về cách sử dụng các phương tiện trực quan trong dạy học Hóa học.
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
            <div className="max-w-5xl mx-auto rounded-3xl border-2 border-foreground/10 bg-card p-8 md:p-12 shadow-md relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1 bg-foreground/80" />
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="w-14 h-14 rounded-2xl bg-foreground text-background flex items-center justify-center shrink-0 shadow-sm">
                  <BookOpen className="h-7 w-7" />
                </div>
                <div className="max-w-4xl">
                  <div className="inline-flex items-center rounded-full bg-foreground text-background px-4 py-1.5 text-xs md:text-sm font-bold uppercase tracking-[0.14em] mb-5">
                    Câu hỏi trọng tâm
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium text-foreground leading-tight tracking-tight">
                    Làm thế nào để sử dụng các phương tiện trực quan như video, hình ảnh
                    trong dạy học Hóa học một cách hiệu quả?
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </section>

        <nav
          aria-label="Điều hướng nhanh hồ sơ học tập"
          className="sticky top-16 z-40 border-y bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85"
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-center gap-2 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <span className="hidden lg:inline text-xs font-semibold uppercase tracking-wide text-muted-foreground mr-1 shrink-0">
                Đi nhanh đến
              </span>
              {[
                ['#phan-hoi', 'Vai trò'],
                ['#cong-cu', 'Công cụ'],
                ['#san-pham-1', 'SP1 · Hình ảnh'],
                ['#san-pham-2', 'SP2 · Video'],
                ['#san-pham-3', 'SP3 · Infographic'],
                ['#tong-ket', 'Tổng kết'],
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

        <section id="phan-hoi" className="scroll-mt-28 py-16 md:py-24 bg-card border-y">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mb-12">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-3">
                Phản hồi học tập
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Vai trò của phương tiện trực quan trong dạy học Hóa học
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Sau khi làm ba sản phẩm, em thấy hình ảnh và video có ích nhất khi học sinh có việc để làm
                với chúng. Phần dưới đây ghi lại ba cách em đã sử dụng phương tiện trực quan trong HSHT1.
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

            <div className="mt-8 rounded-2xl border bg-background p-6 md:p-8">
              <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
                Nguyên tắc để sử dụng hình ảnh và video hiệu quả
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-muted-foreground leading-relaxed">
                <p>
                  <span className="font-semibold text-foreground">Gắn với mục tiêu và hoạt động học:</span>{' '}
                  chỉ lựa chọn phương tiện khi nó hỗ trợ rõ cho yêu cầu cần đạt, sản phẩm học tập và cách tổ chức hoạt động.
                </p>
                <p>
                  <span className="font-semibold text-foreground">Bảo đảm tính chính xác và dễ tiếp nhận:</span>{' '}
                  kiểm tra nội dung khoa học, thuật ngữ, nguồn tư liệu, cỡ chữ, bố cục và mức độ phù hợp với học sinh.
                </p>
                <p>
                  <span className="font-semibold text-foreground">Tích cực hóa hoạt động của học sinh:</span>{' '}
                  kết hợp phương tiện trực quan với câu hỏi, nhiệm vụ quan sát, dự đoán, giải thích hoặc thảo luận thay vì chỉ trình chiếu.
                </p>
                <p>
                  <span className="font-semibold text-foreground">Chuẩn bị kĩ thuật và tránh lạm dụng ICT:</span>{' '}
                  kiểm tra thiết bị, tệp và đường dẫn trước giờ học; tiết chế hiệu ứng để không làm giảm tương tác giữa giáo viên và học sinh.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="cong-cu" className="scroll-mt-28 py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mb-12">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-3">
                Công cụ hỗ trợ thiết kế
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Các công cụ thiết kế hình ảnh và video
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Các công cụ dưới đây hỗ trợ những khâu khác nhau của quá trình tạo học liệu:
                số hóa tư liệu, biên tập hình ảnh, thiết kế đồ họa, dựng video và xuất sản phẩm.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
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

        <section id="san-pham" className="scroll-mt-28 py-16 md:py-24 bg-card border-y">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-12">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-3">
                  Sản phẩm thực hành
                </p>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Sản phẩm thực hành và ý tưởng dạy học
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Mỗi sản phẩm được trình bày kèm công cụ sử dụng, thao tác thực hiện,
                  ý tưởng vận dụng trong dạy học và phần đánh giá sau khi trải nghiệm công cụ.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Upload className="h-4 w-4" />
                3/3 sản phẩm đã hoàn thiện
              </div>
            </div>

            <article id="san-pham-1" className="scroll-mt-28 rounded-2xl border bg-background overflow-hidden shadow-sm mb-8">
              <div className="p-6 md:p-8 border-b">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">
                      Sản phẩm 1 · Biên tập hình ảnh
                    </p>
                    <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                      Sơ đồ chu trình carbon
                    </h3>
                  </div>
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                    <CheckCircle2 className="h-4 w-4" />
                    Đã hoàn thiện
                  </div>
                </div>

                <div className="rounded-xl border bg-muted/30 overflow-hidden">
                  <img
                    src="/portfolio/carbon-cycle-vi.png"
                    onError={(event) => {
                      event.currentTarget.onerror = () => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src =
                          'https://raw.githubusercontent.com/bamuoite2-collab/lmscuakiet/main/public/portfolio/carbon-cycle-vi.webp';
                      };
                      event.currentTarget.src = '/portfolio/carbon-cycle-vi.webp?v=3';
                    }}
                    alt="Sơ đồ chu trình carbon đã được Việt hóa bởi Hồ Tuấn Kiệt"
                    className="w-full max-w-[1042px] h-auto mx-auto object-contain"
                  />
                </div>

                <div className="grid sm:grid-cols-3 gap-3 mt-5 text-sm">
                  <div className="rounded-xl border bg-card p-4">
                    <div className="text-muted-foreground mb-1">Công cụ sử dụng</div>
                    <div className="font-semibold text-foreground">Canva</div>
                  </div>
                  <div className="rounded-xl border bg-card p-4">
                    <div className="text-muted-foreground mb-1">Người thực hiện</div>
                    <div className="font-semibold text-foreground">Hồ Tuấn Kiệt</div>
                  </div>
                  <a
                    href="https://www.geeksforgeeks.org/biology/carbon-cycle-diagram/"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border bg-card p-4 transition-colors hover:bg-muted"
                  >
                    <div className="text-muted-foreground mb-1">Nguồn ảnh gốc</div>
                    <div className="font-semibold text-foreground flex items-center gap-2">
                      GeeksforGeeks
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </a>
                </div>
              </div>

              <div className="p-6 md:p-8 grid lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-display text-lg font-bold text-foreground mb-3">
                    Các thao tác đã thực hiện
                  </h4>
                  <ul className="space-y-2 text-muted-foreground leading-relaxed">
                    <li>• Việt hóa các nhãn và thuật ngữ trên sơ đồ từ tiếng Anh sang tiếng Việt.</li>
                    <li>• Điều chỉnh nội dung chữ và cách xuống dòng để thông tin dễ quan sát hơn.</li>
                    <li>• Giữ nguyên cấu trúc và hướng các mũi tên của sơ đồ để bảo toàn ý nghĩa khoa học.</li>
                    <li>• Bổ sung họ tên người thực hiện và nguồn ảnh gốc ngay trên sản phẩm.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-display text-lg font-bold text-foreground mb-3">
                    Ý tưởng ứng dụng trong dạy học
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Có thể sử dụng sơ đồ khi dạy nội dung liên quan đến carbon và các hợp chất của carbon.
                    Giáo viên yêu cầu học sinh quan sát các mũi tên, xác định những quá trình làm tăng hoặc
                    giảm lượng CO₂ trong khí quyển như quang hợp, hô hấp, phân hủy, đốt rừng và đốt nhiên
                    liệu hóa thạch. Từ đó, học sinh giải thích mối liên hệ giữa các quá trình trong chu trình
                    carbon và liên hệ với vấn đề phát thải CO₂ trong thực tiễn.
                  </p>
                </div>

                <div>
                  <h4 className="font-display text-lg font-bold text-foreground mb-3">
                    Đánh giá công cụ Canva
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Canva có giao diện trực quan, dễ chỉnh sửa chữ, kích thước và bố cục nên phù hợp với việc
                    Việt hóa học liệu hình ảnh. Hạn chế là khi chỉnh sửa hình có nhiều nhãn và mũi tên, người
                    dùng cần thao tác cẩn thận để không che khuất chi tiết hoặc làm sai mối quan hệ giữa các
                    thành phần trong sơ đồ.
                  </p>
                </div>

                <div>
                  <h4 className="font-display text-lg font-bold text-foreground mb-3">
                    Đề xuất để sử dụng hiệu quả hơn
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Trước khi xuất sản phẩm cần đối chiếu lại thuật ngữ khoa học, kiểm tra hướng mũi tên,
                    khả năng đọc của chữ và ghi rõ nguồn tư liệu. Khi sử dụng trên lớp, giáo viên nên kết hợp
                    sơ đồ với câu hỏi quan sát hoặc nhiệm vụ giải thích thay vì chỉ trình chiếu hình ảnh.
                  </p>
                </div>

                <div className="lg:col-span-2 rounded-xl border bg-card p-5">
                  <div className="text-sm font-semibold text-foreground mb-2">Điều em rút ra</div>
                  <p className="text-muted-foreground leading-relaxed">
                    Lúc Việt hóa sơ đồ, em nhận ra phần khó nhất là giữ đúng thuật ngữ, hướng mũi tên và
                    mối quan hệ giữa các thành phần. Nếu sửa sai một nhãn hoặc che mất chi tiết, hình có thể
                    đẹp hơn nhưng lại gây hiểu nhầm về nội dung.
                  </p>
                </div>
              </div>
            </article>

            <article id="san-pham-2" className="scroll-mt-28 rounded-2xl border bg-background overflow-hidden shadow-sm mb-8">
              <div className="p-6 md:p-8 border-b">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">
                      Sản phẩm 2 · Biên tập video
                    </p>
                    <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                      Vì sao nước chanh có vị chua? – Khám phá pH
                    </h3>
                  </div>
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                    <CheckCircle2 className="h-4 w-4" />
                    Đã hoàn thiện
                  </div>
                </div>

                <div className="aspect-video rounded-xl border bg-black overflow-hidden">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/ey5G9nov1W4"
                    title="Vì sao nước chanh có vị chua? – Khám phá pH"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>

                <div className="flex flex-wrap gap-3 mt-4">
                  <Button asChild>
                    <a
                      href="https://youtu.be/ey5G9nov1W4"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Xem trên YouTube
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button asChild variant="outline">
                    <a
                      href="https://drive.google.com/file/d/1J4FU0auEw750yLbNWsC5KIZ10KBH90zY/view?usp=drive_link"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Video gốc MP4
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button asChild variant="outline">
                    <a
                      href="/portfolio/2526CHEM1441_HoTuanKiet_KHDHVideo.docx"
                      download
                    >
                      KHBD sử dụng video (Word)
                      <BookOpen className="h-4 w-4" />
                    </a>
                  </Button>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5 text-sm">
                  <div className="rounded-xl border bg-card p-4">
                    <div className="text-muted-foreground mb-1">Môn / lớp</div>
                    <div className="font-semibold text-foreground">Hóa học 11</div>
                  </div>
                  <div className="rounded-xl border bg-card p-4">
                    <div className="text-muted-foreground mb-1">Chủ đề</div>
                    <div className="font-semibold text-foreground">Cân bằng trong dung dịch nước – pH</div>
                  </div>
                  <div className="rounded-xl border bg-card p-4">
                    <div className="text-muted-foreground mb-1">Công cụ</div>
                    <div className="font-semibold text-foreground">Canva & CapCut</div>
                  </div>
                  <div className="rounded-xl border bg-card p-4">
                    <div className="text-muted-foreground mb-1">Thời lượng</div>
                    <div className="font-semibold text-foreground">Khoảng 1 phút</div>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-8">
                <div className="rounded-xl border bg-card p-5 md:p-6">
                  <div className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">
                    Yêu cầu cần đạt
                  </div>
                  <p className="text-foreground text-lg font-medium leading-relaxed">
                    Nêu được khái niệm và ý nghĩa của pH trong thực tiễn.
                  </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-display text-lg font-bold text-foreground mb-3">
                      Nội dung chính của video
                    </h4>
                    <ul className="space-y-2 text-muted-foreground leading-relaxed">
                      <li>• Mở đầu từ tình huống thực tiễn: vì sao nước chanh có vị chua?</li>
                      <li>• Giới thiệu acid citric và môi trường acid của nước chanh.</li>
                      <li>• Nêu khái niệm pH và mối liên hệ với nồng độ ion H⁺.</li>
                      <li>• Phân biệt môi trường acid, trung tính và base trên thang pH.</li>
                      <li>• Liên hệ ý nghĩa của pH đối với cơ thể sống, đất trồng và môi trường nước.</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-display text-lg font-bold text-foreground mb-3">
                      Mục tiêu của hoạt động
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Thông qua việc quan sát video và trả lời câu hỏi, học sinh hình thành được khái niệm pH,
                      đọc được ý nghĩa cơ bản của thang pH, phân loại được môi trường dựa vào giá trị pH và
                      nhận thấy vai trò của pH trong một số tình huống thực tiễn.
                    </p>
                  </div>
                </div>

                <details className="group rounded-2xl border bg-muted/20 overflow-hidden">
                  <summary className="cursor-pointer list-none p-5 md:p-6 transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">
                          Kế hoạch sử dụng video trong dạy học
                        </p>
                        <h4 className="font-display text-xl md:text-2xl font-bold text-foreground">
                          Khám phá pH qua tình huống “Vì sao nước chanh có vị chua?”
                        </h4>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-sm text-muted-foreground">10–12 phút</span>
                        <span className="rounded-full border bg-background px-3 py-1.5 text-sm font-medium text-foreground">
                          <span className="group-open:hidden">Xem kế hoạch</span>
                          <span className="hidden group-open:inline">Thu gọn</span>
                        </span>
                      </div>
                    </div>
                  </summary>

                  <div className="border-t p-5 md:p-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="rounded-xl border bg-card p-5">
                        <div className="text-sm font-bold text-foreground mb-2">1. Chuyển giao nhiệm vụ</div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          GV đặt vấn đề: “Nước chanh có vị chua. Vậy tính acid của nước chanh có thể được biểu thị
                          bằng đại lượng nào?” HS được yêu cầu xem video và chú ý các thông tin về pH, thang pH
                          và ý nghĩa thực tiễn.
                        </p>
                      </div>
                      <div className="rounded-xl border bg-card p-5">
                        <div className="text-sm font-bold text-foreground mb-2">2. Thực hiện nhiệm vụ</div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          HS xem video, ghi lại thông tin chính và trả lời: pH cho biết điều gì; pH &lt; 7,
                          pH = 7 và pH &gt; 7 tương ứng với môi trường nào; nước chanh thuộc môi trường nào;
                          pH có ý nghĩa gì trong thực tiễn.
                        </p>
                      </div>
                      <div className="rounded-xl border bg-card p-5">
                        <div className="text-sm font-bold text-foreground mb-2">3. Báo cáo – thảo luận</div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Một số HS trình bày câu trả lời, HS khác nhận xét và bổ sung. GV đặt thêm câu hỏi:
                          “Ngoài nước chanh, em biết chất quen thuộc nào có pH nhỏ hơn 7?”
                        </p>
                      </div>
                      <div className="rounded-xl border bg-card p-5">
                        <div className="text-sm font-bold text-foreground mb-2">4. Kết luận – hình thành kiến thức</div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          GV chốt: pH là đại lượng biểu thị tính acid hoặc base của dung dịch; dựa vào giá trị pH
                          có thể nhận biết môi trường acid, trung tính hay base; pH có nhiều ý nghĩa trong đời sống
                          và sản xuất.
                        </p>
                      </div>
                    </div>
                  </div>
                </details>

                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-display text-lg font-bold text-foreground mb-3">
                      Câu hỏi sau khi xem video
                    </h4>
                    <ol className="space-y-2 text-muted-foreground leading-relaxed">
                      <li>1. pH là đại lượng dùng để biểu thị điều gì?</li>
                      <li>2. Dung dịch có pH &lt; 7, pH = 7 và pH &gt; 7 tương ứng với những môi trường nào?</li>
                      <li>3. Vì sao nước chanh được xếp vào môi trường acid?</li>
                      <li>4. Nêu ít nhất hai lĩnh vực trong thực tiễn liên quan đến pH.</li>
                    </ol>
                  </div>

                  <div>
                    <h4 className="font-display text-lg font-bold text-foreground mb-3">
                      Vai trò của video trong hoạt động
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Video bắt đầu từ câu hỏi vì sao nước chanh có vị chua rồi dẫn sang pH và thang pH.
                      Em đặt câu hỏi sau video để học sinh phải xem, trả lời và giải thích lại nội dung vừa quan sát.
                    </p>
                  </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-4">
                  <div className="rounded-xl border bg-card p-5">
                    <div className="text-sm font-semibold text-foreground mb-2">
                      Đánh giá Canva & CapCut
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Trong quá trình thực hành, Canva giúp em tạo các khung hình có bố cục và phong cách thống nhất;
                      CapCut thuận tiện khi sắp xếp timeline, điều chỉnh thời lượng, lồng tiếng, tạo phụ đề, chèn âm thanh
                      và xuất video. Hạn chế là khi kết hợp hai công cụ, em vẫn phải kiểm tra lại tỉ lệ khung hình,
                      thời lượng từng cảnh, phụ đề và mức âm lượng để sản phẩm không bị rối hoặc khó theo dõi.
                    </p>
                  </div>
                  <div className="rounded-xl border bg-card p-5">
                    <div className="text-sm font-semibold text-foreground mb-2">
                      Đề xuất để sử dụng hiệu quả hơn
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Nếu làm lại, em sẽ chốt kịch bản và thời lượng từng cảnh trước khi mở CapCut.
                      Lúc xuất video cần xem lại phụ đề, âm lượng và nội dung Hóa học vì đây là những chỗ dễ sót khi chỉnh nhiều lần.
                    </p>
                  </div>
                  <div className="rounded-xl border bg-card p-5">
                    <div className="text-sm font-semibold text-foreground mb-2">
                      Điều em rút ra
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Khi dựng clip này, em thấy hiệu ứng không phải phần quyết định. Quan trọng hơn là video có
                      vừa đủ thông tin và sau khi xem học sinh có câu hỏi để trả lời hay không.
                    </p>
                  </div>
                </div>
              </div>
            </article>

            <article id="san-pham-3" className="scroll-mt-28 rounded-2xl border bg-background overflow-hidden shadow-sm">
              <div className="p-6 md:p-8 border-b">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">
                      Sản phẩm 3 · Infographic
                    </p>
                    <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                      Các yếu tố ảnh hưởng đến tốc độ phản ứng
                    </h3>
                  </div>
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                    <CheckCircle2 className="h-4 w-4" />
                    Đã hoàn thiện
                  </div>
                </div>

                <details className="group rounded-xl border bg-muted/20 overflow-hidden">
                  <summary className="list-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
                    <div className="group-open:hidden relative h-[460px] md:h-[620px] overflow-hidden bg-muted/20">
                      <img
                        src="/portfolio/reaction-rate-factors.png"
                        alt="Xem trước infographic các yếu tố ảnh hưởng đến tốc độ phản ứng"
                        className="w-full max-w-[900px] h-auto mx-auto object-contain object-top"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/95 to-transparent pt-20 pb-5 px-5 text-center">
                        <span className="inline-flex rounded-full border bg-card px-4 py-2 text-sm font-semibold text-foreground shadow-sm">
                          Xem toàn bộ infographic
                        </span>
                      </div>
                    </div>
                    <div className="hidden group-open:flex items-center justify-between gap-4 p-4 md:p-5 bg-card">
                      <span className="text-sm font-semibold text-foreground">Infographic toàn bộ</span>
                      <span className="text-sm text-muted-foreground">Nhấn để thu gọn</span>
                    </div>
                  </summary>
                  <div className="border-t bg-background p-4 md:p-8">
                    <img
                      src="/portfolio/reaction-rate-factors.png"
                      alt="Infographic các yếu tố ảnh hưởng đến tốc độ phản ứng do Hồ Tuấn Kiệt thiết kế"
                      className="w-full max-w-[900px] h-auto mx-auto object-contain"
                    />
                  </div>
                </details>

                <div className="grid sm:grid-cols-3 gap-3 mt-5 text-sm">
                  <div className="rounded-xl border bg-card p-4">
                    <div className="text-muted-foreground mb-1">Công cụ sử dụng</div>
                    <div className="font-semibold text-foreground">Canva</div>
                  </div>
                  <div className="rounded-xl border bg-card p-4">
                    <div className="text-muted-foreground mb-1">Người thực hiện</div>
                    <div className="font-semibold text-foreground">Hồ Tuấn Kiệt</div>
                  </div>
                  <div className="rounded-xl border bg-card p-4">
                    <div className="text-muted-foreground mb-1">Nội dung</div>
                    <div className="font-semibold text-foreground">Tốc độ phản ứng</div>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 grid lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-display text-lg font-bold text-foreground mb-3">
                    Nội dung được trực quan hóa
                  </h4>
                  <ul className="space-y-2 text-muted-foreground leading-relaxed">
                    <li>• Nồng độ: nồng độ chất phản ứng tăng làm số va chạm giữa các tiểu phân tăng.</li>
                    <li>• Nhiệt độ: nhiệt độ tăng làm các tiểu phân chuyển động nhanh hơn và tăng số va chạm hiệu quả.</li>
                    <li>• Diện tích bề mặt: nghiền nhỏ chất rắn làm tăng diện tích tiếp xúc giữa các chất phản ứng.</li>
                    <li>• Chất xúc tác: làm tăng tốc độ phản ứng và không bị tiêu hao sau phản ứng.</li>
                    <li>• Phần kết luận liên hệ các yếu tố với số va chạm hiệu quả theo thuyết va chạm.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-display text-lg font-bold text-foreground mb-3">
                    Ý tưởng ứng dụng trong dạy học
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Có thể sử dụng infographic khi củng cố nội dung về các yếu tố ảnh hưởng đến tốc độ phản ứng.
                    Giáo viên yêu cầu học sinh quan sát bốn phần của infographic, xác định yếu tố được thay đổi
                    trong từng tình huống và dự đoán tốc độ phản ứng tăng hay giảm. Sau đó, học sinh giải thích
                    dự đoán bằng số va chạm hiệu quả, từ đó kết nối hiện tượng thực tiễn với thuyết va chạm.
                  </p>
                </div>

                <div>
                  <h4 className="font-display text-lg font-bold text-foreground mb-3">
                    Đánh giá công cụ Canva
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Canva phù hợp với thiết kế infographic nhờ thư viện bố cục và thành phần trực quan phong phú,
                    thao tác kéo thả đơn giản và dễ duy trì phong cách thống nhất. Hạn chế là sản phẩm dài có thể
                    trở nên nhiều chữ hoặc khó đọc trên màn hình nhỏ nếu không kiểm soát cỡ chữ và khoảng trắng.
                  </p>
                </div>

                <div>
                  <h4 className="font-display text-lg font-bold text-foreground mb-3">
                    Đề xuất để sử dụng hiệu quả hơn
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Nếu làm lại, em sẽ tiếp tục giảm chữ ở từng ô và kiểm tra cỡ chữ trên màn hình nhỏ trước khi xuất.
                    Khi dùng trên lớp, infographic nên đi kèm câu hỏi dự đoán hoặc giải thích để học sinh phải đọc thông tin trên hình.
                  </p>
                </div>

                <div className="lg:col-span-2 rounded-xl border bg-card p-5">
                  <div className="text-sm font-semibold text-foreground mb-2">Điều em rút ra</div>
                  <p className="text-muted-foreground leading-relaxed">
                    Phần khó nhất của infographic là bỏ bớt. Nếu đưa quá nhiều chữ lên một trang thì sản phẩm vẫn đủ
                    kiến thức nhưng khó đọc. Em giữ lại từ khóa, hình minh họa và phần giải thích cần cho từng yếu tố.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section id="tong-ket" className="scroll-mt-28 py-16 md:py-24">
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
                  Cả ba sản phẩm đều được gắn với một cách sử dụng cụ thể trong dạy học. Sơ đồ chu trình carbon
                  hỗ trợ quan sát mối liên hệ giữa các quá trình; video pH được đặt trong một hoạt động hình thành
                  kiến thức; infographic tốc độ phản ứng được dùng để dự đoán, so sánh và giải thích bằng thuyết va chạm.
                </p>
                <p className="text-sm text-muted-foreground">
                  Điểm chung em muốn giữ là mỗi sản phẩm đều có một việc cụ thể để học sinh làm sau khi xem.
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
                  Canva thuận tiện khi em cần sửa bố cục, Việt hóa hình hoặc làm infographic. CapCut dễ dùng hơn
                  ở phần cắt ghép video, phụ đề và âm thanh. Cả hai đều giúp làm nhanh hơn, nhưng em vẫn phải tự kiểm tra
                  nội dung Hóa học và xem sản phẩm có dễ đọc trên màn hình hay không.
                </p>
                <p className="text-sm text-muted-foreground">
                  Sau HSHT1, em quan tâm nhiều hơn đến nội dung học sinh sẽ làm với sản phẩm, chứ không chỉ phần mềm dùng để tạo ra nó.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-14 bg-gradient-hero text-primary-foreground">
          <div className="container mx-auto px-6 text-center">
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
