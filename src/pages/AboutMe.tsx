import {
  ArrowRight,
  BookOpen,
  Code2,
  FlaskConical,
  Route,
  Sparkles,
  Wrench,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Chem1441Subnav } from '@/components/Chem1441Subnav';

const interests = [
  {
    title: 'Thiết kế học liệu',
    text: 'Mình thích biến những nội dung Hóa học nhiều chữ hoặc khó hình dung thành hình ảnh, video, infographic và hoạt động học rõ ràng hơn.',
    icon: BookOpen,
  },
  {
    title: 'Công nghệ trong dạy học',
    text: 'Mình quan tâm đến việc chọn công cụ đúng với mục tiêu học tập. Công nghệ chỉ đáng dùng khi nó giúp hoạt động học dễ tổ chức hoặc dễ hiểu hơn.',
    icon: Wrench,
  },
  {
    title: 'STEM & trải nghiệm',
    text: 'Mình hứng thú với những hoạt động để học sinh được quan sát, thử nghiệm, làm sản phẩm và tự giải thích điều các em nhìn thấy.',
    icon: FlaskConical,
  },
  {
    title: 'Python & tự động hóa',
    text: 'Ngoài sư phạm, mình thích viết những script nhỏ để xử lý dữ liệu, sắp xếp công việc và giảm bớt các thao tác lặp lại.',
    icon: Code2,
  },
];

export default function AboutMe() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Chem1441Subnav />

      <main>
        <section className="py-16 md:py-24 border-b relative overflow-hidden">
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
                  Giới thiệu
                </div>

                <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-tight mb-4">
                  Hồ Tuấn Kiệt
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl">
                  Mình hiện là sinh viên văn bằng 2 ngành Sư phạm Hóa học tại HCMUE.
                  Trước đó, mình tốt nghiệp loại Xuất sắc ngành Sư phạm Khoa học Tự nhiên, cũng tại HCMUE.
                </p>

                <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl">
                  Mình thích những bài học mà học sinh có thể quan sát, thử, làm và tự giải thích.
                  Vì vậy mình thường quan tâm đến học liệu trực quan, STEM và cách dùng công nghệ trong một hoạt động học cụ thể.
                </p>

                <div className="mt-7 flex flex-wrap justify-center lg:justify-start gap-3">
                  <Button asChild>
                    <Link to="/chem1441/hanh-trinh">
                      Xem hành trình trong CHEM1441
                      <Route className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/chem1441/portfolio">
                      Xem sản phẩm
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
                Nền tảng và định hướng
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                Vì sao mình tiếp tục học Sư phạm Hóa học?
              </h2>
              <div className="rounded-3xl border bg-card p-7 md:p-10">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Niềm yêu thích Hóa học của mình bắt đầu từ những năm THPT và tiếp tục qua quá trình học tập,
                  nghiên cứu. Khi học sư phạm, mình thấy hứng thú nhất ở việc tìm cách giải thích một nội dung
                  sao cho người học có thể hiểu được bằng quan sát, câu hỏi và hoạt động phù hợp.
                </p>
                <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
                  Trước khi học văn bằng 2, mình học Sư phạm Khoa học Tự nhiên và từng làm một số nội dung
                  liên quan đến Hóa học Xanh, Khoa học Vật liệu và pin điện xanh. Mình học thêm Sư phạm Hóa học
                  vì muốn đi sâu hơn vào phần chuyên môn này.
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
                  Mình quan tâm đến
                </p>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                  Hóa học, sư phạm và công nghệ
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

        <section className="py-16 md:py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto rounded-3xl border bg-card p-7 md:p-10">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-3">
                Mục tiêu của mình
              </p>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                Dạy Hóa học chính xác, dễ theo dõi và có hoạt động để học sinh tham gia.
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Mình muốn làm học liệu dễ dùng hơn trên lớp và biết lúc nào nên dùng ICT.
                Phần Hành trình ghi lại những gì mình đã thử trong CHEM1441; Portfolio là chỗ mình để các sản phẩm đã làm.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
