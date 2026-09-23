import {
  ArrowRight,
  CheckCircle2,
  FileImage,
  FlaskConical,
  GraduationCap,
  Image,
  Lightbulb,
  Search,
  Users,
  Video,
  Wrench,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';

const chemistryJourney = [
  {
    step: '01',
    title: 'Tìm và đánh giá tư liệu dạy học',
    icon: Search,
    text: 'Ở những hoạt động đầu, mình bắt đầu từ một việc rất cơ bản: tìm tài liệu sao cho đúng nhu cầu. Mình tập xác định từ khóa, dùng tìm kiếm nâng cao, ưu tiên nguồn đáng tin cậy, kiểm tra thời điểm công bố, đối chiếu nhiều nguồn và chú ý vấn đề bản quyền.',
    note: 'Từ chỗ chỉ “tìm cho ra”, mình bắt đầu quan tâm nhiều hơn đến việc tài liệu đó có phù hợp để dạy học hay không.',
  },
  {
    step: '02',
    title: 'Mở rộng cộng đồng học tập',
    icon: Users,
    text: 'Qua hoạt động khám phá cộng đồng, mình tìm hiểu và tham gia các nhóm giáo viên Hóa học, Khoa học Tự nhiên và các cộng đồng chuyên môn. Mình cũng biết thêm về VERS – Vietnam Educational Research Society.',
    note: 'Mình nhận ra phát triển chuyên môn không chỉ đến từ khóa học hay tài liệu chính thống, mà còn từ việc theo dõi, trao đổi và học hỏi trong cộng đồng nghề nghiệp.',
  },
  {
    step: '03',
    title: 'Hiểu công cụ theo chức năng',
    icon: Wrench,
    text: 'Thay vì nhớ tên phần mềm một cách rời rạc, mình tập phân loại chúng theo việc cần làm: sao chụp như Snipping Tool, Lightshot, Office Lens; chỉnh sửa như Pixlr, PicsArt, Remove.bg; thiết kế như Canva.',
    note: 'Điều quan trọng dần chuyển từ “công cụ nào mạnh hơn” sang “công cụ nào phù hợp với nhiệm vụ này”.',
  },
  {
    step: '04',
    title: 'Biên tập hình ảnh Hóa học',
    icon: Image,
    text: 'Bài thực hành yêu cầu mình tìm sơ đồ chu trình carbon, sau đó chỉnh sửa, Việt hóa chú thích, ghi tên và nguồn rồi lưu vào hồ sơ học tập. Sản phẩm này về sau trở thành một phần của HSHT1.',
    note: 'Qua bài này, mình thấy biên tập ảnh dạy học không chỉ là làm đẹp: thuật ngữ, mũi tên, bố cục và nguồn đều ảnh hưởng đến ý nghĩa khoa học.',
  },
  {
    step: '05',
    title: 'Thiết kế video cho một nội dung cụ thể',
    icon: Video,
    text: 'Ở phần video, nhiệm vụ đặt ra khá rõ: khoảng một phút, có mở đầu – nội dung – kết thúc, chữ hoặc phụ đề rõ ràng, chuyển cảnh phù hợp, âm thanh hợp lý và được chia sẻ qua YouTube; đồng thời phải gắn video với một hoạt động dạy học.',
    note: 'Video pH giúp mình chuyển từ “dựng một clip” sang nghĩ nhiều hơn về yêu cầu cần đạt, câu hỏi sau video và cách học sinh sử dụng học liệu.',
  },
  {
    step: '06',
    title: 'Thiết kế infographic',
    icon: FileImage,
    text: 'Bài thực hành infographic yêu cầu chọn một nội dung trong chương trình Hóa học 2018 và thiết kế sản phẩm dựa trên bốn tiêu chí: chính xác, thẩm mỹ, bố cục và minh bạch về nguồn dữ liệu.',
    note: 'Mình chọn Canva và hoàn thiện infographic về các yếu tố ảnh hưởng đến tốc độ phản ứng. Đây cũng là lúc mình chú ý nhiều hơn đến việc chọn lọc thông tin thay vì đưa mọi thứ mình biết lên một trang.',
  },
  {
    step: '07',
    title: 'Từ sản phẩm sang phản tư',
    icon: CheckCircle2,
    text: 'Ở các bảng tổng kết hoạt động, mình phải nhìn lại công cụ đã dùng, cách mình tìm nguồn, cách phân loại tư liệu và mức độ hoàn thành từng nhiệm vụ. Phần này khiến hồ sơ học tập không chỉ là nơi “nộp sản phẩm”.',
    note: 'Điều mình muốn giữ lại sau CHEM1441 là thói quen tự hỏi: mình đã làm được gì, điều gì chưa ổn và nếu làm lại thì mình sẽ thay đổi gì.',
  },
];

const growth = [
  {
    title: 'Trước CHEM1441',
    text: 'Mình đã quen với công nghệ ở góc độ người dùng và người thích tự mày mò, nhưng chưa thật sự hệ thống hóa cách chọn công cụ cho một hoạt động dạy học.',
  },
  {
    title: 'Trong CHEM1441',
    text: 'Mình lần lượt đi qua việc tìm nguồn, đánh giá tư liệu, biên tập ảnh, dựng video, thiết kế infographic và liên kết các sản phẩm đó với mục tiêu sư phạm.',
  },
  {
    title: 'Hiện tại',
    text: 'Mình bắt đầu nhìn một học liệu bằng cả hai câu hỏi: “Nó có đúng và rõ về mặt khoa học không?” và “Học sinh sẽ làm gì với nó?”.',
  },
  {
    title: 'Tiếp theo',
    text: 'Mình muốn tiếp tục phát triển ở mô phỏng, thiết kế bài dạy, kiểm tra đánh giá và xây dựng một hệ thống học liệu Hóa học có thể dùng lâu dài trên website của mình.',
  },
];

export default function LearningJourney() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        <section className="pt-28 pb-16 md:pt-36 md:pb-24 border-b relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-16 left-12 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute top-24 right-0 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
          </div>

          <div className="container mx-auto px-6 relative">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full border bg-primary/10 px-4 py-2 text-sm font-semibold text-primary mb-6">
                <GraduationCap className="h-4 w-4" />
                Quá trình phát triển
              </div>
              <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-tight mb-6">
                Từ việc dùng công cụ đến việc nghĩ như một người thiết kế học liệu
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Mình gom lại những dấu mốc trong quá trình học CHEM1441 để nhìn rõ hơn mình đã thay đổi
                cách tìm tư liệu, sử dụng công cụ và thiết kế sản phẩm dạy học như thế nào.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="max-w-3xl mx-auto mb-12 text-center">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-3">
                CHEM1441 · Learning timeline
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Những bước mình đã đi qua
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Các mốc dưới đây được viết lại từ chính những hoạt động, bảng tổng kết và nhiệm vụ thực hành
                mình đã hoàn thành trong học phần.
              </p>
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
                Nhìn lại sự thay đổi
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Không chỉ thêm công cụ, mà thay đổi cách mình chọn và sử dụng chúng
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
                  Evidence
                </p>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
                  Các sản phẩm trong HSHT1 là kết quả của những bước này
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Sơ đồ chu trình carbon, video pH và infographic tốc độ phản ứng không đứng riêng lẻ;
                  chúng là ba sản phẩm mình dùng để thử nghiệm cách lựa chọn tư liệu, biên tập học liệu
                  và gắn công cụ với một mục tiêu dạy học cụ thể.
                </p>
              </div>
              <Button asChild>
                <Link to="/chem1441">
                  Xem HSHT1
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
