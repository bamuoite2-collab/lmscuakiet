import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, GripVertical, Zap, BookOpen, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  QuickLessonContent, 
  PracticeLessonContent, 
  LessonContent,
  LessonExample,
  QuickQuizQuestion,
  PracticeExercise,
  EssayPrompt,
  ExerciseDifficulty,
  EducationLevel,
  LessonType,
  createEmptyQuickContent,
  createEmptyPracticeContent
} from '@/types/lesson';
import { cn } from '@/lib/utils';

interface StructuredContentEditorProps {
  educationLevel: EducationLevel;
  lessonType: LessonType;
  initialContent?: LessonContent | null;
  onContentChange: (content: LessonContent | null) => void;
  onLevelChange: (level: EducationLevel) => void;
  onTypeChange: (type: LessonType) => void;
}

export function StructuredContentEditor({
  educationLevel,
  lessonType,
  initialContent,
  onContentChange,
  onLevelChange,
  onTypeChange,
}: StructuredContentEditorProps) {
  const [enabled, setEnabled] = useState(!!initialContent);
  const [quickContent, setQuickContent] = useState<QuickLessonContent>(
    initialContent?.type === 'quick' ? initialContent : createEmptyQuickContent()
  );
  const [practiceContent, setPracticeContent] = useState<PracticeLessonContent>(
    initialContent?.type === 'practice' ? initialContent : createEmptyPracticeContent()
  );
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Update content when type changes
  useEffect(() => {
    if (!enabled) {
      onContentChange(null);
      return;
    }
    
    const content = lessonType === 'quick' ? quickContent : practiceContent;
    const errors = validateContent(content);
    setValidationErrors(errors);
    
    if (errors.length === 0) {
      onContentChange(content);
    }
  }, [enabled, lessonType, quickContent, practiceContent]);

  // Handle education level change -> auto-set lesson type
  const handleLevelChange = (level: EducationLevel) => {
    onLevelChange(level);
    onTypeChange(level === 'thcs' ? 'quick' : 'practice');
  };

  const validateContent = (content: LessonContent): string[] => {
    const errors: string[] = [];
    
    if (content.type === 'quick') {
      if (!content.summary.trim()) errors.push('Tóm tắt bài học không được để trống');
      if (content.quickQuiz.length < 1) errors.push('Cần ít nhất 1 câu hỏi nhanh');
      content.quickQuiz.forEach((q, i) => {
        if (!q.question.trim()) errors.push(`Câu hỏi ${i + 1}: Nội dung câu hỏi trống`);
        if (q.options.length < 2) errors.push(`Câu hỏi ${i + 1}: Cần ít nhất 2 đáp án`);
        if (q.correctIndex < 0 || q.correctIndex >= q.options.length) {
          errors.push(`Câu hỏi ${i + 1}: Đáp án đúng không hợp lệ`);
        }
      });
    } else {
      if (!content.theory.trim()) errors.push('Lý thuyết không được để trống');
      if (content.exercises.length < 1) errors.push('Cần ít nhất 1 bài tập');
      content.exercises.forEach((ex, i) => {
        if (!ex.question.trim()) errors.push(`Bài tập ${i + 1}: Câu hỏi trống`);
        if (!ex.correctAnswer) errors.push(`Bài tập ${i + 1}: Đáp án đúng trống`);
      });
    }
    
    return errors;
  };

  // Quick lesson handlers
  const addExample = () => {
    setQuickContent(prev => ({
      ...prev,
      examples: [...prev.examples, { id: crypto.randomUUID(), title: '', content: '' }]
    }));
  };

  const updateExample = (index: number, field: keyof LessonExample, value: string) => {
    setQuickContent(prev => ({
      ...prev,
      examples: prev.examples.map((ex, i) => i === index ? { ...ex, [field]: value } : ex)
    }));
  };

  const removeExample = (index: number) => {
    setQuickContent(prev => ({
      ...prev,
      examples: prev.examples.filter((_, i) => i !== index)
    }));
  };

  const addQuickQuestion = () => {
    setQuickContent(prev => ({
      ...prev,
      quickQuiz: [...prev.quickQuiz, { 
        id: crypto.randomUUID(), 
        question: '', 
        options: ['', '', '', ''], 
        correctIndex: 0 
      }]
    }));
  };

  const updateQuickQuestion = (index: number, field: keyof QuickQuizQuestion, value: any) => {
    setQuickContent(prev => ({
      ...prev,
      quickQuiz: prev.quickQuiz.map((q, i) => i === index ? { ...q, [field]: value } : q)
    }));
  };

  const updateQuickQuestionOption = (qIndex: number, optIndex: number, value: string) => {
    setQuickContent(prev => ({
      ...prev,
      quickQuiz: prev.quickQuiz.map((q, i) => 
        i === qIndex ? { ...q, options: q.options.map((opt, oi) => oi === optIndex ? value : opt) } : q
      )
    }));
  };

  const removeQuickQuestion = (index: number) => {
    setQuickContent(prev => ({
      ...prev,
      quickQuiz: prev.quickQuiz.filter((_, i) => i !== index)
    }));
  };

  // Practice lesson handlers
  const addExercise = (difficulty: ExerciseDifficulty) => {
    setPracticeContent(prev => ({
      ...prev,
      exercises: [...prev.exercises, { 
        id: crypto.randomUUID(), 
        question: '', 
        correctAnswer: '', 
        difficulty,
        options: ['', '', '', '']
      }]
    }));
  };

  const updateExercise = (index: number, field: keyof PracticeExercise, value: any) => {
    setPracticeContent(prev => ({
      ...prev,
      exercises: prev.exercises.map((ex, i) => i === index ? { ...ex, [field]: value } : ex)
    }));
  };

  const updateExerciseOption = (exIndex: number, optIndex: number, value: string) => {
    setPracticeContent(prev => ({
      ...prev,
      exercises: prev.exercises.map((ex, i) => 
        i === exIndex ? { ...ex, options: (ex.options || []).map((opt, oi) => oi === optIndex ? value : opt) } : ex
      )
    }));
  };

  const removeExercise = (index: number) => {
    setPracticeContent(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }));
  };

  const updateEssayPrompt = (field: keyof EssayPrompt, value: any) => {
    setPracticeContent(prev => ({
      ...prev,
      essayPrompt: { ...prev.essayPrompt, id: prev.essayPrompt?.id || crypto.randomUUID(), prompt: '', [field]: value } as EssayPrompt
    }));
  };

  const difficultyColors: Record<ExerciseDifficulty, string> = {
    easy: 'bg-green-100 text-green-700 border-green-200',
    medium: 'bg-amber-100 text-amber-700 border-amber-200',
    hard: 'bg-red-100 text-red-700 border-red-200',
  };

  const difficultyLabels: Record<ExerciseDifficulty, string> = {
    easy: 'Dễ',
    medium: 'Trung bình',
    hard: 'Khó',
  };

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            {lessonType === 'quick' ? <Zap className="h-4 w-4 text-amber-500" /> : <BookOpen className="h-4 w-4 text-primary" />}
            Nội dung Cấu trúc (Structured Content)
          </CardTitle>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </div>
      </CardHeader>
      
      {enabled && (
        <CardContent className="space-y-4">
          {/* Level & Type Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Cấp học</Label>
              <Select value={educationLevel} onValueChange={(v) => handleLevelChange(v as EducationLevel)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="thcs">THCS (Lớp 6-9)</SelectItem>
                  <SelectItem value="thpt">THPT (Lớp 10-12)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Loại bài học</Label>
              <Select value={lessonType} onValueChange={(v) => onTypeChange(v as LessonType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quick">Quick (Tóm tắt + Quiz)</SelectItem>
                  <SelectItem value="practice">Practice (Lý thuyết + Bài tập)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside text-sm">
                  {validationErrors.map((err, i) => <li key={i}>{err}</li>)}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Quick Lesson Editor */}
          {lessonType === 'quick' && (
            <div className="space-y-4">
              {/* Summary */}
              <div>
                <Label>Tóm tắt bài học *</Label>
                <Textarea
                  value={quickContent.summary}
                  onChange={(e) => setQuickContent(prev => ({ ...prev, summary: e.target.value }))}
                  placeholder="Tóm tắt ngắn gọn nội dung chính của bài học..."
                  rows={3}
                />
              </div>

              {/* Examples */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Ví dụ minh họa</Label>
                  <Button type="button" size="sm" variant="outline" onClick={addExample}>
                    <Plus className="h-3 w-3 mr-1" /> Thêm ví dụ
                  </Button>
                </div>
                <div className="space-y-3">
                  {quickContent.examples.map((ex, i) => (
                    <div key={ex.id} className="p-3 border rounded-lg space-y-2 bg-muted/30">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        <Input
                          value={ex.title}
                          onChange={(e) => updateExample(i, 'title', e.target.value)}
                          placeholder={`Tiêu đề ví dụ ${i + 1}`}
                          className="flex-1"
                        />
                        <Button type="button" size="icon" variant="ghost" onClick={() => removeExample(i)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      <Textarea
                        value={ex.content}
                        onChange={(e) => updateExample(i, 'content', e.target.value)}
                        placeholder="Nội dung ví dụ..."
                        rows={2}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Quiz */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Câu hỏi nhanh * (tối thiểu 1)</Label>
                  <Button type="button" size="sm" variant="outline" onClick={addQuickQuestion}>
                    <Plus className="h-3 w-3 mr-1" /> Thêm câu hỏi
                  </Button>
                </div>
                <div className="space-y-4">
                  {quickContent.quickQuiz.map((q, qi) => (
                    <div key={q.id} className="p-4 border rounded-lg space-y-3 bg-card">
                      <div className="flex items-start gap-2">
                        <Badge variant="secondary" className="shrink-0">Câu {qi + 1}</Badge>
                        <Textarea
                          value={q.question}
                          onChange={(e) => updateQuickQuestion(qi, 'question', e.target.value)}
                          placeholder="Nội dung câu hỏi..."
                          rows={2}
                          className="flex-1"
                        />
                        <Button type="button" size="icon" variant="ghost" onClick={() => removeQuickQuestion(qi)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {q.options.map((opt, oi) => (
                          <div key={oi} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct-${q.id}`}
                              checked={q.correctIndex === oi}
                              onChange={() => updateQuickQuestion(qi, 'correctIndex', oi)}
                              className="shrink-0"
                            />
                            <Input
                              value={opt}
                              onChange={(e) => updateQuickQuestionOption(qi, oi, e.target.value)}
                              placeholder={`Đáp án ${String.fromCharCode(65 + oi)}`}
                              className={cn(q.correctIndex === oi && 'border-green-500 bg-green-50')}
                            />
                          </div>
                        ))}
                      </div>
                      <div>
                        <Input
                          value={q.explanation || ''}
                          onChange={(e) => updateQuickQuestion(qi, 'explanation', e.target.value)}
                          placeholder="Giải thích (tùy chọn)"
                          className="text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Practice Lesson Editor */}
          {lessonType === 'practice' && (
            <div className="space-y-4">
              {/* Theory */}
              <div>
                <Label>Lý thuyết *</Label>
                <Textarea
                  value={practiceContent.theory}
                  onChange={(e) => setPracticeContent(prev => ({ ...prev, theory: e.target.value }))}
                  placeholder="Nội dung lý thuyết chi tiết của bài học..."
                  rows={5}
                />
              </div>

              {/* Exercises */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Bài tập * (tối thiểu 1)</Label>
                  <div className="flex gap-2">
                    <Button type="button" size="sm" variant="outline" onClick={() => addExercise('easy')}>
                      <Plus className="h-3 w-3 mr-1" /> Dễ
                    </Button>
                    <Button type="button" size="sm" variant="outline" onClick={() => addExercise('medium')}>
                      <Plus className="h-3 w-3 mr-1" /> TB
                    </Button>
                    <Button type="button" size="sm" variant="outline" onClick={() => addExercise('hard')}>
                      <Plus className="h-3 w-3 mr-1" /> Khó
                    </Button>
                  </div>
                </div>

                {/* Group by difficulty */}
                {(['easy', 'medium', 'hard'] as ExerciseDifficulty[]).map(diff => {
                  const exercises = practiceContent.exercises.filter(ex => ex.difficulty === diff);
                  if (exercises.length === 0) return null;
                  
                  return (
                    <div key={diff} className="mb-4">
                      <Badge className={cn('mb-2', difficultyColors[diff])}>{difficultyLabels[diff]}</Badge>
                      <div className="space-y-3">
                        {exercises.map((ex) => {
                          const exIndex = practiceContent.exercises.findIndex(e => e.id === ex.id);
                          return (
                            <div key={ex.id} className="p-4 border rounded-lg space-y-3 bg-card">
                              <div className="flex items-start gap-2">
                                <Textarea
                                  value={ex.question}
                                  onChange={(e) => updateExercise(exIndex, 'question', e.target.value)}
                                  placeholder="Nội dung bài tập..."
                                  rows={2}
                                  className="flex-1"
                                />
                                <Button type="button" size="icon" variant="ghost" onClick={() => removeExercise(exIndex)}>
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                              
                              {/* Multiple choice options */}
                              <div className="grid grid-cols-2 gap-2">
                                {(ex.options || ['', '', '', '']).map((opt, oi) => (
                                  <div key={oi} className="flex items-center gap-2">
                                    <input
                                      type="radio"
                                      name={`correct-ex-${ex.id}`}
                                      checked={ex.correctAnswer === oi}
                                      onChange={() => updateExercise(exIndex, 'correctAnswer', oi)}
                                      className="shrink-0"
                                    />
                                    <Input
                                      value={opt}
                                      onChange={(e) => updateExerciseOption(exIndex, oi, e.target.value)}
                                      placeholder={`Đáp án ${String.fromCharCode(65 + oi)}`}
                                      className={cn(ex.correctAnswer === oi && 'border-green-500 bg-green-50')}
                                    />
                                  </div>
                                ))}
                              </div>

                              <Input
                                value={ex.explanation || ''}
                                onChange={(e) => updateExercise(exIndex, 'explanation', e.target.value)}
                                placeholder="Giải thích (tùy chọn)"
                                className="text-sm"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Essay Prompt (Premium) */}
              <div className="p-4 border rounded-lg bg-muted/30">
                <div className="flex items-center gap-2 mb-3">
                  <Label>Đề bài tự luận (Premium)</Label>
                  <Badge variant="outline" className="text-xs">Tùy chọn</Badge>
                </div>
                <Textarea
                  value={practiceContent.essayPrompt?.prompt || ''}
                  onChange={(e) => updateEssayPrompt('prompt', e.target.value)}
                  placeholder="Đề bài tự luận để AI chấm điểm..."
                  rows={3}
                />
                <Input
                  value={practiceContent.essayPrompt?.guidelines || ''}
                  onChange={(e) => updateEssayPrompt('guidelines', e.target.value)}
                  placeholder="Hướng dẫn làm bài (tùy chọn)"
                  className="mt-2"
                />
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
