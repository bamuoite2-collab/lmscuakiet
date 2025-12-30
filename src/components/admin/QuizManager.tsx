import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, HelpCircle, ChevronRight, ChevronDown, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LatexPreviewInput } from './LatexPreviewInput';
import { MultiPdfUpload } from './MultiPdfUpload';
import { AIQuizImporter } from './AIQuizImporter';
import { toast } from 'sonner';

interface Quiz {
  id: string;
  title: string;
  lesson_id: string;
  time_limit_minutes: number | null;
  created_at: string;
}

interface QuizQuestion {
  id: string;
  quiz_id: string;
  question: string;
  question_type: 'multiple_choice' | 'true_false' | 'essay';
  options: string[];
  correct_answer: number;
  explanation: string | null;
  image_url: string | null;
  order_index: number | null;
}

interface QuizManagerProps {
  lessonId: string;
  lessonTitle: string;
}

export function QuizManager({ lessonId, lessonTitle }: QuizManagerProps) {
  const queryClient = useQueryClient();
  const [expandedQuiz, setExpandedQuiz] = useState<string | null>(null);
  const [quizDialog, setQuizDialog] = useState(false);
  const [questionDialog, setQuestionDialog] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);

  const { data: quizzes } = useQuery({
    queryKey: ['admin-quizzes', lessonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('created_at');
      if (error) throw error;
      return data as Quiz[];
    },
  });

  const { data: questions } = useQuery({
    queryKey: ['admin-questions', expandedQuiz],
    queryFn: async () => {
      if (!expandedQuiz) return [];
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_id', expandedQuiz)
        .order('order_index');
      if (error) throw error;
      return data as QuizQuestion[];
    },
    enabled: !!expandedQuiz,
  });

  const saveQuiz = useMutation({
    mutationFn: async (quiz: { title: string; time_limit_minutes: number | null }) => {
      if (editingQuiz) {
        const { error } = await supabase.from('quizzes').update(quiz).eq('id', editingQuiz.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('quizzes').insert({ ...quiz, lesson_id: lessonId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-quizzes', lessonId] });
      setQuizDialog(false);
      setEditingQuiz(null);
      toast.success(editingQuiz ? 'Đã cập nhật quiz!' : 'Đã tạo quiz!');
    },
    onError: () => toast.error('Không thể lưu quiz'),
  });

  const deleteQuiz = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('quizzes').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-quizzes', lessonId] });
      toast.success('Đã xóa quiz!');
    },
  });

  const saveQuestion = useMutation({
    mutationFn: async (question: Partial<QuizQuestion>) => {
      if (editingQuestion) {
        const { error } = await supabase.from('quiz_questions').update(question).eq('id', editingQuestion.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('quiz_questions').insert({ ...question, quiz_id: selectedQuizId! } as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-questions', expandedQuiz] });
      setQuestionDialog(false);
      setEditingQuestion(null);
      toast.success(editingQuestion ? 'Đã cập nhật câu hỏi!' : 'Đã tạo câu hỏi!');
    },
    onError: () => toast.error('Không thể lưu câu hỏi'),
  });

  const deleteQuestion = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('quiz_questions').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-questions', expandedQuiz] });
      toast.success('Đã xóa câu hỏi!');
    },
  });

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'multiple_choice': return 'Trắc nghiệm';
      case 'true_false': return 'Đúng/Sai';
      case 'essay': return 'Tự luận';
      default: return 'Trắc nghiệm';
    }
  };

  const getQuestionTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'multiple_choice': return 'bg-primary/10 text-primary';
      case 'true_false': return 'bg-amber-500/10 text-amber-600';
      case 'essay': return 'bg-blue-500/10 text-blue-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-primary" />
          <h3 className="font-medium">Quiz cho: {lessonTitle}</h3>
        </div>
        <Dialog open={quizDialog} onOpenChange={setQuizDialog}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={() => setEditingQuiz(null)}>
              <Plus className="h-4 w-4 mr-2" />Thêm Quiz
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingQuiz ? 'Chỉnh sửa' : 'Tạo'} Quiz</DialogTitle>
            </DialogHeader>
            <QuizForm quiz={editingQuiz} onSave={(data) => saveQuiz.mutate(data)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {quizzes?.map((quiz) => (
          <div key={quiz.id} className="border rounded-lg overflow-hidden">
            <div
              className="p-3 bg-muted/30 flex items-center justify-between cursor-pointer"
              onClick={() => setExpandedQuiz(expandedQuiz === quiz.id ? null : quiz.id)}
            >
              <div className="flex items-center gap-2">
                {expandedQuiz === quiz.id ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <span className="font-medium">{quiz.title}</span>
                {quiz.time_limit_minutes && quiz.time_limit_minutes > 0 && (
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    {quiz.time_limit_minutes} phút
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setEditingQuiz(quiz);
                    setQuizDialog(true);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => deleteQuiz.mutate(quiz.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>

            {expandedQuiz === quiz.id && (
              <div className="p-3 space-y-3">
                {/* Quiz PDF Files */}
                <div className="border-b pb-3 mb-3">
                  <Label className="text-sm font-medium mb-2 block">Tài liệu PDF cho Quiz</Label>
                  <MultiPdfUpload entityId={quiz.id} entityType="quiz" maxFiles={10} />
                </div>
                
                <div className="flex justify-end gap-2">
                  <AIQuizImporter 
                    quizId={quiz.id} 
                    onImportComplete={() => queryClient.invalidateQueries({ queryKey: ['admin-questions', expandedQuiz] })}
                  />
                  <Dialog open={questionDialog} onOpenChange={setQuestionDialog}>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedQuizId(quiz.id);
                          setEditingQuestion(null);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />Thêm câu hỏi
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{editingQuestion ? 'Chỉnh sửa' : 'Tạo'} Câu hỏi</DialogTitle>
                      </DialogHeader>
                      <QuestionForm
                        question={editingQuestion}
                        onSave={(data) => saveQuestion.mutate(data)}
                      />
                    </DialogContent>
                  </Dialog>
                </div>

                {questions?.length === 0 && (
                  <p className="text-muted-foreground text-sm text-center py-4">
                    Chưa có câu hỏi nào
                  </p>
                )}

                {questions?.map((q, index) => (
                  <div key={q.id} className="p-3 border rounded-lg bg-background">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-muted-foreground">
                            Câu {index + 1}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded ${getQuestionTypeBadgeColor(q.question_type || 'multiple_choice')}`}>
                            {getQuestionTypeLabel(q.question_type || 'multiple_choice')}
                          </span>
                          {q.image_url && (
                            <ImageIcon className="h-3 w-3 text-muted-foreground" />
                          )}
                        </div>
                        <p className="text-sm font-medium line-clamp-2">{q.question}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {q.question_type === 'essay' 
                            ? 'Tự luận - Admin chấm điểm'
                            : `${(q.options as string[]).length} lựa chọn • Đáp án: ${String.fromCharCode(65 + q.correct_answer)}`
                          }
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            setSelectedQuizId(quiz.id);
                            setEditingQuestion(q);
                            setQuestionDialog(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => deleteQuestion.mutate(q.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {!quizzes?.length && (
          <p className="text-muted-foreground text-center py-8">
            Chưa có quiz nào cho bài học này
          </p>
        )}
      </div>
    </div>
  );
}

function QuizForm({ quiz, onSave }: { quiz: Quiz | null; onSave: (data: { title: string; time_limit_minutes: number | null }) => void }) {
  const [title, setTitle] = useState(quiz?.title || '');
  const [timeLimit, setTimeLimit] = useState<string>(quiz?.time_limit_minutes?.toString() || '');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const timeLimitValue = timeLimit ? parseInt(timeLimit) : null;
        onSave({ title, time_limit_minutes: timeLimitValue && timeLimitValue > 0 ? timeLimitValue : null });
      }}
      className="space-y-4"
    >
      <div>
        <Label>Tiêu đề Quiz</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <Label>Giới hạn thời gian (phút)</Label>
        <Input 
          type="number" 
          min="0"
          value={timeLimit} 
          onChange={(e) => setTimeLimit(e.target.value)} 
          placeholder="Để trống nếu không giới hạn"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Để trống hoặc nhập 0 nếu không muốn giới hạn thời gian
        </p>
      </div>
      <Button type="submit" className="w-full">Lưu Quiz</Button>
    </form>
  );
}

function QuestionForm({
  question,
  onSave,
}: {
  question: QuizQuestion | null;
  onSave: (data: Partial<QuizQuestion>) => void;
}) {
  const [questionText, setQuestionText] = useState(question?.question || '');
  const [questionType, setQuestionType] = useState<'multiple_choice' | 'true_false' | 'essay'>(
    question?.question_type || 'multiple_choice'
  );
  const [options, setOptions] = useState<string[]>(() => {
    if (question?.options) return question.options as string[];
    if (question?.question_type === 'true_false') return ['Đúng', 'Sai'];
    return ['', '', '', ''];
  });
  const [correctAnswer, setCorrectAnswer] = useState(question?.correct_answer || 0);
  const [explanation, setExplanation] = useState(question?.explanation || '');
  const [imageUrl, setImageUrl] = useState(question?.image_url || '');
  const [orderIndex, setOrderIndex] = useState(question?.order_index || 0);

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
      if (correctAnswer >= newOptions.length) {
        setCorrectAnswer(newOptions.length - 1);
      } else if (correctAnswer > index) {
        setCorrectAnswer(correctAnswer - 1);
      }
    }
  };

  // Handle question type change
  const handleTypeChange = (type: 'multiple_choice' | 'true_false' | 'essay') => {
    setQuestionType(type);
    if (type === 'true_false') {
      setOptions(['Đúng', 'Sai']);
      setCorrectAnswer(0);
    } else if (type === 'essay') {
      setOptions([]);
      setCorrectAnswer(0);
    } else if (type === 'multiple_choice' && options.length < 2) {
      setOptions(['', '', '', '']);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({
          question: questionText,
          question_type: questionType,
          options: questionType === 'essay' ? [] : options.filter((o) => o.trim()),
          correct_answer: correctAnswer,
          explanation: explanation || null,
          image_url: imageUrl || null,
          order_index: orderIndex,
        });
      }}
      className="space-y-4"
    >
      {/* Question Type */}
      <div>
        <Label>Loại câu hỏi</Label>
        <Select value={questionType} onValueChange={handleTypeChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="multiple_choice">Trắc nghiệm nhiều lựa chọn</SelectItem>
            <SelectItem value="true_false">Đúng / Sai</SelectItem>
            <SelectItem value="essay">Tự luận (Admin chấm điểm)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <LatexPreviewInput
        label="Câu hỏi (hỗ trợ LaTeX)"
        value={questionText}
        onChange={setQuestionText}
        placeholder="Nhập câu hỏi, sử dụng $...$ cho công thức..."
        rows={3}
        required
      />

      {/* Image URL */}
      <div>
        <Label>URL hình ảnh (tùy chọn)</Label>
        <Input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/image.png"
        />
        {imageUrl && (
          <div className="mt-2 border rounded-lg p-2">
            <img src={imageUrl} alt="Preview" className="max-h-32 object-contain mx-auto" />
          </div>
        )}
      </div>

      {/* Options for multiple choice and true/false */}
      {questionType !== 'essay' && (
        <div className="space-y-3">
          <Label>Các lựa chọn</Label>
          {options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCorrectAnswer(index)}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-colors ${
                  correctAnswer === index
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-muted-foreground/30 hover:border-primary/50'
                }`}
              >
                {String.fromCharCode(65 + index)}
              </button>
              <Input
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                placeholder={`Lựa chọn ${String.fromCharCode(65 + index)}`}
                className="flex-1"
                required
                disabled={questionType === 'true_false'}
              />
              {questionType === 'multiple_choice' && options.length > 2 && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => removeOption(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>
          ))}
          {questionType === 'multiple_choice' && options.length < 6 && (
            <Button type="button" variant="outline" size="sm" onClick={addOption}>
              <Plus className="h-4 w-4 mr-2" />Thêm lựa chọn
            </Button>
          )}
          <p className="text-xs text-muted-foreground">
            Nhấn vào chữ cái để chọn đáp án đúng. Đáp án hiện tại: {String.fromCharCode(65 + correctAnswer)}
          </p>
        </div>
      )}

      {/* Essay notice */}
      {questionType === 'essay' && (
        <div className="p-3 bg-blue-500/10 text-blue-700 rounded-lg text-sm">
          💡 Câu hỏi tự luận: Học sinh sẽ nhập câu trả lời văn bản. Bạn sẽ chấm điểm thủ công sau.
        </div>
      )}

      <LatexPreviewInput
        label="Lời giải (hỗ trợ LaTeX)"
        value={explanation}
        onChange={setExplanation}
        placeholder="Giải thích chi tiết cho câu hỏi này..."
        rows={4}
      />

      <div>
        <Label>Thứ tự</Label>
        <Input
          type="number"
          value={orderIndex}
          onChange={(e) => setOrderIndex(parseInt(e.target.value) || 0)}
        />
      </div>

      <Button type="submit" className="w-full">Lưu câu hỏi</Button>
    </form>
  );
}
