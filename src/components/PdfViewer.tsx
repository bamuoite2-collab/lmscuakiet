import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { FileText, Download, Loader2, X, Eye, Maximize2, Minimize2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface LessonFile {
  id: string;
  file_url: string;
  file_name: string;
  order_index: number;
}

// Helper to extract file path from full URL
const extractFilePath = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/storage/v1/object/public/lesson-files/');
    if (pathParts.length > 1) {
      return pathParts[1];
    }
    const signedParts = urlObj.pathname.split('/storage/v1/object/sign/lesson-files/');
    if (signedParts.length > 1) {
      return signedParts[1].split('?')[0];
    }
    return null;
  } catch {
    return url;
  }
};

function PdfFileCard({ file, onView }: { file: LessonFile; onView: () => void }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const filePath = extractFilePath(file.file_url);
      if (!filePath) {
        toast.error('Không thể tải tài liệu');
        return;
      }

      const { data, error } = await supabase.storage
        .from('lesson-files')
        .download(filePath);

      if (error) {
        console.error('Error downloading file:', error);
        toast.error('Bạn cần đăng nhập để tải tài liệu');
        return;
      }

      const blobUrl = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = file.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
      toast.success('Đang tải tài liệu...');
    } catch (err) {
      console.error('Error downloading PDF:', err);
      toast.error('Đã xảy ra lỗi khi tải tài liệu');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
      <FileText className="h-8 w-8 text-primary shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{file.file_name}</p>
        <p className="text-xs text-muted-foreground">PDF Document</p>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={onView}>
          <Eye className="h-4 w-4 mr-1" />
          Xem
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleDownload}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}

function InlinePdfViewer({ file, onClose }: { file: LessonFile; onClose: () => void }) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const loadPdf = async () => {
      setIsLoading(true);
      setLoadError(false);
      try {
        const filePath = extractFilePath(file.file_url);
        if (!filePath) {
          setLoadError(true);
          return;
        }

        // Use public URL since bucket is now public
        const { data } = supabase.storage
          .from('lesson-files')
          .getPublicUrl(filePath);

        if (data?.publicUrl) {
          setPdfUrl(data.publicUrl);
        } else {
          setLoadError(true);
        }
      } catch (err) {
        console.error('Error loading PDF:', err);
        setLoadError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadPdf();
  }, [file]);

  const handleDownloadFallback = async () => {
    setIsDownloading(true);
    try {
      const filePath = extractFilePath(file.file_url);
      if (!filePath) {
        toast.error('Không thể tải tài liệu');
        return;
      }

      const { data } = supabase.storage
        .from('lesson-files')
        .getPublicUrl(filePath);

      if (data?.publicUrl) {
        const link = document.createElement('a');
        link.href = data.publicUrl;
        link.download = file.file_name;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Đang tải tài liệu...');
      } else {
        toast.error('Không thể tải tài liệu');
      }
    } catch (err) {
      console.error('Error downloading PDF:', err);
      toast.error('Đã xảy ra lỗi khi tải tài liệu');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className={cn(
      "bg-card border rounded-xl overflow-hidden",
      isFullscreen && "fixed inset-4 z-50"
    )}>
      <div className="flex items-center justify-between p-3 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <span className="font-medium text-sm truncate">{file.file_name}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
          <Button size="icon" variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className={cn(
        "relative",
        isFullscreen ? "h-[calc(100%-52px)]" : "h-[600px]"
      )}>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : pdfUrl && !loadError ? (
          <iframe
            src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
            className="w-full h-full"
            title={file.file_name}
            onError={() => setLoadError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/20 gap-4">
            <p className="text-muted-foreground text-center px-4">
              Trình duyệt không thể hiển thị tài liệu. Vui lòng tải về để xem.
            </p>
            <Button 
              onClick={handleDownloadFallback}
              disabled={isDownloading}
              className="gap-2"
            >
              {isDownloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Tải xuống tài liệu
            </Button>
          </div>
        )}
      </div>
      {/* Always show download button as fallback */}
      {pdfUrl && !loadError && (
        <div className="p-3 border-t bg-muted/20 flex justify-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDownloadFallback}
            disabled={isDownloading}
            className="gap-2"
          >
            {isDownloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Tải xuống tài liệu
          </Button>
        </div>
      )}
    </div>
  );
}

interface PdfViewerProps {
  lessonId: string;
  legacyPdfUrl?: string | null;
}

export function PdfViewer({ lessonId, legacyPdfUrl }: PdfViewerProps) {
  const [files, setFiles] = useState<LessonFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingFile, setViewingFile] = useState<LessonFile | null>(null);

  useEffect(() => {
    const loadFiles = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('lesson_files')
          .select('*')
          .eq('lesson_id', lessonId)
          .order('order_index');

        if (error) throw error;

        // Combine with legacy pdf_url if exists and no files in new table
        const lessonFiles = (data || []) as LessonFile[];
        
        if (lessonFiles.length === 0 && legacyPdfUrl) {
          // Use legacy pdf_url
          const fileName = legacyPdfUrl.split('/').pop() || 'document.pdf';
          lessonFiles.push({
            id: 'legacy',
            file_url: legacyPdfUrl,
            file_name: fileName,
            order_index: 0,
          });
        }

        setFiles(lessonFiles);
      } catch (err) {
        console.error('Error loading files:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadFiles();
  }, [lessonId, legacyPdfUrl]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 p-4 bg-muted/30 rounded-lg">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">Đang tải tài liệu...</span>
      </div>
    );
  }

  if (files.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold flex items-center gap-2">
        <FileText className="h-5 w-5 text-primary" />
        Tài liệu PDF ({files.length})
      </h3>

      {/* File list */}
      <div className="grid gap-2">
        {files.map((file) => (
          <PdfFileCard
            key={file.id}
            file={file}
            onView={() => setViewingFile(file)}
          />
        ))}
      </div>

      {/* Inline viewer */}
      {viewingFile && (
        <InlinePdfViewer
          file={viewingFile}
          onClose={() => setViewingFile(null)}
        />
      )}
    </div>
  );
}

// Quiz PDF Viewer component
interface QuizPdfViewerProps {
  quizId: string;
}

export function QuizPdfViewer({ quizId }: QuizPdfViewerProps) {
  const [files, setFiles] = useState<LessonFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingFile, setViewingFile] = useState<LessonFile | null>(null);

  useEffect(() => {
    const loadFiles = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('quiz_files')
          .select('*')
          .eq('quiz_id', quizId)
          .order('order_index');

        if (error) throw error;
        setFiles((data || []) as LessonFile[]);
      } catch (err) {
        console.error('Error loading quiz files:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadFiles();
  }, [quizId]);

  if (isLoading || files.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 mb-4">
      <p className="text-sm font-medium text-muted-foreground">Tài liệu tham khảo:</p>
      <div className="grid gap-2">
        {files.map((file) => (
          <PdfFileCard
            key={file.id}
            file={file}
            onView={() => setViewingFile(file)}
          />
        ))}
      </div>

      {viewingFile && (
        <Dialog open={!!viewingFile} onOpenChange={() => setViewingFile(null)}>
          <DialogContent className="max-w-4xl h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {viewingFile.file_name}
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 h-full min-h-0">
              <InlinePdfViewer file={viewingFile} onClose={() => setViewingFile(null)} />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
