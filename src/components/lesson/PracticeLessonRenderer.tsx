import { useState } from 'react';
import { PracticeLessonContent, PracticeExercise, ExerciseDifficulty } from '@/types/lesson';
import { sanitizeEducationalContent } from '@/lib/sanitize';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, BookOpen, PenLine, Send } from 'lucide-react';

interface PracticeLessonRendererProps {
  content: PracticeLessonContent;
  onSubmitEssay?: (essay: string) => void;
  onComplete?: () => void;
}

const difficultyConfig: Record<ExerciseDifficulty, { label: string; color: string }> = {
  easy: { label: 'Dễ', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  medium: { label: 'Trung bình', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' },
  hard: { label: 'Khó', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
};

function ExerciseCard({
  exercise,
  index,
}: {
  exercise: PracticeExercise;
  index: number;
}) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const isMultipleChoice = exercise.options && exercise.options.length > 0;
  const correctIndex = typeof exercise.correctAnswer === 'number' ? exercise.correctAnswer : null;

  const handleCheck = () => {
    if (selectedAnswer !== null) {
      setShowResult(true);
    }
  };

  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium">
          <span className="text-muted-foreground mr-2">Câu {index + 1}.</span>
          {exercise.question}
        </p>
        <Badge className={difficultyConfig[exercise.difficulty].color}>
          {difficultyConfig[exercise.difficulty].label}
        </Badge>
      </div>

      {exercise.imageUrl && (
        <img
          src={exercise.imageUrl}
          alt={`Câu ${index + 1}`}
          className="rounded-md max-w-full h-auto"
        />
      )}

      {isMultipleChoice && exercise.options && (
        <div className="space-y-2">
          {exercise.options.map((option, optIndex) => {
            const isSelected = selectedAnswer === optIndex;
            const isCorrect = optIndex === correctIndex;

            let buttonVariant: 'outline' | 'default' | 'destructive' = 'outline';
            if (showResult) {
              if (isCorrect) buttonVariant = 'default';
              else if (isSelected) buttonVariant = 'destructive';
            }

            return (
              <Button
                key={optIndex}
                variant={buttonVariant}
                className={`w-full justify-start text-left h-auto py-2 px-3 ${isSelected && !showResult ? 'ring-2 ring-primary' : ''
                  }`}
                onClick={() => !showResult && setSelectedAnswer(optIndex)}
                disabled={showResult}
              >
                <span className="mr-2 font-medium">
                  {String.fromCharCode(65 + optIndex)}.
                </span>
                {option}
                {showResult && isCorrect && (
                  <CheckCircle className="ml-auto h-4 w-4" />
                )}
                {showResult && isSelected && !isCorrect && (
                  <XCircle className="ml-auto h-4 w-4" />
                )}
              </Button>
            );
          })}
        </div>
      )}

      {showResult && exercise.explanation && (
        <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 p-3 text-sm">
          <strong>Giải thích:</strong> {exercise.explanation}
        </div>
      )}

      {isMultipleChoice && !showResult && (
        <div className="flex justify-end">
          <Button size="sm" onClick={handleCheck} disabled={selectedAnswer === null}>
            Kiểm tra
          </Button>
        </div>
      )}

      {exercise.points && (
        <p className="text-xs text-muted-foreground text-right">
          {exercise.points} điểm
        </p>
      )}
    </div>
  );
}

export function PracticeLessonRenderer({
  content,
  onSubmitEssay,
  onComplete,
}: PracticeLessonRendererProps) {
  const [essayText, setEssayText] = useState('');
  const [essaySubmitted, setEssaySubmitted] = useState(false);

  // Group exercises by difficulty
  const exercisesByDifficulty = content.exercises.reduce(
    (acc, exercise) => {
      acc[exercise.difficulty].push(exercise);
      return acc;
    },
    { easy: [], medium: [], hard: [] } as Record<ExerciseDifficulty, PracticeExercise[]>
  );

  const handleSubmitEssay = () => {
    if (essayText.trim()) {
      onSubmitEssay?.(essayText);
      setEssaySubmitted(true);
    }
  };

  const hasExercises = content.exercises.length > 0;
  const difficulties: ExerciseDifficulty[] = ['easy', 'medium', 'hard'];

  return (
    <div className="space-y-6">
      {/* Theory Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="h-5 w-5 text-primary" />
            Lý thuyết
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: sanitizeEducationalContent(content.theory) }}
          />
        </CardContent>
      </Card>

      {/* Exercises Section */}
      {hasExercises && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <PenLine className="h-5 w-5 text-primary" />
              Bài tập luyện tập
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all">
                  Tất cả ({content.exercises.length})
                </TabsTrigger>
                {difficulties.map((diff) =>
                  exercisesByDifficulty[diff].length > 0 ? (
                    <TabsTrigger key={diff} value={diff}>
                      {difficultyConfig[diff].label} ({exercisesByDifficulty[diff].length})
                    </TabsTrigger>
                  ) : null
                )}
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {content.exercises.map((exercise, index) => (
                  <ExerciseCard key={exercise.id} exercise={exercise} index={index} />
                ))}
              </TabsContent>

              {difficulties.map((diff) => (
                <TabsContent key={diff} value={diff} className="space-y-4">
                  {exercisesByDifficulty[diff].map((exercise, index) => (
                    <ExerciseCard key={exercise.id} exercise={exercise} index={index} />
                  ))}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Essay Prompt Section */}
      {content.essayPrompt && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-lg">
                ✍️ Bài tự luận
              </span>
              {content.essayPrompt.isPremium && (
                <Badge variant="secondary">Premium - Chấm bởi AI</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="font-medium mb-2">{content.essayPrompt.prompt}</p>
              {content.essayPrompt.guidelines && (
                <p className="text-sm text-muted-foreground">
                  <strong>Hướng dẫn:</strong> {content.essayPrompt.guidelines}
                </p>
              )}
              {content.essayPrompt.maxWords && (
                <p className="text-xs text-muted-foreground mt-2">
                  Tối đa {content.essayPrompt.maxWords} từ
                </p>
              )}
            </div>

            {!essaySubmitted ? (
              <>
                <Textarea
                  placeholder="Viết bài làm của bạn tại đây..."
                  value={essayText}
                  onChange={(e) => setEssayText(e.target.value)}
                  rows={8}
                  className="resize-none"
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {essayText.split(/\s+/).filter(Boolean).length} từ
                  </span>
                  <Button onClick={handleSubmitEssay} disabled={!essayText.trim()}>
                    <Send className="h-4 w-4 mr-2" />
                    Nộp bài
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-6 rounded-lg bg-green-50 dark:bg-green-950/30">
                <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-2" />
                <p className="font-medium">Đã nộp bài thành công!</p>
                <p className="text-sm text-muted-foreground">
                  Kết quả chấm sẽ được gửi sau ít phút
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
