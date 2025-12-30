import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageSquare, Send, Reply, Trash2, ChevronDown, ChevronUp, Pin, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ContentWithLatex } from '@/components/KaTeXRenderer';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface LessonComment {
  id: string;
  lesson_id: string;
  user_id: string;
  content: string;
  parent_id: string | null;
  is_answered: boolean;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  profile?: {
    full_name: string | null;
  } | null;
  user_role?: 'admin' | 'student';
}

interface LessonCommentsProps {
  lessonId: string;
}

export function LessonComments({ lessonId }: LessonCommentsProps) {
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  // Fetch comments
  const { data: comments, isLoading } = useQuery({
    queryKey: ['lesson-comments', lessonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lesson_comments')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Fetch profiles and roles for all users
      const userIds = [...new Set((data || []).map(c => c.user_id))];
      
      const [profilesRes, rolesRes] = await Promise.all([
        supabase.from('profiles').select('user_id, full_name').in('user_id', userIds),
        supabase.from('user_roles').select('user_id, role').in('user_id', userIds)
      ]);

      const profilesMap = new Map(
        (profilesRes.data || []).map(p => [p.user_id, p])
      );
      const rolesMap = new Map(
        (rolesRes.data || []).map(r => [r.user_id, r.role])
      );

      return (data || []).map(comment => ({
        ...comment,
        profile: profilesMap.get(comment.user_id) || null,
        user_role: rolesMap.get(comment.user_id) || 'student'
      })) as LessonComment[];
    },
    enabled: !!lessonId,
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async ({ content, parentId }: { content: string; parentId?: string }) => {
      const { error } = await supabase.from('lesson_comments').insert({
        lesson_id: lessonId,
        user_id: user!.id,
        content,
        parent_id: parentId || null,
      });
      if (error) throw error;

      // If admin is replying, mark parent as answered
      if (parentId && isAdmin) {
        await supabase
          .from('lesson_comments')
          .update({ is_answered: true })
          .eq('id', parentId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lesson-comments', lessonId] });
      queryClient.invalidateQueries({ queryKey: ['unanswered-comments-count'] });
      setNewComment('');
      setReplyContent('');
      setReplyingTo(null);
      toast.success('Đã gửi bình luận!');
    },
    onError: () => toast.error('Không thể gửi bình luận'),
  });

  // Delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase
        .from('lesson_comments')
        .delete()
        .eq('id', commentId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lesson-comments', lessonId] });
      queryClient.invalidateQueries({ queryKey: ['unanswered-comments-count'] });
      toast.success('Đã xóa bình luận!');
    },
  });

  // Pin/unpin mutation
  const togglePinMutation = useMutation({
    mutationFn: async ({ commentId, isPinned }: { commentId: string; isPinned: boolean }) => {
      const { error } = await supabase
        .from('lesson_comments')
        .update({ is_pinned: isPinned })
        .eq('id', commentId);
      if (error) throw error;
    },
    onSuccess: (_, { isPinned }) => {
      queryClient.invalidateQueries({ queryKey: ['lesson-comments', lessonId] });
      toast.success(isPinned ? 'Đã ghim câu hỏi vào FAQ!' : 'Đã bỏ ghim câu hỏi');
    },
  });

  // Organize comments into threads - pinned first
  const rootComments = comments?.filter(c => !c.parent_id) || [];
  const pinnedComments = rootComments.filter(c => c.is_pinned);
  const unpinnedComments = rootComments.filter(c => !c.is_pinned);
  
  const repliesMap = new Map<string, LessonComment[]>();
  comments?.forEach(c => {
    if (c.parent_id) {
      const existing = repliesMap.get(c.parent_id) || [];
      repliesMap.set(c.parent_id, [...existing, c]);
    }
  });

  const toggleReplies = (commentId: string) => {
    setExpandedReplies(prev => {
      const next = new Set(prev);
      if (next.has(commentId)) {
        next.delete(commentId);
      } else {
        next.add(commentId);
      }
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent, parentId?: string) => {
    e.preventDefault();
    const content = parentId ? replyContent : newComment;
    if (!content.trim() || !user) return;
    addCommentMutation.mutate({ content: content.trim(), parentId });
  };

  const CommentCard = ({ comment, isReply = false, isFaqSection = false }: { comment: LessonComment; isReply?: boolean; isFaqSection?: boolean }) => {
    const isAuthor = comment.user_id === user?.id;
    const isTeacher = comment.user_role === 'admin';
    const replies = repliesMap.get(comment.id) || [];
    const hasReplies = replies.length > 0;
    const isExpanded = expandedReplies.has(comment.id) || isFaqSection;

    return (
      <div className={cn("group", isReply && "ml-8 mt-3")}>
        <div className={cn(
          "rounded-lg border p-4 transition-colors",
          comment.is_pinned && !isReply ? "bg-gradient-to-r from-amber-500/10 to-yellow-500/5 border-amber-500/40" : "",
          isTeacher ? "bg-primary/5 border-primary/30" : !comment.is_pinned && "bg-card",
          !comment.is_answered && !isReply && !comment.is_pinned && "border-amber-500/30 bg-amber-500/5"
        )}>
          {/* Pinned Badge */}
          {comment.is_pinned && !isReply && (
            <div className="flex items-center gap-1.5 text-amber-600 text-xs font-medium mb-2">
              <Star className="h-3.5 w-3.5 fill-amber-500" />
              Câu hỏi thường gặp (FAQ)
            </div>
          )}
          
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                isTeacher ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>
                {(comment.profile?.full_name || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">
                    {comment.profile?.full_name || 'Người dùng'}
                  </span>
                  {isTeacher && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-primary-foreground font-medium">
                      👨‍🏫 Thầy Kiệt
                    </span>
                  )}
                  {!comment.is_answered && !isReply && !comment.is_pinned && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-medium">
                      Chờ trả lời
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: vi })}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {/* Pin Button - Admin only */}
              {isAdmin && !isReply && (
                <Button
                  size="icon"
                  variant="ghost"
                  className={cn(
                    "h-7 w-7 transition-opacity",
                    comment.is_pinned ? "opacity-100 text-amber-600" : "opacity-0 group-hover:opacity-100"
                  )}
                  onClick={() => togglePinMutation.mutate({ commentId: comment.id, isPinned: !comment.is_pinned })}
                  title={comment.is_pinned ? "Bỏ ghim FAQ" : "Ghim vào FAQ"}
                >
                  <Pin className={cn("h-4 w-4", comment.is_pinned && "fill-amber-500")} />
                </Button>
              )}
              {(isAuthor || isAdmin) && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => deleteCommentMutation.mutate(comment.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>
          </div>

          {/* Content with LaTeX support */}
          <div className="text-foreground mb-3">
            <ContentWithLatex content={comment.content} />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {!isReply && user && (
              <Button
                size="sm"
                variant={isAdmin ? "default" : "ghost"}
                className={cn(
                  "h-7 text-xs",
                  isAdmin && "bg-primary hover:bg-primary/90"
                )}
                onClick={() => {
                  setReplyingTo(replyingTo === comment.id ? null : comment.id);
                  setReplyContent('');
                }}
              >
                <Reply className="h-3 w-3 mr-1" />
                {isAdmin ? 'Trả lời (Thầy)' : 'Trả lời'}
              </Button>
            )}
            {hasReplies && !isFaqSection && (
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs text-muted-foreground"
                onClick={() => toggleReplies(comment.id)}
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-3 w-3 mr-1" />
                    Ẩn {replies.length} phản hồi
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3 mr-1" />
                    Xem {replies.length} phản hồi
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Reply Form */}
          {replyingTo === comment.id && (
            <form onSubmit={(e) => handleSubmit(e, comment.id)} className="mt-3 pt-3 border-t">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Nhập phản hồi... (hỗ trợ LaTeX)"
                className="min-h-[80px] text-sm"
              />
              <div className="flex justify-end gap-2 mt-2">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setReplyingTo(null)}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={!replyContent.trim() || addCommentMutation.isPending}
                >
                  <Send className="h-3 w-3 mr-1" />
                  Gửi
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Replies - always show for FAQ */}
        {hasReplies && isExpanded && (
          <div className="space-y-3">
            {replies.map(reply => (
              <CommentCard key={reply.id} comment={reply} isReply />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="border rounded-xl p-6 bg-card">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <MessageSquare className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-foreground">
            Hỏi đáp & Thảo luận
          </h3>
          <p className="text-sm text-muted-foreground">
            Đặt câu hỏi và trao đổi với thầy giáo (hỗ trợ LaTeX)
          </p>
        </div>
      </div>

      {/* New Comment Form */}
      {user ? (
        <form onSubmit={(e) => handleSubmit(e)} className="mb-6">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Nhập câu hỏi của bạn... (hỗ trợ LaTeX: $\ce{H2SO4}$, $E = mc^2$)"
            className="min-h-[100px]"
          />
          <div className="flex justify-end mt-3">
            <Button
              type="submit"
              disabled={!newComment.trim() || addCommentMutation.isPending}
            >
              <Send className="h-4 w-4 mr-2" />
              Gửi câu hỏi
            </Button>
          </div>
        </form>
      ) : (
        <div className="text-center py-6 mb-6 bg-muted/50 rounded-lg">
          <p className="text-muted-foreground">
            Vui lòng đăng nhập để đặt câu hỏi
          </p>
        </div>
      )}

      {/* Comments List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-24 bg-muted rounded-lg" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* FAQ Section - Pinned questions */}
          {pinnedComments.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                <h4 className="font-semibold text-foreground">Câu hỏi thường gặp (FAQ)</h4>
                <span className="text-xs text-muted-foreground">({pinnedComments.length})</span>
              </div>
              <div className="space-y-4">
                {pinnedComments.map(comment => (
                  <CommentCard key={comment.id} comment={comment} isFaqSection />
                ))}
              </div>
            </div>
          )}

          {/* Regular Questions */}
          {unpinnedComments.length > 0 ? (
            <div className="space-y-4">
              {pinnedComments.length > 0 && (
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Câu hỏi khác
                  <span className="text-xs text-muted-foreground">({unpinnedComments.length})</span>
                </h4>
              )}
              {unpinnedComments.map(comment => (
                <CommentCard key={comment.id} comment={comment} />
              ))}
            </div>
          ) : pinnedComments.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">Chưa có câu hỏi nào. Hãy là người đầu tiên!</p>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}