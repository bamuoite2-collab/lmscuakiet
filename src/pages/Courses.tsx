import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, BookOpen } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Course, Lesson } from '@/types/database';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CourseCard } from '@/components/CourseCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const categories = ['Tất cả', 'Hóa học', 'Vật lý', 'Sinh học', 'Toán học'];
const difficulties = ['Tất cả', 'Cơ bản', 'Trung cấp', 'Nâng cao'];

const difficultyMap: Record<string, string> = {
  'Cơ bản': 'beginner',
  'Trung cấp': 'intermediate',
  'Nâng cao': 'advanced',
};

export default function CoursesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'Tất cả');
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || 'Tất cả');

  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses', search, category, difficulty],
    queryFn: async () => {
      let query = supabase
        .from('courses')
        .select('*')
        .eq('is_published', true);

      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      }
      if (category !== 'Tất cả') {
        query = query.eq('category', category);
      }
      if (difficulty !== 'Tất cả') {
        query = query.eq('difficulty', difficultyMap[difficulty] || difficulty.toLowerCase());
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data as Course[];
    },
  });

  const { data: lessonCounts } = useQuery({
    queryKey: ['lesson-counts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('course_id')
        .eq('is_published', true);
      
      if (error) throw error;
      
      const counts: Record<string, number> = {};
      data.forEach((lesson) => {
        counts[lesson.course_id] = (counts[lesson.course_id] || 0) + 1;
      });
      return counts;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-5">
              Danh mục Khóa học
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Khám phá hệ thống bài giảng Khoa học Tự nhiên toàn diện, 
              từ kiến thức nền tảng đến các chuyên đề nâng cao.
            </p>
          </div>

          {/* Filters */}
          <div className="bg-card rounded-xl border p-8 mb-10">
            <div className="flex flex-col md:flex-row gap-5">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm khóa học..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2.5">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={category === cat ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="flex flex-wrap gap-2.5 mt-5">
              <span className="text-sm text-muted-foreground mr-2 self-center">Trình độ:</span>
              {difficulties.map((diff) => (
                <Badge
                  key={diff}
                  variant={difficulty === diff ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setDifficulty(diff)}
                >
                  {diff}
                </Badge>
              ))}
            </div>
          </div>

          {/* Course Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-card rounded-xl border overflow-hidden animate-pulse">
                  <div className="aspect-video bg-muted" />
                  <div className="p-6 space-y-3">
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : courses && courses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  lessonCount={lessonCounts?.[course.id] || 0}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/50 rounded-2xl">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-5" />
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                Không tìm thấy khóa học
              </h3>
              <p className="text-muted-foreground">
                Vui lòng điều chỉnh bộ lọc hoặc thử từ khóa khác.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}