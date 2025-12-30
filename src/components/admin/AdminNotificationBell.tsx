import { useState, useEffect } from 'react';
import { Bell, MessageSquare, ClipboardCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface Comment {
  id: string;
  lesson_id: string;
  content: string;
  created_at: string;
  is_answered: boolean;
  profiles?: { full_name: string | null };
  lessons?: { title: string; course_id: string };
}

interface PendingGrade {
  id: string;
  quiz_id: string;
  user_id: string;
  completed_at: string;
  profiles?: { full_name: string | null };
  quizzes?: { title: string };
}

export function AdminNotificationBell() {
  const queryClient = useQueryClient();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch recent unanswered comments
  const { data: comments } = useQuery({
    queryKey: ['admin-notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lesson_comments')
        .select(`
          id,
          lesson_id,
          content,
          created_at,
          is_answered,
          user_id
        `)
        .eq('is_answered', false)
        .is('parent_id', null)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Fetch profiles and lessons separately
      const userIds = [...new Set(data.map(c => c.user_id))];
      const lessonIds = [...new Set(data.map(c => c.lesson_id))];

      const [profilesRes, lessonsRes] = await Promise.all([
        supabase.from('profiles').select('user_id, full_name').in('user_id', userIds),
        supabase.from('lessons').select('id, title, course_id').in('id', lessonIds),
      ]);

      const profilesMap = new Map(profilesRes.data?.map(p => [p.user_id, p]) || []);
      const lessonsMap = new Map(lessonsRes.data?.map(l => [l.id, l]) || []);

      return data.map(comment => ({
        ...comment,
        profiles: profilesMap.get(comment.user_id),
        lessons: lessonsMap.get(comment.lesson_id),
      })) as Comment[];
    },
  });

  // Fetch pending grades
  const { data: pendingGrades } = useQuery({
    queryKey: ['admin-pending-grades-notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quiz_attempts')
        .select(`
          id,
          quiz_id,
          user_id,
          completed_at
        `)
        .eq('status', 'pending_grade')
        .order('completed_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Fetch profiles and quizzes separately
      const userIds = [...new Set(data.map(a => a.user_id))];
      const quizIds = [...new Set(data.map(a => a.quiz_id))];

      const [profilesRes, quizzesRes] = await Promise.all([
        supabase.from('profiles').select('user_id, full_name').in('user_id', userIds),
        supabase.from('quizzes').select('id, title').in('id', quizIds),
      ]);

      const profilesMap = new Map(profilesRes.data?.map(p => [p.user_id, p]) || []);
      const quizzesMap = new Map(quizzesRes.data?.map(q => [q.id, q]) || []);

      return data.map(attempt => ({
        ...attempt,
        profiles: profilesMap.get(attempt.user_id),
        quizzes: quizzesMap.get(attempt.quiz_id),
      })) as PendingGrade[];
    },
  });

  // Set up real-time subscription for comments
  useEffect(() => {
    const commentChannel = supabase
      .channel('admin-comments-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'lesson_comments',
        },
        (payload) => {
          console.log('New comment received:', payload);
          queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
          setUnreadCount((prev) => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(commentChannel);
    };
  }, [queryClient]);

  // Set up real-time subscription for pending grades
  useEffect(() => {
    const gradeChannel = supabase
      .channel('admin-grades-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'quiz_attempts',
          filter: 'status=eq.pending_grade',
        },
        (payload) => {
          console.log('New pending grade received:', payload);
          queryClient.invalidateQueries({ queryKey: ['admin-pending-grades-notifications'] });
          queryClient.invalidateQueries({ queryKey: ['pending-grades'] });
          setUnreadCount((prev) => prev + 1);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'quiz_attempts',
        },
        (payload) => {
          console.log('Quiz attempt updated:', payload);
          queryClient.invalidateQueries({ queryKey: ['admin-pending-grades-notifications'] });
          queryClient.invalidateQueries({ queryKey: ['pending-grades'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(gradeChannel);
    };
  }, [queryClient]);

  // Update unread count when data changes
  useEffect(() => {
    if (!isOpen) {
      const commentCount = comments?.length || 0;
      const gradeCount = pendingGrades?.length || 0;
      setUnreadCount(commentCount + gradeCount);
    }
  }, [comments, pendingGrades, isOpen]);

  // Reset unread count when popover opens
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setUnreadCount(0);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    return `${days} ngày trước`;
  };

  const totalNotifications = (comments?.length || 0) + (pendingGrades?.length || 0);

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 border-b">
          <h4 className="font-semibold">Thông báo</h4>
          <p className="text-xs text-muted-foreground">
            {totalNotifications} thông báo mới
          </p>
        </div>
        
        <Tabs defaultValue="grades" className="w-full">
          <TabsList className="w-full grid grid-cols-2 h-9">
            <TabsTrigger value="grades" className="text-xs gap-1 relative">
              <ClipboardCheck className="h-3 w-3" />
              Chấm bài
              {(pendingGrades?.length || 0) > 0 && (
                <span className="ml-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center">
                  {pendingGrades?.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="comments" className="text-xs gap-1 relative">
              <MessageSquare className="h-3 w-3" />
              Hỏi đáp
              {(comments?.length || 0) > 0 && (
                <span className="ml-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center">
                  {comments?.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="grades" className="m-0">
            <ScrollArea className="h-[250px]">
              {pendingGrades?.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  Không có bài cần chấm
                </div>
              ) : (
                <div className="divide-y">
                  {pendingGrades?.map((grade) => (
                    <Link
                      key={grade.id}
                      to="/admin/grading"
                      className="block p-3 hover:bg-muted/50 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <p className="font-medium text-sm line-clamp-1">
                          {grade.profiles?.full_name || 'Học sinh'}
                        </p>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatTime(grade.completed_at)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Đã nộp bài kiểm tra
                      </p>
                      <p className="text-xs text-primary mt-1">
                        📝 {grade.quizzes?.title || 'Bài kiểm tra'}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </ScrollArea>
            {(pendingGrades?.length || 0) > 0 && (
              <div className="p-2 border-t">
                <Link to="/admin/grading" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    Xem tất cả bài cần chấm
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="comments" className="m-0">
            <ScrollArea className="h-[250px]">
              {comments?.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  Không có câu hỏi mới
                </div>
              ) : (
                <div className="divide-y">
                  {comments?.map((comment) => (
                    <Link
                      key={comment.id}
                      to={`/course/${comment.lessons?.course_id}/lesson/${comment.lesson_id}`}
                      className="block p-3 hover:bg-muted/50 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <p className="font-medium text-sm line-clamp-1">
                          {comment.profiles?.full_name || 'Học sinh'}
                        </p>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatTime(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {comment.content}
                      </p>
                      <p className="text-xs text-primary mt-1">
                        📚 {comment.lessons?.title || 'Bài học'}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
