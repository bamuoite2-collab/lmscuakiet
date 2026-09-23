import {
  ArrowRight,
  BookOpen,
  Code2,
  FlaskConical,
  GraduationCap,
  Leaf,
  Microscope,
  Route,
  Sparkles,
  Wrench,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';

const interests = [
  {
    title: 'Thiết kế học liệu',
    text: 'Mình thích biến những nội dung Hóa học nhiều chữ hoặc khó hình dung thành hình ảnh, video, infographic và hoạt động học rõ ràng hơn.',
    icon: BookOpen,
  },
  {
    title: 'Công nghệ trong dạy học',
    text: 'Điều mình quan tâm không phải là dùng thật nhiều công cụ, mà là chọn đúng công cụ cho đúng mục tiêu và đúng cách học của học sinh.',
    icon: Wrench,
  },
  {
    title: 'STEM & trải nghiệm',
    text: 'Mình hứng thú với những hoạt động để học sinh được quan sát, thử nghiệm, làm sản phẩm và tự giải thích điều các em nhìn thấy.',
    icon: FlaskConical,
  },
  {
    title: 'Python & tự động hóa',
    text: 'Ngoài sư phạm, mình thích viết những script nhỏ để xử lý dữ liệu, sắp xếp công việc và tìm cách làm các thao tác lặp lại gọn hơn.',
    icon: Code2,
  },
];

const milestones = [
  {
    meta: 'Nền tảng',
    title: 'Sư phạm Khoa học Tự nhiên',
    text: 'Mình tốt nghiệp loại Xuất sắc ngành Sư phạm Khoa học Tự nhiên tại HCMUE. Quãng thời gian này giúp mình có nền tảng liên môn và nhìn việc dạy khoa học theo hướng kết nối thay vì tách rời từng mảng kiến thức.',
    icon: GraduationCap,
  },
  {
    meta: 'Hiện tại',
    title: 'Văn bằng 2 · Sư phạm Hóa học',
    text: 'Mình tiếp tục học Sư phạm Hóa học tại HCMUE vì muốn đi sâu hơn vào chuyên môn Hóa và cách tổ chức những bài học vừa chính xác về khoa học, vừa dễ tiếp cận với học sinh.',
    icon: FlaskConical,
  },
  {
    meta: '2024',
    title: 'Nghiên cứu khoa học',
    text: 'Mình là đồng tác giả một công trình liên quan đến Hóa học Xanh và Khoa học Vật liệu. Trải nghiệm nghiên cứu giúp mình cẩn thận hơn với nguồn thông tin, dữ liệu và cách giải thích một vấn đề khoa học.',
    icon: Microscope,
  },
  {
    meta: 'Dự án dạy học',
    title: 'Pin điện xanh',
    text: 'Mình từng thiết kế một dự án học tập trải nghiệm cho học sinh lớp 12, kết hợp kiến thức Hóa học với định hướng STEM và sản phẩm thực hành.',
    icon: Leaf,
  },
];

export default function AboutMe() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        <section className="pt-28 pb-16 md:pt-36 md:pb-24 border-b relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-20 left-8 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute top-28 right-0 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
          </div>

          <div className="container mx-auto px-6 relative">
            <div className="max-w-5xl mx-auto grid lg:grid-cols-[220px_1fr] gap-9 lg:gap-14 items-center">
              <div className="mx-auto lg:mx-0">
                <div className="h-44 w-44 md:h-52 md:w-52 rounded-[2rem] border bg-card shadow-lg relative overflow-hidden">
                  <img
                    src="/about/avatar.jpg"
                    alt="Hồ Tuấn Kiệt"
                    className="h-full w-full object-cover object-top"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none" />
                </div>
              </div>

              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full border bg-primary/10 px-4 py-2 text-sm font-semibold text-primary mb-5">
                  <Sparkles className="h-4 w-4" />
                  Một chút về mình
                </div>

                <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-tight mb-4">
                  Hồ Tuấn Kiệt
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl">
                  Mình hiện là sinh viên văn bằng 2 ngành Sư phạm Hóa học tại HCMUE. Trước đó,
                  mình tốt nghiệp loại Xuất sắc ngành Sư phạm Khoa học Tự nhiên, cũng tại HCMUE.
                </p>

                <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl">
                  Mình thích những bài học mà học sinh có thể nhìn thấy, thử, làm và tự giải thích.
                  Vì vậy, mình thường quan tâm đến học liệu trực quan, công nghệ và những cách tổ chức
                  hoạt động giúp kiến thức Hóa học bớt xa lạ hơn.
                </p>

                <div className="mt-7 flex flex-wrap justify-center lg:justify-start gap-3">
                  <Button asChild>
                    <Link to="/hanh-trinh">
                      Xem hành trình học tập
                      <Route className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/chem1441">
                      Hồ sơ CHEM1441
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-3">
                Vì sao là Sư phạm Hóa học?
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                Mình thích Hóa học, nhưng điều giữ mình ở lại với sư phạm là chuyện khác.
              </h2>
              <div className="rounded-3xl border bg-card p-7 md:p-10">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Niềm yêu thích Hóa học của mình bắt đầu từ những năm THPT và tiếp tục lớn lên qua
                  quá trình học tập, nghiên cứu. Khi đi sâu hơn vào sư phạm, mình nhận ra điều mình
                  thích không chỉ là giải một bài Hóa hay hiểu một phản ứng, mà còn là tìm cách để
                  người khác cũng có thể hiểu được nó.
                </p>
                <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
                  Vì thế mình hứng thú với STEM, mô hình 5E, học liệu trực quan và những công cụ số
                  có thể hỗ trợ một hoạt động học cụ thể. Với mình, công nghệ chỉ thực sự có ý nghĩa
                  khi nó giúp học sinh quan sát rõ hơn, đặt câu hỏi tốt hơn hoặc tự mình giải thích được kiến thức.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-card border-y">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="max-w-3xl mb-10">
                <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-3">
                  Những điều mình quan tâm
                </p>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                  Hóa học, sư phạm và một chút công nghệ
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {interests.map((item) => {
                  const Icon = item.icon;
                  return (
                    <article key={item.title} className="rounded-2xl border bg-background p-6 card-hover">
                      <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-display text-lg font-bold text-foreground mb-3">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="max-w-3xl mb-10">
                <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-3">
                  Một vài dấu mốc
                </p>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                  Những trải nghiệm đã định hình cách mình học và dạy
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {milestones.map((item) => {
                  const Icon = item.icon;
                  return (
                    <article key={item.title} className="rounded-2xl border bg-card p-6 md:p-7">
                      <div className="flex items-start gap-4">
                        <div className="h-11 w-11 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-1">{item.meta}</p>
                          <h3 className="font-display text-xl font-bold text-foreground mb-3">{item.title}</h3>
                          <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-gradient-hero text-primary-foreground">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary-foreground/70 mb-3">
                Điều mình muốn tiếp tục làm
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-5">
                Dạy Hóa học theo cách chính xác, trực quan và có lý do.
              </h2>
              <p className="max-w-3xl mx-auto text-primary-foreground/80 leading-relaxed text-lg">
                Mình muốn trở thành một giáo viên Hóa học và Khoa học Tự nhiên biết sử dụng công nghệ
                một cách có mục đích, không chạy theo công cụ. Về lâu dài, mình cũng muốn tiếp tục phát triển
                Hoá Học Thầy Kiệt thành một không gian chia sẻ học liệu và những trải nghiệm học Hóa học
                mà học sinh có thể thật sự tham gia vào.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button asChild variant="glass">
                  <Link to="/hanh-trinh">
                    Xem quá trình phát triển
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="glass">
                  <Link to="/chem1441">
                    Xem hồ sơ ICT
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
