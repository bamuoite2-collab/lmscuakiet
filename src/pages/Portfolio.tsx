import { Link } from 'react-router-dom';
import {
  ArrowRight,
  FileCheck2,
  FileText,
  Image,
  Presentation,
  Video,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Chem1441Subnav } from '@/components/Chem1441Subnav';

const products = [
  {
    title: 'Sơ đồ chu trình carbon',
    type: 'Biên tập hình ảnh',
    hsht: 'HSHT 1',
    tool: 'Canva',
    href: '/chem1441/hsht1#san-pham-1',
    image: '/portfolio/carbon-cycle-vi.png',
    icon: Image,
    status: 'Đã hoàn thiện',
  },
  {
    title: 'Vì sao nước chanh có vị chua? – Khám phá pH',
    type: 'Video học tập',
    hsht: 'HSHT 1',
    tool: 'Canva & CapCut',
    href: '/chem1441/hsht1#san-pham-2',
    image: 'https://img.youtube.com/vi/ey5G9nov1W4/hqdefault.jpg',
    icon: Video,
    status: 'Đã hoàn thiện',
  },
  {
    title: 'Các yếu tố ảnh hưởng đến tốc độ phản ứng',
    type: 'Infographic',
    hsht: 'HSHT 1',
    tool: 'Canva',
    href: '/chem1441/hsht1#san-pham-3',
    image: '/portfolio/reaction-rate-factors.png',
    icon: Image,
    status: 'Đã hoàn thiện',
  },
  {
    title: 'Thực hành Equation và AutoCorrect',
    type: 'Biên soạn văn bản Hóa học',
    hsht: 'HSHT 2',
    tool: 'Microsoft Word',
    href: '/chem1441/hsht2#san-pham-1',
    icon: FileText,
    status: 'Đã hoàn thiện',
  },
  {
    title: 'ChemFormatter và mô hình phân tử 2D–3D',
    type: 'Viết và vẽ công thức Hóa học',
    hsht: 'HSHT 2',
    tool: 'Word · ChemFormatter · ChemDraw · Chem3D',
    href: '/chem1441/hsht2#san-pham-2',
    icon: FileText,
    status: 'Đã hoàn thiện',
  },
  {
    title: 'Thiết kế lại slide Tính chất hóa học của muối',
    type: 'Bài trình chiếu',
    hsht: 'HSHT 2',
    tool: 'Microsoft PowerPoint',
    href: '/chem1441/hsht2#san-pham-3',
    icon: Presentation,
    status: 'Đã hoàn thiện',
  },
  {
    title: 'Đề kiểm tra và hướng dẫn chấm',
    type: 'Văn bản kiểm tra đánh giá',
    hsht: 'HSHT 2',
    tool: 'Microsoft Word · Equation',
    href: '/chem1441/hsht2#san-pham-4',
    icon: FileCheck2,
    status: 'Đã hoàn thiện',
  },
];

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Chem1441Subnav />

      <main>
        <section className="py-16 md:py-24 border-b bg-card">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary mb-4">
                Portfolio
              </p>
              <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-tight mb-6">
                Những sản phẩm mình đã làm
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">
                Trang này chỉ tập trung vào sản phẩm. Mỗi thẻ cho biết sản phẩm thuộc hồ sơ nào,
                dùng công cụ gì và dẫn đến phần trình bày chi tiết tương ứng.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {products.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="rounded-3xl border bg-card overflow-hidden shadow-sm card-hover flex flex-col">
                    {item.image ? (
                      <div className="aspect-[16/10] bg-muted overflow-hidden border-b">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[16/10] bg-muted/40 border-b flex items-center justify-center">
                        <div className="h-16 w-16 rounded-2xl border bg-background text-primary flex items-center justify-center">
                          <Icon className="h-8 w-8" />
                        </div>
                      </div>
                    )}

                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                          {item.hsht}
                        </span>
                        <span className="rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">
                          {item.type}
                        </span>
                      </div>

                      <h2 className="font-display text-xl font-bold text-foreground mb-3">{item.title}</h2>

                      <div className="text-sm text-muted-foreground mb-5 space-y-1">
                        <p><span className="font-medium text-foreground">Công cụ:</span> {item.tool}</p>
                        <p><span className="font-medium text-foreground">Trạng thái:</span> {item.status}</p>
                      </div>

                      <div className="mt-auto">
                        <Button asChild variant="outline">
                          <Link to={item.href}>
                            Xem chi tiết
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
