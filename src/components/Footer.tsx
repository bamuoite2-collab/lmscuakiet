import { Link } from 'react-router-dom';
import { FlaskConical, Mail, Github, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                <FlaskConical className="h-5 w-5" />
              </div>
              <span className="font-display font-bold text-lg">Science Scholar</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
              Nền tảng học tập Khoa học Tự nhiên trực tuyến. 
              Đồng hành cùng học viên chinh phục kiến thức Hóa học và Vật lý 
              thông qua hệ thống bài giảng chất lượng cao.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-5">Truy cập nhanh</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/courses" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Danh mục Khóa học
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Đăng nhập Học viên
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-5">Liên hệ</h4>
            <div className="flex gap-3">
              <a
                href="mailto:contact@sciencescholar.edu.vn"
                className="p-2.5 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Mail className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="p-2.5 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="p-2.5 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-10 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Science Scholar. Nền tảng Giáo dục Khoa học Tự nhiên.</p>
        </div>
      </div>
    </footer>
  );
}