import { TypedLesson, isQuickLessonContent, isPracticeLessonContent } from '@/types/lesson';
import { QuickLessonRenderer } from './QuickLessonRenderer';
import { PracticeLessonRenderer } from './PracticeLessonRenderer';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface LessonRendererProps {
  lesson: TypedLesson;
  onComplete?: () => void;
  onSubmitEssay?: (essay: string) => void;
}

export function LessonRenderer({ lesson, onComplete, onSubmitEssay }: LessonRendererProps) {
  // If no structured content, show fallback message
  if (!lesson.structuredContent) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Bài học này chưa có nội dung cấu trúc. Vui lòng xem nội dung gốc bên trên.
        </AlertDescription>
      </Alert>
    );
  }

  // Use type guards to render appropriate component
  if (isQuickLessonContent(lesson.structuredContent)) {
    return (
      <QuickLessonRenderer
        content={lesson.structuredContent}
        onComplete={onComplete}
        lessonTitle={lesson.title}
        lessonId={lesson.id}
      />
    );
  }

  if (isPracticeLessonContent(lesson.structuredContent)) {
    return (
      <PracticeLessonRenderer
        content={lesson.structuredContent}
        onComplete={onComplete}
        onSubmitEssay={onSubmitEssay}
      />
    );
  }

  // Fallback for unknown content type
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Không thể hiển thị nội dung bài học. Loại nội dung không hợp lệ.
      </AlertDescription>
    </Alert>
  );
}

export { QuickLessonRenderer } from './QuickLessonRenderer';
export { PracticeLessonRenderer } from './PracticeLessonRenderer';
