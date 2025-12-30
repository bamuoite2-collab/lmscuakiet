import { useState, useEffect } from 'react';
import { QuickLessonContent } from '@/types/lesson';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Lightbulb, 
  Sparkles, 
  ChevronRight,
  Star,
  Trophy,
  Rocket,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Award
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LessonProgress {
  completed: boolean;
  stars: number;
  completedAt: string;
}

interface QuickLessonRendererProps {
  content: QuickLessonContent;
  onComplete?: () => void;
  lessonTitle?: string;
  lessonId?: string;
}

type GameStep = 'intro' | 'summary' | 'examples' | 'quiz' | 'result';

const getStorageKey = (lessonId: string) => `lesson-progress-${lessonId}`;

const loadProgress = (lessonId: string): LessonProgress | null => {
  try {
    const stored = localStorage.getItem(getStorageKey(lessonId));
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const saveProgress = (lessonId: string, stars: number) => {
  const progress: LessonProgress = {
    completed: true,
    stars,
    completedAt: new Date().toISOString()
  };
  localStorage.setItem(getStorageKey(lessonId), JSON.stringify(progress));
};

export function QuickLessonRenderer({ content, onComplete, lessonTitle = 'Bài học', lessonId }: QuickLessonRendererProps) {
  const [step, setStep] = useState<GameStep>('intro');
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [animationState, setAnimationState] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [previousProgress, setPreviousProgress] = useState<LessonProgress | null>(null);

  // Load previous progress on mount
  useEffect(() => {
    if (lessonId) {
      const saved = loadProgress(lessonId);
      if (saved) {
        setPreviousProgress(saved);
      }
    }
  }, [lessonId]);

  const hasExamples = content.examples.length > 0;
  const hasQuiz = content.quickQuiz.length > 0;

  // Calculate total steps for progress
  const getTotalSteps = () => {
    let total = 2; // intro + summary
    if (hasExamples) total += content.examples.length;
    if (hasQuiz) total += content.quickQuiz.length;
    return total;
  };

  const getCurrentStep = () => {
    if (step === 'intro') return 1;
    if (step === 'summary') return 2;
    if (step === 'examples') return 3 + currentExampleIndex;
    if (step === 'quiz') return 2 + (hasExamples ? content.examples.length : 0) + currentQuizIndex + 1;
    return getTotalSteps();
  };

  const progressPercent = (getCurrentStep() / getTotalSteps()) * 100;

  const currentQuestion = content.quickQuiz[currentQuizIndex];
  const currentExample = content.examples[currentExampleIndex];

  // Calculate stars based on score
  const getStars = () => {
    if (!hasQuiz) return 3;
    const percent = (correctCount / content.quickQuiz.length) * 100;
    if (percent >= 80) return 3;
    if (percent >= 50) return 2;
    if (percent > 0) return 1;
    return 0;
  };

  const getMotivationalMessage = () => {
    const stars = getStars();
    if (stars === 3) return { emoji: '🎉', text: 'Xuất sắc! Bạn thật tuyệt vời!' };
    if (stars === 2) return { emoji: '👏', text: 'Tốt lắm! Cố gắng thêm chút nữa nhé!' };
    if (stars === 1) return { emoji: '💪', text: 'Đừng bỏ cuộc! Thử lại để làm tốt hơn!' };
    return { emoji: '📚', text: 'Xem lại bài học và thử lại nhé!' };
  };

  const handleAnswerSelect = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;
    const isCorrect = selectedAnswer === currentQuestion.correctIndex;
    
    setAnimationState(isCorrect ? 'correct' : 'incorrect');
    setShowResult(true);
    
    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
    }

    setTimeout(() => setAnimationState('idle'), 600);
  };

  const handleNextQuiz = () => {
    if (currentQuizIndex < content.quickQuiz.length - 1) {
      setCurrentQuizIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Save progress when quiz completes
      const stars = getStars();
      if (lessonId) {
        // Only save if new score is better or first time
        const existing = loadProgress(lessonId);
        if (!existing || stars > existing.stars) {
          saveProgress(lessonId, stars);
          setPreviousProgress({ completed: true, stars, completedAt: new Date().toISOString() });
        }
      }
      setStep('result');
      onComplete?.();
    }
  };

  const handleRestart = () => {
    setStep('intro');
    setCurrentExampleIndex(0);
    setCurrentQuizIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setCorrectCount(0);
  };

  const handleStartLearning = () => {
    setPreviousProgress(null); // Hide completion banner
    setStep('intro');
  };

  const handleNextExample = () => {
    if (currentExampleIndex < content.examples.length - 1) {
      setCurrentExampleIndex((prev) => prev + 1);
    } else if (hasQuiz) {
      setStep('quiz');
    } else {
      setStep('result');
      onComplete?.();
    }
  };

  const goToNextFromSummary = () => {
    if (hasExamples) {
      setStep('examples');
    } else if (hasQuiz) {
      setStep('quiz');
    } else {
      setStep('result');
      onComplete?.();
    }
  };

  // Render stars helper
  const renderStars = (count: number) => (
    <div className="flex gap-1">
      {[1, 2, 3].map((i) => (
        <Star
          key={i}
          className={cn(
            "h-5 w-5",
            i <= count ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"
          )}
        />
      ))}
    </div>
  );

  // Show completion banner if already completed
  if (previousProgress && step === 'intro') {
    return (
      <div className="min-h-[70vh] flex flex-col bg-gradient-to-b from-background to-muted/20 rounded-3xl overflow-hidden border shadow-sm">
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-8 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
            <Award className="h-10 w-10 text-green-500" />
          </div>
          
          <h2 className="text-2xl font-bold mb-3">Bạn đã hoàn thành bài này!</h2>
          
          <div className="flex gap-2 mb-4">
            {[1, 2, 3].map((i) => (
              <Star
                key={i}
                className={cn(
                  "h-8 w-8",
                  i <= previousProgress.stars 
                    ? "fill-amber-400 text-amber-400" 
                    : "fill-muted text-muted"
                )}
              />
            ))}
          </div>
          
          <p className="text-muted-foreground mb-8">
            Hoàn thành lúc: {new Date(previousProgress.completedAt).toLocaleDateString('vi-VN')}
          </p>
          
          <Button 
            size="lg"
            className="h-14 px-8 text-lg font-bold rounded-2xl gap-2"
            onClick={handleStartLearning}
          >
            <RotateCcw className="h-5 w-5" />
            Học lại để cải thiện sao
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex flex-col bg-gradient-to-b from-background to-muted/20 rounded-3xl overflow-hidden border shadow-sm">
      {/* Progress Bar - Always visible except intro */}
      {step !== 'intro' && (
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center gap-3">
            <Progress value={progressPercent} className="h-3 flex-1" />
            <span className="text-sm font-bold text-primary min-w-[3rem] text-right">
              {Math.round(progressPercent)}%
            </span>
          </div>
        </div>
      )}

      {/* Game Screen Container */}
      <div className="flex-1 flex flex-col">
        
        {/* INTRO SCREEN */}
        {step === 'intro' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-8 animate-fade-in">
            <div className="relative mb-8">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center animate-scale-in shadow-lg">
                <Rocket className="h-14 w-14 text-primary-foreground" />
              </div>
              <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center animate-bounce shadow">
                <Sparkles className="h-5 w-5 text-amber-900" />
              </div>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold mb-3">{lessonTitle}</h1>
            <p className="text-muted-foreground text-lg mb-2">Sẵn sàng học chưa? 🚀</p>
            
            {/* Lesson stats */}
            <div className="flex gap-4 mt-6 mb-8">
              {hasExamples && (
                <div className="flex items-center gap-2 text-sm bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-2 rounded-full">
                  <Lightbulb className="h-4 w-4" />
                  <span>{content.examples.length} ví dụ</span>
                </div>
              )}
              {hasQuiz && (
                <div className="flex items-center gap-2 text-sm bg-primary/10 text-primary px-3 py-2 rounded-full">
                  <Sparkles className="h-4 w-4" />
                  <span>{content.quickQuiz.length} câu hỏi</span>
                </div>
              )}
            </div>
            
            <Button 
              size="lg"
              className="h-16 px-12 text-xl font-bold rounded-2xl gap-3 shadow-lg hover:scale-105 transition-transform"
              onClick={() => setStep('summary')}
            >
              Bắt đầu
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        )}

        {/* SUMMARY SCREEN */}
        {step === 'summary' && (
          <div className="flex-1 flex flex-col animate-fade-in">
            <div className="flex-1 px-5 py-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Bước 1</p>
                  <h2 className="text-xl font-bold">Tóm tắt bài học</h2>
                </div>
              </div>

              <div className="bg-card rounded-3xl p-6 border-2 border-border/50 shadow-sm">
                <p className="text-lg leading-relaxed text-foreground">
                  {content.summary}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                Đọc kỹ trước khi tiếp tục nhé!
              </div>
            </div>

            <div className="p-4 border-t bg-background/80 backdrop-blur-sm">
              <Button 
                className="w-full h-14 text-lg font-bold rounded-2xl gap-2"
                onClick={goToNextFromSummary}
              >
                Đã hiểu, tiếp tục
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {/* EXAMPLES SCREEN */}
        {step === 'examples' && currentExample && (
          <div className="flex-1 flex flex-col animate-fade-in">
            <div className="flex-1 px-5 py-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                    <Lightbulb className="h-7 w-7 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ví dụ</p>
                    <h2 className="text-xl font-bold">{currentExample.title}</h2>
                  </div>
                </div>
                
                {/* Example counter */}
                <div className="flex gap-1.5">
                  {content.examples.map((_, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "w-3 h-3 rounded-full transition-all",
                        i <= currentExampleIndex ? "bg-amber-500" : "bg-muted"
                      )}
                    />
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-3xl p-6 border-2 border-amber-200/50 dark:border-amber-900/50 shadow-sm">
                <p className="text-lg leading-relaxed">{currentExample.content}</p>
                {currentExample.imageUrl && (
                  <img
                    src={currentExample.imageUrl}
                    alt={currentExample.title}
                    className="mt-4 rounded-2xl max-w-full h-auto border"
                  />
                )}
              </div>
            </div>

            <div className="p-4 border-t bg-background/80 backdrop-blur-sm">
              <Button 
                className="w-full h-14 text-lg font-bold rounded-2xl gap-2"
                onClick={handleNextExample}
              >
                {currentExampleIndex < content.examples.length - 1 ? 'Tiếp theo' : 'Bắt đầu Quiz'}
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {/* QUIZ SCREEN */}
        {step === 'quiz' && currentQuestion && (
          <div 
            className={cn(
              "flex-1 flex flex-col transition-colors duration-300",
              animationState === 'correct' && "bg-green-500/10",
              animationState === 'incorrect' && "bg-red-500/10"
            )}
          >
            <div className="flex-1 px-5 py-6">
              {/* Quiz Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-all",
                    animationState === 'correct' && "bg-green-500/20 scale-110",
                    animationState === 'incorrect' && "bg-red-500/20 animate-shake",
                    animationState === 'idle' && "bg-primary/10"
                  )}>
                    <Sparkles className={cn(
                      "h-7 w-7 transition-colors",
                      animationState === 'correct' && "text-green-500",
                      animationState === 'incorrect' && "text-red-500",
                      animationState === 'idle' && "text-primary"
                    )} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Câu hỏi</p>
                    <p className="text-xl font-bold">{currentQuizIndex + 1} / {content.quickQuiz.length}</p>
                  </div>
                </div>
                
                {/* Score indicator */}
                <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-bold">
                  <Star className="h-4 w-4 fill-current" />
                  {correctCount}
                </div>
              </div>

              {/* Question */}
              <div className="bg-card rounded-3xl p-5 border-2 border-border/50 mb-5 shadow-sm">
                <p className="text-lg md:text-xl font-semibold leading-relaxed">
                  {currentQuestion.question}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = index === currentQuestion.correctIndex;
                  const letter = String.fromCharCode(65 + index);
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showResult}
                      className={cn(
                        "w-full p-4 rounded-2xl border-2 text-left transition-all duration-200",
                        "flex items-center gap-4 min-h-[4rem]",
                        "active:scale-[0.98]",
                        // Default state
                        !showResult && !isSelected && "border-border bg-card hover:border-primary/50 hover:bg-primary/5",
                        // Selected but not checked
                        !showResult && isSelected && "border-primary bg-primary/10 shadow-md",
                        // Showing results - correct
                        showResult && isCorrect && "border-green-500 bg-green-500/10",
                        // Showing results - selected wrong
                        showResult && isSelected && !isCorrect && "border-red-500 bg-red-500/10",
                        // Showing results - other options
                        showResult && !isCorrect && !isSelected && "opacity-40"
                      )}
                    >
                      <span className={cn(
                        "w-11 h-11 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 transition-all",
                        !showResult && !isSelected && "bg-muted text-muted-foreground",
                        !showResult && isSelected && "bg-primary text-primary-foreground",
                        showResult && isCorrect && "bg-green-500 text-white",
                        showResult && isSelected && !isCorrect && "bg-red-500 text-white"
                      )}>
                        {letter}
                      </span>
                      <span className="text-base md:text-lg flex-1">{option}</span>
                      
                      {showResult && isCorrect && (
                        <CheckCircle2 className="h-7 w-7 text-green-500 shrink-0 animate-scale-in" />
                      )}
                      {showResult && isSelected && !isCorrect && (
                        <XCircle className="h-7 w-7 text-red-500 shrink-0 animate-scale-in" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {showResult && currentQuestion.explanation && (
                <div className="mt-5 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 animate-fade-in">
                  <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Giải thích
                  </p>
                  <p className="text-muted-foreground">{currentQuestion.explanation}</p>
                </div>
              )}
            </div>

            {/* Quiz Actions */}
            <div className="p-4 border-t bg-background/80 backdrop-blur-sm">
              {!showResult ? (
                <Button 
                  className="w-full h-14 text-lg font-bold rounded-2xl"
                  onClick={handleCheckAnswer}
                  disabled={selectedAnswer === null}
                >
                  Kiểm tra
                </Button>
              ) : (
                <Button 
                  className={cn(
                    "w-full h-14 text-lg font-bold rounded-2xl gap-2 transition-colors",
                    animationState === 'correct' && "bg-green-500 hover:bg-green-600"
                  )}
                  onClick={handleNextQuiz}
                >
                  {currentQuizIndex < content.quickQuiz.length - 1 ? (
                    <>
                      Tiếp tục
                      <ChevronRight className="h-5 w-5" />
                    </>
                  ) : (
                    <>
                      Xem kết quả
                      <Trophy className="h-5 w-5" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        )}

        {/* RESULT SCREEN */}
        {step === 'result' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-8 animate-fade-in">
            {/* Trophy */}
            <div className="relative mb-6">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 flex items-center justify-center shadow-xl animate-scale-in">
                <Trophy className="h-14 w-14 text-white" />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold shadow">
                Hoàn thành!
              </div>
            </div>
            
            {hasQuiz ? (
              <>
                {/* Score */}
                <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  {correctCount}/{content.quickQuiz.length}
                </div>
                <p className="text-muted-foreground mb-6">câu trả lời đúng</p>

                {/* Stars */}
                <div className="flex gap-3 mb-6">
                  {[1, 2, 3].map((starNum) => (
                    <div
                      key={starNum}
                      className="animate-scale-in"
                      style={{ animationDelay: `${starNum * 200}ms` }}
                    >
                      <Star 
                        className={cn(
                          "h-14 w-14 transition-all",
                          starNum <= getStars() 
                            ? "fill-amber-400 text-amber-400 drop-shadow-lg" 
                            : "fill-muted text-muted"
                        )} 
                      />
                    </div>
                  ))}
                </div>

                {/* Motivational Message */}
                <div className="bg-card rounded-2xl p-5 border mb-8 max-w-sm">
                  <span className="text-4xl mb-2 block">{getMotivationalMessage().emoji}</span>
                  <p className="text-lg font-medium">{getMotivationalMessage().text}</p>
                </div>
              </>
            ) : (
              <div className="mb-8">
                <span className="text-6xl block mb-4">🎉</span>
                <p className="text-xl font-medium">Bạn đã hoàn thành bài học!</p>
              </div>
            )}

            {/* Restart Button */}
            <Button 
              variant="outline" 
              size="lg"
              className="h-14 px-8 text-lg font-bold rounded-2xl gap-2"
              onClick={handleRestart}
            >
              <RotateCcw className="h-5 w-5" />
              Học lại
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
