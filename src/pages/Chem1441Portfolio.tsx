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

      <main className="[&_p]:text-justify [&_li]:text-justify">
        <section className="pt-28 pb-16 md:pt-36 md:pb-24 relative overflow-hidden border-b">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute top-24 right-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-6 relative">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/10 text-primary text-sm font-semibold mb-6 dark:border-white/15 dark:bg-white/10 dark:text-white">
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
                  Sản phẩm thực hành và ý tưởng dạy học
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Mỗi sản phẩm được trình bày kèm công cụ sử dụng, thao tác thực hiện,
                  ý tưởng vận dụng trong dạy học và phần đánh giá sau khi trải nghiệm công cụ.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Upload className="h-4 w-4" />
                1/3 sản phẩm đã hoàn thiện · Sản phẩm 2 đang biên tập
              </div>
            </div>

            <article className="rounded-2xl border bg-background overflow-hidden shadow-sm mb-8">
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
                    Qua hoạt động này, em nhận thấy chỉnh sửa hình ảnh trong dạy học không chỉ nhằm làm sản
                    phẩm đẹp hơn mà quan trọng hơn là làm cho học liệu rõ ràng, chính xác, phù hợp với học sinh
                    và có thể hỗ trợ trực tiếp cho một hoạt động học tập cụ thể.
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-2xl border bg-background overflow-hidden shadow-sm mb-8">
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
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <Video className="h-4 w-4" />
                    Đang biên tập
                  </div>
                </div>

                <div className="aspect-video rounded-xl border bg-muted/40 flex flex-col items-center justify-center gap-4 text-center p-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <Video className="h-8 w-8" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground mb-1">Video sẽ được cập nhật tại đây</div>
                    <div className="text-sm text-muted-foreground">
                      Bản dựng đang được hoàn thiện bằng Canva và CapCut.
                    </div>
                  </div>
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
                    <div className="text-muted-foreground mb-1">Thời lượng dự kiến</div>
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
                      <li>• Giới thiệu axit citric và môi trường acid của nước chanh.</li>
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

                <div>
                  <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-5">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">
                        Kế hoạch sử dụng video trong dạy học
                      </p>
                      <h4 className="font-display text-xl md:text-2xl font-bold text-foreground">
                        Hoạt động: Khám phá pH qua tình huống “Vì sao nước chanh có vị chua?”
                      </h4>
                    </div>
                    <div className="text-sm text-muted-foreground">Thời lượng: 10–12 phút</div>
                  </div>

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

                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-display text-lg font-bold text-foreground mb-3">
                      Câu hỏi sau khi xem video
                    </h4>
                    <ol className="space-y-2 text-muted-foreground leading-relaxed">
                      <li>1. pH là đại lượng dùng để biểu thị điều gì?</li>
                      <li>2. Dung dịch có pH &lt; 7, pH = 7 và pH &gt; 7 tương ứng với những môi trường nào?</li>
                      <li>3. Vì sao nước chanh được xếp vào môi trường acid?</li>
                      <li>4. Nêu ít nhất hai lĩnh vực trong thực tiễn mà việc xác định pH có ý nghĩa.</li>
                    </ol>
                  </div>

                  <div>
                    <h4 className="font-display text-lg font-bold text-foreground mb-3">
                      Vai trò của video trong hoạt động
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Video tạo tình huống học tập từ một hiện tượng quen thuộc trong đời sống, đồng thời trực
                      quan hóa khái niệm pH, thang pH và các ứng dụng thực tiễn. Hệ thống câu hỏi đi kèm giúp
                      học sinh quan sát, phân tích và rút ra kiến thức thay vì chỉ tiếp nhận thông tin thụ động.
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-dashed bg-muted/20 p-5">
                  <div className="text-sm font-semibold text-foreground mb-2">
                    Đánh giá công cụ sau thực hành
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Phần đánh giá Canva và CapCut sẽ được bổ sung sau khi hoàn thiện video, tập trung vào mức độ
                    thuận tiện khi thiết kế hình ảnh, biên tập timeline, tạo phụ đề, xử lý âm thanh, xuất video
                    và những điểm cần cải thiện để sử dụng công cụ hiệu quả hơn trong dạy học.
                  </p>
                </div>
              </div>
            </article>

            <div className="grid lg:grid-cols-1 gap-7">
              {products.slice(2).map((product) => {
                const Icon = product.icon;
                return (
                  <article key={product.title} className="rounded-2xl border bg-background overflow-hidden card-hover">
                    <div className="aspect-[16/7] bg-muted/70 flex flex-col items-center justify-center gap-3 border-b">
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
                  Với sản phẩm chu trình carbon, ý tưởng dạy học đã được trình bày ngay dưới
                  sản phẩm. Các sản phẩm video và infographic tiếp theo cũng sẽ được gắn với
                  nhiệm vụ học tập cụ thể để thể hiện rõ cách vận dụng ICT trong dạy học Hóa học.
                </p>
                <p className="text-sm text-muted-foreground">
                  Hồ sơ sẽ tiếp tục cập nhật ý tưởng dạy học tương ứng với từng sản phẩm.
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
                  Đánh giá bước đầu với Canva cho thấy công cụ phù hợp để Việt hóa và thiết kế
                  học liệu trực quan nhờ thao tác đơn giản, nhưng vẫn cần kiểm tra kỹ tính chính
                  xác của thuật ngữ, bố cục và nguồn tư liệu trước khi sử dụng trong dạy học.
                </p>
                <p className="text-sm text-muted-foreground">
                  Phần đánh giá sẽ được mở rộng khi hoàn thành thêm sản phẩm video và infographic.
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
