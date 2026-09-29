import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Download,
  Eye,
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
    title: 'Nội dung Hóa học phải đúng trước',
    content:
      'Em kiểm tra công thức, chỉ số, điện tích và phương trình trước. Font, cỡ chữ hay bố cục để sau, vì trình bày đẹp mà công thức sai thì vẫn phải làm lại.',
    icon: FileCheck2,
  },
  {
    title: 'Chọn công cụ theo đúng việc đang làm',
    content:
      'Equation, AutoCorrect hay ChemFormatter giải quyết những việc khác nhau. Em thấy dễ làm hơn khi xác định mình đang cần gõ biểu thức, nhập nội dung lặp lại hay sửa chỉ số rồi mới chọn công cụ.',
    icon: BookOpen,
  },
];

const tools = [
  {
    name: 'Microsoft Word',
    description:
      'Em dùng Word để làm file nộp, chèn công thức, ảnh minh chứng và sắp xếp các phần của bài thực hành.',
    icon: FileText,
  },
  {
    name: 'Equation',
    description:
      'Em dùng Equation cho phân số, biểu thức và các phương trình khó gõ bằng văn bản thường.',
    icon: Sigma,
  },
  {
    name: 'AutoCorrect',
    description:
      'Em dùng AutoCorrect cho những công thức hoặc phương trình phải gõ lại nhiều lần.',
    icon: Keyboard,
  },
  {
    name: 'ChemFormatter',
    description:
      'ChemFormatter sửa chỉ số dưới và điện tích ngay trong Word. Phần này nhanh hơn nhiều so với việc chỉnh từng số bằng tay.',
    icon: FlaskConical,
  },
  {
    name: 'ChemDraw / Chem3D',
    description:
      'Em vẽ cấu trúc 2D trong ChemDraw rồi chuyển sang Chem3D để xem mô hình không gian.',
    icon: FlaskConical,
  },
  {
    name: 'PowerPoint',
    description:
      'Em đang dùng PowerPoint để làm lại slide mẫu về tính chất hóa học của muối.',
    icon: Presentation,
  },
];

const experienceItems = [
  {
    title: 'Equation',
    text:
      'Equation giúp em trình bày phân số, chỉ số và phương trình gọn hơn. Phần mất thời gian nhất là mũi tên phản ứng có điều kiện, đặc biệt mũi tên cân bằng; một số lệnh không hoạt động như em dự đoán nên phải thử cách nhập khác và kiểm tra lại kết quả.',
  },
  {
    title: 'AutoCorrect',
    text:
      'AutoCorrect có ích rõ nhất với các công thức và phương trình phải gõ lặp lại. Sau khi thiết lập từ viết tắt, việc nhập nhanh hơn nhiều. Điểm bất tiện là danh sách mặc định khá dài và thiết lập nằm trên máy, nên em chụp thêm ảnh để làm minh chứng.',
  },
  {
    title: 'ChemFormatter',
    text:
      'Đây là công cụ làm em thấy hiệu quả rõ nhất trong phần viết công thức. Chỉ cần nhập công thức ở dạng thường rồi dùng ChemFormatter là chỉ số dưới và điện tích được xử lí rất nhanh, đỡ phải định dạng từng số bằng tay. Sau khi cài add-in vào Word, thao tác khá trực quan và tiết kiệm thời gian.',
  },
  {
    title: 'ChemDraw / Chem3D',
    text:
      'Phần 2D–3D cho em thấy công cụ chuyên dụng tiện hơn nhiều so với việc tự vẽ trong Word. Tuy nhiên em cũng gặp vài lỗi thực tế: đầu liên kết để trống trong ChemDraw có thể bị hiểu là carbon, khiến NH₃ bị nhận thành cấu trúc khác; Clean Up đôi lúc làm hình không như mong muốn; khi chuyển sang Chem3D có thể xuất hiện nguyên tử H rời nếu liên kết chưa đúng. Vì vậy em phải kiểm tra cấu trúc trước khi chuyển sang 3D.',
  },
  {
    title: 'Đưa sản phẩm 2D–3D vào Word',
    text:
      'Khi chèn hình 2D và 3D vào Word, ảnh lớn có thể làm bảng tự thay đổi kích thước. Em khắc phục bằng cách cố định độ rộng cột, tắt tự co giãn theo nội dung và chỉnh ảnh về cùng kích thước. Cách này giúp phần trình bày 2D bên trái – 3D bên phải gọn và dễ so sánh hơn.',
  },
  {
    title: 'PowerPoint',
    text:
      'Khi phân tích slide mẫu về tính chất hóa học của muối, em thấy việc có quá nhiều chữ, nhiều màu đỏ và phần trang trí chiếm diện tích làm nội dung khó theo dõi. Vì vậy khi chỉnh slide cần ưu tiên ý chính, căn lại các khối nội dung và chỉ dùng màu nhấn khi có mục đích.',
  },
];

const getPreviewUrl = (filePath: string) => {
  if (typeof window === 'undefined') return filePath;

  const absoluteUrl = new URL(filePath, window.location.origin).toString();
  const lowerPath = filePath.toLowerCase();

  if (lowerPath.endsWith('.docx') || lowerPath.endsWith('.pptx') || lowerPath.endsWith('.xlsx')) {
    return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(absoluteUrl)}`;
  }

  return absoluteUrl;
};

const evidenceItems = [
  {
    id: 'san-pham-1',
    label: 'Minh chứng 1 · Microsoft Word',
    title: 'Thực hành Equation và AutoCorrect',
    icon: Sigma,
    status: 'Đã hoàn thiện',
    description:
      'Biên soạn phương trình điện li, biểu thức tính toán, chuỗi chuyển hóa điều chế sulfuric acid và thiết lập AutoCorrect cho các cụm từ, công thức và phương trình Hóa học.',
    details: [
      'Dùng Equation để trình bày chỉ số, phân số, mũi tên phản ứng và điều kiện phản ứng.',
      'Thiết lập AutoCorrect cho từ viết tắt, công thức và phương trình thường dùng.',
      'Chèn ảnh minh chứng AutoCorrect để thể hiện thao tác đã thực hiện trên Word.',
    ],
    file: '/portfolio/hsht2/CHEM1441E_A14_HoTuanKiet.docx',
    fileLabel: 'Mở file Word sản phẩm',
  },
  {
    id: 'san-pham-2',
    label: 'Minh chứng 2 · Viết và vẽ công thức Hóa học',
    title: 'ChemFormatter và mô hình phân tử 2D–3D',
    icon: FlaskConical,
    status: 'Đã hoàn thiện',
    description:
      'Thực hành ChemFormatter trong Word và biểu diễn cấu trúc phân tử ở dạng 2D, 3D. Ở phần mô hình, em sử dụng ChemDraw và Chem3D để thực hiện chức năng tương đương với yêu cầu vẽ và quan sát cấu trúc.',
    details: [
      'Dùng ChemFormatter để định dạng H₂SO₄, Cu²⁺, NH₄⁺, PO₄³⁻ và các phương trình Hóa học.',
      'Dựng các cấu trúc 2D của NH₃, CO₂, CH₄ và CH₃COOH rồi chuyển sang Chem3D để quan sát mô hình không gian.',
      'Kiểm tra lại nguyên tử, liên kết và mô hình 3D trước khi chụp hoặc đưa vào Word.',
      'Trình bày ảnh 2D và 3D theo cặp để dễ so sánh.',
    ],
    file: '/portfolio/hsht2/CHEM1441E_A14_HoTuanKiet_Phan2.docx',
    fileLabel: 'Mở file Word sản phẩm',
  },
  {
    id: 'san-pham-3',
    label: 'Minh chứng 3 · PowerPoint',
    title: 'Rà soát và chỉnh sửa bài trình chiếu',
    icon: Presentation,
    status: 'Đã phân tích · đang thiết kế lại',
    description:
      'Phân tích slide mẫu dựa trên lượng chữ, bố cục, màu sắc, khoảng trắng và mức độ nhất quán; sau đó thiết kế lại để nội dung chính dễ quan sát hơn.',
    details: [
      'Giảm lượng chữ và làm rõ thứ bậc thông tin.',
      'Hạn chế màu nhấn và hiệu ứng không cần thiết.',
      'Giữ bản trước và sau chỉnh sửa để so sánh sự thay đổi.',
    ],
    file: null,
    fileLabel: null,
  },
  {
    id: 'san-pham-4',
    label: 'Minh chứng 4 · Văn bản kiểm tra',
    title: 'Đề kiểm tra và hướng dẫn chấm',
    icon: FileCheck2,
    status: 'Đang hoàn thiện',
    description:
      'Rà soát thể thức và nội dung của đề kiểm tra Hóa học, sửa lỗi trình bày rồi xây dựng hướng dẫn chấm trong cùng một văn bản.',
    details: [
      'Kiểm tra số trang, chính tả, danh pháp và định dạng công thức.',
      'Giữ cách trình bày điểm số và nội dung nhất quán.',
      'Gộp đề và hướng dẫn chấm, sau đó xuất PDF để kiểm tra lần cuối.',
    ],
    file: null,
    fileLabel: null,
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
                Em dùng trang này để lưu các bài thực hành của HSHT2 và ghi lại những lỗi gặp trong lúc làm.
              </p>

              <div className="flex flex-wrap gap-3">
                <Button asChild variant="hero">
                  <a href="#san-pham">
                    Xem minh chứng thực hành
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a href="#phan-hoi">Xem câu trả lời</a>
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
                ['#phan-hoi', 'Câu trả lời'],
                ['#trai-nghiem', 'Ghi chú'],
                ['#cong-cu', 'Công cụ'],
                ['#san-pham-1', 'Equation'],
                ['#san-pham-2', 'Công thức'],
                ['#san-pham-3', 'PowerPoint'],
                ['#san-pham-4', 'Đề & đáp án'],
                ['#tong-ket', 'Lần sau'],
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
            <div className="max-w-4xl mb-10">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-3">
                Câu trả lời của em
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-5">
                Cách em chọn công cụ sau các bài thực hành
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Sau khi làm các bài Word và công thức Hóa học, em thấy mỗi công cụ giải quyết một việc khá khác nhau.
                  Equation hợp với biểu thức và phương trình; AutoCorrect hợp với phần phải gõ lặp lại; ChemFormatter tiện
                  khi cần sửa nhanh chỉ số và điện tích. Với cấu trúc 2D–3D, dùng phần mềm Hóa học riêng dễ kiểm tra hơn.
                </p>
                <p>
                  Phần em phải kiểm tra kỹ nhất vẫn là nội dung Hóa học. Một chỉ số, điện tích hoặc liên kết sai
                  nhìn rất nhỏ nhưng làm công thức sai hẳn. Vì vậy em thường làm xong rồi đọc lại từng công thức trước
                  khi chỉnh phần trình bày.
                </p>
                <p>
                  Với PowerPoint, slide mẫu em đang sửa cho thấy khá rõ một vấn đề: chữ nhiều nhưng phần trang trí
                  bên phải lại chiếm diện tích lớn. Em đang thử bỏ bớt câu mô tả, chia lại các nhóm phản ứng và dùng màu
                  ít hơn để nội dung dễ nhìn khi trình chiếu.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
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

        <section id="trai-nghiem" className="scroll-mt-28 py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mb-10">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-3">
                Ghi chú khi làm bài
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Những chỗ em bị vướng
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Em ghi lại đúng những lỗi đã gặp để sau này không phải dò lại từ đầu.
              </p>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {experienceItems.map((item) => (
                <article key={item.title} className="rounded-2xl border bg-card p-6 md:p-7">
                  <h3 className="font-display text-xl font-bold text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="cong-cu" className="scroll-mt-28 py-16 md:py-24 bg-card border-y">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mb-12">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-3">
                Công cụ đã dùng
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Em dùng từng công cụ vào đâu?
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Phần này chỉ ghi ngắn công cụ nào em đã dùng và dùng ở bước nào.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <article key={tool.name} className="rounded-2xl border bg-background p-6 card-hover">
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

        <section id="san-pham" className="scroll-mt-28 py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-12">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-3">
                  Minh chứng thực hành
                </p>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  File bài thực hành
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Các file bên dưới là bài em đã làm và nộp trong phần này.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Upload className="h-4 w-4" />
                2 sản phẩm hoàn thiện · các phần còn lại đang tiếp tục
              </div>
            </div>

            <div className="space-y-8">
              {evidenceItems.map((item) => {
                const Icon = item.icon;
                return (
                  <article
                    id={item.id}
                    key={item.id}
                    className="scroll-mt-28 rounded-2xl border bg-card overflow-hidden shadow-sm"
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
                      <div className="rounded-2xl border bg-background min-h-52 flex items-center justify-center">
                        <div className="text-center p-8">
                          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                            <Icon className="h-8 w-8" />
                          </div>
                          <p className="font-semibold text-foreground">{item.title}</p>
                          {item.file ? (
                            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                              <Button asChild variant="outline">
                                <a href={getPreviewUrl(item.file)} target="_blank" rel="noreferrer">
                                  <Eye className="h-4 w-4" />
                                  Xem trước
                                </a>
                              </Button>
                              <Button asChild variant="ghost" size="sm">
                                <a href={item.file} download>
                                  <Download className="h-4 w-4" />
                                  Tải file
                                </a>
                              </Button>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground mt-2">
                              Ảnh hoặc file sản phẩm sẽ được bổ sung sau khi hoàn thiện.
                            </p>
                          )}
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

        <section id="tong-ket" className="scroll-mt-28 py-16 md:py-24 bg-card border-y">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-8">
              <article className="rounded-2xl border bg-background p-7 md:p-9">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                  <Lightbulb className="h-5 w-5" />
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  Cách em sẽ làm ở những bài sau
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Sau các bài vừa làm, em sẽ không cố dùng một công cụ cho mọi trường hợp. Công thức lặp lại thì
                  dùng AutoCorrect, biểu thức khó thì dùng Equation, chỉ số và điện tích cần sửa nhanh thì dùng ChemFormatter.
                  Với cấu trúc phân tử, em sẽ kiểm tra kỹ trong ChemDraw trước khi chuyển sang Chem3D.
                </p>
              </article>

              <article className="rounded-2xl border bg-background p-7 md:p-9">
                <div className="w-11 h-11 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-5">
                  <Wrench className="h-5 w-5" />
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  File dự phòng
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Khi hoàn thiện hồ sơ, em giữ file gốc và thêm bản PDF để tránh lỗi font hoặc bố cục khi mở trên máy khác.
                  Với hình 2D–3D, em cũng giữ ảnh đã xuất sẵn để không phải phụ thuộc vào việc mở lại phần mềm lúc trình bày.
                </p>
              </article>
            </div>

            <article className="mt-8 rounded-2xl border bg-background p-7 md:p-9">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-3">
                Tài liệu tham khảo
              </p>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                Nguồn em sử dụng để đối chiếu khi thực hiện HSHT2
              </h2>
              <ul className="space-y-2 text-muted-foreground leading-relaxed">
                <li>• Tài liệu đọc CHEM1441 – Nội dung 3: Ứng dụng ICT để biên soạn văn bản.</li>
                <li>• Tài liệu đọc CHEM1441 – Nội dung 4: Ứng dụng ICT để thiết kế bài trình chiếu.</li>
                <li>• Các file bài tập và slide mẫu được cung cấp trong hoạt động học của HSHT2.</li>
              </ul>
            </article>
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
