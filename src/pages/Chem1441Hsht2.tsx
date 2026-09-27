import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileCheck2,
  FileText,
  FlaskConical,
  Keyboard,
  Lightbulb,
  Presentation,
  Scale,
  Sigma,
  Upload,
  Wrench,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Chem1441Subnav } from '@/components/Chem1441Subnav';

const reflectionItems = [
  {
    title: '1. Trình bày nội dung Hóa học chính xác hơn',
    content:
      'Các công cụ soạn thảo giúp biểu diễn chỉ số, điện tích, phương trình phản ứng, biểu thức tính toán và sơ đồ rõ ràng hơn. Điều này đặc biệt cần thiết với tài liệu Hóa học vì một lỗi nhỏ ở kí hiệu hoặc chỉ số có thể làm thay đổi ý nghĩa.',
    icon: FileText,
  },
  {
    title: '2. Tiết kiệm thời gian khi biên soạn',
    content:
      'Những thao tác như Equation, AutoCorrect, phím tắt và các công cụ hỗ trợ viết công thức giúp giảm các bước lặp lại. Khi đã thiết lập cách làm phù hợp, việc chỉnh sửa và tái sử dụng tài liệu cũng thuận tiện hơn.',
    icon: Keyboard,
  },
  {
    title: '3. Tổ chức bài trình chiếu dễ theo dõi hơn',
    content:
      'ICT hỗ trợ kết hợp chữ, hình ảnh, sơ đồ và các thành phần trực quan trong cùng một bài trình chiếu. Tuy vậy, bố cục, lượng chữ, màu sắc và hiệu ứng vẫn cần được kiểm soát để nội dung chính không bị chìm.',
    icon: Presentation,
  },
];

const tools = [
  {
    name: 'Microsoft Word',
    description:
      'Sử dụng Subscript, Superscript, Equation và AutoCorrect để trình bày công thức, phương trình và biểu thức Hóa học.',
    icon: FileText,
  },
  {
    name: 'Equation',
    description:
      'Nhập phương trình, phân số, mũi tên phản ứng, chỉ số và các biểu thức toán học ngay trong Word.',
    icon: Sigma,
  },
  {
    name: 'AutoCorrect',
    description:
      'Tạo từ viết tắt để nhập nhanh các cụm từ, công thức và phương trình thường dùng trong quá trình soạn thảo.',
    icon: Keyboard,
  },
  {
    name: 'ChemSketch / MolView',
    description:
      'Hỗ trợ viết, vẽ và quan sát cấu trúc hóa học khi tài liệu cần biểu diễn công thức cấu tạo hoặc mô hình phân tử.',
    icon: FlaskConical,
  },
  {
    name: 'PowerPoint',
    description:
      'Thiết kế bài trình chiếu, sắp xếp nội dung, hình ảnh và màu nhấn; kiểm tra khả năng đọc trước khi sử dụng trên lớp.',
    icon: Presentation,
  },
];

const evidenceItems = [
  {
    id: 'san-pham-1',
    label: 'Minh chứng 1 · Microsoft Word',
    title: 'Thực hành Equation và AutoCorrect',
    icon: Sigma,
    status: 'Đã thực hành',
    description:
      'Biên soạn phương trình điện li, biểu thức tính toán, chuỗi chuyển hóa và thiết lập AutoCorrect cho các cụm từ, công thức và phương trình Hóa học.',
    details: [
      'Sử dụng Equation để trình bày chỉ số, phân số và mũi tên phản ứng.',
      'Thiết lập AutoCorrect cho các nội dung thường dùng.',
      'Kiểm tra lại font, chỉ số và sự thống nhất của công thức trong văn bản.',
    ],
  },
  {
    id: 'san-pham-2',
    label: 'Minh chứng 2 · Công thức Hóa học',
    title: 'Viết, vẽ và kiểm tra công thức hóa học',
    icon: FlaskConical,
    status: 'Đã thực hành',
    description:
      'Thử các công cụ hỗ trợ viết và vẽ công thức, từ định dạng công thức trong Word đến biểu diễn cấu trúc bằng phần mềm chuyên dụng.',
    details: [
      'Dùng ChemFormatter hoặc công cụ định dạng để xử lí chỉ số nhanh hơn.',
      'Vẽ cấu trúc bằng ChemSketch và chỉnh lại bố cục cấu trúc khi cần.',
      'Sử dụng MolView để quan sát mô hình 2D/3D của phân tử.',
    ],
  },
  {
    id: 'san-pham-3',
    label: 'Minh chứng 3 · PowerPoint',
    title: 'Rà soát và chỉnh sửa bài trình chiếu',
    icon: Presentation,
    status: 'Đã phân tích',
    description:
      'Đánh giá một slide Hóa học dựa trên lượng chữ, bố cục, màu sắc, khoảng trắng và mức độ nhất quán rồi đề xuất cách chỉnh sửa.',
    details: [
      'Giảm lượng chữ và làm rõ thứ bậc thông tin.',
      'Hạn chế màu nhấn và hiệu ứng không cần thiết.',
      'Căn chỉnh khoảng cách để nội dung chính dễ quan sát hơn.',
    ],
  },
  {
    id: 'san-pham-4',
    label: 'Minh chứng 4 · Văn bản kiểm tra',
    title: 'Đề kiểm tra và hướng dẫn chấm',
    icon: FileCheck2,
    status: 'Đã thực hành',
    description:
      'Rà soát thể thức và nội dung của đề kiểm tra Hóa học, phát hiện lỗi trình bày rồi xây dựng hướng dẫn chấm tương ứng.',
    details: [
      'Kiểm tra số trang, chính tả, danh pháp và định dạng công thức.',
      'Giữ cách trình bày điểm số và nội dung nhất quán.',
      'Xây dựng đáp án và phân bố điểm theo từng yêu cầu của câu hỏi.',
    ],
  },
];

export default function Chem1441Hsht2() {
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
                <FileText className="h-4 w-4" />
                Hồ sơ học tập 2 · CHEM1441
              </div>

              <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-tight mb-6">
                Biên soạn văn bản và <span className="text-gradient">bài trình chiếu</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed mb-8">
                Hồ sơ ghi lại phần thực hành với Word, công cụ viết và vẽ công thức Hóa học,
                bài trình chiếu và văn bản kiểm tra; kèm phần phản hồi về cách sử dụng ICT hiệu quả.
              </p>

              <div className="flex flex-wrap gap-3">
                <Button asChild variant="hero">
                  <a href="#san-pham">
                    Xem minh chứng thực hành
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
                    Làm thế nào để biên soạn văn bản và bài trình chiếu phục vụ dạy học Hóa học một cách hiệu quả?
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </section>

        <nav
          aria-label="Điều hướng nhanh hồ sơ học tập 2"
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
                ['#san-pham-1', 'Equation'],
                ['#san-pham-2', 'Công thức'],
                ['#san-pham-3', 'PowerPoint'],
                ['#san-pham-4', 'Đề & đáp án'],
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
                Vai trò của ICT khi biên soạn văn bản và bài trình chiếu
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Qua các bài thực hành, em nhận thấy công cụ số có ích nhất khi giúp tài liệu
                chính xác hơn, dễ chỉnh sửa hơn và hỗ trợ người học theo dõi nội dung rõ ràng hơn.
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
                Nguyên tắc em rút ra khi biên soạn
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-muted-foreground leading-relaxed">
                <p>
                  <span className="font-semibold text-foreground">Ưu tiên tính chính xác:</span>{' '}
                  kiểm tra công thức, kí hiệu, danh pháp, điều kiện phản ứng và nội dung trước khi chú ý đến hình thức.
                </p>
                <p>
                  <span className="font-semibold text-foreground">Giữ định dạng nhất quán:</span>{' '}
                  thống nhất font, cỡ chữ, chỉ số, khoảng cách và cách dùng màu trong toàn bộ tài liệu.
                </p>
                <p>
                  <span className="font-semibold text-foreground">Dùng công cụ đúng chỗ:</span>{' '}
                  Equation phù hợp với biểu thức phức tạp, còn phím tắt và AutoCorrect tiện hơn cho nội dung lặp lại.
                </p>
                <p>
                  <span className="font-semibold text-foreground">Giảm tải cho slide:</span>{' '}
                  mỗi trang nên có một ý chính, tránh quá nhiều chữ và chỉ dùng màu hoặc hiệu ứng khi chúng giúp làm rõ nội dung.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="cong-cu" className="scroll-mt-28 py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mb-12">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-3">
                Công cụ và kĩ thuật
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Những công cụ em đã sử dụng
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Các công cụ dưới đây giải quyết những nhóm thao tác khác nhau: nhập công thức,
                vẽ cấu trúc, nhập nhanh nội dung lặp lại và tổ chức bài trình chiếu.
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

            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <article className="rounded-2xl border bg-card p-6 md:p-7">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                  <Scale className="h-5 w-5" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">Ưu điểm</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Các công cụ giúp thao tác nhanh hơn, dễ sửa lỗi, tái sử dụng nội dung và trình bày
                  công thức hoặc cấu trúc rõ hơn so với cách gõ thủ công.
                </p>
              </article>

              <article className="rounded-2xl border bg-card p-6 md:p-7">
                <div className="w-11 h-11 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-5">
                  <Wrench className="h-5 w-5" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">Hạn chế cần chú ý</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Equation có thể tạo font khác với phần văn bản, AutoCorrect cần thiết lập trước,
                  còn phần mềm vẽ cấu trúc và PowerPoint vẫn đòi hỏi người dùng kiểm tra lại nội dung và bố cục.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section id="san-pham" className="scroll-mt-28 py-16 md:py-24 bg-card border-y">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-12">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-3">
                  Minh chứng thực hành
                </p>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Các nội dung đã thực hành trong HSHT2
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Mỗi minh chứng được trình bày theo cùng một cấu trúc: nội dung thực hiện,
                  thao tác chính và điều em cần chú ý khi dùng công cụ.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Upload className="h-4 w-4" />
                4 nhóm minh chứng
              </div>
            </div>

            <div className="space-y-8">
              {evidenceItems.map((item) => {
                const Icon = item.icon;
                return (
                  <article
                    id={item.id}
                    key={item.id}
                    className="scroll-mt-28 rounded-2xl border bg-background overflow-hidden shadow-sm"
                  >
                    <div className="p-6 md:p-8 border-b">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">
                            {item.label}
                          </p>
                          <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                            {item.title}
                          </h3>
                        </div>
                        <div className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                          <CheckCircle2 className="h-4 w-4" />
                          {item.status}
                        </div>
                      </div>
                    </div>

                    <div className="p-6 md:p-8 grid lg:grid-cols-[0.9fr_1.1fr] gap-8">
                      <div className="rounded-2xl border bg-card min-h-52 flex items-center justify-center">
                        <div className="text-center p-8">
                          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                            <Icon className="h-8 w-8" />
                          </div>
                          <p className="font-semibold text-foreground">{item.title}</p>
                          <p className="text-sm text-muted-foreground mt-2">
                            Khu vực này có thể thay bằng ảnh chụp hoặc file sản phẩm khi đưa minh chứng lên website.
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-display text-lg font-bold text-foreground mb-3">
                          Nội dung thực hiện
                        </h4>
                        <p className="text-muted-foreground leading-relaxed mb-5">
                          {item.description}
                        </p>
                        <ul className="space-y-2 text-muted-foreground leading-relaxed">
                          {item.details.map((detail) => (
                            <li key={detail}>• {detail}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
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
                  Điều em rút ra
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Biên soạn tài liệu Hóa học không chỉ là nhập đúng nội dung mà còn phải kiểm tra
                  cách biểu diễn kí hiệu, công thức và bố cục. Công cụ số giúp làm nhanh hơn,
                  nhưng người soạn vẫn phải là người kiểm tra tính chính xác cuối cùng.
                </p>
              </article>

              <article className="rounded-2xl border bg-card p-7 md:p-9">
                <div className="w-11 h-11 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-5">
                  <Wrench className="h-5 w-5" />
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  Cách em sẽ sử dụng hiệu quả hơn
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Em sẽ ưu tiên các thao tác đơn giản cho nội dung thường gặp, chỉ dùng công cụ chuyên dụng
                  khi thật sự cần và kiểm tra lại tài liệu ở cả chế độ soạn thảo lẫn khi xuất file.
                  Với slide, em sẽ giảm chữ và giữ cách trình bày nhất quán giữa các trang.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-14 bg-gradient-hero text-primary-foreground">
          <div className="container mx-auto px-6 text-center">
            <Button asChild variant="glass">
              <Link to="/chem1441/portfolio">
                Xem Portfolio CHEM1441
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
