import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Atom,
  BarChart3,
  Beaker,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  FlaskConical,
  Gauge,
  Lightbulb,
  Microscope,
  Sigma,
  Wrench,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Chem1441Subnav } from '@/components/Chem1441Subnav';

const roles = [
  {
    title: 'Quan sát những phần khó thấy trực tiếp',
    text: 'Mô phỏng giúp em chuyển một số nội dung khó quan sát thành mô hình có thể xoay, thay đổi góc nhìn hoặc theo dõi trên đồ thị.',
    icon: Microscope,
  },
  {
    title: 'Thử lại và thay đổi điều kiện',
    text: 'Có thể lặp lại thí nghiệm, thay đổi thông số rồi so sánh kết quả. Cách này phù hợp với các hoạt động yêu cầu học sinh dự đoán và kiểm chứng.',
    icon: Gauge,
  },
  {
    title: 'Hỗ trợ khi thí nghiệm thật khó tổ chức',
    text: 'Với thí nghiệm mất thời gian, khó chuẩn bị hoặc cần quan sát nhiều lần, mô phỏng là một phương án hỗ trợ để học sinh vẫn có dữ liệu và hiện tượng để xử lí.',
    icon: FlaskConical,
  },
];

const tools = [
  {
    name: 'Yenka',
    icon: Beaker,
    use: 'Thiết kế và chạy thí nghiệm Hóa học ảo; lựa chọn hóa chất, dụng cụ, thay đổi thông số và quan sát hiện tượng trong một hệ thí nghiệm hoàn chỉnh.',
    task: 'Điều chế CO₂ và dẫn khí CO₂ vào nước vôi trong',
    evidence:
      'Cho CaCO₃ tác dụng với dung dịch HCl trong bình tam giác, dẫn khí sinh ra qua dung dịch Ca(OH)₂ và quan sát hiện tượng. Hoạt động có thể dùng trong Hóa học 12, chủ đề Nguyên tố nhóm IA và nhóm IIA, khi học sinh tìm hiểu tương tác của muối carbonate với acid loãng. Giáo viên cho học sinh dự đoán hiện tượng, chạy mô phỏng, nhận biết khí sinh ra bằng nước vôi trong rồi viết phương trình hóa học.',
    status: 'Đã thực hiện · chờ chèn ảnh',
  },
  {
    name: 'MolView',
    icon: Atom,
    use: 'Dựng và quan sát cấu trúc phân tử ở dạng 3D; phù hợp để xem hình học phân tử và lấy số đo cấu trúc khi dùng bản có Jmol.',
    task: 'Đo cấu trúc phân tử NH₃',
    evidence:
      'Dựng NH₃, tối ưu hình học rồi đo một liên kết N–H và một góc H–N–H. Chụp ảnh mô hình 3D có số đo và ghi lại giá trị để dùng làm minh chứng.',
    status: 'Đang thực hiện',
  },
  {
    name: 'MOPAC / PM7',
    icon: Sigma,
    use: 'Tối ưu cấu trúc và lấy các đại lượng tính toán bán thực nghiệm bằng phương pháp PM7.',
    task: 'Tính cấu trúc và enthalpy phản ứng bằng PM7',
    evidence:
      'Tính cho H₂, O₂, H₂O, F₂ và HF; lưu độ dài liên kết, góc H–O–H và FINAL HEAT OF FORMATION. Từ đó tính ΔH cho O₂ + 2H₂ → 2H₂O và F₂ + H₂ → 2HF, rồi so sánh kết quả.',
    status: 'Đang thực hiện',
  },
];

const checklist = [
  ['Vai trò của ICT', 'Đã có khung 3 ý để tiếp tục phân tích'],
  ['Công cụ mô phỏng', 'Yenka · MolView · MOPAC'],
  ['Sản phẩm thực hành', 'Đang làm 3 minh chứng tương ứng'],
  ['Đánh giá & đề xuất', 'Đã có phần ghi chú ban đầu, sẽ chốt sau khi làm xong'],
  ['Kiểm tra đánh giá', 'Sẽ bổ sung sau HĐ24–26'],
];

export default function Chem1441Hsht3() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Chem1441Subnav />

      <main className="[&_p]:text-left [&_li]:text-left md:[&_p]:text-justify md:[&_li]:text-justify">
        <section className="py-16 md:py-24 border-b bg-card">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-semibold text-primary mb-6">
                <BookOpen className="h-4 w-4" />
                Hồ sơ học tập 3 · CHEM1441
              </div>
              <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-tight mb-6">
                Mô phỏng Hóa học và <span className="text-gradient">kiểm tra đánh giá</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed mb-8">
                Trang này đang được hoàn thiện theo tiến trình học phần. Phần mô phỏng đã có khung nội dung và ba nhiệm vụ thực hành; phần kiểm tra đánh giá sẽ bổ sung sau HĐ24–26.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="hero">
                  <a href="#nhiem-vu">
                    Xem 3 nhiệm vụ thực hành
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a href="#tien-do">Xem tiến độ HSHT3</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 md:py-18">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-5">
              <a
                href="#vai-tro"
                className="group rounded-3xl border bg-card p-7 md:p-8 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Đi đến phần mô phỏng của HSHT3"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Microscope className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Câu hỏi 1 · Mô phỏng</p>
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground leading-snug">
                  Làm thế nào để thiết kế và sử dụng mô phỏng hiệu quả trong dạy học môn Hóa học?
                </h2>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  Xem phần mô phỏng
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </a>

              <a
                href="#ktdg"
                className="group rounded-3xl border bg-card p-7 md:p-8 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Đi đến phần kiểm tra đánh giá của HSHT3"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <ClipboardCheck className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Câu hỏi 2 · Kiểm tra đánh giá</p>
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground leading-snug">
                  Làm thế nào để ứng dụng ICT hiệu quả trong kiểm tra đánh giá môn Hóa học?
                </h2>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  Xem phần kiểm tra đánh giá
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </a>
            </div>
          </div>
        </section>

        <nav className="sticky top-16 z-40 border-y bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-center gap-2 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {[
                ['#vai-tro', 'Vai trò'],
                ['#cong-cu', 'Công cụ'],
                ['#nhiem-vu', '3 nhiệm vụ'],
                ['#danh-gia', 'Đánh giá'],
                ['#ktdg', 'Kiểm tra đánh giá'],
                ['#tien-do', 'Tiến độ'],
              ].map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  className="shrink-0 rounded-full border bg-card px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </nav>

        <section id="vai-tro" className="scroll-mt-28 py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-2">Phần 1 · Mô phỏng</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Em thấy mô phỏng hữu ích ở đâu?
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-3xl mb-8">
                Đây là ba vai trò em sẽ dùng làm khung trả lời cho HSHT3. Sau khi hoàn thành từng bài thực hành, em sẽ bổ sung ví dụ cụ thể từ chính sản phẩm của mình.
              </p>

              <div className="grid md:grid-cols-3 gap-5">
                {roles.map((item) => {
                  const Icon = item.icon;
                  return (
                    <article key={item.title} className="rounded-2xl border bg-card p-6">
                      <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-display text-xl font-bold text-foreground mb-3">{item.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="cong-cu" className="scroll-mt-28 py-16 md:py-24 bg-card border-y">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-2">Công cụ đã học / đang thực hành</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">
                Yenka · MolView · MOPAC
              </h2>

              <div className="grid lg:grid-cols-3 gap-5">
                {tools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <article key={tool.name} className="rounded-2xl border bg-background p-6">
                      <div className="flex items-center justify-between gap-4 mb-5">
                        <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-semibold rounded-full border px-3 py-1.5 text-muted-foreground">
                          {tool.status}
                        </span>
                      </div>
                      <h3 className="font-display text-2xl font-bold text-foreground mb-3">{tool.name}</h3>
                      <p className="text-muted-foreground leading-relaxed">{tool.use}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="nhiem-vu" className="scroll-mt-28 py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-2">Minh chứng thực hành</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Ba nhiệm vụ cần hoàn thành
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-3xl mb-8">
                Mỗi nhiệm vụ sẽ tạo ra một minh chứng riêng. Khi có ảnh hoặc file kết quả, em sẽ đưa trực tiếp vào đúng thẻ bên dưới.
              </p>

              <div className="space-y-6">
                {tools.map((tool, index) => {
                  const Icon = tool.icon;
                  return (
                    <article key={tool.name} className="rounded-3xl border bg-card overflow-hidden shadow-sm">
                      <div className="p-6 md:p-8 border-b">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                              <Icon className="h-6 w-6" />
                            </div>
                            <div>
                              <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary mb-1">
                                Nhiệm vụ {index + 1} · {tool.name}
                              </p>
                              <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground">{tool.task}</h3>
                            </div>
                          </div>
                          <span className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                            <Wrench className="h-4 w-4" />
                            {tool.status}
                          </span>
                        </div>
                      </div>

                      <div className="p-6 md:p-8 grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
                        <div>
                          <h4 className="font-display text-lg font-bold text-foreground mb-3">Cần làm</h4>
                          <p className="text-muted-foreground leading-relaxed">{tool.evidence}</p>
                        </div>
                        <div className="rounded-2xl border border-dashed bg-muted/30 p-5">
                          <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                            <BarChart3 className="h-4 w-4" />
                            Minh chứng sẽ bổ sung
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Ảnh màn hình kết quả, số liệu chính và ghi chú ngắn về cách có thể dùng sản phẩm này trong một hoạt động dạy học.
                          </p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="danh-gia" className="scroll-mt-28 py-16 md:py-24 bg-card border-y">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-2">Ghi chú ban đầu</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">
                Mỗi công cụ phù hợp với một việc khác nhau
              </h2>

              <div className="grid lg:grid-cols-3 gap-5">
                <article className="rounded-2xl border bg-background p-6">
                  <h3 className="font-display text-xl font-bold text-foreground mb-3">Yenka</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Phù hợp khi cần dựng một hệ thí nghiệm có nhiều dụng cụ và hóa chất. Ở bài điều chế CO₂, em phải tự bố trí bình phản ứng, nút, ống dẫn khí và cốc nước vôi trong. Phần mềm giúp quan sát được toàn bộ quá trình, nhưng lúc đầu việc tìm đúng dụng cụ và sắp xếp hệ thống mất khá nhiều thời gian.
                  </p>
                </article>
                <article className="rounded-2xl border bg-background p-6">
                  <h3 className="font-display text-xl font-bold text-foreground mb-3">MolView</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Nhanh ở phần dựng và xoay mô hình 3D. Khi cần lấy số đo cấu trúc, em phải chú ý phiên bản đang dùng vì giao diện mới và bản Jmol không có cùng chức năng.
                  </p>
                </article>
                <article className="rounded-2xl border bg-background p-6">
                  <h3 className="font-display text-xl font-bold text-foreground mb-3">MOPAC / PM7</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Cho kết quả định lượng sâu hơn MolView, nhưng cần đọc đúng đại lượng trong output và hiểu rằng PM7 là phương pháp tính gần đúng. Phần so sánh với dữ liệu tham khảo sẽ giúp em thấy giới hạn của kết quả tính toán.
                  </p>
                </article>
              </div>

              <div className="rounded-2xl border bg-primary/5 p-6 mt-6">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <p className="text-muted-foreground leading-relaxed">
                    Sau khi làm xong ba nhiệm vụ, phần này sẽ được viết lại bằng chính số liệu và lỗi em gặp trong quá trình thao tác. Em sẽ giữ lại điểm mạnh, điểm hạn chế và một đề xuất sử dụng cụ thể cho từng công cụ.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="ktdg" className="scroll-mt-28 py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto rounded-3xl border bg-card p-7 md:p-9">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                  <ClipboardCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-2">Phần 2 · Kiểm tra đánh giá</p>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
                    Sẽ bổ sung sau HĐ24–26
                  </h2>
                  <p className="text-muted-foreground leading-relaxed max-w-3xl">
                    Phần này sẽ gồm vai trò của ICT trong kiểm tra đánh giá, các công cụ đã thực hành, sản phẩm minh chứng và đánh giá sau khi sử dụng. Em chưa điền trước để tránh ghi những công cụ mình chưa thực sự thao tác trong học phần.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="tien-do" className="scroll-mt-28 py-16 md:py-24 bg-card border-t">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-2">Theo rubric HSHT3</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">Tiến độ hiện tại</h2>

              <div className="grid md:grid-cols-2 gap-4">
                {checklist.map(([title, status]) => (
                  <div key={title} className="rounded-2xl border bg-background p-5 flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <div className="font-semibold text-foreground mb-1">{title}</div>
                      <div className="text-sm text-muted-foreground">{status}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="outline">
                  <Link to="/chem1441">
                    Quay về tổng quan CHEM1441
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
