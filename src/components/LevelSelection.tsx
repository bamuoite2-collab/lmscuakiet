import { useState } from 'react';
import { GraduationCap, BookOpen, Target, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface LevelSelectionProps {
  userId: string;
  onComplete: () => void;
}

export function LevelSelection({ userId, onComplete }: LevelSelectionProps) {
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<'thcs' | 'thpt' | null>(null);

  const handleSelectLevel = async (level: 'thcs' | 'thpt') => {
    setSelected(level);
    setLoading(true);
    
    const { error } = await supabase
      .from('profiles')
      .update({ user_level: level })
      .eq('user_id', userId);

    if (error) {
      toast.error('Có lỗi xảy ra, vui lòng thử lại');
      setLoading(false);
      return;
    }

    toast.success('Đã cập nhật thành công!');
    onComplete();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <GraduationCap className="h-4 w-4" />
            Chào mừng bạn đến với LMS
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Bạn đang học cấp nào?
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Chọn cấp học để chúng tôi cá nhân hóa trải nghiệm học tập phù hợp nhất với bạn
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* THCS Card */}
          <Card 
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 ${
              selected === 'thcs' ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
            }`}
            onClick={() => !loading && handleSelectLevel('thcs')}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-4">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">THCS</CardTitle>
              <CardDescription>Lớp 6 - 9</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 text-sm">
                <Zap className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Bài học ngắn gọn, dễ tiếp thu</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Zap className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Học 10 phút mỗi ngày, tạo thói quen</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Zap className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Streak và phần thưởng động viên</span>
              </div>
              <Button 
                className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700"
                disabled={loading}
              >
                {loading && selected === 'thcs' ? 'Đang xử lý...' : 'Chọn THCS'}
              </Button>
            </CardContent>
          </Card>

          {/* THPT Card */}
          <Card 
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 ${
              selected === 'thpt' ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
            }`}
            onClick={() => !loading && handleSelectLevel('thpt')}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center mb-4">
                <Target className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">THPT</CardTitle>
              <CardDescription>Lớp 10 - 12</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 text-sm">
                <Target className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Luyện đề thi thật, đánh giá năng lực</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Target className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Thống kê điểm yếu, cải thiện hiệu quả</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Target className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Ôn tập theo chủ đề hoặc dạng bài</span>
              </div>
              <Button 
                className="w-full mt-4"
                disabled={loading}
              >
                {loading && selected === 'thpt' ? 'Đang xử lý...' : 'Chọn THPT'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}