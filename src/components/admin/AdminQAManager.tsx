import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { MessageSquare, Send, Trash2, ExternalLink, CheckCircle, Clock, Filter, Pin, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ContentWithLatex } from '@/components/KaTeXRenderer';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface CommentWithDetails {
  id: string;
  lesson_id: string;
  user_id: string;
  content: string;
  parent_id: string | null;
  is_answered: boolean;
  is_pinned: boolean;
  created_at: string;
  lesson_title: string;
  course_id: string;
  course_title: string;
  student_name: string | null;
  replies_count: number;
}

export function AdminQAManager() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'unanswered' | 'answered' | 'pinned'>('unanswered');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  // Fetch all root comments with lesson/course details
  const { data: comments, isLoading } = useQuery({
    queryKey: ['admin-qa-comments', filter],
    queryFn: async () => {
      // Get all root comments (questions)
      let query = supabase
        .from('lesson_comments')
        .select('*')
        .is('parent_id', null)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (filter === 'unanswered') {
        query = query.eq('is_answered', false);
      } else if (filter === 'answered') {
        query = query.eq('is_answered', true);
      } else if (filter === 'pinned') {
        query = query.eq('is_pinned', true);
      }

      const { data: commentsData, error } = await query;
      if (error) throw error;

      if (!commentsData?.length) return [];

      // Get unique lesson IDs
      const lessonIds = [...new Set(commentsData.map(c => c.lesson_id))];
      const userIds = [...new Set(commentsData.map(c => c.user_id))];

      // Fetch lessons with course info
      const { data: lessons } = await supabase
        .from('lessons')
        .select('id, title, course_id')
        .in('id', lessonIds);

      // Fetch courses
      const courseIds = [...new Set((lessons || []).map(l => l.course_id))];
      const { data: courses } = await supabase
        .from('courses')
        .select('id, title')
        .in('id', courseIds);

      // Fetch profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('user_id', userIds);

      // Fetch reply counts
      const { data: replyCounts } = await supabase
        .from('lesson_comments')
        .select('parent_id')
        .in('parent_id', commentsData.map(c => c.id));

      const replyCountMap = new Map<string, number>();
      (replyCounts || []).forEach(r => {
        if (r.parent_id) {
          replyCountMap.set(r.parent_id, (replyCountMap.get(r.parent_id) || 0) + 1);
        }
      });

      const lessonsMap = new Map((lessons || []).map(l => [l.id, l]));
      const coursesMap = new Map((courses || []).map(c => [c.id, c]));
      const profilesMap = new Map((profiles || []).map(p => [p.user_id, p]));

      return commentsData.map(comment => {
        const lesson = lessonsMap.get(comment.lesson_id);
        const course = lesson ? coursesMap.get(lesson.course_id) : null;
        const profile = profilesMap.get(comment.user_id);

        return {
          ...comment,
          lesson_title: lesson?.title || 'Bài học không xác định',
          course_id: lesson?.course_id || '',
          course_title: course?.title || 'Khóa học không xác định',
          student_name: profile?.full_name || null,
          replies_count: replyCountMap.get(comment.id) || 0,
        } as CommentWithDetails;
      });
    },
  });

  // Reply mutation
  const replyMutation = useMutation({
    mutationFn: async ({ commentId, content }: { commentId: string; content: string }) => {
      // Get the lesson_id from the parent comment
      const { data: parentComment } = await supabase
        .from('lesson_comments')
        .select('lesson_id')
        .eq('id', commentId)
        .single();

      if (!parentComment) throw new Error('Comment not found');

      // Insert reply
      const { error: insertError } = await supabase.from('lesson_comments').insert({
        lesson_id: parentComment.lesson_id,
        user_id: user!.id,
        content,
        parent_id: commentId,
      });
      if (insertError) throw insertError;

      // Mark parent as answered
      const { error: updateError } = await supabase
        .from('lesson_comments')
        .update({ is_answered: true })
        .eq('id', commentId);
      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-qa-comments'] });
      queryClient.invalidateQueries({ queryKey: ['unanswered-comments-count'] });
      setReplyingTo(null);
      setReplyContent('');
      toast.success('Đã gửi trả lời!');
    },
    onError: () => toast.error('Không thể gửi trả lời'),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase
        .from('lesson_comments')
        .delete()
        .eq('id', commentId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-qa-comments'] });
      queryClient.invalidateQueries({ queryKey: ['unanswered-comments-count'] });
      toast.success('Đã xóa câu hỏi!');
    },
  });

  // Pin mutation
  const pinMutation = useMutation({
    mutationFn: async ({ commentId, isPinned }: { commentId: string; isPinned: boolean }) => {
      const { error } = await supabase
        .from('lesson_comments')
        .update({ is_pinned: isPinned })
        .eq('id', commentId);
      if (error) throw error;
    },
    onSuccess: (_, { isPinned }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-qa-comments'] });
      queryClient.invalidateQueries({ queryKey: ['lesson-comments'] });
      toast.success(isPinned ? 'Đã ghim vào FAQ!' : 'Đã bỏ ghim');
    },
  });

  const handleReply = (commentId: string) => {
    if (!replyContent.trim()) return;
    replyMutation.mutate({ commentId, content: replyContent.trim() });
  };

  const unansweredCount = comments?.filter(c => !c.is_answered).length || 0;
  const answeredCount = comments?.filter(c => c.is_answered).length || 0;
  const pinnedCount = comments?.filter(c => c.is_pinned).length || 0;

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground">Quản lý Hỏi đáp</h2>
          <p className="text-sm text-muted-foreground">
            Xem và trả lời câu hỏi từ học sinh
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm flex-wrap">
            <span className="flex items-center gap-1 text-amber-600">
              <Clock className="h-4 w-4" />
              {unansweredCount} chờ
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="flex items-center gap-1 text-green-600">
              <CheckCircle className="h-4 w-4" />
              {answeredCount} đã trả lời
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="flex items-center gap-1 text-amber-500">
              <Star className="h-4 w-4 fill-amber-500" />
              {pinnedCount} FAQ
            </span>
          </div>
          <Select value={filter} onValueChange={(v: 'all' | 'unanswered' | 'answered' | 'pinned') => setFilter(v)}>
            <SelectTrigger className="w-[160px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unanswered">Chờ trả lời</SelectItem>
              <SelectItem value="answered">Đã trả lời</SelectItem>
              <SelectItem value="pinned">FAQ đã ghim</SelectItem>
              <SelectItem value="all">Tất cả</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Comments List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse bg-muted rounded-xl h-32" />
          ))}
        </div>
      ) : comments?.length ? (
        <div className="space-y-4">
          {comments.map(comment => (
            <div
              key={comment.id}
              className={cn(
                "rounded-xl border p-5 transition-colors",
                comment.is_pinned
                  ? "bg-gradient-to-r from-amber-500/10 to-yellow-500/5 border-amber-500/40"
                  : !comment.is_answered
                  ? "bg-amber-500/5 border-amber-500/30"
                  : "bg-card"
              )}
            >
              {/* Pinned Badge */}
              {comment.is_pinned && (
                <div className="flex items-center gap-1.5 text-amber-600 text-xs font-medium mb-2">
                  <Star className="h-3.5 w-3.5 fill-amber-500" />
                  Đã ghim vào FAQ
                </div>
              )}
              
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
                    {(comment.student_name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">
                        {comment.student_name || 'Học sinh'}
                      </span>
                      {!comment.is_answered ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-medium">
                          Chờ trả lời
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 font-medium flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Đã trả lời ({comment.replies_count})
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: vi })}</span>
                      <span>•</span>
                      <Link
                        to={`/courses/${comment.course_id}/lessons/${comment.lesson_id}`}
                        className="hover:text-primary flex items-center gap-1"
                      >
                        {comment.course_title} → {comment.lesson_title}
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className={cn(
                      "h-8 w-8",
                      comment.is_pinned && "text-amber-600"
                    )}
                    onClick={() => pinMutation.mutate({ commentId: comment.id, isPinned: !comment.is_pinned })}
                    title={comment.is_pinned ? "Bỏ ghim FAQ" : "Ghim vào FAQ"}
                  >
                    <Pin className={cn("h-4 w-4", comment.is_pinned && "fill-amber-500")} />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => deleteMutation.mutate(comment.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="bg-background/50 rounded-lg p-4 mb-4">
                <ContentWithLatex content={comment.content} className="text-foreground" />
              </div>

              {/* Reply Section */}
              {replyingTo === comment.id ? (
                <div className="space-y-3">
                  <Textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Nhập câu trả lời... (hỗ trợ LaTeX)"
                    className="min-h-[100px]"
                    autoFocus
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyContent('');
                      }}
                    >
                      Hủy
                    </Button>
                    <Button
                      onClick={() => handleReply(comment.id)}
                      disabled={!replyContent.trim() || replyMutation.isPending}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Gửi trả lời
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => {
                      setReplyingTo(comment.id);
                      setReplyContent('');
                    }}
                    className={cn(
                      !comment.is_answered && "bg-primary hover:bg-primary/90"
                    )}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {comment.is_answered ? 'Trả lời thêm' : 'Trả lời ngay'}
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to={`/courses/${comment.course_id}/lessons/${comment.lesson_id}`}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Xem bài học
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card rounded-xl border">
          <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            {filter === 'unanswered'
              ? 'Không có câu hỏi nào đang chờ trả lời'
              : filter === 'answered'
              ? 'Chưa có câu hỏi nào được trả lời'
              : 'Chưa có câu hỏi nào'}
          </p>
        </div>
      )}
    </div>
  );
}