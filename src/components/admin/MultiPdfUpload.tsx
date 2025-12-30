import { useState, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { FileText, Upload, X, Loader2, GripVertical } from 'lucide-react';
import { toast } from 'sonner';

interface FileItem {
  id: string;
  file_url: string;
  file_name: string;
  order_index: number;
}

interface MultiPdfUploadProps {
  entityId: string;
  entityType: 'lesson' | 'quiz';
  maxFiles?: number;
}

export function MultiPdfUpload({ entityId, entityType, maxFiles = 10 }: MultiPdfUploadProps) {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tableName = entityType === 'lesson' ? 'lesson_files' : 'quiz_files';

  const { data: files = [], isLoading } = useQuery({
    queryKey: [tableName, entityId],
    queryFn: async () => {
      if (entityType === 'lesson') {
        const { data, error } = await supabase
          .from('lesson_files')
          .select('*')
          .eq('lesson_id', entityId)
          .order('order_index');
        if (error) throw error;
        return data as FileItem[];
      } else {
        const { data, error } = await supabase
          .from('quiz_files')
          .select('*')
          .eq('quiz_id', entityId)
          .order('order_index');
        if (error) throw error;
        return data as FileItem[];
      }
    },
    enabled: !!entityId,
  });

  const uploadFile = useMutation({
    mutationFn: async (file: File) => {
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
      
      const { error: uploadError } = await supabase.storage
        .from('lesson-files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('lesson-files')
        .getPublicUrl(fileName);

      const newOrderIndex = files.length;

      if (entityType === 'lesson') {
        const { error: insertError } = await supabase
          .from('lesson_files')
          .insert({
            lesson_id: entityId,
            file_url: publicUrl,
            file_name: file.name,
            order_index: newOrderIndex,
          });
        if (insertError) throw insertError;
      } else {
        const { error: insertError } = await supabase
          .from('quiz_files')
          .insert({
            quiz_id: entityId,
            file_url: publicUrl,
            file_name: file.name,
            order_index: newOrderIndex,
          });
        if (insertError) throw insertError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tableName, entityId] });
      toast.success('Tải file thành công!');
    },
    onError: (error) => {
      console.error('Upload error:', error);
      toast.error('Không thể tải file lên');
    },
  });

  const deleteFile = useMutation({
    mutationFn: async (fileId: string) => {
      if (entityType === 'lesson') {
        const { error } = await supabase
          .from('lesson_files')
          .delete()
          .eq('id', fileId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('quiz_files')
          .delete()
          .eq('id', fileId);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tableName, entityId] });
      toast.success('Đã xóa file!');
    },
    onError: () => {
      toast.error('Không thể xóa file');
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    if (selectedFiles.length === 0) return;

    // Filter only PDF files
    const pdfFiles = selectedFiles.filter(f => f.type === 'application/pdf');
    
    if (pdfFiles.length !== selectedFiles.length) {
      toast.error('Chỉ chấp nhận file PDF');
    }

    if (pdfFiles.length === 0) return;

    // Check max files limit
    const remainingSlots = maxFiles - files.length;
    if (pdfFiles.length > remainingSlots) {
      toast.error(`Chỉ có thể thêm tối đa ${remainingSlots} file nữa`);
      pdfFiles.splice(remainingSlots);
    }

    setUploading(true);
    
    for (const file of pdfFiles) {
      try {
        await uploadFile.mutateAsync(file);
      } catch (error) {
        // Error already handled in mutation
      }
    }
    
    setUploading(false);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 p-4 bg-muted/30 rounded-lg">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">Đang tải...</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {files.length} / {maxFiles} file
        </span>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || files.length >= maxFiles}
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Đang tải...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Tải PDF
            </>
          )}
        </Button>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={file.id}
              className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg border"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
              <FileText className="h-5 w-5 text-primary shrink-0" />
              <span className="text-sm flex-1 truncate">{file.file_name}</span>
              <span className="text-xs text-muted-foreground">#{index + 1}</span>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => deleteFile.mutate(file.id)}
                disabled={deleteFile.isPending}
              >
                <X className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {files.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-2">
          Chưa có file PDF nào. Bạn có thể tải lên tối đa {maxFiles} file.
        </p>
      )}
    </div>
  );
}
