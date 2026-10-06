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
    name: 'MOPAC',
    icon: Sigma,
    text: 'Chương trình tính toán hóa học bán thực nghiệm. Trong bài thực hành, em dùng PM7 để tối ưu hình học phân tử, lấy heat of formation và tính enthalpy cho hai phản ứng được giao trên VLE.',
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
                ['#molview', 'Minh chứng MolView'],
                ['#mopac', 'Minh chứng MOPAC'],
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
                      Em chọn thí nghiệm này vì có thể tự dựng toàn bộ hệ dụng cụ trên Yenka và có hai hiện tượng nối tiếp nhau:
                      tạo khí CO₂ từ muối carbonate và dùng nước vôi trong để kiểm tra khí sinh ra. Sản phẩm dưới đây được trình bày
                      theo đúng ba nội dung mà nhiệm vụ trên VLE yêu cầu.
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
                <section className="mb-10">
                  <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary mb-5">
                    Trả lời nhiệm vụ trên VLE
                  </p>

                  <div className="space-y-5">
                    <div className="rounded-2xl border bg-background p-6 md:p-7">
                      <div className="flex items-start gap-4">
                        <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">1</div>
                        <div>
                          <h3 className="font-display text-xl font-bold text-foreground mb-2">Tên thí nghiệm ảo</h3>
                          <p className="text-muted-foreground leading-relaxed">
                            Điều chế khí carbon dioxide từ calcium carbonate và hydrochloric acid, sau đó dẫn khí CO₂ vào nước vôi trong.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border bg-background p-6 md:p-7">
                      <div className="flex items-start gap-4">
                        <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">2</div>
                        <div className="min-w-0">
                          <h3 className="font-display text-xl font-bold text-foreground mb-3">Bố trí và cách tiến hành</h3>
                          <p className="text-muted-foreground leading-relaxed mb-4">
                            Hệ dụng cụ gồm một bình tam giác có nút cao su một lỗ, ống mềm nối với ống dẫn khí và một cốc chứa nước vôi trong.
                            Ở lần chạy dùng làm minh chứng, em đặt 2 g CaCO₃ trong bình tam giác, dùng 40 cm³ HCl 1 M và chuẩn bị
                            200 cm³ dung dịch Ca(OH)₂ 0,01 M ở cốc nhận khí.
                          </p>
                          <p className="text-muted-foreground leading-relaxed">
                            Sau khi hoàn chỉnh đường dẫn khí, em cho HCl tiếp xúc với CaCO₃ để tạo CO₂. Khí đi qua ống dẫn và sục vào
                            dung dịch Ca(OH)₂. Em quan sát sự thay đổi trong bình phản ứng và ở cốc nước vôi, đồng thời mở phần thông tin
                            phản ứng của Yenka để kiểm tra các chất được phần mềm ghi nhận.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border bg-background p-6 md:p-7">
                      <div className="flex items-start gap-4">
                        <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">3</div>
                        <div>
                          <h3 className="font-display text-xl font-bold text-foreground mb-3">Nội dung dạy học có thể áp dụng</h3>
                          <p className="text-muted-foreground leading-relaxed mb-4">
                            Hoạt động phù hợp với Hóa học 12, phần nguyên tố nhóm IA và nhóm IIA, khi học sinh tìm hiểu tính chất của
                            một số hợp chất nhóm IIA. Yêu cầu cần đạt được khai thác trực tiếp là:
                          </p>
                          <div className="rounded-xl border bg-primary/5 px-5 py-4 font-semibold text-foreground">
                            “Nêu được tương tác giữa muối carbonate với nước và với acid loãng.”
                          </div>
                          <p className="text-muted-foreground leading-relaxed mt-4">
                            Phản ứng CaCO₃ với HCl là nội dung chính để đáp ứng yêu cầu này. Bước dẫn CO₂ vào nước vôi trong được dùng
                            như một cách kiểm tra sản phẩm khí, nhờ đó học sinh không chỉ nhìn thấy khí thoát ra mà còn có căn cứ để xác định đó là CO₂.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

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
                      <span className="font-semibold text-foreground">Hình 1.</span> Bố trí hệ thí nghiệm trước khi cho các chất phản ứng.
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
                      <span className="font-semibold text-foreground">Hình 2.</span> Trạng thái hệ thí nghiệm sau khi CO₂ được dẫn sang cốc nước vôi.
                    </figcaption>
                  </figure>
                </div>

                <section className="mb-10">
                  <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary mb-5">
                    Phân tích kết quả
                  </p>

                  <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-6">
                    <div className="rounded-2xl border bg-background p-6 md:p-7">
                      <h3 className="font-display text-2xl font-bold text-foreground mb-4">Cơ sở hóa học</h3>
                      <div className="space-y-4">
                        <div className="rounded-xl bg-muted/40 p-4">
                          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Tạo CO₂</div>
                          <p className="font-medium text-foreground">CaCO₃ + 2HCl → CaCl₂ + CO₂↑ + H₂O</p>
                        </div>
                        <div className="rounded-xl bg-muted/40 p-4">
                          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Nhận biết CO₂</div>
                          <p className="font-medium text-foreground">CO₂ + Ca(OH)₂ → CaCO₃↓ + H₂O</p>
                        </div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed mt-5">
                        Khi HCl tiếp xúc với CaCO₃, khí được tạo ra và đi theo ống dẫn sang cốc nhận. Trong nước vôi trong,
                        CO₂ phản ứng với Ca(OH)₂ tạo CaCO₃ ít tan. Đây là cơ sở của hiện tượng vẩn đục dùng để nhận biết khí.
                      </p>
                    </div>

                    <div className="rounded-2xl border bg-background p-6 md:p-7">
                      <h3 className="font-display text-2xl font-bold text-foreground mb-4">Nhìn lại lượng hóa chất đã dùng</h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        2 g CaCO₃ tương ứng gần 0,020 mol, còn 40 cm³ HCl 1 M là 0,040 mol. Hai lượng này gần đúng tỉ lệ
                        1 : 2 của phương trình nên phần tạo CO₂ được bố trí khá hợp lí.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        Tuy nhiên 200 cm³ Ca(OH)₂ 0,01 M chỉ có 0,002 mol Ca(OH)₂, nhỏ hơn nhiều so với lượng CO₂ có thể tạo ra.
                        Về mặt hóa học, nếu tiếp tục sục CO₂ dư thì kết tủa CaCO₃ có thể tiếp tục phản ứng tạo hydrogencarbonate tan.
                        Nếu dùng mô phỏng này trong tiết học, em sẽ giảm lượng chất tạo CO₂ hoặc tăng nồng độ nước vôi trong để học sinh
                        quan sát giai đoạn xuất hiện kết tủa rõ hơn và tránh kéo dài quá trình sục khí.
                      </p>
                    </div>
                  </div>
                </section>

                <section className="mb-10">
                  <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary mb-5">
                    Cách em dự kiến tổ chức hoạt động học
                  </p>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="rounded-2xl border bg-background p-6">
                      <div className="text-sm font-bold text-primary mb-2">Trước khi chạy mô phỏng</div>
                      <p className="text-muted-foreground leading-relaxed">
                        Giáo viên chưa nói trước khí tạo thành. Học sinh dự đoán hiện tượng khi cho CaCO₃ vào HCl và nêu cách kiểm tra
                        khí nếu có. Các dự đoán được ghi nhanh trước khi mở mô phỏng.
                      </p>
                    </div>
                    <div className="rounded-2xl border bg-background p-6">
                      <div className="text-sm font-bold text-primary mb-2">Trong khi quan sát</div>
                      <p className="text-muted-foreground leading-relaxed">
                        Học sinh theo dõi hai vị trí: bình tạo khí và cốc nước vôi. Giáo viên có thể dừng mô phỏng ngay sau khi khí bắt đầu
                        đi qua cốc để yêu cầu học sinh mô tả hiện tượng thay vì chỉ xem liên tục.
                      </p>
                    </div>
                    <div className="rounded-2xl border bg-background p-6">
                      <div className="text-sm font-bold text-primary mb-2">Sau mô phỏng</div>
                      <p className="text-muted-foreground leading-relaxed">
                        Học sinh đối chiếu dự đoán ban đầu, xác định khí CO₂, viết hai phương trình hóa học và giải thích vì sao nước vôi
                        trong thay đổi. Nếu kết quả khác dự đoán, nhóm phải chỉ ra chỗ cần sửa.
                      </p>
                    </div>
                    <div className="rounded-2xl border bg-background p-6">
                      <div className="text-sm font-bold text-primary mb-2">Vai trò của giáo viên</div>
                      <p className="text-muted-foreground leading-relaxed">
                        Yenka chỉ cung cấp hiện tượng và dữ liệu của mô hình. Giáo viên vẫn cần đặt câu hỏi, kiểm soát thời điểm quan sát
                        và yêu cầu học sinh giải thích. Nếu chỉ chiếu mô phỏng rồi đọc kết luận thì lợi thế tương tác của công cụ gần như bị bỏ phí.
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary mb-5">
                    Đánh giá Yenka sau khi sử dụng
                  </p>

                  <div className="grid lg:grid-cols-3 gap-5">
                    <div className="rounded-2xl border bg-background p-6">
                      <h3 className="font-display text-xl font-bold text-foreground mb-3">Điểm hữu ích</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Em có thể tự chọn lượng hóa chất, tự bố trí bình phản ứng và đường dẫn khí. Với bài này, học sinh nhìn được mối liên hệ
                        giữa nơi tạo khí và nơi kiểm tra khí rõ hơn so với một hình vẽ tĩnh trong sách.
                      </p>
                    </div>

                    <div className="rounded-2xl border bg-background p-6">
                      <h3 className="font-display text-xl font-bold text-foreground mb-3">Khó khăn khi thao tác</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Lúc dựng hệ thí nghiệm, em thử đưa ống mềm trực tiếp xuống cốc nhưng Yenka không cho nối theo cách đó. Sau đó em phải
                        tìm đúng Delivery tube, đặt nó vào cốc rồi mới nối ống mềm ở phía trên. Thư viện hóa chất cũng chưa thật sự phong phú;
                        có những chất em muốn dùng nhưng không có sẵn hoặc khó tìm đúng tên trong danh mục. Giao diện khá cũ, nhiều mục và cửa sổ
                        thông tin nằm rời rạc nên thao tác ban đầu không trực quan, nhất là khi phải tìm dụng cụ, nối các bộ phận và sắp xếp lại màn hình.
                      </p>
                    </div>

                    <div className="rounded-2xl border bg-background p-6">
                      <h3 className="font-display text-xl font-bold text-foreground mb-3">Cách dùng hiệu quả hơn</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Trước giờ học nên dựng sẵn hệ cơ bản và kiểm tra lượng hóa chất. Khi dạy, chỉ để những cửa sổ thông tin cần thiết,
                        cho học sinh dự đoán trước rồi mới chạy mô phỏng. Cách này giảm thời gian thao tác nhưng vẫn giữ được phần học sinh phải quan sát và suy luận.
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </article>
          </div>
        </section>

        <section id="molview" className="scroll-mt-28 py-16 md:py-24 bg-card border-y">
          <div className="container mx-auto px-6">
            <article className="max-w-6xl mx-auto rounded-[2rem] border bg-background overflow-hidden shadow-sm">
              <header className="p-7 md:p-10 border-b">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="max-w-3xl">
                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary mb-3">
                      Minh chứng thực hành · MolView
                    </p>
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">
                      Quan sát hình học phân tử NH₃ bằng mô hình 3D
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      MolView được dùng ở đây để chuyển từ biểu diễn công thức trên mặt phẳng sang mô hình phân tử có thể xoay trong không gian.
                      Với NH₃, phần quan sát 3D giúp học sinh nhìn rõ cách ba nguyên tử hydrogen sắp xếp quanh nitrogen thay vì chỉ dựa vào hình vẽ tĩnh.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm shrink-0">
                    <div className="rounded-xl border bg-card px-4 py-3">
                      <div className="text-xs text-muted-foreground mb-1">Môn / lớp</div>
                      <div className="font-semibold text-foreground">Hóa học 11</div>
                    </div>
                    <div className="rounded-xl border bg-card px-4 py-3">
                      <div className="text-xs text-muted-foreground mb-1">Công cụ</div>
                      <div className="font-semibold text-foreground">MolView</div>
                    </div>
                  </div>
                </div>
              </header>

              <div className="p-7 md:p-10">
                <section className="mb-10">
                  <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary mb-5">
                    Nội dung dạy học được lựa chọn
                  </p>

                  <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-6">
                    <div className="rounded-2xl border bg-card p-6 md:p-7">
                      <h3 className="font-display text-2xl font-bold text-foreground mb-3">
                        Ammonia và một số hợp chất ammonium
                      </h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Nội dung này thuộc mạch Nitrogen và Sulfur của Hóa học 11. Phần MolView tập trung vào cấu trúc phân tử ammonia,
                        không mở rộng sang toàn bộ tính chất của NH₃.
                      </p>
                      <div className="rounded-xl border bg-primary/5 px-5 py-4">
                        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                          Yêu cầu cần đạt
                        </div>
                        <div className="font-semibold text-foreground">
                          “Mô tả được công thức Lewis và hình học của phân tử ammonia.”
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border bg-card p-6 md:p-7">
                      <h3 className="font-display text-2xl font-bold text-foreground mb-3">
                        Vì sao dùng mô hình 3D?
                      </h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Công thức Lewis cho biết cách các nguyên tử liên kết và cặp electron chưa liên kết trên nitrogen, nhưng bản thân hình vẽ 2D
                        chưa thể hiện rõ dạng không gian của phân tử. Mô hình 3D giúp học sinh xoay phân tử và nhận ra NH₃ có dạng chóp tam giác.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        Vì vậy MolView phù hợp nhất ở bước kiểm tra hoặc củng cố dự đoán của học sinh sau khi đã viết công thức Lewis, thay vì dùng
                        mô hình để thay thế hoàn toàn phần suy luận cấu trúc.
                      </p>
                    </div>
                  </div>
                </section>

                <section className="mb-10">
                  <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary mb-5">
                    Cách em dự kiến tổ chức hoạt động học
                  </p>

                  <div className="grid md:grid-cols-3 gap-5">
                    <div className="rounded-2xl border bg-card p-6">
                      <div className="text-sm font-bold text-primary mb-2">1. Dự đoán</div>
                      <p className="text-muted-foreground leading-relaxed">
                        Học sinh viết công thức Lewis của NH₃ và dự đoán cách ba liên kết N–H sắp xếp trong không gian. Giáo viên chưa cho xem mô hình ngay.
                      </p>
                    </div>

                    <div className="rounded-2xl border bg-card p-6">
                      <div className="text-sm font-bold text-primary mb-2">2. Quan sát trên MolView</div>
                      <p className="text-muted-foreground leading-relaxed">
                        Học sinh mở NH₃ trên MolView, chuyển sang mô hình 3D và xoay phân tử theo nhiều hướng. Khi xoay, học sinh chú ý vị trí tương đối
                        của nitrogen và ba hydrogen thay vì chỉ nhìn một góc cố định.
                      </p>
                    </div>

                    <div className="rounded-2xl border bg-card p-6">
                      <div className="text-sm font-bold text-primary mb-2">3. Đối chiếu</div>
                      <p className="text-muted-foreground leading-relaxed">
                        Học sinh so sánh mô hình với dự đoán ban đầu, mô tả hình học của NH₃ là chóp tam giác và ghi lại bằng lời hoặc phác lại mô hình.
                      </p>
                    </div>
                  </div>
                </section>

                <section className="mb-10">
                  <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary mb-5">
                    Minh chứng thao tác trên MolView
                  </p>

                  <div className="grid lg:grid-cols-2 gap-6">
                    <figure className="rounded-2xl border bg-card overflow-hidden">
                      <div className="aspect-[16/10] bg-muted/30 flex items-center justify-center overflow-hidden">
                        <img
                          src="/portfolio/hsht3/molview-nh3-overview.png"
                          alt="Giao diện MolView hiển thị công thức NH3 và mô hình phân tử 3D"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <figcaption className="border-t px-5 py-4 text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">Hình 3.</span> Công thức NH₃ và mô hình 3D được hiển thị đồng thời trên MolView.
                      </figcaption>
                    </figure>

                    <figure className="rounded-2xl border bg-card overflow-hidden">
                      <div className="aspect-[16/10] bg-muted/30 flex items-center justify-center overflow-hidden">
                        <img
                          src="/portfolio/hsht3/molview-nh3-rotated.png"
                          alt="Mô hình NH3 được xoay trên MolView để quan sát hình học phân tử"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <figcaption className="border-t px-5 py-4 text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">Hình 4.</span> Xoay mô hình NH₃ để quan sát rõ hơn sự sắp xếp không gian của ba liên kết N–H.
                      </figcaption>
                    </figure>
                  </div>
                </section>

                <section className="mb-10">
                  <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary mb-5">
                    Phân tích sản phẩm
                  </p>

                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="rounded-2xl border bg-card p-6 md:p-7">
                      <h3 className="font-display text-2xl font-bold text-foreground mb-4">Điểm cần học sinh nhìn ra</h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Ở mô hình 3D, nitrogen nằm ở vị trí trung tâm và ba hydrogen hướng ra ba phía khác nhau. Khi xoay mô hình, có thể thấy ba liên kết
                        không cùng nằm trên một mặt phẳng theo kiểu tam giác phẳng.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        Từ quan sát đó, học sinh mô tả được hình học chóp tam giác của NH₃. Kết quả quan sát được dùng để đối chiếu với công thức Lewis,
                        trong đó nitrogen còn một cặp electron chưa liên kết.
                      </p>
                    </div>

                    <div className="rounded-2xl border bg-card p-6 md:p-7">
                      <h3 className="font-display text-2xl font-bold text-foreground mb-4">Vai trò của MolView trong hoạt động</h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Phần mềm không làm thay bước suy luận cấu trúc. Giá trị chính của nó nằm ở việc cho học sinh kiểm tra dự đoán bằng một mô hình có thể xoay,
                        nhờ vậy sự khác nhau giữa hình vẽ 2D và hình dạng không gian trở nên rõ hơn.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        Nếu chỉ mở sẵn mô hình rồi cho học sinh chép “chóp tam giác”, hoạt động sẽ rất nhanh nhưng không khai thác được ưu thế tương tác của công cụ.
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary mb-5">
                    Đánh giá MolView sau khi sử dụng
                  </p>

                  <div className="grid lg:grid-cols-3 gap-5">
                    <div className="rounded-2xl border bg-card p-6">
                      <h3 className="font-display text-xl font-bold text-foreground mb-3">Điểm thuận lợi</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        MolView mở trực tiếp trên trình duyệt, tìm phân tử nhanh và hiển thị song song phần công thức với mô hình 3D. Việc xoay mô hình bằng chuột
                        khá trực quan nên phù hợp với một hoạt động quan sát ngắn trên lớp.
                      </p>
                    </div>

                    <div className="rounded-2xl border bg-card p-6">
                      <h3 className="font-display text-xl font-bold text-foreground mb-3">Điểm còn hạn chế</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Giao diện bản mới đơn giản hơn nhưng một số công cụ nâng cao không nằm ở vị trí giống tài liệu hướng dẫn cũ. Nếu mục tiêu là đo góc,
                        độ dài liên kết hoặc khai thác Jmol thì người dùng có thể mất thời gian tìm đúng chức năng.
                      </p>
                    </div>

                    <div className="rounded-2xl border bg-card p-6">
                      <h3 className="font-display text-xl font-bold text-foreground mb-3">Cách dùng hiệu quả hơn</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Với bài NH₃, chỉ cần dùng chức năng 3D và thao tác xoay là đủ cho mục tiêu hình học phân tử. Giáo viên nên chuẩn bị sẵn đường dẫn hoặc từ khóa,
                        yêu cầu học sinh dự đoán trước rồi mới mở mô hình để tránh biến hoạt động thành xem minh họa đơn thuần.
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </article>
          </div>
        </section>

        <section id="mopac" className="scroll-mt-28 py-16 md:py-24">
          <div className="container mx-auto px-6">
            <article className="max-w-6xl mx-auto rounded-[2rem] border bg-card overflow-hidden shadow-sm">
              <header className="p-7 md:p-10 border-b">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="max-w-3xl">
                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary mb-3">
                      Minh chứng thực hành · MOPAC
                    </p>
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">
                      Tối ưu cấu trúc và tính enthalpy bằng phương pháp PM7
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Em cài OpenMOPAC 23.2.5 trên Windows và chạy các file đầu vào bằng dòng lệnh. Theo nhiệm vụ trên VLE,
                      em tính riêng H₂, O₂, H₂O, F₂ và HF, lấy cấu trúc sau tối ưu cùng giá trị FINAL HEAT OF FORMATION,
                      sau đó dùng các giá trị PM7 này để tính enthalpy của hai phản ứng.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm shrink-0">
                    <div className="rounded-xl border bg-background px-4 py-3">
                      <div className="text-xs text-muted-foreground mb-1">Phương pháp</div>
                      <div className="font-semibold text-foreground">PM7 · PRECISE</div>
                    </div>
                    <div className="rounded-xl border bg-background px-4 py-3">
                      <div className="text-xs text-muted-foreground mb-1">Phần mềm</div>
                      <div className="font-semibold text-foreground">MOPAC 23.2.5</div>
                    </div>
                  </div>
                </div>
              </header>

              <div className="p-7 md:p-10">
                <section className="mb-10">
                  <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary mb-5">
                    Cách em thực hiện
                  </p>

                  <div className="grid md:grid-cols-3 gap-5">
                    <div className="rounded-2xl border bg-background p-6">
                      <div className="text-sm font-bold text-primary mb-2">1. Tạo dữ liệu đầu vào</div>
                      <p className="text-muted-foreground leading-relaxed">
                        Mỗi chất được tạo thành một file .mop riêng. Em dùng từ khóa PM7 PRECISE để tối ưu hình học.
                        Riêng O₂ ở trạng thái triplet được chạy với UHF MS=1.
                      </p>
                    </div>
                    <div className="rounded-2xl border bg-background p-6">
                      <div className="text-sm font-bold text-primary mb-2">2. Đọc kết quả tối ưu</div>
                      <p className="text-muted-foreground leading-relaxed">
                        Sau khi MOPAC báo JOB ENDED NORMALLY, em lấy độ dài liên kết hoặc góc liên kết ở hình học cuối
                        và ghi lại dòng FINAL HEAT OF FORMATION của từng chất.
                      </p>
                    </div>
                    <div className="rounded-2xl border bg-background p-6">
                      <div className="text-sm font-bold text-primary mb-2">3. Tính enthalpy phản ứng</div>
                      <p className="text-muted-foreground leading-relaxed">
                        Em dùng công thức ΔH = ΣνΔHf(sản phẩm) − ΣνΔHf(chất phản ứng). Khi tính bằng PM7,
                        em dùng chính các heat of formation do MOPAC cho cho tất cả các phân tử.
                      </p>
                    </div>
                  </div>
                </section>

                <section className="mb-10">
                  <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary mb-5">
                    Kết quả cấu trúc và heat of formation
                  </p>

                  <div className="overflow-x-auto rounded-2xl border bg-background">
                    <table className="w-full min-w-[760px] text-sm">
                      <thead className="border-b bg-muted/40">
                        <tr className="text-left">
                          <th className="px-5 py-4 font-semibold text-foreground">Chất</th>
                          <th className="px-5 py-4 font-semibold text-foreground">Thông số cấu trúc sau tối ưu</th>
                          <th className="px-5 py-4 font-semibold text-foreground">ΔHf PM7 (kcal/mol)</th>
                          <th className="px-5 py-4 font-semibold text-foreground">ΔHf PM7 (kJ/mol)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        <tr>
                          <td className="px-5 py-4 font-semibold text-foreground">H₂</td>
                          <td className="px-5 py-4 text-muted-foreground">H–H = 0.75952 Å</td>
                          <td className="px-5 py-4 text-muted-foreground">−32.01070</td>
                          <td className="px-5 py-4 text-muted-foreground">−133.93276</td>
                        </tr>
                        <tr>
                          <td className="px-5 py-4 font-semibold text-foreground">O₂</td>
                          <td className="px-5 py-4 text-muted-foreground">O=O = 1.13085 Å</td>
                          <td className="px-5 py-4 text-muted-foreground">−9.17155</td>
                          <td className="px-5 py-4 text-muted-foreground">−38.37378</td>
                        </tr>
                        <tr>
                          <td className="px-5 py-4 font-semibold text-foreground">H₂O</td>
                          <td className="px-5 py-4 text-muted-foreground">O–H = 0.95531 Å; ∠H–O–H = 105.38°</td>
                          <td className="px-5 py-4 text-muted-foreground">−57.79986</td>
                          <td className="px-5 py-4 text-muted-foreground">−241.83461</td>
                        </tr>
                        <tr>
                          <td className="px-5 py-4 font-semibold text-foreground">F₂</td>
                          <td className="px-5 py-4 text-muted-foreground">F–F = 1.41498 Å</td>
                          <td className="px-5 py-4 text-muted-foreground">−15.86529</td>
                          <td className="px-5 py-4 text-muted-foreground">−66.38038</td>
                        </tr>
                        <tr>
                          <td className="px-5 py-4 font-semibold text-foreground">HF</td>
                          <td className="px-5 py-4 text-muted-foreground">H–F = 0.89567 Å</td>
                          <td className="px-5 py-4 text-muted-foreground">−61.93568</td>
                          <td className="px-5 py-4 text-muted-foreground">−259.13887</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-5 rounded-2xl border bg-background p-6">
                    <div className="text-sm font-bold text-primary mb-3">Một chi tiết cần chú ý khi đọc output</div>
                    <p className="text-muted-foreground leading-relaxed">
                      Các số 0.740 Å của H₂, 1.210 Å của O₂ hay 0.960 Å và 104.5° của H₂O chỉ là hình học ban đầu em nhập.
                      Giá trị dùng cho bài là hình học ở cuối quá trình tối ưu. Chẳng hạn H₂ được tối ưu từ 0.740 Å thành 0.75952 Å,
                      còn H₂O cho O–H = 0.95531 Å và góc H–O–H = 105.38°.
                    </p>
                  </div>
                </section>

                <section className="mb-10">
                  <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary mb-5">
                    A. Tính enthalpy và đối chiếu thực nghiệm
                  </p>

                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="rounded-2xl border bg-background p-6 md:p-7">
                      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Phản ứng 1</div>
                      <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
                        O₂(g) + 2H₂(g) → 2H₂O(g)
                      </h3>
                      <div className="rounded-xl border bg-muted/30 px-4 py-4 font-mono text-sm leading-7 text-foreground mb-4">
                        ΔH(PM7) = 2(−241.83461)<br />
                        − [−38.37378 + 2(−133.93276)]<br />
                        = <strong>−177.43 kJ</strong>
                      </div>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        Giá trị thực nghiệm chuẩn cho H₂O(g) là ΔfH° = −241.826 kJ/mol. Vì H₂(g) và O₂(g)
                        là các đơn chất ở trạng thái chuẩn, phản ứng như đã viết có ΔH° thực nghiệm khoảng <strong className="text-foreground">−483.65 kJ</strong>.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        PM7 vẫn dự đoán đúng phản ứng tỏa nhiệt nhưng độ lớn nhỏ hơn thực nghiệm khoảng 306.22 kJ,
                        tương ứng sai lệch khoảng 63.3%.
                      </p>
                    </div>

                    <div className="rounded-2xl border bg-background p-6 md:p-7">
                      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Phản ứng 2</div>
                      <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
                        F₂(g) + H₂(g) → 2HF(g)
                      </h3>
                      <div className="rounded-xl border bg-muted/30 px-4 py-4 font-mono text-sm leading-7 text-foreground mb-4">
                        ΔH(PM7) = 2(−259.13887)<br />
                        − [−66.38038 + (−133.93276)]<br />
                        = <strong>−317.96 kJ</strong>
                      </div>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        Giá trị thực nghiệm chuẩn cho HF(g) là ΔfH° = −273.30 kJ/mol, nên phản ứng như đã viết
                        có ΔH° thực nghiệm khoảng <strong className="text-foreground">−546.60 kJ</strong>.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        PM7 tiếp tục cho đúng dấu tỏa nhiệt nhưng độ lớn nhỏ hơn thực nghiệm khoảng 228.64 kJ,
                        tương ứng sai lệch khoảng 41.8%.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border bg-primary/5 p-6 md:p-7">
                    <h3 className="font-display text-xl font-bold text-foreground mb-3">Nhận xét về kết quả PM7</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Ở cả hai phản ứng, PM7 cho đúng chiều biến thiên enthalpy: ΔH âm, tức phản ứng tỏa nhiệt.
                      Tuy nhiên độ lớn chênh khá nhiều so với dữ liệu thực nghiệm. Với bộ số liệu này, PM7 phù hợp hơn để
                      khảo sát nhanh cấu trúc, nhận biết xu hướng và so sánh tương đối hơn là dùng như giá trị nhiệt hóa học chính xác.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Một điểm em cần tránh khi tính là tự đặt heat of formation của H₂, O₂ và F₂ bằng 0 trong phép tính PM7.
                      MOPAC đã cho các giá trị tính toán riêng cho những phân tử này, nên khi tính ΔH từ kết quả PM7 em dùng đầy đủ
                      các giá trị MOPAC; còn khi đối chiếu số liệu thực nghiệm chuẩn mới áp dụng quy ước ΔfH° của đơn chất ở trạng thái chuẩn bằng 0.
                    </p>
                  </div>

                  <div className="mt-5 text-sm text-muted-foreground leading-relaxed">
                    Dữ liệu thực nghiệm đối chiếu:
                    {' '}
                    <a
                      href="https://webbook.nist.gov/cgi/cbook.cgi?ID=C7732185&Mask=1"
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-primary underline-offset-4 hover:underline"
                    >
                      NIST Chemistry WebBook – H₂O
                    </a>
                    {' '}và{' '}
                    <a
                      href="https://webbook.nist.gov/cgi/cbook.cgi?ID=C7664393&Mask=27&Units=SI"
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-primary underline-offset-4 hover:underline"
                    >
                      NIST Chemistry WebBook – HF
                    </a>.
                  </div>
                </section>

                <section className="mb-10">
                  <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary mb-5">
                    B. So sánh oxygen và fluorine khi phản ứng với hydrogen
                  </p>

                  <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-6">
                    <div className="rounded-2xl border bg-background p-6 md:p-7">
                      <h3 className="font-display text-2xl font-bold text-foreground mb-4">So sánh từ kết quả tính</h3>
                      <div className="space-y-3">
                        <div className="rounded-xl border px-4 py-4">
                          <div className="text-xs text-muted-foreground mb-1">O₂ + 2H₂ → 2H₂O</div>
                          <div className="font-display text-2xl font-bold text-foreground">−177.43 kJ</div>
                          <div className="text-sm text-muted-foreground">PM7</div>
                        </div>
                        <div className="rounded-xl border px-4 py-4">
                          <div className="text-xs text-muted-foreground mb-1">F₂ + H₂ → 2HF</div>
                          <div className="font-display text-2xl font-bold text-foreground">−317.96 kJ</div>
                          <div className="text-sm text-muted-foreground">PM7</div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border bg-background p-6 md:p-7">
                      <h3 className="font-display text-2xl font-bold text-foreground mb-4">Giải thích</h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Trong hai phép tính PM7, phản ứng tạo HF giải phóng năng lượng nhiều hơn phản ứng tạo H₂O theo đúng phương trình đã cho.
                        Về mặt liên kết, liên kết F–F tương đối yếu trong khi liên kết H–F tạo thành rất bền; fluorine cũng có độ âm điện rất lớn,
                        nên sự hình thành hai liên kết H–F làm hệ giảm năng lượng mạnh.
                      </p>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Với oxygen, phản ứng phải phá vỡ liên kết O=O tương đối bền trước khi hình thành các liên kết O–H.
                        Kết quả thực nghiệm cũng giữ cùng xu hướng: phản ứng với F₂ có ΔH° khoảng −546.60 kJ,
                        còn phản ứng tạo 2H₂O(g) khoảng −483.65 kJ.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        Tuy vậy, enthalpy chỉ cho biết mức độ thuận lợi về mặt năng lượng, không trực tiếp cho biết phản ứng diễn ra nhanh hay chậm.
                        Nếu bàn về tốc độ hoặc mức độ dễ xảy ra trong thực tế thì còn phải xét năng lượng hoạt hóa và điều kiện phản ứng.
                      </p>
                    </div>
                  </div>
                </section>

                <section className="mb-10">
                  <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary mb-5">
                    Ý tưởng sử dụng trong dạy học
                  </p>
                  <div className="rounded-2xl border bg-background p-6 md:p-7">
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Em có thể dùng bộ kết quả này trong phần biến thiên enthalpy của phản ứng. Trước khi xem số liệu, học sinh dự đoán
                      phản ứng nào tỏa nhiệt nhiều hơn dựa trên liên kết và độ âm điện. Sau đó các nhóm dùng bảng kết quả PM7 để tự tính ΔH,
                      so sánh với dữ liệu thực nghiệm và giải thích vì sao mô hình tính toán không trùng hoàn toàn với thực nghiệm.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Cách tổ chức này giúp MOPAC không chỉ là công cụ cho ra một con số. Học sinh phải đọc dữ liệu, kiểm tra tính hợp lí,
                      thực hiện phép tính và phân biệt giữa kết quả của mô hình với số liệu đo thực nghiệm.
                    </p>
                  </div>
                </section>

                <section>
                  <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary mb-5">
                    Đánh giá MOPAC sau khi sử dụng
                  </p>

                  <div className="grid lg:grid-cols-3 gap-5">
                    <div className="rounded-2xl border bg-background p-6">
                      <h3 className="font-display text-xl font-bold text-foreground mb-3">Điểm hữu ích</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        MOPAC cho được cả hình học sau tối ưu và heat of formation trong cùng một lần chạy. Với các phân tử nhỏ,
                        thời gian tính rất ngắn nên thuận lợi để tạo một bộ dữ liệu cho học sinh so sánh.
                      </p>
                    </div>

                    <div className="rounded-2xl border bg-background p-6">
                      <h3 className="font-display text-xl font-bold text-foreground mb-3">Khó khăn em gặp</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Phần mềm không có giao diện trực quan như MolView hay Yenka mà chủ yếu làm việc qua file đầu vào và dòng lệnh.
                        Ở lần nhập H₂O đầu tiên, em đặt 104.5 sai vị trí nên MOPAC hiểu đó là tọa độ Y = 104.5 Å và cho kết quả
                        heat of formation +201.081 kcal/mol rất bất hợp lí. Sau khi sửa đúng dạng tọa độ nội và atom tham chiếu,
                        kết quả trở về O–H = 0.95531 Å, góc H–O–H = 105.38° và −57.79986 kcal/mol.
                      </p>
                    </div>

                    <div className="rounded-2xl border bg-background p-6">
                      <h3 className="font-display text-xl font-bold text-foreground mb-3">Cách dùng hiệu quả hơn</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Nếu dùng với học sinh, giáo viên nên chuẩn bị trước mẫu file đầu vào và chỉ yêu cầu chỉnh phân tử hoặc thông số cần khảo sát.
                        Đồng thời phải hướng dẫn học sinh kiểm tra độ hợp lí của cấu trúc trước khi lấy số liệu, vì một file vẫn có thể chạy
                        và kết thúc bình thường dù hình học nhập sai.
                      </p>
                    </div>
                  </div>
                </section>
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
