import { BookOpen, FileText, Presentation, Wrench, Scale, Lightbulb } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Chem1441Subnav } from '@/components/Chem1441Subnav';

const sections = [
  {
    title: 'Vai trò của ICT trong biên soạn văn bản và bài trình chiếu',
    icon: BookOpen,
    content:
      'ICT giúp việc chuẩn bị học liệu Hóa học chính xác, dễ chỉnh sửa và thuận tiện hơn khi cần trình bày công thức, phương trình, hình ảnh hoặc sơ đồ. Với bài trình chiếu, công nghệ hỗ trợ tổ chức nội dung trực quan và kết hợp nhiều loại tư liệu trong cùng một hoạt động dạy học.',
  },
  {
    title: 'Công cụ và kĩ thuật đã sử dụng',
    icon: Wrench,
    content:
      'Trong Word, em sử dụng Subscript, Superscript, Equation và AutoCorrect để nhập công thức và phương trình hóa học. Với bài trình chiếu, em chú ý đến bố cục, cỡ chữ, màu sắc, khoảng trắng và cách đặt hình ảnh để nội dung dễ theo dõi hơn.',
  },
  {
    title: 'Ưu điểm và hạn chế',
    icon: Scale,
    content:
      'Các công cụ của Word giúp chuẩn hóa công thức và tiết kiệm thời gian khi phải nhập lại nhiều kí hiệu. Tuy nhiên, Equation có thể làm font chữ không đồng nhất với phần văn bản và AutoCorrect cần được thiết lập trước. Với PowerPoint, việc có nhiều lựa chọn về màu sắc và hiệu ứng cũng dễ dẫn đến lạm dụng nếu không kiểm soát.',
  },
  {
    title: 'Cách sử dụng hiệu quả hơn',
    icon: Lightbulb,
    content:
      'Em ưu tiên chọn công cụ theo nội dung cần trình bày, kiểm tra lại công thức trước khi xuất file và giữ định dạng nhất quán trong toàn bộ tài liệu. Khi làm slide, mỗi trang chỉ nên tập trung vào một ý chính, giảm chữ, dùng hình ảnh có chức năng minh họa và hạn chế hiệu ứng không cần thiết.',
  },
];

export default function Chem1441Hsht2() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Chem1441Subnav />

      <main className="[&_p]:text-left md:[&_p]:text-justify">
        <section className="py-14 md:py-20 border-b bg-card">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-semibold text-primary mb-5">
                <FileText className="h-4 w-4" />
                Hồ sơ học tập 2 · 5%
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight mb-5">
                Biên soạn văn bản và bài trình chiếu phục vụ dạy học Hóa học
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
                Nội dung phản hồi tập trung vào cách sử dụng ICT khi soạn văn bản và thiết kế bài trình chiếu,
                những công cụ đã thực hành, ưu nhược điểm và cách dùng phù hợp trong dạy học Hóa học.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="rounded-3xl border-2 border-foreground/10 bg-card p-7 md:p-10 mb-10">
                <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-3">Câu hỏi phản hồi</p>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground leading-snug">
                  Làm thế nào để biên soạn văn bản và bài trình chiếu phục vụ dạy học Hóa học một cách hiệu quả?
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {sections.map((item) => {
                  const Icon = item.icon;
                  return (
                    <article key={item.title} className="rounded-2xl border bg-card p-6 md:p-7">
                      <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-display text-xl font-bold text-foreground mb-3">{item.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{item.content}</p>
                    </article>
                  );
                })}
              </div>

              <article className="mt-8 rounded-2xl border bg-card p-6 md:p-8">
                <div className="flex items-center gap-3 mb-5">
                  <Presentation className="h-5 w-5 text-primary" />
                  <h2 className="font-display text-2xl font-bold text-foreground">Minh chứng thực hành</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Phần này sẽ dùng để gắn file bài thực hành Equation – AutoCorrect, sản phẩm viết/vẽ công thức
                  hóa học, bài trình chiếu đã chỉnh sửa và các minh chứng khác của Hồ sơ học tập 2.
                </p>
              </article>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
