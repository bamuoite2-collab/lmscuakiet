import { Link } from 'react-router-dom';
import { BookOpen, Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CourseWithPremium {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  category: string | null;
  difficulty: string | null;
  is_published: boolean | null;
  is_premium?: boolean | null;
  created_at: string;
  updated_at: string;
}

interface CourseCardProps {
  course: CourseWithPremium;
  lessonCount?: number;
}

const difficultyColors: Record<string, string> = {
  beginner: 'bg-chemical/10 text-chemical border-chemical/20',
  intermediate: 'bg-lab-500/10 text-lab-600 border-lab-500/20',
  advanced: 'bg-primary/10 text-primary border-primary/20',
};

const difficultyLabels: Record<string, string> = {
  beginner: 'Cơ bản',
  intermediate: 'Trung cấp',
  advanced: 'Nâng cao',
};

export function CourseCard({ course, lessonCount = 0 }: CourseCardProps) {
  return (
    <Link to={`/courses/${course.id}`} className="group block">
      <div className="bg-card rounded-xl border overflow-hidden card-hover">
        {/* Thumbnail */}
        <div className="aspect-video bg-gradient-hero relative overflow-hidden">
          {course.thumbnail_url ? (
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-primary-foreground/60" />
            </div>
          )}
          <div className="absolute top-3 left-3 flex gap-2">
            {course.is_premium && (
              <Badge className="bg-amber-500 text-white border-0">
                <Crown className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            )}
            {course.category && (
              <Badge className="bg-background/90 text-foreground backdrop-blur-sm">
                {course.category}
              </Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {course.title}
          </h3>
          
          {course.description && (
            <p className="mt-3 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {course.description}
            </p>
          )}

          {/* Meta */}
          <div className="mt-5 flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" />
              <span>{lessonCount} bài giảng</span>
            </div>
            {course.difficulty && (
              <Badge variant="outline" className={difficultyColors[course.difficulty] || ''}>
                {difficultyLabels[course.difficulty] || course.difficulty}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}