import { Link, useLocation } from 'react-router-dom';

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

  return (
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
  );
}
