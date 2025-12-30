import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Sparkles, Loader2, Check, AlertCircle, Upload, Image, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentWithLatex } from "@/components/KaTeXRenderer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ParsedQuestion {
  question: string;
  question_type: "multiple_choice" | "true_false" | "essay";
  options: string[];
  correct_answer: number;
  explanation: string | null;
}

interface AIQuizImporterProps {
  quizId: string;
  onImportComplete?: () => void;
}

export function AIQuizImporter({ quizId, onImportComplete }: AIQuizImporterProps) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const [parsedQuestions, setParsedQuestions] = useState<ParsedQuestion[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<Set<number>>(new Set());
  const [step, setStep] = useState<"input" | "review" | "importing">("input");
  const [inputMode, setInputMode] = useState<"text" | "image">("text");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse text with AI
  const parseText = useMutation({
    mutationFn: async (inputText: string) => {
      const { data, error } = await supabase.functions.invoke("parse-quiz-text", {
        body: { text: inputText },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);
      return data.questions as ParsedQuestion[];
    },
    onSuccess: (questions) => {
      setParsedQuestions(questions);
      setSelectedQuestions(new Set(questions.map((_, i) => i)));
      setStep("review");
      toast.success(`Đã phân tích được ${questions.length} câu hỏi!`);
    },
    onError: (error) => {
      console.error("Parse error:", error);
      toast.error(error instanceof Error ? error.message : "Không thể phân tích văn bản");
    },
  });

  // Parse image with AI (OCR)
  const parseImage = useMutation({
    mutationFn: async (file: File) => {
      // Convert file to base64
      const base64 = await fileToBase64(file);

      const { data, error } = await supabase.functions.invoke("parse-quiz-text", {
        body: {
          imageBase64: base64,
          mimeType: file.type,
        },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);
      return data.questions as ParsedQuestion[];
    },
    onSuccess: (questions) => {
      setParsedQuestions(questions);
      setSelectedQuestions(new Set(questions.map((_, i) => i)));
      setStep("review");
      toast.success(`Đã OCR và phân tích được ${questions.length} câu hỏi!`);
    },
    onError: (error) => {
      console.error("Parse image error:", error);
      toast.error(error instanceof Error ? error.message : "Không thể phân tích ảnh");
    },
  });

  // Import selected questions to database
  const importQuestions = useMutation({
    mutationFn: async () => {
      const questionsToImport = parsedQuestions.filter((_, i) => selectedQuestions.has(i));

      // Get current max order_index
      const { data: existingQuestions } = await supabase
        .from("quiz_questions")
        .select("order_index")
        .eq("quiz_id", quizId)
        .order("order_index", { ascending: false })
        .limit(1);

      let startIndex = (existingQuestions?.[0]?.order_index || 0) + 1;

      // Insert questions
      const { error } = await supabase.from("quiz_questions").insert(
        questionsToImport.map((q, i) => ({
          quiz_id: quizId,
          question: q.question,
          question_type: q.question_type,
          options: q.options,
          correct_answer: q.correct_answer >= 0 ? q.correct_answer : 0,
          explanation: q.explanation,
          order_index: startIndex + i,
        })),
      );

      if (error) throw error;
      return questionsToImport.length;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ["admin-questions"] });
      toast.success(`Đã nhập ${count} câu hỏi thành công!`);
      handleClose();
      onImportComplete?.();
    },
    onError: (error) => {
      console.error("Import error:", error);
      toast.error("Không thể nhập câu hỏi vào database");
    },
  });

  const handleClose = () => {
    setIsOpen(false);
    setText("");
    setParsedQuestions([]);
    setSelectedQuestions(new Set());
    setStep("input");
    setSelectedFile(null);
    setFilePreview(null);
  };

  const toggleQuestion = (index: number) => {
    const newSet = new Set(selectedQuestions);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    setSelectedQuestions(newSet);
  };

  const selectAll = () => {
    setSelectedQuestions(new Set(parsedQuestions.map((_, i) => i)));
  };

  const deselectAll = () => {
    setSelectedQuestions(new Set());
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Chỉ hỗ trợ file JPG, PNG, WEBP hoặc PDF");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File quá lớn. Kích thước tối đa là 10MB");
      return;
    }

    setSelectedFile(file);

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getQuestionTypeBadge = (type: string) => {
    switch (type) {
      case "multiple_choice":
        return <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Trắc nghiệm</span>;
      case "true_false":
        return <span className="text-xs bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded">Đúng/Sai</span>;
      case "essay":
        return <span className="text-xs bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded">Tự luận</span>;
      default:
        return null;
    }
  };

  const isParsing = parseText.isPending || parseImage.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Sparkles className="h-4 w-4" />
          Nhập nhanh bằng AI
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Soạn đề thông minh với AI
          </DialogTitle>
        </DialogHeader>

        {step === "input" && (
          <div className="space-y-4">
            <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as "text" | "image")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="text" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Nhập văn bản
                </TabsTrigger>
                <TabsTrigger value="image" className="gap-2">
                  <Image className="h-4 w-4" />
                  Tải ảnh/PDF
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="space-y-4 mt-4">
                <div>
                  <Label>Dán nội dung đề thi/bài tập vào đây</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Copy từ file Word/PDF và dán vào. AI sẽ tự động phân tích và tách câu hỏi. Các công thức LaTeX như
                    $\ce{"{H2SO4}"}$ sẽ được giữ nguyên.
                  </p>
                  <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={`Ví dụ:
Câu 1: Cho phản ứng: $\\ce{2Al + 6HCl -> 2AlCl3 + 3H2}$. Số mol H2 sinh ra khi cho 5,4g Al phản ứng hoàn toàn là:
A. 0,1 mol
B. 0,2 mol
C. 0,3 mol
D. 0,4 mol
Đáp án: C
Giải thích: n(Al) = 5,4/27 = 0,2 mol. Theo PTHH: n(H2) = 3/2 × n(Al) = 0,3 mol

Câu 2: Đúng hay sai: Kim loại Na có thể đẩy được Cu ra khỏi dung dịch CuSO4.
Đáp án: Sai
...`}
                    rows={12}
                    className="font-mono text-sm"
                  />
                </div>
              </TabsContent>

              <TabsContent value="image" className="space-y-4 mt-4">
                <div>
                  <Label>Tải lên ảnh hoặc PDF đề thi</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Hỗ trợ JPG, PNG, WEBP, PDF. AI sẽ OCR và nhận diện công thức hóa học tự động. Chuyển đổi sang định
                    dạng LaTeX chuẩn với <code className="bg-muted px-1 rounded">\ce{"{}"}</code>.
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {!selectedFile ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"
                    >
                      <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                      <p className="text-sm font-medium">Nhấp để chọn file hoặc kéo thả vào đây</p>
                      <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP hoặc PDF (tối đa 10MB)</p>
                    </div>
                  ) : (
                    <div className="border rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        {filePreview ? (
                          <img src={filePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg border" />
                        ) : (
                          <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center">
                            <FileText className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{selectedFile.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFile}
                            className="mt-2 text-destructive hover:text-destructive"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Xóa file
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClose}>
                Hủy
              </Button>
              {inputMode === "text" ? (
                <Button
                  onClick={() => {
                    if (!isParsing) {
                      parseText.mutate(text);
                    }
                  }}
                  disabled={!text.trim() || isParsing}
                  className="gap-2"
                >
                  {parseText.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang phân tích...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Phân tích với AI
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={() => selectedFile && parseImage.mutate(selectedFile)}
                  disabled={!selectedFile || isParsing}
                  className="gap-2"
                >
                  {parseImage.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang OCR & phân tích...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      OCR & Phân tích
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        )}

        {step === "review" && (
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                Đã tìm thấy <span className="font-medium text-foreground">{parsedQuestions.length}</span> câu hỏi. Đã
                chọn <span className="font-medium text-primary">{selectedQuestions.size}</span> câu.
              </p>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={selectAll}>
                  Chọn tất cả
                </Button>
                <Button variant="ghost" size="sm" onClick={deselectAll}>
                  Bỏ chọn tất cả
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-3">
                {parsedQuestions.map((q, index) => (
                  <div
                    key={index}
                    onClick={() => toggleQuestion(index)}
                    className={cn(
                      "p-4 border rounded-lg cursor-pointer transition-all",
                      selectedQuestions.has(index)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                          selectedQuestions.has(index) ? "border-primary bg-primary" : "border-muted-foreground",
                        )}
                      >
                        {selectedQuestions.has(index) && <Check className="h-4 w-4 text-primary-foreground" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium">Câu {index + 1}</span>
                          {getQuestionTypeBadge(q.question_type)}
                        </div>
                        <ContentWithLatex content={q.question} className="text-sm" />
                        {q.options.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {q.options.map((opt, i) => (
                              <div
                                key={i}
                                className={cn(
                                  "text-xs px-2 py-1 rounded",
                                  i === q.correct_answer
                                    ? "bg-chemical/10 text-chemical font-medium"
                                    : "text-muted-foreground",
                                )}
                              >
                                <ContentWithLatex content={opt} />
                              </div>
                            ))}
                          </div>
                        )}
                        {q.explanation && (
                          <div className="mt-3 p-2 bg-muted/50 rounded text-xs">
                            <span className="font-medium text-muted-foreground">Giải thích: </span>
                            <ContentWithLatex content={q.explanation} />
                          </div>
                        )}
                        {q.correct_answer < 0 && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-amber-600">
                            <AlertCircle className="h-3 w-3" />
                            Chưa xác định đáp án
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="flex justify-between mt-4 pt-4 border-t">
              <Button variant="outline" onClick={() => setStep("input")}>
                ← Quay lại
              </Button>
              <Button
                onClick={() => importQuestions.mutate()}
                disabled={selectedQuestions.size === 0 || importQuestions.isPending}
                className="gap-2"
              >
                {importQuestions.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang nhập...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Nhập {selectedQuestions.size} câu hỏi
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Helper function to convert file to base64
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // Remove the data URL prefix (e.g., "data:image/png;base64,")
      const base64 = (reader.result as string).split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
