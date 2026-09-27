import { Construction } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Chem1441Subnav } from '@/components/Chem1441Subnav';

type Props = {
  number: 3 | 4;
};

export default function Chem1441Placeholder({ number }: Props) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Chem1441Subnav />
      <main className="py-20 md:py-28">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto rounded-3xl border bg-card p-8 md:p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
              <Construction className="h-7 w-7" />
            </div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-3">CHEM1441</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Hồ sơ học tập {number}
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Nội dung của hồ sơ này sẽ được bổ sung khi có yêu cầu và sản phẩm học tập tương ứng.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
