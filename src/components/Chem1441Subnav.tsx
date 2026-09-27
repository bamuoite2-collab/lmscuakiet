import { Link, useLocation } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';

const items = [
  { href: '/chem1441', label: 'Tổng quan' },
  { href: '/chem1441/gioi-thieu', label: 'Giới thiệu' },
  { href: '/chem1441/hanh-trinh', label: 'Hành trình' },
  { href: '/chem1441/portfolio', label: 'Portfolio' },
  { href: '/chem1441/hsht1', label: 'HSHT 1' },
  { href: '/chem1441/hsht2', label: 'HSHT 2' },
  { href: '/chem1441/hsht3', label: 'HSHT 3' },
  { href: '/chem1441/hsht4', label: 'HSHT 4' },
];

export function Chem1441Subnav() {
  const location = useLocation();

  const isActive = (href: string) =>
    href === '/chem1441'
      ? location.pathname === '/chem1441'
      : location.pathname.startsWith(href);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="mt-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center gap-2 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <span className="hidden lg:inline shrink-0 mr-2 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
            CHEM1441
          </span>
          {items.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                isActive(item.href)
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      </div>

      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Lên đầu trang"
        title="Lên đầu trang"
        className="fixed bottom-5 right-5 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border bg-background/95 text-foreground shadow-lg backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:bottom-7 md:right-7"
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </>
  );
}
