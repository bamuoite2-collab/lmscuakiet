import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Send, Clock, Loader2, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContentWithLatex } from '@/components/KaTeXRenderer';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface QuizQuestion {
  id: string;
  question: string;
  question_type?: 'multiple_choice' | 'true_false' | 'essay';
  options: string[];
  image_url?: string | null;
}

interface QuizResult {
  questionId: string;
  question: string;
  options: string[];
  userAnswer: number | string | null;
  correctAnswer: number | null;
  isCorrect: boolean | null;
  isEssay?: boolean;
  explanation: string | null;
}

interface QuizPlayerProps {
  quizId: string;
  questions?: QuizQuestion[];
  timeLimitMinutes?: number | null;
  onComplete?: (score: number, total: number) => void;
  // Review mode props
  isReviewing?: boolean;
  previousAnswers?: Record<string, number | string>;
}

export function QuizPlayer({ 
  quizId, 
  questions: providedQuestions, 
  timeLimitMinutes, 
  onComplete,
  isReviewing: isReviewMode = false,
  previousAnswers = {}
}: QuizPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [essayAnswers, setEssayAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<QuizResult[] | null>(null);
  const [showResultForIndex, setShowResultForIndex] = useState<number | null>(null);
  const [finalScore, setFinalScore] = useState<{ score: number; total: number; hasEssay?: boolean } | null>(null);
  const [startTime] = useState(() => new Date().toISOString());
  
  // Timer state
  const hasTimeLimit = timeLimitMinutes && timeLimitMinutes > 0 && !isReviewMode;
  const [timeRemaining, setTimeRemaining] = useState(() => 
    hasTimeLimit ? timeLimitMinutes * 60 : 0
  );
  const hasAutoSubmitted = useRef(false);

  // Fetch questions for review mode (with answers from edge function)
  const { data: reviewData, isLoading: isLoadingReview } = useQuery({
    queryKey: ['quiz-review', quizId, previousAnswers],
    queryFn: async () => {
      // Call edge function to validate and get results for review
      const answers = Object.entries(previousAnswers).map(([questionId, answer]) => ({
        questionId,
        answer,
      }));

      const { data, error } = await supabase.functions.invoke('validate-quiz', {
        body: { quizId, answers, startTime: new Date().toISOString(), reviewOnly: true },
      });

      if (error) throw error;
      return data;
    },
    enabled: isReviewMode && Object.keys(previousAnswers).length > 0,
  });

  // Use provided questions or fetched review data
  const questions = providedQuestions || [];
  const reviewResults = reviewData?.results as QuizResult[] | undefined;

  // In review mode, show results directly
  useEffect(() => {
    if (isReviewMode && reviewResults) {
      setResults(reviewResults);
      setShowResultForIndex(0);
      const gradedResults = reviewResults.filter(r => r.isCorrect !== null);
      setFinalScore({ 
        score: gradedResults.filter(r => r.isCorrect === true).length, 
        total: reviewResults.length,
        hasEssay: reviewResults.some(r => r.isEssay)
      });
    }
  }, [isReviewMode, reviewResults]);

  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;
  
  // Check if all questions are answered (including essays)
  const allAnswered = questions.every(q => {
    if (q.question_type === 'essay') {
      return essayAnswers[q.id] !== undefined && essayAnswers[q.id].trim() !== '';
    }
    return selectedAnswers[q.id] !== undefined;
  });
  
  const isReviewing = results !== null;

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle submit (force = true when auto-submitting due to timeout)
  const handleSubmit = useCallback(async (force: boolean = false) => {
    if (!force && !allAnswered) {
      toast.error('Vui lòng trả lời tất cả câu hỏi trước khi nộp bài');
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const answers = Object.entries(selectedAnswers).map(([questionId, answer]) => ({
        questionId,
        answer,
      }));

      // For unanswered questions when force submitting, send null
      if (force) {
        questions.forEach(q => {
          if (q.question_type !== 'essay' && selectedAnswers[q.id] === undefined) {
            answers.push({ questionId: q.id, answer: -1 }); // -1 indicates no answer
          }
        });
      }

      const { data, error } = await supabase.functions.invoke('validate-quiz', {
        body: { quizId, answers, startTime, essayAnswers },
      });

      if (error) throw error;

      setResults(data.results);
      setFinalScore({ 
        score: data.score, 
        total: data.totalQuestions,
        hasEssay: data.hasEssayQuestions
      });
      setShowResultForIndex(0);
      setCurrentIndex(0);
      onComplete?.(data.score, data.totalQuestions);
      
      if (force) {
        toast.warning(`Hết thời gian! Bạn đạt ${data.score}/${data.totalGradableQuestions || data.totalQuestions} câu đúng.`);
      } else if (data.hasEssayQuestions) {
        toast.success('Bài làm đã được ghi nhận. Vui lòng chờ thầy chấm phần tự luận.');
      } else {
        toast.success(`Bạn đạt ${data.score}/${data.totalQuestions} câu đúng!`);
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Có lỗi xảy ra khi nộp bài. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  }, [allAnswered, isSubmitting, selectedAnswers, essayAnswers, questions, quizId, startTime, onComplete]);

  // Countdown timer effect
  useEffect(() => {
    if (!hasTimeLimit || isReviewing) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          // Auto-submit when time runs out
          if (!hasAutoSubmitted.current && !isSubmitting) {
            hasAutoSubmitted.current = true;
            handleSubmit(true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [hasTimeLimit, isReviewing, isSubmitting, handleSubmit]);

  const handleSelectAnswer = (questionIndex: number, answerIndex: number) => {
    if (isReviewing) return;
    const questionId = questions[questionIndex].id;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const handleEssayChange = (questionId: string, value: string) => {
    if (isReviewing) return;
    setEssayAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    const totalQuestions = isReviewMode && reviewResults ? reviewResults.length : questions.length;
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(i => i + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
    }
  };

  const handleRetry = () => {
    if (isReviewMode) return; // Can't retry in review mode
    setCurrentIndex(0);
    setSelectedAnswers({});
    setEssayAnswers({});
    setResults(null);
    setShowResultForIndex(null);
    setFinalScore(null);
    hasAutoSubmitted.current = false;
    if (timeLimitMinutes && timeLimitMinutes > 0) {
      setTimeRemaining(timeLimitMinutes * 60);
    }
  };

  // Loading state for review mode
  if (isReviewMode && isLoadingReview) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Đang tải bài làm...</span>
      </div>
    );
  }

  // Review mode display
  if (isReviewMode && reviewResults && reviewResults.length > 0) {
    const currentResult = reviewResults[currentIndex];
    const totalQuestions = reviewResults.length;
    const reviewProgress = ((currentIndex + 1) / totalQuestions) * 100;
    const gradedResults = reviewResults.filter(r => r.isCorrect !== null);
    const score = gradedResults.filter(r => r.isCorrect === true).length;
    const hasEssay = reviewResults.some(r => r.isEssay);
    const percentage = gradedResults.length > 0 ? Math.round((score / gradedResults.length) * 100) : 0;

    return (
      <div className="space-y-6">
        {/* Score Banner */}
        <div className={cn(
          "text-center p-4 rounded-xl border",
          hasEssay ? "bg-amber-500/10 border-amber-500/30" : 
          percentage >= 70 ? "bg-chemical/10 border-chemical/30" : "bg-destructive/10 border-destructive/30"
        )}>
          <div className="flex items-center justify-center gap-2">
            {hasEssay ? (
              <HelpCircle className="h-5 w-5 text-amber-500" />
            ) : percentage >= 70 ? (
              <CheckCircle2 className="h-5 w-5 text-chemical" />
            ) : (
              <XCircle className="h-5 w-5 text-destructive" />
            )}
            <span className="font-medium">
              {hasEssay ? (
                <>Điểm tạm: {score}/{gradedResults.length} (chờ chấm tự luận)</>
              ) : (
                <>Điểm: {score}/{totalQuestions} ({percentage}%)</>
              )}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Xem lại câu {currentIndex + 1} / {totalQuestions}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${reviewProgress}%` }}
            />
          </div>
        </div>

        {/* Question Review */}
        <div className="bg-card rounded-xl border p-6">
          <h4 className="font-display text-lg font-semibold text-foreground mb-6">
            <ContentWithLatex content={currentResult?.question || ''} />
          </h4>

          {currentResult?.isEssay ? (
            // Essay question review
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg border">
                <p className="text-sm font-medium text-foreground mb-2">Bài làm của bạn:</p>
                <ContentWithLatex 
                  content={typeof currentResult.userAnswer === 'string' ? currentResult.userAnswer : 'Chưa trả lời'} 
                  className="text-foreground whitespace-pre-wrap" 
                />
              </div>
              <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <HelpCircle className="h-5 w-5 text-amber-500" />
                <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                  Chờ chấm điểm
                </span>
              </div>
            </div>
          ) : (
            // Multiple choice review
            <div className="space-y-3">
              {currentResult?.options.map((option, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-full text-left p-4 rounded-lg border-2 transition-all",
                    index === currentResult.correctAnswer
                      ? "border-chemical bg-chemical/10 text-foreground"
                      : index === currentResult.userAnswer
                      ? "border-destructive bg-destructive/10 text-foreground"
                      : "border-border bg-card text-muted-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                      index === currentResult.correctAnswer
                        ? "bg-chemical text-chemical-foreground"
                        : index === currentResult.userAnswer
                        ? "bg-destructive text-destructive-foreground"
                        : "bg-muted text-muted-foreground"
                    )}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <ContentWithLatex content={option} className="flex-1" />
                    {index === currentResult.correctAnswer && (
                      <CheckCircle2 className="h-5 w-5 text-chemical" />
                    )}
                    {index === currentResult.userAnswer && index !== currentResult.correctAnswer && (
                      <XCircle className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Explanation */}
          {currentResult?.explanation && !currentResult?.isEssay && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg border">
              <p className="text-sm font-medium text-foreground mb-2">Lời giải:</p>
              <ContentWithLatex content={currentResult.explanation} className="text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex-1"
          >
            Câu trước
          </Button>
          <Button 
            onClick={handleNext} 
            disabled={currentIndex >= totalQuestions - 1}
            className="flex-1"
          >
            Câu tiếp <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Question dots */}
        <div className="flex flex-wrap gap-2 justify-center">
          {reviewResults.map((result, index) => (
            <button
              key={result.questionId}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "w-8 h-8 rounded-full text-xs font-medium transition-all",
                currentIndex === index
                  ? "ring-2 ring-primary ring-offset-2"
                  : "",
                result.isEssay
                  ? "bg-amber-500/20 text-amber-600 border border-amber-500/30"
                  : result.isCorrect
                  ? "bg-chemical/20 text-chemical border border-chemical/30"
                  : "bg-destructive/20 text-destructive border border-destructive/30"
              )}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const currentResult = results?.[currentIndex];
  const selectedAnswer = isReviewing 
    ? (typeof currentResult?.userAnswer === 'number' ? currentResult.userAnswer : undefined)
    : selectedAnswers[currentQuestion?.id];

  // Timer warning states
  const isLowTime = hasTimeLimit && timeRemaining <= 60 && timeRemaining > 0;
  const isCriticalTime = hasTimeLimit && timeRemaining <= 30 && timeRemaining > 0;

  // Show final summary after reviewing all results
  if (isReviewing && finalScore && showResultForIndex !== null) {
    const hasEssay = finalScore.hasEssay;
    const gradedResults = results?.filter(r => r.isCorrect !== null) || [];
    const gradedScore = gradedResults.filter(r => r.isCorrect === true).length;
    const percentage = gradedResults.length > 0 ? Math.round((gradedScore / gradedResults.length) * 100) : 0;

    return (
      <div className="space-y-6">
        {/* Final Score Banner */}
        <div className={cn(
          "text-center p-6 rounded-xl border",
          hasEssay ? "bg-amber-500/10 border-amber-500/30" :
          percentage >= 70 ? "bg-chemical/10 border-chemical/30" : "bg-destructive/10 border-destructive/30"
        )}>
          <div className={cn(
            "w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4",
            hasEssay ? "bg-amber-500/20" :
            percentage >= 70 ? "bg-chemical/20" : "bg-destructive/20"
          )}>
            {hasEssay ? (
              <HelpCircle className="h-8 w-8 text-amber-500" />
            ) : percentage >= 70 ? (
              <CheckCircle2 className="h-8 w-8 text-chemical" />
            ) : (
              <XCircle className="h-8 w-8 text-destructive" />
            )}
          </div>
          <h3 className="font-display text-xl font-bold text-foreground mb-1">
            {hasEssay ? 'Đã nộp bài!' : percentage >= 70 ? 'Xuất sắc!' : 'Tiếp tục luyện tập!'}
          </h3>
          {hasEssay ? (
            <div className="space-y-2">
              <p className="text-muted-foreground">
                Điểm trắc nghiệm: {gradedScore} / {gradedResults.length} câu ({percentage}%)
              </p>
              <p className="text-amber-600 dark:text-amber-400 text-sm font-medium">
                Bài làm đã ghi nhận, vui lòng chờ thầy chấm phần tự luận để nhận kết quả chính thức.
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground">
              Bạn đạt {finalScore.score} / {finalScore.total} câu ({percentage}%)
            </p>
          )}
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Xem lại câu {currentIndex + 1} / {questions.length}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Review */}
        <div className="bg-card rounded-xl border p-6">
          <h4 className="font-display text-lg font-semibold text-foreground mb-6">
            <ContentWithLatex content={currentResult?.question || ''} />
          </h4>

          {currentResult?.isEssay ? (
            // Essay question review
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg border">
                <p className="text-sm font-medium text-foreground mb-2">Bài làm của bạn:</p>
                <ContentWithLatex 
                  content={typeof currentResult.userAnswer === 'string' ? currentResult.userAnswer : 'Chưa trả lời'} 
                  className="text-foreground whitespace-pre-wrap" 
                />
              </div>
              <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <HelpCircle className="h-5 w-5 text-amber-500" />
                <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                  Chờ chấm điểm
                </span>
              </div>
            </div>
          ) : (
            // Multiple choice review
            <div className="space-y-3">
              {currentResult?.options.map((option, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-full text-left p-4 rounded-lg border-2 transition-all",
                    index === currentResult.correctAnswer
                      ? "border-chemical bg-chemical/10 text-foreground"
                      : index === currentResult.userAnswer
                      ? "border-destructive bg-destructive/10 text-foreground"
                      : "border-border bg-card text-muted-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                      index === currentResult.correctAnswer
                        ? "bg-chemical text-chemical-foreground"
                        : index === currentResult.userAnswer
                        ? "bg-destructive text-destructive-foreground"
                        : "bg-muted text-muted-foreground"
                    )}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <ContentWithLatex content={option} className="flex-1" />
                    {index === currentResult.correctAnswer && (
                      <CheckCircle2 className="h-5 w-5 text-chemical" />
                    )}
                    {index === currentResult.userAnswer && index !== currentResult.correctAnswer && (
                      <XCircle className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Explanation */}
          {currentResult?.explanation && !currentResult?.isEssay && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg border">
              <p className="text-sm font-medium text-foreground mb-2">Lời giải:</p>
              <ContentWithLatex content={currentResult.explanation} className="text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex-1"
          >
            Câu trước
          </Button>
          {currentIndex < questions.length - 1 ? (
            <Button onClick={handleNext} className="flex-1">
              Câu tiếp <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleRetry} variant="outline" className="flex-1">
              <RotateCcw className="h-4 w-4 mr-2" /> Làm lại
            </Button>
          )}
        </div>

        {/* Question dots */}
        <div className="flex flex-wrap gap-2 justify-center">
          {results?.map((result, index) => (
            <button
              key={result.questionId}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "w-8 h-8 rounded-full text-xs font-medium transition-all",
                currentIndex === index
                  ? "ring-2 ring-primary ring-offset-2"
                  : "",
                result.isEssay
                  ? "bg-amber-500/20 text-amber-600 border border-amber-500/30"
                  : result.isCorrect
                  ? "bg-chemical/20 text-chemical border border-chemical/30"
                  : "bg-destructive/20 text-destructive border border-destructive/30"
              )}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // No questions available
  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Không có câu hỏi nào
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Timer Display */}
      {hasTimeLimit && (
        <div className={cn(
          "flex items-center justify-center gap-2 p-3 rounded-lg border font-mono text-lg font-bold transition-all",
          isCriticalTime 
            ? "bg-destructive/20 border-destructive text-destructive animate-pulse" 
            : isLowTime 
            ? "bg-amber-500/20 border-amber-500 text-amber-600 dark:text-amber-400 animate-pulse"
            : "bg-muted border-border text-foreground"
        )}>
          <Clock className={cn(
            "h-5 w-5",
            isCriticalTime ? "text-destructive" : isLowTime ? "text-amber-500" : "text-muted-foreground"
          )} />
          <span>{formatTime(timeRemaining)}</span>
          {isLowTime && (
            <span className="text-xs font-normal ml-2">
              {isCriticalTime ? 'Sắp hết giờ!' : 'Còn ít thời gian!'}
            </span>
          )}
        </div>
      )}

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Câu hỏi {currentIndex + 1} / {questions.length}</span>
          <span>
            {Object.keys(selectedAnswers).length + Object.keys(essayAnswers).filter(k => essayAnswers[k]?.trim()).length} câu đã trả lời
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-card rounded-xl border p-6">
        <div className="flex items-start gap-2 mb-4">
          <h4 className="font-display text-lg font-semibold text-foreground flex-1">
            <ContentWithLatex content={currentQuestion?.question || ''} />
          </h4>
          {currentQuestion?.question_type === 'essay' && (
            <span className="px-2 py-1 text-xs font-medium bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-md">
              Tự luận
            </span>
          )}
        </div>

        {/* Question Image */}
        {currentQuestion?.image_url && (
          <div className="mb-6 border rounded-lg overflow-hidden">
            <img 
              src={currentQuestion.image_url} 
              alt="Hình minh họa" 
              className="max-h-64 w-auto mx-auto object-contain"
            />
          </div>
        )}

        {/* Essay Question */}
        {currentQuestion?.question_type === 'essay' ? (
          <div className="space-y-2">
            <textarea
              className="w-full min-h-[150px] p-4 border rounded-lg resize-y bg-background text-foreground"
              placeholder="Nhập câu trả lời của bạn..."
              value={essayAnswers[currentQuestion.id] || ''}
              onChange={(e) => handleEssayChange(currentQuestion.id, e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Câu tự luận - Giáo viên sẽ chấm điểm sau khi bạn nộp bài
            </p>
          </div>
        ) : (
          /* Multiple Choice / True-False Options */
          <div className="space-y-3">
            {currentQuestion?.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelectAnswer(currentIndex, index)}
                className={cn(
                  "w-full text-left p-4 rounded-lg border-2 transition-all",
                  selectedAnswer === index
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                    selectedAnswer === index
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <ContentWithLatex content={option} className="flex-1" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Question Navigation Dots */}
      <div className="flex flex-wrap gap-2 justify-center">
        {questions.map((q, index) => {
          const isAnswered = q.question_type === 'essay' 
            ? essayAnswers[q.id]?.trim() 
            : selectedAnswers[q.id] !== undefined;
          const isEssay = q.question_type === 'essay';
          
          return (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "w-8 h-8 rounded-full text-xs font-medium transition-all",
                currentIndex === index
                  ? "bg-primary text-primary-foreground"
                  : isAnswered
                  ? isEssay 
                    ? "bg-amber-500/20 text-amber-600 border border-amber-500/30"
                    : "bg-chemical/20 text-chemical border border-chemical/30"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      {/* Navigation & Submit */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          Câu trước
        </Button>
        
        {currentIndex < questions.length - 1 ? (
          <Button onClick={handleNext} className="flex-1">
            Câu tiếp <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button 
            onClick={() => handleSubmit(false)} 
            disabled={!allAnswered || isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Đang nộp...' : 'Nộp bài'}
            <Send className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>

      {/* Submit Button Always Visible */}
      {allAnswered && currentIndex < questions.length - 1 && (
        <Button 
          onClick={() => handleSubmit(false)} 
          disabled={isSubmitting}
          variant="outline"
          className="w-full"
        >
          {isSubmitting ? 'Đang nộp...' : 'Nộp bài ngay'}
          <Send className="h-4 w-4 ml-2" />
        </Button>
      )}
    </div>
  );
}
